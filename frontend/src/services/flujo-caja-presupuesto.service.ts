import { apiClient, ApiResponse, handleApiError } from '@/lib/api'
import type {
    FlujoCajaCreateDTO,
    FlujoCajaDetCreateDTO,
    FlujoCajaDetDTO,
    FlujoCajaDTO,
    FlujoCajaPresupuestoDTO,
} from '@/types/flujo-caja-presupuesto'

const BASE_URL = '/flujo-caja-presupuesto'

export const flujoCajaPresupuestoService = {
  // ==================== CABECERA ====================

  /**
   * Obtener flujos de caja por compañía
   */
  async getByCompania(codCia: number): Promise<FlujoCajaDTO[]> {
    try {
      const response = await apiClient.get<ApiResponse<FlujoCajaDTO[]>>(
        `${BASE_URL}/compania/${codCia}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Obtener flujos de caja por proyecto
   */
  async getByProyecto(codCia: number, codPyto: number): Promise<FlujoCajaDTO[]> {
    try {
      const response = await apiClient.get<ApiResponse<FlujoCajaDTO[]>>(
        `${BASE_URL}/compania/${codCia}/proyecto/${codPyto}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Obtener flujos de caja por proyecto y tipo
   */
  async getByProyectoAndTipo(
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<FlujoCajaDTO[]> {
    try {
      const response = await apiClient.get<ApiResponse<FlujoCajaDTO[]>>(
        `${BASE_URL}/compania/${codCia}/proyecto/${codPyto}/tipo/${ingEgr}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Crear flujo de caja
   */
  async create(data: FlujoCajaCreateDTO): Promise<FlujoCajaDTO> {
    try {
      const response = await apiClient.post<ApiResponse<FlujoCajaDTO>>(
        BASE_URL,
        data
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Actualizar flujo de caja
   */
  async update(
    codCia: number,
    codPyto: number,
    ingEgr: string,
    tipo: string,
    codPartida: number,
    data: Partial<FlujoCajaDTO>
  ): Promise<FlujoCajaDTO> {
    try {
      const response = await apiClient.put<ApiResponse<FlujoCajaDTO>>(
        `${BASE_URL}/compania/${codCia}/proyecto/${codPyto}/ingegr/${ingEgr}/tipo/${tipo}/partida/${codPartida}`,
        data
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Eliminar flujo de caja
   */
  async delete(
    codCia: number,
    codPyto: number,
    ingEgr: string,
    tipo: string,
    codPartida: number
  ): Promise<void> {
    try {
      await apiClient.delete(
        `${BASE_URL}/compania/${codCia}/proyecto/${codPyto}/ingegr/${ingEgr}/tipo/${tipo}/partida/${codPartida}`
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // ==================== DETALLE ====================

  /**
   * Obtener detalle por año y proyecto
   */
  async getDetalle(
    anno: number,
    codCia: number,
    codPyto: number
  ): Promise<FlujoCajaDetDTO[]> {
    try {
      const response = await apiClient.get<ApiResponse<FlujoCajaDetDTO[]>>(
        `${BASE_URL}/detalle/anno/${anno}/compania/${codCia}/proyecto/${codPyto}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Obtener años disponibles por compañía
   */
  async getAnnosByCompania(codCia: number): Promise<number[]> {
    try {
      const response = await apiClient.get<ApiResponse<number[]>>(
        `${BASE_URL}/annos/compania/${codCia}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Obtener años disponibles por proyecto
   */
  async getAnnosByProyecto(codCia: number, codPyto: number): Promise<number[]> {
    try {
      const response = await apiClient.get<ApiResponse<number[]>>(
        `${BASE_URL}/annos/compania/${codCia}/proyecto/${codPyto}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Crear detalle de flujo de caja
   */
  async createDetalle(data: FlujoCajaDetCreateDTO): Promise<FlujoCajaDetDTO> {
    try {
      const response = await apiClient.post<ApiResponse<FlujoCajaDetDTO>>(
        `${BASE_URL}/detalle`,
        data
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Actualizar detalle de flujo de caja
   */
  async updateDetalle(
    anno: number,
    codCia: number,
    codPyto: number,
    ingEgr: string,
    tipo: string,
    codPartida: number,
    data: Partial<FlujoCajaDetDTO>
  ): Promise<FlujoCajaDetDTO> {
    try {
      const response = await apiClient.put<ApiResponse<FlujoCajaDetDTO>>(
        `${BASE_URL}/detalle/anno/${anno}/compania/${codCia}/proyecto/${codPyto}/ingegr/${ingEgr}/tipo/${tipo}/partida/${codPartida}`,
        data
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // ==================== REPORTE ====================

  /**
   * Obtener reporte consolidado de presupuesto vs real
   */
  async getReporte(
    codCia: number,
    codPyto: number,
    anno?: number
  ): Promise<FlujoCajaPresupuestoDTO> {
    try {
      const params = anno ? { anno } : {}
      const response = await apiClient.get<ApiResponse<FlujoCajaPresupuestoDTO>>(
        `${BASE_URL}/reporte/compania/${codCia}/proyecto/${codPyto}`,
        { params }
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
