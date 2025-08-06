-- Corregir la función create_user_profile para usar la extensión pgcrypto correctamente
CREATE OR REPLACE FUNCTION public.create_user_profile(
  input_username text, 
  input_password text, 
  input_role text, 
  input_nombre text DEFAULT NULL::text, 
  input_telefono text DEFAULT NULL::text, 
  input_email text DEFAULT NULL::text, 
  input_direccion text DEFAULT NULL::text, 
  input_rif text DEFAULT NULL::text, 
  input_nombre_empresa text DEFAULT NULL::text, 
  input_contacto text DEFAULT NULL::text, 
  input_categoria text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate a unique user_id
  new_user_id := gen_random_uuid();
  
  -- Insert new profile with simple password (temporal)
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
    new_user_id,
    input_username,
    input_password, -- Temporal: contraseña en texto plano
    input_role,
    input_nombre,
    input_telefono,
    input_email,
    input_direccion,
    input_rif,
    input_nombre_empresa,
    input_contacto,
    input_categoria
  );
  
  RETURN new_user_id;
END;
$function$