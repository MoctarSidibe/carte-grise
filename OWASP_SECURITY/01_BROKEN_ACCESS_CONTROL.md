# A01:2021 - Broken Access Control 🔴

## Critical Vulnerability - Access Control Failures

**Severity:** 🔴 Critical
**Prevalence:** Very High (94% of applications tested)
**Impact:** High - Unauthorized data access, modification, or destruction

> 🇫🇷 **Version Française:** [01_BROKEN_ACCESS_CONTROL.fr.md](01_BROKEN_ACCESS_CONTROL.fr.md)

---

## 📋 Table of Contents

- [What is Broken Access Control?](#what-is-broken-access-control)
- [Common Attack Scenarios](#common-attack-scenarios)
- [Impact Assessment](#impact-assessment)
- [Prevention Strategies](#prevention-strategies)
- [CGA Implementation](#cga-implementation)
- [Code Examples](#code-examples)
- [Testing Methods](#testing-methods)
- [References](#references)

---

## 🎯 What is Broken Access Control?

### Definition

**Broken Access Control** occurs when users can access resources or perform actions they shouldn't be authorized to access or perform. This happens when access control mechanisms are missing, bypassed, or improperly implemented.

### Why #1 in OWASP Top 10?

- **Most Common:** Found in 94% of applications
- **Easy to Exploit:** Often requires minimal technical skill
- **High Impact:** Can lead to complete data compromise
- **Difficult to Detect:** May go unnoticed without proper testing

### Types of Access Control Failures

1. **Vertical Privilege Escalation** - Regular user gains admin rights
2. **Horizontal Privilege Escalation** - User accesses another user's data
3. **Missing Function Level Access Control** - Hidden admin functions accessible
4. **Insecure Direct Object References (IDOR)** - Direct access to objects by ID
5. **CORS Misconfiguration** - Improper cross-origin resource sharing

---

## 🚨 Common Attack Scenarios

### Scenario 1: IDOR (Insecure Direct Object Reference)

**Vulnerability:**
```javascript
// BAD: No authorization check
app.get('/api/users/:id', (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user); // Returns ANY user's data!
});
```

**Attack:**
```bash
# Attacker changes URL from their ID to admin's ID
GET /api/users/1  # Their data
GET /api/users/2  # Admin's data - UNAUTHORIZED ACCESS!
```

**Impact:** Attacker accesses any user's personal information.

---

### Scenario 2: Missing Function Level Access Control

**Vulnerability:**
```javascript
// BAD: Admin function accessible to anyone
app.delete('/api/admin/users/:id', (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});
```

**Attack:**
```bash
# Regular user discovers admin endpoint
DELETE /api/admin/users/123
# Deletes user without authorization!
```

**Impact:** Regular users can perform administrative actions.

---

### Scenario 3: Path Traversal

**Vulnerability:**
```javascript
// BAD: No path validation
app.get('/api/files/:filename', (req, res) => {
  const file = fs.readFileSync(`./uploads/${req.params.filename}`);
  res.send(file);
});
```

**Attack:**
```bash
# Attacker uses path traversal
GET /api/files/../../../../etc/passwd
# Reads system files!
```

**Impact:** Access to sensitive system files.

---

### Scenario 4: JWT Token Manipulation

**Vulnerability:**
```javascript
// BAD: No token signature verification
const decoded = jwt.decode(token); // Just decodes, doesn't verify!
if (decoded.role === 'admin') {
  // Grant admin access
}
```

**Attack:**
```javascript
// Attacker modifies token payload
{
  "userId": 123,
  "role": "admin" // Changed from "user" to "admin"
}
```

**Impact:** Privilege escalation to administrator.

---

## 💥 Impact Assessment

### Data Confidentiality
- **High Risk:** Unauthorized access to sensitive data
- **Examples:** Personal information, financial data, medical records

### Data Integrity
- **High Risk:** Unauthorized modification or deletion of data
- **Examples:** Changing prices, deleting records, modifying permissions

### System Availability
- **Medium Risk:** Denial of service through resource manipulation
- **Examples:** Deleting critical data, exhausting resources

### Business Impact
- **Regulatory:** GDPR violations, compliance failures
- **Financial:** Data breach fines, lawsuits, lost revenue
- **Reputational:** Loss of customer trust, negative publicity

---

## 🛡️ Prevention Strategies

### 1. Deny by Default
```javascript
// GOOD: Deny by default, permit explicitly
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// All routes require auth by default
app.use('/api', requireAuth);
```

### 2. Implement Proper Access Control Checks
```javascript
// GOOD: Check authorization for each request
app.get('/api/users/:id', authenticate, (req, res) => {
  // User can only access their own data
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await User.findByPk(req.params.id);
  res.json(user);
});
```

### 3. Use Role-Based Access Control (RBAC)
```javascript
// GOOD: Centralized RBAC middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hasRole = req.user.roles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};

// Usage
app.delete('/api/users/:id', requireRole('SYSTEM_ADMIN'), deleteUser);
```

### 4. Validate JWT Tokens Properly
```javascript
// GOOD: Verify JWT signature
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify signature with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 5. Log Access Control Failures
```javascript
// GOOD: Audit all authorization failures
const auditAccessFailure = (req, action, reason) => {
  logger.warn('Access Control Violation', {
    userId: req.user?.id,
    ip: req.ip,
    action: action,
    reason: reason,
    timestamp: new Date().toISOString(),
  });
};

// In middleware
if (!hasRole) {
  auditAccessFailure(req, 'DELETE_USER', 'Insufficient permissions');
  return res.status(403).json({ error: 'Forbidden' });
}
```

---

## ✅ CGA Implementation

### JWT Authentication
```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { authenticate };
```

### Dynamic RBAC System
```javascript
// backend/src/middleware/rbac.js
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role }]
    });

    const userRoles = user.Roles.map(role => role.name);
    const hasPermission = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'ACCESS_DENIED',
        resource: req.originalUrl,
        ip: req.ip,
      });

      return res.status(403).json({ message: 'Accès interdit' });
    }

    next();
  };
};

module.exports = { requireRole };
```

### Resource Ownership Validation
```javascript
// backend/src/middleware/ownership.js
const requireOwnership = (resourceGetter) => {
  return async (req, res, next) => {
    const resource = await resourceGetter(req);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user owns resource or is admin
    const isOwner = resource.userId === req.user.id;
    const isAdmin = req.user.roles.includes('SYSTEM_ADMIN');

    if (!isOwner && !isAdmin) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        resource: req.originalUrl,
        resourceId: resource.id,
      });

      return res.status(403).json({ message: 'Access denied' });
    }

    req.resource = resource;
    next();
  };
};

// Usage
app.put('/api/applications/:id',
  authenticate,
  requireOwnership(req => Application.findByPk(req.params.id)),
  updateApplication
);
```

### Protected Routes Example
```javascript
// backend/src/routes/roles.js
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticate);

// Any authenticated user can view roles
router.get('/', getAllRoles);
router.get('/:id', getRoleById);

// Only SYSTEM_ADMIN can modify roles
router.post('/', requireRole('SYSTEM_ADMIN'), createRole);
router.put('/:id', requireRole('SYSTEM_ADMIN'), updateRole);
router.delete('/:id', requireRole('SYSTEM_ADMIN'), deleteRole);
router.post('/:id/permissions', requireRole('SYSTEM_ADMIN'), assignPermissions);
```

---

## 💻 Code Examples

### Secure Route Implementation

```javascript
// Complete secure endpoint example
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validation');
const Joi = require('joi');

// Validation schema
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
});

// Update user endpoint - secured
router.put('/users/:id',
  // 1. Authenticate user
  authenticate,

  // 2. Validate input
  validate(updateUserSchema),

  // 3. Check authorization
  async (req, res) => {
    const targetUserId = req.params.id;
    const requestingUser = req.user;

    // User can update their own profile
    const isSelf = targetUserId === requestingUser.id;

    // Admin can update any profile
    const isAdmin = requestingUser.roles.includes('SYSTEM_ADMIN');

    if (!isSelf && !isAdmin) {
      // Log unauthorized attempt
      await AuditLog.create({
        userId: requestingUser.id,
        action: 'UNAUTHORIZED_UPDATE_ATTEMPT',
        targetUserId: targetUserId,
        ip: req.ip,
      });

      return res.status(403).json({
        error: 'You can only update your own profile'
      });
    }

    // 4. Perform update
    try {
      const user = await User.findByPk(targetUserId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update(req.body);

      // Log successful update
      await AuditLog.create({
        userId: requestingUser.id,
        action: 'USER_UPDATED',
        targetUserId: targetUserId,
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
);

module.exports = router;
```

---

## 🧪 Testing Methods

### Manual Testing

#### Test 1: Horizontal Privilege Escalation
```bash
# Login as User A
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "userA", "password": "password"}'

# Get User A's token
TOKEN_A="eyJhbGc..."

# Try to access User B's data
curl http://localhost:5000/api/users/userB-id \
  -H "Authorization: Bearer $TOKEN_A"

# Expected: 403 Forbidden
```

#### Test 2: Vertical Privilege Escalation
```bash
# Login as regular user
TOKEN_USER="..."

# Try to access admin endpoint
curl -X DELETE http://localhost:5000/api/admin/users/123 \
  -H "Authorization: Bearer $TOKEN_USER"

# Expected: 403 Forbidden
```

#### Test 3: Missing Authentication
```bash
# Try to access protected resource without token
curl http://localhost:5000/api/users/123

# Expected: 401 Unauthorized
```

### Automated Testing

```javascript
// Test suite for access control
describe('Access Control Tests', () => {
  let userToken, adminToken;

  beforeEach(async () => {
    userToken = await loginAs('regular-user');
    adminToken = await loginAs('admin-user');
  });

  test('User cannot access another user\'s data', async () => {
    const response = await request(app)
      .get('/api/users/other-user-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  test('User cannot perform admin actions', async () => {
    const response = await request(app)
      .delete('/api/roles/some-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  test('Admin can perform admin actions', async () => {
    const response = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });

  test('No token returns 401', async () => {
    const response = await request(app)
      .get('/api/users/123');

    expect(response.status).toBe(401);
  });
});
```

---

## 📚 References

### OWASP Resources
- **OWASP Top 10 A01:** https://owasp.org/Top10/A01_2021-Broken_Access_Control/
- **Access Control Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html
- **Authorization Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/

### CWE References
- **CWE-200:** Exposure of Sensitive Information
- **CWE-201:** Information Exposure Through Sent Data
- **CWE-352:** Cross-Site Request Forgery (CSRF)
- **CWE-639:** Authorization Bypass
- **CWE-918:** Server-Side Request Forgery (SSRF)

### Additional Reading
- **JWT Best Practices:** https://tools.ietf.org/html/rfc8725
- **RBAC Design Patterns:** Industry standard RBAC implementations
- **OAuth 2.0 Security:** https://oauth.net/2/

---

## ✅ Checklist

- [ ] All endpoints require authentication
- [ ] Authorization checked on every request
- [ ] RBAC properly implemented
- [ ] JWT tokens properly verified (not just decoded)
- [ ] Access control failures logged
- [ ] No IDOR vulnerabilities
- [ ] Path traversal prevented
- [ ] CORS properly configured
- [ ] Rate limiting on sensitive endpoints
- [ ] Regular security testing performed

---

**Status:** ✅ IMPLEMENTED IN CGA
**Last Updated:** 2025-12-09
**Next Review:** Quarterly

**🔒 Access Control is the foundation of application security!**
