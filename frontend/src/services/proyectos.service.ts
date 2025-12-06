/**
 * Servicio para gestión de Proyectos
 */

import { apiClient, handleApiError } from '@/lib/api';
import { Proyecto } from '@/types/database';

export const proyectosService = {
  /**
   * Obtiene todos los proyectos de una compañía
   */
  getAll: async (codCia: number): Promise<Proyecto[]> => {
    try {
      const response = await apiClient.get(`/proyectos?codCia=${codCia}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene un proyecto por su ID
   */
  getById: async (codCia: number, codPyto: number): Promise<Proyecto> => {
    try {
      const response = await apiClient.get(`/proyectos/${codCia}/${codPyto}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene proyectos vigentes de una compañía
   */
  getVigentes: async (codCia: number): Promise<Proyecto[]> => {
    try {
      const response = await apiClient.get(`/proyectos/cia/${codCia}/vigentes`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea un nuevo proyecto
   */
  create: async (proyecto: Partial<Proyecto>): Promise<Proyecto> => {
    try {
      const response = await apiClient.post('/proyectos', proyecto);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza un proyecto existente
   */
  update: async (codCia: number, codPyto: number, proyecto: Partial<Proyecto>): Promise<Proyecto> => {
    try {
      const response = await apiClient.put(`/proyectos/${codCia}/${codPyto}`, proyecto);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Elimina un proyecto
   */
  delete: async (codCia: number, codPyto: number): Promise<void> => {
    try {
      await apiClient.delete(`/proyectos/${codCia}/${codPyto}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
