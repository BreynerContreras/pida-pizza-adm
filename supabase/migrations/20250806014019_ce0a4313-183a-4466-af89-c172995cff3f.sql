-- Corregir la función authenticate_user para usar user_id en lugar de id
CREATE OR REPLACE FUNCTION public.authenticate_user(input_email text, input_password text)
 RETURNS TABLE(id uuid, user_id uuid, username text, role text, nombre text, telefono text, email text, direccion text, rif text, nombre_empresa text, contacto text, categoria text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id as id,
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
$function$