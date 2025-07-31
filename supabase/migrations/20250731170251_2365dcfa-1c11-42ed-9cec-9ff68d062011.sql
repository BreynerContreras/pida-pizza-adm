-- Crear políticas de storage para permitir subida de archivos

-- Política para bucket 'invoices' - permitir subida a usuarios autenticados
CREATE POLICY "Users can upload invoice images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Users can view invoice images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'invoices');

-- Política para bucket 'receipts' - permitir subida a usuarios autenticados
CREATE POLICY "Users can upload receipt images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Users can view receipt images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'receipts');