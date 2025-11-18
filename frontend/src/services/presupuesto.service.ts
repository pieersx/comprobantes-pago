import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import {
    AlertaPresupuesto,
    DetalleEgreso,
    PresupuestoDisponible,
    ResumenPresupuestoProyecto,
    ValidacionPresupuesto,
} from '@/types/presupuesto';

/**
 * Servicio para gestión de presupuesto y validaciones
 */
export const presupuestoService = {
  /**
   * Obtiene el presupuesto disponible de una partida específica
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param codPartida - Código de partida
   * @returns Información del presupuesto disponible
   */
  getPresupuestoDisponible: async (
    codCia: number,
    codPyto: number,
    codPartida: number
  ): Promise<PresupuestoDisponible> => {
    try {
      const response = await apiClient.get<ApiResponse<PresupuestoDisponible>>(
        `/presupuesto/disponible/${codCia}/${codPyto}/${codPartida}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Valida que un egreso no supere el presupuesto disponible
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param detalles - Detalles del egreso a validar
   * @returns Resultado de la validación con alertas
   */
  validarEgreso: async (
    codCia: number,
    codPyto: number,
    detalles: DetalleEgreso[]
  ): Promise<ValidacionPresupuesto> => {
    try {
      const response = await apiClient.post<ApiResponse<ValidacionPresupuesto>>(
        '/presupuesto/validar',
        {
          codCia,
          codPyto,
          detalles,
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene el resumen completo del presupuesto de un proyecto
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @returns Resumen del presupuesto con todas las partidas
   */
  getResumenProyecto: async (
    codCia: number,
    codPyto: number
  ): Promise<ResumenPresupuestoProyecto> => {
    try {
      const response = await apiClient.get<ApiResponse<ResumenPresupuestoProyecto>>(
        `/presupuesto/resumen/${codCia}/${codPyto}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene las alertas activas de presupuesto de un proyecto
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @returns Lista de alertas ordenadas por criticidad
   */
  getAlertas: async (
    codCia: number,
    codPyto: number
  ): Promise<AlertaPresupuesto[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AlertaPresupuesto[]>>(
        `/presupuesto/alertas/${codCia}/${codPyto}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
