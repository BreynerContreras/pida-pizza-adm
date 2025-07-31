import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import VerDetallesGerenteModal from '../components/gerentes/VerDetallesGerenteModal';
import EditarGerenteModal from '../components/gerentes/EditarGerenteModal';
import NuevoGerenteModal from '../components/gerentes/NuevoGerenteModal';
import { useToast } from "@/hooks/use-toast";

const gerentesOperativosIniciales = [
  {
    id: 1,
    nombre: "Distribuidora La Rosa",
    rif: "J-12345678-9",
    email: "ventas@larosa.com",
    telefono: "+507 6789-1234",
    direccion: "Vía España, Ciudad de Panamá",
    categoria: "Carnes y Embutidos",
    estado: "activo",
    facturas: 23,
    montoTotal: "B/. 45,230.00",
    fechaRegistro: "15/01/2024",
    contacto: "María González",
    rating: 4.8
  },
  {
    id: 2,
    nombre: "Carnes Premium S.A.",
    rif: "J-98765432-1",
    email: "pedidos@carnespremium.com",
    telefono: "+507 6234-5678",
    direccion: "Zona Libre de Colón",
    categoria: "Carnes y Embutidos",
    estado: "activo",
    facturas: 18,
    montoTotal: "B/. 38,750.50",
    fechaRegistro: "22/02/2024",
    contacto: "Carlos Méndez",
    rating: 4.6
  },
  {
    id: 3,
    nombre: "Lácteos del Valle",
    rif: "J-11223344-5",
    email: "info@lacteosval.com",
    telefono: "+507 6456-7890",
    direccion: "Chorrera, Panamá Oeste",
    categoria: "Lácteos",
    estado: "activo",
    facturas: 15,
    montoTotal: "B/. 32,100.25",
    fechaRegistro: "10/03/2024",
    contacto: "Ana Rodríguez",
    rating: 4.9
  },
  {
    id: 4,
    nombre: "Vegetales Frescos",
    rif: "J-55667788-9",
    email: "ventas@vegfrescos.com",
    telefono: "+507 6123-4567",
    direccion: "Mercado de Mariscos, Casco Viejo",
    categoria: "Vegetales",
    estado: "pendiente",
    facturas: 8,
    montoTotal: "B/. 15,460.80",
    fechaRegistro: "05/05/2024",
    contacto: "Roberto Silva",
    rating: 4.2
  },
  {
    id: 5,
    nombre: "Panadería Central",
    rif: "J-99887766-5",
    email: "pedidos@pancentral.com",
    telefono: "+507 6890-1234",
    direccion: "Avenida Balboa, San Francisco",
    categoria: "Harinas y Panadería",
    estado: "inactivo",
    facturas: 5,
    montoTotal: "B/. 8,950.00",
    fechaRegistro: "20/04/2024",
    contacto: "Luis Morales",
    rating: 3.8
  }
];

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'activo': return 'bg-green-100 text-green-800 border-green-200';
    case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};


const Proveedores = () => {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [gerentesList, setGerentesList] = useState(() => {
    const savedGerentes = localStorage.getItem('gerentes');
    return savedGerentes ? JSON.parse(savedGerentes) : gerentesOperativosIniciales;
  });
  const [modalVerDetalles, setModalVerDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [gerenteSeleccionado, setGerenteSeleccionado] = useState<any>(null);

  const gerentesFiltrados = gerentesList.filter(gerente => 
    gerente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    gerente.rif.toLowerCase().includes(busqueda.toLowerCase()) ||
    gerente.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalVerDetalles = (gerente: any) => {
    setGerenteSeleccionado(gerente);
    setModalVerDetalles(true);
  };

  const abrirModalEditar = (gerente: any) => {
    setGerenteSeleccionado(gerente);
    setModalEditar(true);
  };

  const guardarGerenteEditado = (gerenteEditado: any) => {
    const nuevosGerentes = gerentesList.map(gerente => 
      gerente.id === gerenteEditado.id ? gerenteEditado : gerente
    );
    setGerentesList(nuevosGerentes);
    localStorage.setItem('gerentes', JSON.stringify(nuevosGerentes));
    
    toast({
      title: "Gerente operativo actualizado",
      description: "La información ha sido actualizada exitosamente.",
    });
  };

  const guardarNuevoGerente = (nuevoGerenteData: any) => {
    const nuevoGerente = {
      id: Date.now(), // Generar ID único basado en timestamp
      ...nuevoGerenteData,
      estado: 'pendiente',
      facturas: 0,
      montoTotal: 'B/. 0.00',
      fechaRegistro: new Date().toLocaleDateString('es-ES'),
      
    };
    
    const nuevosGerentes = [...gerentesList, nuevoGerente];
    setGerentesList(nuevosGerentes);
    localStorage.setItem('gerentes', JSON.stringify(nuevosGerentes));
    
    toast({
      title: "Gerente operativo creado",
      description: "El nuevo gerente operativo ha sido registrado exitosamente.",
    });
  };

  const eliminarGerente = (gerenteId: number) => {
    const gerente = gerentesList.find(g => g.id === gerenteId);
    if (gerente && gerente.facturas > 0) {
      toast({
        title: "No se puede eliminar",
        description: "El gerente operativo tiene facturas asociadas. No es posible eliminarlo.",
        variant: "destructive"
      });
      return;
    }

    const nuevosGerentes = gerentesList.filter(g => g.id !== gerenteId);
    setGerentesList(nuevosGerentes);
    localStorage.setItem('gerentes', JSON.stringify(nuevosGerentes));
    
    toast({
      title: "Gerente operativo eliminado",
      description: "El gerente operativo ha sido eliminado exitosamente.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Directorio</h1>
          <p className="text-gray-600">Administra la información de todos los proveedores</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setModalNuevo(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">{gerentesList.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {gerentesList.filter(p => p.estado === 'activo').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {gerentesList.filter(p => p.estado === 'pendiente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, RIF o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de gerentes operativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gerentesFiltrados.map((gerente) => (
          <Card key={gerente.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{gerente.nombre}</CardTitle>
                    <p className="text-sm text-gray-600">{gerente.rif}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(gerente.estado)} variant="outline">
                  {gerente.estado.charAt(0).toUpperCase() + gerente.estado.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Información de contacto */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{gerente.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{gerente.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{gerente.direccion}</span>
                </div>
              </div>

              {/* Métricas */}
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{gerente.montoTotal}</p>
                <p className="text-xs text-gray-600">Volumen Total</p>
              </div>

              {/* Información adicional */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{gerente.contacto}</p>
                  <p className="text-xs text-gray-600">{gerente.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Desde {gerente.fechaRegistro}</p>
                </div>
              </div>

              {/* Acciones corregidas */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => abrirModalVerDetalles(gerente)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => abrirModalEditar(gerente)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar gerente operativo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El gerente operativo "{gerente.nombre}" será eliminado permanentemente.
                        {gerente.facturas > 0 && (
                          <span className="block mt-2 text-red-600 font-medium">
                            Advertencia: Este gerente tiene {gerente.facturas} facturas asociadas.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => eliminarGerente(gerente.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gerentesFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron gerentes operativos</h3>
            <p className="text-gray-600">Intenta ajustar la búsqueda o registrar un nuevo gerente operativo.</p>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <VerDetallesGerenteModal
        isOpen={modalVerDetalles}
        onClose={() => setModalVerDetalles(false)}
        gerente={gerenteSeleccionado}
      />

      <EditarGerenteModal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        gerente={gerenteSeleccionado}
        onSave={guardarGerenteEditado}
      />

      <NuevoGerenteModal
        isOpen={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onSave={guardarNuevoGerente}
      />
    </div>
  );
};

export default Proveedores;
