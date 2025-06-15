
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from '../../types/auth';

interface EditarUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: User | null;
  onSave: (usuarioEditado: User) => void;
}

const EditarUsuarioModal: React.FC<EditarUsuarioModalProps> = ({
  isOpen,
  onClose,
  usuario,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User>({
    id: '',
    username: '',
    password: '',
    role: 'gerente_operativo',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    rif: '',
    nombreEmpresa: '',
    contacto: '',
    categoria: ''
  });

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.nombre) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Usuario actualizado",
      description: "La información del usuario ha sido actualizada exitosamente.",
    });
    onClose();
  };

  const getRoleTitle = () => {
    switch (formData.role) {
      case 'contadora': return 'Contador/a';
      case 'gerente_operativo': return 'Gerente Operativo';
      case 'admin': return 'Administrador';
    }
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
          <DialogTitle>Editar {getRoleTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Nombre de Usuario *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Dejar en blanco para mantener la actual"
              />
            </div>
            
            <div>
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {formData.role === 'gerente_operativo' && (
              <>
                <div>
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                  <Input
                    id="nombreEmpresa"
                    value={formData.nombreEmpresa || ''}
                    onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contacto">Persona de Contacto</Label>
                  <Input
                    id="contacto"
                    value={formData.contacto || ''}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={formData.categoria || ''} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
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
                  <Label htmlFor="rif">RIF de la Empresa</Label>
                  <Input
                    id="rif"
                    value={formData.rif || ''}
                    onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          
          <div>
            <Label htmlFor="direccion">
              {formData.role === 'gerente_operativo' ? 'Dirección de la Empresa' : 'Dirección'}
            </Label>
            <Input
              id="direccion"
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
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

export default EditarUsuarioModal;
