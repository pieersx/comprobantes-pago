import { apiClient } from '@/lib/api/client';
import {
    ComprobantePagoEmpleado,
    ComprobantePagoEmpleadoCreate,
    ComprobantePagoEmpleadoDet,
    ComprobantePagoEmpleadoDetCreate,
    ComprobantePagoEmpleadoDetUpdate,
    ComprobantePagoEmpleadoUpdate
} from '@/types/comprobante-empleado';

/**
 * Servicio para gestión de comprobantes de pago a empleados
 * Feature: empleados-comprobantes-blob
 */
export const comprobantesEmpleadoService = {
  /**
   * GET /api/comprobantes-empleado?codCia={codCia}
   * Lista todos los comprobantes de empleados
   */
  getAll: async (codCia: number): Promise<ComprobantePagoEmpleado[]> => {
    const response = await apiClient.get<{ data: ComprobantePagoEmpleado[] }>(
      `/comprobantes-empleado?codCia=${codCia}`
    );
    return response.data;
  },

  /**
   * GET /api/comprobantes-empleado?codCia={codCia}&codEmpleado={codEmpleado}
   * Lista comprobantes de un empleado específico
   */
  getByEmpleado: async (codCia: number, codEmpleado: number): Promise<ComprobantePagoEmpleado[]> => {
    const response = await apiClient.get<{ data: ComprobantePagoEmpleado[] }>(
      `/comprobantes-empleado?codCia=${codCia}&codEmpleado=${codEmpleado}`
    );
    return response.data;
  },

  /**
   * GET /api/comprobantes-empleado?codCia={codCia}&codPyto={codPyto}
   * Lista comprobantes de un proyecto específico
   */
  getByProyecto: async (codCia: number, codPyto: number): Promise<ComprobantePagoEmpleado[]> => {
    const response = await apiClient.get<{ data: ComprobantePagoEmpleado[] }>(
      `/comprobantes-empleado?codCia=${codCia}&codPyto=${codPyto}`
    );
    return response.data;
  },

  /**
   * GET /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}
   * Obtiene un comprobante por su ID compuesto
   */
  getById: async (codCia: number, codEmpleado: number, nroCp: string): Promise<ComprobantePagoEmpleado> => {
    const response = await apiClient.get<{ data: ComprobantePagoEmpleado }>(
      `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}`
    );
    return response.data;
  },

  /**
   * POST /api/comprobantes-empleado
   * Crea un nuevo comprobante
   */
  create: async (comprobante: ComprobantePagoEmpleadoCreate): Promise<ComprobantePagoEmpleado> => {
    const response = await apiClient.post<{ data: ComprobantePagoEmpleado }>(
      '/comprobantes-empleado',
      comprobante
    );
    return response.data;
  },

  /**
   * PUT /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}
   * Actualiza un comprobante existente
   */
  update: async (
    codCia: number,
    codEmpleado: number,
    nroCp: string,
    comprobante: ComprobantePagoEmpleadoUpdate
  ): Promise<ComprobantePagoEmpleado> => {
    const response = await apiClient.put<{ data: ComprobantePagoEmpleado }>(
      `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}`,
      comprobante
    );
    return response.data;
  },

  /**
   * DELETE /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}
   * Anula un comprobante
   */
  anular: async (codCia: number, codEmpleado: number, nroCp: string): Promise<void> => {
    await apiClient.delete(`/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}`);
  },

  // ==================== Métodos de Imágenes BLOB ====================

  /**
   * POST /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/foto-cp
   * Sube la imagen del comprobante
   */
  uploadFotoCp: async (codCia: number, codEmpleado: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-cp`,
      { method: 'POST', body: formData }
    );
  },

  /**
   * GET URL de la imagen del comprobante
   */
  getFotoCpUrl: (codCia: number, codEmpleado: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-cp`;
  },

  /**
   * DELETE /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/foto-cp
   * Elimina la imagen del comprobante
   */
  deleteFotoCp: async (codCia: number, codEmpleado: number, nroCp: string): Promise<void> => {
    await apiClient.delete(`/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-cp`);
  },

  /**
   * POST /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/foto-abono
   * Sube la imagen del abono
   */
  uploadFotoAbono: async (codCia: number, codEmpleado: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-abono`,
      { method: 'POST', body: formData }
    );
  },

  /**
   * GET URL de la imagen del abono
   */
  getFotoAbonoUrl: (codCia: number, codEmpleado: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-abono`;
  },

  /**
   * DELETE /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/foto-abono
   * Elimina la imagen del abono
   */
  deleteFotoAbono: async (codCia: number, codEmpleado: number, nroCp: string): Promise<void> => {
    await apiClient.delete(`/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/foto-abono`);
  },

  // ==================== Métodos de Detalles (COMP_PAGOEMPLEADO_DET) ====================

  /**
   * GET /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/detalles
   * Lista todos los detalles de un comprobante
   */
  getDetalles: async (codCia: number, codEmpleado: number, nroCp: string): Promise<ComprobantePagoEmpleadoDet[]> => {
    const response = await apiClient.get<{ data: ComprobantePagoEmpleadoDet[] }>(
      `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/detalles`
    );
    return response.data;
  },

  /**
   * POST /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/detalles
   * Agrega un nuevo detalle al comprobante
   */
  addDetalle: async (
    codCia: number,
    codEmpleado: number,
    nroCp: string,
    detalle: ComprobantePagoEmpleadoDetCreate
  ): Promise<ComprobantePagoEmpleadoDet> => {
    const response = await apiClient.post<{ data: ComprobantePagoEmpleadoDet }>(
      `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/detalles`,
      detalle
    );
    return response.data;
  },

  /**
   * PUT /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/detalles/{sec}
   * Actualiza un detalle existente
   */
  updateDetalle: async (
    codCia: number,
    codEmpleado: number,
    nroCp: string,
    sec: number,
    detalle: ComprobantePagoEmpleadoDetUpdate
  ): Promise<ComprobantePagoEmpleadoDet> => {
    const response = await apiClient.put<{ data: ComprobantePagoEmpleadoDet }>(
      `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/detalles/${sec}`,
      detalle
    );
    return response.data;
  },

  /**
   * DELETE /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/detalles/{sec}
   * Elimina un detalle específico
   */
  deleteDetalle: async (codCia: number, codEmpleado: number, nroCp: string, sec: number): Promise<void> => {
    await apiClient.delete(`/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/detalles/${sec}`);
  },

  /**
   * DELETE /api/comprobantes-empleado/{codCia}/{codEmpleado}/{nroCp}/detalles
   * Elimina todos los detalles de un comprobante
   */
  deleteAllDetalles: async (codCia: number, codEmpleado: number, nroCp: string): Promise<void> => {
    await apiClient.delete(`/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCp}/detalles`);
  },
};
