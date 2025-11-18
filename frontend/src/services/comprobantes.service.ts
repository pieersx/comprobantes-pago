import { apiClient, ApiResponse, handleApiError } from '@/lib/api';
import {
    Cliente,
    Compania,
    CompPagoCab,
    Elemento,
    Proveedor,
    Proyecto,
    Tabs,
    VtaCompPagoCab,
} from '@/types/comprobante';

// ===================================
// SERVICIOS DE COMPROBANTES INGRESO
// ===================================

export const comprobantesIngresoService = {
  // Obtener todos los comprobantes de ingreso de una compañía
  getAll: async (codCia: number): Promise<VtaCompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCab[]>>(
        `/comprobantes-venta/compania/${codCia}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener comprobante por ID
  getById: async (codCia: number, nroCp: string): Promise<VtaCompPagoCab> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCab>>(
        `/comprobantes-venta/${codCia}/${nroCp}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener por proyecto
  getByProyecto: async (codCia: number, codPyto: number): Promise<VtaCompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCab[]>>(
        `/comprobantes-venta/proyecto/${codCia}/${codPyto}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener por cliente
  getByCliente: async (codCia: number, codCliente: number): Promise<VtaCompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCab[]>>(
        `/comprobantes-venta/cliente/${codCia}/${codCliente}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener por rango de fechas
  getByFechas: async (
    codCia: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<VtaCompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VtaCompPagoCab[]>>(
        `/comprobantes-venta/rango-fechas/${codCia}`,
        {
          params: { fechaInicio, fechaFin },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Crear nuevo comprobante
  create: async (data: Partial<VtaCompPagoCab>): Promise<VtaCompPagoCab> => {
    try {
      console.log('📤 Enviando comprobante de venta:', JSON.stringify(data, null, 2));
      const response = await apiClient.post<ApiResponse<VtaCompPagoCab>>(
        '/comprobantes-venta',
        data
      );
      console.log('✅ Comprobante creado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al crear comprobante:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar comprobante
  update: async (
    codCia: number,
    nroCp: string,
    data: Partial<VtaCompPagoCab>
  ): Promise<VtaCompPagoCab> => {
    try {
      const response = await apiClient.put<ApiResponse<VtaCompPagoCab>>(
        `/comprobantes-venta/${codCia}/${nroCp}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Eliminar comprobante
  delete: async (codCia: number, nroCp: string): Promise<void> => {
    try {
      await apiClient.delete(`/comprobantes-venta/${codCia}/${nroCp}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Calcular total de ingresos por proyecto
  getTotalIngresos: async (codCia: number, codPyto: number): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        `/comprobantes-venta/total-ingresos/${codCia}/${codPyto}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Anular comprobante de ingreso (eliminación lógica)
  anular: async (codCia: number, nroCp: string): Promise<VtaCompPagoCab> => {
    try {
      const response = await apiClient.patch<ApiResponse<VtaCompPagoCab>>(
        `/comprobantes-venta/${codCia}/${nroCp}/anular`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS DE COMPROBANTES EGRESO
// ===================================

export const comprobantesEgresoService = {
  // Obtener todos los comprobantes de egreso de una compañía
  getAll: async (codCia: number): Promise<CompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<CompPagoCab[]>>(
        `/comprobantes-pago/compania/${codCia}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener por proyecto
  getByProyecto: async (codCia: number, codPyto: number): Promise<CompPagoCab[]> => {
    try {
      const response = await apiClient.get<ApiResponse<CompPagoCab[]>>(
        `/comprobantes-pago/proyecto/${codCia}/${codPyto}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Crear nuevo comprobante de egreso
  create: async (data: Partial<CompPagoCab>): Promise<CompPagoCab> => {
    try {
      const response = await apiClient.post<ApiResponse<CompPagoCab>>(
        '/comprobantes-pago',
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener comprobante por ID
  getById: async (
    codCia: number,
    codProveedor: number,
    nroCp: string
  ): Promise<CompPagoCab> => {
    try {
      const response = await apiClient.get<ApiResponse<CompPagoCab>>(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar comprobante de egreso
  update: async (
    codCia: number,
    codProveedor: number,
    nroCp: string,
    data: Partial<CompPagoCab>
  ): Promise<CompPagoCab> => {
    try {
      const response = await apiClient.put<ApiResponse<CompPagoCab>>(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Eliminar comprobante de egreso (eliminación física)
  delete: async (
    codCia: number,
    codProveedor: number,
    nroCp: string
  ): Promise<void> => {
    try {
      await apiClient.delete(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`
      );
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Anular comprobante de egreso (eliminación lógica)
  anular: async (
    codCia: number,
    codProveedor: number,
    nroCp: string
  ): Promise<CompPagoCab> => {
    try {
      const response = await apiClient.patch<ApiResponse<CompPagoCab>>(
        `/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/anular`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS DE CATÁLOGOS
// ===================================

export const catalogosService = {
  // Compañías
  getCompanias: async (): Promise<Compania[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Compania[]> | Compania[]>(
        '/companias'
      );

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió compañías.');
      }

      return payload;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tablas de catálogos
  getTabs: async (): Promise<Tabs[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Tabs[]>>('/tabs');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Elementos por tabla
  getElementsByTabla: async (codTab: string): Promise<Elemento[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        `/elementos/tabla/${codTab}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tipos de moneda
  getTiposMoneda: async (): Promise<Elemento[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>('/elementos/monedas');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tipos de comprobante
  getTiposComprobante: async (): Promise<Elemento[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        '/elementos/tipos-comprobante'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Unidades de medida
  getUnidadesMedida: async (): Promise<Elemento[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Elemento[]>>(
        '/elementos/unidades-medida'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS DE PROYECTOS
// ===================================

export const proyectosService = {
  getAll: async (codCia: number): Promise<Proyecto[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Proyecto[]> | Proyecto[]>(
        `/proyectos`,
        {
          params: { codCia }
        }
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió proyectos.');
      }

      return payload;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS DE CLIENTES
// ===================================

export const clientesService = {
  getAll: async (codCia: number): Promise<Cliente[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Cliente[]> | Cliente[]>(
        `/clientes`,
        {
          params: { vigente: 'S' } // Solo clientes activos
        }
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió clientes.');
      }

      // Filtrar por compañía en el frontend
      return payload.filter((cliente: Cliente) => cliente.codCia === codCia);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS DE PROVEEDORES
// ===================================

export const proveedoresService = {
  getAll: async (codCia: number): Promise<Proveedor[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Proveedor[]> | Proveedor[]>(
        `/proveedores`,
        {
          params: { vigente: 'S' } // Solo proveedores activos
        }
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió proveedores.');
      }

      // Filtrar por compañía en el frontend
      return payload.filter((proveedor: Proveedor) => proveedor.codCia === codCia);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
