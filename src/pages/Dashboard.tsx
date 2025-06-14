
import React from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentInvoices } from '../components/dashboard/RecentInvoices';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { 
  DollarSign, 
  FileText, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Ejecutivo</h1>
        <p className="text-gray-600">Resumen general del sistema de gestión de facturas</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Facturas"
          value="1,284"
          change="+12.5%"
          changeType="positive"
          icon={FileText}
          color="bg-blue-600"
        />
        <StatsCard
          title="Monto Total"
          value="B/. 234,567"
          change="+8.3%"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatsCard
          title="Proveedores Activos"
          value="68"
          change="+3"
          changeType="positive"
          icon={Building2}
          color="bg-purple-600"
        />
        <StatsCard
          title="Promedio Procesamiento"
          value="3.2 días"
          change="-0.8 días"
          changeType="positive"
          icon={TrendingUp}
          color="bg-orange-600"
        />
      </div>

      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">15 facturas vencen hoy</p>
                <p className="text-xs text-red-600">Requieren atención inmediata</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">8 facturas por vencer</p>
                <p className="text-xs text-yellow-600">En los próximos 3 días</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">3 nuevos proveedores</p>
                <p className="text-xs text-blue-600">Pendientes de validación</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Proveedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { nombre: "Distribuidora La Rosa", monto: "B/. 45,230", facturas: 23 },
              { nombre: "Carnes Premium S.A.", monto: "B/. 38,750", facturas: 18 },
              { nombre: "Lácteos del Valle", monto: "B/. 32,100", facturas: 15 },
              { nombre: "Vegetales Frescos", monto: "B/. 28,460", facturas: 12 },
              { nombre: "Panadería Central", monto: "B/. 25,890", facturas: 19 }
            ].map((proveedor, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{proveedor.nombre}</p>
                  <p className="text-xs text-gray-500">{proveedor.facturas} facturas</p>
                </div>
                <p className="font-semibold text-gray-900">{proveedor.monto}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico y facturas recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <RecentInvoices />
      </div>
    </div>
  );
};

export default Dashboard;
