import { Order, CreateOrderDto } from '../../interfaces/order.interface';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { CatalogueService } from '../../infrastructure/services/catalogue.service';
import { OrderEntity } from '../../domain/entities/order.entity';

export class OrderUseCase {
    private currentId = "1";

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly catalogueService: CatalogueService
    ) {}

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const orderItems = await Promise.all(
            createOrderDto.items.map(async (item) => {
                const product = await this.catalogueService.getProduct(item.productId);
                return {
                    productId: item.productId,
                    product,
                    quantity: item.quantity
                };
            })
        );

        const order = OrderEntity.create(this.currentId, orderItems, createOrderDto.userId);
        this.currentId = (parseInt(this.currentId) + 1).toString();
        return this.orderRepository.create(order);
    }

    async getOrderById(id: string): Promise<Order | null> {
        return this.orderRepository.findById(id);
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.findAll();
    }
}
