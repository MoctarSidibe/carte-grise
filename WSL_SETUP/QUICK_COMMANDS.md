# ⚡ WSL Quick Commands Reference

## One-Page Command Sheet for CGA Development

**Date:** 2025-12-09

---

## 🚀 Initial Setup (One-Time)

### Install WSL
```powershell
# PowerShell as Admin
wsl --install
# Restart computer
```

### Setup Ubuntu
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Restart WSL
exit
wsl --shutdown
```

### Setup CGA Project
```bash
# Clone to WSL (recommended)
cd ~
git clone https://github.com/your-repo/pca.git
cd pca

# Or copy from Windows (slower)
cp -r /mnt/c/Users/user/Downloads/pca ~/pca
cd ~/pca

# Configure environment
cp .env.docker .env
```

---

## 🏃 Daily Development Commands

### Start CGA
```bash
cd ~/pca
docker compose up -d
```

### Check Status
```bash
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Stop following: Ctrl+C
```

### Access in Browser
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
API Docs:  http://localhost:5000/api-docs
Health:    http://localhost:5000/api/health
```

### Stop CGA
```bash
docker compose down
```

---

## 🔄 After Code Changes

### Backend Changes (Auto-reload)
```bash
# Already watching! Just save your file.
# Check logs to see reload:
docker compose logs -f backend
```

### Frontend Changes (Rebuild)
```bash
docker compose up -d --build frontend
```

### Environment Changes
```bash
# Edit .env
nano .env

# Restart services
docker compose down
docker compose up -d
```

### Database Schema Changes
```bash
# Edit SQL file: backend/scripts/02_create_tables.sql
# Then recreate database:
docker compose down -v
docker compose up -d
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

---

## 🗄️ Database Commands

### Initialize Database (First Time)
```bash
# Create tables
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql

# Seed data
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### Connect to Database
```bash
docker exec -it cga-postgres psql -U postgres -d cga_db
```

### Inside PostgreSQL
```sql
\l                    -- List databases
\dt                   -- List tables
\d users              -- Describe users table
SELECT * FROM users;  -- Query users
\q                    -- Quit
```

### Backup Database
```bash
docker exec cga-postgres pg_dump -U postgres cga_db > backup.sql
```

### Restore Database
```bash
docker exec -i cga-postgres psql -U postgres -d cga_db < backup.sql
```

### Reset Database
```bash
# ⚠️ Deletes all data!
docker compose down -v
docker compose up -d
# Re-run init scripts
```

---

## 🐳 Docker Management

### Container Management
```bash
# Start all
docker compose up -d

# Start specific service
docker compose up -d postgres

# Stop all
docker compose down

# Stop specific
docker compose stop backend

# Restart all
docker compose restart

# Restart specific
docker compose restart backend

# View status
docker compose ps

# View resource usage
docker stats
```

### Logs
```bash
# All logs
docker compose logs

# Follow logs (live)
docker compose logs -f

# Last 100 lines
docker compose logs --tail 100

# Specific service
docker compose logs backend

# Follow specific
docker compose logs -f backend
```

### Execute Commands
```bash
# Shell into container
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec postgres bash

# Run command in container
docker compose exec backend npm install
docker compose exec backend node -v

# Run as root
docker compose exec -u root backend bash
```

### Rebuild
```bash
# Rebuild all
docker compose up -d --build

# Rebuild specific
docker compose up -d --build backend

# Force recreate
docker compose up -d --force-recreate
```

### Cleanup
```bash
# Stop and remove containers
docker compose down

# Remove containers + volumes (⚠️ deletes data!)
docker compose down -v

# Remove unused images
docker image prune -f

# Remove everything Docker (⚠️ nuclear!)
docker system prune -a -f
```

---

## 📂 File Operations

### Navigate to Project
```bash
# WSL home
cd ~

# Project folder
cd ~/pca

# From Windows folder
cd /mnt/c/Users/user/Downloads/pca
```

### Access from Windows
```
File Explorer: \\wsl$\Ubuntu\home\yourname\pca
VS Code: Install "Remote - WSL" extension
```

### Copy Files
```bash
# Windows to WSL
cp /mnt/c/Users/user/file.txt ~/pca/

# WSL to Windows
cp ~/pca/file.txt /mnt/c/Users/user/Desktop/
```

---

## 🔧 WSL Management

### WSL Commands (from PowerShell)
```powershell
# List distributions
wsl --list --verbose

# Shutdown WSL
wsl --shutdown

# Restart specific distro
wsl --terminate Ubuntu

# Start specific distro
wsl -d Ubuntu

# Set default distro
wsl --set-default Ubuntu

# Update WSL
wsl --update
```

### Inside WSL
```bash
# Check WSL version
cat /etc/os-release

# Check Docker version
docker --version
docker compose version

# Check system resources
free -h      # Memory
df -h        # Disk
top          # Processes (q to quit)
```

---

## 🐛 Troubleshooting Commands

### Docker Service
```bash
# Start Docker
sudo service docker start

# Check status
sudo service docker status

# Restart Docker
sudo service docker restart

# Check if running
docker info
```

### Port Issues
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Kill process using port
sudo kill -9 <PID>

# Check all listening ports
sudo netstat -tulpn | grep LISTEN
```

### Permission Issues
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER ~/pca
```

### Container Issues
```bash
# Check container health
docker compose ps

# Inspect container
docker inspect cga-backend

# View container processes
docker compose top

# Check container resources
docker stats --no-stream
```

---

## 📊 Monitoring & Debugging

### View Logs
```bash
# Real-time logs
docker compose logs -f

# Logs since timestamp
docker compose logs --since 30m

# Logs until timestamp
docker compose logs --until 2025-12-09T12:00:00
```

### Check Health
```bash
# Container health
docker compose ps

# Service health endpoint
curl http://localhost:5000/api/health

# Database connection
docker exec cga-postgres pg_isready -U postgres
```

### Performance
```bash
# Container stats
docker stats

# System disk usage
docker system df

# Volume usage
docker volume ls
```

---

## 🧪 Testing Commands

### Test Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Test API endpoint
curl http://localhost:5000/api/roles

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/roles
```

### Test Database
```bash
# Connect to database
docker exec -it cga-postgres psql -U postgres -d cga_db

# Quick query
docker exec cga-postgres psql -U postgres -d cga_db -c "SELECT COUNT(*) FROM users;"
```

### Test Frontend
```bash
# Check if frontend is serving
curl -I http://localhost:3000

# View frontend logs
docker compose logs frontend
```

---

## 🔄 Update Commands

### Update CGA Code
```bash
cd ~/pca

# Pull latest code
git pull origin main

# Rebuild containers
docker compose up -d --build

# Check logs
docker compose logs -f
```

### Update Dependencies
```bash
# Backend dependencies
docker compose exec backend npm install

# Frontend dependencies
docker compose exec frontend npm install

# Or rebuild
docker compose up -d --build
```

### Update Docker Images
```bash
# Pull latest images
docker compose pull

# Recreate containers with new images
docker compose up -d
```

---

## 📝 Quick Workflows

### Start Development
```bash
cd ~/pca
docker compose up -d
docker compose logs -f
# Open http://localhost:3000 in browser
```

### Reset Everything
```bash
cd ~/pca
docker compose down -v
docker compose up -d
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### Update and Restart
```bash
cd ~/pca
git pull
docker compose up -d --build
docker compose logs -f
```

### Backup Before Changes
```bash
# Backup database
docker exec cga-postgres pg_dump -U postgres cga_db > backup-$(date +%Y%m%d).sql

# Backup code
tar -czf pca-backup-$(date +%Y%m%d).tar.gz ~/pca

# Copy to Windows
cp backup-*.sql /mnt/c/Users/user/Desktop/
```

---

## 🎯 Common Scenarios

### Scenario 1: Fresh Start
```bash
cd ~/pca
docker compose down -v
docker compose up -d
# Wait 30 seconds
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### Scenario 2: Backend Not Responding
```bash
docker compose logs backend
docker compose restart backend
docker compose logs -f backend
```

### Scenario 3: Database Connection Error
```bash
docker compose logs postgres
docker compose restart postgres
docker exec cga-postgres pg_isready -U postgres
```

### Scenario 4: Port Already in Use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
docker compose up -d
```

### Scenario 5: Out of Space
```bash
docker system df
docker system prune -f
docker volume prune -f
```

---

## 🚀 Deploy to Server (Quick)

```bash
# SSH to server
ssh user@server-ip

# Same commands work!
git clone https://github.com/your-repo/pca.git
cd pca
cp .env.docker .env
nano .env  # Update for production
docker compose up -d
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

---

## 📚 Documentation Links

- **Full WSL Guide:** README.md
- **Docker Deployment:** ../DOCKER_DEPLOYMENT_GUIDE.md
- **Traefik Setup:** ../TRAEFIK_DEPLOYMENT_GUIDE.md
- **Docker Quick Ref:** ../DOCKER_QUICK_REFERENCE.md

---

## ✅ Daily Checklist

**Morning:**
- [ ] `wsl` - Open Ubuntu
- [ ] `cd ~/pca` - Go to project
- [ ] `docker compose up -d` - Start services
- [ ] Open browser: http://localhost:3000

**During Development:**
- [ ] Code changes → Save → Auto-reload (backend)
- [ ] Frontend changes → `docker compose up -d --build frontend`
- [ ] Check logs → `docker compose logs -f`

**Evening:**
- [ ] Commit changes → `git commit -am "message"`
- [ ] Push code → `git push`
- [ ] (Optional) Stop services → `docker compose down`

---

**🇬🇦 Quick Commands for Quick Development!**

**Pro Tip:** Bookmark this page! Copy-paste these commands! Let's gooooooooo! 🚀**
