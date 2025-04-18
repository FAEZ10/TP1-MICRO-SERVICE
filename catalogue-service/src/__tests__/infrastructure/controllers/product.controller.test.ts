import { Request, Response } from 'express';
import { ProductController } from '../../../infrastructure/controllers/product.controller';
import { ProductUseCase } from '../../../application/usecases/product.usecase';
import { Product } from '../../../interfaces/product.interface';

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductUseCase: jest.Mocked<ProductUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
      send: jest.fn(),
    };

    mockProductUseCase = {
      createProduct: jest.fn(),
      getProduct: jest.fn(),
      getAllProducts: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateStock: jest.fn(),
      checkProductsAvailability: jest.fn(),
      getProductsByIds: jest.fn(),
      reserveProducts: jest.fn()
    } as unknown as jest.Mocked<ProductUseCase>;

    productController = new ProductController(mockProductUseCase);
  });

  describe('createProduct', () => {
    const mockProductData = {
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      stock: 100,
      category: 'Test'
    };

    const mockProduct: Product = {
      id: 'prod123',
      ...mockProductData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should create a product successfully', async () => {
      mockRequest = {
        body: mockProductData
      };

      mockProductUseCase.createProduct.mockResolvedValue(mockProduct);

      await productController.createProduct(mockRequest as Request, mockResponse as Response);

      expect(mockProductUseCase.createProduct).toHaveBeenCalledWith(mockProductData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle invalid product data', async () => {
      mockRequest = {
        body: { name: 'Invalid Product' }
      };

      mockProductUseCase.createProduct.mockRejectedValue(new Error('Invalid product data'));

      await productController.createProduct(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid product data' });
    });
  });

  describe('getProduct', () => {
    const mockProduct: Product = {
      id: 'prod123',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      stock: 100,
      category: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should return a product when found', async () => {
      mockRequest = {
        params: { id: 'prod123' }
      };

      mockProductUseCase.getProduct.mockResolvedValue(mockProduct);

      await productController.getProduct(mockRequest as Request, mockResponse as Response);

      expect(mockProductUseCase.getProduct).toHaveBeenCalledWith('prod123');
      expect(mockJson).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 when product not found', async () => {
      mockRequest = {
        params: { id: 'invalid-id' }
      };

      mockProductUseCase.getProduct.mockRejectedValue(new Error('Product not found'));

      await productController.getProduct(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  describe('getAllProducts', () => {
    const mockProducts: Product[] = [
      {
        id: 'prod123',
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        stock: 100,
        category: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    it('should return all products', async () => {
      mockRequest = {
        query: {}
      };

      mockProductUseCase.getAllProducts.mockResolvedValue(mockProducts);

      await productController.getAllProducts(mockRequest as Request, mockResponse as Response);

      expect(mockProductUseCase.getAllProducts).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockProducts);
    });

    it('should filter products by category', async () => {
      mockRequest = {
        query: { category: 'Test' }
      };

      mockProductUseCase.getAllProducts.mockResolvedValue(mockProducts);

      await productController.getAllProducts(mockRequest as Request, mockResponse as Response);

      expect(mockProductUseCase.getAllProducts).toHaveBeenCalledWith({
        category: 'Test',
        minPrice: undefined,
        maxPrice: undefined
      });
    });
  });

  describe('updateStock', () => {
    const mockProduct: Product = {
      id: 'prod123',
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      stock: 100,
      category: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should update product stock successfully', async () => {
      mockRequest = {
        params: { id: 'prod123' },
        body: { quantity: 50 }
      };

      mockProductUseCase.updateStock.mockResolvedValue(mockProduct);

      await productController.updateStock(mockRequest as Request, mockResponse as Response);

      expect(mockProductUseCase.updateStock).toHaveBeenCalledWith('prod123', 50);
      expect(mockJson).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle invalid stock update', async () => {
      mockRequest = {
        params: { id: 'prod123' },
        body: { quantity: -200 }
      };

      mockProductUseCase.updateStock.mockRejectedValue(new Error('Invalid stock quantity'));

      await productController.updateStock(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid stock quantity' });
    });
  });
});
