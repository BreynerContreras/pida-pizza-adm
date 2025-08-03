import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, Calendar, Building2, FileText, CheckCircle, DollarSign, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import NuevaFacturaModal from '../components/facturas/NuevaFacturaModal';
import FiltrosAvanzados from '../components/facturas/FiltrosAvanzados';
import VerDetallesFacturaModal from '../components/facturas/VerDetallesFacturaModal';
import EditarFacturaModal from '../components/facturas/EditarFacturaModal';
import RegistrarPagoModal from '../components/facturas/RegistrarPagoModal';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const facturas = [{
  id: "FAC-2024-001",
  proveedor: "Distribuidora La Rosa",
  rif: "J-12345678-9",
  monto: "B/. 2,450.00",
  fecha: "15/06/2024",
  vencimiento: "30/06/2024",
  estado: "pendiente",
  categoria: "Carnes y Embutidos",
  descripcion: "Suministro de carnes frescas para restaurantes",
  createdBy: "3"
}, {
  id: "FAC-2024-002",
  proveedor: "Carnes Premium S.A.",
  rif: "J-98765432-1",
  monto: "B/. 1,890.50",
  fecha: "14/06/2024",
  vencimiento: "29/06/2024",
  estado: "aprobado",
  categoria: "Carnes y Embutidos",
  descripcion: "Cortes premium para menú especial",
  createdBy: "3"
}, {
  id: "FAC-2024-003",
  proveedor: "Lácteos del Valle",
  rif: "J-11223344-5",
  monto: "B/. 875.25",
  fecha: "13/06/2024",
  vencimiento: "28/06/2024",
  estado: "revision",
  categoria: "Lácteos",
  descripcion: "Quesos mozzarella y parmesano",
  createdBy: "1"
}, {
  id: "FAC-2024-004",
  proveedor: "Vegetales Frescos",
  rif: "J-55667788-9",
  monto: "B/. 645.80",
  fecha: "12/06/2024",
  vencimiento: "27/06/2024",
  estado: "pendiente",
  categoria: "Vegetales",
  descripcion: "Vegetales orgánicos variados",
  createdBy: "1"
}, {
  id: "FAC-2024-005",
  proveedor: "Panadería Central",
  rif: "J-99887766-5",
  monto: "B/. 1,250.00",
  fecha: "11/06/2024",
  vencimiento: "26/06/2024",
  estado: "pendiente",
  categoria: "Harinas y Panadería",
  descripción: "Masa para pizza y pan de ajo",
  createdBy: "1"
}];
const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'aprobado':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pagado':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'rechazado':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
const Facturas = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [facturasList, setFacturasList] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [modalNuevaFactura, setModalNuevaFactura] = useState(false);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [modalVerDetalles, setModalVerDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalRegistrarPago, setModalRegistrarPago] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    cargarFacturas();
  }, [user]);
  const cargarFacturas = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let query = supabase.from('invoices').select('*').order('created_at', {
        ascending: false
      });

      // Si es gerente operativo, solo ver sus facturas
      if (user.role === 'gerente_operativo') {
        query = query.eq('created_by', user.id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setFacturasList(data || []);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las facturas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const guardarFacturas = (nuevasFacturas: any[]) => {
    setFacturasList(nuevasFacturas);
    localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
  };
  const cambiarEstadoFactura = async (facturaId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ estado: nuevoEstado })
        .eq('id', facturaId);

      if (error) throw error;

      // Actualizar el estado local
      const nuevasFacturas = facturasList.map(factura => {
        if (factura.id === facturaId) {
          return {
            ...factura,
            estado: nuevoEstado
          };
        }
        return factura;
      });
      setFacturasList(nuevasFacturas);

      if (nuevoEstado === 'aprobado') {
        toast({
          title: "Factura aprobada",
          description: "La factura ha sido aprobada y movida a Facturas Pagadas."
        });
      }
    } catch (error) {
      console.error('Error al cambiar estado de factura:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la factura.",
        variant: "destructive"
      });
    }
  };
  const agregarFactura = (facturaData: any) => {
    // Recargar facturas después de crear una nueva
    cargarFacturas();
  };
  const editarFactura = (facturaEditada: any) => {
    const nuevasFacturas = facturasList.map(factura => factura.id === facturaEditada.id ? facturaEditada : factura);
    guardarFacturas(nuevasFacturas);
  };
  const eliminarFactura = (facturaId: string) => {
    const nuevasFacturas = facturasList.filter(f => f.id !== facturaId);
    guardarFacturas(nuevasFacturas);
    toast({
      title: "Factura eliminada",
      description: "La factura ha sido eliminada exitosamente."
    });
  };
  const exportarArchivo = () => {
    if (user?.role === 'contadora') {
      // Exportar a Excel para contadora
      const datosParaExcel = facturasFiltradas.map(factura => ({
        'Número de Factura': factura.id,
        'Gerente Operativo': factura.proveedor,
        'RIF': factura.rif,
        'Monto': factura.monto,
        'Fecha de Emisión': factura.fecha,
        'Fecha de Vencimiento': factura.vencimiento,
        'Estado': factura.estado,
        'Categoría': factura.categoria,
        'Descripción': factura.descripcion
      }));
      const ws = XLSX.utils.json_to_sheet(datosParaExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Facturas');

      // Ajustar el ancho de las columnas
      const colWidths = [{
        wch: 20
      },
      // Número de Factura
      {
        wch: 25
      },
      // Gerente Operativo
      {
        wch: 15
      },
      // RIF
      {
        wch: 15
      },
      // Monto
      {
        wch: 15
      },
      // Fecha de Emisión
      {
        wch: 18
      },
      // Fecha de Vencimiento
      {
        wch: 12
      },
      // Estado
      {
        wch: 20
      },
      // Categoría
      {
        wch: 30
      } // Descripción
      ];
      ws['!cols'] = colWidths;
      XLSX.writeFile(wb, 'facturas-reporte.xlsx');
      toast({
        title: "Archivo Excel descargado",
        description: "El reporte de facturas se ha descargado en formato Excel."
      });
    } else {
      // Exportar a PDF para administrador
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
      toast({
        title: "Archivo PDF descargado",
        description: "El reporte de facturas se ha descargado en formato PDF."
      });
    }
  };
  const aplicarFiltrosAvanzados = (filtros: any) => {
    setFiltrosAvanzados(filtros);
  };
  const abrirModalVerDetalles = (factura: any) => {
    setFacturaSeleccionada(factura);
    setModalVerDetalles(true);
  };
  const abrirModalEditar = (factura: any) => {
    setFacturaSeleccionada(factura);
    setModalEditar(true);
  };
  const abrirModalRegistrarPago = (factura: any) => {
    setFacturaSeleccionada(factura);
    setModalRegistrarPago(true);
  };
  const onPagoRegistrado = () => {
    cargarFacturas(); // Recargar facturas
  };

  // Detectar filtros especiales desde navegación
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filtroEspecial = searchParams.get('filtro');
    if (filtroEspecial === 'vencen_hoy') {
      // Filtrar facturas que vencen hoy
      const hoy = new Date().toLocaleDateString('es-ES');
      const filtros = {
        fechaVencimiento: hoy,
        descripcion: 'Facturas que vencen hoy'
      };
      setFiltrosAvanzados(filtros);
      toast({
        title: "Filtro aplicado",
        description: "Mostrando facturas que vencen hoy"
      });
    } else if (filtroEspecial === 'por_vencer') {
      // Filtrar facturas que vencen en próximos 3 días
      const hoy = new Date();
      const tresDias = new Date();
      tresDias.setDate(hoy.getDate() + 3);
      const filtros = {
        fechaVencimientoHasta: tresDias.toLocaleDateString('es-ES'),
        descripcion: 'Facturas por vencer (próximos 3 días)'
      };
      setFiltrosAvanzados(filtros);
      toast({
        title: "Filtro aplicado",
        description: "Mostrando facturas que vencen en los próximos 3 días"
      });
    }
  }, [location.search, toast]);

  // Filtrar facturas excluyendo las aprobadas (para la página principal)
  const facturasFiltradas = facturasList.filter(factura => {
    // Excluir facturas aprobadas de la página principal
    if (factura.estado === 'aprobado') {
      return false;
    }
    const matchEstado = filtroEstado === "todos" || factura.estado === filtroEstado;
    const matchBusqueda = busqueda === "" || factura.numero_factura?.toLowerCase().includes(busqueda.toLowerCase()) || factura.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) || factura.rif?.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro por mes
    let matchMes = true;
    if (mesSeleccionado !== "todos") {
      const fechaFactura = new Date(factura.fecha);
      const mesFactura = fechaFactura.getMonth();
      matchMes = mesFactura === parseInt(mesSeleccionado);
    }

    // Filtros avanzados incluyendo filtros especiales
    let matchFiltrosAvanzados = true;
    if (Object.keys(filtrosAvanzados).length > 0) {
      const filtros = filtrosAvanzados as any;

      // Filtro especial por fecha de vencimiento exacta
      if (filtros.fechaVencimiento) {
        const limitePagoFormatted = new Date(factura.limite_pago).toLocaleDateString('es-ES');
        if (limitePagoFormatted !== filtros.fechaVencimiento) {
          matchFiltrosAvanzados = false;
        }
      }

      // Filtro especial por fecha de vencimiento hasta
      if (filtros.fechaVencimientoHasta) {
        const fechaVencimiento = new Date(factura.limite_pago);
        const fechaLimite = new Date(filtros.fechaVencimientoHasta.split('/').reverse().join('-'));
        const hoy = new Date();
        if (fechaVencimiento < hoy || fechaVencimiento > fechaLimite) {
          matchFiltrosAvanzados = false;
        }
      }

      // Filtro por nombre del proveedor
      if (filtros.nombreProveedor && !factura.proveedor?.toLowerCase().includes(filtros.nombreProveedor.toLowerCase())) {
        matchFiltrosAvanzados = false;
      }

      // Filtro por número de factura
      if (filtros.numeroFactura && !factura.numero_factura?.toLowerCase().includes(filtros.numeroFactura.toLowerCase())) {
        matchFiltrosAvanzados = false;
      }
    }
    return matchEstado && matchBusqueda && matchMes && matchFiltrosAvanzados;
  });
  const meses = [{
    value: "todos",
    label: "Todos los meses"
  }, {
    value: "0",
    label: "Enero"
  }, {
    value: "1",
    label: "Febrero"
  }, {
    value: "2",
    label: "Marzo"
  }, {
    value: "3",
    label: "Abril"
  }, {
    value: "4",
    label: "Mayo"
  }, {
    value: "5",
    label: "Junio"
  }, {
    value: "6",
    label: "Julio"
  }, {
    value: "7",
    label: "Agosto"
  }, {
    value: "8",
    label: "Septiembre"
  }, {
    value: "9",
    label: "Octubre"
  }, {
    value: "10",
    label: "Noviembre"
  }, {
    value: "11",
    label: "Diciembre"
  }];
  const mostrarBotonesEdicion = user?.role === 'admin';
  const limpiarFiltroEspecial = () => {
    setFiltrosAvanzados({});
    navigate('/facturas', {
      replace: true
    });
    toast({
      title: "Filtro limpiado",
      description: "Mostrando todas las facturas"
    });
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'gerente_operativo' ? 'Mis Facturas' : 'Gestión de Facturas'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'gerente_operativo' ? 'Administra tus facturas enviadas' : 'Administra y rastrea todas las facturas de gerentes operativos'}
          </p>
          {Object.keys(filtrosAvanzados).length > 0 && (filtrosAvanzados as any).descripcion && <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {(filtrosAvanzados as any).descripcion}
              </Badge>
              <Button variant="ghost" size="sm" onClick={limpiarFiltroEspecial}>
                Limpiar filtro
              </Button>
            </div>}
        </div>
        {user?.role === 'gerente_operativo' && <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalNuevaFactura(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>}
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar por número, gerente operativo o RIF..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por mes" />
              </SelectTrigger>
              <SelectContent>
                {meses.map(mes => <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Pagado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setModalFiltros(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Más Filtros
            </Button>
            
            <Button variant="outline" onClick={exportarArchivo}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen rápido */}
      {user?.role === 'admin' && <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {facturasList.filter(f => f.estado === 'aprobado').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>}

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
            {facturasFiltradas.map(factura => <div key={factura.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{factura.numero_factura}</h3>
                    <Badge className={getStatusColor(factura.estado)} variant="outline">
                      {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </Badge>
                    {/* Selector de estado solo para administradores */}
                    {user?.role === 'admin' && <Select value={factura.estado} onValueChange={valor => cambiarEstadoFactura(factura.id, valor)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="aprobado">Pagado</SelectItem>
                        </SelectContent>
                      </Select>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => abrirModalVerDetalles(factura)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                     {mostrarBotonesEdicion && <>
                         <Button variant="ghost" size="sm" onClick={() => abrirModalRegistrarPago(factura)} className="text-blue-600 hover:text-blue-800">
                           <CreditCard className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="sm" onClick={() => abrirModalEditar(factura)}>
                           <Edit className="w-4 h-4" />
                         </Button>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => eliminarFactura(factura.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Gerente Operativo</span>
                    </div>
                    <p className="font-semibold text-gray-900">{factura.proveedor}</p>
                     <p className="text-sm text-gray-600">{factura.rif || 'Sin RIF'}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Fechas</span>
                    </div>
                     <p className="text-sm text-gray-900">Emisión: {new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
                     <p className="text-sm text-gray-900">Límite de pago: {new Date(factura.limite_pago).toLocaleDateString('es-ES')}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Monto</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">B/. {factura.monto?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descripción:</span> {factura.descripcion}
                  </p>
                </div>
              </div>)}
          </div>
          
          {facturasFiltradas.length === 0 && <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros o crear una nueva factura.</p>
            </div>}
        </CardContent>
      </Card>

      <NuevaFacturaModal isOpen={modalNuevaFactura} onClose={() => setModalNuevaFactura(false)} onSubmit={agregarFactura} />

      <FiltrosAvanzados isOpen={modalFiltros} onClose={() => setModalFiltros(false)} onApplyFilters={aplicarFiltrosAvanzados} />

      <VerDetallesFacturaModal isOpen={modalVerDetalles} onClose={() => setModalVerDetalles(false)} factura={facturaSeleccionada} />

       <EditarFacturaModal isOpen={modalEditar} onClose={() => setModalEditar(false)} factura={facturaSeleccionada} onSave={editarFactura} />

       <RegistrarPagoModal isOpen={modalRegistrarPago} onClose={() => setModalRegistrarPago(false)} facturaId={facturaSeleccionada?.id || ''} onPagoRegistrado={onPagoRegistrado} />
    </div>;
};
export default Facturas;