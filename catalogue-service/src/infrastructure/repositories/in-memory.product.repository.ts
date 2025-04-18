import { Product } from '../../interfaces/product.interface';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductEntity } from '../../domain/entities/product.entity';

export class InMemoryProductRepository implements ProductRepository {
  private products: Map<string, Product> = new Map();

  async create(product: ProductEntity): Promise<Product> {
    const productData = { ...product };
    this.products.set(product.id, productData);
    return productData;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    return product || null;
  }

  async findAll(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
    }

    return products;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct = {
      ...existingProduct,
      ...product,
      updatedAt: new Date()
    };

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    if (!this.products.has(id)) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.products.delete(id);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return ids
      .map(id => this.products.get(id))
      .filter((product): product is Product => product !== undefined);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = this.products.get(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct = {
      ...product,
      stock: product.stock + quantity,
      updatedAt: new Date()
    };

    if (updatedProduct.stock < 0) {
      throw new Error('Insufficient stock');
    }

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async checkAvailability(productIds: string[], quantities: number[]): Promise<boolean> {
    for (let i = 0; i < productIds.length; i++) {
      const product = this.products.get(productIds[i]);
      if (!product || product.stock < quantities[i]) {
        return false;
      }
    }
    return true;
  }
}
