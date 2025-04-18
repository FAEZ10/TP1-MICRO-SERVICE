import { Request, Response } from 'express';
import { OrderController } from '../../../infrastructure/controllers/order.controller';
import { OrderUseCase } from '../../../application/usecases/order.usecase';
import { Order } from '../../../interfaces/order.interface';

describe('OrderController', () => {
  let orderController: OrderController;
  let mockOrderUseCase: jest.Mocked<OrderUseCase>;
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
    };

    mockOrderUseCase = {
      createOrder: jest.fn(),
      getOrderById: jest.fn(),
      getAllOrders: jest.fn(),
    } as unknown as jest.Mocked<OrderUseCase>;

    orderController = new OrderController(mockOrderUseCase);
  });

  describe('createOrder', () => {
    const mockOrderData = {
      userId: 'user123',
      items: [
        {
          productId: 'prod123',
          quantity: 2
        }
      ]
    };

    const mockOrder: Order = {
      id: '1',
      userId: 'user123',
      products: [
        {
          productId: 'prod123',
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should create an order successfully', async () => {
      mockRequest = {
        body: mockOrderData
      };

      mockOrderUseCase.createOrder.mockResolvedValue(mockOrder);

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockOrderUseCase.createOrder).toHaveBeenCalledWith(mockOrderData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle invalid order data', async () => {
      mockRequest = {
        body: {}
      };

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid order data' });
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
      updatedAt: new Date()
    };

    it('should return an order when found', async () => {
      mockRequest = {
        params: { id: '1' }
      };

      mockOrderUseCase.getOrderById.mockResolvedValue(mockOrder);

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(mockOrderUseCase.getOrderById).toHaveBeenCalledWith('1');
      expect(mockJson).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 when order not found', async () => {
      mockRequest = {
        params: { id: '999' }
      };

      mockOrderUseCase.getOrderById.mockResolvedValue(null);

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Order not found' });
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
        updatedAt: new Date()
      }
    ];

    it('should return all orders', async () => {
      mockOrderUseCase.getAllOrders.mockResolvedValue(mockOrders);

      await orderController.getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockOrderUseCase.getAllOrders).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockOrderUseCase.getAllOrders.mockRejectedValue(error);

      await orderController.getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
