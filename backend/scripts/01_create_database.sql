-- ============================================================================
-- Script 1: Database Creation
-- Description: Creates the main database for PCA application
-- Usage: Run this in PostgreSQL shell as superuser
-- Command: \i C:/Users/user/Downloads/pca/backend/scripts/01_create_database.sql
-- ============================================================================

-- Create database
CREATE DATABASE cga_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the database
\c cga_db

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

COMMENT ON DATABASE cga_db IS 'Carte Grise Administrative - Workflow Management System';
