/**
 * Tipos para la entidad ComprobantePagoEmpleado
 * Feature: empleados-comprobantes-blob
 */

export interface ComprobantePagoEmpleado {
  // Claves primarias
  codCia: number;
  codEmpleado: number;
  nroCp: string;

  // Datos del comprobante
  codPyto: number;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecCp: string; // formato yyyy-MM-dd
  tMoneda: string;
  eMoneda: string;
  tipCambio: number;
  impMo: number;
  impNetoMn: number;
  impIgvmn: number;
  impTotalMn: number;

  // Datos de abono
  fecAbono?: string;
  desAbono?: string;

  // Estado
  semilla?: number;
  tabEstado: string;
  codEstado: string;

  // Datos relacionados (para mostrar en listados)
  nombreEmpleado?: string;
  nombreProyecto?: string;
  tipoComprobanteDesc?: string;
  monedaDesc?: string;
  estadoDesc?: string;

  // Flags para indicar si tiene imágenes
  tieneFotoCp?: boolean;
  tieneFotoAbono?: boolean;

  // Detalles del comprobante (partidas con importes)
  detalles?: ComprobantePagoEmpleadoDet[];
}

export interface ComprobantePagoEmpleadoCreate {
  codCia: number;
  codEmpleado: number;
  nroCp: string;
  codPyto: number;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecCp: string;
  tMoneda: string;
  eMoneda: string;
  tipCambio: number;
  impMo: number;
  impNetoMn: number;
  impIgvmn: number;
  impTotalMn: number;
  fecAbono?: string;
  desAbono?: string;
}

export interface ComprobantePagoEmpleadoUpdate extends Partial<ComprobantePagoEmpleadoCreate> {
  codEstado?: string;
}

export interface ComprobantePagoEmpleadoFilters {
  codCia: number;
  codEmpleado?: number;
  codPyto?: number;
}

/**
 * Tipos para la entidad ComprobantePagoEmpleadoDet
 * Detalle de comprobantes de pago a empleados
 */

export interface ComprobantePagoEmpleadoDet {
  // Claves primarias
  codCia: number;
  codEmpleado: number;
  nroCp: string;
  sec: number;

  // Datos del detalle
  ingEgr: string;
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  semilla?: number;

  // Datos relacionados
  nombrePartida?: string;
  nombreEmpleado?: string;
}

export interface ComprobantePagoEmpleadoDetCreate {
  ingEgr: string;
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
}

export interface ComprobantePagoEmpleadoDetUpdate extends Partial<ComprobantePagoEmpleadoDetCreate> {}
