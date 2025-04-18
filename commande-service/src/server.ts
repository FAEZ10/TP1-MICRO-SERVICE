import { createApp } from './app';
import { Eureka } from 'eureka-js-client';

const PORT = process.env.PORT || 3002;
const EUREKA_HOST = process.env.EUREKA_HOST || 'eureka-server';
const EUREKA_PORT = process.env.EUREKA_PORT || 8761;
const APP_HOST = process.env.APP_HOST || 'commande';
const CATALOGUE_SERVICE_URL = process.env.CATALOGUE_SERVICE_URL || 'http://catalogue:3001';

const eurekaClient = new Eureka({
  instance: {
    app: 'commande-service',
    hostName: APP_HOST,
    ipAddr: APP_HOST,
    port: {
      '$': parseInt(PORT.toString()),
      '@enabled': true,
    },
    vipAddress: 'commande-service',
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

const app = createApp(eurekaClient);

const server = app.listen(PORT, () => {
    console.log(`Commande service listening at http://localhost:${PORT}`);
    console.log(`Connected to catalogue service at ${CATALOGUE_SERVICE_URL}`);
    console.log(`Service discovery enabled with Eureka at ${EUREKA_HOST}:${EUREKA_PORT}`);
    
    eurekaClient.start((error?: Error) => {
        console.log(error || 'Commande service registered with Eureka');
    });
});

process.on('SIGINT', () => {
    eurekaClient.stop();
    process.exit();
});
