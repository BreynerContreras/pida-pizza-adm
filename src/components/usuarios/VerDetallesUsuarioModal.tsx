
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Building2,
  Calendar,
  Shield,
  Calculator
} from 'lucide-react';
import { User as UserType } from '../../types/auth';

interface VerDetallesUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: UserType | null;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'contadora': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'gerente_operativo': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'contadora': return Calculator;
    case 'gerente_operativo': return Building2;
    default: return User;
  }
};

const getRoleTitle = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'contadora': return 'Contador/a';
    case 'gerente_operativo': return 'Gerente Operativo';
    default: return role;
  }
};

const VerDetallesUsuarioModal: React.FC<VerDetallesUsuarioModalProps> = ({
  isOpen,
  onClose,
  usuario
}) => {
  if (!usuario) return null;

  const RoleIcon = getRoleIcon(usuario.role);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detalles del Usuario
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Encabezado con nombre y rol */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <RoleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{usuario.nombre || usuario.username}</h3>
                <p className="text-sm text-gray-600">@{usuario.username}</p>
                {usuario.role === 'gerente_operativo' && usuario.nombreEmpresa && (
                  <p className="text-sm text-blue-600 font-medium">{usuario.nombreEmpresa}</p>
                )}
              </div>
            </div>
            <Badge className={getRoleColor(usuario.role)} variant="outline">
              {getRoleTitle(usuario.role)}
            </Badge>
          </div>

          {/* Información de contacto */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Información de Contacto</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usuario.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teléfono</p>
                    <p className="text-gray-900">{usuario.telefono}</p>
                  </div>
                </div>
              )}
              
              {usuario.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Correo Electrónico</p>
                    <p className="text-gray-900">{usuario.email}</p>
                  </div>
                </div>
              )}
              
              {usuario.direccion && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dirección</p>
                    <p className="text-gray-900">{usuario.direccion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información específica del gerente operativo */}
          {usuario.role === 'gerente_operativo' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Información de la Empresa</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usuario.contacto && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Persona de Contacto</p>
                    <p className="text-gray-900">{usuario.contacto}</p>
                  </div>
                )}
                
                {usuario.rif && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">RIF</p>
                    <p className="text-gray-900">{usuario.rif}</p>
                  </div>
                )}
                
                {usuario.categoria && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categoría</p>
                    <p className="text-gray-900">{usuario.categoria}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información del sistema */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Información del Sistema</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">ID de Usuario</p>
                <p className="text-gray-900 font-mono text-sm">{usuario.id}</p>
              </div>
              
              {usuario.lastAccess && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Último Acceso</p>
                  <p className="text-gray-900">
                    {new Date(usuario.lastAccess).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerDetallesUsuarioModal;
