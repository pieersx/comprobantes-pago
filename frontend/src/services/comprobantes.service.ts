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

  // Actualizar FotoCP (factura) - LEGACY
  actualizarFotoCP: async (
    codCia: number,
    nroCp: string,
    fotoCP: string
  ): Promise<VtaCompPagoCab> => {
    try {
      const response = await apiClient.put<ApiResponse<VtaCompPagoCab>>(
        `/comprobantes-venta/${codCia}/${nroCp}/archivos`,
        { fotoCp: fotoCP }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // ==================== Métodos de Imágenes BLOB ====================
  // Feature: empleados-comprobantes-blob
  // Requirements: 6.1, 6.2

  /**
   * POST /api/comprobantes-venta/{codCia}/{nroCp}/foto-cp
   * Sube la imagen del comprobante de ingreso como BLOB
   */
  uploadFotoCp: async (codCia: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-venta/${codCia}/${nroCp}/foto-cp`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen del comprobante');
    }
  },

  /**
   * GET URL de la imagen del comprobante de ingreso
   */
  getFotoCpUrl: (codCia: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-venta/${codCia}/${nroCp}/foto-cp`;
  },

  /**
   * DELETE /api/comprobantes-venta/{codCia}/{nroCp}/foto-cp
   * Elimina la imagen del comprobante de ingreso
   */
  deleteFotoCp: async (codCia: number, nroCp: string): Promise<void> => {
    try {
      await apiClient.delete(`/comprobantes-venta/${codCia}/${nroCp}/foto-cp`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/comprobantes-venta/{codCia}/{nroCp}/foto-abono
   * Sube la imagen del abono de ingreso como BLOB
   */
  uploadFotoAbono: async (codCia: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-venta/${codCia}/${nroCp}/foto-abono`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen del abono');
    }
  },

  /**
   * GET URL de la imagen del abono de ingreso
   */
  getFotoAbonoUrl: (codCia: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-venta/${codCia}/${nroCp}/foto-abono`;
  },

  /**
   * DELETE /api/comprobantes-venta/{codCia}/{nroCp}/foto-abono
   * Elimina la imagen del abono de ingreso
   */
  deleteFotoAbono: async (codCia: number, nroCp: string): Promise<void> => {
    try {
      await apiClient.delete(`/comprobantes-venta/${codCia}/${nroCp}/foto-abono`);
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

  // Actualizar FotoCP (factura del proveedor) - LEGACY
  actualizarFotoCP: async (
    codCia: number,
    codProveedor: number,
    nroCp: string,
    fotoCP: string
  ): Promise<CompPagoCab> => {
    try {
      const response = await apiClient.put<ApiResponse<CompPagoCab>>(
        `/comp-pago-cab/${codCia}/${codProveedor}/${nroCp}/archivos`,
        { fotoCp: fotoCP }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // ==================== Métodos de Imágenes BLOB ====================
  // Feature: empleados-comprobantes-blob

  /**
   * POST /api/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}/foto-cp
   * Sube la imagen del comprobante como BLOB
   */
  uploadFotoCp: async (codCia: number, codProveedor: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-cp`,
      { method: 'POST', body: formData }
    );
  },

  /**
   * GET URL de la imagen del comprobante
   */
  getFotoCpUrl: (codCia: number, codProveedor: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-cp`;
  },

  /**
   * DELETE /api/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}/foto-cp
   * Elimina la imagen del comprobante
   */
  deleteFotoCp: async (codCia: number, codProveedor: number, nroCp: string): Promise<void> => {
    try {
      await apiClient.delete(`/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-cp`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}/foto-abono
   * Sube la imagen del abono como BLOB
   */
  uploadFotoAbono: async (codCia: number, codProveedor: number, nroCp: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-abono`,
      { method: 'POST', body: formData }
    );
  },

  /**
   * GET URL de la imagen del abono
   */
  getFotoAbonoUrl: (codCia: number, codProveedor: number, nroCp: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-abono`;
  },

  /**
   * DELETE /api/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}/foto-abono
   * Elimina la imagen del abono
   */
  deleteFotoAbono: async (codCia: number, codProveedor: number, nroCp: string): Promise<void> => {
    try {
      await apiClient.delete(`/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}/foto-abono`);
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
        `/clientes?codCia=${codCia}`
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió clientes.');
      }

      return payload;
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
        `/proveedores?codCia=${codCia}`
      );

      // El backend puede devolver directamente un array o dentro de ApiResponse
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!payload) {
        throw new Error('La API no devolvió proveedores.');
      }

      return payload;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// ===================================
// SERVICIOS MEJORADOS DE COMPROBANTES
// Feature: comprobantes-mejoras
// Requirements: 1.1, 8.1, 8.2
// ===================================

import type {
  Abono,
  CreateComprobanteRequest
} from '@/types/comprobante';

export const comprobantesService = {
  /**
   * Crear comprobante de egreso
   * Feature: comprobantes-mejoras
   * Requirements: 8.2
   *
   * POST /api/v1/comprobantes/egreso
   */
  createComprobanteEgreso: async (data: CreateComprobanteRequest): Promise<CompPagoCab> => {
    try {
      console.log('📤 Enviando comprobante de egreso:', JSON.stringify(data, null, 2));
      const response = await apiClient.post<ApiResponse<CompPagoCab>>(
        '/comprobantes/egreso',
        data
      );
      console.log('✅ Comprobante de egreso creado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al crear comprobante de egreso:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Crear comprobante de ingreso
   * Feature: comprobantes-mejoras
   * Requirements: 8.1
   *
   * POST /api/v1/comprobantes/ingreso
   */
  createComprobanteIngreso: async (data: CreateComprobanteRequest): Promise<VtaCompPagoCab> => {
    try {
      console.log('📤 Enviando comprobante de ingreso:', JSON.stringify(data, null, 2));
      const response = await apiClient.post<ApiResponse<VtaCompPagoCab>>(
        '/comprobantes/ingreso',
        data
      );
      console.log('✅ Comprobante de ingreso creado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al crear comprobante de ingreso:', error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Actualizar comprobante
   * Feature: comprobantes-mejoras
   * Requirements: 1.5
   *
   * PUT /api/v1/comprobantes/{id}
   */
  updateComprobante: async (
    id: string,
    data: Partial<CompPagoCab | VtaCompPagoCab>
  ): Promise<CompPagoCab | VtaCompPagoCab> => {
    try {
      console.log(`📤 Actualizando comprobante ${id}:`, JSON.stringify(data, null, 2));
      const response = await apiClient.put<ApiResponse<CompPagoCab | VtaCompPagoCab>>(
        `/comprobantes/${id}`,
        data
      );
      console.log('✅ Comprobante actualizado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(`❌ Error al actualizar comprobante ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Registrar abono en comprobante
   * Feature: comprobantes-mejoras
   * Requirements: 6.1, 6.2, 6.3, 6.4
   *
   * POST /api/v1/comprobantes/{id}/abono
   */
  registrarAbono: async (
    id: string,
    abono: Abono
  ): Promise<CompPagoCab | VtaCompPagoCab> => {
    try {
      console.log(`📤 Registrando abono para comprobante ${id}:`, JSON.stringify(abono, null, 2));
      const response = await apiClient.post<ApiResponse<CompPagoCab | VtaCompPagoCab>>(
        `/comprobantes/${id}/abono`,
        abono
      );
      console.log('✅ Abono registrado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(`❌ Error al registrar abono para comprobante ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtener tipos de comprobante disponibles
   * Feature: comprobantes-mejoras
   * Requirements: 1.1
   *
   * GET /api/v1/elementos/tipos-comprobante
   */
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
};
