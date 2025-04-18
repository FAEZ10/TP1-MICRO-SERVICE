# Vérification de l'intégration d'Eureka et API Gateway

Pour vérifier que l'intégration d'Eureka (service de découverte) et de l'API Gateway fonctionne correctement, vous pouvez suivre ces étapes :

## 1. Démarrer tous les services

```bash
docker compose up --build
```

## 2. Vérifier l'enregistrement des services dans Eureka

Accédez au tableau de bord Eureka dans votre navigateur :
```
http://localhost:8761
```

Vous devriez voir les services suivants enregistrés :
- catalogue-service
- commande-service
- api-gateway

## 3. Tester l'API Gateway

### Tester la redirection vers le service de catalogue

```bash
# Créer un produit via l'API Gateway
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 29.99,
    "stock": 100,
    "category": "Test"
  }'

# Récupérer l'ID du produit créé
curl http://localhost:3000/api/products
```

### Tester la redirection vers le service de commande

```bash
# Créer une commande via l'API Gateway (remplacez PRODUCT_ID par l'ID obtenu précédemment)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2
      }
    ]
  }'

# Récupérer toutes les commandes
curl http://localhost:3000/api/orders
```

## 4. Tester la découverte de service dynamique

Pour tester que le service de commande utilise bien Eureka pour découvrir le service de catalogue :

1. Arrêtez le service de catalogue :
```bash
docker compose stop catalogue
```

2. Essayez de créer une commande (cela devrait échouer car le service de catalogue n'est pas disponible) :
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2
      }
    ]
  }'
```

3. Redémarrez le service de catalogue avec un port différent (simulant une nouvelle instance) :
```bash
PORT=3005 docker compose up -d catalogue
```

4. Attendez quelques secondes pour que le service s'enregistre auprès d'Eureka, puis essayez à nouveau de créer une commande :
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2
      }
    ]
  }'
```

Si la commande est créée avec succès, cela signifie que le service de commande a correctement découvert la nouvelle instance du service de catalogue via Eureka.

## 5. Vérifier les logs

Vous pouvez également vérifier les logs des services pour voir les interactions avec Eureka :

```bash
# Logs du service Eureka
docker compose logs eureka-server

# Logs de l'API Gateway
docker compose logs api-gateway

# Logs du service de catalogue
docker compose logs catalogue

# Logs du service de commande
docker compose logs commande
```

Dans les logs, vous devriez voir des messages indiquant l'enregistrement des services auprès d'Eureka et les requêtes de découverte de service.
