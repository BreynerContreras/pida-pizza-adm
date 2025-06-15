
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FacturaData {
  id: string;
  proveedor: string;
  rif: string;
  monto: string;
  fecha: string;
  vencimiento: string;
  estado: string;
  categoria: string;
  descripcion: string;
}

interface EditarFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: FacturaData | null;
  onSave: (facturaEditada: FacturaData) => void;
}

const EditarFacturaModal: React.FC<EditarFacturaModalProps> = ({
  isOpen,
  onClose,
  factura,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FacturaData>({
    id: '',
    proveedor: '',
    rif: '',
    monto: '',
    fecha: '',
    vencimiento: '',
    estado: '',
    categoria: '',
    descripcion: ''
  });

  useEffect(() => {
    if (factura) {
      // Convertir el monto de "B/. 2,450.00" a "2450.00"
      const montoNumerico = factura.monto.replace('B/. ', '').replace(',', '');
      // Convertir fechas al formato YYYY-MM-DD para el input date
      const fechaISO = factura.fecha.split('/').reverse().join('-');
      const vencimientoISO = factura.vencimiento.split('/').reverse().join('-');
      
      setFormData({
        ...factura,
        monto: montoNumerico,
        fecha: fechaISO,
        vencimiento: vencimientoISO
      });
    }
  }, [factura]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.proveedor || !formData.monto || !formData.fecha || !formData.vencimiento) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    // Formatear los datos antes de guardar
    const facturaEditada = {
      ...formData,
      monto: `B/. ${parseFloat(formData.monto).toLocaleString()}`,
      fecha: new Date(formData.fecha).toLocaleDateString('es-ES'),
      vencimiento: new Date(formData.vencimiento).toLocaleDateString('es-ES')
    };

    onSave(facturaEditada);
    toast({
      title: "Factura actualizada",
      description: "La factura ha sido actualizada exitosamente.",
    });
    onClose();
  };

  const categorias = [
    "Carnes y Embutidos",
    "Lácteos",
    "Vegetales",
    "Harinas y Panadería",
    "Bebidas",
    "Condimentos y Especias"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Factura {factura?.id}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proveedor">Gerente Operativo *</Label>
              <Input
                id="proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="rif">RIF *</Label>
              <Input
                id="rif"
                value={formData.rif}
                onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="monto">Monto (B/.) *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fecha">Fecha de Emisión *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="vencimiento">Fecha de Vencimiento *</Label>
              <Input
                id="vencimiento"
                type="date"
                value={formData.vencimiento}
                onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="revision">En Revisión</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción del servicio o productos..."
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditarFacturaModal;
