import { apiClient } from '@/lib/api/client';

export interface DashboardStats {
  totalIngresos: number;
  totalEgresos: number;
  totalComprobantes: number;
  comprobantesPendientes: number;
  proveedoresActivos: number;
  clientesActivos: number;
  proyectosActivos: number;
  // Estados de comprobantes
  comprobantesRegistrados: number;
  comprobantesPagados: number;
  comprobantesAnulados: number;
  // Presupuesto
  presupuestoTotal: number;
  presupuestoEjecutado: number;
  // Alertas
  alertasCriticas: number;
  alertasUrgentes: number;
  alertasAtencion: number;
}

export interface CashFlowData {
  month: string;
  ingresos: number;
  egresos: number;
}

export interface ProjectOverview {
  codCia?: number;
  codPyto: number;
  nombPyto: string;
  costoTotal: number;
  gastado: number;
  porcentaje: number;
}

export interface TopProvider {
  codProveedor: number;
  nombre: string;
  total: number;
  comprobantes: number;
}

class DashboardService {
  async getStats(codCia?: string): Promise<DashboardStats> {
    try {
      const params = codCia ? { codCia } : {};
      const response = await apiClient.get<DashboardStats>('/dashboard/stats', { params });
      console.log('📊 Dashboard: Datos reales cargados desde el backend');
      return response;
    } catch (error) {
      console.error('❌ Error al cargar estadísticas del dashboard:', error);
      // Retornar datos vacíos en caso de error
      return {
        totalIngresos: 0,
        totalEgresos: 0,
        totalComprobantes: 0,
        comprobantesPendientes: 0,
        proveedoresActivos: 0,
        clientesActivos: 0,
        proyectosActivos: 0,
        comprobantesRegistrados: 0,
        comprobantesPagados: 0,
        comprobantesAnulados: 0,
        presupuestoTotal: 0,
        presupuestoEjecutado: 0,
        alertasCriticas: 0,
        alertasUrgentes: 0,
        alertasAtencion: 0,
      };
    }
  }

  async getCashFlowData(codCia?: string): Promise<CashFlowData[]> {
    try {
      const params = codCia ? { codCia } : {};
      const response = await apiClient.get<CashFlowData[]>('/dashboard/cashflow', { params });
      console.log('📈 Flujo de Caja: Datos reales cargados desde el backend');
      return response;
    } catch (error) {
      console.error('❌ Error al cargar flujo de caja:', error);
      return [];
    }
  }

  async getProjectsOverview(codCia?: string): Promise<ProjectOverview[]> {
    try {
      const params = codCia ? { codCia } : {};
      const response = await apiClient.get<ProjectOverview[]>('/dashboard/projects', { params });
      console.log('🏗️ Proyectos: Datos reales cargados desde el backend');
      return response;
    } catch (error) {
      console.error('❌ Error al cargar proyectos:', error);
      return [];
    }
  }

  async getTopProviders(codCia?: string): Promise<TopProvider[]> {
    try {
      const params = codCia ? { codCia } : {};
      const response = await apiClient.get<TopProvider[]>('/dashboard/top-providers', { params });
      console.log('🏢 Proveedores: Datos reales cargados desde el backend');
      return response;
    } catch (error) {
      console.error('❌ Error al cargar proveedores:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
