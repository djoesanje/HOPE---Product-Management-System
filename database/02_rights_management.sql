-- =====================================================
-- Rights Management Schema
-- Run this script second in Supabase SQL Editor
-- =====================================================

-- Create USER table
CREATE TABLE "user" (
  userId VARCHAR(50) NOT NULL PRIMARY KEY,
  username VARCHAR(50),
  lastName VARCHAR(50),
  firstName VARCHAR(50),
  user_type VARCHAR(20) DEFAULT 'USER',
  record_status VARCHAR(10) DEFAULT 'INACTIVE',
  stamp TEXT
);

-- Create MODULE table
CREATE TABLE Module (
  Module_ID VARCHAR(20) NOT NULL PRIMARY KEY,
  Module_Name VARCHAR(50),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp TEXT
);

-- Insert MODULE rows
INSERT INTO Module VALUES('Prod_Mod', 'Product Management', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO Module VALUES('Report_Mod', 'Reports', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO Module VALUES('Adm_Mod', 'Administration', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');

-- Create USER_MODULE table
CREATE TABLE user_module (
  userid VARCHAR(50) NOT NULL REFERENCES "user",
  Module_ID VARCHAR(20) NOT NULL REFERENCES Module,
  rights_value INT DEFAULT 0,
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp TEXT,
  PRIMARY KEY (userid, Module_ID)
);

-- Create RIGHTS table
CREATE TABLE rights (
  Right_ID VARCHAR(20) NOT NULL PRIMARY KEY,
  Right_Name VARCHAR(50),
  Module_ID VARCHAR(20) REFERENCES Module,
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp TEXT
);

-- Insert RIGHTS rows
INSERT INTO rights VALUES('PRD_ADD', 'Add Product', 'Prod_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO rights VALUES('PRD_EDIT', 'Edit Product', 'Prod_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO rights VALUES('PRD_DEL', 'Delete Product', 'Prod_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO rights VALUES('REP_001', 'Product Report', 'Report_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO rights VALUES('REP_002', 'Top Selling Report', 'Report_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
INSERT INTO rights VALUES('ADM_USER', 'User Management', 'Adm_Mod', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');

-- Create USERMODULE_RIGHTS table
CREATE TABLE UserModule_Rights (
  userid VARCHAR(50) NOT NULL REFERENCES "user",
  Right_ID VARCHAR(20) NOT NULL REFERENCES rights,
  Right_value INT DEFAULT 0,
  Record_status VARCHAR(10) DEFAULT 'ACTIVE',
  Stamp TEXT,
  PRIMARY KEY (userid, Right_ID)
);

-- Insert SUPERADMIN user (jcesperanza@neu.edu.ph)
-- Note: This user must be created in Supabase Auth first, then update the userId here
-- For now, we'll use a placeholder. Update this after creating the auth user.
-- INSERT INTO "user" VALUES('user1', 'Jerry', 'Esperanza', 'JC', 'SUPERADMIN', 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');

-- SUPERADMIN module access (uncomment after creating auth user)
-- INSERT INTO user_module VALUES('user1', 'Prod_Mod', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO user_module VALUES('user1', 'Report_Mod', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO user_module VALUES('user1', 'Adm_Mod', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');

-- SUPERADMIN rights (uncomment after creating auth user)
-- INSERT INTO UserModule_Rights VALUES('user1', 'PRD_ADD', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO UserModule_Rights VALUES('user1', 'PRD_EDIT', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO UserModule_Rights VALUES('user1', 'PRD_DEL', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO UserModule_Rights VALUES('user1', 'REP_001', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO UserModule_Rights VALUES('user1', 'REP_002', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
-- INSERT INTO UserModule_Rights VALUES('user1', 'ADM_USER', 1, 'ACTIVE', 'INITIAL SYSTEM 2024-01-01 00:00');
