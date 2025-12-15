# 🐳 Docker Quick Reference - CGA Application

## Quick Commands Cheat Sheet

### Start & Stop

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (DELETES DATA!)
docker compose down -v

# Restart specific service
docker compose restart backend
docker compose restart frontend
docker compose restart postgres
```

### View Status & Logs

```bash
# Check status
docker compose ps

# View all logs (real-time)
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Last 100 lines
docker compose logs --tail=100

# Check health status
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

### Database Operations

```bash
# Access PostgreSQL
docker exec -it cga-postgres psql -U postgres -d cga_db

# Backup database
docker exec cga-postgres pg_dump -U postgres cga_db > backup.sql

# Restore database
docker exec -i cga-postgres psql -U postgres -d cga_db < backup.sql

# Run SQL file
docker exec -i cga-postgres psql -U postgres -d cga_db < script.sql
```

### Container Management

```bash
# Execute command in container
docker exec -it cga-backend sh
docker exec -it cga-frontend sh

# View resource usage
docker stats

# Rebuild specific service
docker compose build backend
docker compose build frontend

# Pull latest images
docker compose pull
```

### Cleanup

```bash
# Remove unused containers, networks, images
docker system prune

# Remove everything including volumes (CAREFUL!)
docker system prune -a --volumes

# Check disk usage
docker system df
```

---

## Environment Setup

### 1. Copy Environment File
```bash
cp .env.docker .env
```

### 2. Generate Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Edit .env File
```env
DB_PASSWORD=your-strong-password
JWT_SECRET=generated-secret-32-chars
JWT_REFRESH_SECRET=generated-secret-32-chars
SESSION_SECRET=generated-secret-32-chars
FRONTEND_URL=http://your-domain.com
```

---

## First Time Setup

```bash
# 1. Build images
docker compose build

# 2. Start services
docker compose up -d

# 3. Wait 30 seconds for database to initialize

# 4. Initialize database
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# 5. Verify
docker compose ps
curl http://localhost:5000/api/health
```

---

## Troubleshooting

### Containers Won't Start
```bash
# Check logs
docker compose logs backend

# Check if ports are in use
sudo lsof -i :5000  # Backend
sudo lsof -i :80    # Frontend
sudo lsof -i :5432  # PostgreSQL
```

### Database Connection Issues
```bash
# Verify postgres is healthy
docker compose ps

# Test connection from backend
docker exec cga-backend ping -c 3 postgres

# Restart database
docker compose restart postgres
```

### Reset Everything
```bash
# Stop and remove all
docker compose down -v

# Clean Docker cache
docker system prune -a

# Start fresh
docker compose up -d
```

---

## Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend health
curl http://localhost/

# Database health
docker exec cga-postgres pg_isready -U postgres

# All services status
docker compose ps
```

---

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost | admin / Admin@123456 |
| Backend API | http://localhost:5000/api | JWT required |
| Database | localhost:5432 | postgres / (see .env) |

---

## File Locations

| Purpose | Path |
|---------|------|
| Docker Compose | `./docker-compose.yml` |
| Environment | `./.env` |
| Backend Dockerfile | `./backend/Dockerfile` |
| Frontend Dockerfile | `./frontend/Dockerfile` |
| Nginx Config | `./frontend/nginx.conf` |
| Database Scripts | `./backend/scripts/*.sql` |

---

## Production Checklist

- [ ] Change DB_PASSWORD
- [ ] Generate JWT_SECRET
- [ ] Generate JWT_REFRESH_SECRET
- [ ] Generate SESSION_SECRET
- [ ] Update FRONTEND_URL
- [ ] Update CORS_ORIGINS
- [ ] Configure SSL/HTTPS
- [ ] Set up automated backups
- [ ] Configure monitoring
- [ ] Test disaster recovery

---

## Useful Aliases (Optional)

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Docker Compose shortcuts
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias dcps='docker compose ps'
alias dcrestart='docker compose restart'

# CGA specific
alias cga-logs='docker compose logs -f'
alias cga-status='docker compose ps'
alias cga-backend-logs='docker compose logs -f backend'
alias cga-frontend-logs='docker compose logs -f frontend'
alias cga-db='docker exec -it cga-postgres psql -U postgres -d cga_db'
alias cga-backup='docker exec cga-postgres pg_dump -U postgres cga_db > backup_$(date +%Y%m%d).sql'
```

---

## Emergency Commands

### Service Not Responding
```bash
docker compose restart backend
docker compose logs -f backend
```

### Out of Memory
```bash
docker stats
docker system prune -a
```

### Database Corrupted
```bash
# Restore from backup
docker exec -i cga-postgres psql -U postgres -d cga_db < latest_backup.sql
```

### Complete Reset
```bash
docker compose down -v
docker system prune -a
# Re-run first time setup
```

---

## Support

For detailed information, see:
- **English:** `DOCKER_DEPLOYMENT_GUIDE.md`
- **Français:** `DOCKER_DEPLOYMENT_GUIDE.fr.md`
- **Summary:** `DEPLOYMENT_COMPLETE.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-12-09
