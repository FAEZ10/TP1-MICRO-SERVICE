import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export const createOrderRouter = (orderController: OrderController): Router => {
    const router = Router();

    router.get('/', (req, res) => orderController.getAllOrders(req, res));
    router.post('/', (req, res) => orderController.createOrder(req, res));
    router.get('/:id', (req, res) => orderController.getOrderById(req, res));

    return router;
};
