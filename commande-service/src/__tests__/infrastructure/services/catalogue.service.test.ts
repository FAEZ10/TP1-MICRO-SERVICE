import axios from 'axios';
import { CatalogueService } from '../../../infrastructure/services/catalogue.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CatalogueService', () => {
  let catalogueService: CatalogueService;
  const baseUrl = 'http://catalogue:3001';

  beforeEach(() => {
    catalogueService = new CatalogueService(baseUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProduct', () => {
    const mockProduct = {
      id: 'prod123',
      name: 'Test Product',
      price: 29.99,
      stock: 10,
    };

    it('should fetch product successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockProduct } as any);

      const result = await catalogueService.getProduct('prod123');

      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/products/prod123`);
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when product not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Product not found'));

      await expect(catalogueService.getProduct('invalid-id'))
        .rejects
        .toThrow('Error fetching product: Product not found');

      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/products/invalid-id`);
    });

    it('should throw error when request fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(catalogueService.getProduct('prod123'))
        .rejects
        .toThrow('Error fetching product: Network error');
    });
  });

  describe('checkProductsAvailability', () => {
    const mockProducts = [
      {
        id: 'prod123',
        name: 'Test Product 1',
        price: 29.99,
        stock: 10,
      },
      {
        id: 'prod456',
        name: 'Test Product 2',
        price: 19.99,
        stock: 5,
      },
    ];

    it('should return true when all products are available', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts[0] } as any)
        .mockResolvedValueOnce({ data: mockProducts[1] } as any);

      const result = await catalogueService.checkProductsAvailability([
        { productId: 'prod123', quantity: 2 },
        { productId: 'prod456', quantity: 3 },
      ]);

      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should return false when a product is not available', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: { ...mockProducts[0], stock: 1 } } as any)
        .mockResolvedValueOnce({ data: mockProducts[1] } as any);

      const result = await catalogueService.checkProductsAvailability([
        { productId: 'prod123', quantity: 2 },
        { productId: 'prod456', quantity: 3 },
      ]);

      expect(result).toBe(false);
    });

    it('should throw error when product fetch fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(
        catalogueService.checkProductsAvailability([
          { productId: 'prod123', quantity: 2 },
        ])
      ).rejects.toThrow('Error checking products availability: Network error');
    });
  });
});
