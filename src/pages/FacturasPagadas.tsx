import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Edit, Trash2, Calendar, Building2, FileText, DollarSign, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '../contexts/AuthContext';
import FiltrosAvanzados from '../components/facturas/FiltrosAvanzados';
import VerDetallesFacturaModal from '../components/facturas/VerDetallesFacturaModal';
import EditarFacturaModal from '../components/facturas/EditarFacturaModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";
const FacturasPagadas = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [facturasPagadas, setFacturasPagadas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [modalFiltros, setModalFiltros] = useState(false);
  const [modalVerDetalles, setModalVerDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({});
  useEffect(() => {
    // Cargar facturas pagadas desde localStorage
    const facturasPagadasGuardadas = localStorage.getItem('facturasPagadas');
    if (facturasPagadasGuardadas) {
      setFacturasPagadas(JSON.parse(facturasPagadasGuardadas));
    }

    // También cargar facturas con estado "pagado" desde la lista principal
    const todasLasFacturas = localStorage.getItem('facturas');
    if (todasLasFacturas) {
      const facturas = JSON.parse(todasLasFacturas);
      const facturasPagadasDeListaPrincipal = facturas.filter((f: any) => f.estado === 'pagado');

      // Combinar ambas listas evitando duplicados
      const facturasPagadasCompletas = [...facturasPagadasDeListaPrincipal];
      if (facturasPagadasGuardadas) {
        const facturasPagadasExistentes = JSON.parse(facturasPagadasGuardadas);
        facturasPagadasExistentes.forEach((factura: any) => {
          if (!facturasPagadasCompletas.find(f => f.id === factura.id)) {
            facturasPagadasCompletas.push(factura);
          }
        });
      }
      setFacturasPagadas(facturasPagadasCompletas);
      localStorage.setItem('facturasPagadas', JSON.stringify(facturasPagadasCompletas));
    }
  }, []);
  const editarFactura = (facturaEditada: any) => {
    const nuevasFacturasPagadas = facturasPagadas.map(factura => factura.id === facturaEditada.id ? facturaEditada : factura);
    setFacturasPagadas(nuevasFacturasPagadas);
    localStorage.setItem('facturasPagadas', JSON.stringify(nuevasFacturasPagadas));

    // También actualizar en la lista principal si el estado cambió
    if (facturaEditada.estado !== 'pagado') {
      const todasLasFacturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const facturasPrincipales = todasLasFacturas.map((f: any) => f.id === facturaEditada.id ? facturaEditada : f);
      localStorage.setItem('facturas', JSON.stringify(facturasPrincipales));

      // Remover de facturas pagadas si ya no está pagada
      const facturasPagadasActualizadas = nuevasFacturasPagadas.filter(f => f.id !== facturaEditada.id);
      setFacturasPagadas(facturasPagadasActualizadas);
      localStorage.setItem('facturasPagadas', JSON.stringify(facturasPagadasActualizadas));
    }
  };
  const eliminarFactura = (facturaId: string) => {
    const nuevasFacturasPagadas = facturasPagadas.filter(f => f.id !== facturaId);
    setFacturasPagadas(nuevasFacturasPagadas);
    localStorage.setItem('facturasPagadas', JSON.stringify(nuevasFacturasPagadas));

    // También eliminar de la lista principal
    const todasLasFacturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const facturasPrincipales = todasLasFacturas.filter((f: any) => f.id !== facturaId);
    localStorage.setItem('facturas', JSON.stringify(facturasPrincipales));
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
        'Estado': 'PAGADO',
        'Categoría': factura.categoria,
        'Descripción': factura.descripcion
      }));
      const ws = XLSX.utils.json_to_sheet(datosParaExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Facturas Pagadas');
      XLSX.writeFile(wb, 'facturas-pagadas-reporte.xlsx');
      toast({
        title: "Archivo Excel descargado",
        description: "El reporte de facturas pagadas se ha descargado en formato Excel."
      });
    } else {
      // Exportar a PDF para administrador
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Reporte de Facturas Pagadas - Pida Pizza', 20, 20);
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
        doc.text(`Estado: PAGADO`, 20, yPosition + 30);
        yPosition += 50;
      });
      doc.save('facturas-pagadas-reporte.pdf');
      toast({
        title: "Archivo PDF descargado",
        description: "El reporte de facturas pagadas se ha descargado en formato PDF."
      });
    }
  };
  const abrirModalVerDetalles = (factura: any) => {
    setFacturaSeleccionada(factura);
    setModalVerDetalles(true);
  };
  const abrirModalEditar = (factura: any) => {
    setFacturaSeleccionada(factura);
    setModalEditar(true);
  };
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Facturas Pagadas - Pida Pizza', 20, 20);
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
      doc.text(`Estado: PAGADO`, 20, yPosition + 30);
      yPosition += 50;
    });
    doc.save('facturas-pagadas-reporte.pdf');
  };
  const aplicarFiltrosAvanzados = (filtros: any) => {
    setFiltrosAvanzados(filtros);
  };
  const facturasFiltradas = facturasPagadas.filter(factura => {
    // Filtrar por usuario gerente operativo - solo ve sus facturas
    if (user?.role === 'gerente_operativo' && factura.proveedor !== (user?.nombre || user?.username)) {
      return false;
    }
    const matchBusqueda = busqueda === "" || factura.id.toLowerCase().includes(busqueda.toLowerCase()) || factura.proveedor.toLowerCase().includes(busqueda.toLowerCase()) || factura.rif.toLowerCase().includes(busqueda.toLowerCase());

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
    return matchBusqueda && matchMes && matchFiltrosAvanzados;
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
  const mostrarBotonesEdicion = false;
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'gerente_operativo' ? 'Mis Facturas Pagadas' : 'Facturas Pagadas'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'gerente_operativo' ? 'Historial de tus facturas pagadas' : 'Historial de todas las facturas pagadas'}
          </p>
        </div>
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
      {user?.role === 'admin' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturas Pagadas</p>
                <p className="text-2xl font-bold text-gray-900">{facturasPagadas.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>}

      {/* Lista de facturas pagadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Facturas Pagadas ({facturasFiltradas.length})</span>
            <div className="text-sm text-gray-500">
              Mostrando {facturasFiltradas.length} de {facturasPagadas.length} facturas pagadas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facturasFiltradas.map(factura => <div key={factura.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{factura.id}</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Pagado
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => abrirModalVerDetalles(factura)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {mostrarBotonesEdicion && <>
                        <Button variant="ghost" size="sm" onClick={() => abrirModalEditar(factura)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar factura pagada?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La factura {factura.id} será eliminada permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              
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
                    <p className="text-2xl font-bold text-green-700">{factura.monto}</p>
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
              <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas pagadas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda.</p>
            </div>}
        </CardContent>
      </Card>

      <FiltrosAvanzados isOpen={modalFiltros} onClose={() => setModalFiltros(false)} onApplyFilters={aplicarFiltrosAvanzados} />

      <VerDetallesFacturaModal isOpen={modalVerDetalles} onClose={() => setModalVerDetalles(false)} factura={facturaSeleccionada} />

      <EditarFacturaModal isOpen={modalEditar} onClose={() => setModalEditar(false)} factura={facturaSeleccionada} onSave={editarFactura} />
    </div>;
};
export default FacturasPagadas;