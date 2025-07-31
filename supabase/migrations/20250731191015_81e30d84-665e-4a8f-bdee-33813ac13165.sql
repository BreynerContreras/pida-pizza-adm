-- Eliminar la restricción existente que está causando el error
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_estado_check;

-- Crear una nueva restricción que permita solo 'pendiente' y 'aprobado'
ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_estado_check 
CHECK (estado IN ('pendiente', 'aprobado'));