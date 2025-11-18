import { apiClient } from '@/lib/api/client';

export interface ComprobanteSimple {
  id: number;
  tipo: 'INGRESO' | 'EGRESO';
  numeroComprobante: string;
  fecha: string;
  concepto: string;
  monto: number;
  beneficiario: string;
  metodoPago: string;
  referencia?: string;
  categoria?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ANULADO';
  observaciones?: string;
}

export interface ComprobanteStats {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  totalPendientes: number;
  totalAprobados: number;
  countIngresos?: number;
  countEgresos?: number;
}

export const comprobantesSimpleService = {
  getAll: async () => {
    return await apiClient.get<ComprobanteSimple[]>('/comprobantes');
  },

  getById: async (id: number) => {
    return await apiClient.get<ComprobanteSimple>(`/comprobantes/${id}`);
  },

  create: async (comprobante: Omit<ComprobanteSimple, 'id'>) => {
    return await apiClient.post<ComprobanteSimple>('/comprobantes', comprobante);
  },

  update: async (id: number, comprobante: Partial<ComprobanteSimple>) => {
    return await apiClient.put<ComprobanteSimple>(`/comprobantes/${id}`, comprobante);
  },

  delete: async (id: number) => {
    return await apiClient.delete<void>(`/comprobantes/${id}`);
  },

  getStats: async () => {
    return await apiClient.get<ComprobanteStats>('/comprobantes/estadisticas');
  },

  getByTipo: async (tipo: 'INGRESO' | 'EGRESO') => {
    return await apiClient.get<ComprobanteSimple[]>(`/comprobantes/tipo/${tipo}`);
  },
};
