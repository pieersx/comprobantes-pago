/**
 * Extensiones del servicio de comprobantes para manejar:
 * - Rutas de archivos PDF
 * - TaxBreakdown en responses
 * - PartidaTreeNode en responses
 *
 * Este archivo extiende la funcionalidad del comprobantes.service.ts existente
 */

import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import {
    CompPagoCab,
    PartidaTreeNode,
    TaxBreakdown,
    VtaCompPagoCab
} from '@/types/comprobante';

// ===================================
// TIPOS EXTENDIDOS
// ===================================

/**
 * Comprobante de egreso con campos extendidos
 */
export interface CompPagoCabExtended extends CompPagoCab {
  fotoCpUrl?: string; // URL completa para descarga
  fotoAbonoUrl?: string; // URL completa para descarga
  hasFotoCp?: boolean;
  hasFotoAbono?: boolean;
  taxBreakdown?: TaxBreakdown;
}

/**
 * Comprobante de ingreso con campos extendidos
 */
export interface VtaCompPagoCabExtended extends VtaCompPagoCab {
  fotoCpUrl?: string;
  fotoAbonoUrl?: string;
  hasFotoCp?: boolean;
  hasFotoAbono?: boolean;
  taxBreakdown?: TaxBreakdown;
}

/**
 * Request para crear/actualizar comprobante con archivos
 */
export interface ComprobanteWithFilesRequest {
  comprobante: CompPagoCab | VtaCompPagoCab;
  fotoCpPath?: string; // Ruta del archivo subido
  fotoAbonoPath?: string; // Ruta del archivo subido
}

// ===================================
// SERVICIO DE CÁLCULO DE IMPUESTOS
// ===================================

export const taxCalculationService = {
  /**
   * Calcula el desglose de impuestos para un comprobante
   */
  calculateTaxBreakdown: async (
    subtotal: number,
    tipoComprobante: string,
    manualTax?: number
  ): Promise<TaxBreakdown> => {
    try {
      const response = await apiClient.post<ApiResponse<TaxBreakdown>>(
        '/tax-calculation/breakdown',
        {
          subtotal,
          tipoComprobante,
          manualTax,
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Calcula solo el IGV
   */
  calculateIGV: (subtotal: number): number => {
    return Number((subtotal * 0.18).toFixed(2));
  },

  /**
   * Calcula el total según el tipo de comprobante
   */
  calculateTotal: (
    subtotal: number,
    taxAmount: number,
    isRetention: boolean
  ): number => {
    const total = isRetention
      ? subtotal - taxAmount
      : subtotal + taxAmount;
    return Number(total.toFixed(2));
  },
};

// ===================================
// SERVICIO DE JERARQUÍA DE PARTIDAS
// ===================================

export const partidaHierarchyService = {
  /**
   * Obtiene el árbol de partidas
   */
  getPartidaTree: async (
    codCia: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaTreeNode[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PartidaTreeNode[]>>(
        `/partidas/tree?codCia=${codCia}&ingEgr=${ingEgr}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene solo las partidas hoja (seleccionables)
   */
  getLeafPartidas: async (
    codCia: number,
    ingEgr: 'I' | 'E',
    codProyecto?: number
  ): Promise<PartidaTreeNode[]> => {
    try {
      const url = codProyecto
        ? `/partidas/leaf?codCia=${codCia}&ingEgr=${ingEgr}&codProyecto=${codProyecto}`
        : `/partidas/leaf?codCia=${codCia}&ingEgr=${ingEgr}`;

      const response = await apiClient.get<ApiResponse<PartidaTreeNode[]>>(url);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene la ruta completa de una partida
   */
  getFullPath: async (
    codCia: number,
    ingEgr: 'I' | 'E',
    codPartida: number
  ): Promise<string> => {
    try {
      const response = await apiClient.get<ApiResponse<{ fullPath: string }>>(
        `/partidas/${codCia}/${ingEgr}/${codPartida}/path`
      );
      return response.data.data.fullPath;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// EXTENSIONES DE COMPROBANTES
// ===================================

export const comprobantesExtendedService = {
  /**
   * Crea un comprobante de egreso con archivos
   */
  createEgresoWithFiles: async (
    request: ComprobanteWithFilesRequest
  ): Promise<CompPagoCabExtended> => {
    try {
      const comprobanteData = {
        ...request.comprobante,
        fotoCp: request.fotoCpPath || request.comprobante.fotoCp,
        fotoAbono: request.fotoAbonoPath || request.comprobante.fotoAbono,
      };

      const response = await apiClient.post<ApiResponse<CompPagoCabExtended>>(
        '/comprobantes-pago',
        comprobanteData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza un comprobante de egreso con archivos
   */
  updateEgresoWithFiles: async (
    codCia: number,
    codProveedor: number,
    nroCp: string,
    request: ComprobanteWithFilesRequest
  ): Promise<CompPagoCabExtended> => {
    try {
      const comprobanteData = {
        ...request.comprobante,
        fotoCp: request.fotoCpPath || request.comprobante.fotoCp,
        fotoAbono: request.fotoAbonoPath || request.comprobante.fotoAbono,
      };

      const response = await apiClient.put<ApiResponse<CompPagoCabExtended>>(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`,
        comprobanteData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea un comprobante de ingreso con archivos
   */
  createIngresoWithFiles: async (
    request: ComprobanteWithFilesRequest
  ): Promise<VtaCompPagoCabExtended> => {
    try {
      const comprobanteData = {
        ...request.comprobante,
        fotoCp: request.fotoCpPath || request.comprobante.fotoCp,
        fotoAbono: request.fotoAbonoPath || request.comprobante.fotoAbono,
      };

      const response = await apiClient.post<ApiResponse<VtaCompPagoCabExtended>>(
        '/comprobantes-venta',
        comprobanteData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza un comprobante de ingreso con archivos
   */
  updateIngresoWithFiles: async (
    codCia: number,
    nroCp: string,
    request: ComprobanteWithFilesRequest
  ): Promise<VtaCompPagoCabExtended> => {
    try {
      const comprobanteData = {
        ...request.comprobante,
        fotoCp: request.fotoCpPath || request.comprobante.fotoCp,
        fotoAbono: request.fotoAbonoPath || request.comprobante.fotoAbono,
      };

      const response = await apiClient.put<ApiResponse<VtaCompPagoCabExtended>>(
        `/comprobantes-venta/${codCia}/${nroCp}`,
        comprobanteData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene un comprobante de egreso con información extendida
   */
  getEgresoExtended: async (
    codCia: number,
    codProveedor: number,
    nroCp: string
  ): Promise<CompPagoCabExtended> => {
    try {
      const response = await apiClient.get<ApiResponse<CompPagoCabExtended>>(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`
      );

      // Agregar URLs de descarga si existen archivos
      const data = response.data.data;
      if (data.fotoCp) {
        data.fotoCpUrl = `/api/v1/files/download/${data.fotoCp}`;
        data.hasFotoCp = true;
      }
      if (data.fotoAbono) {
        data.fotoAbonoUrl = `/api/v1/files/download/${data.fotoAbono}`;
        data.hasFotoAbono = true;
      }

      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene un comprobante de ingreso con información extendida
   */
  getIngresoExtended: async (
    codCia: number,
    nroCp: string
  ): Promise<VtaCompPagoCabExtended> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCabExtended>>(
        `/comprobantes-venta/${codCia}/${nroCp}`
      );

      // Agregar URLs de descarga si existen archivos
      const data = response.data.data;
      if (data.fotoCp) {
        data.fotoCpUrl = `/api/v1/files/download/${data.fotoCp}`;
        data.hasFotoCp = true;
      }
      if (data.fotoAbono) {
        data.fotoAbonoUrl = `/api/v1/files/download/${data.fotoAbono}`;
        data.hasFotoAbono = true;
      }

      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Exportar todo como un objeto para facilitar el uso
export default {
  tax: taxCalculationService,
  partidas: partidaHierarchyService,
  comprobantes: comprobantesExtendedService,
};
