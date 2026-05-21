-- ========== SUPERADMIN ==========
UPDATE "user" 
SET user_type = 'SUPERADMIN', 
    record_status = 'ACTIVE',
    username = 'JCE',
    firstName = 'Jerry',
    lastName = 'Esperanza'
WHERE userId = '77df4c12-6ec2-4e39-a387-4dc0d0417842';

DELETE FROM UserModule_Rights WHERE userid = '77df4c12-6ec2-4e39-a387-4dc0d0417842';
INSERT INTO UserModule_Rights (userid, Right_ID, Right_value, Record_status, Stamp) VALUES
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'PRD_ADD',  1, 'ACTIVE', 'SEED'),
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'PRD_EDIT', 1, 'ACTIVE', 'SEED'),
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'PRD_DEL',  1, 'ACTIVE', 'SEED'),
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'REP_001',  1, 'ACTIVE', 'SEED'),
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'REP_002',  1, 'ACTIVE', 'SEED'),
  ('77df4c12-6ec2-4e39-a387-4dc0d0417842', 'ADM_USER', 1, 'ACTIVE', 'SEED');

-- ========== ADMIN ==========
UPDATE "user" 
SET user_type = 'ADMIN', 
    record_status = 'ACTIVE',
    username = 'Admin',
    firstName = 'Admin',
    lastName = 'Admin'
WHERE userId = 'REPLACE_WITH_ADMIN_UUID';

DELETE FROM UserModule_Rights WHERE userid = 'REPLACE_WITH_ADMIN_UUID';
INSERT INTO UserModule_Rights (userid, Right_ID, Right_value, Record_status, Stamp) VALUES
  ('REPLACE_WITH_ADMIN_UUID', 'PRD_ADD',  1, 'ACTIVE', 'SEED'),
  ('REPLACE_WITH_ADMIN_UUID', 'PRD_EDIT', 1, 'ACTIVE', 'SEED'),
  ('REPLACE_WITH_ADMIN_UUID', 'PRD_DEL',  0, 'ACTIVE', 'SEED'),
  ('REPLACE_WITH_ADMIN_UUID', 'REP_001',  1, 'ACTIVE', 'SEED'),
  ('REPLACE_WITH_ADMIN_UUID', 'REP_002',  0, 'ACTIVE', 'SEED'),
  ('REPLACE_WITH_ADMIN_UUID', 'ADM_USER', 1, 'ACTIVE', 'SEED');

-- ========== USER ==========
UPDATE "user" 
SET user_type = 'USER', 
    record_status = 'ACTIVE',
    username = 'Aaron',
    firstName = 'Aaronmar',
    lastName = 'Dionisio'
WHERE userId = '40451d3e-57e5-4241-a559-c3c077b42fe6';

DELETE FROM UserModule_Rights WHERE userid = '40451d3e-57e5-4241-a559-c3c077b42fe6';
INSERT INTO UserModule_Rights (userid, Right_ID, Right_value, Record_status, Stamp) VALUES
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'PRD_ADD',  1, 'ACTIVE', 'SEED'),
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'PRD_EDIT', 1, 'ACTIVE', 'SEED'),
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'PRD_DEL',  0, 'ACTIVE', 'SEED'),
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'REP_001',  1, 'ACTIVE', 'SEED'),
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'REP_002',  0, 'ACTIVE', 'SEED'),
  ('40451d3e-57e5-4241-a559-c3c077b42fe6', 'ADM_USER', 0, 'ACTIVE', 'SEED');