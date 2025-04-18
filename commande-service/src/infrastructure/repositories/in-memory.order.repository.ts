import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderEntity } from "../../domain/entities/order.entity";
import { Order } from "../../interfaces/order.interface";

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Map<string, OrderEntity> = new Map();

    async create(order: OrderEntity): Promise<Order> {
        this.orders.set(order.id, order);
        return order.toJSON();
    }

    async findById(id: string): Promise<Order | null> {
        const order = this.orders.get(id);
        return order ? order.toJSON() : null;
    }

    async update(order: OrderEntity): Promise<Order> {
        this.orders.set(order.id, order);
        return order.toJSON();
    }

    async delete(id: string): Promise<void> {
        this.orders.delete(id);
    }

    async findAll(): Promise<Order[]> {
        return Array.from(this.orders.values()).map(order => order.toJSON());
    }
}
