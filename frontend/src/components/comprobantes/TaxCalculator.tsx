'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { Calculator, Edit2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

// ===================================
// COMPONENTE TAX CALCULATOR
// Feature: comprobantes-mejoras
// Requirements: 1.2, 1.4, 2.1, 2.2, 2.3
// ===================================

interface TaxCalculatorProps {
  montoNeto: number;
  tipoComprobante: string; // 'FAC', 'BOL', 'REC', etc.
  onTaxChange: (igv: number, total: number) => void;
  allowEdit?: boolean;
  initialIgv?: number;
}

/**
 * Componente para calcular y mostrar impuestos (IGV) en comprobantes
 * Feature: comprobantes-mejoras
 * Requirements: 1.2, 1.4, 2.1, 2.2, 2.3
 */
export function TaxCalculator({
  montoNeto,
  tipoComprobante,
  onTaxChange,
  allowEdit = true,
  initialIgv,
}: TaxCalculatorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [igvEditadoManualmente, setIgvEditadoManualmente] = useState(false);
  const [porcentajeManual, setPorcentajeManual] = useState<number>(0);

  // Usar el hook de cálculo de impuestos
  const {
    igv,
    total,
    porcentaje,
    esEditable,
    isLoading,
    error,
    setIgvManual,
    resetToAutomatic,
  } = useTaxCalculator({
    tipoComprobante,
    montoNeto,
    initialIgv,
    onTaxChange,
  });

  // Manejar cambio manual de porcentaje (para REC)
  const handlePorcentajeChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPorcentajeManual(numValue);

    // Calcular IGV basado en el porcentaje
    const igvCalculado = (montoNeto * numValue) / 100;
    setIgvManual(Number(igvCalculado.toFixed(2)));
    setIgvEditadoManualmente(true);
  };

  // Resetear a cálculo automático
  const handleReset = () => {
    resetToAutomatic();
    setIgvEditadoManualmente(false);
    setIsEditing(false);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Cálculo de Impuestos</h3>
          </div>
          <div className="flex items-center gap-2">
            {porcentaje > 0 && (
              <Badge variant="secondary" className="text-xs">
                {porcentaje}%
              </Badge>
            )}
            {igvEditadoManualmente && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                <Edit2 className="h-3 w-3 mr-1" />
                Editado
              </Badge>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Monto Neto (solo lectura) */}
        <div className="space-y-2">
          <Label htmlFor="montoNeto">Monto Neto</Label>
          <Input
            id="montoNeto"
            type="text"
            value={formatCurrency(montoNeto)}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Porcentaje de IGV (editable solo para REC) */}
        {tipoComprobante === 'REC' && allowEdit && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="porcentaje">
                Porcentaje de Impuesto (%)
              </Label>
              {igvEditadoManualmente && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-6 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Resetear
                </Button>
              )}
            </div>
            <Input
              id="porcentaje"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={porcentajeManual}
              onChange={(e) => handlePorcentajeChange(e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              placeholder="Ej: 8, 10, 18"
              className={`font-semibold ${isEditing ? 'border-primary' : ''}`}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Ingrese el porcentaje de retención para recibos por honorarios (generalmente 8% o 10%)
            </p>
          </div>
        )}

        {/* IGV calculado - EDITABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="igv">
              IGV {porcentaje > 0 && `(${porcentaje}%)`}
            </Label>
            {allowEdit && igvEditadoManualmente && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-6 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Resetear
              </Button>
            )}
          </div>
          {allowEdit ? (
            <Input
              id="igv"
              type="number"
              step="0.01"
              min="0"
              value={igv}
              onChange={(e) => {
                const nuevoIgv = parseFloat(e.target.value) || 0;
                setIgvManual(Number(nuevoIgv.toFixed(2)));
                setIgvEditadoManualmente(true);
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              className={`font-semibold ${isEditing ? 'border-primary' : ''}`}
              disabled={isLoading}
            />
          ) : (
            <Input
              id="igv"
              type="text"
              value={formatCurrency(igv)}
              disabled
              className="bg-muted font-semibold"
            />
          )}
          {(tipoComprobante === 'FAC' || tipoComprobante === 'BOL') && (
            <p className="text-xs text-muted-foreground">
              {allowEdit
                ? 'IGV calculado al 18%. Puede editarlo manualmente por redondeo SUNAT'
                : 'IGV fijo del 18% para facturas y boletas'}
            </p>
          )}
          {tipoComprobante === 'REC' && (
            <p className="text-xs text-muted-foreground">
              {allowEdit
                ? 'Monto calculado según el porcentaje. Puede editarlo manualmente'
                : 'Monto calculado según el porcentaje ingresado'}
            </p>
          )}
        </div>

        {/* Total (solo lectura, calculado automáticamente) */}
        <div className="space-y-2">
          <Label htmlFor="total">Total (Monto Neto + IGV)</Label>
          <Input
            id="total"
            type="text"
            value={formatCurrency(total)}
            disabled
            className="bg-muted font-bold text-lg"
          />
        </div>

        {/* Resumen visual */}
        <div className="pt-3 border-t space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto Neto:</span>
            <span>{formatCurrency(montoNeto)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              IGV ({porcentaje}%):
            </span>
            <span className="text-green-600">
              + {formatCurrency(igv)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-1 border-t">
            <span>Total a Pagar:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
