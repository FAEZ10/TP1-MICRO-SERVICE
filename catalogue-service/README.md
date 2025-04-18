# Catalogue Service

Service de gestion du catalogue de produits pour l'architecture microservices. Ce service gère les produits, leurs stocks et leurs disponibilités.

## Architecture

Le service suit les principes de la Clean Architecture avec une séparation claire des responsabilités :

```
src/
├── application/        # Cas d'utilisation de l'application
│   └── usecases/
├── domain/            # Logique métier et entités
│   ├── entities/
│   └── repositories/
├── infrastructure/    # Implémentations techniques
│   ├── controllers/
│   ├── repositories/
│   └── routes/
└── interfaces/        # Contrats et DTOs
```

### Composants Principaux

- **ProductEntity**: Entité centrale représentant un produit
- **ProductUseCase**: Gestion des cas d'utilisation liés aux produits
- **ProductRepository**: Interface pour la persistance des produits
- **InMemoryProductRepository**: Implémentation en mémoire du repository

## Configuration

### Prérequis

- Node.js (v14 ou supérieur)
- Docker et Docker Compose

### Variables d'Environnement

```env
PORT=3001
```

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Construction de l'image Docker
docker build -t catalogue-service .
```

## API Endpoints

### Création d'un Produit

```http
POST /products
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": number,
  "stock": number,
  "category": "string"
}
```

### Récupération des Produits

```http
GET /products
GET /products?category=string&minPrice=number&maxPrice=number
```

### Récupération d'un Produit

```http
GET /products/:id
```

### Mise à Jour d'un Produit

```http
PUT /products/:id
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": number,
  "stock": number,
  "category": "string"
}
```

### Mise à Jour du Stock

```http
PATCH /products/:id/stock
Content-Type: application/json

{
  "quantity": number
}
```

### Vérification de Disponibilité

```http
POST /products/check-availability
Content-Type: application/json

{
  "products": [
    {
      "id": "string",
      "quantity": number
    }
  ]
}
```

## Intégration avec Docker Compose

Le service est configuré pour s'exécuter dans un environnement Docker et être accessible par les autres services.

```yaml
# Extrait du docker compose.yml
services:
  catalogue:
    build: ./catalogue-service
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
```

## Tests

```bash
# Exécution des tests unitaires
npm test

# Exécution des tests avec couverture
npm run test:coverage
```

## Gestion des Erreurs

- Validation des données d'entrée
- Gestion des produits non trouvés
- Gestion des erreurs de stock
- Traitement des erreurs de validation

## Maintenance

Pour contribuer au projet :

1. Créer une branche pour la fonctionnalité
2. Implémenter les changements
3. Exécuter les tests
4. Soumettre une pull request

## Sécurité

- Validation des entrées utilisateur
- Protection contre les injections
- Gestion sécurisée des données sensibles
