import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import { TaxCalculation } from '@/types/comprobante';

// ===================================
// SERVICIO DE CÁLCULO DE IMPUESTOS
// Feature: comprobantes-mejoras
// Requirements: 1.2, 1.4, 2.1
// ===================================

/**
 * Servicio para cálculo de impuestos (IGV) en comprobantes
 */
export const taxCalculationService = {
  /**
   * Calcula el IGV automáticamente según el tipo de comprobante
   * Feature: comprobantes-mejoras
   * Requirements: 1.2, 2.1
   *
   * POST /api/v1/tax/calculate
   *
   * @param montoNeto - Monto base sin impuestos
   * @param tipoComprobante - Código del tipo de comprobante (FAC, BOL, REC, etc.)
   * @returns Cálculo de impuesto con porcentaje, IGV y total
   */
  calculateTax: async (
    montoNeto: number,
    tipoComprobante: string
  ): Promise<TaxCalculation> => {
    try {
      console.log(`📊 Calculando impuesto para ${tipoComprobante}, monto: ${montoNeto}`);
      const response = await apiClient.post<ApiResponse<TaxCalculation>>(
        '/tax/calculate',
        {
          montoNeto,
          tipoComprobante,
        }
      );
      console.log('✅ Impuesto calculado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al calcular impuesto:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Calcula el IGV con un porcentaje personalizado
   * Feature: comprobantes-mejoras
   * Requirements: 1.4
   *
   * POST /api/v1/tax/calculate-custom
   *
   * @param montoNeto - Monto base sin impuestos
   * @param porcentaje - Porcentaje de impuesto personalizado
   * @returns Cálculo de impuesto con el porcentaje especificado
   */
  calculateCustomTax: async (
    montoNeto: number,
    porcentaje: number
  ): Promise<TaxCalculation> => {
    try {
      console.log(`📊 Calculando impuesto personalizado: ${porcentaje}% sobre ${montoNeto}`);
      const response = await apiClient.post<ApiResponse<TaxCalculation>>(
        '/tax/calculate-custom',
        {
          montoNeto,
          porcentaje,
        }
      );
      console.log('✅ Impuesto personalizado calculado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al calcular impuesto personalizado:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene el porcentaje de impuesto por defecto para un tipo de comprobante
   * Feature: comprobantes-mejoras
   * Requirements: 1.2
   *
   * GET /api/v1/tax/percentage/{tipoComprobante}
   *
   * @param tipoComprobante - Código del tipo de comprobante (FAC, BOL, REC, etc.)
   * @returns Porcentaje de impuesto por defecto
   */
  getTaxPercentage: async (tipoComprobante: string): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        `/tax/percentage/${tipoComprobante}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Recalcula el total cuando se modifica manualmente el IGV
   * Feature: comprobantes-mejoras
   * Requirements: 2.3
   *
   * Esta función es local (no hace llamada al backend)
   *
   * @param montoNeto - Monto base sin impuestos
   * @param igvManual - IGV modificado manualmente
   * @returns Total recalculado
   */
  recalcularTotal: (montoNeto: number, igvManual: number): number => {
    return montoNeto + igvManual;
  },

  /**
   * Calcula el IGV a partir de un porcentaje
   * Feature: comprobantes-mejoras
   *
   * Esta función es local (no hace llamada al backend)
   *
   * @param montoNeto - Monto base sin impuestos
   * @param porcentaje - Porcentaje de impuesto
   * @returns IGV calculado
   */
  calcularIGV: (montoNeto: number, porcentaje: number): number => {
    return Number(((montoNeto * porcentaje) / 100).toFixed(2));
  },
};
