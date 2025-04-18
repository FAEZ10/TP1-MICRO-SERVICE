import express from 'express';
import cors from 'cors';
import { createProductRouter } from './infrastructure/routes/product.routes';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductUseCase } from './application/usecases/product.usecase';
import { ProductRepository } from './domain/repositories/product.repository';

export const createApp = (productRepository: ProductRepository) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const productUseCase = new ProductUseCase(productRepository);
  const productController = new ProductController(productUseCase);

  app.use('/products', createProductRouter(productController));

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return app;
};
