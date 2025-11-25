'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IGVCalculatorProps {
  montoBase: number;
  tipoComprobante: string; // 'FAC', 'BOL', 'REC', 'OTR'
  onCalculate: (igv: number, total: number) => void;
  editable?: boolean;
  initialIgv?: number;
}

/**
 * Componente para calcular IGV automáticamente según tipo de comprobante
 * Feature: comprobantes-jerarquicos
 * Requirements: 2.2, 2.3, 2.4, 2.5
 *
 * - FAC y BOL: Calcula IGV = montoBase * 0.18 (fijo, no editable)
 * - REC: Muestra input para que usuario ingrese porcentaje de IGV manualmente
 * - REC: Calcula IGV = montoBase * (porcentajeIgv / 100)
 * - OTR: Sin IGV (0)
 *
 * @param montoBase - Monto base sin impuestos
 * @param tipoComprobante - Tipo de comprobante (FAC, BOL, REC, OTR)
 * @param onCalculate - Callback con IGV y total calculados
 * @param editable - Si es true, permite editar el IGV manualmente
 * @param initialIgv - IGV inicial (para edición)
 */
export function IGVCalculator({
  montoBase,
  tipoComprobante,
  onCalculate,
  editable = true,
  initialIgv,
}: IGVCalculatorProps) {
  const [porcentajeManual, setPorcentajeManual] = useState<number>(8); // 8% por defecto para REC
  const [igvCalculado, setIgvCalculado] = useState<number>(0);
  const [totalCalculado, setTotalCalculado] = useState<number>(0);

  const [inconsistente, setInconsistente] = useState<boolean>(false);

  // Calcular IGV y total cuando cambian los valores
  useEffect(() => {
    let igv = 0;
    let total = montoBase;

    switch (tipoComprobante) {
      case 'FAC':
      case 'BOL':
        // IGV fijo del 18%
        igv = montoBase * 0.18;
        total = montoBase + igv;
        break;

      case 'REC':
        // IGV manual según porcentaje ingresado por el usuario
        igv = montoBase * (porcentajeManual / 100);
        total = montoBase + igv;
        break;

      case 'OTR':
        // Sin IGV
        igv = 0;
        total = montoBase;
        break;

      default:
        igv = 0;
        total = montoBase;
    }

    // Redondear a 2 decimales
    igv = Math.round(igv * 100) / 100;
    total = Math.round(total * 100) / 100;

    setIgvCalculado(igv);
    setTotalCalculado(total);

    // Validar consistencia: total = subtotal + IGV (con tolerancia de 0.01)
    // Feature: comprobantes-jerarquicos, Requirements: 3.5
    const totalEsperado = Math.round((montoBase + igv) * 100) / 100;
    const diferencia = Math.abs(total - totalEsperado);
    const esInconsistente = diferencia > 0.01;
    setInconsistente(esInconsistente);

    if (esInconsistente) {
      console.warn(
        `⚠️ Inconsistencia detectada: Total calculado (${total}) != Subtotal + IGV (${totalEsperado}). Diferencia: ${diferencia}`
      );
    }

    // Notificar al componente padre
    onCalculate(igv, total);
  }, [montoBase, tipoComprobante, porcentajeManual, onCalculate]);

  const formatearMonto = (monto: number): string => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const [errorPorcentaje, setErrorPorcentaje] = useState<string>('');

  const handlePorcentajeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value);

    // Validar que el porcentaje sea un número válido entre 0 y 100
    // Feature: comprobantes-jerarquicos, Requirements: 3.5
    if (isNaN(valor)) {
      setErrorPorcentaje('Debe ingresar un número válido');
      return;
    }

    if (valor < 0) {
      setErrorPorcentaje('El porcentaje no puede ser negativo');
      return;
    }

    if (valor > 100) {
      setErrorPorcentaje('El porcentaje no puede ser mayor a 100');
      return;
    }

    setErrorPorcentaje('');
    setPorcentajeManual(valor);
  };

  const esEditable = tipoComprobante === 'REC' && editable;
  const mostrarPorcentaje = tipoComprobante === 'REC';

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-4">
        {/* Título */}
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Cálculo de Impuestos</h3>
        </div>

        {/* Monto Base */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Subtotal (Base):</span>
          <span className="font-mono font-semibold text-right">
            {formatearMonto(montoBase)}
          </span>
        </div>

        {/* Porcentaje de IGV (solo para REC) */}
        {mostrarPorcentaje && (
          <div className="space-y-2">
            <Label htmlFor="porcentaje-igv" className={errorPorcentaje ? 'text-destructive' : ''}>
              Porcentaje de Retención (%)
            </Label>
            <Input
              id="porcentaje-igv"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={porcentajeManual}
              onChange={handlePorcentajeChange}
              disabled={!esEditable}
              className={`font-mono ${errorPorcentaje ? 'border-destructive' : ''}`}
            />
            {errorPorcentaje ? (
              <p className="text-xs text-destructive">{errorPorcentaje}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ingrese el porcentaje de retención (típicamente 8% para honorarios)
              </p>
            )}
          </div>
        )}

        {/* IGV Calculado */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">
            {tipoComprobante === 'REC' ? 'Retención' : 'IGV'} (
            {tipoComprobante === 'FAC' || tipoComprobante === 'BOL'
              ? '18%'
              : tipoComprobante === 'REC'
              ? `${porcentajeManual}%`
              : '0%'}
            ):
          </span>
          <span className="font-mono font-semibold text-right text-primary">
            {formatearMonto(igvCalculado)}
          </span>
        </div>

        {/* Separador */}
        <div className="border-t border-border" />

        {/* Total */}
        <div className="grid grid-cols-2 gap-2">
          <span className="font-semibold">Total:</span>
          <span className="font-mono font-bold text-right text-lg">
            {formatearMonto(totalCalculado)}
          </span>
        </div>

        {/* Advertencia de inconsistencia */}
        {inconsistente && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-xs text-destructive font-medium">
              ⚠️ Advertencia: Los valores son inconsistentes. El total no coincide con la suma del subtotal + IGV.
            </p>
          </div>
        )}

        {/* Información adicional según tipo */}
        <div className="text-xs text-muted-foreground">
          {tipoComprobante === 'FAC' && (
            <p>✓ Factura con IGV del 18% (fijo)</p>
          )}
          {tipoComprobante === 'BOL' && (
            <p>✓ Boleta con IGV del 18% (fijo)</p>
          )}
          {tipoComprobante === 'REC' && (
            <p>✓ Recibo por Honorarios con retención manual</p>
          )}
          {tipoComprobante === 'OTR' && (
            <p>✓ Otro documento sin impuestos</p>
          )}
        </div>
      </div>
    </Card>
  );
}
