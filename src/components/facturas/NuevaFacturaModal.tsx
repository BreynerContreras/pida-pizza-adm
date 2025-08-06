
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NuevaFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (facturaData: any) => void;
}

const NuevaFacturaModal: React.FC<NuevaFacturaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numeroFactura: '',
    monto: '',
    fecha: '',
    limitePago: '',
    nombreEmpresa: '',
    rif: '',
    descripcion: '',
    imagenes: [] as File[]
  });

  // Estado para la tabla de descripción detallada
  const [tablaDescripcion, setTablaDescripcion] = useState(() => {
    const filas = [];
    for (let i = 0; i < 16; i++) {
      filas.push({
        fila: i,
        cantidad: '',
        descripcion_concepto: '',
        precio_unitario: '',
        monto: ''
      });
    }
    return filas;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.numeroFactura || !formData.monto || !formData.fecha || 
        !formData.limitePago || !formData.nombreEmpresa || !formData.descripcion) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    if (formData.imagenes.length === 0) {
      toast({
        title: "Error de validación", 
        description: "Debe subir al menos una imagen de la factura.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Subir imagen a Supabase Storage
      let imagenUrl = '';
      if (formData.imagenes.length > 0) {
        const archivo = formData.imagenes[0];
        const nombreArchivo = `factura_${Date.now()}_${archivo.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(nombreArchivo, archivo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('invoices')
          .getPublicUrl(nombreArchivo);
        
        imagenUrl = publicUrl;
      }

      // Crear factura en la base de datos
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          numero_factura: formData.numeroFactura,
          monto: parseFloat(formData.monto),
          fecha: formData.fecha,
          limite_pago: formData.limitePago,
          proveedor: formData.nombreEmpresa,
          nombre_empresa: formData.nombreEmpresa,
          rif: formData.rif || null,
          descripcion: formData.descripcion,
          imagen_url: imagenUrl,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Guardar las filas de la tabla de descripción que tienen contenido
      const filasConContenido = tablaDescripcion.filter(fila => 
        fila.cantidad || fila.descripcion_concepto || fila.precio_unitario || fila.monto
      );

      if (filasConContenido.length > 0) {
        const insertData = filasConContenido.map(fila => ({
          invoice_id: data.id,
          fila: fila.fila,
          cantidad: fila.cantidad ? parseFloat(fila.cantidad) : null,
          descripcion_concepto: fila.descripcion_concepto || null,
          precio_unitario: fila.precio_unitario ? parseFloat(fila.precio_unitario) : null,
          monto: fila.monto ? parseFloat(fila.monto) : null
        }));

        const { error: tablaError } = await supabase
          .from('descripcion_de_las_facturas')
          .insert(insertData);

        if (tablaError) throw tablaError;
      }

      toast({
        title: "Factura creada",
        description: "La factura ha sido creada exitosamente.",
      });

      // Limpiar formulario
      setFormData({
        numeroFactura: '',
        monto: '',
        fecha: '',
        limitePago: '',
        nombreEmpresa: '',
        rif: '',
        descripcion: '',
        imagenes: []
      });
      
      // Limpiar tabla de descripción
      const filasVacias = [];
      for (let i = 0; i < 16; i++) {
        filasVacias.push({
          fila: i,
          cantidad: '',
          descripcion_concepto: '',
          precio_unitario: '',
          monto: ''
        });
      }
      setTablaDescripcion(filasVacias);
      
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error al crear factura:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la factura. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        imagenes: [e.target.files[0]] // Solo tomar la primera imagen
      });
    }
  };

  const handleTablaChange = (filaIndex: number, campo: string, valor: string) => {
    const nuevaTabla = [...tablaDescripcion];
    nuevaTabla[filaIndex] = {
      ...nuevaTabla[filaIndex],
      [campo]: valor
    };
    setTablaDescripcion(nuevaTabla);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numeroFactura">Número de Factura *</Label>
              <Input
                id="numeroFactura"
                value={formData.numeroFactura}
                onChange={(e) => setFormData({...formData, numeroFactura: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="monto">Monto *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha de Emisión *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="limitePago">Límite de Pago *</Label>
              <Input
                id="limitePago"
                type="date"
                value={formData.limitePago}
                onChange={(e) => setFormData({...formData, limitePago: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
              <Input
                id="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={(e) => setFormData({...formData, nombreEmpresa: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="rif">RIF (Opcional)</Label>
              <Input
                id="rif"
                value={formData.rif}
                onChange={(e) => setFormData({...formData, rif: e.target.value})}
                placeholder="Ej: J-12345678-9"
              />
            </div>
          </div>
          
          <div>
            <Label>Detalle de la Factura *</Label>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left font-medium w-24">Cantidad</th>
                      <th className="border border-border p-2 text-left font-medium flex-1">Descripción o Concepto</th>
                      <th className="border border-border p-2 text-left font-medium w-32">P. Unitario</th>
                      <th className="border border-border p-2 text-left font-medium w-32">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablaDescripcion.map((fila, index) => (
                      <tr key={index}>
                        <td className="border border-border p-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={fila.cantidad}
                            onChange={(e) => handleTablaChange(index, 'cantidad', e.target.value)}
                            className="border-0 h-8 text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={fila.descripcion_concepto}
                            onChange={(e) => handleTablaChange(index, 'descripcion_concepto', e.target.value)}
                            className="border-0 h-8 text-sm"
                            placeholder="Descripción del producto/servicio"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={fila.precio_unitario}
                            onChange={(e) => handleTablaChange(index, 'precio_unitario', e.target.value)}
                            className="border-0 h-8 text-sm"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={fila.monto}
                            onChange={(e) => handleTablaChange(index, 'monto', e.target.value)}
                            className="border-0 h-8 text-sm"
                            placeholder="0.00"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Complete al menos una fila con la información detallada de la factura
            </p>
          </div>
          
          <div>
            <Label htmlFor="imagenes">Imagen de la Factura *</Label>
            <Input
              id="imagenes"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
              required
            />
            {formData.imagenes.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {formData.imagenes.length} imagen seleccionada
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Requerido: Debe subir la imagen de la factura como respaldo
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Factura'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevaFacturaModal;
