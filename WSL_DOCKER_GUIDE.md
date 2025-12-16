# 🐧 Guide WSL + Docker - CGA Application

## 📋 Guide Complet pour Exécuter le Projet dans WSL avec Docker

Ce guide vous permettra d'installer WSL, Docker, et de lancer l'application CGA dans un environnement Linux sous Windows.

---

## 📦 Prérequis

- ✅ Windows 10 version 2004+ ou Windows 11
- ✅ Droits administrateur sur Windows
- ✅ 8GB RAM minimum recommandé
- ✅ 20GB espace disque disponible

---

## 🚀 Étape 1: Installation de WSL 2

### 1.1 Activer WSL

Ouvrir PowerShell en tant qu'**Administrateur** et exécuter:

```powershell
# Activer WSL
wsl --install

# Ou si déjà installé, mettre à jour
wsl --update

# Définir WSL 2 comme version par défaut
wsl --set-default-version 2
```

### 1.2 Installer Ubuntu

```powershell
# Installer Ubuntu 22.04 LTS (recommandé)
wsl --install -d Ubuntu-22.04

# Ou lister les distributions disponibles
wsl --list --online

# Vérifier l'installation
wsl --list --verbose
```

### 1.3 Configuration Initiale d'Ubuntu

Lors du premier lancement:
1. Choisir un nom d'utilisateur (ex: `devuser`)
2. Définir un mot de passe (ne s'affiche pas en tapant - normal)
3. Confirmer le mot de passe

```bash
# Mettre à jour Ubuntu
sudo apt update && sudo apt upgrade -y

# Installer les outils essentiels
sudo apt install -y curl wget git build-essential
```

---

## 🐳 Étape 2: Installation de Docker dans WSL

### 2.1 Désinstaller Docker Desktop (si installé)

Si vous avez Docker Desktop pour Windows, vous pouvez:
- **Option A**: Le garder et activer l'intégration WSL 2
- **Option B**: Le désinstaller et installer Docker directement dans WSL

### Option A: Docker Desktop avec WSL 2 (Recommandé pour débutants)

```powershell
# 1. Installer Docker Desktop depuis https://www.docker.com/products/docker-desktop

# 2. Dans Docker Desktop:
# Settings → Resources → WSL Integration
# ✅ Activer "Enable integration with my default WSL distro"
# ✅ Activer Ubuntu-22.04
```

### Option B: Docker Natif dans WSL (Pour utilisateurs avancés)

```bash
# Dans WSL Ubuntu, installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Démarrer le service Docker
sudo service docker start

# Vérifier l'installation
docker --version
docker ps
```

### 2.2 Installer Docker Compose

```bash
# Docker Compose est inclus avec Docker Desktop
# Pour installation native dans WSL:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier
docker-compose --version
```

---

## 📂 Étape 3: Créer la Structure du Projet dans WSL

### 3.1 Accéder à WSL

```powershell
# Depuis PowerShell/CMD, lancer WSL
wsl

# Ou lancer Ubuntu directement depuis le menu Démarrer
```

### 3.2 Créer le Répertoire du Projet

```bash
# Dans WSL, créer un dossier pour vos projets
mkdir -p ~/projets
cd ~/projets

# Cloner le projet depuis GitHub
git clone https://github.com/MoctarSidibe/carte-grise.git
cd carte-grise

# Vérifier la structure
ls -la
```

### 3.3 Configuration Git (si nécessaire)

```bash
# Configurer Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Générer une clé SSH pour GitHub (optionnel)
ssh-keygen -t ed25519 -C "votre.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copier et ajouter sur GitHub
```

---

## ⚙️ Étape 4: Configuration de l'Application

### 4.1 Copier les Variables d'Environnement

```bash
# Dans le dossier du projet
cd ~/projets/carte-grise

# Copier le fichier .env.example
cp .env.example .env

# Éditer avec nano ou vim
nano .env
```

### 4.2 Configurer les Variables

```env
# Application
NODE_ENV=development
PORT=5000

# Database (Docker utilisera ces valeurs)
DB_HOST=postgres  # Nom du service Docker
DB_PORT=5432
DB_NAME=carte_grise
DB_USER=postgres
DB_PASSWORD=postgres_password_change_me

# JWT
JWT_SECRET=votre_super_secret_jwt_minimum_32_caracteres_change_me
JWT_REFRESH_SECRET=votre_super_secret_refresh_minimum_32_caracteres_change_me
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# NFC & QR Code
NFC_SECRET=votre_secret_nfc_minimum_32_caracteres
QR_CODE_SIZE=300

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

Sauvegarder: `Ctrl+O`, `Enter`, puis quitter: `Ctrl+X`

---

## 🐳 Étape 5: Lancer l'Application avec Docker

### 5.1 Build et Démarrage

```bash
cd ~/projets/carte-grise

# Construire les images Docker
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

Vous devriez voir:
```
NAME                 SERVICE    STATUS
carte-grise-frontend frontend   Up
carte-grise-backend  backend    Up
carte-grise-postgres postgres   Up
```

### 5.2 Initialiser la Base de Données

```bash
# Attendre 10 secondes que PostgreSQL démarre
sleep 10

# Créer les tables
docker-compose exec postgres psql -U postgres -d carte_grise -f /docker-entrypoint-initdb.d/02_create_tables.sql

# Charger les données de test
docker-compose exec postgres psql -U postgres -d carte_grise -f /docker-entrypoint-initdb.d/03_seed_data.sql
```

### 5.3 Vérifier les Logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Arrêter les logs: Ctrl+C
```

---

## 🌐 Étape 6: Accéder à l'Application

### 6.1 URLs d'Accès

Depuis votre navigateur Windows:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/v1

### 6.2 Identifiants par Défaut

```
Username: admin
Password: Admin@123456
```

⚠️ **Changez ce mot de passe immédiatement après la première connexion!**

---

## 🔧 Commandes Utiles

### Gestion Docker

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer un service
docker-compose restart backend

# Voir les logs en temps réel
docker-compose logs -f

# Exécuter une commande dans un conteneur
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d carte_grise
```

### Gestion de la Base de Données

```bash
# Se connecter à PostgreSQL
docker-compose exec postgres psql -U postgres -d carte_grise

# Lister les tables
\dt

# Voir les utilisateurs
SELECT username, email, first_name, last_name FROM users;

# Voir les rôles
SELECT name, description FROM roles;

# Quitter psql
\q

# Backup de la base
docker-compose exec postgres pg_dump -U postgres carte_grise > backup.sql

# Restaurer la base
docker-compose exec -T postgres psql -U postgres carte_grise < backup.sql
```

### Gestion WSL

```bash
# Depuis PowerShell Windows:

# Lister les distributions WSL
wsl --list --verbose

# Arrêter WSL
wsl --shutdown

# Redémarrer une distribution
wsl -d Ubuntu-22.04

# Désinstaller une distribution
wsl --unregister Ubuntu-22.04

# Exporter une distribution (backup)
wsl --export Ubuntu-22.04 C:\backup-wsl-ubuntu.tar

# Importer une distribution
wsl --import Ubuntu-Restored C:\wsl-ubuntu C:\backup-wsl-ubuntu.tar
```

---

## 📁 Structure des Fichiers WSL

### Accéder aux Fichiers Windows depuis WSL

```bash
# Les disques Windows sont montés dans /mnt/
cd /mnt/c/Users/VotreNom/Downloads

# Copier depuis Windows vers WSL
cp /mnt/c/Users/VotreNom/file.txt ~/projets/

# Copier depuis WSL vers Windows
cp ~/projets/file.txt /mnt/c/Users/VotreNom/Downloads/
```

### Accéder aux Fichiers WSL depuis Windows

Dans l'Explorateur de Fichiers Windows, taper:
```
\\wsl$\Ubuntu-22.04\home\votreuser\projets\carte-grise
```

Ou depuis PowerShell:
```powershell
# Ouvrir l'explorateur WSL
explorer.exe \\wsl$\Ubuntu-22.04\home\votreuser\projets\carte-grise
```

---

## 🛠️ Développement dans WSL

### Éditeurs de Code Recommandés

#### VS Code (Recommandé)

```bash
# Installer extension "Remote - WSL"
# Puis depuis WSL:
cd ~/projets/carte-grise
code .
```

VS Code s'ouvrira connecté directement à WSL!

#### Vim/Nano

```bash
# Déjà installés dans Ubuntu
nano ~/projets/carte-grise/backend/.env
vim ~/projets/carte-grise/frontend/src/App.js
```

---

## 🔍 Débogage et Résolution de Problèmes

### Problème: Docker ne démarre pas

```bash
# Vérifier le service Docker
sudo service docker status

# Démarrer Docker manuellement
sudo service docker start

# Vérifier les erreurs
sudo journalctl -u docker.service
```

### Problème: Port déjà utilisé

```bash
# Trouver quel processus utilise le port 3000
sudo lsof -i :3000

# Tuer le processus (remplacer PID)
kill -9 PID

# Ou changer le port dans docker-compose.yml
```

### Problème: PostgreSQL ne se connecte pas

```bash
# Vérifier que le conteneur tourne
docker-compose ps

# Voir les logs PostgreSQL
docker-compose logs postgres

# Se connecter manuellement
docker-compose exec postgres psql -U postgres

# Tester la connexion
\l  # Lister les bases de données
\c carte_grise  # Se connecter
\dt  # Lister les tables
```

### Problème: Erreurs de permissions

```bash
# Donner les bonnes permissions au projet
cd ~/projets
sudo chown -R $USER:$USER carte-grise
chmod -R 755 carte-grise
```

### Problème: Build échoue

```bash
# Nettoyer complètement Docker
docker-compose down -v
docker system prune -a --volumes

# Reconstruire tout
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Workflow de Développement Recommandé

### 1. Démarrage du Projet

```bash
# 1. Ouvrir WSL
wsl

# 2. Aller dans le projet
cd ~/projets/carte-grise

# 3. Mettre à jour le code (si nécessaire)
git pull origin main

# 4. Lancer Docker
docker-compose up -d

# 5. Voir les logs
docker-compose logs -f
```

### 2. Modifications du Code

```bash
# Frontend - Les changements se rechargent automatiquement (Hot Reload)
code frontend/src/pages/Dashboard.js

# Backend - Redémarrer après modifications
docker-compose restart backend
```

### 3. Tester les Changements

```bash
# Ouvrir navigateur: http://localhost:3000

# Tester l'API
curl http://localhost:5000/api/v1/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123456"}'
```

### 4. Commit et Push

```bash
# Vérifier les changements
git status
git diff

# Ajouter et commiter
git add .
git commit -m "feat: Description des changements"

# Pousser vers GitHub
git push origin main
```

---

## 🔄 Migration depuis Windows vers WSL

### Copier le Projet Existant

Si vous avez déjà le projet dans `C:\Users\user\Downloads\pca`:

```bash
# Dans WSL
cd ~/projets

# Copier depuis Windows vers WSL
cp -r /mnt/c/Users/user/Downloads/pca ./carte-grise

# Ou cloner directement depuis GitHub (recommandé)
git clone https://github.com/MoctarSidibe/carte-grise.git

cd carte-grise

# Vérifier que tout est là
ls -la
```

---

## 💻 Commandes WSL Essentielles

### Navigation

```bash
# Répertoire personnel
cd ~
cd /home/votreuser

# Lister les fichiers
ls -la

# Créer un dossier
mkdir nom_dossier

# Supprimer un dossier
rm -rf nom_dossier

# Copier
cp source destination

# Déplacer/Renommer
mv source destination

# Afficher le contenu d'un fichier
cat fichier.txt

# Éditer un fichier
nano fichier.txt
```

### Gestion des Processus

```bash
# Voir les processus en cours
ps aux

# Voir les ports utilisés
sudo netstat -tuln | grep LISTEN

# Tuer un processus
kill PID
kill -9 PID  # Force kill
```

### Permissions

```bash
# Changer le propriétaire
sudo chown -R $USER:$USER dossier/

# Changer les permissions
chmod 755 fichier  # rwxr-xr-x
chmod 644 fichier  # rw-r--r--
chmod +x script.sh  # Rendre exécutable
```

---

## 🚀 Démarrage Rapide - TL;DR

```bash
# 1. Installer WSL et Ubuntu
wsl --install -d Ubuntu-22.04

# 2. Mettre à jour
sudo apt update && sudo apt upgrade -y

# 3. Installer Docker Desktop (avec intégration WSL)
# Télécharger depuis https://www.docker.com/products/docker-desktop

# 4. Cloner le projet
cd ~
mkdir projets && cd projets
git clone https://github.com/MoctarSidibe/carte-grise.git
cd carte-grise

# 5. Configurer
cp .env.example .env
nano .env  # Modifier les secrets

# 6. Lancer
docker-compose up -d

# 7. Initialiser la DB (attendre 15 secondes)
sleep 15
docker-compose exec postgres psql -U postgres -d carte_grise -f /docker-entrypoint-initdb.d/02_create_tables.sql
docker-compose exec postgres psql -U postgres -d carte_grise -f /docker-entrypoint-initdb.d/03_seed_data.sql

# 8. Accéder
# http://localhost:3000
# admin / Admin@123456
```

---

## 📁 Organisation des Fichiers Recommandée

```
Windows:
C:\Users\VotreNom\
└── Documents\
    └── projets-windows\  # Projets Windows natifs

WSL Ubuntu:
/home/votreuser/
├── projets/                  # Projets WSL/Docker
│   ├── carte-grise/         # Notre application
│   └── autres-projets/
└── .ssh/                     # Clés SSH
```

**⚠️ Important**: Gardez les projets Docker **dans WSL** (`~/projets/`) pour de meilleures performances!

---

## 🎯 Bonnes Pratiques

### Performance

1. ✅ **Toujours** travailler dans le système de fichiers WSL (`~/`) pour Docker
2. ✅ Éviter `/mnt/c/` pour les projets Docker (très lent)
3. ✅ Utiliser VS Code avec l'extension Remote-WSL
4. ✅ Allouer suffisamment de ressources à WSL

### Ressources WSL

Créer le fichier: `C:\Users\VotreNom\.wslconfig`

```ini
[wsl2]
memory=4GB
processors=4
swap=2GB
```

Redémarrer WSL:
```powershell
wsl --shutdown
wsl
```

### Sécurité

1. ✅ Changer tous les mots de passe par défaut
2. ✅ Utiliser des secrets forts (32+ caractères)
3. ✅ Ne jamais commiter le fichier `.env`
4. ✅ Utiliser HTTPS en production (Traefik + Let's Encrypt)

---

## 🔧 Scripts Utiles

### Script de Démarrage Rapide

Créer `start.sh`:
```bash
#!/bin/bash
cd ~/projets/carte-grise
docker-compose up -d
echo "✅ Services démarrés!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:5000"
docker-compose ps
```

Rendre exécutable:
```bash
chmod +x start.sh
./start.sh
```

### Script de Nettoyage

Créer `clean.sh`:
```bash
#!/bin/bash
cd ~/projets/carte-grise
docker-compose down -v
docker system prune -af --volumes
echo "✅ Nettoyage terminé!"
```

---

## 📊 Vérification Post-Installation

### Checklist

```bash
# ✅ WSL installé
wsl --version

# ✅ Ubuntu fonctionne
wsl -d Ubuntu-22.04 uname -a

# ✅ Docker fonctionne
docker --version
docker ps

# ✅ Docker Compose fonctionne
docker-compose --version

# ✅ Git configuré
git config --list

# ✅ Projet cloné
ls ~/projets/carte-grise

# ✅ Services Docker lancés
docker-compose ps

# ✅ Base de données accessible
docker-compose exec postgres psql -U postgres -d carte_grise -c "\dt"

# ✅ Backend répond
curl http://localhost:5000/health

# ✅ Frontend accessible
curl http://localhost:3000
```

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- **WSL**: https://docs.microsoft.com/en-us/windows/wsl/
- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **PostgreSQL**: https://www.postgresql.org/docs/

### Tutoriels Vidéo

- Installation WSL 2: https://www.youtube.com/results?search_query=wsl+2+installation
- Docker dans WSL: https://www.youtube.com/results?search_query=docker+wsl

### Communautés

- Stack Overflow: https://stackoverflow.com/questions/tagged/wsl
- Reddit r/docker: https://www.reddit.com/r/docker/
- Docker Forums: https://forums.docker.com/

---

## 🆘 Support et Aide

### En Cas de Problème

1. 📧 Ouvrir une issue: https://github.com/MoctarSidibe/carte-grise/issues
2. 📖 Consulter IMPLEMENTATION_GUIDE.md
3. 📋 Vérifier les logs: `docker-compose logs -f`
4. 🔍 Google l'erreur spécifique

### Commandes de Diagnostic

```bash
# Informations système
wsl --version
docker info
docker-compose version

# Espace disque
df -h

# Mémoire
free -h

# Processus Docker
docker stats

# Réseau
docker network ls
docker network inspect carte-grise_default
```

---

## 🎓 Étapes Suivantes

Après avoir lancé l'application avec succès:

1. ✅ Se connecter avec `admin / Admin@123456`
2. ✅ Changer le mot de passe admin
3. ✅ Créer des rôles supplémentaires
4. ✅ Ajouter des utilisateurs
5. ✅ Créer des workflows
6. ✅ Créer des formulaires
7. ✅ Tester une demande complète

---

## 💡 Astuces Pro

### Alias Bash Utiles

Ajouter dans `~/.bashrc`:
```bash
# Alias pour le projet CGA
alias cga='cd ~/projets/carte-grise'
alias cga-start='cd ~/projets/carte-grise && docker-compose up -d'
alias cga-stop='cd ~/projets/carte-grise && docker-compose down'
alias cga-logs='cd ~/projets/carte-grise && docker-compose logs -f'
alias cga-db='docker-compose exec postgres psql -U postgres -d carte_grise'
```

Recharger:
```bash
source ~/.bashrc
```

Utilisation:
```bash
cga          # Va dans le projet
cga-start    # Démarre tout
cga-logs     # Affiche les logs
cga-db       # Ouvre psql
```

### VS Code Extensions

Installer ces extensions:
- Remote - WSL
- Docker
- PostgreSQL
- GitLens
- ESLint
- Prettier

---

<div align="center">

## 🎉 Félicitations!

Vous êtes maintenant prêt à développer l'application CGA dans WSL avec Docker!

**⭐ N'oubliez pas de star le repo GitHub! ⭐**

---

*Guide créé le 16 Décembre 2024*
*Version 1.0*

</div>
