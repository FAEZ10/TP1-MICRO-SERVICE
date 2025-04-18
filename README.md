# Microservices Architecture with Eureka and API Gateway

This project demonstrates a microservices architecture with service discovery (Eureka) and API Gateway. The system consists of the following components:

## Architecture Overview

![Microservices Architecture](https://miro.medium.com/max/1400/1*QzlCzNUYQMPSXIqXJ9Cd5A.png)

### Components

1. **Eureka Server**: Service discovery server that allows microservices to register themselves and discover other services.
2. **API Gateway**: Single entry point for all client requests, which routes requests to the appropriate microservice.
3. **Catalogue Service**: Manages product information and inventory.
4. **Order Service**: Handles order processing and management.

## Services

### Eureka Server (Service Discovery)

- Port: 8761
- Role: Allows services to register themselves and discover other services
- Dashboard: http://localhost:8761

### API Gateway

- Port: 3000
- Role: Routes client requests to appropriate microservices
- Endpoints:
  - `/api/products` -> Catalogue Service
  - `/api/orders` -> Order Service

### Catalogue Service

- Port: 3001
- Role: Manages product information and inventory
- Endpoints:
  - `POST /products` - Create a new product
  - `GET /products` - Get all products (with optional filters)
  - `GET /products/:id` - Get a specific product
  - `PUT /products/:id` - Update a product
  - `DELETE /products/:id` - Delete a product
  - `PATCH /products/:id/stock` - Update product stock
  - `POST /products/check-availability` - Check products availability
  - `POST /products/batch` - Get multiple products by IDs

### Order Service

- Port: 3002
- Role: Handles order processing and management
- Endpoints:
  - `POST /orders` - Create a new order
  - `GET /orders` - Get all orders
  - `GET /orders/:id` - Get a specific order

## Running the Application

### Prerequisites

- Docker and Docker Compose

### Steps to Run

1. Clone the repository
2. Build and start the services:

```bash
docker compose up --build
```

3. Access the services:
   - Eureka Dashboard: http://localhost:8761
   - API Gateway: http://localhost:3000
   - Catalogue Service (direct): http://localhost:3001
   - Order Service (direct): http://localhost:3002

## Benefits of This Architecture

### Service Discovery (Eureka)

- Automatic registration of services
- Dynamic service discovery
- Health monitoring
- Load balancing
- Fault tolerance

### API Gateway

- Single entry point for all client requests
- Request routing
- Authentication and authorization
- Rate limiting
- Load balancing
- Logging and monitoring

## Testing the Services

### Automated Testing

We've provided a test script that verifies all aspects of the microservices architecture, including service discovery and API Gateway functionality:

```bash
# Make the script executable
chmod +x test.sh

# Run the tests
./test.sh
```

The test script performs the following checks:
1. Verifies that Eureka Server is running
2. Checks if the API Gateway is operational
3. Creates a product through the API Gateway
4. Retrieves the product directly from the Catalogue Service
5. Retrieves the product through the API Gateway
6. Creates an order through the API Gateway
7. Retrieves the order directly from the Order Service
8. Retrieves the order through the API Gateway
9. Verifies service registration in Eureka

### Manual Testing

You can also test the services manually using curl or any API client like Postman:

#### Via API Gateway

```bash
# Get all products
curl http://localhost:3000/api/products

# Create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "items": [{"productId": "prod123", "quantity": 2}]}'
```

#### Direct Access

```bash
# Get all products
curl http://localhost:3001/products

# Create an order
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "items": [{"productId": "prod123", "quantity": 2}]}'
```

#### Eureka Dashboard

You can access the Eureka dashboard to see registered services at:
```
http://localhost:8761
```
