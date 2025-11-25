import { taxCalculationService } from '@/services/tax-calculation.service';
import { TaxCalculation } from '@/types/comprobante';
import { useCallback, useEffect, useState } from 'react';

// ===================================
// HOOK PARA CÁLCULO DE IMPUESTOS
// Feature: comprobantes-mejoras
// Requirements: 1.2, 1.4, 2.1, 2.2, 2.3, 2.4
// ===================================

interface UseTaxCalculatorProps {
  tipoComprobante: string;
  montoNeto: number;
  initialIgv?: number;
  onTaxChange?: (igv: number, total: number) => void;
}

interface UseTaxCalculatorReturn {
  igv: number;
  total: number;
  porcentaje: number;
  esEditable: boolean;
  isLoading: boolean;
  error: string | null;
  setIgvManual: (igv: number) => void;
  recalcular: () => void;
  resetToAutomatic: () => void;
}

/**
 * Hook para gestionar el cálculo de impuestos en comprobantes
 * Feature: comprobantes-mejoras
 * Requirements: 1.2, 1.4, 2.1, 2.2, 2.3, 2.4
 *
 * @param tipoComprobante - Código del tipo de comprobante (FAC, BOL, REC, etc.)
 * @param montoNeto - Monto base sin impuestos
 * @param initialIgv - IGV inicial (opcional, para edición)
 * @param onTaxChange - Callback cuando cambian los valores de impuesto
 * @returns Estado y funciones para gestionar el cálculo de impuestos
 */
export const useTaxCalculator = ({
  tipoComprobante,
  montoNeto,
  initialIgv,
  onTaxChange,
}: UseTaxCalculatorProps): UseTaxCalculatorReturn => {
  const [igv, setIgv] = useState<number>(initialIgv || 0);
  const [total, setTotal] = useState<number>(montoNeto);
  const [porcentaje, setPorcentaje] = useState<number>(0);
  const [esEditable, setEsEditable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [igvEditadoManualmente, setIgvEditadoManualmente] = useState<boolean>(false);

  /**
   * Calcula el IGV automáticamente según el tipo de comprobante
   * Requirements: 1.2, 2.1
   */
  const calcularImpuestoAutomatico = useCallback(async () => {
    if (!tipoComprobante || montoNeto <= 0) {
      setIgv(0);
      setTotal(montoNeto);
      setPorcentaje(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado: TaxCalculation = await taxCalculationService.calculateTax(
        montoNeto,
        tipoComprobante
      );

      setIgv(resultado.igv);
      setTotal(resultado.total);
      setPorcentaje(resultado.porcentaje);
      setEsEditable(resultado.esEditable);

      // Notificar cambios
      if (onTaxChange) {
        onTaxChange(resultado.igv, resultado.total);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calcular impuesto';
      setError(errorMessage);
      console.error('Error calculando impuesto:', err);

      // Fallback: calcular localmente con 18% si es FAC o BOL
      if (tipoComprobante === 'FAC' || tipoComprobante === 'BOL') {
        const igvCalculado = taxCalculationService.calcularIGV(montoNeto, 18);
        const totalCalculado = montoNeto + igvCalculado;
        setIgv(igvCalculado);
        setTotal(totalCalculado);
        setPorcentaje(18);
        setEsEditable(false);

        if (onTaxChange) {
          onTaxChange(igvCalculado, totalCalculado);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [tipoComprobante, montoNeto, onTaxChange]);

  /**
   * Establece el IGV manualmente y recalcula el total
   * Requirements: 2.3
   */
  const setIgvManual = useCallback(
    (nuevoIgv: number) => {
      setIgv(nuevoIgv);
      const nuevoTotal = taxCalculationService.recalcularTotal(montoNeto, nuevoIgv);
      setTotal(nuevoTotal);
      setIgvEditadoManualmente(true);

      // Notificar cambios
      if (onTaxChange) {
        onTaxChange(nuevoIgv, nuevoTotal);
      }
    },
    [montoNeto, onTaxChange]
  );

  /**
   * Recalcula el total cuando cambia el monto neto
   * Requirements: 2.4
   */
  const recalcular = useCallback(() => {
    if (igvEditadoManualmente) {
      // Si el IGV fue editado manualmente, mantener el porcentaje
      const nuevoIgv = taxCalculationService.calcularIGV(montoNeto, porcentaje);
      setIgv(nuevoIgv);
      const nuevoTotal = montoNeto + nuevoIgv;
      setTotal(nuevoTotal);

      if (onTaxChange) {
        onTaxChange(nuevoIgv, nuevoTotal);
      }
    } else {
      // Si no fue editado, recalcular automáticamente
      calcularImpuestoAutomatico();
    }
  }, [igvEditadoManualmente, montoNeto, porcentaje, onTaxChange, calcularImpuestoAutomatico]);

  /**
   * Resetea el cálculo a automático
   * Requirements: 2.2
   */
  const resetToAutomatic = useCallback(() => {
    setIgvEditadoManualmente(false);
    calcularImpuestoAutomatico();
  }, [calcularImpuestoAutomatico]);

  /**
   * Efecto: Calcular impuesto cuando cambia el tipo de comprobante
   * Requirements: 1.2, 2.1
   */
  useEffect(() => {
    if (!igvEditadoManualmente) {
      calcularImpuestoAutomatico();
    }
  }, [tipoComprobante, calcularImpuestoAutomatico, igvEditadoManualmente]);

  /**
   * Efecto: Recalcular cuando cambia el monto neto
   * Requirements: 2.4
   */
  useEffect(() => {
    if (montoNeto > 0) {
      recalcular();
    } else {
      setIgv(0);
      setTotal(0);
    }
  }, [montoNeto, recalcular]);

  /**
   * Efecto: Establecer IGV inicial si se proporciona
   * Requirements: 2.3
   */
  useEffect(() => {
    if (initialIgv !== undefined && initialIgv > 0) {
      setIgvManual(initialIgv);
    }
  }, [initialIgv, setIgvManual]);

  return {
    igv,
    total,
    porcentaje,
    esEditable,
    isLoading,
    error,
    setIgvManual,
    recalcular,
    resetToAutomatic,
  };
};
