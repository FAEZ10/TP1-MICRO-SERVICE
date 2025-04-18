import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

export const createProductRouter = (productController: ProductController): Router => {
  const router = Router();

  // Create a new product
  router.post('/', productController.createProduct.bind(productController));

  // Get all products with optional filters
  router.get('/', productController.getAllProducts.bind(productController));

  // Get a specific product by ID
  router.get('/:id', productController.getProduct.bind(productController));

  // Update a product
  router.put('/:id', productController.updateProduct.bind(productController));

  // Delete a product
  router.delete('/:id', productController.deleteProduct.bind(productController));

  // Update product stock
  router.patch('/:id/stock', productController.updateStock.bind(productController));

  // Check products availability
  router.post('/check-availability', productController.checkAvailability.bind(productController));

  // Get multiple products by IDs
  router.post('/batch', productController.getProductsByIds.bind(productController));

  return router;
};
