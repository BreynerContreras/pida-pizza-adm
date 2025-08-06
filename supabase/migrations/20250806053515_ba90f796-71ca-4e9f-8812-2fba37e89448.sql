-- Crear tabla para descripción detallada de facturas
CREATE TABLE public.descripcion_de_las_facturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL,
  fila INTEGER NOT NULL,
  cantidad NUMERIC,
  descripcion_concepto TEXT,
  precio_unitario NUMERIC,
  monto NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.descripcion_de_las_facturas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all users to view descripcion_de_las_facturas" 
ON public.descripcion_de_las_facturas 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all users to create descripcion_de_las_facturas" 
ON public.descripcion_de_las_facturas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all users to update descripcion_de_las_facturas" 
ON public.descripcion_de_las_facturas 
FOR UPDATE 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_descripcion_de_las_facturas_updated_at
BEFORE UPDATE ON public.descripcion_de_las_facturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();