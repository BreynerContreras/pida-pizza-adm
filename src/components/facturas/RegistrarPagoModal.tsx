import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegistrarPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  facturaId: string;
  onPagoRegistrado: () => void;
}

const RegistrarPagoModal: React.FC<RegistrarPagoModalProps> = ({ 
  isOpen, 
  onClose, 
  facturaId, 
  onPagoRegistrado 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fechaPago: '',
    montoPagado: '',
    descripcionPago: '',
    comprobante: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.fechaPago || !formData.montoPagado || !formData.comprobante) {
      toast({
        title: "Error de validación",
        description: "Día de pago, monto pagado y foto del comprobante son obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Subir comprobante a Supabase Storage
      let comprobanteUrl = '';
      if (formData.comprobante) {
        const nombreArchivo = `comprobante_${Date.now()}_${formData.comprobante.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(nombreArchivo, formData.comprobante);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('receipts')
          .getPublicUrl(nombreArchivo);
        
        comprobanteUrl = publicUrl;
      }

      // Registrar pago en la base de datos
      const { data, error } = await supabase
        .from('payments')
        .insert({
          invoice_id: facturaId,
          fecha_pago: formData.fechaPago,
          monto_pagado: parseFloat(formData.montoPagado),
          descripcion_pago: formData.descripcionPago || null,
          comprobante_url: comprobanteUrl,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Pago registrado",
        description: "El pago ha sido registrado exitosamente.",
      });

      // Limpiar formulario
      setFormData({
        fechaPago: '',
        montoPagado: '',
        descripcionPago: '',
        comprobante: null
      });
      
      onPagoRegistrado();
      onClose();
    } catch (error) {
      console.error('Error al registrar pago:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el pago. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        comprobante: e.target.files[0]
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Pago de Factura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaPago">Día que fue pagada *</Label>
              <Input
                id="fechaPago"
                type="date"
                value={formData.fechaPago}
                onChange={(e) => setFormData({...formData, fechaPago: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="montoPagado">Monto pagado *</Label>
              <Input
                id="montoPagado"
                type="number"
                step="0.01"
                value={formData.montoPagado}
                onChange={(e) => setFormData({...formData, montoPagado: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="descripcionPago">Descripción del pago (Opcional)</Label>
            <Textarea
              id="descripcionPago"
              value={formData.descripcionPago}
              onChange={(e) => setFormData({...formData, descripcionPago: e.target.value})}
              rows={3}
              placeholder="Observaciones o aclaraciones sobre el pago..."
            />
          </div>
          
          <div>
            <Label htmlFor="comprobante">Foto del comprobante de pago *</Label>
            <Input
              id="comprobante"
              type="file"
              accept="image/*"
              onChange={handleComprobanteChange}
              className="cursor-pointer"
              required
            />
            {formData.comprobante && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Comprobante seleccionado: {formData.comprobante.name}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Requerido: Debe subir la foto del comprobante para respaldo
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar Pago'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrarPagoModal;