import axios from 'axios';
import { Eureka } from 'eureka-js-client';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
}

export class CatalogueService {
  private readonly baseUrl: string;
  private readonly eurekaClient?: Eureka;

  constructor(catalogueServiceUrl: string, eurekaClient?: Eureka) {
    this.baseUrl = catalogueServiceUrl;
    this.eurekaClient = eurekaClient;
  }

  private getServiceUrl(): string {
    if (this.eurekaClient) {
      try {
        const instances = this.eurekaClient.getInstancesByAppId('catalogue-service');
        if (instances && instances.length > 0) {
          const instance = instances[0];
          return `http://${instance.hostName}:${instance.port.$}`;
        }
      } catch (error) {
        console.warn('Error getting catalogue service from Eureka, using fallback URL', error);
      }
    }
    return this.baseUrl;
  }

  async getProduct(productId: string): Promise<Product> {
    try {
      const serviceUrl = this.getServiceUrl();
      const response = await axios.get(`${serviceUrl}/products/${productId}`);
      const product = response.data as Product;
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Error fetching product: ${errorMessage}`);
    }
  }

  async checkProductsAvailability(products: Array<{ productId: string; quantity: number }>): Promise<boolean> {
    try {
      const productAvailabilities = await Promise.all(
        products.map(async ({ productId, quantity }) => {
          const product = await this.getProduct(productId);
          return product.stock >= quantity;
        })
      );

      return productAvailabilities.every(isAvailable => isAvailable);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Error fetching product:')) {
        const originalError = error.message.replace('Error fetching product: ', '');
        throw new Error(`Error checking products availability: ${originalError}`);
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Error checking products availability: ${errorMessage}`);
    }
  }
}
