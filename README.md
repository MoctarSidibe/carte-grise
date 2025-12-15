# 🇬🇦 CGA - Carte Grise Administrative

<div align="center">

![Gabon Flag](https://img.shields.io/badge/🇬🇦-Gabon-009E60?style=for-the-badge)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)](package.json)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](frontend/package.json)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](docker-compose.yml)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Modern Professional Web Application for Administrative Vehicle Registration**

[🚀 Quick Start](#-quick-start-5-minutes) • [📖 Documentation](#-documentation) • [🐳 Docker Guide](#-docker-deployment) • [🔧 Configuration](#-configuration)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start (5 Minutes)](#-quick-start-5-minutes)
- [📦 Prerequisites](#-prerequisites)
- [🐳 Docker Deployment](#-docker-deployment)
- [🔧 Configuration](#-configuration)
- [📖 Documentation](#-documentation)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Gabon Theme** | Official flag colors (Green, Yellow, Blue) |
| 🔐 **Authentication** | JWT with refresh tokens |
| 👥 **Dynamic Roles** | Create custom roles (Patrimoine, DCRTCT, etc.) |
| 📱 **Responsive** | Mobile, tablet, and desktop support |
| 🔄 **Workflows** | Configurable multi-step validation |
| 📝 **Digital Signatures** | Secure electronic signatures |
| 📊 **Audit Logs** | Complete action traceability |
| 🐳 **Docker Ready** | One-command deployment |

---

## 🚀 Quick Start (5 Minutes)

### Step 1️⃣ - Clone the Repository

```bash
git clone https://github.com/MoctarSidibe/carte-grise.git
cd carte-grise
```

### Step 2️⃣ - Copy Environment File

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### Step 3️⃣ - Start with Docker

```bash
docker compose up -d
```

⏳ **Wait 2-3 minutes** for all services to start.

### Step 4️⃣ - Initialize Database

```bash
# Create tables
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Add initial data
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### Step 5️⃣ - Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost | admin / Admin@123456 |
| 🔧 **Backend API** | http://localhost:5000 | - |
| 📚 **API Docs** | http://localhost:5000/api-docs | - |

---

## 📦 Prerequisites

### For Local Development

| Software | Version | Download |
|----------|---------|----------|
| 🐳 **Docker Desktop** | Latest | [Download](https://www.docker.com/products/docker-desktop) |
| 📦 **Docker Compose** | v2.0+ | Included with Docker Desktop |
| 🔧 **Git** | Latest | [Download](https://git-scm.com/downloads) |

### For Production

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| 🖥️ **CPU** | 2 cores | 4 cores |
| 💾 **RAM** | 4 GB | 8 GB |
| 💽 **Storage** | 20 GB | 40 GB SSD |
| 🐧 **OS** | Ubuntu 20.04 | Ubuntu 22.04 LTS |

---

## 🐳 Docker Deployment

### 🟢 Development Mode

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 🔵 Production Mode (with Traefik)

```bash
# Copy Traefik environment
cp traefik/.env.traefik .env

# Edit your domain and email
nano .env

# Start with Traefik (automatic SSL!)
docker compose -f traefik/docker-compose.traefik.yml up -d
```

### 📊 Docker Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `docker compose up -d` | 🚀 Start all services |
| `docker compose down` | 🛑 Stop all services |
| `docker compose logs -f` | 📋 View all logs |
| `docker compose logs -f backend` | 📋 View backend logs |
| `docker compose ps` | 📊 Check service status |
| `docker compose restart backend` | 🔄 Restart backend |
| `docker compose build --no-cache` | 🔨 Rebuild images |

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# 🗄️ Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cga_db
DB_USER=postgres
DB_PASSWORD=your-secure-password

# 🔐 Security (Generate with: openssl rand -base64 32)
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
SESSION_SECRET=your-session-secret-min-32-chars

# 🌐 URLs
FRONTEND_URL=http://localhost
CORS_ORIGINS=http://localhost,http://localhost:80
```

### 🔑 Generate Secure Secrets

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 📖 Documentation

### 📁 Documentation Structure

```
📂 Documentation
├── 📄 README.md              # This file (English)
├── 📄 README.fr.md           # French version
│
├── 📂 Docs/
│   ├── 📂 French docs/       # French documentation
│   └── 📂 divers docs/       # Additional guides
│
├── 📂 docker Docs/           # Docker guides
│   ├── 📄 DOCKER_DEPLOYMENT_GUIDE.md
│   └── 📄 DOCKER_QUICK_REFERENCE.md
│
├── 📂 traefik/               # Traefik configuration
│   └── 📄 TRAEFIK_DEPLOYMENT_GUIDE.md
│
├── 📂 OWASP_SECURITY/        # Security documentation
├── 📂 Swagger/               # API documentation guides
└── 📂 WSL_SETUP/             # Windows WSL setup guide
```

### 📚 Key Documents

| Document | Description |
|----------|-------------|
| [📄 README.fr.md](README.fr.md) | French documentation |
| [📄 DOCKER_DEPLOYMENT_GUIDE.md](docker%20Docs/DOCKER_DEPLOYMENT_GUIDE.md) | Complete Docker setup |
| [📄 TRAEFIK_DEPLOYMENT_GUIDE.md](traefik/TRAEFIK_DEPLOYMENT_GUIDE.md) | Production with Traefik |
| [📄 SWAGGER_API_GUIDE.md](Swagger/SWAGGER_API_GUIDE.md) | API documentation |
| [📄 DYNAMIC_ROLES_GUIDE.md](Docs/divers%20docs/DYNAMIC_ROLES_GUIDE.md) | Role management |

---

## 🏗️ Project Structure

```
carte-grise/
├── 📂 backend/                 # Node.js/Express API
│   ├── 📂 config/              # Database configuration
│   ├── 📂 scripts/             # SQL scripts
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # API controllers
│   │   ├── 📂 middleware/      # Auth, RBAC, etc.
│   │   ├── 📂 routes/          # Express routes
│   │   ├── 📂 services/        # Business logic
│   │   └── 📂 utils/           # Utilities
│   ├── 📄 Dockerfile
│   └── 📄 package.json
│
├── 📂 frontend/                # React application
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   ├── 📂 contexts/        # React contexts
│   │   ├── 📂 pages/           # Page components
│   │   └── 📂 services/        # API services
│   ├── 📄 Dockerfile
│   ├── 📄 nginx.conf
│   └── 📄 package.json
│
├── 📂 traefik/                 # Traefik configuration
├── 📄 docker-compose.yml       # Docker configuration
├── 📄 .env.example             # Environment template
└── 📄 .gitignore
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|--------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express-4-000000?logo=express) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) |
| **Auth** | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens) ![Bcrypt](https://img.shields.io/badge/Bcrypt-12_rounds-blue) |
| **Container** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker) ![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx) |
| **Security** | ![Helmet](https://img.shields.io/badge/Helmet.js-gray) ![CORS](https://img.shields.io/badge/CORS-Enabled-green) |

</div>

---

## 🔒 Security Features

- ✅ JWT Authentication with refresh tokens
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Role-Based Access Control (RBAC)
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ XSS and SQL injection protection
- ✅ Complete audit logging
- ✅ Non-root Docker containers

---

## 🐛 Troubleshooting

### 🔴 Common Issues

<details>
<summary><b>Container won't start</b></summary>

```bash
# Check logs
docker compose logs backend

# Clean restart
docker compose down
docker system prune
docker compose up -d
```
</details>

<details>
<summary><b>Database connection failed</b></summary>

```bash
# Check PostgreSQL status
docker compose ps postgres

# Test connection
docker exec -it cga-postgres psql -U postgres -d cga_db
```
</details>

<details>
<summary><b>Cannot login with default credentials</b></summary>

```bash
# Re-run the seed script
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```
</details>

<details>
<summary><b>Frontend shows blank page</b></summary>

```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend
docker compose build frontend
docker compose up -d frontend
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

Built with ❤️ for the **Gabonese Republic** 🇬🇦

Designed with official Gabon flag colors:
- 🟢 Green: `#009E60`
- 🟡 Yellow: `#FCD116`
- 🔵 Blue: `#3A75C4`

</div>

---

<div align="center">

**[⬆ Back to Top](#-cga---carte-grise-administrative)**

📧 **Questions?** Open an issue on GitHub

⭐ **Like this project?** Give it a star!

</div>
