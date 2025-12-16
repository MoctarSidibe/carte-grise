-- ============================================================================
-- Script 2: Table Creation
-- Description: Creates all tables for the CGA (Carte Grise Administrative) application
-- Usage: Run after creating database
-- Command: \c cga_db
--          \i C:/Users/user/Downloads/pca/backend/scripts/02_create_tables.sql
-- ============================================================================

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS AND ROLES TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================================
-- WORKFLOW CONFIGURATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_template_id UUID REFERENCES workflow_templates(id) ON DELETE CASCADE,
    step_name VARCHAR(255) NOT NULL,
    step_order INT NOT NULL,
    description TEXT,
    assigned_role_id UUID REFERENCES roles(id),
    requires_signature BOOLEAN DEFAULT FALSE,
    requires_documents BOOLEAN DEFAULT FALSE,
    can_reject BOOLEAN DEFAULT TRUE,
    can_request_changes BOOLEAN DEFAULT TRUE,
    time_limit_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_template_id, step_order)
);

CREATE TABLE IF NOT EXISTS workflow_step_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_step_id UUID REFERENCES workflow_steps(id) ON DELETE CASCADE,
    condition_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100),
    operator VARCHAR(20),
    expected_value TEXT,
    next_step_id UUID REFERENCES workflow_steps(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DYNAMIC FORMS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS form_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_template_id UUID REFERENCES form_templates(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    field_order INT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    validation_rules JSONB,
    default_value TEXT,
    options JSONB,
    help_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(form_template_id, field_order)
);

-- ============================================================================
-- APPLICATION/DEMANDE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    workflow_template_id UUID REFERENCES workflow_templates(id),
    current_step_id UUID REFERENCES workflow_steps(id),
    status VARCHAR(50) DEFAULT 'DRAFT',
    applicant_first_name VARCHAR(100) NOT NULL,
    applicant_last_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(20),
    form_data JSONB,
    submitted_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    workflow_step_id UUID REFERENCES workflow_steps(id),
    action VARCHAR(50) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50),
    comments TEXT,
    decision VARCHAR(50),
    assigned_to UUID REFERENCES users(id),
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signature_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOCUMENT MANAGEMENT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    max_file_size INT DEFAULT 10485760,
    allowed_extensions VARCHAR(255) DEFAULT 'pdf,jpg,jpeg,png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    document_type_id UUID REFERENCES document_types(id),
    workflow_step_id UUID REFERENCES workflow_steps(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DIGITAL SIGNATURE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS digital_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    workflow_step_id UUID REFERENCES workflow_steps(id),
    user_id UUID REFERENCES users(id),
    signature_data TEXT NOT NULL,
    signature_hash VARCHAR(64) NOT NULL,
    certificate_data TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT LOG TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    application_id UUID REFERENCES applications(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- NOTIFICATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- GENERATED DOCUMENTS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    template_version INT,
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_by ON applications(created_by);
CREATE INDEX idx_applications_workflow ON applications(workflow_template_id);
CREATE INDEX idx_application_history_app ON application_history(application_id);
CREATE INDEX idx_application_history_user ON application_history(processed_by);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_application ON audit_logs(application_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_documents_application ON application_documents(application_id);
CREATE INDEX idx_signatures_application ON digital_signatures(application_id);

COMMENT ON TABLE users IS 'System users with authentication credentials';
COMMENT ON TABLE roles IS 'User roles for RBAC';
COMMENT ON TABLE permissions IS 'Granular permissions for RBAC';
COMMENT ON TABLE workflow_templates IS 'Dynamic workflow definitions';
COMMENT ON TABLE workflow_steps IS 'Steps within each workflow';
COMMENT ON TABLE applications IS 'Carte grise administrative applications';
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system actions';
