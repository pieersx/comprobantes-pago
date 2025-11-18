export interface Comprobante {
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
  archivoAdjunto?: string;
  creadoPor?: string;
  fechaCreacion?: string;
  ultimaModificacion?: string;
  proyectoId?: number;
  clienteId?: number;
  proveedorId?: number;
  partidaId?: number;
}

export interface ComprobanteFilters {
  tipo?: 'INGRESO' | 'EGRESO';
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  beneficiario?: string;
  categoria?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  proyectoId?: number;
  clienteId?: number;
  proveedorId?: number;
}

export interface ComprobanteStats {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  totalPendientes: number;
  totalAprobados: number;
  countIngresos: number;
  countEgresos: number;
}

export interface Cliente {
  codCia: number;
  codCliente: number;
  nroRuc?: string;
  vigente: string;
  desPersona?: string;
  desCorta?: string;
  descAlterna?: string;
  desCortaAlt?: string;
}

export interface Proveedor {
  codCia: number;
  codProveedor: number;
  nroRuc?: string;
  vigente: string;
  desPersona?: string;
  desCorta?: string;
  descAlterna?: string;
  desCortaAlt?: string;
}

export interface Proyecto {
  codCia: number;
  codPyto: number;
  nombPyto: string;
  empljefeproy?: number;
  codCliente?: number;
  fecReg?: string;
  valRefer?: number;
  costoTotal?: number;
  tabEstado?: string;
  codEstado?: string;
  vigente?: string;
  observac?: string;
}

export interface Partida {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  codPartidas?: string;
  desPartida: string;
  desCorta?: string;
  flgCc?: string;
  nivel?: number;
  vigente: string;
}
