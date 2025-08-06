-- Crear usuario administrador con las credenciales especificadas
INSERT INTO public.profiles (
  user_id,
  username,
  password_hash,
  role,
  nombre,
  telefono,
  email,
  direccion,
  rif,
  nombre_empresa,
  contacto,
  categoria
) VALUES (
  gen_random_uuid(),
  'admin',
  crypt('12345678', gen_salt('bf')),
  'admin',
  'Administrador del Sistema',
  '0000-0000000',
  'admin@empresa.com',
  'Oficina Principal',
  'J-00000000-0',
  'Pida Pizza',
  'admin@empresa.com',
  'Administración'
);