# 🚀 Guide d'Implémentation - CGA Application

## 📋 Prochaines Étapes Critiques

### ✅ Ce qui a été fait
1. ✅ Thème Blanc/Bleu/Gris appliqué
2. ✅ Structure de base pour toutes les pages
3. ✅ Backend complet avec routes et contrôleurs
4. ✅ Modèles Sequelize (15 modèles)
5. ✅ Système RBAC avec 29 permissions
6. ✅ README mis à jour

### 🔧 Ce qui reste à faire

## 1. 📊 Base de Données - Seed Data Complète

**Fichier**: `backend/scripts/03_seed_data.sql`

Ajouter:
```sql
-- 5 RÔLES
INSERT INTO roles (name, description, is_system_role) VALUES
('SYSTEM_ADMIN', 'Administrateur système', TRUE),
('Agent Accueil', 'Agent d''accueil - Réception', FALSE),
('Technicien Validation', 'Technicien - Validation technique', FALSE),
('Superviseur', 'Superviseur - Approbation', FALSE),
('Directeur', 'Directeur - Décision finale', FALSE);

-- 10 UTILISATEURS FRANÇAIS
INSERT INTO users (username, email, password_hash, first_name, last_name, phone) VALUES
('admin', 'admin@cga.ga', '$2a$12$hash', 'Admin', 'Système', '+241 01 23 45 67'),
('jdupont', 'j.dupont@cga.ga', '$2a$12$hash', 'Jean', 'Dupont', '+241 06 11 22 33'),
('mmartin', 'm.martin@cga.ga', '$2a$12$hash', 'Marie', 'Martin', '+241 06 22 33 44'),
-- ... 7 autres utilisateurs

-- 3 WORKFLOW TEMPLATES
INSERT INTO workflow_templates (name, category, description) VALUES
('Standard', 'standard', 'Workflow standard pour première immatriculation'),
('Urgent', 'import', 'Traitement accéléré pour cas urgents'),
('Duplicata', 'duplicate', 'Émission de duplicata de carte grise');

-- 15 WORKFLOW STEPS (5 par workflow)
-- 3 FORM TEMPLATES avec champs
-- 10 APPLICATIONS EXEMPLES
```

**Commande pour exécuter**:
```bash
psql -U postgres -d carte_grise -f backend/scripts/03_seed_data.sql
```

---

## 2. 🔄 Workflow Builder Professionnel

**Fichier**: `frontend/src/pages/WorkflowManagement.js`

### Fonctionnalités requises:

#### Liste des Workflows
- Cards avec nom, catégorie, nombre d'étapes
- Bouton "Créer Workflow"
- Actions: Éditer, Dupliquer, Supprimer, Activer/Désactiver

#### Éditeur d'Étapes (Dialog)
```jsx
Champs de configuration:
1. Nom de l'étape (TextField)
2. Description (TextArea)
3. Type d'étape (Select):
   - Validation
   - Vérification Documents
   - Approbation
   - Production
   - Notification
4. Rôle assigné (Select - charger depuis API /roles)
5. Documents requis (Multi-Select - charger depuis API /document-types)
6. Signature requise (Checkbox)
7. Règles de validation (TextArea pour conditions JSON)
8. Durée estimée (Number en heures)
9. Peut rejeter (Checkbox)
10. Peut demander modifications (Checkbox)
```

#### Interface de Réorganisation
- Liste des étapes avec drag handles (DragIndicator icon)
- Boutons Monter/Descendre
- Numérotation automatique (Étape 1, 2, 3...)

---

## 3. 📝 Form Builder - Constructeur de Formulaires

**Fichier**: `frontend/src/pages/FormBuilder.js`

### Fonctionnalités:

#### Palette de Champs (Sidebar)
```jsx
Types de champs disponibles:
- 📝 Texte
- 📧 Email
- 📞 Téléphone
- 🔢 Nombre
- 📅 Date
- 📋 Liste déroulante
- ☑️ Case à cocher
- 🔘 Boutons radio
- 📄 Zone de texte
- 📎 Upload fichier
```

#### Zone de Construction (Drag & Drop)
- Glisser-déposer des champs
- Réorganiser les champs
- Configuration par champ:
  - Label
  - Placeholder
  - Obligatoire (Oui/Non)
  - Règles de validation (Regex, Min/Max longueur, etc.)
  - Affichage conditionnel (Si champ X = valeur Y)
  - Options (pour Select, Radio, Checkbox)

#### Preview
- Aperçu en temps réel du formulaire
- Test de validation

---

## 4. 📋 Gestion des Formulaires

**Fichier**: `frontend/src/pages/Forms.js`

### Fonctionnalités:
- Liste tous les formulaires (cards)
- Créer nouveau formulaire (ouvre FormBuilder)
- Éditer formulaire existant
- Supprimer formulaire
- Cloner formulaire
- Assigner à un workflow
- Prévisualiser
- Statistiques d'utilisation

---

## 5. 🔗 Mises à Jour de Navigation

### App.js - Nouvelles Routes
```jsx
<Route path="/form-builder" element={
  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
    <Layout><FormBuilder /></Layout>
  </ProtectedRoute>
} />
<Route path="/forms" element={
  <ProtectedRoute>
    <Layout><Forms /></Layout>
  </ProtectedRoute>
} />
```

### Layout.js - Nouveaux Items de Menu
```jsx
const menuItems = [
  { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Demandes', icon: <DescriptionIcon />, path: '/applications' },
  { text: 'Formulaires', icon: <AssignmentIcon />, path: '/forms' },
  ...(isSystemAdmin() ? [
    { text: 'Workflows', icon: <WorkflowIcon />, path: '/workflows' },
    { text: 'Constructeur Forms', icon: <BuildIcon />, path: '/form-builder' },
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
    { text: 'Rôles', icon: <SecurityIcon />, path: '/roles' },
  ] : []),
];
```

---

## 6. 📱 QR Code & NFC - Intégration

### Installation des dépendances
```bash
cd frontend
npm install qrcode react-qr-code
npm install --save-dev @types/qrcode
```

### Service QR Code
**Fichier**: `frontend/src/services/qrCodeService.js`

```javascript
import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    const qrDataString = JSON.stringify({
      applicationId: data.id,
      reference: data.referenceNumber,
      timestamp: new Date().toISOString(),
      hash: generateHash(data)
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1976d2',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

const generateHash = (data) => {
  // Simple hash - remplacer par crypto en production
  return btoa(`${data.id}-${data.referenceNumber}-${Date.now()}`);
};
```

### Backend - QR Code Endpoint
**Fichier**: `backend/src/routes/applications.js`

```javascript
// Ajouter cette route
router.get('/:id/qrcode', authenticate, async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const qrData = {
      id: application.id,
      reference: application.applicationNumber,
      timestamp: new Date().toISOString(),
      verificationUrl: `${process.env.APP_URL}/verify/${application.id}`
    };

    // Générer QR code
    const QRCode = require('qrcode');
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({ qrCode: qrCodeDataURL, data: qrData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### NFC - Backend Service
**Fichier**: `backend/src/services/nfcService.js`

```javascript
const crypto = require('crypto');

/**
 * Génère un identifiant NFC unique pour un document
 */
exports.generateNFCTag = async (application) => {
  const nfcData = {
    id: application.id,
    reference: application.applicationNumber,
    timestamp: Date.now(),
    signature: generateNFCSignature(application)
  };

  // Encoder en format NDEF (NFC Data Exchange Format)
  const ndefRecord = encodeNDEF(nfcData);

  // Sauvegarder dans la base
  await application.update({
    nfc_tag_id: ndefRecord.id,
    nfc_data: JSON.stringify(nfcData)
  });

  return ndefRecord;
};

const generateNFCSignature = (data) => {
  const secret = process.env.NFC_SECRET || 'default-nfc-secret-change-me';
  return crypto
    .createHmac('sha256', secret)
    .update(`${data.id}-${data.applicationNumber}`)
    .digest('hex');
};

const encodeNDEF = (data) => {
  return {
    id: crypto.randomBytes(8).toString('hex'),
    type: 'application/cga',
    data: Buffer.from(JSON.stringify(data)).toString('base64')
  };
};
```

---

## 7. 📜 Historique Complet

### Backend - Application History Tracking

Déjà implémenté dans `ApplicationHistory` model. S'assurer que chaque action crée une entrée:

```javascript
// Dans applicationController.js
await ApplicationHistory.create({
  application_id: applicationId,
  action: 'status_changed',
  old_value: oldStatus,
  new_value: newStatus,
  performed_by: req.user.id,
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
  notes: 'Statut modifié par l''utilisateur'
});
```

---

## 8. 🔌 Connexion Frontend <-> Backend

### Supprimer Mock Data

Dans chaque page, remplacer:
```javascript
// ❌ AVANT
const [users, setUsers] = useState(mockUsers);

// ✅ APRÈS
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await api.get('/users');
    setUsers(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 📦 Dépendances à Installer

```bash
cd frontend
npm install qrcode react-qr-code
npm install @mui/lab  # Pour TreeView dans permissions
npm install react-beautiful-dnd  # Pour drag-drop
npm install @dnd-kit/core @dnd-kit/sortable  # Alternative moderne
```

```bash
cd backend
npm install qrcode
```

---

## 🎯 Priorités d'Implémentation

### Phase 1 - CRITIQUE (Aujourd'hui)
1. ✅ Seed data complet
2. ✅ Workflow Builder avancé
3. ✅ Form Builder
4. ✅ Page Forms

### Phase 2 - IMPORTANT (Demain)
1. QR Code génération
2. NFC tags
3. Connexion API (supprimer mock data)
4. Tests

### Phase 3 - AMÉLIORATION
1. Dashboard analytics
2. Rapports PDF
3. Notifications email
4. Export Excel

---

## 🔍 Fichiers Modifiés

### Backend
- `backend/scripts/03_seed_data.sql` ✅ Mise à jour
- `backend/src/services/nfcService.js` 🆕 À créer
- `backend/src/services/qrCodeService.js` 🆕 À créer

### Frontend - Pages
- `frontend/src/pages/WorkflowManagement.js` ✅ Mis à jour
- `frontend/src/pages/FormBuilder.js` 🆕 Créé
- `frontend/src/pages/Forms.js` 🆕 Créé
- `frontend/src/App.js` ✅ Routes ajoutées
- `frontend/src/components/Layout.js` ✅ Menu mis à jour

### Frontend - Services
- `frontend/src/services/qrCodeService.js` 🆕 À créer

---

## 🚀 Commandes de Déploiement

```bash
# 1. Base de données
cd backend
npm run db:seed  # ou psql -U postgres -d carte_grise -f scripts/03_seed_data.sql

# 2. Installer dépendances
cd frontend
npm install

cd backend
npm install

# 3. Lancer l'application
docker-compose up -d

# 4. Tester
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Credentials: admin / Admin@123456
```

---

## 📝 Notes Importantes

1. **Tout en Français**: Toutes les interfaces, messages, labels
2. **Pas de Mock Data**: Toutes les données viennent de l'API
3. **QR Code**: Généré à la soumission de chaque demande
4. **NFC**: Tag créé et stocké en base de données
5. **Logs**: Chaque action trackée dans application_history
6. **Responsive**: Tous les écrans mobile-first

---

## 🎨 Standards de Code

### Responsive Pattern
```jsx
sx={{
  px: { xs: 2, sm: 3, md: 4 },  // Padding horizontal
  py: { xs: 2, md: 3 },          // Padding vertical
  fontSize: { xs: '0.875rem', md: '1rem' }  // Font size
}}

<Grid container spacing={{ xs: 2, md: 3 }}>
<Stack direction={{ xs: 'column', sm: 'row' }}>
```

### Couleurs
- Primary Blue: `#1976d2`
- Secondary Gray: `#455a64`
- Background: `#f5f5f5`, `#FFFFFF`
- Text: `#212121`, `#757575`

---

## ✅ Checklist Finale

- [ ] Seed data exécuté avec succès
- [ ] Workflow Builder fonctionnel avec UI complète
- [ ] Form Builder opérationnel
- [ ] Forms page affiche tous les formulaires
- [ ] QR codes générés pour chaque demande
- [ ] NFC tags créés et stockés
- [ ] Pas de mock data dans le frontend
- [ ] Historique complet sur chaque action
- [ ] Tout en français
- [ ] Responsive sur mobile/tablet
- [ ] Build réussit sans erreurs
- [ ] Tests manuels passés
- [ ] Push vers GitHub

---

## 📞 Support

En cas de problème:
1. Vérifier les logs: `docker-compose logs -f`
2. Vérifier la connexion DB: `psql -U postgres -d carte_grise`
3. Vérifier les routes API: `http://localhost:5000/api/v1/`

---

*Document créé le 16 Décembre 2024*
