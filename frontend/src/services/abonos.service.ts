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
   * Validar que un valor numérico sea válido
   */
  private validarNumero(valor: number | undefined, nombre: string): void {
    if (valor === undefined || valor === null || isNaN(valor) || valor <= 0) {
      throw new Error(`${nombre} inválido: ${valor}`);
    }
  }

  /**
   * Registrar abono para un comprobante de egreso
   */
  async registrarAbonoEgreso(
    codCia: number,
    codProveedor: number,
    nroCP: string,
    abonoData: AbonoData
  ): Promise<void> {
    this.validarNumero(codCia, 'codCia');
    this.validarNumero(codProveedor, 'codProveedor');
    const response = await apiClient.post(
      `/abonos/egreso/${codCia}/${codProveedor}/${nroCP}`,
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
      `/abonos/ingreso/${codCia}/${nroCP}`,
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
    this.validarNumero(codCia, 'codCia');
    this.validarNumero(codProveedor, 'codProveedor');
    try {
      const response = await apiClient.get(
        `/abonos/egreso/${codCia}/${codProveedor}/${nroCP}`
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
        `/abonos/ingreso/${codCia}/${nroCP}`
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
    this.validarNumero(codCia, 'codCia');
    this.validarNumero(codProveedor, 'codProveedor');
    const response = await apiClient.put(
      `/abonos/egreso/${codCia}/${codProveedor}/${nroCP}/estado/${estado}`
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
      `/abonos/ingreso/${codCia}/${nroCP}/estado/${estado}`
    );
    return response.data;
  }

  // ==================== Métodos para Empleados ====================

  /**
   * Registrar abono para un comprobante de empleado
   */
  async registrarAbonoEmpleado(
    codCia: number,
    codEmpleado: number,
    nroCP: string,
    abonoData: AbonoData
  ): Promise<void> {
    const response = await apiClient.post(
      `/abonos/empleado/${codCia}/${codEmpleado}/${nroCP}`,
      abonoData
    );
    return response.data;
  }

  /**
   * Consultar abono de un comprobante de empleado
   */
  async consultarAbonoEmpleado(
    codCia: number,
    codEmpleado: number,
    nroCP: string
  ): Promise<AbonoData | null> {
    try {
      const response = await apiClient.get(
        `/abonos/empleado/${codCia}/${codEmpleado}/${nroCP}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cambiar estado de un comprobante de empleado
   */
  async cambiarEstadoEmpleado(
    codCia: number,
    codEmpleado: number,
    nroCP: string,
    estado: 'REG' | 'PAG' | 'ANU'
  ): Promise<void> {
    const response = await apiClient.put(
      `/abonos/empleado/${codCia}/${codEmpleado}/${nroCP}/estado/${estado}`
    );
    return response.data;
  }

  // ==================== Métodos para Actualizar Abonos ====================

  /**
   * Actualizar abono de un comprobante de egreso (modificar fecha/medio de pago)
   */
  async actualizarAbonoEgreso(
    codCia: number,
    codProveedor: number,
    nroCP: string,
    abonoData: Partial<AbonoData>
  ): Promise<void> {
    const response = await apiClient.put(
      `/abonos/egreso/${codCia}/${codProveedor}/${nroCP}`,
      abonoData
    );
    return response.data;
  }

  /**
   * Actualizar abono de un comprobante de ingreso (modificar fecha/medio de pago)
   */
  async actualizarAbonoIngreso(
    codCia: number,
    nroCP: string,
    abonoData: Partial<AbonoData>
  ): Promise<void> {
    const response = await apiClient.put(
      `/abonos/ingreso/${codCia}/${nroCP}`,
      abonoData
    );
    return response.data;
  }

  /**
   * Actualizar abono de un comprobante de empleado (modificar fecha/medio de pago)
   */
  async actualizarAbonoEmpleado(
    codCia: number,
    codEmpleado: number,
    nroCP: string,
    abonoData: Partial<AbonoData>
  ): Promise<void> {
    const response = await apiClient.put(
      `/abonos/empleado/${codCia}/${codEmpleado}/${nroCP}`,
      abonoData
    );
    return response.data;
  }
}

export const abonosService = new AbonosService();
