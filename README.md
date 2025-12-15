# 🇬🇦 CGA - Carte Grise Administrative

<div align="center">

![Drapeau Gabon](https://img.shields.io/badge/🇬🇦-Gabon-009E60?style=for-the-badge)
[![Docker](https://img.shields.io/badge/Docker-Prêt-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)](package.json)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](frontend/package.json)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](docker-compose.yml)
[![Licence](https://img.shields.io/badge/Licence-MIT-green?style=for-the-badge)](LICENSE)

**Application Web Professionnelle pour la Gestion Administrative des Cartes Grises**

[🚀 Démarrage Rapide](#-démarrage-rapide-5-minutes) • [📖 Documentation](#-documentation) • [🐳 Guide Docker](#-déploiement-docker) • [🔧 Configuration](#-configuration)

</div>

---

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Démarrage Rapide (5 Minutes)](#-démarrage-rapide-5-minutes)
- [📦 Prérequis](#-prérequis)
- [🐳 Déploiement Docker](#-déploiement-docker)
- [🔧 Configuration](#-configuration)
- [📖 Documentation](#-documentation)
- [🛠️ Technologies Utilisées](#️-technologies-utilisées)
- [🤝 Contribution](#-contribution)

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| 🎨 **Thème Gabon** | Couleurs officielles du drapeau (Vert, Jaune, Bleu) |
| 🔐 **Authentification** | JWT avec tokens de rafraîchissement |
| 👥 **Rôles Dynamiques** | Créez des rôles personnalisés (Patrimoine, DCRTCT, etc.) |
| 📱 **Responsive** | Compatible mobile, tablette et ordinateur |
| 🔄 **Workflows** | Validation multi-étapes configurable |
| 📝 **Signatures Numériques** | Signatures électroniques sécurisées |
| 📊 **Journaux d'Audit** | Traçabilité complète des actions |
| 🐳 **Docker Ready** | Déploiement en une seule commande |

---

## 🚀 Démarrage Rapide (5 Minutes)

### Étape 1️⃣ - Cloner le Dépôt

```bash
git clone https://github.com/MoctarSidibe/carte-grise.git
cd carte-grise
```

### Étape 2️⃣ - Copier le Fichier d'Environnement

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### Étape 3️⃣ - Démarrer avec Docker

```bash
docker compose up -d
```

⏳ **Attendez 2-3 minutes** que tous les services démarrent.

### Étape 4️⃣ - Initialiser la Base de Données

```bash
# Créer les tables
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Ajouter les données initiales
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### Étape 5️⃣ - Accéder à l'Application

| Service | URL | Identifiants |
|---------|-----|--------------|
| 🌐 **Frontend** | http://localhost | admin / Admin@123456 |
| 🔧 **API Backend** | http://localhost:5000 | - |
| 📚 **Documentation API** | http://localhost:5000/api-docs | - |

---

## 📦 Prérequis

### Pour le Développement Local

| Logiciel | Version | Téléchargement |
|----------|---------|----------------|
| 🐳 **Docker Desktop** | Dernière | [Télécharger](https://www.docker.com/products/docker-desktop) |
| 📦 **Docker Compose** | v2.0+ | Inclus avec Docker Desktop |
| 🔧 **Git** | Dernière | [Télécharger](https://git-scm.com/downloads) |

### Pour la Production

| Exigence | Minimum | Recommandé |
|----------|---------|------------|
| 🖥️ **CPU** | 2 cœurs | 4 cœurs |
| 💾 **RAM** | 4 Go | 8 Go |
| 💽 **Stockage** | 20 Go | 40 Go SSD |
| 🐧 **OS** | Ubuntu 20.04 | Ubuntu 22.04 LTS |

---

## 🐳 Déploiement Docker

### 🟢 Mode Développement

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les services
docker compose down
```

### 🔵 Mode Production (avec Traefik)

```bash
# Copier l'environnement Traefik
cp traefik/.env.traefik .env

# Modifier votre domaine et email
nano .env

# Démarrer avec Traefik (SSL automatique!)
docker compose -f traefik/docker-compose.traefik.yml up -d
```

### 📊 Aide-Mémoire des Commandes Docker

| Commande | Description |
|----------|-------------|
| `docker compose up -d` | 🚀 Démarrer tous les services |
| `docker compose down` | 🛑 Arrêter tous les services |
| `docker compose logs -f` | 📋 Voir tous les logs |
| `docker compose logs -f backend` | 📋 Voir les logs du backend |
| `docker compose ps` | 📊 Vérifier l'état des services |
| `docker compose restart backend` | 🔄 Redémarrer le backend |
| `docker compose build --no-cache` | 🔨 Reconstruire les images |

---

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` dans le répertoire racine :

```env
# 🗄️ Base de données
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cga_db
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe-securise

# 🔐 Sécurité (Générer avec: openssl rand -base64 32)
JWT_SECRET=votre-secret-jwt-min-32-caracteres
JWT_REFRESH_SECRET=votre-secret-refresh-min-32-caracteres
SESSION_SECRET=votre-secret-session-min-32-caracteres

# 🌐 URLs
FRONTEND_URL=http://localhost
CORS_ORIGINS=http://localhost,http://localhost:80
```

### 🔑 Générer des Secrets Sécurisés

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 📖 Documentation

### 📁 Structure de la Documentation

```
📂 Documentation
├── 📄 README.md              # Ce fichier (Français)
├── 📄 README.fr.md           # Version française détaillée
│
├── 📂 Docs/
│   ├── 📂 French docs/       # Documentation en français
│   └── 📂 divers docs/       # Guides supplémentaires
│
├── 📂 docker Docs/           # Guides Docker
│   ├── 📄 DOCKER_DEPLOYMENT_GUIDE.md
│   └── 📄 DOCKER_QUICK_REFERENCE.md
│
├── 📂 traefik/               # Configuration Traefik
│   └── 📄 TRAEFIK_DEPLOYMENT_GUIDE.md
│
├── 📂 OWASP_SECURITY/        # Documentation sécurité
├── 📂 Swagger/               # Guides documentation API
└── 📂 WSL_SETUP/             # Guide installation WSL Windows
```

### 📚 Documents Clés

| Document | Description |
|----------|-------------|
| [📄 README.fr.md](README.fr.md) | Documentation française détaillée |
| [📄 DOCKER_DEPLOYMENT_GUIDE.md](docker%20Docs/DOCKER_DEPLOYMENT_GUIDE.md) | Installation Docker complète |
| [📄 TRAEFIK_DEPLOYMENT_GUIDE.md](traefik/TRAEFIK_DEPLOYMENT_GUIDE.md) | Production avec Traefik |
| [📄 SWAGGER_API_GUIDE.md](Swagger/SWAGGER_API_GUIDE.md) | Documentation API |
| [📄 DYNAMIC_ROLES_GUIDE.md](Docs/divers%20docs/DYNAMIC_ROLES_GUIDE.md) | Gestion des rôles |

---

## 🏗️ Structure du Projet

```
carte-grise/
├── 📂 backend/                 # API Node.js/Express
│   ├── 📂 config/              # Configuration base de données
│   ├── 📂 scripts/             # Scripts SQL
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Contrôleurs API
│   │   ├── 📂 middleware/      # Auth, RBAC, etc.
│   │   ├── 📂 routes/          # Routes Express
│   │   ├── 📂 services/        # Logique métier
│   │   └── 📂 utils/           # Utilitaires
│   ├── 📄 Dockerfile
│   └── 📄 package.json
│
├── 📂 frontend/                # Application React
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/      # Composants React
│   │   ├── 📂 contexts/        # Contextes React
│   │   ├── 📂 pages/           # Pages
│   │   └── 📂 services/        # Services API
│   ├── 📄 Dockerfile
│   ├── 📄 nginx.conf
│   └── 📄 package.json
│
├── 📂 traefik/                 # Configuration Traefik
├── 📄 docker-compose.yml       # Configuration Docker
├── 📄 .env.example             # Modèle d'environnement
└── 📄 .gitignore
```

---

## 🛠️ Technologies Utilisées

<div align="center">

| Couche | Technologies |
|--------|--------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express-4-000000?logo=express) |
| **Base de données** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) |
| **Authentification** | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens) ![Bcrypt](https://img.shields.io/badge/Bcrypt-12_rounds-blue) |
| **Conteneurisation** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker) ![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx) |
| **Sécurité** | ![Helmet](https://img.shields.io/badge/Helmet.js-gray) ![CORS](https://img.shields.io/badge/CORS-Activé-green) |

</div>

---

## 🔒 Fonctionnalités de Sécurité

- ✅ Authentification JWT avec tokens de rafraîchissement
- ✅ Hachage de mots de passe Bcrypt (12 rounds)
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ Limitation de débit (100 req/15min)
- ✅ En-têtes de sécurité Helmet.js
- ✅ Configuration CORS
- ✅ Protection XSS et injection SQL
- ✅ Journalisation d'audit complète
- ✅ Conteneurs Docker non-root

---

## 🐛 Dépannage

### 🔴 Problèmes Courants

<details>
<summary><b>Le conteneur ne démarre pas</b></summary>

```bash
# Vérifier les logs
docker compose logs backend

# Redémarrage propre
docker compose down
docker system prune
docker compose up -d
```
</details>

<details>
<summary><b>Échec de connexion à la base de données</b></summary>

```bash
# Vérifier l'état de PostgreSQL
docker compose ps postgres

# Tester la connexion
docker exec -it cga-postgres psql -U postgres -d cga_db
```
</details>

<details>
<summary><b>Impossible de se connecter avec les identifiants par défaut</b></summary>

```bash
# Relancer le script de seed
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```
</details>

<details>
<summary><b>Le frontend affiche une page blanche</b></summary>

```bash
# Vérifier les logs du frontend
docker compose logs frontend

# Reconstruire le frontend
docker compose build frontend
docker compose up -d frontend
```
</details>

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Suivez ces étapes :

1. 🍴 Forkez le dépôt
2. 🌿 Créez une branche de fonctionnalité (`git checkout -b feature/SuperFonctionnalite`)
3. 💾 Committez vos changements (`git commit -m 'Ajout de SuperFonctionnalite'`)
4. 📤 Poussez vers la branche (`git push origin feature/SuperFonctionnalite`)
5. 🔃 Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

<div align="center">

Développé avec ❤️ pour la **République Gabonaise** 🇬🇦

Conçu avec les couleurs officielles du drapeau gabonais :
- 🟢 Vert : `#009E60`
- 🟡 Jaune : `#FCD116`
- 🔵 Bleu : `#3A75C4`

</div>

---

<div align="center">

**[⬆ Retour en haut](#-cga---carte-grise-administrative)**

📧 **Questions ?** Ouvrez une issue sur GitHub

⭐ **Vous aimez ce projet ?** Donnez-lui une étoile !

</div>
