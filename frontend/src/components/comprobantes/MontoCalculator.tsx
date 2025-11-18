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
}

/**
 * Componente para calcular automáticamente IGV y totales
 * Calcula el IGV (18%) y el total a partir del importe neto
 *
 * @param impNetoMn - Importe neto inicial
 * @param onCalculate - Callback que se ejecuta cuando cambian los montos
 * @param readonly - Si es true, los campos son de solo lectura
 * @param label - Etiqueta personalizada para el campo de importe neto
 */
export function MontoCalculator({
  impNetoMn,
  onCalculate,
  readonly = false,
  label = 'Importe Neto',
}: MontoCalculatorProps) {
  const { calcularDesdeNeto, formatearMonto } = useMontoCalculator();
  const [neto, setNeto] = useState<string>(impNetoMn.toFixed(2));
  const [igv, setIgv] = useState<string>('0.00');
  const [total, setTotal] = useState<string>('0.00');

  // Calcular IGV y total cuando cambia el neto
  useEffect(() => {
    const netoNum = parseFloat(neto) || 0;
    const resultado = calcularDesdeNeto(netoNum);

    setIgv(resultado.impIgvMn.toFixed(2));
    setTotal(resultado.impTotalMn.toFixed(2));

    onCalculate(resultado);
  }, [neto, calcularDesdeNeto, onCalculate]);

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

      {/* IGV (18%) - Solo lectura */}
      <div className="space-y-2">
        <Label htmlFor="impIgvMn">IGV (18%)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            S/
          </span>
          <Input
            id="impIgvMn"
            type="text"
            value={igv}
            disabled
            className="pl-10 bg-muted"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Total - Solo lectura */}
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
            disabled
            className="pl-10 bg-muted font-semibold"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}
