# 🚀 Traefik Deployment Guide - CGA Application

## Professional Production Setup with Automatic SSL

This guide covers deploying the CGA application using **Traefik** as a modern reverse proxy with automatic HTTPS, service discovery, and load balancing.

---

## Table of Contents

1. [Why Traefik?](#why-traefik)
2. [Traefik vs Nginx](#traefik-vs-nginx)
3. [Architecture Overview](#architecture-overview)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Detailed Configuration](#detailed-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Dashboard Access](#dashboard-access)
9. [Monitoring & Logs](#monitoring--logs)
10. [Security Hardening](#security-hardening)
11. [Scaling & Load Balancing](#scaling--load-balancing)
12. [Troubleshooting](#troubleshooting)
13. [Migration from Nginx](#migration-from-nginx)

---

## Why Traefik?

### Key Benefits for CGA Application

✅ **Automatic SSL/HTTPS**
- Zero-configuration Let's Encrypt integration
- Automatic certificate renewal
- No manual cert management needed

✅ **Service Discovery**
- Automatically detects new containers
- No config file editing for new services
- Labels-based configuration

✅ **Built-in Dashboard**
- Real-time monitoring
- Visual service overview
- Request metrics

✅ **Modern & Cloud-Native**
- Built specifically for containers
- Kubernetes-ready
- Microservices-friendly

✅ **Load Balancing**
- Round-robin by default
- Health checks included
- Automatic failover

✅ **Middleware System**
- Rate limiting
- Authentication
- Compression
- Custom headers

---

## Traefik vs Nginx

### Feature Comparison

| Feature | Traefik | Nginx |
|---------|---------|-------|
| **Auto SSL** | ✅ Built-in | ⚠️ Requires Certbot |
| **Service Discovery** | ✅ Automatic | ❌ Manual config |
| **Dashboard** | ✅ Included | ❌ Separate tools needed |
| **Config Reload** | ✅ Automatic | ⚠️ Needs restart/reload |
| **Container Native** | ✅ Yes | ⚠️ Can be configured |
| **Resource Usage** | ⚠️ ~50MB RAM | ✅ ~10MB RAM |
| **Maturity** | ⚠️ 8 years | ✅ 20+ years |
| **Learning Curve** | ⚠️ Moderate | ⚠️ Moderate |
| **Static Content** | ⚠️ Good | ✅ Excellent |
| **Load Balancing** | ✅ Built-in | ✅ Built-in |

### When to Use Traefik

✅ **Use Traefik for CGA if you:**
- Want automatic SSL without manual setup
- Plan to add more services (microservices)
- Need visual monitoring dashboard
- Want zero-downtime config updates
- Are deploying on Kubernetes later
- Prefer modern, declarative config

### When to Use Nginx

✅ **Use Nginx if you:**
- Have existing Nginx expertise
- Need minimal resource usage
- Serve mostly static content
- Prefer traditional configuration
- Have simple, static setup

### Recommendation for CGA

**Use Traefik** ✅

For the CGA application, Traefik is recommended because:
1. **Automatic SSL** saves time and reduces errors
2. **Auto-discovery** makes adding services easier
3. **Dashboard** provides better visibility
4. **Modern** architecture fits containerized apps

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Internet / Users                    │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │      Traefik        │  Ports: 80, 443, 8080
          │  (Reverse Proxy)    │
          │  + Let's Encrypt    │
          │  + Load Balancer    │
          └──────────┬──────────┘
                     │
       ┌─────────────┴──────────────┐
       │                            │
┌──────▼──────┐            ┌───────▼──────┐
│  Frontend   │            │   Backend    │
│   (Nginx)   │            │  (Node.js)   │
│   Port 80   │            │   Port 5000  │
│             │            │              │
│  React App  │───API──────│  Express API │
└─────────────┘  Proxy     └───────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │ PostgreSQL  │
                            │  Port 5432  │
                            └─────────────┘
```

### Traefik Features in Architecture

1. **Automatic HTTPS:** Traefik handles all SSL/TLS
2. **Routing:** Routes requests based on domain/path
3. **Load Balancing:** Distributes traffic if scaled
4. **Health Checks:** Monitors service health
5. **Middleware:** Security headers, rate limiting, compression

---

## Prerequisites

### Requirements

- **Server:** Ubuntu 20.04/22.04 LTS
- **RAM:** 4GB minimum (8GB recommended)
- **CPU:** 2 cores minimum
- **Disk:** 40GB minimum
- **Domain:** Required for SSL (e.g., yourdomain.com)
- **DNS:** Domain pointing to your server IP

### DNS Configuration

Before starting, configure your DNS:

```
A Record:  yourdomain.com        → YOUR_SERVER_IP
A Record:  www.yourdomain.com    → YOUR_SERVER_IP
A Record:  traefik.yourdomain.com → YOUR_SERVER_IP (for dashboard)
```

**Verify DNS:**
```bash
dig yourdomain.com +short
# Should show your server IP
```

---

## Quick Start

### 1. Copy Traefik Configuration

```bash
cd ~/pca

# Copy Traefik environment
cp .env.traefik .env

# Edit configuration
nano .env
```

### 2. Update Environment Variables

**Critical variables to change:**

```env
# Your domain
DOMAIN=yourdomain.com

# Let's Encrypt email
LETSENCRYPT_EMAIL=your-email@example.com

# Strong passwords
DB_PASSWORD=your-strong-db-password

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

### 3. Update Traefik Configuration

Edit `traefik/traefik.yml`:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # CHANGE THIS
      # ...
      domains:
        - main: yourdomain.com       # CHANGE THIS
          sans:
            - www.yourdomain.com     # CHANGE THIS
```

### 4. Generate Dashboard Password

```bash
# Install htpasswd
sudo apt install -y apache2-utils

# Generate password hash
htpasswd -nb admin your-secure-password

# Example output:
# admin:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/
```

Update `traefik/dynamic/middlewares.yml`:

```yaml
dashboard-auth:
  basicAuth:
    users:
      - "admin:$apr1$YOUR_HASH_HERE"
```

### 5. Deploy with Traefik

```bash
# Build images
docker compose -f docker-compose.traefik.yml build

# Start services
docker compose -f docker-compose.traefik.yml up -d

# Check status
docker compose -f docker-compose.traefik.yml ps

# View logs
docker compose -f docker-compose.traefik.yml logs -f traefik
```

### 6. Initialize Database

```bash
# Wait 30 seconds for services to start

# Initialize database
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

### 7. Verify Deployment

**Access your application:**
- **Frontend:** https://yourdomain.com
- **Backend API:** https://yourdomain.com/api/health
- **Traefik Dashboard:** https://traefik.yourdomain.com (username: admin)

**Check SSL:**
```bash
curl -I https://yourdomain.com
# Should show: strict-transport-security header
```

---

## Detailed Configuration

### Traefik Static Configuration

File: `traefik/traefik.yml`

#### Entry Points

```yaml
entryPoints:
  # HTTP (redirects to HTTPS)
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

  # HTTPS
  websecure:
    address: ":443"
    http:
      tls:
        certResolver: letsencrypt
```

#### Certificate Resolver

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      # Staging (for testing)
      # caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      httpChallenge:
        entryPoint: web
```

**Let's Encrypt Staging:**
- Use staging during testing to avoid rate limits
- Staging: 50 certs/domain/week
- Production: 50 certs/domain/week
- Uncomment `caServer` line for staging

### Dynamic Configuration

File: `traefik/dynamic/middlewares.yml`

#### Security Headers

```yaml
security-headers:
  headers:
    browserXssFilter: true
    contentTypeNosniff: true
    forceSTSHeader: true
    frameDeny: true
    sslRedirect: true
    stsIncludeSubdomains: true
    stsPreload: true
    stsSeconds: 31536000  # 1 year
    contentSecurityPolicy: "default-src 'self'; ..."
```

#### Rate Limiting

```yaml
rate-limit:
  rateLimit:
    average: 100      # requests per period
    period: 1m        # 1 minute
    burst: 50         # allow bursts
```

#### Compression

```yaml
compression:
  compress:
    excludedContentTypes:
      - text/event-stream
```

### Docker Labels Configuration

Services are configured via Docker labels in `docker-compose.traefik.yml`:

#### Frontend Labels

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
  - "traefik.http.routers.frontend.entrypoints=websecure"
  - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
  - "traefik.http.services.frontend.loadbalancer.server.port=80"
  - "traefik.http.routers.frontend.middlewares=security-headers,compression"
```

#### Backend Labels

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.backend.rule=Host(`yourdomain.com`) && PathPrefix(`/api`)"
  - "traefik.http.routers.backend.entrypoints=websecure"
  - "traefik.http.services.backend.loadbalancer.server.port=5000"
  - "traefik.http.routers.backend.middlewares=security-headers,rate-limit"
```

---

## SSL/HTTPS Setup

### Automatic Let's Encrypt

Traefik handles everything automatically:

1. **First Request:** Traefik detects service needs SSL
2. **Challenge:** Performs HTTP-01 challenge
3. **Certificate:** Gets certificate from Let's Encrypt
4. **Storage:** Saves to `/letsencrypt/acme.json`
5. **Renewal:** Auto-renews before expiry (60 days)

### Testing with Staging

**Use Let's Encrypt staging during setup:**

Edit `traefik/traefik.yml`:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      # ... rest of config
```

**After testing works, remove/comment staging line for production certs.**

### Certificate Storage

Certificates stored in volume:

```bash
# View certificates
docker exec cga-traefik cat /letsencrypt/acme.json | jq

# Backup certificates
docker cp cga-traefik:/letsencrypt/acme.json ./acme.json.backup
```

### Force Certificate Renewal

```bash
# Delete acme.json
docker exec cga-traefik rm /letsencrypt/acme.json

# Restart Traefik
docker compose -f docker-compose.traefik.yml restart traefik

# Traefik will obtain new certificates
```

---

## Dashboard Access

### Enable Dashboard

Dashboard is enabled by default at: **https://traefik.yourdomain.com**

### Security

Dashboard protected by:
1. **Basic Auth:** Username/password
2. **HTTPS:** Encrypted connection

### Access Dashboard

1. **Navigate to:** https://traefik.yourdomain.com
2. **Login:**
   - Username: admin
   - Password: (what you set with htpasswd)

### Dashboard Features

**Overview Tab:**
- Active services
- Routers
- Middlewares
- Entry points

**HTTP Tab:**
- HTTP routers
- Services
- Middlewares

**TCP/UDP Tabs:**
- TCP/UDP services (if any)

### Disable Dashboard (Production)

For maximum security, disable dashboard in production:

Edit `docker-compose.traefik.yml`:

```yaml
traefik:
  ports:
    - "80:80"
    - "443:443"
    # - "8080:8080"  # Comment out dashboard port
  labels:
    # Comment out dashboard labels
    # - "traefik.http.routers.dashboard..."
```

---

## Monitoring & Logs

### View Traefik Logs

```bash
# Real-time logs
docker compose -f docker-compose.traefik.yml logs -f traefik

# Access logs
docker exec cga-traefik tail -f /var/log/traefik/access.log

# Error logs
docker exec cga-traefik tail -f /var/log/traefik/traefik.log
```

### Log Format

Logs are in JSON format for easy parsing:

```json
{
  "level": "info",
  "msg": "Configuration loaded",
  "time": "2025-12-09T10:30:00Z"
}
```

### Parse Logs with jq

```bash
# View only errors
docker exec cga-traefik cat /var/log/traefik/traefik.log | jq 'select(.level=="error")'

# Count requests by status code
docker exec cga-traefik cat /var/log/traefik/access.log | jq .DownstreamStatus | sort | uniq -c
```

### Metrics (Prometheus)

Enable Prometheus metrics in `traefik/traefik.yml`:

```yaml
metrics:
  prometheus:
    entryPoint: metrics
    addEntryPointsLabels: true
    addServicesLabels: true
```

Add metrics port:

```yaml
entryPoints:
  metrics:
    address: ":8082"
```

**Access metrics:** http://localhost:8082/metrics

---

## Security Hardening

### 1. Secure Dashboard

**Option A: Disable completely**
```yaml
# Remove dashboard labels from docker-compose.traefik.yml
```

**Option B: Strong authentication**
```bash
# Generate strong password
htpasswd -nb admin $(openssl rand -base64 24)
```

**Option C: IP whitelist**
```yaml
# Add to middlewares.yml
dashboard-ip-whitelist:
  ipWhiteList:
    sourceRange:
      - "203.0.113.0/24"  # Your office IP
      - "198.51.100.42/32" # Your home IP
```

### 2. Restrict Docker Socket Access

Docker socket is powerful - restrict it:

```yaml
# Use Docker socket proxy (recommended)
services:
  dockerproxy:
    image: tecnativa/docker-socket-proxy
    environment:
      CONTAINERS: 1
      SERVICES: 1
      TASKS: 1
      NETWORKS: 1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

  traefik:
    volumes:
      - dockerproxy:2375  # Use proxy instead of direct socket
```

### 3. Enable Fail2Ban

Protect against brute force:

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Create Traefik jail
sudo nano /etc/fail2ban/jail.d/traefik.conf
```

```ini
[traefik-auth]
enabled = true
port = http,https
filter = traefik-auth
logpath = /var/lib/docker/volumes/traefik_logs/_data/access.log
maxretry = 5
bantime = 3600
```

### 4. Security Headers

Already configured in `middlewares.yml`:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy
- Referrer-Policy

### 5. Rate Limiting

Already configured: 100 requests/minute with burst of 50

**Adjust if needed:**

```yaml
rate-limit:
  rateLimit:
    average: 200    # Increase for more traffic
    period: 1m
    burst: 100
```

---

## Scaling & Load Balancing

### Scale Backend Service

```bash
# Scale to 3 instances
docker compose -f docker-compose.traefik.yml up -d --scale backend=3

# Traefik automatically load balances!
```

### Load Balancing Configuration

Traefik uses round-robin by default. Configure in labels:

```yaml
# Sticky sessions (optional)
- "traefik.http.services.backend.loadbalancer.sticky.cookie=true"
- "traefik.http.services.backend.loadbalancer.sticky.cookie.name=cga_session"

# Health check (already configured)
- "traefik.http.services.backend.loadbalancer.healthcheck.path=/api/health"
- "traefik.http.services.backend.loadbalancer.healthcheck.interval=30s"
```

### Multiple Backend Instances

Update `docker-compose.traefik.yml`:

```yaml
backend:
  # ... existing config ...
  deploy:
    replicas: 3  # For Docker Swarm
```

Or manually:

```yaml
backend-1:
  # ... config ...
backend-2:
  # ... config ...
backend-3:
  # ... config ...
```

Traefik automatically discovers all instances!

---

## Troubleshooting

### Issue: Certificate Not Obtained

**Symptoms:**
- Site shows "certificate error"
- acme.json is empty or small

**Solutions:**

1. **Check DNS:**
```bash
dig yourdomain.com +short
# Must point to your server
```

2. **Check logs:**
```bash
docker compose -f docker-compose.traefik.yml logs traefik | grep -i "acme\|certificate"
```

3. **Use staging first:**
```yaml
# Test with staging
caServer: https://acme-staging-v02.api.letsencrypt.org/directory
```

4. **Check firewall:**
```bash
sudo ufw status
# Ports 80 and 443 must be open
```

5. **Wait and retry:**
```bash
# Let's Encrypt has rate limits
# Wait 1 hour and try again
```

### Issue: Dashboard Not Accessible

**Check:**

1. **DNS configured:**
```bash
dig traefik.yourdomain.com +short
```

2. **Labels correct:**
```bash
docker inspect cga-traefik | grep -A 10 labels
```

3. **Authentication:**
```bash
# Test with curl
curl -u admin:yourpassword https://traefik.yourdomain.com/api/rawdata
```

### Issue: 502 Bad Gateway

**Causes:**
- Backend not running
- Backend unhealthy
- Wrong port configuration

**Solutions:**

```bash
# Check backend health
docker compose -f docker-compose.traefik.yml ps

# Check backend logs
docker compose -f docker-compose.traefik.yml logs backend

# Test backend directly
curl http://localhost:5000/api/health
```

### Issue: Too Many Redirects

**Cause:** SSL/TLS configuration issue

**Solution:**

Check that `sslRedirect` is not set twice:

```yaml
# In middlewares.yml
security-headers:
  headers:
    sslRedirect: true  # Only here, not in multiple places
```

### Issue: Rate Limit Hit

**Solution:**

Temporarily increase limits:

```yaml
rate-limit:
  rateLimit:
    average: 200
    period: 1m
    burst: 100
```

Or disable for testing:

```yaml
# Remove rate-limit from middleware list
- "traefik.http.routers.backend.middlewares=security-headers,compression"
```

---

## Migration from Nginx

### Step 1: Backup Current Setup

```bash
# Backup nginx config
docker cp cga-frontend:/etc/nginx/conf.d/default.conf ./nginx-backup.conf

# Export database
docker exec cga-postgres pg_dump -U postgres cga_db > db-backup.sql
```

### Step 2: Stop Nginx Setup

```bash
# Stop current containers
docker compose down

# Keep volumes
```

### Step 3: Deploy with Traefik

```bash
# Deploy Traefik version
docker compose -f docker-compose.traefik.yml up -d
```

### Step 4: Verify

```bash
# Check all services healthy
docker compose -f docker-compose.traefik.yml ps

# Test application
curl https://yourdomain.com
```

### Step 5: Clean Up (Optional)

```bash
# Remove old Nginx-based setup
docker compose -f docker-compose.yml down -v

# Remove Nginx image
docker rmi cga-frontend:latest
```

### Comparison: Nginx vs Traefik

**What Changes:**
- ✅ SSL automatic (no Certbot needed)
- ✅ Dashboard available
- ✅ Auto service discovery
- ✅ Zero-downtime reloads

**What Stays Same:**
- ✅ Database unchanged
- ✅ Backend API unchanged
- ✅ Frontend app unchanged
- ✅ Application functionality identical

---

## Performance Tuning

### Resource Limits

```yaml
traefik:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

### Connection Limits

```yaml
# In traefik.yml
entryPoints:
  web:
    transport:
      respondingTimeouts:
        readTimeout: 60s
        writeTimeout: 60s
        idleTimeout: 180s
```

### Enable HTTP/2

Already enabled by default with HTTPS!

Verify:

```bash
curl -I --http2 https://yourdomain.com
# Look for: HTTP/2 200
```

---

## Commands Cheat Sheet

```bash
# Start with Traefik
docker compose -f docker-compose.traefik.yml up -d

# Stop
docker compose -f docker-compose.traefik.yml down

# View logs
docker compose -f docker-compose.traefik.yml logs -f traefik

# Restart Traefik only
docker compose -f docker-compose.traefik.yml restart traefik

# Check certificate
docker exec cga-traefik cat /letsencrypt/acme.json | jq

# Force cert renewal
docker exec cga-traefik rm /letsencrypt/acme.json
docker compose -f docker-compose.traefik.yml restart traefik

# Scale backend
docker compose -f docker-compose.traefik.yml up -d --scale backend=3

# Health status
docker compose -f docker-compose.traefik.yml ps
```

---

## Next Steps

1. ✅ Deploy with Traefik
2. ✅ Verify SSL working
3. ✅ Access dashboard
4. ✅ Configure monitoring (Prometheus/Grafana)
5. ✅ Set up alerting
6. ✅ Load testing
7. ✅ Backup automation
8. ✅ Documentation

---

## Resources

- **Traefik Docs:** https://doc.traefik.io/traefik/
- **Let's Encrypt:** https://letsencrypt.org/
- **Traefik Docker:** https://doc.traefik.io/traefik/providers/docker/
- **Middleware:** https://doc.traefik.io/traefik/middlewares/overview/

---

**Congratulations! Your CGA application is now running with Traefik!** 🎉

For French version, see [TRAEFIK_DEPLOYMENT_GUIDE.fr.md](TRAEFIK_DEPLOYMENT_GUIDE.fr.md)
