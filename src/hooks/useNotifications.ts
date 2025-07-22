import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock de facturas - en una app real vendría de una API
const mockFacturas = [
  {
    id: "FAC-2024-001",
    numero: "FAC-2024-001",
    proveedor: "Distribuidora La Rosa",
    monto: 15750.00,
    fecha: "15/06/2024",
    vencimiento: new Date().toLocaleDateString('es-ES'), // Vence hoy
    estado: "pendiente",
    categoria: "Carnes y Embutidos",
    descripcion: "Suministro de carnes frescas para restaurantes",
    createdBy: "3"
  },
  {
    id: "FAC-2024-002",
    numero: "FAC-2024-002", 
    proveedor: "Distribuidora La Rosa",
    monto: 8900.00,
    fecha: "14/06/2024",
    vencimiento: new Date().toLocaleDateString('es-ES'), // Vence hoy
    estado: "aprobado",
    categoria: "Carnes y Embutidos", 
    descripcion: "Cortes premium para menú especial",
    createdBy: "3"
  },
  {
    id: "FAC-2024-003",
    numero: "FAC-2024-003",
    proveedor: "Lácteos Premium",
    monto: 5200.00,
    fecha: "13/06/2024",
    vencimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'), // Vence mañana
    estado: "revision",
    categoria: "Lácteos",
    descripcion: "Quesos mozzarella y parmesano",
    createdBy: "1"
  },
  {
    id: "FAC-2024-004",
    numero: "FAC-2024-004",
    proveedor: "Vegetales Frescos SA",
    monto: 3800.00,
    fecha: "12/06/2024", 
    vencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'), // Vence en 2 días
    estado: "pendiente",
    categoria: "Vegetales",
    descripcion: "Vegetales orgánicos variados",
    createdBy: "1"
  },
  {
    id: "FAC-2024-005",
    numero: "FAC-2024-005",
    proveedor: "Panificadora Central",
    monto: 2100.00,
    fecha: "11/06/2024",
    vencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'), // Vence en 3 días
    estado: "pendiente",
    categoria: "Harinas y Panadería",
    descripcion: "Masa para pizza y pan de ajo",
    createdBy: "1"
  }
];

export const useNotifications = () => {
  const { user } = useAuth();

  const notificaciones = useMemo(() => {
    if (!user) return { facturas_vencen_hoy: 0, facturas_por_vencer: 0, total: 0 };

    const hoy = new Date().toLocaleDateString('es-ES');
    const enTresDias = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES');

    // Filtrar facturas según el rol del usuario
    let facturasVisibles = mockFacturas;
    
    if (user.role === 'gerente_operativo') {
      facturasVisibles = mockFacturas.filter(factura => factura.createdBy === user.id);
    }

    const facturas_vencen_hoy = facturasVisibles.filter(factura => 
      factura.vencimiento === hoy && factura.estado !== 'pagado'
    ).length;

    const facturas_por_vencer = facturasVisibles.filter(factura => {
      const fechaVencimiento = new Date(factura.vencimiento.split('/').reverse().join('-'));
      const fechaHoy = new Date();
      const fechaLimite = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      
      return fechaVencimiento > fechaHoy && 
             fechaVencimiento <= fechaLimite && 
             factura.estado !== 'pagado';
    }).length;

    const total = facturas_vencen_hoy + facturas_por_vencer;

    return {
      facturas_vencen_hoy,
      facturas_por_vencer,
      total
    };
  }, [user]);

  return notificaciones;
};