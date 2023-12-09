ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_fk;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_fkey;
ALTER TABLE users ALTER COLUMN role TYPE varchar[] USING array[role];
ALTER TABLE users RENAME COLUMN role TO roles;