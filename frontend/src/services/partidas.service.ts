import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import { Partida, PartidaHierarchy, PartidaProyecto, PartidaTreeNodeExtended } from '@/types/partida';

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
        codCia: codCia,
        codPyto: codPyto,
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

  // ===================================
  // SERVICIOS MEJORADOS DE PARTIDAS
  // Feature: comprobantes-mejoras
  // Requirements: 5.1, 5.2, 5.3, 5.4
  // ===================================

  /**
   * Obtiene partidas del último nivel de la jerarquía
   * Feature: comprobantes-mejoras
   * Requirements: 5.1, 5.2, 5.3, 5.4
   *
   * GET /api/v1/partidas/ultimo-nivel
   *
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
   * @returns Lista de partidas del último nivel (sin hijos)
   */
  getPartidasUltimoNivel: async (
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaHierarchy[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PartidaHierarchy[]>>(
        '/partidas/ultimo-nivel',
        {
          params: { codCia, codPyto, ingEgr },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene el árbol completo de partidas con jerarquía
   * Feature: comprobantes-mejoras
   * Requirements: 5.1, 5.2
   *
   * GET /api/v1/partidas/arbol
   *
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
   * @returns Árbol jerárquico de partidas
   */
  getArbolPartidas: async (
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaTreeNodeExtended[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PartidaTreeNodeExtended[]>>(
        '/partidas/arbol',
        {
          params: { codCia, codPyto, ingEgr },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas del nivel 3 (para egresos) o nivel 2 (para ingresos) con jerarquía completa
   * Feature: comprobantes-jerarquicos
   * Requirements: 1.1, 1.4
   *
   * GET /api/v1/partidas/nivel3
   *
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param ingEgr - Tipo de partida: 'I' (Ingreso - nivel 2) o 'E' (Egreso - nivel 3)
   * @returns Lista de partidas del último nivel con información de jerarquía
   */
  getPartidasNivel3: async (
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaProyecto[]> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(
        '/partidas/nivel3',
        {
          params: { codCia, codPyto, ingEgr },
        }
      );

      const partidas = response.data.data || response.data;

      // Mapear a PartidaProyecto con información de jerarquía
      return partidas.map((p: any) => ({
        codCia: codCia,
        codPyto: codPyto,
        codPartida: p.codPartida,
        desPartida: p.desPartida,
        ingEgr: p.ingEgr,
        nivel: p.nivel,
        // Información de jerarquía
        padreNivel1: p.padreNivel1,
        desPartidaNivel1: p.desPartidaNivel1,
        padreNivel2: p.padreNivel2,
        desPartidaNivel2: p.desPartidaNivel2,
        jerarquiaCompleta: p.jerarquiaCompleta,
        // Información de presupuesto
        presupuestoOriginal: p.presupuestoOriginal || 0,
        presupuestoEjecutado: p.presupuestoEjecutado || 0,
        presupuestoDisponible: p.presupuestoDisponible || 0,
        porcentajeEjecucion: p.porcentajeEjecucion || 0,
        nivelAlerta: p.nivelAlerta || 'verde',
      }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene SOLO partidas de NIVEL 3 asignadas a un proyecto específico
   * Según el profesor: Solo partidas de nivel 3 se usan en comprobantes
   * Esta información viene de PROY_PARTIDA_MEZCLA
   *
   * Feature: comprobantes-profesor-specs
   * Requirements: Usar solo nivel 3 en comprobantes según notas.txt
   *
   * GET /api/v1/partidas/proyecto/{codCia}/{codPyto}/{ingEgr}/nivel3
   *
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
   * @returns Lista de partidas de NIVEL 3 del proyecto
   */
  getPartidasNivel3PorProyecto: async (
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaProyecto[]> => {
    try {
      const response = await apiClient.get<any[]>(
        `/partidas/proyecto/${codCia}/${codPyto}/${ingEgr}/nivel3`
      );

      const partidas = Array.isArray(response.data) ? response.data : [];

      // Mapear a PartidaProyecto
      return partidas.map((p: any) => ({
        codCia: codCia,
        codPyto: codPyto,
        codPartida: p.codPartida,
        desPartida: p.desPartida || `Partida ${p.codPartida}`,
        ingEgr: p.ingEgr || ingEgr,
        nivel: 3, // Siempre nivel 3
        codPartidas: p.codPartidas,
        // Información de presupuesto si viene del backend
        presupuestoOriginal: p.presupuestoOriginal || 0,
        presupuestoEjecutado: p.presupuestoEjecutado || 0,
        presupuestoDisponible: p.presupuestoDisponible || 0,
        porcentajeEjecucion: p.porcentajeEjecucion || 0,
        nivelAlerta: p.nivelAlerta || 'verde',
      }));
    } catch (error) {
      console.error('Error al obtener partidas nivel 3 por proyecto:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene TODAS las partidas (niveles 1, 2 y 3) de un proyecto
   * Nuevo requerimiento: El usuario puede seleccionar cualquier nivel
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param ingEgr - Tipo de partida: I=Ingreso, E=Egreso
   * @returns Lista de TODAS las partidas del proyecto (niveles 1, 2 y 3)
   */
  getTodasPartidasPorProyecto: async (
    codCia: number,
    codPyto: number,
    ingEgr: 'I' | 'E'
  ): Promise<PartidaProyecto[]> => {
    try {
      const response = await apiClient.get<any[]>(
        `/partidas/proyecto/${codCia}/${codPyto}/${ingEgr}/todos-niveles`
      );

      const partidas = Array.isArray(response.data) ? response.data : [];

      // Mapear a PartidaProyecto
      return partidas.map((p: any) => ({
        codCia: codCia,
        codPyto: codPyto,
        codPartida: p.codPartida,
        desPartida: p.desPartida || `Partida ${p.codPartida}`,
        ingEgr: p.ingEgr || ingEgr,
        nivel: p.nivel || 1, // Nivel puede ser 1, 2 o 3
        codPartidas: p.codPartidas,
        // Información de jerarquía (puede venir como jerarquiaCompleta o hierarchyPath)
        padCodPartida: p.padCodPartida,
        hierarchyPath: p.jerarquiaCompleta || p.hierarchyPath || p.fullPath,
        // Información de presupuesto si viene del backend
        presupuestoOriginal: p.presupuestoOriginal || 0,
        presupuestoEjecutado: p.presupuestoEjecutado || 0,
        presupuestoDisponible: p.presupuestoDisponible || 0,
        porcentajeEjecucion: p.porcentajeEjecucion || 0,
        nivelAlerta: p.nivelAlerta || 'verde',
      }));
    } catch (error) {
      console.error('Error al obtener todas las partidas por proyecto:', error);
      throw new Error(handleApiError(error));
    }
  },

  // ========================================
  // CRUD COMPLETO DE PARTIDAS
  // ========================================

  /**
   * Obtiene todas las partidas de una compañía
   */
  getAll: async (codCia?: number): Promise<any[]> => {
    try {
      const url = codCia ? `/partidas?codCia=${codCia}` : '/partidas';
      const response = await apiClient.get<any>(url);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene una partida por su ID compuesto
   */
  getById: async (codCia: number, ingEgr: string, codPartida: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/partidas/${codCia}/${ingEgr}/${codPartida}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea una nueva partida
   */
  create: async (partida: any): Promise<any> => {
    try {
      const response = await apiClient.post('/partidas', partida);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza una partida existente
   */
  update: async (codCia: number, ingEgr: string, codPartida: number, partida: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/partidas/${codCia}/${ingEgr}/${codPartida}`, partida);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Elimina una partida
   */
  delete: async (codCia: number, ingEgr: string, codPartida: number): Promise<void> => {
    try {
      await apiClient.delete(`/partidas/${codCia}/${ingEgr}/${codPartida}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ========================================
// PARTIDA_MEZCLA - Composición General
// ========================================
export const partidaMezclaService = {
  /**
   * Obtiene todas las partidas mezcla
   */
  getAll: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/partida-mezcla');
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas mezcla por compañía
   */
  getByCia: async (codCia: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/partida-mezcla/cia/${codCia}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene una partida mezcla por su ID compuesto
   */
  getById: async (codCia: number, ingEgr: string, codPartida: number, corr: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/partida-mezcla/${codCia}/${ingEgr}/${codPartida}/${corr}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene las mezclas de una partida específica
   */
  getByPartida: async (codCia: number, ingEgr: string, codPartida: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/partida-mezcla/partida/${codCia}/${ingEgr}/${codPartida}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea una nueva partida mezcla
   */
  create: async (partidaMezcla: any): Promise<any> => {
    try {
      const response = await apiClient.post('/partida-mezcla', partidaMezcla);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza una partida mezcla existente
   */
  update: async (
    codCia: number,
    ingEgr: string,
    codPartida: number,
    corr: number,
    partidaMezcla: any
  ): Promise<any> => {
    try {
      const response = await apiClient.put(
        `/partida-mezcla/${codCia}/${ingEgr}/${codPartida}/${corr}`,
        partidaMezcla
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Elimina una partida mezcla
   */
  delete: async (codCia: number, ingEgr: string, codPartida: number, corr: number): Promise<void> => {
    try {
      await apiClient.delete(`/partida-mezcla/${codCia}/${ingEgr}/${codPartida}/${corr}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ========================================
// PROY_PARTIDA - Partidas por Proyecto
// ========================================
export const proyPartidaService = {
  /**
   * Obtiene todas las partidas de proyecto
   */
  getAll: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/proy-partida');
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas por proyecto
   */
  getByProyecto: async (codCia: number, codPyto: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/proy-partida/proyecto/${codCia}/${codPyto}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas por proyecto y versión
   */
  getByProyectoVersion: async (codCia: number, codPyto: number, nroVersion: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/proy-partida/proyecto/${codCia}/${codPyto}/version/${nroVersion}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene una partida de proyecto por su ID compuesto
   */
  getById: async (
    codCia: number,
    codPyto: number,
    nroVersion: number,
    ingEgr: string,
    codPartida: number
  ): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/proy-partida/${codCia}/${codPyto}/${nroVersion}/${ingEgr}/${codPartida}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea una nueva partida de proyecto
   */
  create: async (proyPartida: any): Promise<any> => {
    try {
      const response = await apiClient.post('/proy-partida', proyPartida);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza una partida de proyecto
   */
  update: async (
    codCia: number,
    codPyto: number,
    nroVersion: number,
    ingEgr: string,
    codPartida: number,
    proyPartida: any
  ): Promise<any> => {
    try {
      const response = await apiClient.put(
        `/proy-partida/${codCia}/${codPyto}/${nroVersion}/${ingEgr}/${codPartida}`,
        proyPartida
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Elimina una partida de proyecto
   */
  delete: async (
    codCia: number,
    codPyto: number,
    nroVersion: number,
    ingEgr: string,
    codPartida: number
  ): Promise<void> => {
    try {
      await apiClient.delete(`/proy-partida/${codCia}/${codPyto}/${nroVersion}/${ingEgr}/${codPartida}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ========================================
// PROY_PARTIDA_MEZCLA - Composición por Proyecto
// ========================================
export const proyPartidaMezclaService = {
  /**
   * Obtiene todas las partidas mezcla de proyecto
   */
  getAll: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/proy-partida-mezcla');
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas mezcla por proyecto
   */
  getByProyecto: async (codCia: number, codPyto: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/proy-partida-mezcla/proyecto/${codCia}/${codPyto}`);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas mezcla por proyecto y versión
   */
  getByProyectoVersion: async (codCia: number, codPyto: number, nroVersion: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/proy-partida-mezcla/proyecto/${codCia}/${codPyto}/version/${nroVersion}`
      );
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene partidas mezcla por proyecto, versión y partida
   */
  getByProyectoPartida: async (
    codCia: number,
    codPyto: number,
    nroVersion: number,
    ingEgr: string,
    codPartida: number
  ): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `/proy-partida-mezcla/proyecto/${codCia}/${codPyto}/version/${nroVersion}/partida/${ingEgr}/${codPartida}`
      );
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtiene una partida mezcla de proyecto por su ID compuesto
   */
  getById: async (
    codCia: number,
    codPyto: number,
    ingEgr: string,
    nroVersion: number,
    codPartida: number,
    corr: number
  ): Promise<any> => {
    try {
      const response = await apiClient.get(
        `/proy-partida-mezcla/${codCia}/${codPyto}/${ingEgr}/${nroVersion}/${codPartida}/${corr}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crea una nueva partida mezcla de proyecto
   */
  create: async (proyPartidaMezcla: any): Promise<any> => {
    try {
      const response = await apiClient.post('/proy-partida-mezcla', proyPartidaMezcla);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualiza una partida mezcla de proyecto
   */
  update: async (
    codCia: number,
    codPyto: number,
    ingEgr: string,
    nroVersion: number,
    codPartida: number,
    corr: number,
    proyPartidaMezcla: any
  ): Promise<any> => {
    try {
      const response = await apiClient.put(
        `/proy-partida-mezcla/${codCia}/${codPyto}/${ingEgr}/${nroVersion}/${codPartida}/${corr}`,
        proyPartidaMezcla
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Elimina una partida mezcla de proyecto
   */
  delete: async (
    codCia: number,
    codPyto: number,
    ingEgr: string,
    nroVersion: number,
    codPartida: number,
    corr: number
  ): Promise<void> => {
    try {
      await apiClient.delete(
        `/proy-partida-mezcla/${codCia}/${codPyto}/${ingEgr}/${nroVersion}/${codPartida}/${corr}`
      );
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
