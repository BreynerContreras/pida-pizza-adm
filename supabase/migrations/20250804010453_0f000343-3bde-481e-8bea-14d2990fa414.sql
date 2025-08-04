-- Actualizar la función authenticate_user para usar password_hash correctamente
CREATE OR REPLACE FUNCTION public.authenticate_user(
  input_username text,
  input_password text
)
RETURNS TABLE (
  user_id uuid,
  username text,
  role text,
  nombre text,
  telefono text,
  email text,
  direccion text,
  rif text,
  nombre_empresa text,
  contacto text,
  categoria text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
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
  WHERE p.username = input_username 
    AND p.password_hash = crypt(input_password, p.password_hash);
END;
$$;