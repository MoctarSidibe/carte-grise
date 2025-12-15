# 🐳 Référence Rapide Docker - Application CGA

## Aide-Mémoire des Commandes Rapides

### Démarrer & Arrêter

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (SUPPRIME LES DONNÉES !)
docker compose down -v

# Redémarrer un service spécifique
docker compose restart backend
docker compose restart frontend
docker compose restart postgres
```

### Voir l'État & les Logs

```bash
# Vérifier l'état
docker compose ps

# Voir tous les logs (temps réel)
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Les 100 dernières lignes
docker compose logs --tail=100

# Vérifier l'état de santé
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

### Opérations Base de Données

```bash
# Accéder à PostgreSQL
docker exec -it cga-postgres psql -U postgres -d cga_db

# Sauvegarder la base de données
docker exec cga-postgres pg_dump -U postgres cga_db > backup.sql

# Restaurer la base de données
docker exec -i cga-postgres psql -U postgres -d cga_db < backup.sql

# Exécuter un fichier SQL
docker exec -i cga-postgres psql -U postgres -d cga_db < script.sql
```

### Gestion des Conteneurs

```bash
# Exécuter une commande dans un conteneur
docker exec -it cga-backend sh
docker exec -it cga-frontend sh

# Voir l'utilisation des ressources
docker stats

# Reconstruire un service spécifique
docker compose build backend
docker compose build frontend

# Télécharger les dernières images
docker compose pull
```

### Nettoyage

```bash
# Supprimer les conteneurs, réseaux, images inutilisés
docker system prune

# Tout supprimer y compris les volumes (ATTENTION !)
docker system prune -a --volumes

# Vérifier l'utilisation du disque
docker system df
```

---

## Configuration de l'Environnement

### 1. Copier le Fichier d'Environnement
```bash
cp .env.docker .env
```

### 2. Générer des Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Éditer le Fichier .env
```env
DB_PASSWORD=votre-mot-de-passe-fort
JWT_SECRET=secret-genere-32-caracteres
JWT_REFRESH_SECRET=secret-genere-32-caracteres
SESSION_SECRET=secret-genere-32-caracteres
FRONTEND_URL=http://votre-domaine.com
```

---

## Configuration Initiale

```bash
# 1. Construire les images
docker compose build

# 2. Démarrer les services
docker compose up -d

# 3. Attendre 30 secondes pour l'initialisation de la base de données

# 4. Initialiser la base de données
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# 5. Vérifier
docker compose ps
curl http://localhost:5000/api/health
```

---

## Dépannage

### Les Conteneurs ne Démarrent Pas
```bash
# Vérifier les logs
docker compose logs backend

# Vérifier si les ports sont utilisés
sudo lsof -i :5000  # Backend
sudo lsof -i :80    # Frontend
sudo lsof -i :5432  # PostgreSQL
```

### Problèmes de Connexion à la Base de Données
```bash
# Vérifier que postgres est en bonne santé
docker compose ps

# Tester la connexion depuis le backend
docker exec cga-backend ping -c 3 postgres

# Redémarrer la base de données
docker compose restart postgres
```

### Tout Réinitialiser
```bash
# Arrêter et tout supprimer
docker compose down -v

# Nettoyer le cache Docker
docker system prune -a

# Redémarrer à zéro
docker compose up -d
```

---

## Vérifications de Santé

```bash
# Santé du backend
curl http://localhost:5000/api/health

# Santé du frontend
curl http://localhost/

# Santé de la base de données
docker exec cga-postgres pg_isready -U postgres

# État de tous les services
docker compose ps
```

---

## Points d'Accès

| Service | URL | Identifiants |
|---------|-----|--------------|
| Frontend | http://localhost | admin / Admin@123456 |
| Backend API | http://localhost:5000/api | JWT requis |
| Base de données | localhost:5432 | postgres / (voir .env) |

---

## Emplacements des Fichiers

| Objectif | Chemin |
|----------|--------|
| Docker Compose | `./docker-compose.yml` |
| Environnement | `./.env` |
| Dockerfile Backend | `./backend/Dockerfile` |
| Dockerfile Frontend | `./frontend/Dockerfile` |
| Config Nginx | `./frontend/nginx.conf` |
| Scripts BDD | `./backend/scripts/*.sql` |

---

## Liste de Vérification Production

- [ ] Changer DB_PASSWORD
- [ ] Générer JWT_SECRET
- [ ] Générer JWT_REFRESH_SECRET
- [ ] Générer SESSION_SECRET
- [ ] Mettre à jour FRONTEND_URL
- [ ] Mettre à jour CORS_ORIGINS
- [ ] Configurer SSL/HTTPS
- [ ] Mettre en place les sauvegardes automatiques
- [ ] Configurer la surveillance
- [ ] Tester la reprise après sinistre

---

## Alias Utiles (Optionnel)

Ajouter à `~/.bashrc` ou `~/.zshrc` :

```bash
# Raccourcis Docker Compose
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias dcps='docker compose ps'
alias dcrestart='docker compose restart'

# Spécifique CGA
alias cga-logs='docker compose logs -f'
alias cga-status='docker compose ps'
alias cga-backend-logs='docker compose logs -f backend'
alias cga-frontend-logs='docker compose logs -f frontend'
alias cga-db='docker exec -it cga-postgres psql -U postgres -d cga_db'
alias cga-backup='docker exec cga-postgres pg_dump -U postgres cga_db > backup_$(date +%Y%m%d).sql'
```

---

## Commandes d'Urgence

### Service qui ne Répond Pas
```bash
docker compose restart backend
docker compose logs -f backend
```

### Manque de Mémoire
```bash
docker stats
docker system prune -a
```

### Base de Données Corrompue
```bash
# Restaurer depuis une sauvegarde
docker exec -i cga-postgres psql -U postgres -d cga_db < derniere_sauvegarde.sql
```

### Réinitialisation Complète
```bash
docker compose down -v
docker system prune -a
# Relancer la configuration initiale
```

---

## Support

Pour des informations détaillées, voir :
- **English:** `DOCKER_DEPLOYMENT_GUIDE.md`
- **Français:** `DOCKER_DEPLOYMENT_GUIDE.fr.md`
- **Résumé:** `DEPLOYMENT_COMPLETE.md`

---

**Version :** 1.0.0
**Dernière Mise à Jour :** 2025-12-09
