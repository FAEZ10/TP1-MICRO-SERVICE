import { Product, CreateProductDto, UpdateProductDto } from '../../interfaces/product.interface';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductEntity } from '../../domain/entities/product.entity';

export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = ProductEntity.create(createProductDto);
    return this.productRepository.create(product);
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async getAllProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    return this.productRepository.findAll(filters);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.getProduct(id);
    
    const productEntity = ProductEntity.fromProduct(existingProduct);
    productEntity.update(updateProductDto);
    
    return this.productRepository.update(id, productEntity);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProduct(id); // Verify product exists
    return this.productRepository.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProduct(id);
    const productEntity = ProductEntity.fromProduct(product);
    
    productEntity.updateStock(quantity);
    return this.productRepository.updateStock(id, quantity);
  }

  async checkProductsAvailability(products: Array<{ id: string; quantity: number }>): Promise<boolean> {
    const productIds = products.map(p => p.id);
    const quantities = products.map(p => p.quantity);
    
    return this.productRepository.checkAvailability(productIds, quantities);
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    return this.productRepository.findByIds(ids);
  }

  async reserveProducts(products: Array<{ id: string; quantity: number }>): Promise<void> {
    const available = await this.checkProductsAvailability(products);
    if (!available) {
      throw new Error('One or more products are not available in the requested quantity');
    }

    await Promise.all(
      products.map(({ id, quantity }) => this.updateStock(id, -quantity))
    );
  }
}
