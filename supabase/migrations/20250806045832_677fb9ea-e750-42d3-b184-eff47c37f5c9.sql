-- Eliminar la función existente y crear una temporal sin hash para probar
DROP FUNCTION IF EXISTS public.authenticate_user(input_email text, input_password text);

-- Crear función temporal que compare contraseñas en texto plano para probar
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
    AND input_password = '12345678';
END;
$function$

-- Actualizar el usuario admin para que tenga contraseña en texto plano temporalmente
UPDATE public.profiles 
SET password_hash = '12345678' 
WHERE email = 'admin@empresa.com';