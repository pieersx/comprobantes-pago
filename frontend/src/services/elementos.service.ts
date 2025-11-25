import { apiClient, ApiResponse, handleApiError } from '@/lib/api';

/**
 * Tipo de elemento de catálogo
 */
export interface Elemento {
  codTab: string;
  codElem: string;
  denEle: string;
  denCorta?: string;
  vigente: string;
  denTab?: string;
}

/**
 * Tipo de comprobante
 */
export interface TipoComprobante {
  codigo: string;
  descripcion: string;
  descripcionCorta?: string;
}

/**
 * Servicio para gestión de elementos de catálogos
 * Feature: comprobantes-jerarquicos
 * Requirements: 2.1, 3.1
 */
export const elementosService = {
  /**
   * Obtiene todos los tipos de comprobante disponibles
   * Feature: comprobantes-jerarquicos
   * Requirements: 2.1, 3.1
   *
   * GET /api/v1/elementos/tipos-comprobante
   *
   * @returns Lista de tipos de comprobante (FAC, BOL, REC, etc.)
   */
  getTiposComprobante: async (): Promise<TipoComprobante[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        '/elementos/tipos-comprobante'
      );

      const elementos = response.data.data || response.data;

      // Mapear elementos a TipoComprobante
      return elementos.map((elem: Elemento) => ({
        codigo: elem.codElem,
        descripcion: elem.denEle,
        descripcionCorta: elem.denCorta,
      }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene todos los tipos de moneda disponibles
   *
   * GET /api/v1/elementos/monedas
   *
   * @returns Lista de tipos de moneda
   */
  getTiposMoneda: async (): Promise<TipoComprobante[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        '/elementos/monedas'
      );

      const elementos = response.data.data || response.data;

      return elementos.map((elem: Elemento) => ({
        codigo: elem.codElem,
        descripcion: elem.denEle,
        descripcionCorta: elem.denCorta,
      }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene elementos de una tabla específica
   *
   * GET /api/v1/elementos/tabla/{codTab}
   *
   * @param codTab - Código de la tabla
   * @returns Lista de elementos de la tabla
   */
  getElementosPorTabla: async (codTab: string): Promise<Elemento[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        `/elementos/tabla/${codTab}`
      );

      return response.data.data || response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
