
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Phone,
  User,
  CreditCard,
  History,
  Image
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FacturaDetalle {
  id: string;
  numero_factura: string;
  proveedor: string;
  rif?: string;
  monto: string;
  fecha: string;
  limite_pago: string;
  estado: string;
  categoria?: string;
  descripcion: string;
  nombre_empresa: string;
  created_by?: string;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface CreadorInfo {
  nombre: string;
  role: string;
  username: string;
}

interface Pago {
  id: string;
  monto_pagado: number;
  fecha_pago: string;
  descripcion_pago?: string;
  comprobante_url: string;
  created_by: string;
  creador?: CreadorInfo;
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
  const [creadorInfo, setCreadorInfo] = useState<CreadorInfo | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (factura && isOpen) {
      cargarDatosAdicionales();
    }
  }, [factura, isOpen]);

  const cargarDatosAdicionales = async () => {
    if (!factura) return;
    
    setLoading(true);
    try {
      // Cargar información del creador de la factura
      if (factura.created_by) {
        const { data: creador } = await supabase
          .from('profiles')
          .select('nombre, role, username')
          .eq('user_id', factura.created_by)
          .single();
        
        if (creador) {
          setCreadorInfo(creador);
        }
      }

      // Cargar pagos de la factura con información de quién los creó
      const { data: pagosData } = await supabase
        .from('payments')
        .select(`
          id,
          monto_pagado,
          fecha_pago,
          descripcion_pago,
          comprobante_url,
          created_by
        `)
        .eq('invoice_id', factura.id);

      if (pagosData) {
        // Cargar información de los creadores de cada pago
        const pagosConCreador = await Promise.all(
          pagosData.map(async (pago) => {
            const { data: creadorPago } = await supabase
              .from('profiles')
              .select('nombre, role, username')
              .eq('user_id', pago.created_by)
              .single();
            
            return {
              ...pago,
              creador: creadorPago || undefined
            };
          })
        );
        
        setPagos(pagosConCreador);
      }
    } catch (error) {
      console.error('Error cargando datos adicionales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!factura) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalles de Factura
          </DialogTitle>
          <DialogDescription>
            Información completa de la factura seleccionada
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Encabezado con ID y Estado */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{factura.numero_factura}</h3>
              <p className="text-sm text-gray-600">Número de Factura</p>
            </div>
            <Badge className={getStatusColor(factura.estado)} variant="outline">
              {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
            </Badge>
          </div>

          {/* Información del Proveedor */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Información del Proveedor</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Proveedor</p>
                <p className="text-gray-900">{factura.proveedor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Empresa</p>
                <p className="text-gray-900">{factura.nombre_empresa}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">RIF</p>
                <p className="text-gray-900">{factura.rif || 'No especificado'}</p>
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
                <p className="text-2xl font-bold text-green-700">
                  {typeof factura.monto === 'string' ? factura.monto : `B/. ${Number(factura.monto).toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Categoría</p>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{factura.categoria || 'No especificada'}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Emisión</p>
                <p className="text-gray-900">{new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Límite de Pago</p>
                <p className="text-gray-900">{new Date(factura.limite_pago).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Creación</p>
                <p className="text-gray-900">
                  {factura.created_at ? new Date(factura.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                <p className="text-gray-900">
                  {factura.updated_at ? new Date(factura.updated_at).toLocaleDateString('es-ES') : 'No disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Creador de la Factura */}
          {creadorInfo && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Creado por</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nombre</p>
                  <p className="text-gray-900">{creadorInfo.nombre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuario</p>
                  <p className="text-gray-900">{creadorInfo.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rol</p>
                  <Badge variant="outline" className="w-fit">
                    {creadorInfo.role === 'admin' ? 'Administrador' : 
                     creadorInfo.role === 'contadora' ? 'Contadora' : 
                     'Gerente Operativo'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Pagos Registrados por el Administrador */}
          {pagos.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-900">Pagos Registrados</h4>
              </div>
              <div className="space-y-3">
                {pagos.map((pago) => (
                  <div key={pago.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monto Pagado</p>
                        <p className="text-lg font-semibold text-emerald-700">
                          B/. {pago.monto_pagado.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Fecha de Pago</p>
                        <p className="text-gray-900">{new Date(pago.fecha_pago).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Registrado por</p>
                        <p className="text-gray-900">
                          {pago.creador?.nombre || 'Usuario no encontrado'}
                        </p>
                        {pago.creador && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {pago.creador.role === 'admin' ? 'Admin' : 
                             pago.creador.role === 'contadora' ? 'Contadora' : 
                             'Gerente'}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Comprobante</p>
                        {pago.comprobante_url ? (
                          <a 
                            href={pago.comprobante_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Ver comprobante
                          </a>
                        ) : (
                          <p className="text-gray-500 text-sm">Sin comprobante</p>
                        )}
                      </div>
                    </div>
                    {pago.descripcion_pago && (
                      <div className="mt-2 pt-2 border-t border-emerald-200">
                        <p className="text-sm font-medium text-gray-600">Descripción</p>
                        <p className="text-gray-700 text-sm">{pago.descripcion_pago}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial de Actividad */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Historial de Actividad</h4>
            </div>
            <div className="space-y-2">
              {creadorInfo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Factura creada por {creadorInfo.nombre || creadorInfo.username}</span>
                </div>
              )}
              {pagos.map((pago) => (
                <div key={`history-${pago.id}`} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    Pago de B/. {pago.monto_pagado.toLocaleString()} registrado por {pago.creador?.nombre || 'Usuario'}
                    {' '}el {new Date(pago.fecha_pago).toLocaleDateString('es-ES')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen de la Factura */}
          {factura.imagen_url && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Imagen de la Factura</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <img 
                  src={factura.imagen_url} 
                  alt="Imagen de la factura" 
                  className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => window.open(factura.imagen_url, '_blank')}
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Haz clic en la imagen para verla en tamaño completo
                </p>
              </div>
            </div>
          )}

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
