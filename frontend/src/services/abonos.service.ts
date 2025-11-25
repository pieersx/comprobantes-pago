// frontend/src/services/abonos.service.ts

import { apiClient } from '@/lib/api';

export interface AbonoData {
  fechaAbono: string; // ISO date string
  descripcionMedioPago: string;
  montoAbono?: number; // Opcional, no se usa en este diseño simplificado
  fotoAbono?: string;
}

/**
 * Servicio para gestión de abonos de comprobantes
 */
class AbonosService {
  /**
   * Registrar abono para un comprobante de egreso
   */
  async registrarAbonoEgreso(
    codCia: number,
    codProveedor: number,
    nroCP: string,
    abonoData: AbonoData
  ): Promise<void> {
    const response = await apiClient.post(
      `/api/v1/abonos/egreso/${codCia}/${codProveedor}/${nroCP}`,
      abonoData
    );
    return response.data;
  }

  /**
   * Registrar abono para un comprobante de ingreso
   */
  async registrarAbonoIngreso(
    codCia: number,
    nroCP: string,
    abonoData: AbonoData
  ): Promise<void> {
    const response = await apiClient.post(
      `/api/v1/abonos/ingreso/${codCia}/${nroCP}`,
      abonoData
    );
    return response.data;
  }

  /**
   * Consultar abono de un comprobante de egreso
   */
  async consultarAbonoEgreso(
    codCia: number,
    codProveedor: number,
    nroCP: string
  ): Promise<AbonoData | null> {
    try {
      const response = await apiClient.get(
        `/api/v1/abonos/egreso/${codCia}/${codProveedor}/${nroCP}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Consultar abono de un comprobante de ingreso
   */
  async consultarAbonoIngreso(
    codCia: number,
    nroCP: string
  ): Promise<AbonoData | null> {
    try {
      const response = await apiClient.get(
        `/api/v1/abonos/ingreso/${codCia}/${nroCP}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cambiar estado de un comprobante de egreso
   */
  async cambiarEstadoEgreso(
    codCia: number,
    codProveedor: number,
    nroCP: string,
    estado: 'REG' | 'PAG' | 'ANU'
  ): Promise<void> {
    const response = await apiClient.put(
      `/api/v1/abonos/egreso/${codCia}/${codProveedor}/${nroCP}/estado/${estado}`
    );
    return response.data;
  }

  /**
   * Cambiar estado de un comprobante de ingreso
   */
  async cambiarEstadoIngreso(
    codCia: number,
    nroCP: string,
    estado: 'REG' | 'PAG' | 'ANU'
  ): Promise<void> {
    const response = await apiClient.put(
      `/api/v1/abonos/ingreso/${codCia}/${nroCP}/estado/${estado}`
    );
    return response.data;
  }
}

export const abonosService = new AbonosService();
