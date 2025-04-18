import { Product } from '../../interfaces/product.interface';

export class ProductEntity {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  category!: string;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: Partial<ProductEntity>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static fromProduct(product: Product): ProductEntity {
    return new ProductEntity(product);
  }

  static create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }): ProductEntity {
    if (data.price < 0) {
      throw new Error('Product price cannot be negative');
    }
    if (data.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    return new ProductEntity({
      id: Math.random().toString(36).substr(2, 9),
      ...data
    });
  }

  updateStock(quantity: number): void {
    const newStock = this.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }
    this.stock = newStock;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Product price cannot be negative');
    }
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  update(data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
  }): void {
    if (data.price !== undefined && data.price < 0) {
      throw new Error('Product price cannot be negative');
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    Object.assign(this, {
      ...data,
      updatedAt: new Date()
    });
  }

  checkAvailability(quantity: number): boolean {
    return this.stock >= quantity;
  }

  reserveStock(quantity: number): void {
    if (!this.checkAvailability(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.updateStock(-quantity);
  }
}
