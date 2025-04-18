import { Request, Response } from 'express';
import { OrderUseCase } from '../../application/usecases/order.usecase';

export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase) {}

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const createOrderDto = req.body;
            if (!createOrderDto.items || !Array.isArray(createOrderDto.items)) {
                res.status(400).json({ error: 'Invalid order data' });
                return;
            }
            const order = await this.orderUseCase.createOrder(createOrderDto);
            res.status(201).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderUseCase.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const order = await this.orderUseCase.getOrderById(id);
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
