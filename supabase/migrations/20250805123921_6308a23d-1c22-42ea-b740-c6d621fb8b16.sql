
-- Agregar la columna password_hash a la tabla profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash text;

-- Actualizar el usuario admin con la contraseña hasheada
UPDATE public.profiles 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'admin';

-- Actualizar la función create_user_profile para usar password_hash
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
AS $$
DECLARE
  new_user_id uuid;
  new_profile_id uuid;
BEGIN
  -- Generate a unique user_id
  new_user_id := gen_random_uuid();
  
  -- Insert new profile with hashed password
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
    crypt(input_password, gen_salt('bf')),
    input_role,
    input_nombre,
    input_telefono,
    input_email,
    input_direccion,
    input_rif,
    input_nombre_empresa,
    input_contacto,
    input_categoria
  ) RETURNING id INTO new_profile_id;
  
  RETURN new_profile_id;
END;
$$;
