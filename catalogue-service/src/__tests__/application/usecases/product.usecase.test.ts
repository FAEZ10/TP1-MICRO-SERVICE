import { ProductUseCase } from '../../../application/usecases/product.usecase';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { Product, CreateProductDto, UpdateProductDto } from '../../../interfaces/product.interface';

describe('ProductUseCase', () => {
  let productUseCase: ProductUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateStock: jest.fn(),
      checkAvailability: jest.fn(),
      findByIds: jest.fn()
    } as unknown as jest.Mocked<ProductRepository>;

    productUseCase = new ProductUseCase(mockProductRepository);
  });

  describe('createProduct', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      stock: 100,
      category: 'Test'
    };

    const mockProduct: Product = {
      id: 'prod123',
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should create a product successfully', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await productUseCase.createProduct(createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
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
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await productUseCase.getProduct('prod123');

      expect(mockProductRepository.findById).toHaveBeenCalledWith('prod123');
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUseCase.getProduct('invalid-id'))
        .rejects
        .toThrow('Product with id invalid-id not found');
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

    it('should return all products without filters', async () => {
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productUseCase.getAllProducts();

      expect(mockProductRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockProducts);
    });

    it('should return filtered products', async () => {
      const filters = { category: 'Test', minPrice: 20, maxPrice: 30 };
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productUseCase.getAllProducts(filters);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockProducts);
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
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.updateStock.mockResolvedValue({ ...mockProduct, stock: 150 });

      const result = await productUseCase.updateStock('prod123', 50);

      expect(mockProductRepository.updateStock).toHaveBeenCalledWith('prod123', 50);
      expect(result.stock).toBe(150);
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUseCase.updateStock('invalid-id', 50))
        .rejects
        .toThrow('Product with id invalid-id not found');
    });
  });

  describe('checkProductsAvailability', () => {
    it('should return true when all products are available', async () => {
      mockProductRepository.checkAvailability.mockResolvedValue(true);

      const products = [
        { id: 'prod123', quantity: 2 },
        { id: 'prod456', quantity: 3 }
      ];

      const result = await productUseCase.checkProductsAvailability(products);

      expect(mockProductRepository.checkAvailability).toHaveBeenCalledWith(
        ['prod123', 'prod456'],
        [2, 3]
      );
      expect(result).toBe(true);
    });

    it('should return false when some products are not available', async () => {
      mockProductRepository.checkAvailability.mockResolvedValue(false);

      const products = [
        { id: 'prod123', quantity: 200 },
        { id: 'prod456', quantity: 300 }
      ];

      const result = await productUseCase.checkProductsAvailability(products);

      expect(result).toBe(false);
    });
  });
});
