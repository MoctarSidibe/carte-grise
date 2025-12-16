-- ============================================================================
-- Script 3: Comprehensive Seed Data
-- Description: Inserts comprehensive data including roles, users, permissions,
--              workflows, forms, and sample applications with French data
-- Usage: Run after creating tables
-- Command: \c cga_db
--          \i C:/Users/user/Downloads/pca/backend/scripts/03_seed_data.sql
-- ============================================================================

-- ============================================================================
-- INSERT ROLES (5 roles as requested)
-- ============================================================================

INSERT INTO roles (id, name, description, is_system_role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'SYSTEM_ADMIN', 'Administrateur système avec accès complet', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Agent Accueil', 'Agent d''accueil - Réception et enregistrement des demandes', FALSE),
    ('33333333-3333-3333-3333-333333333333', 'Technicien Validation', 'Technicien de validation - Vérification des documents et des dossiers', FALSE),
    ('44444444-4444-4444-4444-444444444444', 'Superviseur', 'Superviseur - Supervision et approbation des dossiers', FALSE),
    ('55555555-5555-5555-5555-555555555555', 'Directeur', 'Directeur - Validation finale et signature des cartes grises', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INSERT PERMISSIONS (29 permissions as requested)
-- ============================================================================

INSERT INTO permissions (name, resource, action, description) VALUES
    -- User Management (4 permissions)
    ('manage_users', 'users', 'create,read,update,delete', 'Gestion complète des utilisateurs'),
    ('view_users', 'users', 'read', 'Consultation des utilisateurs'),
    ('create_users', 'users', 'create', 'Création de nouveaux utilisateurs'),
    ('update_users', 'users', 'update', 'Modification des utilisateurs'),

    -- Role Management (4 permissions)
    ('manage_roles', 'roles', 'create,read,update,delete', 'Gestion complète des rôles'),
    ('view_roles', 'roles', 'read', 'Consultation des rôles'),
    ('assign_roles', 'roles', 'assign', 'Attribution des rôles aux utilisateurs'),
    ('manage_permissions', 'permissions', 'create,read,update,delete', 'Gestion des permissions'),

    -- Workflow Management (4 permissions)
    ('manage_workflows', 'workflows', 'create,read,update,delete', 'Gestion complète des workflows'),
    ('view_workflows', 'workflows', 'read', 'Consultation des workflows'),
    ('create_workflows', 'workflows', 'create', 'Création de workflows'),
    ('update_workflows', 'workflows', 'update', 'Modification des workflows'),

    -- Form Management (4 permissions)
    ('manage_forms', 'forms', 'create,read,update,delete', 'Gestion complète des formulaires'),
    ('view_forms', 'forms', 'read', 'Consultation des formulaires'),
    ('create_forms', 'forms', 'create', 'Création de formulaires'),
    ('update_forms', 'forms', 'update', 'Modification des formulaires'),

    -- Application Management (7 permissions)
    ('create_applications', 'applications', 'create', 'Création de nouvelles demandes'),
    ('view_applications', 'applications', 'read', 'Consultation des demandes'),
    ('update_applications', 'applications', 'update', 'Modification des demandes'),
    ('delete_applications', 'applications', 'delete', 'Suppression des demandes'),
    ('process_applications', 'applications', 'process', 'Traitement et validation des demandes'),
    ('approve_applications', 'applications', 'approve', 'Approbation des demandes'),
    ('reject_applications', 'applications', 'reject', 'Rejet des demandes'),

    -- Document Management (3 permissions)
    ('upload_documents', 'documents', 'create', 'Téléchargement de documents'),
    ('view_documents', 'documents', 'read', 'Consultation des documents'),
    ('delete_documents', 'documents', 'delete', 'Suppression des documents'),

    -- Digital Signature (2 permissions)
    ('sign_documents', 'signatures', 'create', 'Signature numérique des documents'),
    ('view_signatures', 'signatures', 'read', 'Consultation des signatures'),

    -- Audit & System (1 permission)
    ('view_audit_logs', 'audit', 'read', 'Consultation des journaux d''audit')
ON CONFLICT (name) DO NOTHING;
