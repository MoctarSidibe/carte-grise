# 🐳 Docker & Deployment Guide - CGA Application

## Complete Step-by-Step Guide for Beginners

This guide will help you dockerize and deploy the CGA (Carte Grise Administrative) application on an Ubuntu server.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Understanding Docker](#understanding-docker)
3. [Project Structure](#project-structure)
4. [Local Docker Setup](#local-docker-setup)
5. [Ubuntu Server Setup](#ubuntu-server-setup)
6. [Deployment to Ubuntu Server](#deployment-to-ubuntu-server)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## Prerequisites

### What You Need:
- **Local Machine:** Windows/Mac/Linux with Docker installed
- **Ubuntu Server:** Ubuntu 20.04 or 22.04 LTS
- **Server Access:** SSH access to your Ubuntu server
- **Domain Name:** (Optional but recommended for production)
- **Basic Knowledge:** Command line basics

---

## Understanding Docker

### What is Docker?

Docker is a platform that packages your application with all its dependencies into **containers**. Think of containers as lightweight, portable boxes that contain everything your app needs to run.

### Key Concepts:

- **Dockerfile:** Recipe to build a Docker image (like a blueprint)
- **Image:** Snapshot of your application (like a template)
- **Container:** Running instance of an image (like an actual app running)
- **Docker Compose:** Tool to run multiple containers together
- **Volume:** Persistent storage for container data

### Why Docker?

✅ **Consistency:** Works the same on dev, staging, and production
✅ **Isolation:** Each service runs in its own container
✅ **Scalability:** Easy to scale services independently
✅ **Portability:** Deploy anywhere Docker runs

---

## Project Structure

```
pca/
├── backend/
│   ├── Dockerfile              # Backend container recipe
│   ├── .dockerignore          # Files to exclude from image
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile              # Frontend container recipe
│   ├── .dockerignore
│   ├── nginx.conf             # Nginx configuration
│   └── package.json
├── docker-compose.yml          # Orchestrates all containers
├── .env.docker                 # Environment variables template
└── DOCKER_DEPLOYMENT_GUIDE.md  # This file
```

---

## Local Docker Setup

### Step 1: Install Docker

#### Windows/Mac:
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install and restart your computer
3. Verify installation:
```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu):
```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Configure Environment Variables

1. **Copy the environment template:**
```bash
cd /path/to/pca
cp .env.docker .env
```

2. **Edit the .env file:**
```bash
nano .env  # or use any text editor
```

3. **Update these critical values:**
```env
# Database
DB_PASSWORD=your-strong-password-here

# JWT Secrets (generate random 32+ character strings)
JWT_SECRET=use-command-below-to-generate
JWT_REFRESH_SECRET=use-command-below-to-generate
SESSION_SECRET=use-command-below-to-generate
```

4. **Generate secure random secrets:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Or online: https://generate.plus/en/base64
```

### Step 3: Build and Run Locally

1. **Build the Docker images:**
```bash
cd /path/to/pca
docker compose build
```

This will:
- Build the backend Node.js image
- Build the frontend React image with Nginx
- Pull the PostgreSQL image

2. **Start all services:**
```bash
docker compose up -d
```

The `-d` flag runs containers in detached mode (background).

3. **Check if containers are running:**
```bash
docker compose ps
```

You should see 3 containers:
- `cga-postgres` (database)
- `cga-backend` (API)
- `cga-frontend` (web interface)

4. **View logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

Press `Ctrl+C` to stop viewing logs.

5. **Initialize the database:**

First-time setup requires running SQL scripts:

```bash
# Copy SQL scripts to postgres container
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

6. **Access the application:**
- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Login:** admin / Admin@123456

### Step 4: Managing Docker Containers

#### Stop all services:
```bash
docker compose down
```

#### Stop and remove all data (including database):
```bash
docker compose down -v
```

⚠️ **Warning:** This deletes all database data!

#### Restart a specific service:
```bash
docker compose restart backend
```

#### View resource usage:
```bash
docker stats
```

#### Execute commands inside a container:
```bash
# Access backend container shell
docker exec -it cga-backend sh

# Access PostgreSQL
docker exec -it cga-postgres psql -U postgres -d cga_db
```

---

## Ubuntu Server Setup

### Step 1: Server Requirements

**Minimum Requirements:**
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **OS:** Ubuntu 20.04 or 22.04 LTS

**Recommended:**
- **CPU:** 4+ cores
- **RAM:** 8GB+
- **Storage:** 40GB+ SSD

### Step 2: Initial Server Configuration

1. **Connect to your server via SSH:**
```bash
ssh username@your-server-ip
```

Example:
```bash
ssh root@198.51.100.42
```

2. **Update the system:**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Create a new user (if using root):**
```bash
# Create user
sudo adduser cgaadmin

# Add to sudo group
sudo usermod -aG sudo cgaadmin

# Switch to new user
su - cgaadmin
```

4. **Configure firewall:**
```bash
# Enable firewall
sudo ufw enable

# Allow SSH (IMPORTANT!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (only if needed externally)
# sudo ufw allow 5432/tcp

# Check status
sudo ufw status
```

### Step 3: Install Docker on Ubuntu Server

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Apply group membership (logout and login, or use):
newgrp docker

# Test Docker
docker run hello-world
```

### Step 4: Install Git

```bash
sudo apt install -y git
git --version
```

---

## Deployment to Ubuntu Server

### Method 1: Using Git (Recommended)

#### Step 1: Clone the Repository

If your code is on GitHub/GitLab:

```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/your-username/pca.git

# Enter project directory
cd pca
```

Or if you need to push your local code to Git first:

```bash
# On your local machine
cd /path/to/pca
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/pca.git
git push -u origin main
```

#### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit environment variables
nano .env
```

**Update these values:**
```env
# Use strong passwords!
DB_PASSWORD=create-strong-password-here

# Generate secrets (run these commands):
# openssl rand -base64 32
JWT_SECRET=paste-generated-secret-here
JWT_REFRESH_SECRET=paste-generated-secret-here
SESSION_SECRET=paste-generated-secret-here

# Update URLs
FRONTEND_URL=http://your-domain.com
CORS_ORIGINS=http://your-domain.com,https://your-domain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Step 3: Build and Deploy

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

#### Step 4: Initialize Database

```bash
# Run database scripts
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# Verify database
docker exec -it cga-postgres psql -U postgres -d cga_db -c "\dt"
```

#### Step 5: Test the Application

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost
```

Access from browser: `http://your-server-ip`

### Method 2: Using SCP (File Transfer)

If you don't use Git:

#### On Your Local Machine:

```bash
# Create a tarball
cd /path/to/pca
tar -czf cga-app.tar.gz .

# Transfer to server
scp cga-app.tar.gz username@your-server-ip:~/
```

#### On Ubuntu Server:

```bash
# Extract files
cd ~
mkdir -p cga-app
tar -xzf cga-app.tar.gz -C cga-app
cd cga-app

# Continue with Step 2 of Method 1 (Configure Environment)
```

---

## SSL/HTTPS Setup

### Option 1: Let's Encrypt with Certbot (Recommended)

Let's Encrypt provides **free SSL certificates**.

#### Prerequisites:
- Domain name pointing to your server IP
- Ports 80 and 443 open

#### Step 1: Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 2: Stop Docker Nginx (temporary)

```bash
docker compose stop frontend
```

#### Step 3: Obtain Certificate

```bash
# Replace with your domain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certificates will be saved to:
- Certificate: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

#### Step 4: Create Nginx SSL Configuration

```bash
cd ~/pca
mkdir -p nginx/ssl
```

Create `nginx/nginx-ssl.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 5: Update docker-compose.yml

Update frontend service:

```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
    - ./nginx/nginx-ssl.conf:/etc/nginx/conf.d/default.conf
  ports:
    - "80:80"
    - "443:443"
```

#### Step 6: Restart Services

```bash
docker compose up -d
```

#### Step 7: Auto-Renew Certificates

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot will auto-renew via cron
```

### Option 2: Cloudflare SSL (Easiest)

1. Sign up for [Cloudflare](https://cloudflare.com) (free)
2. Add your domain
3. Update nameservers at your domain registrar
4. Enable "Full" SSL mode in Cloudflare dashboard
5. Cloudflare handles SSL automatically!

---

## Monitoring & Maintenance

### Docker Health Checks

Check container health:

```bash
docker compose ps
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

### View Logs

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Specific service
docker compose logs -f backend
```

### Backup Database

#### Manual Backup:

```bash
# Create backup
docker exec cga-postgres pg_dump -U postgres cga_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i cga-postgres psql -U postgres cga_db < backup_20231201.sql
```

#### Automated Daily Backup Script:

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/cgaadmin/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="cga_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec cga-postgres pg_dump -U postgres cga_db > $BACKUP_DIR/$FILENAME

# Compress backup
gzip $BACKUP_DIR/$FILENAME

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME.gz"
```

Make executable and schedule:

```bash
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/cgaadmin/backup.sh >> /home/cgaadmin/backup.log 2>&1
```

### Update Application

```bash
# Pull latest changes (if using Git)
cd ~/pca
git pull

# Rebuild images
docker compose build

# Restart services
docker compose up -d

# View logs
docker compose logs -f
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### System Monitoring with htop

```bash
# Install htop
sudo apt install -y htop

# Run
htop
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Container won't start

```bash
# Check logs
docker compose logs backend

# Common issues:
# - Database not ready: Wait 30 seconds and restart
# - Port already in use: Change port in .env
```

#### 2. Database connection failed

```bash
# Check if postgres is healthy
docker compose ps

# Restart database
docker compose restart postgres

# Check backend can reach postgres
docker exec cga-backend ping postgres
```

#### 3. Frontend can't reach backend

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check nginx.conf proxy settings
docker exec cga-frontend cat /etc/nginx/conf.d/default.conf
```

#### 4. Permission denied errors

```bash
# Fix file permissions
sudo chown -R $USER:$USER ~/pca

# Fix upload directory
docker exec cga-backend chown -R nodejs:nodejs /app/uploads
```

#### 5. Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a -f --volumes

# Clean logs
docker compose down
rm -rf logs/*
docker compose up -d
```

#### 6. SSL certificate errors

```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Restart nginx
docker compose restart frontend
```

### Debug Mode

Enable debug logging:

```bash
# Edit .env
LOG_LEVEL=debug

# Restart services
docker compose restart backend

# View detailed logs
docker compose logs -f backend
```

---

## Security Best Practices

### 1. Environment Variables

✅ **Never commit .env to Git**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

✅ **Use strong secrets**
```bash
# Generate strong secrets
openssl rand -base64 32
```

### 2. Database Security

✅ **Strong passwords**
```env
DB_PASSWORD=veryStrongPassword123!@#
```

✅ **Don't expose PostgreSQL externally**
```yaml
# In docker-compose.yml, remove:
# ports:
#   - "5432:5432"
```

✅ **Regular backups**

### 3. Firewall Configuration

```bash
# Only allow necessary ports
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

### 4. Regular Updates

```bash
# Update Docker images
docker compose pull
docker compose up -d

# Update server packages
sudo apt update && sudo apt upgrade -y
```

### 5. Monitoring & Alerts

Consider using:
- **Uptime Kuma** (self-hosted monitoring)
- **Netdata** (system monitoring)
- **Portainer** (Docker GUI management)

### 6. Rate Limiting

Already configured in backend:
- 100 requests per 15 minutes per IP
- Adjust in .env if needed

---

## Performance Optimization

### 1. Resource Limits

Add to docker-compose.yml:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

### 2. Enable Redis Caching (Optional)

Add Redis to docker-compose.yml:

```yaml
redis:
  image: redis:7-alpine
  container_name: cga-redis
  restart: unless-stopped
  volumes:
    - redis_data:/data
  networks:
    - cga-network
```

### 3. Database Optimization

```sql
-- Connect to database
docker exec -it cga-postgres psql -U postgres -d cga_db

-- Create indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
```

---

## Useful Commands Cheat Sheet

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f [service_name]

# Restart a service
docker compose restart [service_name]

# Rebuild a service
docker compose build [service_name]

# Execute command in container
docker exec -it [container_name] [command]

# Shell access
docker exec -it cga-backend sh

# Database access
docker exec -it cga-postgres psql -U postgres -d cga_db

# View resource usage
docker stats

# Clean up
docker system prune -a

# Backup database
docker exec cga-postgres pg_dump -U postgres cga_db > backup.sql

# Check container health
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

---

## Next Steps

1. ✅ Set up SSL with Let's Encrypt
2. ✅ Configure automated backups
3. ✅ Set up monitoring (Uptime Kuma/Netdata)
4. ✅ Configure email notifications
5. ✅ Test disaster recovery
6. ✅ Document your specific configuration
7. ✅ Train your team

---

## Support & Resources

- **Docker Documentation:** https://docs.docker.com
- **Docker Compose:** https://docs.docker.com/compose/
- **Let's Encrypt:** https://letsencrypt.org/getting-started/
- **Ubuntu Server Guide:** https://ubuntu.com/server/docs
- **Nginx Documentation:** https://nginx.org/en/docs/

---

**Congratulations! You've successfully dockerized and deployed the CGA application!** 🎉

For the French version of this guide, see [DOCKER_DEPLOYMENT_GUIDE.fr.md](DOCKER_DEPLOYMENT_GUIDE.fr.md)
