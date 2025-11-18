import { useCallback } from 'react';

// Constante para el IGV (18%)
const IGV_RATE = 0.18;

// Resultado del cálculo de montos
export interface CalculoMonto {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
}

// Resultado del cálculo con conversión de moneda
export interface CalculoMontoConversion {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  impNetoMe: number; // Monto en moneda extranjera
  impIgvMe: number;
  impTotalMe: number;
}

/**
 * Hook para cálculos automáticos de montos e IGV
 */
export function useMontoCalculator() {
  /**
   * Calcula el IGV y el total a partir del importe neto
   * @param impNetoMn - Importe neto en moneda nacional
   * @returns Objeto con neto, IGV y total calculados
   */
  const calcularDesdeNeto = useCallback((impNetoMn: number): CalculoMonto => {
    const neto = Number(impNetoMn) || 0;
    const igv = neto * IGV_RATE;
    const total = neto + igv;

    return {
      impNetoMn: Number(neto.toFixed(2)),
      impIgvMn: Number(igv.toFixed(2)),
      impTotalMn: Number(total.toFixed(2)),
    };
  }, []);

  /**
   * Calcula el neto y el IGV a partir del total
   * @param impTotalMn - Importe total en moneda nacional
   * @returns Objeto con neto, IGV y total calculados
   */
  const calcularDesdeTotal = useCallback((impTotalMn: number): CalculoMonto => {
    const total = Number(impTotalMn) || 0;
    const neto = total / (1 + IGV_RATE);
    const igv = total - neto;

    return {
      impNetoMn: Number(neto.toFixed(2)),
      impIgvMn: Number(igv.toFixed(2)),
      impTotalMn: Number(total.toFixed(2)),
    };
  }, []);

  /**
   * Calcula el total del comprobante sumando todas las partidas
   * @param detalles - Array de detalles con montos
   * @returns Total del comprobante
   */
  const calcularTotalComprobante = useCallback(
    (
      detalles: Array<{
        impNetoMn: number;
        impIgvMn: number;
        impTotalMn: number;
      }>
    ): CalculoMonto => {
      const impNetoMn = detalles.reduce((sum, d) => sum + (d.impNetoMn || 0), 0);
      const impIgvMn = detalles.reduce((sum, d) => sum + (d.impIgvMn || 0), 0);
      const impTotalMn = detalles.reduce((sum, d) => sum + (d.impTotalMn || 0), 0);

      return {
        impNetoMn: Number(impNetoMn.toFixed(2)),
        impIgvMn: Number(impIgvMn.toFixed(2)),
        impTotalMn: Number(impTotalMn.toFixed(2)),
      };
    },
    []
  );

  /**
   * Convierte montos de moneda extranjera a moneda nacional
   * @param impNetoMe - Importe neto en moneda extranjera
   * @param tipCambio - Tipo de cambio
   * @returns Objeto con montos en ambas monedas
   */
  const convertirMoneda = useCallback(
    (impNetoMe: number, tipCambio: number): CalculoMontoConversion => {
      const netoMe = Number(impNetoMe) || 0;
      const tc = Number(tipCambio) || 1;

      // Calcular en moneda extranjera
      const igvMe = netoMe * IGV_RATE;
      const totalMe = netoMe + igvMe;

      // Convertir a moneda nacional
      const netoMn = netoMe * tc;
      const igvMn = igvMe * tc;
      const totalMn = totalMe * tc;

      return {
        impNetoMn: Number(netoMn.toFixed(2)),
        impIgvMn: Number(igvMn.toFixed(2)),
        impTotalMn: Number(totalMn.toFixed(2)),
        impNetoMe: Number(netoMe.toFixed(2)),
        impIgvMe: Number(igvMe.toFixed(2)),
        impTotalMe: Number(totalMe.toFixed(2)),
      };
    },
    []
  );

  /**
   * Convierte montos de moneda nacional a moneda extranjera
   * @param impNetoMn - Importe neto en moneda nacional
   * @param tipCambio - Tipo de cambio
   * @returns Objeto con montos en ambas monedas
   */
  const convertirAMonedaExtranjera = useCallback(
    (impNetoMn: number, tipCambio: number): CalculoMontoConversion => {
      const netoMn = Number(impNetoMn) || 0;
      const tc = Number(tipCambio) || 1;

      // Calcular en moneda nacional
      const igvMn = netoMn * IGV_RATE;
      const totalMn = netoMn + igvMn;

      // Convertir a moneda extranjera
      const netoMe = netoMn / tc;
      const igvMe = igvMn / tc;
      const totalMe = totalMn / tc;

      return {
        impNetoMn: Number(netoMn.toFixed(2)),
        impIgvMn: Number(igvMn.toFixed(2)),
        impTotalMn: Number(totalMn.toFixed(2)),
        impNetoMe: Number(netoMe.toFixed(2)),
        impIgvMe: Number(igvMe.toFixed(2)),
        impTotalMe: Number(totalMe.toFixed(2)),
      };
    },
    []
  );

  /**
   * Valida que un monto sea válido (positivo y no cero)
   * @param monto - Monto a validar
   * @returns true si el monto es válido
   */
  const validarMonto = useCallback((monto: number): boolean => {
    return !isNaN(monto) && monto > 0;
  }, []);

  /**
   * Formatea un monto para mostrar con 2 decimales
   * @param monto - Monto a formatear
   * @param moneda - Código de moneda (PEN, USD, etc.)
   * @returns Monto formateado como string
   */
  const formatearMonto = useCallback(
    (monto: number, moneda: string = 'PEN'): string => {
      const simbolo = moneda === 'USD' ? '$' : 'S/';
      return `${simbolo} ${Number(monto).toFixed(2)}`;
    },
    []
  );

  /**
   * Calcula el IGV de un monto (sin incluirlo en el total)
   * @param monto - Monto base
   * @returns IGV calculado
   */
  const calcularIGV = useCallback((monto: number): number => {
    return Number((monto * IGV_RATE).toFixed(2));
  }, []);

  /**
   * Calcula el total incluyendo IGV
   * @param monto - Monto base
   * @returns Total con IGV incluido
   */
  const calcularTotalConIGV = useCallback((monto: number): number => {
    return Number((monto * (1 + IGV_RATE)).toFixed(2));
  }, []);

  return {
    calcularDesdeNeto,
    calcularDesdeTotal,
    calcularTotalComprobante,
    convertirMoneda,
    convertirAMonedaExtranjera,
    validarMonto,
    formatearMonto,
    calcularIGV,
    calcularTotalConIGV,
    IGV_RATE,
  };
}
