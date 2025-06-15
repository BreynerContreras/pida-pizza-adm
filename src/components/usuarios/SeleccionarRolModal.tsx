
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  Calculator,
  Shield
} from 'lucide-react';

interface SeleccionarRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: 'contadora' | 'gerente_operativo' | 'admin') => void;
}

const SeleccionarRolModal: React.FC<SeleccionarRolModalProps> = ({
  isOpen,
  onClose,
  onRoleSelected
}) => {
  const roles = [
    {
      key: 'contadora' as const,
      title: 'Contador/a',
      description: 'Gestiona facturas y reportes financieros',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      key: 'gerente_operativo' as const,
      title: 'Gerente Operativo',
      description: 'Empresa proveedora que envía facturas',
      icon: Building2,
      color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
      key: 'admin' as const,
      title: 'Administrador',
      description: 'Control total del sistema',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Seleccionar Tipo de Usuario
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Selecciona el tipo de usuario que deseas crear:
          </p>
          
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Button
                key={role.key}
                variant="outline"
                className={`w-full h-auto p-4 flex items-start gap-3 hover:${role.color} transition-colors`}
                onClick={() => onRoleSelected(role.key)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-gray-900">{role.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeleccionarRolModal;
