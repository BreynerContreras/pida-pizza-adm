
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
import { useInvoiceStats } from '../hooks/useInvoiceStats';

const Dashboard = () => {
  const navigate = useNavigate();
  const { facturas_vencen_hoy, facturas_por_vencer } = useNotifications();
  const { 
    totalMontoMensual, 
    montoAprobadas, 
    montoPendientes,
    totalPendientesMesPasado,
    porcentajeAprobadas, 
    porcentajePendientes,
    loading 
  } = useInvoiceStats();

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

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl">
        <StatsCard
          title="Total Facturas Mensual"
          value={loading ? "Cargando..." : `Bs. ${totalMontoMensual.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
          change="+12.5%"
          changeType="positive"
          icon={FileText}
          color="bg-blue-600"
        />
        
        <StatsCard
          title="Pendientes Mes Pasado"
          value={loading ? "Cargando..." : `Bs. ${totalPendientesMesPasado.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
          change="-8.2%"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-orange-600"
        />
      </div>

      {/* Métricas de estado */}
      <div className="grid grid-cols-1 gap-6">
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
              <span className="font-semibold">
                {loading ? "Cargando..." : `Bs. ${montoAprobadas.toLocaleString('es-VE', { minimumFractionDigits: 2 })} (${porcentajeAprobadas}%)`}
              </span>
            </div>
            <Progress value={porcentajeAprobadas} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold">
                {loading ? "Cargando..." : `Bs. ${montoPendientes.toLocaleString('es-VE', { minimumFractionDigits: 2 })} (${porcentajePendientes}%)`}
              </span>
            </div>
            <Progress value={porcentajePendientes} className="h-2" />
            
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
