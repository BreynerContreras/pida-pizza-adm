-- Fix security issues by setting search_path for functions

-- Update the update_updated_at_column function with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the authenticate_user function with proper security
CREATE OR REPLACE FUNCTION public.authenticate_user(
  input_username text,
  input_password text
)
RETURNS TABLE (
  id uuid,
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
SET search_path = ''
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
  WHERE p.username = input_username 
    AND p.password_hash = crypt(input_password, p.password_hash);
END;
$$;

-- Update the create_user_profile function with proper security
CREATE OR REPLACE FUNCTION public.create_user_profile(
  input_username text,
  input_password text,
  input_role text,
  input_nombre text DEFAULT NULL,
  input_telefono text DEFAULT NULL,
  input_email text DEFAULT NULL,
  input_direccion text DEFAULT NULL,
  input_rif text DEFAULT NULL,
  input_nombre_empresa text DEFAULT NULL,
  input_contacto text DEFAULT NULL,
  input_categoria text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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