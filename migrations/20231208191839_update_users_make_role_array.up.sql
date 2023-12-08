ALTER TABLE users DROP CONSTRAINT users_role_fk;
ALTER TABLE users ALTER COLUMN role TYPE varchar[] USING array[role];
ALTER TABLE users RENAME COLUMN role TO roles;