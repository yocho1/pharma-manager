# PharmaManager — Pharmacy Management System

Application web de gestion de pharmacie développée avec **Django REST Framework** (backend) et **React** (frontend).

## Fonctionnalités

- **Catégories** — CRUD complet pour organiser les médicaments
- **Médicaments** — Gestion des stocks, alertes de stock bas, soft-delete, filtres, recherche
- **Ventes** — Création avec référence auto-générée (VNT-YYYY-NNNN), déduction de stock, annulation avec restauration, filtrage par date
- **Dashboard** — Tableau de bord avec indicateurs clés (statistiques temps réel)
- **Swagger UI** — Documentation interactive de l'API à `/api/schema/swagger-ui/`

## Stack technique

| Couche          | Technologies                                                  |
| --------------- | ------------------------------------------------------------- |
| Backend         | Python 3.12, Django 6, Django REST Framework, drf-spectacular |
| Frontend        | React 19, Vite, Axios, TanStack React Query, React Router     |
| Base de données | PostgreSQL 16                                                 |

## Prérequis

- Python 3.12+
- Node.js 18+
- PostgreSQL 16+

## Installation

### 1. Cloner le projet

```bash
git clone git@github.com:yocho1/pharma-manager.git
cd pharma-manager
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Adapter les valeurs dans .env si besoin
```

### 3. Backend

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r backend/requirements.txt
```

Créer la base de données PostgreSQL :

```sql
CREATE DATABASE pharma_db;
```

Appliquer les migrations :

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser  # optionnel
```

Charger les données de test (optionnel) :

```bash
python manage.py loaddata fixtures/initial_data.json
```

Lancer le serveur :

```bash
python manage.py runserver
```

Le backend est accessible sur `http://localhost:8000`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

## API Endpoints

| Méthode | Endpoint                       | Description                     |
| ------- | ------------------------------ | ------------------------------- |
| GET     | `/api/v1/categories/`          | Lister les catégories           |
| POST    | `/api/v1/categories/`          | Créer une catégorie             |
| GET     | `/api/v1/medicaments/`         | Lister les médicaments          |
| POST    | `/api/v1/medicaments/`         | Créer un médicament             |
| GET     | `/api/v1/medicaments/alertes/` | Médicaments en alerte de stock  |
| DELETE  | `/api/v1/medicaments/{id}/`    | Soft-delete un médicament       |
| GET     | `/api/v1/ventes/`              | Historique des ventes           |
| POST    | `/api/v1/ventes/`              | Créer une vente                 |
| POST    | `/api/v1/ventes/{id}/annuler/` | Annuler une vente               |
| GET     | `/api/v1/dashboard/`           | Statistiques du tableau de bord |
| GET     | `/api/schema/swagger-ui/`      | Documentation Swagger UI        |

## Architecture du projet

```
pharma-manager/
├── backend/
│   ├── config/              # Settings Django (base/local)
│   ├── apps/
│   │   ├── categories/      # Module catégories
│   │   ├── medicaments/     # Module médicaments
│   │   ├── ventes/          # Module ventes
│   │   └── dashboard/       # Statistiques tableau de bord
│   ├── fixtures/            # Données de test (seed data)
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/             # Clients Axios
│   │   ├── hooks/           # React Query hooks
│   │   ├── components/      # Composants réutilisables
│   │   └── pages/           # Pages principales
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Conventions

- **Commits** : format conventionnel (`feat(scope): description`)
- **API** : RESTful, versionnée (`/api/v1/`), documentée via Swagger
- **Backend** : PEP 8, docstrings, transactions atomiques pour les opérations critiques
- **Frontend** : composants fonctionnels, hooks custom, séparation API/UI
