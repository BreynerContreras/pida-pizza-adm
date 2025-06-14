
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
  TrendingUp
} from 'lucide-react';

const proveedores = [
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

const getRatingStars = (rating: number) => {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

const Proveedores = () => {
  const [busqueda, setBusqueda] = useState("");

  const proveedoresFiltrados = proveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    proveedor.rif.toLowerCase().includes(busqueda.toLowerCase()) ||
    proveedor.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Proveedores</h1>
          <p className="text-gray-600">Administra la información de todos los proveedores</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">{proveedores.length}</p>
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
                {proveedores.filter(p => p.estado === 'activo').length}
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
                {proveedores.filter(p => p.estado === 'pendiente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Volumen Total</p>
              <p className="text-xl font-bold text-gray-900">B/. 140,491</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
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

      {/* Lista de proveedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proveedoresFiltrados.map((proveedor) => (
          <Card key={proveedor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                    <p className="text-sm text-gray-600">{proveedor.rif}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(proveedor.estado)} variant="outline">
                  {proveedor.estado.charAt(0).toUpperCase() + proveedor.estado.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Información de contacto */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{proveedor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{proveedor.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{proveedor.direccion}</span>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{proveedor.facturas}</p>
                  <p className="text-xs text-gray-600">Facturas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{proveedor.montoTotal}</p>
                  <p className="text-xs text-gray-600">Volumen Total</p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{proveedor.contacto}</p>
                  <p className="text-xs text-gray-600">{proveedor.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {getRatingStars(proveedor.rating)} {proveedor.rating}
                  </p>
                  <p className="text-xs text-gray-600">Desde {proveedor.fechaRegistro}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {proveedoresFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proveedores</h3>
            <p className="text-gray-600">Intenta ajustar la búsqueda o registrar un nuevo proveedor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Proveedores;
