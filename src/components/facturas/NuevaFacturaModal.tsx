
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

interface NuevaFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (facturaData: any) => void;
}

const NuevaFacturaModal: React.FC<NuevaFacturaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    numeroFactura: '',
    monto: '',
    fecha: '',
    nombreEmpresa: '',
    descripcion: '',
    imagenes: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const facturaData = {
      ...formData,
      proveedor: user?.role === 'gerente_operativo' ? user?.nombreEmpresa : (user?.nombre || user?.username),
      rif: user?.rif || '',
      estado: 'pendiente',
      categoria: user?.categoria || 'General',
      vencimiento: new Date(new Date(formData.fecha).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
    };
    
    onSubmit(facturaData);
    setFormData({
      numeroFactura: '',
      monto: '',
      fecha: '',
      nombreEmpresa: '',
      descripcion: '',
      imagenes: []
    });
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        imagenes: Array.from(e.target.files)
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numeroFactura">Número de Factura *</Label>
              <Input
                id="numeroFactura"
                value={formData.numeroFactura}
                onChange={(e) => setFormData({...formData, numeroFactura: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="monto">Monto *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
              <Input
                id="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={(e) => setFormData({...formData, nombreEmpresa: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="imagenes">Imágenes de la Factura</Label>
            <Input
              id="imagenes"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.imagenes.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.imagenes.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Crear Factura</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevaFacturaModal;
