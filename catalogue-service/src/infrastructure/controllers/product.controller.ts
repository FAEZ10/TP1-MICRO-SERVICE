import { Request, Response } from 'express';
import { ProductUseCase } from '../../application/usecases/product.usecase';
import { CreateProductDto, UpdateProductDto } from '../../interfaces/product.interface';

class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ProductController {
  private handleError(error: unknown, res: Response): void {
    if (error instanceof AppError || error instanceof Error) {
      // Return 404 for "not found" errors
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }

  constructor(private readonly productUseCase: ProductUseCase) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const createProductDto: CreateProductDto = req.body;
      const product = await this.productUseCase.createProduct(createProductDto);
      res.status(201).json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productUseCase.getProduct(id);
      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, minPrice, maxPrice } = req.query;
      const filters = {
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
      };
      const products = await this.productUseCase.getAllProducts(filters);
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateProductDto: UpdateProductDto = req.body;
      const product = await this.productUseCase.updateProduct(id, updateProductDto);
      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.productUseCase.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await this.productUseCase.updateStock(id, quantity);
      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const products = req.body.products as Array<{ id: string; quantity: number }>;
      const available = await this.productUseCase.checkProductsAvailability(products);
      res.json({ available });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getProductsByIds(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;
      const products = await this.productUseCase.getProductsByIds(ids);
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
