
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FiltrosAvanzadosProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FiltrosAvanzados: React.FC<FiltrosAvanzadosProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filtros, setFiltros] = useState({
    nombreProveedor: '',
    fechaDesde: '',
    fechaHasta: '',
    numeroFactura: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filtros);
    onClose();
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombreProveedor: '',
      fechaDesde: '',
      fechaHasta: '',
      numeroFactura: ''
    });
    onApplyFilters({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros Avanzados</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombreProveedor">Nombre del Proveedor</Label>
            <Input
              id="nombreProveedor"
              value={filtros.nombreProveedor}
              onChange={(e) => setFiltros({...filtros, nombreProveedor: e.target.value})}
              placeholder="Buscar por proveedor..."
            />
          </div>
          
          <div>
            <Label htmlFor="numeroFactura">Número de Factura</Label>
            <Input
              id="numeroFactura"
              value={filtros.numeroFactura}
              onChange={(e) => setFiltros({...filtros, numeroFactura: e.target.value})}
              placeholder="FAC-2024-001"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaDesde">Fecha Desde</Label>
              <Input
                id="fechaDesde"
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fechaHasta">Fecha Hasta</Label>
              <Input
                id="fechaHasta"
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Aplicar Filtros</Button>
            <Button type="button" variant="outline" onClick={limpiarFiltros}>
              Limpiar
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FiltrosAvanzados;
