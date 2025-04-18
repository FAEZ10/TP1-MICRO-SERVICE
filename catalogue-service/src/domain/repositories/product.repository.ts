import { Product } from '../../interfaces/product.interface';
import { ProductEntity } from '../entities/product.entity';

export interface ProductRepository {
  create(product: ProductEntity): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  findByIds(ids: string[]): Promise<Product[]>;
  updateStock(id: string, quantity: number): Promise<Product>;
  checkAvailability(productIds: string[], quantities: number[]): Promise<boolean>;
}
