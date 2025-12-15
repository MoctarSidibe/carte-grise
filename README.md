# CGA - Carte Grise Administrative 🇬🇦

**Modern Professional Web Application for Administrative Vehicle Registration with Dynamic Workflows, RBAC, and Secure Digital Signatures**

> 🇫🇷 **Version Française** : [README.fr.md](./README.fr.md) - Complete French documentation

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](docker-compose.yml)
[![Traefik](https://img.shields.io/badge/Traefik-Enabled-24A1C1?logo=traefikproxy)](docker-compose.traefik.yml)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18-339933?logo=node.js)](package.json)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](package.json)

---

## 🚀 Quick Start for Beginners

**Choose your path based on your experience level:**

### 🟢 Path 1: Local Development (5 minutes)
Perfect for: Learning, testing, development on your computer

```bash
# 1. Copy environment variables
cp .env.docker .env

# 2. Start everything with Docker
docker compose up -d

# 3. Initialize database
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# 4. Access the app
# Frontend: http://localhost
# Login: admin / Admin@123456
```

**📖 Full Guide:** [Local Development Setup](#local-development-setup)

---

### 🟡 Path 2: Production with Nginx (30 minutes)
Perfect for: Simple production deployment, basic SSL setup

**Requirements:** Ubuntu server, domain name (optional)

```bash
# See: DOCKER_DEPLOYMENT_GUIDE.md
# Complete step-by-step guide for Ubuntu deployment
```

**📖 Full Guide:** [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)

---

### 🔵 Path 3: Production with Traefik (Recommended - 30 minutes)
Perfect for: Professional production, automatic SSL, monitoring dashboard

**Requirements:** Ubuntu server, domain name (required for SSL)

```bash
# 1. Clone repository
git clone https://github.com/your-username/pca.git
cd pca

# 2. Copy Traefik environment
cp .env.traefik .env

# 3. Edit configuration
nano .env
# Update: DOMAIN=yourdomain.com
# Update: LETSENCRYPT_EMAIL=your@email.com

# 4. Deploy with Traefik
docker compose -f docker-compose.traefik.yml up -d

# 5. Initialize database
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# 6. Access (automatic HTTPS!)
# Frontend: https://yourdomain.com
# Dashboard: https://traefik.yourdomain.com
```

**📖 Full Guide:** [TRAEFIK_DEPLOYMENT_GUIDE.md](TRAEFIK_DEPLOYMENT_GUIDE.md)

---

## 📚 Complete Documentation Library

### 🎯 Getting Started
- **[README.md](README.md)** - This file (English)
- **[README.fr.md](README.fr.md)** - French version

### 🐳 Docker & Deployment
- **[DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)** - Complete Docker deployment (English)
- **[DOCKER_DEPLOYMENT_GUIDE.fr.md](DOCKER_DEPLOYMENT_GUIDE.fr.md)** - Docker deployment (French)
- **[DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)** - Quick commands cheat sheet
- **[DOCKER_QUICK_REFERENCE.fr.md](DOCKER_QUICK_REFERENCE.fr.md)** - French quick reference
- **[DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md)** - Deployment summary

### 🚀 Traefik (Professional Production)
- **[TRAEFIK_DEPLOYMENT_GUIDE.md](TRAEFIK_DEPLOYMENT_GUIDE.md)** - Complete Traefik setup

### 📱 Features & Guides
- **[MOBILE_RESPONSIVE_GUIDE.md](MOBILE_RESPONSIVE_GUIDE.md)** - Mobile responsiveness guide
- **[GABON_THEME_GUIDE.md](GABON_THEME_GUIDE.md)** - Gabon theme usage guide
- **[DYNAMIC_ROLES_GUIDE.md](DYNAMIC_ROLES_GUIDE.md)** - Dynamic roles system
- **[SWAGGER_API_GUIDE.md](SWAGGER_API_GUIDE.md)** - Interactive API documentation guide

### 📊 Implementation Summaries
- **[DEVOPS_IMPLEMENTATION_SUMMARY.md](DEVOPS_IMPLEMENTATION_SUMMARY.md)** - Complete DevOps overview
- **[TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md)** - Project transformation history

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

CGA (Carte Grise Administrative) is a modern enterprise web application designed to manage the complete process of obtaining administrative vehicle registration for the **Gabonese Republic** 🇬🇦.

### Key Highlights

- **🇬🇦 Gabon Theme:** Official flag colors (Green #009E60, Yellow #FCD116, Blue #3A75C4)
- **🔄 Dynamic Roles:** Fully configurable business roles (Patrimoine, DCRTCT, etc.)
- **📱 Mobile Responsive:** Optimized for all devices (smartphones, tablets, desktops)
- **🔒 Enterprise Security:** JWT authentication, RBAC, audit logging
- **🐳 Docker Ready:** Complete containerization with Docker Compose
- **🚀 Production Ready:** Traefik integration with automatic SSL

---

## ✨ Features

### 🎨 Modern Design

- **Patriotic Interface:** Gabon flag colors throughout the application
- **Responsive Design:** Mobile-first approach, works on all screen sizes
- **Material-UI:** Professional, polished components
- **Flag Stripes:** Decorative horizontal bands (Green, Yellow, Blue)
- **Smooth Animations:** Slide, fade, and hover effects
- **Intuitive Navigation:** Clear menu structure with role-based access

### 🔧 Core Functionality

- ✅ **Dynamic Roles:** Create business roles without code changes
- ✅ **Dynamic Workflows:** Configurable multi-step validation processes
- ✅ **RBAC System:** Granular permissions management
- ✅ **Dynamic Forms:** Create and modify forms without coding
- ✅ **Digital Signatures:** Secure electronic signatures with certificates
- ✅ **Document Management:** Secure upload and storage
- ✅ **Complete Audit:** Full traceability of all actions
- ✅ **Notifications:** Real-time notification system
- ✅ **Multi-step Workflows:** Support for complex conditional workflows

### 🔒 Security Features

- 🔒 JWT Authentication with refresh tokens
- 🔒 Bcrypt password hashing (12 rounds)
- 🔒 CSRF, XSS, and SQL injection protection
- 🔒 Rate limiting on all routes (100 req/15min)
- 🔒 Input validation with Joi
- 🔒 Helmet.js security headers
- 🔒 Complete audit logging
- 🔒 Non-root container users

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js 18 with Express
- PostgreSQL 15
- Sequelize ORM
- JWT authentication
- Winston logging

**Frontend:**
- React 18
- Material-UI 5
- React Router v6
- Axios
- Formik

**Infrastructure:**
- Docker & Docker Compose
- Nginx (standard) or Traefik (recommended)
- Let's Encrypt SSL (automatic with Traefik)
- PostgreSQL persistent volumes

### System Architecture

```
┌─────────────────────────────────────────────┐
│              Internet / Users               │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────▼────────┐
          │   Traefik       │  Automatic SSL
          │  (or Nginx)     │  Load Balancer
          └────────┬────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────┐        ┌──────▼──────┐
│  Frontend   │        │   Backend   │
│  (React)    │◄───────│  (Node.js)  │
│   Nginx     │  API   │   Express   │
└─────────────┘        └──────┬──────┘
                              │
                       ┌──────▼──────┐
                       │ PostgreSQL  │
                       │  Database   │
                       └─────────────┘
```

### Project Structure

```
pca/
├── backend/
│   ├── config/              # Database configuration
│   ├── scripts/             # SQL scripts
│   │   ├── 01_create_database.sql
│   │   ├── 02_create_tables.sql
│   │   └── 03_seed_data.sql
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth, RBAC, audit, etc.
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── App.js
│   ├── Dockerfile
│   └── nginx.conf
├── traefik/                 # Traefik configuration
│   ├── traefik.yml          # Static config
│   └── dynamic/             # Dynamic config
│       └── middlewares.yml
├── docker-compose.yml       # Standard Docker setup
├── docker-compose.traefik.yml  # Traefik setup
├── .env.docker              # Environment template
├── .env.traefik             # Traefik environment template
└── [Documentation files]
```

---

## 🔧 Prerequisites

### For Local Development

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** v2.0+
- **Git**
- **Text Editor** (VS Code, Sublime, etc.)

**Install Docker:**
- Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: [Docker Engine](https://docs.docker.com/engine/install/)

### For Production Deployment

- **Ubuntu Server** 20.04 or 22.04 LTS
- **Minimum:** 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended:** 4 CPU cores, 8GB RAM, 40GB SSD
- **Domain Name** (required for Traefik with SSL)
- **SSH Access** to server

---

## 🚀 Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/pca.git

# Navigate to project directory
cd pca
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# (Optional) Edit environment variables
nano .env
```

**Default configuration works for local development!**

### Step 3: Start Docker Services

```bash
# Build and start all services
docker compose up -d

# This will start:
# - PostgreSQL database (port 5432)
# - Backend API (port 5000)
# - Frontend app (port 80)
```

**What happens:**
- Downloads required Docker images (first time only)
- Builds backend and frontend images
- Starts PostgreSQL, Backend, Frontend containers
- Takes ~2-5 minutes on first run

### Step 4: Initialize Database

```bash
# Create database tables
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Seed initial data (admin user + system role)
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

**What this does:**
- Creates all database tables (users, roles, applications, etc.)
- Creates SYSTEM_ADMIN role
- Creates default admin user

### Step 5: Verify Installation

```bash
# Check all containers are running
docker compose ps

# You should see 3 containers:
# - cga-postgres (healthy)
# - cga-backend (healthy)
# - cga-frontend (healthy)

# Check logs (optional)
docker compose logs -f
```

### Step 6: Access Application

Open your browser and navigate to:

**Frontend:** http://localhost

**Default Credentials:**
- Username: `admin`
- Password: `Admin@123456`

**Backend API:** http://localhost:5000
- Health check: http://localhost:5000/api/health
- **API Documentation (Swagger UI):** http://localhost:5000/api-docs 📚

**Swagger UI Features:**
- 🎨 Styled with Gabon flag colors (Green, Yellow, Blue)
- 🔐 Test authenticated endpoints directly in browser
- 📖 Complete API reference with request/response schemas
- 🚀 Perfect for frontend/backend collaboration

> **📘 Complete Guide:** See [SWAGGER_API_GUIDE.md](SWAGGER_API_GUIDE.md) for detailed usage instructions

### Step 7: Start Developing!

**View logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

**Restart after code changes:**
```bash
# Rebuild and restart
docker compose up -d --build

# Or restart specific service
docker compose restart backend
```

**Stop everything:**
```bash
# Stop containers (data preserved)
docker compose down

# Stop and remove volumes (deletes data!)
docker compose down -v
```

---

## 🌐 Production Deployment

### Option 1: Standard Deployment with Nginx

**Best for:** Simple deployments, existing Nginx experience

**📖 Complete Guide:** [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)

**Quick Summary:**
```bash
# 1. Setup Ubuntu server
# 2. Install Docker
# 3. Clone repository
# 4. Configure .env
# 5. Deploy: docker compose up -d
# 6. Setup SSL with Certbot
```

**Time:** ~30-60 minutes

---

### Option 2: Professional Deployment with Traefik (Recommended)

**Best for:** Production environments, automatic SSL, professional setup

**📖 Complete Guide:** [TRAEFIK_DEPLOYMENT_GUIDE.md](TRAEFIK_DEPLOYMENT_GUIDE.md)

#### Why Traefik?

✅ **Automatic SSL** - Let's Encrypt integration, zero configuration
✅ **Auto-renewal** - Certificates renew automatically
✅ **Dashboard** - Visual monitoring included
✅ **Service Discovery** - Automatically detects services
✅ **Load Balancing** - Built-in and automatic
✅ **Zero-downtime** - Config updates without restart

#### Quick Deployment

**Prerequisites:**
- Ubuntu server with Docker installed
- Domain name pointing to server IP
- Ports 80 and 443 open

**Step 1: Clone and Configure**

```bash
# On your Ubuntu server
git clone https://github.com/your-username/pca.git
cd pca

# Copy Traefik environment
cp .env.traefik .env

# Edit configuration
nano .env
```

**Update these values in `.env`:**

```env
# Your domain (REQUIRED)
DOMAIN=yourdomain.com

# Let's Encrypt email (REQUIRED)
LETSENCRYPT_EMAIL=your-email@example.com

# Database password (CHANGE THIS!)
DB_PASSWORD=create-strong-password-here

# Generate secrets (run: openssl rand -base64 32)
JWT_SECRET=paste-generated-secret-here
JWT_REFRESH_SECRET=paste-generated-secret-here
SESSION_SECRET=paste-generated-secret-here
```

**Generate secrets:**
```bash
# Run this 3 times to generate 3 secrets
openssl rand -base64 32
```

**Step 2: Update Traefik Configuration**

Edit `traefik/traefik.yml`:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # YOUR EMAIL
      # ...
      domains:
        - main: yourdomain.com       # YOUR DOMAIN
          sans:
            - www.yourdomain.com     # YOUR DOMAIN
```

**Step 3: Generate Dashboard Password**

```bash
# Install htpasswd
sudo apt install -y apache2-utils

# Generate password (replace 'your-password' with a strong password)
htpasswd -nb admin your-password

# Copy the output (looks like: admin:$apr1$...)
```

Edit `traefik/dynamic/middlewares.yml`:

```yaml
dashboard-auth:
  basicAuth:
    users:
      - "admin:$apr1$YOUR_HASH_HERE"  # Paste your hash here
```

**Step 4: Deploy**

```bash
# Build images
docker compose -f docker-compose.traefik.yml build

# Start services
docker compose -f docker-compose.traefik.yml up -d

# Check status
docker compose -f docker-compose.traefik.yml ps
```

**Step 5: Initialize Database**

```bash
# Wait 30 seconds for services to start

# Create tables
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Seed data
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

**Step 6: Verify**

```bash
# Check services
docker compose -f docker-compose.traefik.yml ps

# View logs
docker compose -f docker-compose.traefik.yml logs -f traefik

# Test SSL (after a minute for cert generation)
curl -I https://yourdomain.com
```

**Step 7: Access Your Application**

- **Frontend:** https://yourdomain.com (automatic HTTPS!)
- **Backend API:** https://yourdomain.com/api
- **Traefik Dashboard:** https://traefik.yourdomain.com
  - Username: admin
  - Password: (what you set with htpasswd)

**That's it! Your application is live with automatic HTTPS!** 🎉

---

## ⚙️ Configuration

### Environment Variables

**Database:**
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cga_db
DB_USER=postgres
DB_PASSWORD=your-strong-password
```

**JWT Authentication:**
```env
JWT_SECRET=your-secret-32-chars-min
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

**Application:**
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Email (Optional):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

**Security:**
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760  # 10MB
```

### Generate Secure Secrets

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Online
# https://generate.plus/en/base64
```

---

## 📖 Usage

### Default Login

After installation, log in with:
- **Username:** `admin`
- **Password:** `Admin@123456`

⚠️ **Change the default password immediately after first login!**

### Creating Roles

1. Log in as SYSTEM_ADMIN
2. Navigate to **Roles** page
3. Click **Create Role**
4. Enter role details:
   - Name: e.g., "Patrimoine", "DCRTCT"
   - Description: Role purpose
   - Permissions: Select from available permissions
5. Save

**Example Roles:**
- **Patrimoine** - Vehicle asset management
- **DCRTCT** - Technical control validation
- **Agent Accueil** - Reception and initial processing
- **Validateur** - Document validation

### Creating Users

1. Navigate to **Users** page
2. Click **Create User**
3. Enter user details:
   - Username
   - Email
   - Password
   - Assign roles
4. Save

### Managing Applications

**Submit New Application:**
1. Navigate to **Applications** > **New Application**
2. Fill in vehicle information
3. Upload required documents
4. Submit for validation

**Track Application:**
1. Navigate to **Applications**
2. View list of all applications
3. Click on application for details
4. See current workflow step and status

---

## 🔌 API Documentation

### Authentication Endpoints

**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "Admin@123456"
}
```

Response:
```json
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "username": "admin",
    "roles": ["SYSTEM_ADMIN"]
  }
}
```

**POST** `/api/auth/refresh`
```json
{
  "refreshToken": "your-refresh-token"
}
```

**POST** `/api/auth/logout`
```
Authorization: Bearer <token>
```

### Role Management (SYSTEM_ADMIN only)

**GET** `/api/roles` - List all roles
**POST** `/api/roles` - Create new role
**GET** `/api/roles/:id` - Get role details
**PUT** `/api/roles/:id` - Update role
**DELETE** `/api/roles/:id` - Delete role

**Example - Create Role:**
```bash
curl -X POST https://yourdomain.com/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Patrimoine",
    "description": "Gestion du patrimoine véhicule",
    "permissions": ["view_applications", "create_applications"]
  }'
```

### Application Endpoints

**GET** `/api/applications` - List applications
**POST** `/api/applications` - Create application
**GET** `/api/applications/:id` - Get application details
**PUT** `/api/applications/:id` - Update application
**DELETE** `/api/applications/:id` - Delete application

### Health Check

**GET** `/api/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-09T10:30:00.000Z",
  "service": "cga-backend",
  "database": "connected"
}
```

---

## 🔒 Security

### Best Practices Implemented

✅ **Authentication:**
- JWT tokens with expiration
- Refresh token rotation
- Bcrypt password hashing (12 rounds)

✅ **Authorization:**
- Role-based access control (RBAC)
- Permission-based endpoints
- Middleware validation

✅ **Protection:**
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 req/15min)
- CSRF protection
- XSS protection
- SQL injection prevention (Sequelize ORM)

✅ **Audit:**
- Complete action logging
- User activity tracking
- Database audit trail

✅ **Docker:**
- Non-root users in containers
- Read-only file systems
- Minimal base images (Alpine)
- No privileged mode

### Security Checklist

Before production:

- [ ] Change default admin password
- [ ] Generate strong JWT secrets
- [ ] Set strong database password
- [ ] Configure firewall (UFW)
- [ ] Enable SSL/HTTPS
- [ ] Configure email notifications
- [ ] Set up automated backups
- [ ] Review CORS origins
- [ ] Configure rate limits
- [ ] Enable audit logging
- [ ] Update security headers
- [ ] Restrict database access
- [ ] Set up monitoring

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Containers won't start

**Check logs:**
```bash
docker compose logs backend
```

**Common causes:**
- Port already in use (change in .env)
- Missing .env file (copy from .env.docker)
- Database not ready (wait 30 seconds)

**Solution:**
```bash
# Stop everything
docker compose down

# Clean up
docker system prune

# Start fresh
docker compose up -d
```

#### 2. Database connection failed

**Check PostgreSQL:**
```bash
docker compose ps postgres
```

**Test connection:**
```bash
docker exec -it cga-postgres psql -U postgres -d cga_db
```

**Restart database:**
```bash
docker compose restart postgres
```

#### 3. Cannot login

**Reset admin password:**
```bash
# Access database
docker exec -it cga-postgres psql -U postgres -d cga_db

# Update password (hash for Admin@123456)
UPDATE users SET password_hash='$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIpKk1o0p2' WHERE username='admin';
```

#### 4. Frontend shows blank page

**Check frontend logs:**
```bash
docker compose logs frontend
```

**Check backend is accessible:**
```bash
curl http://localhost:5000/api/health
```

**Rebuild frontend:**
```bash
docker compose build frontend
docker compose up -d frontend
```

#### 5. SSL certificate not working (Traefik)

**Check DNS:**
```bash
dig yourdomain.com +short
# Must show your server IP
```

**Check Traefik logs:**
```bash
docker compose -f docker-compose.traefik.yml logs traefik | grep -i acme
```

**Use staging first:**
Edit `traefik/traefik.yml`, uncomment staging line, restart Traefik.

**Wait 2-5 minutes** for certificate generation.

### Getting Help

**View all logs:**
```bash
docker compose logs -f
```

**Check service health:**
```bash
docker compose ps
```

**Test database:**
```bash
docker exec -it cga-postgres pg_isready -U postgres
```

**Clean start:**
```bash
docker compose down -v
docker system prune -a
docker compose up -d
```

**For more help:**
- Check [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)
- Check [TRAEFIK_DEPLOYMENT_GUIDE.md](TRAEFIK_DEPLOYMENT_GUIDE.md)
- Review [Troubleshooting sections](#troubleshooting) in guides

---

## 🚀 Next Steps

After successful deployment:

1. ✅ **Change default passwords**
2. ✅ **Create business roles** (Patrimoine, DCRTCT, etc.)
3. ✅ **Create users** and assign roles
4. ✅ **Configure workflows** for your processes
5. ✅ **Set up automated backups** (see deployment guides)
6. ✅ **Configure monitoring** (Uptime Kuma, Netdata)
7. ✅ **Set up email notifications**
8. ✅ **Train your team**
9. ✅ **Test disaster recovery**
10. ✅ **Document your processes**

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Material-UI 5, React Router v6 |
| **Backend** | Node.js 18, Express.js, Sequelize ORM |
| **Database** | PostgreSQL 15 |
| **Authentication** | JWT, Bcrypt |
| **Containerization** | Docker, Docker Compose |
| **Reverse Proxy** | Nginx or Traefik |
| **SSL** | Let's Encrypt |
| **Logging** | Winston |
| **Validation** | Joi |
| **Security** | Helmet.js, CORS, Rate Limiting |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for the **Gabonese Republic** 🇬🇦
- Designed with Gabon flag colors (Green, Yellow, Blue)
- Built with ❤️ by Claude Code Assistant

---

## 📞 Support

For questions or issues:
1. Check the documentation guides above
2. Review troubleshooting sections
3. Open an issue on GitHub
4. Contact your system administrator

---

**🎉 Congratulations! You're ready to use CGA!**

**Choose your deployment path above and get started in minutes!**

---

**Last Updated:** 2025-12-09
**Version:** 1.0.0
**Status:** ✅ Production Ready
