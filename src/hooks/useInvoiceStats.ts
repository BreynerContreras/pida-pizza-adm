import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceStats {
  totalMontoMensual: number;
  montoAprobadas: number;
  montoPendientes: number;
  porcentajeAprobadas: number;
  porcentajePendientes: number;
  loading: boolean;
  error: string | null;
}

export const useInvoiceStats = () => {
  const [stats, setStats] = useState<InvoiceStats>({
    totalMontoMensual: 0,
    montoAprobadas: 0,
    montoPendientes: 0,
    porcentajeAprobadas: 0,
    porcentajePendientes: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener todas las facturas del mes actual
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('monto, estado')
          .gte('fecha', firstDayOfMonth.toISOString().split('T')[0])
          .lte('fecha', lastDayOfMonth.toISOString().split('T')[0]);

        if (error) {
          throw error;
        }

        // Calcular estadísticas
        const totalMensual = invoices?.reduce((sum, invoice) => sum + Number(invoice.monto), 0) || 0;
        const aprobadas = invoices?.filter(inv => inv.estado === 'aprobada') || [];
        const pendientes = invoices?.filter(inv => inv.estado === 'pendiente') || [];
        
        const montoAprobadas = aprobadas.reduce((sum, invoice) => sum + Number(invoice.monto), 0);
        const montoPendientes = pendientes.reduce((sum, invoice) => sum + Number(invoice.monto), 0);

        const porcentajeAprobadas = totalMensual > 0 ? Math.round((montoAprobadas / totalMensual) * 100) : 0;
        const porcentajePendientes = totalMensual > 0 ? Math.round((montoPendientes / totalMensual) * 100) : 0;

        setStats({
          totalMontoMensual: totalMensual,
          montoAprobadas,
          montoPendientes,
          porcentajeAprobadas,
          porcentajePendientes,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching invoice stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar las estadísticas'
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};