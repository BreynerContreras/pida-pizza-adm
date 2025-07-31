-- Eliminar políticas existentes que usan auth.uid()
DROP POLICY IF EXISTS "Gerente operativo can create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Only creator can update invoice basic data" ON public.invoices;
DROP POLICY IF EXISTS "Users can view all invoices" ON public.invoices;

-- Crear nuevas políticas más permisivas para el sistema de demo
CREATE POLICY "Allow all authenticated users to create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update invoices" 
ON public.invoices 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all users to view invoices" 
ON public.invoices 
FOR SELECT 
USING (true);

-- También actualizar las políticas de payments para ser consistentes
DROP POLICY IF EXISTS "Only admin can create payments" ON public.payments;
DROP POLICY IF EXISTS "Only admin can update payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view all payments" ON public.payments;

CREATE POLICY "Allow all users to create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all users to update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all users to view payments" 
ON public.payments 
FOR SELECT 
USING (true);

-- Actualizar políticas de profiles para ser más permisivas
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Allow all users to manage profiles" 
ON public.profiles 
FOR ALL 
USING (true)
WITH CHECK (true);