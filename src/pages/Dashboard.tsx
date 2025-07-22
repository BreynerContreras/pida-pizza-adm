
import React from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentInvoices } from '../components/dashboard/RecentInvoices';
import { 
  FileText, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const Dashboard = () => {
  const navigate = useNavigate();
  const { facturas_vencen_hoy, facturas_por_vencer } = useNotifications();

  const navegarAFacturasVencenHoy = () => {
    navigate('/facturas?filtro=vencen_hoy');
  };

  const navegarAFacturasPorVencer = () => {
    navigate('/facturas?filtro=por_vencer');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inicio</h1>
        <p className="text-gray-600">Resumen general del sistema de gestión de facturas</p>
      </div>

      {/* Tarjeta de estadística principal */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-md">
        <StatsCard
          title="Total Facturas"
          value="1,284"
          change="+12.5%"
          changeType="positive"
          icon={FileText}
          color="bg-blue-600"
        />
      </div>

      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Estado de Facturas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <span className="font-semibold">456 (67%)</span>
            </div>
            <Progress value={67} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold">178 (26%)</span>
            </div>
            <Progress value={26} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En Revisión</span>
              <span className="font-semibold">45 (7%)</span>
            </div>
            <Progress value={7} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {facturas_vencen_hoy > 0 && (
              <div 
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                onClick={navegarAFacturasVencenHoy}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    {facturas_vencen_hoy} factura{facturas_vencen_hoy > 1 ? 's' : ''} vence{facturas_vencen_hoy > 1 ? 'n' : ''} hoy
                  </p>
                  <p className="text-xs text-red-600">Requieren atención inmediata - Click para ver</p>
                </div>
              </div>
            )}
            
            {facturas_por_vencer > 0 && (
              <div 
                className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={navegarAFacturasPorVencer}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    {facturas_por_vencer} factura{facturas_por_vencer > 1 ? 's' : ''} por vencer
                  </p>
                  <p className="text-xs text-yellow-600">En los próximos 3 días - Click para ver</p>
                </div>
              </div>
            )}

            {facturas_vencen_hoy === 0 && facturas_por_vencer === 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">No hay facturas por vencer</p>
                  <p className="text-xs text-green-600">Todas las facturas están al día</p>
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>

      {/* Facturas recientes */}
      <div className="grid grid-cols-1 gap-6">
        <RecentInvoices />
      </div>
    </div>
  );
};

export default Dashboard;
