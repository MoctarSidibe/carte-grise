# Guide des Rôles Dynamiques - PCA

## 🎯 Vue d'ensemble

Le système PCA utilise maintenant des **rôles entièrement dynamiques**. Aucun rôle n'est codé en dur dans l'application (excepté SYSTEM_ADMIN qui est le super-administrateur). Cela signifie que vous pouvez créer, modifier et supprimer des rôles selon les besoins de votre organisation sans aucune modification de code.

## 🔄 Changements Effectués

### 1. Base de Données (PostgreSQL)

La structure de la base de données était déjà conçue pour les rôles dynamiques :
- Table `roles` avec champs : `id`, `name`, `description`, `is_system_role`
- Table `permissions` pour les permissions granulaires
- Table `role_permissions` pour lier rôles et permissions
- Table `user_roles` pour assigner des rôles aux utilisateurs

**Modifications** :
- ✅ Script de seed (`03_seed_data.sql`) modifié pour ne créer que SYSTEM_ADMIN
- ✅ Exemples de rôles (Patrimoine, DCRTCT) fournis en commentaires
- ✅ Workflows et forms en commentaires (à créer via UI)

### 2. Backend (Node.js/Express)

#### Middleware RBAC (`src/middleware/rbac.js`)
```javascript
// Avant : Rôles hardcodés
requireRole('AGENT', 'VALIDATOR')

// Maintenant : Rôles dynamiques supportés
requireRole('Patrimoine', 'DCRTCT', 'Agent Accueil')
// Fonctionne avec N'IMPORTE QUEL nom de rôle créé dans la DB
```

**Changements** :
- ✅ `requireRole()` : Accepte n'importe quel nom de rôle dynamique
- ✅ `requireOwnershipOrAdmin()` : Vérifie uniquement SYSTEM_ADMIN (seul rôle système)
- ✅ Support des formats string et object pour les rôles

#### API Roles (`src/controllers/roleController.js` + `src/routes/roles.js`)
- ✅ `GET /api/v1/roles` - Liste tous les rôles
- ✅ `POST /api/v1/roles` - Créer un nouveau rôle (SYSTEM_ADMIN uniquement)
- ✅ `PUT /api/v1/roles/:id` - Modifier un rôle (SYSTEM_ADMIN uniquement)
- ✅ `DELETE /api/v1/roles/:id` - Supprimer un rôle (SYSTEM_ADMIN uniquement)
- ✅ `POST /api/v1/roles/:id/permissions` - Assigner permissions

**Protection** :
- ❌ Impossible de créer un rôle nommé "SYSTEM_ADMIN"
- ❌ Impossible de modifier ou supprimer SYSTEM_ADMIN
- ❌ Impossible de supprimer un rôle assigné à des utilisateurs

#### Server (`src/server.js`)
- ✅ Route `/api/v1/roles` activée

### 3. Frontend (React/Material-UI)

#### AuthContext (`src/contexts/AuthContext.js`)
```javascript
// Nouvelles fonctions
hasRole('Patrimoine')      // Vérifie n'importe quel rôle
hasPermission('approve')    // Vérifie permissions
isSystemAdmin()            // Vérifie si SYSTEM_ADMIN
```

**Support** :
- ✅ Format string : `['Patrimoine', 'DCRTCT']`
- ✅ Format object : `[{name: 'Patrimoine'}, {name: 'DCRTCT'}]`

#### Protected Routes (`src/App.js`)
```javascript
// Fonctionne avec n'importe quel rôle
<ProtectedRoute requiredRole="Patrimoine">
  <Applications />
</ProtectedRoute>

<ProtectedRoute requiredPermission="approve_applications">
  <ApplicationDetail />
</ProtectedRoute>
```

#### Page Gestion des Rôles (`src/pages/RoleManagement.js`)
- ✅ Interface pour visualiser les rôles
- ✅ Création de nouveaux rôles
- ✅ Modification/Suppression (sauf SYSTEM_ADMIN)
- ✅ Exemples de rôles affichés (Patrimoine, DCRTCT, etc.)

### 4. Documentation

#### README.md
- ✅ Section dédiée aux rôles dynamiques
- ✅ Exemples de rôles métier (Patrimoine, DCRTCT, Agent Accueil, etc.)
- ✅ Guide de configuration initiale
- ✅ Tableau d'exemples de rôles avec permissions typiques
- ✅ API documentation pour les endpoints `/api/v1/roles`

## 📝 Exemples de Rôles à Créer

Voici des exemples de rôles que vous pourriez créer pour votre organisation :

### 1. Patrimoine
```json
{
  "name": "Patrimoine",
  "description": "Service Patrimoine - Gestion des demandes de permis",
  "permissions": [
    "view_applications",
    "process_applications",
    "upload_documents",
    "view_documents",
    "sign_documents"
  ]
}
```

### 2. DCRTCT
```json
{
  "name": "DCRTCT",
  "description": "Direction Centrale - Validation finale des demandes",
  "permissions": [
    "view_applications",
    "approve_applications",
    "reject_applications",
    "view_documents",
    "sign_documents",
    "view_audit_logs"
  ]
}
```

### 3. Agent Accueil
```json
{
  "name": "Agent Accueil",
  "description": "Agent d'accueil - Réception et saisie des demandes",
  "permissions": [
    "create_applications",
    "view_applications",
    "update_applications",
    "upload_documents",
    "view_documents"
  ]
}
```

### 4. Validateur Technique
```json
{
  "name": "Validateur Technique",
  "description": "Validation technique des dossiers",
  "permissions": [
    "view_applications",
    "process_applications",
    "upload_documents",
    "view_documents",
    "sign_documents"
  ]
}
```

## 🚀 Comment Créer un Nouveau Rôle

### Via l'Interface (Recommandé)

1. Connectez-vous en tant que **admin**
2. Allez dans **Gestion des Rôles**
3. Cliquez sur **Nouveau Rôle**
4. Remplissez :
   - **Nom** : Nom unique du rôle (ex: "Patrimoine")
   - **Description** : Description détaillée du rôle
5. Sélectionnez les **permissions** appropriées
6. Cliquez sur **Créer**

### Via l'API (Pour développeurs)

```bash
curl -X POST http://localhost:5000/api/v1/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Patrimoine",
    "description": "Service Patrimoine - Gestion des demandes",
    "permissions": ["view_applications", "process_applications"]
  }'
```

### Via SQL (Direct en base de données)

```sql
-- Créer le rôle
INSERT INTO roles (name, description, is_system_role)
VALUES ('Patrimoine', 'Service Patrimoine - Gestion des demandes', FALSE);

-- Récupérer l'ID du rôle créé
SELECT id FROM roles WHERE name = 'Patrimoine';

-- Assigner des permissions (exemple)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'ID_DU_ROLE', id FROM permissions
WHERE name IN ('view_applications', 'process_applications', 'sign_documents');
```

## 🔧 Comment Assigner un Rôle à un Workflow

Lors de la création d'un workflow, chaque étape peut être assignée à un rôle :

```javascript
// Exemple : Étape de workflow
{
  step_name: "Validation Patrimoine",
  step_order: 1,
  assigned_role_id: "ID_DU_ROLE_PATRIMOINE", // ID du rôle "Patrimoine"
  requires_signature: true
}
```

Les utilisateurs ayant le rôle "Patrimoine" verront automatiquement les demandes en attente à cette étape.

## 📊 Permissions Disponibles

Liste des permissions que vous pouvez assigner aux rôles :

### Gestion des Utilisateurs
- `manage_users` - Créer, modifier, supprimer utilisateurs
- `view_users` - Voir les utilisateurs

### Gestion des Rôles
- `manage_roles` - Créer, modifier, supprimer rôles
- `view_roles` - Voir les rôles

### Gestion des Workflows
- `manage_workflows` - Créer, modifier workflows
- `view_workflows` - Voir les workflows

### Gestion des Formulaires
- `manage_forms` - Créer, modifier formulaires
- `view_forms` - Voir les formulaires

### Gestion des Applications/Demandes
- `create_applications` - Créer des demandes
- `view_applications` - Voir les demandes
- `update_applications` - Modifier les demandes
- `delete_applications` - Supprimer les demandes
- `process_applications` - Traiter/valider les demandes
- `approve_applications` - Approuver les demandes
- `reject_applications` - Rejeter les demandes

### Gestion des Documents
- `upload_documents` - Uploader des documents
- `view_documents` - Voir les documents
- `delete_documents` - Supprimer les documents

### Signatures Numériques
- `sign_documents` - Signer numériquement
- `view_signatures` - Voir les signatures

### Audit
- `view_audit_logs` - Voir les logs d'audit

### Types de Documents
- `manage_document_types` - Gérer les types de documents

## ⚠️ Important : SYSTEM_ADMIN

**SYSTEM_ADMIN** est le seul rôle système :
- ✅ Créé automatiquement lors du seed
- ✅ Possède TOUTES les permissions
- ❌ Ne peut PAS être modifié
- ❌ Ne peut PAS être supprimé
- ✅ Seul rôle qui peut créer/modifier/supprimer d'autres rôles

## 🔄 Migration depuis Anciens Rôles

Si vous aviez des rôles hardcodés dans votre code :

**Avant** :
```javascript
requireRole('AGENT', 'VALIDATOR')
```

**Maintenant** :
```javascript
requireRole('Agent Accueil', 'Validateur Technique')
// Ou n'importe quel nom de rôle créé dans votre système
```

Aucune autre modification nécessaire - le code est compatible !

## 🎯 Avantages des Rôles Dynamiques

1. **Flexibilité** : Créez des rôles selon votre organisation
2. **Évolutivité** : Ajoutez/modifiez des rôles sans redéploiement
3. **Personnalisation** : Noms en français, correspondant à votre métier
4. **Maintenabilité** : Pas de code à modifier pour ajouter un rôle
5. **Audit** : Traçabilité complète de la création/modification des rôles

## 📞 Support

Pour toute question sur les rôles dynamiques :
- Consultez ce guide
- Vérifiez les logs dans `backend/logs/`
- Consultez la table `roles` dans PostgreSQL
- Vérifiez les permissions dans `role_permissions`

---

**Version** : 1.0.0
**Date** : 2025
**Auteur** : Système PCA
