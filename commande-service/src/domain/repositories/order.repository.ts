import { Order } from '../../interfaces/order.interface';
import { OrderEntity } from '../entities/order.entity';

export interface OrderRepository {
  create(order: OrderEntity): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(order: OrderEntity): Promise<Order>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Order[]>;
}
