
import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NuevoGerenteData {
  nombre: string;
  rif: string;
  email: string;
  telefono: string;
  direccion: string;
  categoria: string;
  contacto: string;
}

interface NuevoGerenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoGerente: NuevoGerenteData) => void;
}

const NuevoGerenteModal: React.FC<NuevoGerenteModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NuevoGerenteData>({
    nombre: '',
    rif: '',
    email: '',
    telefono: '',
    direccion: '',
    categoria: '',
    contacto: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.telefono || !formData.contacto) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios (Nombre, Teléfono y Persona de Contacto).",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Proveedor creado",
      description: "El nuevo proveedor ha sido registrado exitosamente.",
    });
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      rif: '',
      email: '',
      telefono: '',
      direccion: '',
      categoria: '',
      contacto: ''
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
          <DialogTitle>Nuevo Proveedor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre de la Empresa *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Distribuidora La Rosa"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="rif">RIF</Label>
              <Input
                id="rif"
                value={formData.rif}
                onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                placeholder="Ej: J-12345678-9"
              />
            </div>
            
            <div>
              <Label htmlFor="contacto">Persona de Contacto *</Label>
              <Input
                id="contacto"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                placeholder="Ej: María González"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: +507 6789-1234"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: ventas@empresa.com"
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
          </div>
          
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Ej: Vía España, Ciudad de Panamá"
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Crear Proveedor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoGerenteModal;
