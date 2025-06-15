import React, { useState, useEffect } from 'react';
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
  Building2,
  FileText,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '../contexts/AuthContext';
import NuevaFacturaModal from '../components/facturas/NuevaFacturaModal';
import FiltrosAvanzados from '../components/facturas/FiltrosAvanzados';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

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
    estado: "pendiente",
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [facturasList, setFacturasList] = useState(facturas);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [modalNuevaFactura, setModalNuevaFactura] = useState(false);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({});

  useEffect(() => {
    const savedFacturas = localStorage.getItem('facturas');
    if (savedFacturas) {
      setFacturasList(JSON.parse(savedFacturas));
    }
  }, []);

  const guardarFacturas = (nuevasFacturas: any[]) => {
    setFacturasList(nuevasFacturas);
    localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
  };

  const cambiarEstadoFactura = (facturaId: string, nuevoEstado: string) => {
    const nuevasFacturas = facturasList.map(factura => {
      if (factura.id === facturaId) {
        return { ...factura, estado: nuevoEstado };
      }
      return factura;
    });
    
    guardarFacturas(nuevasFacturas);
    
    // Si el estado cambia a "pagado", guardar también en facturas pagadas
    if (nuevoEstado === 'pagado') {
      const facturasPagadas = JSON.parse(localStorage.getItem('facturasPagadas') || '[]');
      const facturaPagada = nuevasFacturas.find(f => f.id === facturaId);
      if (facturaPagada) {
        facturasPagadas.push(facturaPagada);
        localStorage.setItem('facturasPagadas', JSON.stringify(facturasPagadas));
      }
      
      toast({
        title: "Factura marcada como pagada",
        description: "La factura ha sido movida a la sección de Facturas Pagadas.",
      });
    }
  };

  const agregarFactura = (facturaData: any) => {
    const nuevaFactura = {
      id: `FAC-${new Date().getFullYear()}-${String(facturasList.length + 1).padStart(3, '0')}`,
      ...facturaData,
      monto: `B/. ${facturaData.monto}`,
      fecha: new Date(facturaData.fecha).toLocaleDateString('es-ES')
    };
    
    const nuevasFacturas = [...facturasList, nuevaFactura];
    guardarFacturas(nuevasFacturas);
  };

  const eliminarFactura = (facturaId: string) => {
    const nuevasFacturas = facturasList.filter(f => f.id !== facturaId);
    guardarFacturas(nuevasFacturas);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Facturas - Pida Pizza', 20, 20);
    
    let yPosition = 40;
    facturasFiltradas.forEach((factura, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${factura.id} - ${factura.proveedor}`, 20, yPosition);
      doc.text(`Monto: ${factura.monto}`, 20, yPosition + 10);
      doc.text(`Fecha: ${factura.fecha}`, 20, yPosition + 20);
      doc.text(`Estado: ${factura.estado}`, 20, yPosition + 30);
      
      yPosition += 50;
    });
    
    doc.save('facturas-reporte.pdf');
  };

  const aplicarFiltrosAvanzados = (filtros: any) => {
    setFiltrosAvanzados(filtros);
  };

  // Filtrar facturas excluyendo las pagadas (para la página principal)
  const facturasFiltradas = facturasList.filter(factura => {
    // Excluir facturas pagadas de la página principal
    if (factura.estado === 'pagado') {
      return false;
    }

    // Filtrar por usuario gerente operativo - solo ve sus facturas
    if (user?.role === 'proveedor' && factura.proveedor !== (user?.nombre || user?.username)) {
      return false;
    }

    const matchEstado = filtroEstado === "todos" || factura.estado === filtroEstado;
    const matchBusqueda = busqueda === "" || 
      factura.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.rif.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtro por mes
    let matchMes = true;
    if (mesSeleccionado !== "todos") {
      const fechaFactura = new Date(factura.fecha.split('/').reverse().join('-'));
      const mesFactura = fechaFactura.getMonth();
      matchMes = mesFactura === parseInt(mesSeleccionado);
    }

    // Filtros avanzados
    let matchFiltrosAvanzados = true;
    if (Object.keys(filtrosAvanzados).length > 0) {
      const filtros = filtrosAvanzados as any;
      if (filtros.nombreProveedor && !factura.proveedor.toLowerCase().includes(filtros.nombreProveedor.toLowerCase())) {
        matchFiltrosAvanzados = false;
      }
      if (filtros.numeroFactura && !factura.id.toLowerCase().includes(filtros.numeroFactura.toLowerCase())) {
        matchFiltrosAvanzados = false;
      }
      if (filtros.fechaDesde || filtros.fechaHasta) {
        const fechaFactura = new Date(factura.fecha.split('/').reverse().join('-'));
        if (filtros.fechaDesde && fechaFactura < new Date(filtros.fechaDesde)) {
          matchFiltrosAvanzados = false;
        }
        if (filtros.fechaHasta && fechaFactura > new Date(filtros.fechaHasta)) {
          matchFiltrosAvanzados = false;
        }
      }
    }
    
    return matchEstado && matchBusqueda && matchMes && matchFiltrosAvanzados;
  });

  const meses = [
    { value: "todos", label: "Todos los meses" },
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" }
  ];

  const mostrarBotonesEdicion = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'proveedor' ? 'Mis Facturas' : 'Gestión de Facturas'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'proveedor' 
              ? 'Administra tus facturas enviadas' 
              : 'Administra y rastrea todas las facturas de gerentes operativos'
            }
          </p>
        </div>
        {(user?.role === 'proveedor' || user?.role === 'admin') && (
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setModalNuevaFactura(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por número, gerente operativo o RIF..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por mes" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="revision">En Revisión</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setModalFiltros(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Más Filtros
            </Button>
            
            <Button variant="outline" onClick={exportarPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen rápido */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturas</p>
                <p className="text-2xl font-bold text-gray-900">{facturasList.filter(f => f.estado !== 'pagado').length}</p>
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
                  {facturasList.filter(f => f.estado === 'pendiente').length}
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
                  {facturasList.filter(f => f.estado === 'revision').length}
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
                  {facturasList.filter(f => f.estado === 'aprobado').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lista de facturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Facturas ({facturasFiltradas.length})</span>
            <div className="text-sm text-gray-500">
              Mostrando {facturasFiltradas.length} de {facturasList.filter(f => f.estado !== 'pagado').length} facturas
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
                    {/* Selector de estado solo para administradores */}
                    {user?.role === 'admin' && (
                      <Select 
                        value={factura.estado} 
                        onValueChange={(valor) => cambiarEstadoFactura(factura.id, valor)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="revision">En Revisión</SelectItem>
                          <SelectItem value="aprobado">Aprobado</SelectItem>
                          <SelectItem value="pagado">Pagado</SelectItem>
                          <SelectItem value="rechazado">Rechazado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {mostrarBotonesEdicion && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => eliminarFactura(factura.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Gerente Operativo</span>
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

      <NuevaFacturaModal
        isOpen={modalNuevaFactura}
        onClose={() => setModalNuevaFactura(false)}
        onSubmit={agregarFactura}
      />

      <FiltrosAvanzados
        isOpen={modalFiltros}
        onClose={() => setModalFiltros(false)}
        onApplyFilters={aplicarFiltrosAvanzados}
      />
    </div>
  );
};

export default Facturas;
