-- Crear usuarios para cada perfil
SELECT public.create_user_profile(
  'contador',
  'contador123',
  'contadora',
  'Usuario Contador',
  '555-0001',
  'contador@pidapizza.com',
  'Dirección Contador',
  'J-12345678-1',
  NULL,
  NULL,
  NULL
);

SELECT public.create_user_profile(
  'administrador', 
  'admin123',
  'admin',
  'Usuario Administrador',
  '555-0002', 
  'admin@pidapizza.com',
  'Dirección Administrador',
  'J-87654321-2',
  NULL,
  NULL,
  NULL
);

SELECT public.create_user_profile(
  'gerente',
  'gerente123', 
  'gerente_operativo',
  'Usuario Gerente Operativo',
  '555-0003',
  'gerente@pidapizza.com', 
  'Dirección Gerente',
  'J-11223344-3',
  'Pizza Express S.A.',
  'María González',
  'Restaurante'
);

-- Actualizar función authenticate_user para usar email
CREATE OR REPLACE FUNCTION public.authenticate_user(input_email text, input_password text)
RETURNS TABLE(id uuid, user_id uuid, username text, role text, nombre text, telefono text, email text, direccion text, rif text, nombre_empresa text, contacto text, categoria text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.username,
    p.role,
    p.nombre,
    p.telefono,
    p.email,
    p.direccion,
    p.rif,
    p.nombre_empresa,
    p.contacto,
    p.categoria
  FROM public.profiles p
  WHERE p.email = input_email 
    AND p.password_hash = crypt(input_password, p.password_hash);
END;
$$;