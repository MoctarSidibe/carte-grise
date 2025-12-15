# 🔐 Authentik IAM Integration - CGA Application

## Connect CGA to Your Existing Authentik IAM Instance

**Date:** 2025-12-09
**Authentik Version:** 2024.x (Compatible with existing instance)
**Integration Type:** OAuth2/OIDC
**Status:** 🚀 READY FOR INTEGRATION

> 🇫🇷 **Version Française:** [README.fr.md](README.fr.md)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Quick Start Guide](#quick-start-guide)
- [Step-by-Step Integration](#step-by-step-integration)
- [Configuration Examples](#configuration-examples)
- [Testing the Integration](#testing-the-integration)
- [Multi-Application SSO](#multi-application-sso)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide shows you how to integrate the **CGA (Carte Grise Administrative)** application with your **existing, running Authentik IAM instance**.

### What This Guide Does

✅ **Connect CGA to existing Authentik** - No need to deploy new Authentik
✅ **Configure OAuth2/OIDC** - Standard protocol integration
✅ **Enable Single Sign-On** - Share authentication with other modules
✅ **Maintain existing users** - Use your current Authentik user directory
✅ **Map roles and permissions** - Sync CGA roles with Authentik groups

### What You Need

- ✅ Access to your **running Authentik admin panel**
- ✅ Authentik URL (e.g., `https://auth.yourdomain.com`)
- ✅ Admin credentials to create new applications
- ✅ CGA application (this project)

---

## ✅ Prerequisites

### 1. Authentik Instance Information

You need to know:
```bash
AUTHENTIK_URL=https://auth.yourdomain.com
# Example: https://sso.gouv.ga
# Example: https://authentik.ministry.ga
```

### 2. Authentik Admin Access

- Username and password for Authentik admin
- Permission to create applications and providers
- Permission to create/assign groups

### 3. CGA Application Ready

```bash
# CGA backend running
cd backend
npm install

# CGA frontend running
cd frontend
npm install
```

---

## 🏗️ Architecture

### Current Setup (Before Integration)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ JWT Token (CGA internal)
       ▼
┌─────────────┐
│ CGA Backend │──────► PostgreSQL
│ (Internal   │        (Local users table)
│  Auth)      │
└─────────────┘
```

### After Authentik Integration

```
┌──────────────────────────────────────────────────┐
│                  Browser                          │
└──────┬──────────────────┬────────────────────────┘
       │                  │
       │                  ▼
       │          ┌──────────────────┐
       │          │  Other Modules   │
       │          │ (Permis, etc.)   │
       │          └────────┬─────────┘
       │                   │
       ▼                   ▼
┌────────────────────────────────────┐
│    Your Existing Authentik IAM     │◄──── Already Running!
│    https://auth.yourdomain.com     │      (Other apps connected)
└────────────────┬───────────────────┘
                 │ OAuth2/OIDC Token
                 │
                 ▼
         ┌───────────────┐
         │  CGA Backend  │──────► PostgreSQL
         │  (Validates   │        (CGA data only,
         │   Authentik   │         no users table)
         │   Token)      │
         └───────────────┘
```

**Benefits:**
- ✅ CGA users login via your existing Authentik
- ✅ Single Sign-On with other connected applications
- ✅ Centralized user management (no duplicate users)
- ✅ Unified audit logs in Authentik

---

## ⚡ Quick Start Guide

### Time Required: ~30 minutes

### Step 1: Configure Authentik (10 min)
1. Login to your Authentik admin panel
2. Create new OAuth2/OIDC Provider for CGA
3. Create new Application "CGA"
4. Note Client ID and Client Secret

### Step 2: Configure CGA Backend (15 min)
1. Install OAuth2 dependencies
2. Add Authentik configuration to `.env`
3. Update authentication middleware
4. Add OAuth2 callback route

### Step 3: Configure CGA Frontend (5 min)
1. Update login page
2. Redirect to Authentik for authentication
3. Handle OAuth2 callback

### Step 4: Test (5 min)
1. Click "Login with SSO"
2. Redirected to your Authentik
3. Login with Authentik credentials
4. Redirected back to CGA - Logged in!

---

## 📖 Step-by-Step Integration

### PART 1: Configure Your Existing Authentik Instance

#### Step 1.1: Login to Authentik Admin

```bash
# Navigate to your Authentik instance
https://auth.yourdomain.com/if/admin/

# Login with your admin credentials
Username: your-admin-username
Password: your-admin-password
```

#### Step 1.2: Create OAuth2/OIDC Provider

```bash
1. In Authentik Admin, go to: Applications → Providers
2. Click "Create" button
3. Select "OAuth2/OpenID Connect Provider"
4. Fill in the form:

   Name: CGA Provider
   Authorization flow: default-provider-authorization-implicit-consent
   Client type: Confidential
   Client ID: [Auto-generated - COPY THIS!]
   Client Secret: [Auto-generated - COPY THIS!]

   Redirect URIs/Origins (one per line):
   http://localhost:3000/auth/callback
   http://localhost:5000/api/auth/authentik/callback
   https://cga.yourdomain.com/auth/callback (for production)

   Signing Key: authentik Self-signed Certificate

   Scopes: openid, email, profile, groups

   Subject mode: Based on the User's hashed ID

   Include claims in id_token: ✓ (checked)

5. Click "Create"
6. IMPORTANT: Copy the Client ID and Client Secret NOW!
```

**Save these values:**
```bash
AUTHENTIK_CLIENT_ID=abc123xyz456...
AUTHENTIK_CLIENT_SECRET=secret789def012...
```

#### Step 1.3: Create CGA Application

```bash
1. In Authentik Admin, go to: Applications → Applications
2. Click "Create" button
3. Fill in the form:

   Name: Carte Grise Administrative (CGA)
   Slug: cga
   Group: [Leave blank or select appropriate group]
   Provider: CGA Provider (select the provider you just created)
   Policy engine mode: any

   UI Settings:
   Launch URL: http://localhost:3000 (or https://cga.yourdomain.com)
   Icon: [Upload Gabon flag or vehicle icon]
   Description: Système de Carte Grise Administrative

4. Click "Create"
```

#### Step 1.4: Create CGA Groups (Roles)

```bash
1. In Authentik Admin, go to: Directory → Groups
2. Create groups for CGA roles:

Group 1: CGA_ADMIN
   - Name: CGA_ADMIN
   - Parent: [None]
   - Attributes (JSON):
     {
       "application": "cga",
       "role": "SYSTEM_ADMIN",
       "permissions": ["all"]
     }

Group 2: CGA_PATRIMOINE
   - Name: CGA_PATRIMOINE
   - Attributes:
     {
       "application": "cga",
       "role": "Patrimoine",
       "permissions": ["applications.read", "applications.write"]
     }

Group 3: CGA_DCRTCT
   - Name: CGA_DCRTCT
   - Attributes:
     {
       "application": "cga",
       "role": "DCRTCT",
       "permissions": ["applications.approve"]
     }

Group 4: CGA_USER
   - Name: CGA_USER
   - Attributes:
     {
       "application": "cga",
       "role": "User",
       "permissions": ["applications.create", "applications.read_own"]
     }

3. Save each group
```

#### Step 1.5: Assign Users to Groups

```bash
1. Go to: Directory → Users
2. Select a user
3. Click "Groups" tab
4. Assign appropriate CGA groups
5. Save

Example:
- Jean Dupont → CGA_PATRIMOINE
- Marie Martin → CGA_ADMIN
- Pierre Dubois → CGA_USER
```

---

### PART 2: Configure CGA Backend

#### Step 2.1: Install Dependencies

```bash
cd backend

# Install OAuth2 dependencies
npm install passport passport-oauth2 openid-client axios

# Save package.json
npm install
```

#### Step 2.2: Update Environment Variables

Edit `backend/.env`:

```bash
# Add Authentik configuration
AUTHENTIK_URL=https://auth.yourdomain.com
AUTHENTIK_CLIENT_ID=your-client-id-from-step-1.2
AUTHENTIK_CLIENT_SECRET=your-client-secret-from-step-1.2
AUTHENTIK_REDIRECT_URI=http://localhost:5000/api/auth/authentik/callback

# For production, also add:
# AUTHENTIK_REDIRECT_URI=https://cga-api.yourdomain.com/api/auth/authentik/callback

# Keep existing JWT secret for internal tokens
JWT_SECRET=your-existing-jwt-secret
JWT_EXPIRES_IN=24h
```

#### Step 2.3: Create Authentik Integration Module

Create `backend/src/auth/authentik-integration.js`:

```javascript
const axios = require('axios');
const jwt = require('jsonwebtoken');

class AuthentikIntegration {
  constructor() {
    this.authentikUrl = process.env.AUTHENTIK_URL;
    this.clientId = process.env.AUTHENTIK_CLIENT_ID;
    this.clientSecret = process.env.AUTHENTIK_CLIENT_SECRET;
    this.redirectUri = process.env.AUTHENTIK_REDIRECT_URI;
  }

  // Get authorization URL for user login
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile groups',
    });

    return `${this.authentikUrl}/application/o/authorize/?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(
        `${this.authentikUrl}/application/o/token/`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Token exchange failed:', error.response?.data);
      throw new Error('Failed to exchange code for token');
    }
  }

  // Get user info from Authentik
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        `${this.authentikUrl}/application/o/userinfo/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error.response?.data);
      throw new Error('Failed to get user info');
    }
  }

  // Map Authentik groups to CGA roles
  mapGroupsToRoles(groups) {
    const roleMapping = {
      'CGA_ADMIN': 'SYSTEM_ADMIN',
      'CGA_PATRIMOINE': 'Patrimoine',
      'CGA_DCRTCT': 'DCRTCT',
      'CGA_USER': 'User',
    };

    return groups
      .filter(group => group.startsWith('CGA_'))
      .map(group => roleMapping[group] || 'User');
  }

  // Create CGA JWT token from Authentik user
  createCGAToken(userInfo) {
    const roles = this.mapGroupsToRoles(userInfo.groups || []);

    const payload = {
      id: userInfo.sub, // Authentik user ID
      email: userInfo.email,
      username: userInfo.preferred_username || userInfo.email,
      name: userInfo.name,
      roles: roles,
      source: 'authentik', // Mark as Authentik user
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  // Verify Authentik access token
  async verifyToken(accessToken) {
    try {
      const userInfo = await this.getUserInfo(accessToken);
      return userInfo;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthentikIntegration();
```

#### Step 2.4: Create Auth Routes

Create `backend/src/routes/authentik-auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const authentikIntegration = require('../auth/authentik-integration');
const { AuditLog } = require('../models');

// Login with Authentik - redirect to Authentik
router.get('/login', (req, res) => {
  const authUrl = authentikIntegration.getAuthorizationUrl();
  res.redirect(authUrl);
});

// OAuth2 callback - handle return from Authentik
router.get('/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    // Handle authorization errors
    if (error) {
      console.error('Authentik authorization error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for access token
    const tokens = await authentikIntegration.exchangeCodeForToken(code);

    // Get user information
    const userInfo = await authentikIntegration.getUserInfo(tokens.access_token);

    // Create CGA JWT token
    const cgaToken = authentikIntegration.createCGAToken(userInfo);

    // Log successful authentication
    await AuditLog.create({
      userId: userInfo.sub,
      action: 'LOGIN_SUCCESS',
      details: {
        method: 'authentik_oauth2',
        email: userInfo.email,
        groups: userInfo.groups,
      },
      ip: req.ip,
    });

    // Redirect to frontend with CGA token
    const redirectUrl = `${process.env.FRONTEND_URL}?token=${cgaToken}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Authentik callback error:', error);

    // Log failed authentication
    await AuditLog.create({
      action: 'LOGIN_FAILED',
      details: {
        method: 'authentik_oauth2',
        error: error.message,
      },
      ip: req.ip,
    });

    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

// Logout - redirect to Authentik logout
router.post('/logout', (req, res) => {
  const logoutUrl = `${process.env.AUTHENTIK_URL}/application/o/cga/end-session/`;
  res.json({ logoutUrl });
});

module.exports = router;
```

#### Step 2.5: Mount Auth Routes in Server

Edit `backend/server.js`:

```javascript
// Add near the top with other imports
const authentikAuthRoutes = require('./src/routes/authentik-auth');

// Add environment variable for frontend URL
// (after other middleware, before API routes)

// Authentik SSO routes
app.use('/api/auth/authentik', authentikAuthRoutes);

// Keep existing auth routes for backward compatibility
app.use('/api/auth', require('./src/routes/auth'));
```

#### Step 2.6: Update Auth Middleware (Optional Enhancement)

Edit `backend/src/middleware/auth.js` to support both JWT sources:

```javascript
const jwt = require('jsonwebtoken');
const authentikIntegration = require('../auth/authentik-integration');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    // Try to decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is from Authentik
    if (decoded.source === 'authentik') {
      // Optionally verify with Authentik (add caching to avoid rate limits)
      // For now, trust the JWT since we signed it
      req.user = decoded;
    } else {
      // Standard CGA token (legacy)
      req.user = decoded;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { authenticate };
```

---

### PART 3: Configure CGA Frontend

#### Step 3.1: Update Environment Variables

Edit `frontend/.env`:

```bash
# Add Authentik configuration
REACT_APP_AUTHENTIK_LOGIN_URL=http://localhost:5000/api/auth/authentik/login
REACT_APP_API_URL=http://localhost:5000/api

# For production:
# REACT_APP_AUTHENTIK_LOGIN_URL=https://cga-api.yourdomain.com/api/auth/authentik/login
```

#### Step 3.2: Update Login Page

Edit `frontend/src/pages/Login.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    // Handle OAuth2 callback with token
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (token) {
      // Store token and redirect to dashboard
      login(token);
      navigate('/dashboard');
    } else if (errorParam) {
      // Show error message
      const errorMessages = {
        no_code: 'Authentification annulée',
        auth_failed: 'Échec de l\'authentification',
        access_denied: 'Accès refusé',
      };
      setError(errorMessages[errorParam] || 'Erreur d\'authentification');
    }
  }, [searchParams, login, navigate]);

  const handleAuthentikLogin = () => {
    // Redirect to backend, which redirects to Authentik
    window.location.href = process.env.REACT_APP_AUTHENTIK_LOGIN_URL;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Gabon Flag Banner */}
        <Box
          sx={{
            height: 8,
            background: 'linear-gradient(90deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
            marginBottom: 3,
            borderRadius: 1,
          }}
        />

        <Typography variant="h4" gutterBottom sx={{ color: '#009E60', fontWeight: 'bold' }}>
          CGA
        </Typography>
        <Typography variant="h6" gutterBottom>
          Carte Grise Administrative
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          République Gabonaise
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Authentik SSO Login Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleAuthentikLogin}
          sx={{
            backgroundColor: '#009E60',
            color: 'white',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#007a4d',
            },
          }}
        >
          Se connecter avec SSO
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Authentification centralisée via Authentik
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
```

#### Step 3.3: Update Auth Context

Edit `frontend/src/contexts/AuthContext.js` to handle token from URL:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          username: payload.username,
          name: payload.name,
          roles: payload.roles || [],
          source: payload.source || 'local',
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];

    // If user logged in via Authentik, redirect to Authentik logout
    if (user?.source === 'authentik') {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/authentik/logout`;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### PART 4: Testing the Integration

#### Test 1: Basic Login Flow

```bash
1. Start CGA backend:
   cd backend
   npm start

2. Start CGA frontend:
   cd frontend
   npm start

3. Open browser:
   http://localhost:3000

4. Click "Se connecter avec SSO"

5. You should be redirected to:
   https://auth.yourdomain.com/...

6. Login with your Authentik credentials

7. You should be redirected back to:
   http://localhost:3000?token=eyJhbGc...

8. You should now be logged in to CGA!
```

#### Test 2: Role Mapping

```bash
# Check that Authentik groups are mapped correctly

1. Login with a user in "CGA_ADMIN" group
2. Open browser console
3. Check localStorage.token
4. Decode JWT at jwt.io
5. Verify "roles": ["SYSTEM_ADMIN"]

6. Try accessing admin endpoint:
   GET http://localhost:5000/api/roles
   Should return 200 OK

7. Login with a user in "CGA_USER" group
8. Try accessing admin endpoint:
   GET http://localhost:5000/api/roles
   Should return 403 Forbidden (if requireRole middleware used)
```

#### Test 3: Single Sign-On (if you have other apps)

```bash
1. Login to CGA via Authentik
2. Open another tab
3. Go to another app connected to same Authentik (e.g., Permis)
4. Click login on that app
5. You should be AUTOMATICALLY logged in without entering password!
   (SSO working!)
```

---

## 🔧 Configuration Examples

### Example 1: Production Environment Variables

**Backend `.env.production`:**
```bash
# Authentik Configuration
AUTHENTIK_URL=https://sso.gouv.ga
AUTHENTIK_CLIENT_ID=cga_production_client_id
AUTHENTIK_CLIENT_SECRET=super_secret_production_key
AUTHENTIK_REDIRECT_URI=https://api-cga.gouv.ga/api/auth/authentik/callback

# Frontend URL
FRONTEND_URL=https://cga.gouv.ga

# JWT Configuration
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=8h

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/cga_prod
```

**Frontend `.env.production`:**
```bash
REACT_APP_AUTHENTIK_LOGIN_URL=https://api-cga.gouv.ga/api/auth/authentik/login
REACT_APP_API_URL=https://api-cga.gouv.ga/api
```

### Example 2: Multiple Redirect URIs (Dev + Prod)

In Authentik Provider configuration:
```
Redirect URIs/Origins:
http://localhost:5000/api/auth/authentik/callback
http://localhost:3000/auth/callback
https://api-cga.gouv.ga/api/auth/authentik/callback
https://cga.gouv.ga/auth/callback
```

### Example 3: Custom Role Mapping

Edit `backend/src/auth/authentik-integration.js`:

```javascript
mapGroupsToRoles(groups) {
  const roleMapping = {
    // Authentik Group → CGA Role
    'CGA_ADMIN': 'SYSTEM_ADMIN',
    'CGA_PATRIMOINE': 'Patrimoine',
    'CGA_DCRTCT': 'DCRTCT',
    'CGA_MINTP': 'MINTP',
    'CGA_POLICE': 'Police',
    'CGA_USER': 'User',

    // Super admin from other systems
    'SUPER_ADMIN': 'SYSTEM_ADMIN',

    // Regional groups
    'CGA_LIBREVILLE': 'Regional_Admin_Libreville',
    'CGA_PORT_GENTIL': 'Regional_Admin_PortGentil',
  };

  return groups
    .filter(group => group.startsWith('CGA_') || group === 'SUPER_ADMIN')
    .map(group => roleMapping[group] || 'User');
}
```

---

## 🚀 Multi-Application SSO Setup

### Scenario: You Have Multiple Apps in Authentik

**Current Apps in Your Authentik:**
- Permis (Driver's License System)
- Archives (Document Management)
- HR Portal (Human Resources)

**Now Adding:**
- CGA (Vehicle Registration) ← This project!

### Configuration

#### 1. In Authentik (Already Done by Your Admin)

Each app has:
- ✅ OAuth2 Provider
- ✅ Application entry
- ✅ Groups for roles

#### 2. User Experience

```
User: Jean Dupont

Groups in Authentik:
- CGA_USER (can use CGA)
- PERMIS_OFFICER (can approve licenses)
- HR_EMPLOYEE (can view HR portal)

Login Flow:
1. Jean goes to CGA → Click Login
2. Redirected to Authentik (first time today)
3. Enters username/password in Authentik
4. Redirected to CGA → Logged In ✓

Later...
5. Jean goes to Permis → Click Login
6. Redirected to Authentik (already logged in!)
7. Automatically redirected to Permis → Logged In ✓
   NO PASSWORD NEEDED! (SSO Magic!)

Even Later...
8. Jean goes to HR Portal → Click Login
9. Automatically logged in! ✓
```

---

## 🐛 Troubleshooting

### Problem 1: "Invalid redirect_uri"

**Error in Authentik:**
```
Error: redirect_uri does not match configured URIs
```

**Solution:**
```bash
1. Go to Authentik Admin → Applications → Providers
2. Find "CGA Provider"
3. Check "Redirect URIs/Origins"
4. Add the exact URI from error message
5. Save
6. Try again
```

### Problem 2: "Client authentication failed"

**Error:**
```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

**Solution:**
```bash
1. Check AUTHENTIK_CLIENT_ID in backend/.env
2. Check AUTHENTIK_CLIENT_SECRET in backend/.env
3. Verify they match Authentik Provider settings
4. Restart backend server
```

### Problem 3: User Has No Roles

**Symptom:** User logs in but has `roles: []`

**Solution:**
```bash
1. Go to Authentik Admin → Directory → Users
2. Find the user
3. Click "Groups" tab
4. Assign user to CGA_USER group (minimum)
5. Save
6. User logs out and logs back in
7. Check roles in JWT token
```

### Problem 4: Token Expired

**Error:**
```json
{
  "message": "Token invalide ou expiré"
}
```

**Solution:**
```bash
# User needs to login again
1. Frontend should detect 401 error
2. Redirect to login page
3. User clicks "Se connecter avec SSO"
4. Gets new token from Authentik
```

### Problem 5: CORS Errors

**Error in Browser Console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

Edit `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://cga.yourdomain.com',
    process.env.AUTHENTIK_URL, // Add Authentik URL!
  ],
  credentials: true,
};
app.use(cors(corsOptions));
```

---

## 📚 Documentation Files

```
AUTHENTIK_IAM/
├── README.md                          ✅ This file (Integration guide)
├── README.fr.md                       📝 French version
├── STEP_BY_STEP_INTEGRATION.md        📝 Detailed walkthrough
├── CONFIGURATION_EXAMPLES.md          📝 All config examples
├── TROUBLESHOOTING.md                 📝 Common issues
├── examples/
│   ├── authentik-integration.js       📝 Backend module
│   ├── authentik-auth-routes.js       📝 Auth routes
│   ├── login-with-sso.jsx             📝 Frontend component
│   └── role-mapping-examples.js       📝 Role mapping configs
└── MIGRATION_GUIDE.md                 📝 Migrate from local auth
```

---

## ✅ Integration Checklist

### Pre-Integration
- [ ] Have access to Authentik admin panel
- [ ] Know Authentik URL (`https://auth.yourdomain.com`)
- [ ] CGA backend and frontend running locally

### Authentik Configuration (10 min)
- [ ] Login to Authentik admin
- [ ] Create OAuth2/OIDC Provider for CGA
- [ ] Create CGA Application
- [ ] Copy Client ID and Client Secret
- [ ] Create CGA groups (CGA_ADMIN, CGA_USER, etc.)
- [ ] Assign test users to groups

### Backend Integration (15 min)
- [ ] Install dependencies (`passport`, `openid-client`, `axios`)
- [ ] Add Authentik config to `.env`
- [ ] Create `authentik-integration.js` module
- [ ] Create `authentik-auth.js` routes
- [ ] Mount routes in `server.js`
- [ ] Update auth middleware (optional)
- [ ] Restart backend server

### Frontend Integration (5 min)
- [ ] Add Authentik login URL to `.env`
- [ ] Update Login page with SSO button
- [ ] Handle OAuth2 callback with token
- [ ] Update AuthContext
- [ ] Restart frontend

### Testing (10 min)
- [ ] Click "Login with SSO" button
- [ ] Redirected to Authentik
- [ ] Login with test credentials
- [ ] Redirected back to CGA
- [ ] Logged in successfully!
- [ ] Check roles are mapped correctly
- [ ] Test admin vs regular user access
- [ ] Test logout flow

### Production Deployment
- [ ] Update `.env` with production Authentik URL
- [ ] Add production redirect URIs in Authentik
- [ ] Deploy backend with new config
- [ ] Deploy frontend with new config
- [ ] Test production login flow
- [ ] Monitor logs for errors

---

## 🎯 Summary

**Integrating CGA with Your Existing Authentik:**

✅ **No New Infrastructure** - Use your running Authentik instance
✅ **Quick Integration** - ~30 minutes to complete
✅ **Standard OAuth2** - Industry-standard protocol
✅ **Single Sign-On** - Share authentication with other apps
✅ **Centralized Users** - One user directory for all apps
✅ **Role Mapping** - Authentik groups → CGA roles
✅ **Production Ready** - Secure and scalable

**Perfect For:**
- ✅ Multiple government applications
- ✅ Centralized user management
- ✅ Single Sign-On experience
- ✅ Unified audit logs
- ✅ Enterprise-grade security

---

**🇬🇦 For the Gabonese Republic - One Identity, All Services**

**Status:** 🚀 READY TO INTEGRATE
**Date:** 2025-12-09
**Version:** 1.0.0

**Connect CGA to your Authentik and enable SSO! Let's gooooooooo! 🚀🔐**
