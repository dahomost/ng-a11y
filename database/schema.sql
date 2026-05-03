-- Library Management Platform — PostgreSQL schema
-- Database: library (create separately: CREATE DATABASE library;)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('PUBLIC', 'LIBRARIAN', 'ADMIN');

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'PUBLIC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE INDEX idx_users_role ON users (role);

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(512) NOT NULL,
  author VARCHAR(512),
  description TEXT,
  category VARCHAR(255),
  published_date DATE,
  isbn VARCHAR(32),
  language VARCHAR(32),
  created_by UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_collections_created_by ON collections (created_by);
CREATE INDEX idx_collections_category ON collections (category);
CREATE INDEX idx_collections_title ON collections (title);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  CONSTRAINT tags_name_unique UNIQUE (name)
);

CREATE INDEX idx_tags_name ON tags (name);

-- ---------------------------------------------------------------------------
-- collection_tags (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE collection_tags (
  collection_id UUID NOT NULL REFERENCES collections (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, tag_id)
);

CREATE INDEX idx_collection_tags_tag ON collection_tags (tag_id);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(128) NOT NULL,
  entity_id UUID,
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);

-- ---------------------------------------------------------------------------
-- updated_at trigger (collections)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_collections_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_collections_updated_at ON collections;

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE PROCEDURE set_collections_updated_at();
