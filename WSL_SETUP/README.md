# 🐧 WSL Setup Guide - CGA Local Development

## Run CGA on Windows using WSL2 + Docker

**Date:** 2025-12-09
**Target:** Windows 10/11 with WSL2
**Perfect for:** Local development, then deploy to Ubuntu server
**Status:** 🚀 READY TO USE

> 🇫🇷 **Version Française:** [README.fr.md](README.fr.md)

---

## 📋 Table of Contents

- [What is WSL?](#what-is-wsl)
- [Why WSL for CGA Development?](#why-wsl-for-cga-development)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Docker Compose Strategy](#docker-compose-strategy)
- [Running CGA on WSL](#running-cga-on-wsl)
- [Troubleshooting](#troubleshooting)
- [Deploy to Ubuntu Server](#deploy-to-ubuntu-server)

---

## 🎯 What is WSL?

**WSL (Windows Subsystem for Linux)** allows you to run a Linux environment directly on Windows, without a virtual machine!

**WSL2** = Full Linux kernel running on Windows
- ✅ Real Linux (not emulation)
- ✅ Full Docker support
- ✅ Fast file system
- ✅ Integrated with Windows

**Perfect for:**
- Development on Windows
- Testing Linux deployments
- Learning Linux commands
- Running Docker containers

---

## 🚀 Why WSL for CGA Development?

### Benefits

✅ **Same Environment** - WSL Ubuntu = Ubuntu Server (same commands!)
✅ **Easy Testing** - Test locally before deploying to server
✅ **Windows Integration** - Edit files in VS Code (Windows), run in WSL
✅ **Docker Native** - Docker runs better in WSL than Docker Desktop
✅ **No Dual Boot** - Keep Windows + have Linux
✅ **Fast** - Near-native Linux performance

### Development Workflow

```
1. Write code in Windows (VS Code)
   ↓
2. Files auto-sync to WSL
   ↓
3. Run Docker in WSL (Linux)
   ↓
4. Test in browser (Windows)
   ↓
5. Deploy exact same setup to Ubuntu server!
```

---

## 🏗️ Architecture Overview

### Your Setup

```
┌─────────────────────────────────────────────────┐
│            Windows 10/11                         │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  VS Code (Windows)                       │    │
│  │  - Edit frontend/src/                    │    │
│  │  - Edit backend/src/                     │    │
│  └──────────────┬──────────────────────────┘    │
│                 │ Files automatically synced     │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │  WSL2 Ubuntu                             │    │
│  │  ┌───────────────────────────────────┐   │    │
│  │  │  Docker                           │   │    │
│  │  │  ┌──────────┐  ┌──────────┐      │   │    │
│  │  │  │ Backend  │  │ Frontend │      │   │    │
│  │  │  │ (Node.js)│  │  (React) │      │   │    │
│  │  │  └────┬─────┘  └─────┬────┘      │   │    │
│  │  │       │               │           │   │    │
│  │  │       ▼               │           │   │    │
│  │  │  ┌──────────┐         │           │   │    │
│  │  │  │PostgreSQL│         │           │   │    │
│  │  │  └──────────┘         │           │   │    │
│  │  └────────────┬───────────┼──────────┘   │    │
│  └───────────────┼───────────┼──────────────┘    │
│                  │           │                   │
│                  ▼           ▼                   │
│  ┌──────────────────────────────────────────┐   │
│  │  Browser (Windows)                        │   │
│  │  http://localhost:3000 → Frontend         │   │
│  │  http://localhost:5000 → Backend          │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Benefits of This Setup

✅ **Edit in Windows** - Use your favorite Windows editor
✅ **Run in Linux** - Docker containers run in WSL (Linux)
✅ **Access from Windows** - Browser and tools in Windows
✅ **Same as Production** - WSL Ubuntu = Ubuntu Server

---

## ✅ Prerequisites

### 1. Windows Requirements

- **Windows 10** version 2004+ (Build 19041+)
- **Windows 11** (any version)
- **64-bit system**
- **Virtualization enabled** in BIOS

### 2. Check Windows Version

```powershell
# Open PowerShell
# Run this command:
winver

# You should see:
# Windows 10 Version 2004 or higher
# OR Windows 11
```

### 3. Enable Virtualization

```
1. Restart computer
2. Enter BIOS (usually F2, F12, or Del key)
3. Find "Virtualization" or "Intel VT-x" or "AMD-V"
4. Enable it
5. Save and exit
```

---

## ⚡ Quick Start

### For Absolute Beginners (30 minutes)

```powershell
# 1. Install WSL (PowerShell as Admin)
wsl --install

# 2. Restart computer

# 3. Open Ubuntu from Start Menu
#    Set username and password

# 4. Update Ubuntu
sudo apt update && sudo apt upgrade -y

# 5. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 6. Restart WSL
exit
wsl --shutdown

# 7. Open Ubuntu again

# 8. Clone CGA project
cd ~
git clone https://github.com/your-repo/pca.git
cd pca

# 9. Start CGA
cp .env.docker .env
docker compose up -d

# 10. Open browser (Windows)
http://localhost:3000
```

**Done! CGA is running! 🎉**

---

## 📖 Step-by-Step Setup

### STEP 1: Install WSL2

#### 1.1: Open PowerShell as Administrator

```
1. Press Windows key
2. Type "PowerShell"
3. Right-click "Windows PowerShell"
4. Click "Run as Administrator"
```

#### 1.2: Install WSL

```powershell
# This installs WSL2 + Ubuntu by default
wsl --install

# If you already have WSL1, upgrade to WSL2:
wsl --set-default-version 2
```

**Output:**
```
Installing: Windows Subsystem for Linux
Installing: Ubuntu
The requested operation is successful. Changes will take effect after reboot.
```

#### 1.3: Restart Computer

```powershell
# Restart now
shutdown /r /t 0
```

#### 1.4: First Ubuntu Setup

After restart:
```
1. Ubuntu will open automatically
2. Wait for installation to complete (2-3 minutes)
3. Create username:
   Enter new UNIX username: yourname

4. Create password:
   New password: ********
   Retype password: ********

5. Done! You're now in Ubuntu!
```

---

### STEP 2: Setup Ubuntu in WSL

#### 2.1: Update System

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git wget nano
```

#### 2.2: Check WSL Version

```bash
# From PowerShell (Windows)
wsl --list --verbose

# Output should show:
#   NAME      STATE           VERSION
# * Ubuntu    Running         2        ← Should be 2!
```

If VERSION is 1:
```powershell
# Upgrade to WSL2
wsl --set-version Ubuntu 2
```

---

### STEP 3: Install Docker in WSL

#### 3.1: Install Docker Engine

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation
sudo sh get-docker.sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker
```

#### 3.2: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker compose version
# Output: Docker Compose version v2.x.x
```

#### 3.3: Start Docker Service

```bash
# Start Docker
sudo service docker start

# Check status
sudo service docker status
# Should show: Docker is running

# Test Docker
docker run hello-world
# Should download and run test container
```

#### 3.4: Auto-Start Docker (Optional)

```bash
# Edit .bashrc
nano ~/.bashrc

# Add at the end:
if ! sudo service docker status > /dev/null 2>&1; then
    sudo service docker start > /dev/null 2>&1
fi

# Save (Ctrl+X, Y, Enter)

# Reload
source ~/.bashrc
```

---

### STEP 4: Setup CGA Project

#### 4.1: Navigate to Project Location

**Option A: Use Windows files from WSL**

```bash
# Access Windows C: drive
cd /mnt/c/Users/user/Downloads/pca

# ⚠️ WARNING: Slower file performance!
# Docker on Windows files = slow
```

**Option B: Clone to WSL (RECOMMENDED!)**

```bash
# Go to WSL home
cd ~

# Clone project
git clone https://github.com/your-repo/pca.git

# Or copy from Windows
cp -r /mnt/c/Users/user/Downloads/pca ~/pca

# Navigate
cd ~/pca
```

**💡 Why Option B is better:**
- ✅ Much faster file I/O
- ✅ Better Docker performance
- ✅ Recommended by Docker

#### 4.2: Check Project Structure

```bash
ls -la

# You should see:
# backend/
# frontend/
# docker-compose.yml
# .env.docker
# etc.
```

---

### STEP 5: Configure Environment

#### 5.1: Copy Environment File

```bash
# Use Docker environment template
cp .env.docker .env

# View file
cat .env
```

#### 5.2: Edit if Needed (Optional)

```bash
# Edit environment
nano .env

# Important variables:
# POSTGRES_PASSWORD=your_secure_password
# JWT_SECRET=your_jwt_secret
# NODE_ENV=development

# Save: Ctrl+X, Y, Enter
```

#### 5.3: Verify Docker Compose File

```bash
# Check docker-compose.yml
cat docker-compose.yml

# Should contain 3 services:
# - postgres
# - backend
# - frontend
```

---

### STEP 6: Run Docker Containers

#### 6.1: Build and Start Services

```bash
# Build and start all containers
docker compose up -d

# Output:
# [+] Running 4/4
#  ✔ Network pca_default         Created
#  ✔ Container cga-postgres      Started
#  ✔ Container cga-backend       Started
#  ✔ Container cga-frontend      Started
```

#### 6.2: Check Container Status

```bash
# Check running containers
docker compose ps

# Should show:
# NAME              STATUS        PORTS
# cga-postgres      Up            5432/tcp
# cga-backend       Up (healthy)  0.0.0.0:5000->5000/tcp
# cga-frontend      Up            0.0.0.0:80->80/tcp
```

#### 6.3: View Logs

```bash
# View all logs
docker compose logs

# Follow logs (live)
docker compose logs -f

# View specific service
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Stop following: Ctrl+C
```

---

### STEP 7: Initialize Database

#### 7.1: Wait for PostgreSQL

```bash
# Check if PostgreSQL is ready
docker compose logs postgres | grep "ready to accept connections"

# Should show:
# database system is ready to accept connections
```

#### 7.2: Create Tables

```bash
# Run table creation script
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Output:
# CREATE TABLE
# CREATE TABLE
# (for each table)
```

#### 7.3: Seed Initial Data

```bash
# Run seed data script
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# Output:
# INSERT 0 1
# INSERT 0 1
# (for each record)
```

#### 7.4: Verify Database

```bash
# Connect to database
docker exec -it cga-postgres psql -U postgres -d cga_db

# Inside psql:
\dt              # List tables
SELECT COUNT(*) FROM users;   # Check users
\q               # Quit
```

---

### STEP 8: Access CGA Application

#### 8.1: Open in Browser (Windows)

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Health: http://localhost:5000/api/health
API Docs (Swagger): http://localhost:5000/api-docs
```

#### 8.2: Default Login

```
Username: admin
Password: Admin@123456
```

#### 8.3: Test Functionality

```
1. Login with admin credentials
2. Browse dashboard
3. Test navigation
4. Check all features work
```

---

## 🐳 Docker Compose Strategy

### Current Setup: 3 Containers

```yaml
services:
  postgres:     # Database
  backend:      # Node.js API
  frontend:     # React + Nginx
```

### Why This is Good

✅ **Separation of Concerns** - Each service isolated
✅ **Easy Scaling** - Can scale services independently
✅ **Better for Production** - Same setup as server
✅ **Easy Updates** - Update one service without affecting others

### Alternative: 2 Containers?

**Option A: Combine Frontend + Backend**
```yaml
services:
  postgres:     # Database
  app:          # Backend + Frontend in one container
```

❌ **Not Recommended Because:**
- Harder to debug
- Can't scale independently
- Mixed concerns
- Not production-like

**Option B: Current (3 containers)** ← RECOMMENDED!
```yaml
services:
  postgres:     # Database
  backend:      # API
  frontend:     # UI
```

✅ **Recommended Because:**
- Clean separation
- Production-ready
- Easy to debug
- Can scale horizontally
- Industry standard

**My Advice:** Keep 3 containers! It's the right way! 💯

---

## 🔧 Docker Compose File Explained

### Current docker-compose.yml

```yaml
version: '3.8'

services:
  # Database Container
  postgres:
    image: postgres:15-alpine     # Lightweight PostgreSQL
    container_name: cga-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: cga_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"              # Expose to host
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persist data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API Container
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cga-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV}
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/cga_db
      JWT_SECRET: ${JWT_SECRET}
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app           # Mount code (for development)
      - /app/node_modules        # Don't override node_modules
    command: npm run dev         # Hot reload in development

  # Frontend Container
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: cga-frontend
    restart: unless-stopped
    ports:
      - "80:80"                  # Nginx serves on port 80
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:5000

volumes:
  postgres_data:                 # Named volume for database
```

### Why This Configuration Works

✅ **Health Checks** - Backend waits for database
✅ **Hot Reload** - Code changes reflect immediately (development)
✅ **Data Persistence** - Database data survives container restart
✅ **Proper Dependencies** - Containers start in correct order
✅ **Environment Variables** - Configured via .env file

---

## 🛠️ Common Docker Commands

### Container Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend

# View status
docker compose ps

# View logs
docker compose logs -f

# Stop following logs
Ctrl + C
```

### Individual Container Commands

```bash
# Start specific service
docker compose up -d postgres

# Stop specific service
docker compose stop backend

# Execute command in container
docker compose exec backend npm install

# Shell into container
docker compose exec backend bash
docker compose exec postgres psql -U postgres

# View container logs
docker compose logs backend --tail 100
```

### Cleanup

```bash
# Stop and remove containers
docker compose down

# Stop, remove containers + volumes (⚠️ deletes database!)
docker compose down -v

# Remove unused images
docker image prune

# Remove everything (⚠️ nuclear option!)
docker system prune -a
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker compose up -d --build backend

# Rebuild all services
docker compose up -d --build

# Force recreate containers
docker compose up -d --force-recreate
```

---

## 📂 Working with Files in WSL

### Accessing WSL Files from Windows

```
Method 1: File Explorer
1. Open File Explorer
2. Type in address bar:
   \\wsl$\Ubuntu\home\yourname\pca

Method 2: VS Code
1. Install "Remote - WSL" extension
2. Open folder in WSL:
   code ~/pca

Method 3: Windows Terminal
- Recommended! Install from Microsoft Store
- Better than default WSL terminal
```

### Accessing Windows Files from WSL

```bash
# Windows C: drive
cd /mnt/c/

# Your user folder
cd /mnt/c/Users/user/

# Downloads
cd /mnt/c/Users/user/Downloads/

# Desktop
cd /mnt/c/Users/user/Desktop/
```

### Best Practice for CGA Development

**Recommended Workflow:**

```
1. Project Location: ~/pca (in WSL)
   - Better performance
   - Faster Docker

2. Edit Code:
   Option A: VS Code with Remote-WSL extension
   Option B: Windows editor, but slower

3. Run Docker: In WSL terminal
   - docker compose up -d

4. View in Browser: Windows
   - http://localhost:3000
```

---

## 🐛 Troubleshooting

### Problem 1: "wsl --install" fails

**Error:** The requested operation requires elevation

**Solution:**
```powershell
# Run PowerShell as Administrator!
1. Windows key → Type "PowerShell"
2. Right-click → "Run as Administrator"
3. Try again
```

---

### Problem 2: Docker service won't start

**Error:** Cannot connect to the Docker daemon

**Solution:**
```bash
# Start Docker service
sudo service docker start

# Check status
sudo service docker status

# If fails, check logs
sudo journalctl -u docker
```

---

### Problem 3: "Permission denied" running Docker

**Error:** permission denied while trying to connect to the Docker daemon socket

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart WSL
exit
wsl --shutdown

# Open Ubuntu again
# Try docker command
docker ps
```

---

### Problem 4: Port already in use

**Error:** Bind for 0.0.0.0:5000 failed: port is already allocated

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml:
ports:
  - "5001:5000"  # Use 5001 instead
```

---

### Problem 5: Database connection fails

**Error:** Connection refused to postgres

**Solution:**
```bash
# Check if postgres is running
docker compose ps

# Check postgres logs
docker compose logs postgres

# Verify database created
docker exec -it cga-postgres psql -U postgres -l

# Restart postgres
docker compose restart postgres
```

---

### Problem 6: Slow file performance

**Problem:** Docker very slow on WSL

**Solution:**
```bash
# Move project to WSL file system (not /mnt/c/)
cd ~
cp -r /mnt/c/Users/user/Downloads/pca ~/pca
cd ~/pca

# Much faster now!
```

---

### Problem 7: WSL out of memory

**Error:** Cannot allocate memory

**Solution:**
```
Create file: C:\Users\user\.wslconfig

[wsl2]
memory=4GB
processors=2
swap=2GB

Restart WSL:
wsl --shutdown
```

---

## 🚀 Deploy to Ubuntu Server

### Good News!

**Everything you did in WSL works EXACTLY THE SAME on Ubuntu server!**

### Deployment Steps

```bash
# 1. SSH to server
ssh user@your-server-ip

# 2. Install Docker (same commands!)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Clone project (same!)
git clone https://github.com/your-repo/pca.git
cd pca

# 4. Configure (same!)
cp .env.docker .env
nano .env  # Update with production values

# 5. Start services (same!)
docker compose up -d

# 6. Initialize database (same!)
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# Done! Same commands! 🎉
```

**See:** `DOCKER_DEPLOYMENT_GUIDE.md` for full production setup

---

## 📊 WSL vs Production Comparison

| Aspect | WSL (Development) | Ubuntu Server (Production) |
|--------|-------------------|----------------------------|
| OS | Ubuntu on Windows | Ubuntu |
| Docker Commands | ✅ Same | ✅ Same |
| docker-compose.yml | ✅ Same | ✅ Same |
| Environment Setup | ✅ Same | ✅ Same |
| Database Scripts | ✅ Same | ✅ Same |
| File Locations | ~/pca | ~/pca or /opt/pca |
| Access | localhost | server-ip or domain |
| SSL/HTTPS | ❌ Not needed | ✅ Traefik/Certbot |
| Firewall | ❌ Not needed | ✅ UFW |

**Result:** 95% of your work in WSL transfers directly to production! 🎉

---

## ✅ Development Checklist

### Initial Setup
- [ ] Install WSL2
- [ ] Install Ubuntu
- [ ] Install Docker in WSL
- [ ] Install Docker Compose
- [ ] Clone/Copy CGA project to ~/pca
- [ ] Configure .env file

### Every Development Session
- [ ] Open Ubuntu (WSL)
- [ ] Navigate to project: `cd ~/pca`
- [ ] Start Docker: `docker compose up -d`
- [ ] Check status: `docker compose ps`
- [ ] Open browser: http://localhost:3000
- [ ] Start coding!

### After Code Changes
- [ ] Backend changes: Auto-reload (npm run dev)
- [ ] Frontend changes: Rebuild: `docker compose up -d --build frontend`
- [ ] Database changes: Restart: `docker compose restart postgres`
- [ ] Test in browser

### Shutting Down
- [ ] Stop containers: `docker compose down`
- [ ] Or keep running (they don't use much resources)

---

## 🎯 Summary

**WSL Setup for CGA Development:**

✅ **Easy to Setup** - 30 minutes from zero to running
✅ **Windows + Linux** - Best of both worlds
✅ **Same as Production** - Commands work on Ubuntu server
✅ **Fast Development** - Hot reload, instant testing
✅ **Docker Native** - Better than Docker Desktop
✅ **Production Ready** - Deploy with same setup

**Your Workflow:**
1. Code in Windows (VS Code)
2. Run in WSL (Docker)
3. Test in Windows (Browser)
4. Deploy to Ubuntu Server (Same commands!)

**Perfect Setup! 💯**

---

**🇬🇦 For the Gabonese Republic - Develop Locally, Deploy Globally**

**Status:** ✅ COMPLETE GUIDE READY
**Date:** 2025-12-09
**Version:** 1.0.0

**Your CGA app is ready to develop on WSL! Let's gooooooooo! 🚀🐧**
