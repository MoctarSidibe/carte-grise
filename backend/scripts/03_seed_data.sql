-- ============================================================================
-- Script 3: Seed Data
-- Description: Inserts initial data for roles, permissions, and system admin
-- Usage: Run after creating tables
-- Command: \c cga_db
--          \i C:/Users/user/Downloads/pca/backend/scripts/03_seed_data.sql
-- ============================================================================

-- ============================================================================
-- INSERT ROLES
-- ============================================================================
-- Note: Only SYSTEM_ADMIN is predefined. All other roles should be created
-- through the UI by system administrators to match your organization's structure.
-- Examples: Patrimoine, DCRTCT, Agent Accueil, Validateur, etc.

INSERT INTO roles (id, name, description, is_system_role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'SYSTEM_ADMIN', 'Administrateur système avec accès complet', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Example roles for reference (commented out - create these through the UI)
-- INSERT INTO roles (name, description, is_system_role) VALUES
--     ('Patrimoine', 'Service Patrimoine - Gestion des demandes', FALSE),
--     ('DCRTCT', 'Direction Centrale - Validation finale', FALSE),
--     ('Agent Accueil', 'Agent d''accueil - Réception des demandes', FALSE),
--     ('Validateur', 'Validateur - Vérification des documents', FALSE)
-- ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- INSERT PERMISSIONS
-- ============================================================================

INSERT INTO permissions (name, resource, action, description) VALUES
    -- User Management
    ('manage_users', 'users', 'create,read,update,delete', 'Full user management access'),
    ('view_users', 'users', 'read', 'View users'),

    -- Role Management
    ('manage_roles', 'roles', 'create,read,update,delete', 'Full role management access'),
    ('view_roles', 'roles', 'read', 'View roles'),

    -- Workflow Management
    ('manage_workflows', 'workflows', 'create,read,update,delete', 'Full workflow management access'),
    ('view_workflows', 'workflows', 'read', 'View workflows'),

    -- Form Management
    ('manage_forms', 'forms', 'create,read,update,delete', 'Full form management access'),
    ('view_forms', 'forms', 'read', 'View forms'),

    -- Application Management
    ('create_applications', 'applications', 'create', 'Create new applications'),
    ('view_applications', 'applications', 'read', 'View applications'),
    ('update_applications', 'applications', 'update', 'Update applications'),
    ('delete_applications', 'applications', 'delete', 'Delete applications'),
    ('process_applications', 'applications', 'process', 'Process and validate applications'),
    ('approve_applications', 'applications', 'approve', 'Approve applications'),
    ('reject_applications', 'applications', 'reject', 'Reject applications'),

    -- Document Management
    ('upload_documents', 'documents', 'create', 'Upload documents'),
    ('view_documents', 'documents', 'read', 'View documents'),
    ('delete_documents', 'documents', 'delete', 'Delete documents'),

    -- Digital Signature
    ('sign_documents', 'signatures', 'create', 'Digitally sign documents'),
    ('view_signatures', 'signatures', 'read', 'View signatures'),

    -- Audit Logs
    ('view_audit_logs', 'audit', 'read', 'View audit logs'),

    -- Document Types
    ('manage_document_types', 'document_types', 'create,read,update,delete', 'Manage document types')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ASSIGN PERMISSIONS TO ROLES
-- ============================================================================

-- SYSTEM_ADMIN: All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '11111111-1111-1111-1111-111111111111', id FROM permissions
ON CONFLICT DO NOTHING;

-- Note: Other roles will have their permissions assigned through the UI
-- by system administrators when creating or editing roles.

-- ============================================================================
-- CREATE DEFAULT SYSTEM ADMIN
-- Password: Admin@123456 (MUST BE CHANGED ON FIRST LOGIN)
-- Hash generated with bcrypt, 12 rounds
-- ============================================================================

INSERT INTO users (id, username, email, password_hash, first_name, last_name, is_active)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'admin',
    'admin@cga.local',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCVfPfG4tW',
    'System',
    'Administrator',
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- Assign SYSTEM_ADMIN role to default admin
INSERT INTO user_roles (user_id, role_id)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CREATE DEFAULT DOCUMENT TYPES
-- ============================================================================

INSERT INTO document_types (name, description, is_required, allowed_extensions) VALUES
    ('Photo d''identité', 'Photo d''identité récente', TRUE, 'jpg,jpeg,png'),
    ('Certificat médical', 'Certificat médical de aptitude', TRUE, 'pdf'),
    ('Justificatif de domicile', 'Justificatif de domicile de moins de 3 mois', TRUE, 'pdf,jpg,jpeg,png'),
    ('Copie CNI', 'Copie de la carte nationale d''identité', TRUE, 'pdf,jpg,jpeg,png'),
    ('Certificat de résidence', 'Certificat de résidence', FALSE, 'pdf'),
    ('Autre document', 'Autre document justificatif', FALSE, 'pdf,jpg,jpeg,png')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CREATE DEFAULT WORKFLOW TEMPLATE
-- ============================================================================
-- Note: This is an example workflow. System admins should create actual
-- workflows through the UI and assign them to the appropriate roles
-- (Patrimoine, DCRTCT, etc.) based on your organization's processes.

-- Commented out - workflows should be created through the UI
-- INSERT INTO workflow_templates (id, name, description, is_active, created_by)
-- VALUES (
--     'wf111111-1111-1111-1111-111111111111',
--     'Workflow Standard Permis de Conduire',
--     'Processus de validation standard pour l''obtention du permis de conduire administratif',
--     TRUE,
--     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
-- )
-- ON CONFLICT DO NOTHING;

-- ============================================================================
-- CREATE DEFAULT FORM TEMPLATE
-- ============================================================================
-- Note: Forms should be created through the UI by system administrators
-- to match your organization's specific requirements.

-- Commented out - forms should be created through the UI
-- INSERT INTO form_templates (id, name, description, is_active, created_by)
-- VALUES (
--     'form1111-1111-1111-1111-111111111111',
--     'Formulaire Standard Demande Permis',
--     'Formulaire standard pour la demande de permis de conduire administratif',
--     TRUE,
--     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
-- )
-- ON CONFLICT DO NOTHING;

-- ============================================================================
-- CONFIRMATION MESSAGE
-- ============================================================================

\echo ''
\echo '=========================================='
\echo 'Database seeded successfully!'
\echo '=========================================='
\echo ''
\echo 'Default System Admin Credentials:'
\echo '  Username: admin'
\echo '  Password: Admin@123456'
\echo '  Email: admin@cga.local'
\echo ''
\echo 'IMPORTANT: Change the default password immediately!'
\echo ''
\echo 'Default Roles Created:'
\echo '  - SYSTEM_ADMIN (only predefined role)'
\echo ''
\echo 'Next Steps:'
\echo '  1. Login as admin'
\echo '  2. Create roles for your organization'
\echo '     Examples: Patrimoine, DCRTCT, Agent Accueil, etc.'
\echo '  3. Assign permissions to each role'
\echo '  4. Create workflow templates'
\echo '  5. Create form templates'
\echo '  6. Create users and assign roles'
\echo ''
\echo '=========================================='
