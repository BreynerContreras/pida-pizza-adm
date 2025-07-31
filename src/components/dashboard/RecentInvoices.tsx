
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";

const invoices = [
  {
    id: "FAC-2024-001",
    proveedor: "Distribuidora La Rosa",
    monto: "B/. 2,450.00",
    fecha: "15/06/2024",
    estado: "pendiente",
    vencimiento: "30/06/2024"
  },
  {
    id: "FAC-2024-002",
    proveedor: "Carnes Premium S.A.",
    monto: "B/. 1,890.50",
    fecha: "14/06/2024",
    estado: "aprobado",
    vencimiento: "29/06/2024"
  },
  {
    id: "FAC-2024-004",
    proveedor: "Vegetales Frescos",
    monto: "B/. 645.80",
    fecha: "12/06/2024",
    estado: "pendiente",
    vencimiento: "27/06/2024"
  }
];

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'aprobado': return 'bg-green-100 text-green-800';
    
    case 'pagado': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const RecentInvoices = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Facturas Recientes</CardTitle>
        <Button variant="outline" size="sm">Ver todas</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((factura) => (
            <div key={factura.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{factura.id}</h4>
                  <Badge className={getStatusColor(factura.estado)} variant="secondary">
                    {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{factura.proveedor}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Fecha: {factura.fecha}</span>
                  <span>Vence: {factura.vencimiento}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 mb-2">{factura.monto}</p>
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
      </CardContent>
    </Card>
  );
};
