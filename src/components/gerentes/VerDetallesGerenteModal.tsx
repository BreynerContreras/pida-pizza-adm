
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';

interface GerenteDetalle {
  id: number;
  nombre: string;
  rif: string;
  email: string;
  telefono: string;
  direccion: string;
  categoria: string;
  estado: string;
  facturas: number;
  montoTotal: string;
  fechaRegistro: string;
  contacto: string;
  rating: number;
}

interface VerDetallesGerenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  gerente: GerenteDetalle | null;
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'activo': return 'bg-green-100 text-green-800 border-green-200';
    case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRatingStars = (rating: number) => {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

const VerDetallesGerenteModal: React.FC<VerDetallesGerenteModalProps> = ({
  isOpen,
  onClose,
  gerente
}) => {
  if (!gerente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Detalles del Gerente Operativo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Encabezado con nombre y estado */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{gerente.nombre}</h3>
                <p className="text-sm text-gray-600">{gerente.rif}</p>
                <p className="text-sm text-blue-600 font-medium">{gerente.categoria}</p>
              </div>
            </div>
            <Badge className={getStatusColor(gerente.estado)} variant="outline">
              {gerente.estado.charAt(0).toUpperCase() + gerente.estado.slice(1)}
            </Badge>
          </div>

          {/* Métricas de rendimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{gerente.facturas}</p>
              <p className="text-sm text-gray-600">Facturas Totales</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-600">{gerente.montoTotal}</p>
              <p className="text-sm text-gray-600">Volumen Total</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{gerente.rating}</p>
              <p className="text-sm text-gray-600">Calificación</p>
              <p className="text-xs text-gray-500">{getRatingStars(gerente.rating)}</p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Información de Contacto</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Teléfono</p>
                  <p className="text-gray-900">{gerente.telefono}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Correo Electrónico</p>
                  <p className="text-gray-900">{gerente.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Dirección</p>
                  <p className="text-gray-900">{gerente.direccion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Persona de contacto */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Información Adicional</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Persona de Contacto</p>
                <p className="text-gray-900">{gerente.contacto}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Registro</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{gerente.fechaRegistro}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial reciente (simulado) */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Actividad Reciente</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Factura pagada</p>
                    <p className="text-xs text-gray-600">Hace 2 días</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">+B/. 1,250.00</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Nueva factura enviada</p>
                    <p className="text-xs text-gray-600">Hace 5 días</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600">B/. 890.00</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Factura en revisión</p>
                    <p className="text-xs text-gray-600">Hace 1 semana</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-yellow-600">B/. 2,100.00</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerDetallesGerenteModal;
