
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
import { User } from '../../types/auth';
import { supabase } from "@/integrations/supabase/client";

interface NuevoUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (usuario: Omit<User, 'id' | 'lastAccess'>) => void;
  role: 'contadora' | 'gerente_operativo' | 'admin';
}

const NuevoUsuarioModal: React.FC<NuevoUsuarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    rif: '',
    nombreEmpresa: '',
    contacto: '',
    categoria: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.nombre) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 12) {
      toast({
        title: "Error de validación",
        description: "La contraseña debe tener entre 6 y 12 caracteres.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('create_user_profile', {
        input_username: formData.username,
        input_password: formData.password,
        input_role: role,
        input_nombre: formData.nombre,
        input_telefono: formData.telefono,
        input_email: formData.email,
        input_direccion: formData.direccion,
        input_rif: formData.rif,
        input_nombre_empresa: formData.nombreEmpresa,
        input_contacto: formData.contacto,
        input_categoria: formData.categoria
      });

      if (error) {
        toast({
          title: "Error",
          description: "Error al crear el usuario: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Usuario creado",
        description: `${getRoleTitle()} creado exitosamente.`,
      });

      onSave({
        username: formData.username,
        password: formData.password,
        role: role,
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        rif: formData.rif
      });
    
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al crear el usuario.",
        variant: "destructive"
      });
    }
    
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      rif: '',
      nombreEmpresa: '',
      contacto: '',
      categoria: ''
    });
    
    onClose();
  };

  const getRoleTitle = () => {
    switch (role) {
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
          <DialogTitle>Nuevo {getRoleTitle()}</DialogTitle>
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
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                La contraseña debe tener entre 6 y 12 caracteres
              </p>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="confirmPassword">Verificar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ejemplo: breyner rafael contreras aguilar
              </p>
            </div>
            
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ejemplo: 0414-3878315
              </p>
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ejemplo: breynercontreras@gmail.com
              </p>
            </div>

            
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Crear {getRoleTitle()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoUsuarioModal;
