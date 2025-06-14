
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Building2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const facturas = [
  {
    id: "FAC-2024-001",
    proveedor: "Distribuidora La Rosa",
    rif: "J-12345678-9",
    monto: "B/. 2,450.00",
    fecha: "15/06/2024",
    vencimiento: "30/06/2024",
    estado: "pendiente",
    categoria: "Carnes y Embutidos",
    descripcion: "Suministro de carnes frescas para restaurantes"
  },
  {
    id: "FAC-2024-002",
    proveedor: "Carnes Premium S.A.",
    rif: "J-98765432-1",
    monto: "B/. 1,890.50",
    fecha: "14/06/2024",
    vencimiento: "29/06/2024",
    estado: "aprobado",
    categoria: "Carnes y Embutidos",
    descripcion: "Cortes premium para menú especial"
  },
  {
    id: "FAC-2024-003",
    proveedor: "Lácteos del Valle",
    rif: "J-11223344-5",
    monto: "B/. 875.25",
    fecha: "13/06/2024",
    vencimiento: "28/06/2024",
    estado: "revision",
    categoria: "Lácteos",
    descripcion: "Quesos mozzarella y parmesano"
  },
  {
    id: "FAC-2024-004",
    proveedor: "Vegetales Frescos",
    rif: "J-55667788-9",
    monto: "B/. 645.80",
    fecha: "12/06/2024",
    vencimiento: "27/06/2024",
    estado: "pagado",
    categoria: "Vegetales",
    descripcion: "Vegetales orgánicos variados"
  },
  {
    id: "FAC-2024-005",
    proveedor: "Panadería Central",
    rif: "J-99887766-5",
    monto: "B/. 1,250.00",
    fecha: "11/06/2024",
    vencimiento: "26/06/2024",
    estado: "pendiente",
    categoria: "Harinas y Panadería",
    descripción: "Masa para pizza y pan de ajo"
  }
];

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

const Facturas = () => {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const facturasFiltradas = facturas.filter(factura => {
    const matchEstado = filtroEstado === "todos" || factura.estado === filtroEstado;
    const matchBusqueda = busqueda === "" || 
      factura.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.rif.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchEstado && matchBusqueda;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Facturas</h1>
          <p className="text-gray-600">Administra y rastrea todas las facturas de proveedores</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por número, proveedor o RIF..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="revision">En Revisión</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Más Filtros
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-900">{facturas.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {facturas.filter(f => f.estado === 'pendiente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Revisión</p>
              <p className="text-2xl font-bold text-blue-600">
                {facturas.filter(f => f.estado === 'revision').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">
                {facturas.filter(f => f.estado === 'aprobado').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de facturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Facturas ({facturasFiltradas.length})</span>
            <div className="text-sm text-gray-500">
              Mostrando {facturasFiltradas.length} de {facturas.length} facturas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facturasFiltradas.map((factura) => (
              <div key={factura.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{factura.id}</h3>
                    <Badge className={getStatusColor(factura.estado)} variant="outline">
                      {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Proveedor</span>
                    </div>
                    <p className="font-semibold text-gray-900">{factura.proveedor}</p>
                    <p className="text-sm text-gray-600">{factura.rif}</p>
                    <p className="text-sm text-gray-500 mt-1">{factura.categoria}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Fechas</span>
                    </div>
                    <p className="text-sm text-gray-900">Emisión: {factura.fecha}</p>
                    <p className="text-sm text-gray-900">Vencimiento: {factura.vencimiento}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Monto</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{factura.monto}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descripción:</span> {factura.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {facturasFiltradas.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros o crear una nueva factura.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Facturas;
