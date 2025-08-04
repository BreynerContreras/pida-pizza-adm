-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear un usuario administrador por defecto
SELECT public.create_user_profile(
  'admin',              -- username
  'admin123',           -- password  
  'admin',              -- role
  'Administrador del Sistema',  -- nombre
  '0414-1234567',       -- telefono
  'admin@sistema.com',  -- email
  'Oficina Principal',  -- direccion
  'J-12345678-9',       -- rif
  'Sistema de Gestión', -- nombre_empresa
  'Administrador',      -- contacto
  'Administración'      -- categoria
);