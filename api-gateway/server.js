const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Eureka } = require('eureka-js-client');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Eureka client configuration
const eurekaClient = new Eureka({
  instance: {
    app: 'api-gateway',
    hostName: 'api-gateway',
    ipAddr: 'api-gateway',
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'api-gateway',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'eureka-server',
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
  },
});

// Start Eureka client
eurekaClient.start(error => {
  console.log(error || 'Eureka client started');
});

// Function to get service URL from Eureka
const getServiceUrl = (serviceName) => {
  try {
    const instances = eurekaClient.getInstancesByAppId(serviceName);
    if (instances && instances.length > 0) {
      const instance = instances[0];
      return `http://${instance.hostName}:${instance.port.$}`;
    }
  } catch (error) {
    console.error(`Error getting service URL for ${serviceName}:`, error);
  }
  
  // Fallback to direct service URLs if Eureka lookup fails
  if (serviceName === 'catalogue-service') {
    return 'http://catalogue:3001';
  } else if (serviceName === 'commande-service') {
    return 'http://commande:3002';
  }
  
  throw new Error(`Service ${serviceName} not found`);
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway is running',
    services: [
      '/api/products - Catalogue Service',
      '/api/orders - Order Service'
    ]
  });
});

// Create proxy middleware for Catalogue Service
const catalogueProxy = createProxyMiddleware({
  target: 'http://catalogue:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/products'
  }
});

// Create proxy middleware for Order Service
const orderProxy = createProxyMiddleware({
  target: 'http://commande:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/orders'
  }
});

// Use the proxy middleware
app.use('/api/products', catalogueProxy);
app.use('/api/orders', orderProxy);

// Add error handling for proxy requests
app.use((err, req, res, next) => {
  console.error('Proxy Error:', err);
  if (req.url.startsWith('/api/products')) {
    console.error('Catalogue service error:', err.message);
    res.status(503).send('Catalogue service unavailable');
  } else if (req.url.startsWith('/api/orders')) {
    console.error('Order service error:', err.message);
    res.status(503).send('Order service unavailable');
  } else {
    res.status(500).send('Something went wrong');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  eurekaClient.stop();
  process.exit();
});
