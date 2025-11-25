'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

// ===================================
// COMPONENTE DETALLE COMPROBANTE TABLE
// Feature: comprobantes-mejoras
// Requirements: 4.1, 4.2, 4.4, 4.5
// ===================================

interface DetalleComprobante {
  sec: number;
  codPartida: number;
  desPartida: string;
  montoNeto: number;
  igv: number;
  total: number;
}

interface DetalleComprobanteTableProps {
  detalles: DetalleComprobante[];
  onAgregarDetalle: () => void;
  onEliminarDetalle: (sec: number) => void;
  onActualizarDetalle: (sec: number, campo: keyof DetalleComprobante, valor: any) => void;
  readonly?: boolean;
  partidasSeleccionadas?: number[];
}

/**
 * Componente tabla para gestionar detalles de comprobante
 * Feature: comprobantes-mejoras
 * Requirements: 4.1, 4.2, 4.4, 4.5
 */
export function DetalleComprobanteTable({
  detalles,
  onAgregarDetalle,
  onEliminarDetalle,
  onActualizarDetalle,
  readonly = false,
  partidasSeleccionadas = [],
}: DetalleComprobanteTableProps) {
  const [errores, setErrores] = useState<Record<number, string>>({});

  // Validar partidas duplicadas (Requirement 4.2)
  const validarPartidaDuplicada = (codPartida: number, secActual: number): boolean => {
    return detalles.some(
      (d) => d.codPartida === codPartida && d.sec !== secActual
    );
  };

  // Calcular totales (Requirements 4.4, 4.5)
  const calcularTotales = () => {
    const sumaMontoNeto = detalles.reduce((sum, d) => sum + d.montoNeto, 0);
    const sumaIgv = detalles.reduce((sum, d) => sum + d.igv, 0);
    const sumaTotal = detalles.reduce((sum, d) => sum + d.total, 0);

    return {
      montoNeto: Number(sumaMontoNeto.toFixed(2)),
      igv: Number(sumaIgv.toFixed(2)),
      total: Number(sumaTotal.toFixed(2)),
    };
  };

  const handleActualizarMonto = (sec: number, valor: string) => {
    const monto = parseFloat(valor) || 0;
    onActualizarDetalle(sec, 'montoNeto', monto);
  };

  const handleActualizarIgv = (sec: number, valor: string) => {
    const igv = parseFloat(valor) || 0;
    onActualizarDetalle(sec, 'igv', igv);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Detalle de Partidas</h3>
        {!readonly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAgregarDetalle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Partida
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Partida</TableHead>
              <TableHead className="text-right w-[150px]">Monto Neto</TableHead>
              <TableHead className="text-right w-[150px]">IGV</TableHead>
              <TableHead className="text-right w-[150px]">Total</TableHead>
              {!readonly && <TableHead className="w-[80px]">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={readonly ? 6 : 7}
                  className="text-center text-muted-foreground py-8"
                >
                  No hay partidas agregadas. Haz clic en "Agregar Partida" para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              detalles.map((detalle, index) => {
                const esDuplicada = validarPartidaDuplicada(detalle.codPartida, detalle.sec);

                return (
                  <TableRow
                    key={detalle.sec}
                    className={esDuplicada ? 'bg-destructive/10' : ''}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{detalle.codPartida}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{detalle.desPartida}</div>
                        {esDuplicada && (
                          <div className="text-xs text-destructive mt-1">
                            ⚠️ Partida duplicada
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {readonly ? (
                        formatCurrency(detalle.montoNeto)
                      ) : (
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.montoNeto}
                          onChange={(e) => handleActualizarMonto(detalle.sec, e.target.value)}
                          className="text-right"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {readonly ? (
                        formatCurrency(detalle.igv)
                      ) : (
                        <Input
                          type="number"
                          step="0.01"
                          value={detalle.igv}
                          onChange={(e) => handleActualizarIgv(detalle.sec, e.target.value)}
                          className="text-right"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(detalle.total)}
                    </TableCell>
                    {!readonly && (
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEliminarDetalle(detalle.sec)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {detalles.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">
                  TOTALES:
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totales.montoNeto)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totales.igv)}
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {formatCurrency(totales.total)}
                </TableCell>
                {!readonly && <TableCell />}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Validaciones */}
      {detalles.some((d) => validarPartidaDuplicada(d.codPartida, d.sec)) && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          ⚠️ Hay partidas duplicadas en el detalle. Por favor, elimine los duplicados antes de guardar.
        </div>
      )}
    </div>
  );
}
