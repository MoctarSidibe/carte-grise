# 🐳 Guide Docker & Déploiement - Application CGA

## Guide Complet Étape par Étape pour Débutants

Ce guide vous aidera à dockeriser et déployer l'application CGA (Carte Grise Administrative) sur un serveur Ubuntu.

---

## Table des Matières

1. [Prérequis](#prérequis)
2. [Comprendre Docker](#comprendre-docker)
3. [Structure du Projet](#structure-du-projet)
4. [Configuration Docker Locale](#configuration-docker-locale)
5. [Configuration du Serveur Ubuntu](#configuration-du-serveur-ubuntu)
6. [Déploiement sur Serveur Ubuntu](#déploiement-sur-serveur-ubuntu)
7. [Configuration SSL/HTTPS](#configuration-sslhttps)
8. [Surveillance & Maintenance](#surveillance--maintenance)
9. [Dépannage](#dépannage)
10. [Bonnes Pratiques de Sécurité](#bonnes-pratiques-de-sécurité)

---

## Prérequis

### Ce Dont Vous Avez Besoin :
- **Machine Locale:** Windows/Mac/Linux avec Docker installé
- **Serveur Ubuntu:** Ubuntu 20.04 ou 22.04 LTS
- **Accès Serveur:** Accès SSH à votre serveur Ubuntu
- **Nom de Domaine:** (Optionnel mais recommandé pour la production)
- **Connaissances de Base:** Bases de la ligne de commande

---

## Comprendre Docker

### Qu'est-ce que Docker ?

Docker est une plateforme qui empaquette votre application avec toutes ses dépendances dans des **conteneurs**. Pensez aux conteneurs comme des boîtes légères et portables qui contiennent tout ce dont votre application a besoin pour fonctionner.

### Concepts Clés :

- **Dockerfile:** Recette pour construire une image Docker (comme un plan)
- **Image:** Instantané de votre application (comme un modèle)
- **Conteneur:** Instance en cours d'exécution d'une image (comme une app qui tourne)
- **Docker Compose:** Outil pour exécuter plusieurs conteneurs ensemble
- **Volume:** Stockage persistant pour les données des conteneurs

### Pourquoi Docker ?

✅ **Cohérence:** Fonctionne de la même manière en dev, staging et production
✅ **Isolation:** Chaque service s'exécute dans son propre conteneur
✅ **Scalabilité:** Facile de scaler les services indépendamment
✅ **Portabilité:** Déployez partout où Docker fonctionne

---

## Structure du Projet

```
pca/
├── backend/
│   ├── Dockerfile              # Recette du conteneur backend
│   ├── .dockerignore          # Fichiers à exclure de l'image
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile              # Recette du conteneur frontend
│   ├── .dockerignore
│   ├── nginx.conf             # Configuration Nginx
│   └── package.json
├── docker-compose.yml          # Orchestre tous les conteneurs
├── .env.docker                 # Template des variables d'environnement
└── DOCKER_DEPLOYMENT_GUIDE.md  # Ce fichier
```

---

## Configuration Docker Locale

### Étape 1 : Installer Docker

#### Windows/Mac :
1. Téléchargez [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Installez et redémarrez votre ordinateur
3. Vérifiez l'installation :
```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu) :
```bash
# Mettre à jour l'index des paquets
sudo apt update

# Installer les prérequis
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajouter la clé GPG officielle de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version

# Ajouter votre utilisateur au groupe docker (optionnel, pour exécuter sans sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Étape 2 : Configurer les Variables d'Environnement

1. **Copier le template d'environnement :**
```bash
cd /chemin/vers/pca
cp .env.docker .env
```

2. **Éditer le fichier .env :**
```bash
nano .env  # ou utilisez n'importe quel éditeur de texte
```

3. **Mettre à jour ces valeurs critiques :**
```env
# Base de données
DB_PASSWORD=votre-mot-de-passe-fort-ici

# Secrets JWT (générer des chaînes aléatoires de 32+ caractères)
JWT_SECRET=utilisez-commande-ci-dessous-pour-generer
JWT_REFRESH_SECRET=utilisez-commande-ci-dessous-pour-generer
SESSION_SECRET=utilisez-commande-ci-dessous-pour-generer
```

4. **Générer des secrets sécurisés aléatoires :**
```bash
# Sur Linux/Mac :
openssl rand -base64 32

# Sur Windows (PowerShell) :
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Ou en ligne : https://generate.plus/en/base64
```

### Étape 3 : Construire et Exécuter Localement

1. **Construire les images Docker :**
```bash
cd /chemin/vers/pca
docker compose build
```

Cela va :
- Construire l'image Node.js du backend
- Construire l'image React du frontend avec Nginx
- Télécharger l'image PostgreSQL

2. **Démarrer tous les services :**
```bash
docker compose up -d
```

Le flag `-d` exécute les conteneurs en mode détaché (arrière-plan).

3. **Vérifier que les conteneurs fonctionnent :**
```bash
docker compose ps
```

Vous devriez voir 3 conteneurs :
- `cga-postgres` (base de données)
- `cga-backend` (API)
- `cga-frontend` (interface web)

4. **Voir les logs :**
```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

Appuyez sur `Ctrl+C` pour arrêter la visualisation des logs.

5. **Initialiser la base de données :**

La première configuration nécessite l'exécution des scripts SQL :

```bash
# Copier les scripts SQL dans le conteneur postgres
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql
```

6. **Accéder à l'application :**
- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Connexion:** admin / Admin@123456

### Étape 4 : Gérer les Conteneurs Docker

#### Arrêter tous les services :
```bash
docker compose down
```

#### Arrêter et supprimer toutes les données (y compris la base de données) :
```bash
docker compose down -v
```

⚠️ **Attention :** Cela supprime toutes les données de la base de données !

#### Redémarrer un service spécifique :
```bash
docker compose restart backend
```

#### Voir l'utilisation des ressources :
```bash
docker stats
```

#### Exécuter des commandes dans un conteneur :
```bash
# Accéder au shell du conteneur backend
docker exec -it cga-backend sh

# Accéder à PostgreSQL
docker exec -it cga-postgres psql -U postgres -d cga_db
```

---

## Configuration du Serveur Ubuntu

### Étape 1 : Exigences du Serveur

**Configuration Minimale :**
- **CPU:** 2 cœurs
- **RAM:** 4GB
- **Stockage:** 20GB SSD
- **OS:** Ubuntu 20.04 ou 22.04 LTS

**Recommandé :**
- **CPU:** 4+ cœurs
- **RAM:** 8GB+
- **Stockage:** 40GB+ SSD

### Étape 2 : Configuration Initiale du Serveur

1. **Se connecter au serveur via SSH :**
```bash
ssh utilisateur@ip-de-votre-serveur
```

Exemple :
```bash
ssh root@198.51.100.42
```

2. **Mettre à jour le système :**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Créer un nouvel utilisateur (si vous utilisez root) :**
```bash
# Créer l'utilisateur
sudo adduser cgaadmin

# Ajouter au groupe sudo
sudo usermod -aG sudo cgaadmin

# Basculer vers le nouvel utilisateur
su - cgaadmin
```

4. **Configurer le pare-feu :**
```bash
# Activer le pare-feu
sudo ufw enable

# Autoriser SSH (IMPORTANT !)
sudo ufw allow OpenSSH

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Autoriser PostgreSQL (seulement si nécessaire en externe)
# sudo ufw allow 5432/tcp

# Vérifier le statut
sudo ufw status
```

### Étape 3 : Installer Docker sur le Serveur Ubuntu

```bash
# Mettre à jour l'index des paquets
sudo apt update

# Installer les prérequis
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajouter la clé GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version

# Démarrer le service Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Appliquer l'appartenance au groupe (se déconnecter et se reconnecter, ou utiliser) :
newgrp docker

# Tester Docker
docker run hello-world
```

### Étape 4 : Installer Git

```bash
sudo apt install -y git
git --version
```

---

## Déploiement sur Serveur Ubuntu

### Méthode 1 : Utilisation de Git (Recommandé)

#### Étape 1 : Cloner le Dépôt

Si votre code est sur GitHub/GitLab :

```bash
# Naviguer vers le répertoire home
cd ~

# Cloner le dépôt
git clone https://github.com/votre-utilisateur/pca.git

# Entrer dans le répertoire du projet
cd pca
```

Ou si vous devez d'abord pousser votre code local vers Git :

```bash
# Sur votre machine locale
cd /chemin/vers/pca
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-utilisateur/pca.git
git push -u origin main
```

#### Étape 2 : Configurer l'Environnement

```bash
# Copier le template d'environnement
cp .env.docker .env

# Éditer les variables d'environnement
nano .env
```

**Mettre à jour ces valeurs :**
```env
# Utilisez des mots de passe forts !
DB_PASSWORD=creer-mot-de-passe-fort-ici

# Générer des secrets (exécutez ces commandes) :
# openssl rand -base64 32
JWT_SECRET=coller-secret-genere-ici
JWT_REFRESH_SECRET=coller-secret-genere-ici
SESSION_SECRET=coller-secret-genere-ici

# Mettre à jour les URLs
FRONTEND_URL=http://votre-domaine.com
CORS_ORIGINS=http://votre-domaine.com,https://votre-domaine.com

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
```

#### Étape 3 : Construire et Déployer

```bash
# Construire les images
docker compose build

# Démarrer les services
docker compose up -d

# Vérifier le statut
docker compose ps

# Voir les logs
docker compose logs -f
```

#### Étape 4 : Initialiser la Base de Données

```bash
# Exécuter les scripts de base de données
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/02_create_tables.sql
docker exec -i cga-postgres psql -U postgres -d cga_db < backend/scripts/03_seed_data.sql

# Vérifier la base de données
docker exec -it cga-postgres psql -U postgres -d cga_db -c "\dt"
```

#### Étape 5 : Tester l'Application

```bash
# Tester la santé du backend
curl http://localhost:5000/api/health

# Tester le frontend
curl http://localhost
```

Accéder depuis le navigateur : `http://ip-de-votre-serveur`

### Méthode 2 : Utilisation de SCP (Transfert de Fichiers)

Si vous n'utilisez pas Git :

#### Sur Votre Machine Locale :

```bash
# Créer une archive tar
cd /chemin/vers/pca
tar -czf cga-app.tar.gz .

# Transférer vers le serveur
scp cga-app.tar.gz utilisateur@ip-de-votre-serveur:~/
```

#### Sur le Serveur Ubuntu :

```bash
# Extraire les fichiers
cd ~
mkdir -p cga-app
tar -xzf cga-app.tar.gz -C cga-app
cd cga-app

# Continuer avec l'Étape 2 de la Méthode 1 (Configurer l'Environnement)
```

---

## Configuration SSL/HTTPS

### Option 1 : Let's Encrypt avec Certbot (Recommandé)

Let's Encrypt fournit des **certificats SSL gratuits**.

#### Prérequis :
- Nom de domaine pointant vers l'IP de votre serveur
- Ports 80 et 443 ouverts

#### Étape 1 : Installer Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Étape 2 : Arrêter Docker Nginx (temporaire)

```bash
docker compose stop frontend
```

#### Étape 3 : Obtenir le Certificat

```bash
# Remplacer par votre domaine
sudo certbot certonly --standalone -d votre-domaine.com -d www.votre-domaine.com
```

Suivez les instructions. Les certificats seront sauvegardés dans :
- Certificat : `/etc/letsencrypt/live/votre-domaine.com/fullchain.pem`
- Clé Privée : `/etc/letsencrypt/live/votre-domaine.com/privkey.pem`

#### Étape 4 : Créer la Configuration Nginx SSL

```bash
cd ~/pca
mkdir -p nginx/ssl
```

Créer `nginx/nginx-ssl.conf` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

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

#### Étape 5 : Mettre à Jour docker-compose.yml

Mettre à jour le service frontend :

```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
    - ./nginx/nginx-ssl.conf:/etc/nginx/conf.d/default.conf
  ports:
    - "80:80"
    - "443:443"
```

#### Étape 6 : Redémarrer les Services

```bash
docker compose up -d
```

#### Étape 7 : Renouvellement Automatique des Certificats

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Certbot renouvellera automatiquement via cron
```

### Option 2 : Cloudflare SSL (Le Plus Simple)

1. Inscrivez-vous sur [Cloudflare](https://cloudflare.com) (gratuit)
2. Ajoutez votre domaine
3. Mettez à jour les serveurs de noms chez votre registraire de domaine
4. Activez le mode SSL "Full" dans le tableau de bord Cloudflare
5. Cloudflare gère le SSL automatiquement !

---

## Surveillance & Maintenance

### Vérifications de Santé Docker

Vérifier la santé des conteneurs :

```bash
docker compose ps
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

### Voir les Logs

```bash
# Logs en temps réel
docker compose logs -f

# Les 100 dernières lignes
docker compose logs --tail=100

# Service spécifique
docker compose logs -f backend
```

### Sauvegarder la Base de Données

#### Sauvegarde Manuelle :

```bash
# Créer une sauvegarde
docker exec cga-postgres pg_dump -U postgres cga_db > backup_$(date +%Y%m%d).sql

# Restaurer une sauvegarde
docker exec -i cga-postgres psql -U postgres cga_db < backup_20231201.sql
```

#### Script de Sauvegarde Quotidienne Automatisée :

Créer `backup.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/home/cgaadmin/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="cga_backup_$DATE.sql"

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarder la base de données
docker exec cga-postgres pg_dump -U postgres cga_db > $BACKUP_DIR/$FILENAME

# Compresser la sauvegarde
gzip $BACKUP_DIR/$FILENAME

# Supprimer les sauvegardes de plus de 30 jours
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Sauvegarde terminée : $FILENAME.gz"
```

Rendre exécutable et programmer :

```bash
chmod +x backup.sh

# Ajouter au crontab (quotidien à 2h du matin)
crontab -e

# Ajouter cette ligne :
0 2 * * * /home/cgaadmin/backup.sh >> /home/cgaadmin/backup.log 2>&1
```

### Mettre à Jour l'Application

```bash
# Récupérer les dernières modifications (si utilisation de Git)
cd ~/pca
git pull

# Reconstruire les images
docker compose build

# Redémarrer les services
docker compose up -d

# Voir les logs
docker compose logs -f
```

### Surveillance des Ressources

```bash
# Statistiques des conteneurs
docker stats

# Utilisation du disque
docker system df

# Nettoyer les ressources inutilisées
docker system prune -a
```

### Surveillance Système avec htop

```bash
# Installer htop
sudo apt install -y htop

# Exécuter
htop
```

---

## Dépannage

### Problèmes Courants et Solutions

#### 1. Le conteneur ne démarre pas

```bash
# Vérifier les logs
docker compose logs backend

# Problèmes courants :
# - Base de données pas prête : Attendre 30 secondes et redémarrer
# - Port déjà utilisé : Changer le port dans .env
```

#### 2. Échec de connexion à la base de données

```bash
# Vérifier si postgres est en bonne santé
docker compose ps

# Redémarrer la base de données
docker compose restart postgres

# Vérifier que le backend peut atteindre postgres
docker exec cga-backend ping postgres
```

#### 3. Le frontend ne peut pas atteindre le backend

```bash
# Vérifier que le backend fonctionne
curl http://localhost:5000/api/health

# Vérifier les paramètres proxy de nginx.conf
docker exec cga-frontend cat /etc/nginx/conf.d/default.conf
```

#### 4. Erreurs de permission refusée

```bash
# Corriger les permissions des fichiers
sudo chown -R $USER:$USER ~/pca

# Corriger le répertoire d'upload
docker exec cga-backend chown -R nodejs:nodejs /app/uploads
```

#### 5. Manque d'espace disque

```bash
# Vérifier l'utilisation du disque
df -h

# Nettoyer Docker
docker system prune -a -f --volumes

# Nettoyer les logs
docker compose down
rm -rf logs/*
docker compose up -d
```

#### 6. Erreurs de certificat SSL

```bash
# Vérifier la validité du certificat
sudo certbot certificates

# Renouveler le certificat
sudo certbot renew --force-renewal

# Redémarrer nginx
docker compose restart frontend
```

### Mode Debug

Activer les logs de débogage :

```bash
# Éditer .env
LOG_LEVEL=debug

# Redémarrer les services
docker compose restart backend

# Voir les logs détaillés
docker compose logs -f backend
```

---

## Bonnes Pratiques de Sécurité

### 1. Variables d'Environnement

✅ **Ne jamais commit .env dans Git**
```bash
# Ajouter à .gitignore
echo ".env" >> .gitignore
```

✅ **Utiliser des secrets forts**
```bash
# Générer des secrets forts
openssl rand -base64 32
```

### 2. Sécurité de la Base de Données

✅ **Mots de passe forts**
```env
DB_PASSWORD=motDePasseTresFort123!@#
```

✅ **Ne pas exposer PostgreSQL en externe**
```yaml
# Dans docker-compose.yml, supprimer :
# ports:
#   - "5432:5432"
```

✅ **Sauvegardes régulières**

### 3. Configuration du Pare-feu

```bash
# Autoriser uniquement les ports nécessaires
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

### 4. Mises à Jour Régulières

```bash
# Mettre à jour les images Docker
docker compose pull
docker compose up -d

# Mettre à jour les paquets du serveur
sudo apt update && sudo apt upgrade -y
```

### 5. Surveillance & Alertes

Considérez l'utilisation de :
- **Uptime Kuma** (surveillance auto-hébergée)
- **Netdata** (surveillance système)
- **Portainer** (gestion Docker GUI)

### 6. Limitation de Débit

Déjà configuré dans le backend :
- 100 requêtes par 15 minutes par IP
- Ajuster dans .env si nécessaire

---

## Optimisation des Performances

### 1. Limites de Ressources

Ajouter à docker-compose.yml :

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

### 2. Activer la Mise en Cache Redis (Optionnel)

Ajouter Redis à docker-compose.yml :

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

### 3. Optimisation de la Base de Données

```sql
-- Se connecter à la base de données
docker exec -it cga-postgres psql -U postgres -d cga_db

-- Créer des index
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
```

---

## Aide-Mémoire des Commandes Utiles

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Voir les logs
docker compose logs -f [nom_service]

# Redémarrer un service
docker compose restart [nom_service]

# Reconstruire un service
docker compose build [nom_service]

# Exécuter une commande dans un conteneur
docker exec -it [nom_conteneur] [commande]

# Accès au shell
docker exec -it cga-backend sh

# Accès à la base de données
docker exec -it cga-postgres psql -U postgres -d cga_db

# Voir l'utilisation des ressources
docker stats

# Nettoyer
docker system prune -a

# Sauvegarder la base de données
docker exec cga-postgres pg_dump -U postgres cga_db > backup.sql

# Vérifier la santé du conteneur
docker inspect cga-backend --format='{{.State.Health.Status}}'
```

---

## Prochaines Étapes

1. ✅ Configurer SSL avec Let's Encrypt
2. ✅ Configurer les sauvegardes automatisées
3. ✅ Mettre en place la surveillance (Uptime Kuma/Netdata)
4. ✅ Configurer les notifications par email
5. ✅ Tester la récupération après sinistre
6. ✅ Documenter votre configuration spécifique
7. ✅ Former votre équipe

---

## Support & Ressources

- **Documentation Docker :** https://docs.docker.com
- **Docker Compose :** https://docs.docker.com/compose/
- **Let's Encrypt :** https://letsencrypt.org/fr/getting-started/
- **Guide Serveur Ubuntu :** https://ubuntu.com/server/docs
- **Documentation Nginx :** https://nginx.org/en/docs/

---

**Félicitations ! Vous avez réussi à dockeriser et déployer l'application CGA !** 🎉

Pour la version anglaise de ce guide, consultez [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)
