import { apiClient, ApiResponse } from '@/lib/api';
import { Empleado, EmpleadoCreate, EmpleadoUpdate } from '@/types/empleado';

// Helper para obtener la URL base de la API
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl !== 'undefined') {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
  }
  return 'http://localhost:6969/api/v1';
};

/**
 * Servicio para gestión de empleados
 * Feature: empleados-comprobantes-blob
 */
export const empleadosService = {
  /**
   * GET /api/empleados?codCia={codCia}&soloVigentes={soloVigentes}
   * Lista todos los empleados de una compañía
   */
  getAll: async (codCia: number, soloVigentes: boolean = true): Promise<Empleado[]> => {
    const response = await apiClient.get<ApiResponse<Empleado[]>>(
      `/empleados?codCia=${codCia}&soloVigentes=${soloVigentes}`
    );
    return response.data.data;
  },

  /**
   * GET /api/empleados/search?codCia={codCia}&query={query}
   * Busca empleados por nombre, DNI o email
   */
  search: async (codCia: number, query: string): Promise<Empleado[]> => {
    const response = await apiClient.get<ApiResponse<Empleado[]>>(
      `/empleados/search?codCia=${codCia}&query=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },

  /**
   * GET /api/empleados/{codCia}/{codEmpleado}
   * Obtiene un empleado por su ID compuesto
   */
  getById: async (codCia: number, codEmpleado: number): Promise<Empleado> => {
    const response = await apiClient.get<ApiResponse<Empleado>>(
      `/empleados/${codCia}/${codEmpleado}`
    );
    return response.data.data;
  },

  /**
   * POST /api/empleados
   * Crea un nuevo empleado
   */
  create: async (empleado: EmpleadoCreate): Promise<Empleado> => {
    const response = await apiClient.post<ApiResponse<Empleado>>('/empleados', empleado);
    return response.data.data;
  },

  /**
   * PUT /api/empleados/{codCia}/{codEmpleado}
   * Actualiza un empleado existente
   */
  update: async (codCia: number, codEmpleado: number, empleado: EmpleadoUpdate): Promise<Empleado> => {
    const response = await apiClient.put<ApiResponse<Empleado>>(
      `/empleados/${codCia}/${codEmpleado}`,
      empleado
    );
    return response.data.data;
  },

  /**
   * DELETE /api/empleados/{codCia}/{codEmpleado}
   * Desactiva un empleado (vigente='N')
   */
  delete: async (codCia: number, codEmpleado: number): Promise<void> => {
    await apiClient.delete(`/empleados/${codCia}/${codEmpleado}`);
  },

  // ==================== Métodos de Foto BLOB ====================

  /**
   * POST /api/v1/empleados/{codCia}/{codEmpleado}/foto
   * Sube la foto de un empleado
   */
  uploadFoto: async (codCia: number, codEmpleado: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = getApiBaseUrl();
    await fetch(`${baseUrl}/empleados/${codCia}/${codEmpleado}/foto`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * GET /api/v1/empleados/{codCia}/{codEmpleado}/foto
   * Obtiene la URL de la foto de un empleado
   */
  getFotoUrl: (codCia: number, codEmpleado: number): string => {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}/empleados/${codCia}/${codEmpleado}/foto`;
  },

  /**
   * DELETE /api/empleados/{codCia}/{codEmpleado}/foto
   * Elimina la foto de un empleado
   */
  deleteFoto: async (codCia: number, codEmpleado: number): Promise<void> => {
    await apiClient.delete(`/empleados/${codCia}/${codEmpleado}/foto`);
  },
};
