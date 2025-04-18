import dotenv from 'dotenv';
import { createApp } from './app';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory.product.repository';
import { Eureka } from 'eureka-js-client';

dotenv.config();

const PORT = process.env.PORT || 3001;
const EUREKA_HOST = process.env.EUREKA_HOST || 'eureka-server';
const EUREKA_PORT = process.env.EUREKA_PORT || 8761;
const APP_HOST = process.env.APP_HOST || 'catalogue';

// Eureka client configuration
const eurekaClient = new Eureka({
  instance: {
    app: 'catalogue-service',
    hostName: APP_HOST,
    ipAddr: APP_HOST,
    port: {
      '$': parseInt(PORT.toString()),
      '@enabled': true,
    },
    vipAddress: 'catalogue-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: EUREKA_HOST,
    port: parseInt(EUREKA_PORT.toString()),
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

const productRepository = new InMemoryProductRepository();

const app = createApp(productRepository);

const server = app.listen(PORT, () => {
  console.log(`Catalogue service is running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /products            - Create a new product');
  console.log('  GET    /products            - Get all products (with optional filters)');
  console.log('  GET    /products/:id        - Get a specific product');
  console.log('  PUT    /products/:id        - Update a product');
  console.log('  DELETE /products/:id        - Delete a product');
  console.log('  PATCH  /products/:id/stock  - Update product stock');
  console.log('  POST   /products/check-availability - Check products availability');
  console.log('  POST   /products/batch      - Get multiple products by IDs');
  
  // Register with Eureka after server starts
  eurekaClient.start((error?: Error) => {
    console.log(error || 'Catalogue service registered with Eureka');
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
