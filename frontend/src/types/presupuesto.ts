// Tipos para validación de presupuesto
export interface ValidacionPresupuesto {
  valido: boolean;
  mensajeError?: string;
  detalles: DetalleValidacion[];
  alertas: AlertaPresupuesto[];
}

export interface DetalleValidacion {
  codPartida: number;
  nombrePartida: string;
  presupuestoOriginal: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  montoSolicitado: number;
  porcentajeEjecucion: number;
  nivelAlerta: 'verde' | 'amarillo' | 'naranja' | 'rojo';
  excedido: boolean;
}

export interface AlertaPresupuesto {
  id: string;
  tipo: 'info' | 'warning' | 'error';
  nivel: 'verde' | 'amarillo' | 'naranja' | 'rojo';
  mensaje: string;
  codPartida: number;
  nombrePartida: string;
  porcentajeEjecucion: number;
  presupuestoOriginal: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  fechaGeneracion: string;
}

export interface PresupuestoDisponible {
  codCia: number;
  codPyto: number;
  codPartida: number;
  nombrePartida: string;
  ingEgr: string;
  presupuestoOriginal: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  porcentajeEjecucion: number;
  nivelAlerta: 'verde' | 'amarillo' | 'naranja' | 'rojo';
  disponible: boolean;
}

export interface ResumenPresupuestoProyecto {
  codCia: number;
  codPyto: number;
  nombPyto: string;
  costoTotal: number;
  totalPresupuestoIngresos: number;
  totalEjecutadoIngresos: number;
  totalPresupuestoEgresos: number;
  totalEjecutadoEgresos: number;
  balancePresupuestado: number;
  balanceReal: number;
  margenPresupuestado: number;
  margenReal: number;
  partidas: PresupuestoPartida[];
}

export interface PresupuestoPartida {
  codPartida: number;
  ingEgr: string;
  nombrePartida: string;
  presupuestoTotal: number;
  ejecutado: number;
  disponible: number;
  porcentajeEjecutado: number;
  estado: string;
  // Campos calculados en el frontend
  presupuestoOriginal?: number;
  presupuestoEjecutado?: number;
  presupuestoDisponible?: number;
  porcentajeEjecucion?: number;
}

export interface DetalleEgreso {
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
}
