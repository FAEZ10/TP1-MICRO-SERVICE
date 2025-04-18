import { OrderUseCase } from '../../../application/usecases/order.usecase';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { CatalogueService } from '../../../infrastructure/services/catalogue.service';
import { Order, CreateOrderDto } from '../../../interfaces/order.interface';

describe('OrderUseCase', () => {
  let orderUseCase: OrderUseCase;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockCatalogueService: jest.Mocked<CatalogueService>;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<OrderRepository>;

    mockCatalogueService = {
      getProduct: jest.fn(),
      checkProductsAvailability: jest.fn(),
    } as unknown as jest.Mocked<CatalogueService>;

    orderUseCase = new OrderUseCase(mockOrderRepository, mockCatalogueService);
  });

  describe('createOrder', () => {
    const mockProduct = {
      id: 'prod123',
      name: 'Test Product',
      price: 29.99,
      stock: 10,
    };

    const mockCreateOrderDto: CreateOrderDto = {
      userId: 'user123',
      items: [
        {
          productId: 'prod123',
          quantity: 2,
        },
      ],
    };

    const mockOrder: Order = {
      id: '1',
      userId: 'user123',
      products: [
        {
          productId: 'prod123',
          quantity: 2,
        },
      ],
      totalAmount: 59.98,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create an order successfully', async () => {
      mockCatalogueService.getProduct.mockResolvedValue(mockProduct);
      mockOrderRepository.create.mockResolvedValue(mockOrder);

      const result = await orderUseCase.createOrder(mockCreateOrderDto);

      expect(mockCatalogueService.getProduct).toHaveBeenCalledWith('prod123');
      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw error when product is not found', async () => {
      mockCatalogueService.getProduct.mockRejectedValue(new Error('Error fetching product: Product not found'));

      await expect(orderUseCase.createOrder(mockCreateOrderDto)).rejects.toThrow('Error fetching product: Product not found');
    });
  });

  describe('getOrderById', () => {
    const mockOrder: Order = {
      id: '1',
      userId: 'user123',
      products: [],
      totalAmount: 0,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return order when found', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderUseCase.getOrderById('1');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockOrder);
    });

    it('should return null when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const result = await orderUseCase.getOrderById('999');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('getAllOrders', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        userId: 'user123',
        products: [],
        totalAmount: 0,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all orders', async () => {
      mockOrderRepository.findAll.mockResolvedValue(mockOrders);

      const result = await orderUseCase.getAllOrders();

      expect(mockOrderRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });
});
