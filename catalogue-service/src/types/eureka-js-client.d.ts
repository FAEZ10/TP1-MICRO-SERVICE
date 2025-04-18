declare module 'eureka-js-client' {
  export interface EurekaInstanceConfig {
    app: string;
    hostName: string;
    ipAddr: string;
    port: {
      '$': number;
      '@enabled': boolean;
    };
    vipAddress: string;
    dataCenterInfo: {
      '@class': string;
      name: string;
    };
    registerWithEureka?: boolean;
    fetchRegistry?: boolean;
    statusPageUrl?: string;
    healthCheckUrl?: string;
    homePageUrl?: string;
  }

  export interface EurekaClientConfig {
    host?: string;
    port?: number;
    servicePath?: string;
    maxRetries?: number;
    requestRetryDelay?: number;
    registryFetchInterval?: number;
    fetchRegistry?: boolean;
    filterUpInstances?: boolean;
    servicePath?: string;
    ssl?: boolean;
    useDns?: boolean;
    preferIpAddress?: boolean;
  }

  export interface EurekaConfig {
    instance: EurekaInstanceConfig;
    eureka: EurekaClientConfig;
  }

  export class Eureka {
    constructor(config: EurekaConfig);
    start(callback?: (error?: Error) => void): void;
    stop(callback?: (error?: Error) => void): void;
    getInstancesByAppId(appId: string): any[];
    getInstancesByVipAddress(vipAddress: string): any[];
  }
}
