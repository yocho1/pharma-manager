# PharmaManager — Backend

## Prérequis

- Python 3.12+
- PostgreSQL 14+

## Installation

```bash
# Créer un environnement virtuel
python -m venv .venv

# Activer l'environnement
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Appliquer les migrations
python manage.py migrate

# Créer un super utilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

## Swagger

Accessible à : `http://localhost:8000/api/schema/swagger-ui/`
