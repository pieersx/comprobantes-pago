import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import { Partida, PartidaProyecto } from '@/types/partida';

/**
 * Servicio para gestión de partidas presupuestales
 */
export const partidasService = {
  /**
   * Obtiene todas las partidas de un proyecto filtradas por tipo
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param tipo - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
   * @returns Lista de partidas del proyecto con información de presupuesto
   */
  getPartidasByProyecto: async (
    codCia: number,
    codPyto: number,
    tipo?: 'I' | 'E'
  ): Promise<PartidaProyecto[]> => {
    try {
      // El backend usa /proy-partida/proyecto/{codCia}/{codPyto}
      const response = await apiClient.get<ApiResponse<any[]> | any[]>(
        `/proy-partida/proyecto/${codCia}/${codPyto}`
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      let partidas = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!partidas) {
        throw new Error('La API no devolvió partidas.');
      }

      // Filtrar por tipo si se especifica
      if (tipo) {
        partidas = partidas.filter((p: any) => p.ingEgr === tipo);
      }

      // Mapear a PartidaProyecto con valores por defecto
      return partidas.map((p: any) => ({
        codPartida: p.codPartida,
        desPartida: p.partida?.desPartida || `Partida ${p.codPartida}`,
        ingEgr: p.ingEgr,
        presupuestoOriginal: p.impPresupuesto || 0,
        presupuestoEjecutado: 0, // TODO: calcular desde comprobantes
        presupuestoDisponible: p.impPresupuesto || 0,
        porcentajeEjecucion: 0,
        nivelAlerta: 'verde' as const,
      }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene una partida específica por su código
   * @param codCia - Código de compañía
   * @param codPartida - Código de partida
   * @returns Información de la partida
   */
  getPartidaById: async (
    codCia: number,
    codPartida: number
  ): Promise<Partida> => {
    try {
      const response = await apiClient.get<ApiResponse<Partida>>(
        `/partidas/${codCia}/${codPartida}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Busca partidas por código o descripción
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param query - Texto de búsqueda (código o descripción)
   * @returns Lista de partidas que coinciden con la búsqueda
   */
  buscarPartidas: async (
    codCia: number,
    codPyto: number,
    query: string
  ): Promise<PartidaProyecto[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PartidaProyecto[]>>(
        `/partidas/buscar/${codCia}/${codPyto}`,
        {
          params: { q: query },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
