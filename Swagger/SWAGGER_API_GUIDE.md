# 📚 Swagger API Documentation Guide - CGA Application

## Interactive API Testing and Collaboration Tool

**Date:** 2025-12-09
**Status:** ✅ PRODUCTION READY
**Styled with:** 🇬🇦 Gabon Flag Colors

---

## 🎯 What is Swagger?

Swagger UI is an interactive API documentation tool that allows developers to:
- **Explore** all available API endpoints
- **Test** endpoints directly in the browser
- **Understand** request/response formats
- **Collaborate** between frontend and backend teams
- **Generate** API clients automatically

---

## 🚀 Quick Start

### Access Swagger UI

Once your backend server is running, access Swagger at:

```
http://localhost:5000/api-docs
```

**In production:**
```
https://yourdomain.com/api-docs
```

### Get OpenAPI Specification (JSON)

Download the raw OpenAPI specification:
```
http://localhost:5000/api-docs.json
```

---

## 🎨 Gabon Theme Customization

The Swagger UI has been customized with Gabon flag colors:

| Element | Color | Hex Code |
|---------|-------|----------|
| **POST** endpoints | Green | #009E60 |
| **GET** endpoints | Blue | #3A75C4 |
| **PUT** endpoints | Yellow | #FCD116 |
| **DELETE** endpoints | Red | #D32F2F |
| **Execute button** | Green | #009E60 |
| **Header bar** | Tricolor gradient | Green → Yellow → Blue |

---

## 🔐 Testing Authenticated Endpoints

Most CGA endpoints require JWT authentication. Follow these steps:

### Step 1: Get JWT Token

Since auth routes aren't implemented yet, use one of these methods:

**Option A: Use default admin credentials (once implemented)**
1. Go to POST `/api/auth/login`
2. Click "Try it out"
3. Enter credentials:
   ```json
   {
     "username": "admin",
     "password": "Admin@123456"
   }
   ```
4. Click "Execute"
5. Copy the `token` from the response

**Option B: Use existing JWT token**
If you already have a token, skip to Step 2.

### Step 2: Authorize Swagger

1. Click the **"Authorize" button** (lock icon) at the top right
2. Enter your JWT token in the format:
   ```
   Bearer YOUR_JWT_TOKEN_HERE
   ```
   Example:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click **"Authorize"**
4. Click **"Close"**

### Step 3: Test Endpoints

Now all authenticated endpoints will automatically include your token:
1. Navigate to any endpoint
2. Click **"Try it out"**
3. Fill in parameters/body
4. Click **"Execute"**
5. See the response below

---

## 📖 Available API Endpoints

### Health Check
- **GET** `/api/health` - Check service and database status (no auth required)

### Role Management (RBAC)
All role endpoints require authentication. Admin operations require SYSTEM_ADMIN role.

- **GET** `/api/roles` - Get all roles (any authenticated user)
- **GET** `/api/roles/{id}` - Get role by ID (any authenticated user)
- **POST** `/api/roles` - Create new role (SYSTEM_ADMIN only)
- **PUT** `/api/roles/{id}` - Update role (SYSTEM_ADMIN only)
- **DELETE** `/api/roles/{id}` - Delete role (SYSTEM_ADMIN only)
- **POST** `/api/roles/{id}/permissions` - Assign permissions (SYSTEM_ADMIN only)

### Coming Soon
- Authentication endpoints (login, logout, refresh)
- User management
- Vehicle applications
- Workflow management
- Document management

---

## 🛠️ For Developers: Adding API Documentation

### Basic Syntax

Add JSDoc comments above your route definitions:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success response
 */
router.get('/your-endpoint', yourController);
```

### Complete Example with Authentication

```javascript
/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     description: Retrieve a list of all registered vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/vehicles', authenticate, getAllVehicles);
```

### POST Endpoint with Request Body

```javascript
/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create new application
 *     description: Submit a new vehicle registration application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleType
 *               - ownerName
 *             properties:
 *               vehicleType:
 *                 type: string
 *                 example: "Car"
 *               ownerName:
 *                 type: string
 *                 example: "Jean Dupont"
 *               chassisNumber:
 *                 type: string
 *                 example: "ABC123XYZ456"
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/applications', authenticate, createApplication);
```

### Path Parameters

```javascript
/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *       404:
 *         description: Application not found
 */
router.get('/applications/:id', authenticate, getApplicationById);
```

---

## 📝 Adding New Schemas

Schemas are defined in `backend/src/config/swagger.js`. Add new ones under `components.schemas`:

```javascript
components: {
  schemas: {
    Vehicle: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Vehicle unique identifier',
        },
        chassisNumber: {
          type: 'string',
          description: 'Vehicle chassis number',
        },
        registrationNumber: {
          type: 'string',
          description: 'Vehicle registration number',
        },
        vehicleType: {
          type: 'string',
          enum: ['Car', 'Truck', 'Motorcycle', 'Bus'],
          description: 'Type of vehicle',
        },
        ownerName: {
          type: 'string',
          description: 'Vehicle owner name',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}
```

---

## 🏷️ Available Tags

Tags organize endpoints into logical groups:

- **Health** - System health checks
- **Authentication** - Login, logout, token refresh
- **Roles** - Dynamic role management
- **Users** - User management
- **Applications** - Vehicle registration applications
- **Workflows** - Workflow management
- **Documents** - Document upload and management

Add more tags in `backend/src/config/swagger.js`:

```javascript
tags: [
  {
    name: 'Vehicles',
    description: 'Vehicle registry endpoints',
  },
],
```

---

## 🔧 Configuration Files

### Main Configuration
**File:** `backend/src/config/swagger.js`
- OpenAPI specification
- Server URLs
- Authentication schemes
- Component schemas
- Tags

### Integration
**File:** `backend/server.js`
- Swagger UI middleware
- Custom CSS (Gabon theme)
- Route mounting
- Security headers (Helmet CSP)

---

## 🎨 Customizing the Theme

Edit the `customCss` in `backend/server.js`:

```javascript
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar {
      background: linear-gradient(90deg, #009E60 0%, #FCD116 50%, #3A75C4 100%);
    }
    .swagger-ui .info .title { color: #009E60; }
    .swagger-ui .btn.execute { background-color: #009E60; }
    /* Add more custom styles here */
  `,
  customSiteTitle: 'CGA API Documentation',
  customfavIcon: '/favicon.ico',
};
```

---

## 🐳 Swagger in Docker

Swagger works automatically in Docker containers. No special configuration needed.

**Access in Docker:**
```bash
# Start containers
docker-compose up -d

# Access Swagger
http://localhost:5000/api-docs
```

---

## 📊 Exporting API Documentation

### Export as JSON
```bash
curl http://localhost:5000/api-docs.json > openapi.json
```

### Generate Client Code
Use tools like:
- **Swagger Codegen** - Generate client libraries
- **OpenAPI Generator** - Generate server stubs
- **Postman** - Import OpenAPI spec

Example:
```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:5000/api-docs.json \
  -g typescript-axios \
  -o ./frontend/src/api-client
```

---

## 🚀 Best Practices

### 1. Document as You Code
Add Swagger annotations when creating new endpoints, not after.

### 2. Use Schema References
Reuse schemas with `$ref`:
```javascript
schema:
  $ref: '#/components/schemas/User'
```

### 3. Provide Examples
Include realistic examples in schemas:
```javascript
properties:
  email:
    type: 'string'
    format: 'email'
    example: 'user@cga.local'
```

### 4. Document All Response Codes
Include all possible HTTP status codes:
- 200/201 - Success
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

### 5. Keep It Updated
Update documentation when:
- Adding new endpoints
- Changing request/response formats
- Adding/removing parameters
- Updating authentication

---

## 🐛 Troubleshooting

### Swagger UI Not Loading
**Problem:** Page shows blank or errors
**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Check browser console for CSP errors
3. Verify Helmet CSP allows inline styles/scripts (see `server.js`)

### Authentication Not Working
**Problem:** "Unauthorized" errors after authorizing
**Solution:**
1. Ensure token format is: `Bearer YOUR_TOKEN`
2. Check token hasn't expired
3. Verify `bearerAuth` security scheme is defined
4. Check endpoint has `security: [{ bearerAuth: [] }]`

### Documentation Not Updating
**Problem:** Changes to JSDoc comments not appearing
**Solution:**
1. Restart the backend server
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache
4. Check file paths in `swagger.js` `apis` array

### Custom CSS Not Applied
**Problem:** Gabon colors not showing
**Solution:**
1. Check `customCss` in `swaggerOptions`
2. Verify Helmet CSP allows `'unsafe-inline'` for styles
3. Inspect element to see if styles are applied
4. Try adding `!important` to CSS rules

---

## 📚 Additional Resources

### Official Documentation
- **Swagger UI:** https://swagger.io/tools/swagger-ui/
- **OpenAPI Specification:** https://swagger.io/specification/
- **swagger-jsdoc:** https://github.com/Surnet/swagger-jsdoc

### Tools
- **Swagger Editor:** https://editor.swagger.io/
- **Swagger Inspector:** Test and generate OpenAPI specs
- **Postman:** Import OpenAPI for testing

### Learning
- **OpenAPI Tutorial:** https://oai.github.io/Documentation/
- **Swagger Best Practices:** https://swagger.io/resources/articles/

---

## ✅ Checklist for New Endpoints

When adding a new endpoint, ensure:

- [ ] JSDoc `@swagger` comment added
- [ ] Summary and description provided
- [ ] Correct tag assigned
- [ ] Security scheme added (if auth required)
- [ ] All parameters documented (path, query, body)
- [ ] Request body schema defined (for POST/PUT)
- [ ] All response codes documented (200, 400, 401, etc.)
- [ ] Response schemas referenced
- [ ] Examples provided where helpful
- [ ] Server restarted to reload docs
- [ ] Tested in Swagger UI

---

## 🎉 Summary

Swagger UI provides:
- ✅ **Interactive API testing** - No Postman needed
- ✅ **Real-time collaboration** - Frontend/Backend sync
- ✅ **Auto-generated docs** - From code annotations
- ✅ **Professional appearance** - Gabon-themed design
- ✅ **Standard format** - OpenAPI 3.0 compliant
- ✅ **Easy integration** - Works in dev and production
- ✅ **Client generation** - Export for code generators

---

**🇬🇦 For the Gabonese Republic**

**Status:** ✅ PRODUCTION READY
**Date:** 2025-12-09
**Version:** 1.0.0
