import { Order } from '../../interfaces/order.interface';

interface OrderItem {
  productId: string;
  product: any; // Type will be defined by CatalogueService
  quantity: number;
}

export class OrderEntity {
  id!: string;
  userId!: string;
  products!: Array<{
    productId: string;
    quantity: number;
  }>;
  totalAmount!: number;
  status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: Partial<OrderEntity>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = 'PENDING';
  }

  static create(id: string, items: OrderItem[], userId: string): OrderEntity {
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    return new OrderEntity({
      id,
      userId,
      products: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      totalAmount,
      status: 'PENDING'
    });
  }

  confirm(): void {
    this.status = 'CONFIRMED';
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
  }

  updateTotalAmount(amount: number): void {
    this.totalAmount = amount;
    this.updatedAt = new Date();
  }

  toJSON(): Order {
    return {
      id: this.id,
      userId: this.userId,
      products: this.products,
      totalAmount: this.totalAmount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
