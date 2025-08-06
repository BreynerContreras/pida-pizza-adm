-- Actualizar el usuario admin para que tenga contraseña en texto plano temporalmente
UPDATE public.profiles 
SET password_hash = '12345678' 
WHERE email = 'admin@empresa.com';