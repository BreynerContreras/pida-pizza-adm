-- Create the profiles table if it doesn't exist with all necessary fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('contadora', 'gerente_operativo', 'admin')),
  nombre text,
  telefono text,
  email text,
  direccion text,
  rif text,
  nombre_empresa text,
  contacto text,
  categoria text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Allow all users to read profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all users to create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all users to update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to authenticate users
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

-- Create function to create new user with hashed password
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

-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;