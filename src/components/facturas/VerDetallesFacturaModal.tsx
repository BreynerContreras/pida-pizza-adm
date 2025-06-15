
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign,
  Tag,
  ClipboardList,
  Mail,
  Phone
} from 'lucide-react';

interface FacturaDetalle {
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

interface VerDetallesFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: FacturaDetalle | null;
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'aprobado': return 'bg-green-100 text-green-800 border-green-200';
    case 'revision': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pagado': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const VerDetallesFacturaModal: React.FC<VerDetallesFacturaModalProps> = ({
  isOpen,
  onClose,
  factura
}) => {
  if (!factura) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalles de Factura
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Encabezado con ID y Estado */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{factura.id}</h3>
              <p className="text-sm text-gray-600">Número de Factura</p>
            </div>
            <Badge className={getStatusColor(factura.estado)} variant="outline">
              {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
            </Badge>
          </div>

          {/* Información del Gerente Operativo */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Gerente Operativo</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Nombre</p>
                <p className="text-gray-900">{factura.proveedor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">RIF</p>
                <p className="text-gray-900">{factura.rif}</p>
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Información Financiera</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-green-700">{factura.monto}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Categoría</p>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{factura.categoria}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Fechas Importantes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Emisión</p>
                <p className="text-gray-900">{factura.fecha}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Vencimiento</p>
                <p className="text-gray-900">{factura.vencimiento}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Descripción del Servicio</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{factura.descripcion}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerDetallesFacturaModal;
