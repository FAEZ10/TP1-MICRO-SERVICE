import express, { Express } from 'express';
import { createOrderRouter } from './infrastructure/routes/order.routes';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderUseCase } from './application/usecases/order.usecase';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory.order.repository';
import { CatalogueService } from './infrastructure/services/catalogue.service';
import { Eureka } from 'eureka-js-client';

export const createApp = (eurekaClient?: Eureka) => {
    const app: Express = express();
    app.use(express.json());

    const orderRepository = new InMemoryOrderRepository();
    const catalogueService = new CatalogueService(
        process.env.CATALOGUE_SERVICE_URL || 'http://localhost:3001',
        eurekaClient
    );
    const orderUseCase = new OrderUseCase(orderRepository, catalogueService);
    const orderController = new OrderController(orderUseCase);

    app.use('/orders', createOrderRouter(orderController));

    return app;
};
