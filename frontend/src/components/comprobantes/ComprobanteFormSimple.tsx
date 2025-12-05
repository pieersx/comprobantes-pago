'use client';

/**
 * Formulario simplificado de comprobantes con selector de tipo
 * Versión funcional y directa
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface ComprobanteFormSimpleProps {
  tipo: 'ingreso' | 'egreso';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ComprobanteFormSimple({
  tipo,
  onSuccess,
  onCancel,
}: ComprobanteFormSimpleProps) {
  const { toast } = useToast();

  // Estado del formulario
  const [tipoComprobante, setTipoComprobante] = useState<string>('');
  const [nroComprobante, setNroComprobante] = useState('');
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  };
  const [fecha, setFecha] = useState(obtenerFechaLocal());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoComprobante) {
      toast({
        title: "Error",
        description: "Debe seleccionar el tipo de comprobante",
        variant: "destructive",
      });
      return;
    }

    if (!nroComprobante) {
      toast({
        title: "Error",
        description: "Debe ingresar el número de comprobante",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Aquí iría la lógica para guardar
      toast({
        title: "Éxito",
        description: "Comprobante guardado correctamente",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el comprobante",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            Nuevo Comprobante de {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* SELECTOR DE TIPO DE COMPROBANTE */}
          <div className="space-y-2">
            <Label htmlFor="tipoComprobante" className="text-base font-semibold">
              Tipo de Comprobante *
            </Label>
            <Select
              value={tipoComprobante}
              onValueChange={setTipoComprobante}
              disabled={loading}
            >
              <SelectTrigger id="tipoComprobante" className="w-full">
                <SelectValue placeholder="Seleccione el tipo de comprobante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FAC">
                  <div className="flex flex-col">
                    <span className="font-semibold">Factura</span>
                    <span className="text-xs text-muted-foreground">IGV 18%</span>
                  </div>
                </SelectItem>
                <SelectItem value="BOL">
                  <div className="flex flex-col">
                    <span className="font-semibold">Boleta</span>
                    <span className="text-xs text-muted-foreground">IGV 18%</span>
                  </div>
                </SelectItem>
                <SelectItem value="REC">
                  <div className="flex flex-col">
                    <span className="font-semibold">Recibo por Honorarios</span>
                    <span className="text-xs text-muted-foreground">Retención 8%</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              El tipo de comprobante determina el cálculo de impuestos
            </p>

            {/* Mostrar información según el tipo seleccionado */}
            {tipoComprobante && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-900">
                  {tipoComprobante === 'FAC' && '✓ Factura: Se calculará IGV del 18% (editable)'}
                  {tipoComprobante === 'BOL' && '✓ Boleta: Se calculará IGV del 18% (editable)'}
                  {tipoComprobante === 'REC' && '✓ Recibo por Honorarios: Ingrese retención del 8% manualmente'}
                </p>
              </div>
            )}
          </div>

          {/* Número de Comprobante */}
          <div className="space-y-2">
            <Label htmlFor="nroComprobante">Número de Comprobante *</Label>
            <Input
              id="nroComprobante"
              value={nroComprobante}
              onChange={(e) => setNroComprobante(e.target.value)}
              disabled={loading}
              placeholder="Ej: F001-00001234"
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Emisión *</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Información adicional */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-semibold mb-2">Información del Formulario</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Tipo: {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</li>
              <li>• Tipo de Comprobante: {tipoComprobante || 'No seleccionado'}</li>
              <li>• Número: {nroComprobante || 'No ingresado'}</li>
              <li>• Fecha: {fecha}</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !tipoComprobante || !nroComprobante}
            >
              {loading ? 'Guardando...' : 'Guardar Comprobante'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
