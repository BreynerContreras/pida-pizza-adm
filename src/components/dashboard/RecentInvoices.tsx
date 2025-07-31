
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  numero_factura: string;
  proveedor: string;
  monto: number;
  fecha: string;
  estado: string;
  limite_pago: string;
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'aprobado': return 'bg-green-100 text-green-800';
    
    case 'pagado': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const RecentInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .in('estado', ['pendiente', 'aprobado'])
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching invoices:', error);
        } else {
          setInvoices(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatAmount = (amount: number) => {
    return `Bs. ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Facturas Recientes</CardTitle>
        <Button variant="outline" size="sm">Ver todas</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {invoices.map((factura) => (
              <div key={factura.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{factura.numero_factura}</h4>
                    <Badge className={getStatusColor(factura.estado)} variant="secondary">
                      {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{factura.proveedor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Fecha: {formatDate(factura.fecha)}</span>
                    <span>Vence: {formatDate(factura.limite_pago)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 mb-2">{formatAmount(factura.monto)}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
