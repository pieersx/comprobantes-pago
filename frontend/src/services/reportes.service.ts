import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ReporteFinancieroProyecto {
  codCia: number;
  codPyto: number;
  nombreProyecto: string;
  presupuestoOriginal: number;
  totalEgresos: number;
  totalIngresos: number;
  ganancia: number;
  presupuestoDisponible: number;
  porcentajeEjecucion: number;
  porcentajeVarianza: number;
  estado: string;
  fechaGeneracion: string;
}

export interface ReporteFlujosCaja {
  codCia: number;
  codPyto: number;
  fechaInicio: string;
  fechaFin: string;
  flujosPorMes: Record<string, {
    ingresos: number;
    egresos: number;
    flujoNeto: number;
  }>;
  totalEgresos: number;
  totalIngresos: number;
  fechaGeneracion: string;
}

export interface ReporteFiscalIGV {
  codCia: number;
  fechaInicio: string;
  fechaFin: string;
  igvEgresos: number;
  igvIngresos: number;
  igvNeto: number;
  cantidadComprobantesEgresos: number;
  cantidadComprobantesIngresos: number;
  fechaGeneracion: string;
}

export interface ReporteIngresosPorCliente {
  codCia: number;
  fechaInicio: string;
  fechaFin: string;
  ingresosPorCliente: Array<{
    codCliente: number;
    totalIngresos: number;
    cantidadComprobantes: number;
    totalIGV: number;
  }>;
  totalIngresos: number;
  fechaGeneracion: string;
}

export interface ReporteGastosPorProveedor {
  codCia: number;
  fechaInicio: string;
  fechaFin: string;
  gastosPorProveedor: Array<{
    codProveedor: number;
    totalGastos: number;
    cantidadComprobantes: number;
    totalIGV: number;
  }>;
  totalGastos: number;
  fechaGeneracion: string;
}

export interface ReporteConsolidadoEmpresa {
  codCia: number;
  fechaInicio: string;
  fechaFin: string;
  totalIngresos: number;
  totalEgresos: number;
  ganancia: number;
  totalIGV: number;
  cantidadComprobantesIngresos: number;
  cantidadComprobantesEgresos: number;
  margenGanancia: number;
  fechaGeneracion: string;
}

export const reportesService = {
  /**
   * Obtener reporte financiero por proyecto
   */
  async getReporteFinancieroProyecto(codCia: number, codPyto: number): Promise<ReporteFinancieroProyecto> {
    const response = await axios.get(`${API_URL}/reportes/financiero/proyecto/${codCia}/${codPyto}`);
    return response.data.data;
  },

  /**
   * Obtener reporte de flujo de caja por proyecto
   */
  async getReporteFlujosCajaProyecto(
    codCia: number,
    codPyto: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteFlujosCaja> {
    const response = await axios.get(
      `${API_URL}/reportes/flujo-caja/proyecto/${codCia}/${codPyto}`,
      {
        params: { fechaInicio, fechaFin }
      }
    );
    return response.data.data;
  },

  /**
   * Obtener reporte fiscal de IGV
   */
  async getReporteFiscalIGV(
    codCia: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteFiscalIGV> {
    const response = await axios.get(`${API_URL}/reportes/fiscal/igv/${codCia}`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data.data;
  },

  /**
   * Obtener reporte de ingresos por cliente
   */
  async getReporteIngresosPorCliente(
    codCia: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteIngresosPorCliente> {
    const response = await axios.get(`${API_URL}/reportes/ingresos/cliente/${codCia}`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data.data;
  },

  /**
   * Obtener reporte de gastos por proveedor
   */
  async getReporteGastosPorProveedor(
    codCia: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteGastosPorProveedor> {
    const response = await axios.get(`${API_URL}/reportes/gastos/proveedor/${codCia}`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data.data;
  },

  /**
   * Obtener reporte consolidado de empresa
   */
  async getReporteConsolidadoEmpresa(
    codCia: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteConsolidadoEmpresa> {
    const response = await axios.get(`${API_URL}/reportes/consolidado/empresa/${codCia}`, {
      params: { fechaInicio, fechaFin }
    });
    return response.data.data;
  }
};
