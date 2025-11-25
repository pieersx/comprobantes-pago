'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMontoCalculator } from '@/hooks/useMontoCalculator';
import { useEffect, useState } from 'react';

interface MontoCalculatorProps {
  impNetoMn: number;
  onCalculate: (resultado: { impNetoMn: number; impIgvMn: number; impTotalMn: number }) => void;
  readonly?: boolean;
  label?: string;
  porcentajeImpuesto?: number; // Porcentaje de impuesto a aplicar (por defecto 18%)
}

/**
 * Componente para calcular IGV y totales
 * El profesor requiere que TODOS los campos sean editables
 * Calcula el IGV según el porcentaje configurado (18% para facturas/boletas, variable para recibos)
 *
 * @param impNetoMn - Importe neto inicial
 * @param onCalculate - Callback que se ejecuta cuando cambian los montos
 * @param readonly - Si es true, los campos son de solo lectura
 * @param label - Etiqueta personalizada para el campo de importe neto
 * @param porcentajeImpuesto - Porcentaje de impuesto a aplicar (default: 18%)
 */
export function MontoCalculator({
  impNetoMn,
  onCalculate,
  readonly = false,
  label = 'Importe Neto',
  porcentajeImpuesto = 18.0,
}: MontoCalculatorProps) {
  const { calcularDesdeNeto, formatearMonto } = useMontoCalculator();
  const [neto, setNeto] = useState<string>(impNetoMn.toFixed(2));
  const [igv, setIgv] = useState<string>('0.00');
  const [total, setTotal] = useState<string>('0.00');

  // Recalcular cuando cambia el neto (auto-cálculo con porcentaje)
  const recalcularDesdeNeto = () => {
    const netoNum = parseFloat(neto) || 0;
    const igvCalculado = netoNum * (porcentajeImpuesto / 100);
    const totalCalculado = netoNum + igvCalculado;

    setIgv(igvCalculado.toFixed(2));
    setTotal(totalCalculado.toFixed(2));

    onCalculate({
      impNetoMn: netoNum,
      impIgvMn: igvCalculado,
      impTotalMn: totalCalculado,
    });
  };

  // Auto-calcular cuando cambia el neto
  useEffect(() => {
    recalcularDesdeNeto();
  }, [neto, porcentajeImpuesto]);

  // Sincronizar con prop externa
  useEffect(() => {
    setNeto(impNetoMn.toFixed(2));
  }, [impNetoMn]);

  const handleNetoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir números con hasta 2 decimales
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setNeto(value);
    }
  };

  const handleNetoBlur = () => {
    // Formatear al perder el foco
    const netoNum = parseFloat(neto) || 0;
    setNeto(netoNum.toFixed(2));
  };

  const handleIgvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setIgv(value);
      // Recalcular total cuando cambia IGV manualmente
      const netoNum = parseFloat(neto) || 0;
      const igvNum = parseFloat(value) || 0;
      const totalCalculado = netoNum + igvNum;
      setTotal(totalCalculado.toFixed(2));

      onCalculate({
        impNetoMn: netoNum,
        impIgvMn: igvNum,
        impTotalMn: totalCalculado,
      });
    }
  };

  const handleIgvBlur = () => {
    const igvNum = parseFloat(igv) || 0;
    setIgv(igvNum.toFixed(2));
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setTotal(value);
      // Recalcular IGV cuando cambia Total manualmente
      const netoNum = parseFloat(neto) || 0;
      const totalNum = parseFloat(value) || 0;
      const igvCalculado = totalNum - netoNum;
      setIgv(igvCalculado.toFixed(2));

      onCalculate({
        impNetoMn: netoNum,
        impIgvMn: igvCalculado,
        impTotalMn: totalNum,
      });
    }
  };

  const handleTotalBlur = () => {
    const totalNum = parseFloat(total) || 0;
    setTotal(totalNum.toFixed(2));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Importe Neto */}
      <div className="space-y-2">
        <Label htmlFor="impNetoMn">{label}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            S/
          </span>
          <Input
            id="impNetoMn"
            type="text"
            value={neto}
            onChange={handleNetoChange}
            onBlur={handleNetoBlur}
            disabled={readonly}
            className="pl-10"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* IGV - EDITABLE según profesor */}
      <div className="space-y-2">
        <Label htmlFor="impIgvMn">IGV ({porcentajeImpuesto.toFixed(2)}%)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            S/
          </span>
          <Input
            id="impIgvMn"
            type="text"
            value={igv}
            onChange={handleIgvChange}
            onBlur={handleIgvBlur}
            disabled={readonly}
            className="pl-10"
            placeholder="0.00"
          />
        </div>
        <p className="text-xs text-muted-foreground">Editable manualmente</p>
      </div>

      {/* Total - EDITABLE según profesor */}
      <div className="space-y-2">
        <Label htmlFor="impTotalMn" className="font-semibold">
          Total
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            S/
          </span>
          <Input
            id="impTotalMn"
            type="text"
            value={total}
            onChange={handleTotalChange}
            onBlur={handleTotalBlur}
            disabled={readonly}
            className="pl-10 font-semibold"
            placeholder="0.00"
          />
        </div>
        <p className="text-xs text-muted-foreground">Editable manualmente</p>
      </div>
    </div>
  );
}
