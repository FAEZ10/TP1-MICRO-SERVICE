# Commande Service

Service de gestion des commandes pour l'architecture microservices. Ce service gère le cycle de vie des commandes, depuis leur création jusqu'à leur finalisation, en interagissant avec le service de catalogue pour la validation des produits.

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
│   ├── routes/
│   └── services/
└── interfaces/        # Contrats et DTOs
```

### Composants Principaux

- **OrderEntity**: Entité centrale représentant une commande
- **OrderUseCase**: Gestion des cas d'utilisation liés aux commandes
- **CatalogueService**: Communication avec le service de catalogue
- **OrderRepository**: Interface pour la persistance des commandes

## Configuration

### Prérequis

- Node.js (v14 ou supérieur)
- Docker et Docker Compose

### Variables d'Environnement

```env
CATALOGUE_SERVICE_URL=http://catalogue-service:3000
PORT=3000
```

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Construction de l'image Docker
docker build -t commande-service .
```

## API Endpoints

### Création d'une Commande

```http
POST /orders
Content-Type: application/json

{
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}
```

### Récupération d'une Commande

```http
GET /orders/:id
```

## Intégration avec Docker Compose

Le service est configuré pour s'exécuter dans un environnement Docker et communiquer avec les autres services via Docker Compose.

```yaml
# Extrait du docker compose.yml
services:
  commande-service:
    build: ./commande-service
    ports:
      - "3000:3000"
    environment:
      - CATALOGUE_SERVICE_URL=http://catalogue-service:3000
```

## Tests

```bash
# Exécution des tests unitaires
npm test

# Exécution des tests avec couverture
npm run test:coverage
```

## Flux de Données

1. Le client envoie une demande de création de commande
2. Le service vérifie la disponibilité des produits via le catalogue
3. La commande est créée et persistée
4. Le client reçoit la confirmation de la commande

## Gestion des Erreurs

- Validation des données d'entrée
- Gestion des produits non disponibles
- Gestion des erreurs de communication avec le catalogue
- Traitement des erreurs de persistance

## Maintenance

Pour contribuer au projet :

1. Créer une branche pour la fonctionnalité
2. Implémenter les changements
3. Exécuter les tests
4. Soumettre une pull request

## Sécurité

- Validation des entrées utilisateur
- Gestion sécurisée des communications inter-services
- Protection contre les injections
