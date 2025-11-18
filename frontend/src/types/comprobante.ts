// Tipos para Comprobantes de Venta (Ingresos)
export interface VtaCompPagoCab {
  codCia: number;
  nroCp: string;
  codPyto: number;
  codCliente: number;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecCp: string;
  tMoneda: string;
  eMoneda: string;
  tipCambio: number;
  impMo: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  fotoCp?: string;
  fotoAbono?: string;
  fecAbono?: string;
  desAbono?: string;
  semilla: number;
  tabEstado: string;
  codEstado: string;
  detalles?: VtaCompPagoDet[];
  // Campos adicionales del DTO
  nombreCliente?: string;
  nombreProyecto?: string;
  descripcionEstado?: string;
}

export interface VtaCompPagoDet {
  codCia: number;
  nroCp: string;
  sec: number;
  ingEgr: string;
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  semilla: number;
  // Campos adicionales
  nombrePartida?: string;
}

// Tipos para Comprobantes de Pago (Egresos)
export interface CompPagoCab {
  codCia: number;
  codProveedor: number;
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
  impIgvMn: number;
  impTotalMn: number;
  fotoCp?: string;
  fotoAbono?: string;
  fecAbono?: string;
  desAbono?: string;
  semilla: number;
  tabEstado: string;
  codEstado: string;
  detalles?: CompPagoDet[];
  // Campos adicionales
  nombreProveedor?: string;
  nombreProyecto?: string;
  descripcionEstado?: string;
}

export interface CompPagoDet {
  codCia: number;
  codProveedor: number;
  nroCp: string;
  sec: number;
  ingEgr: string; // "E" para egreso
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  semilla: number;
  // Campos opcionales adicionales
  desPartida?: string;
  descripcion?: string;
  cantidad?: number;
  precio?: number;
  total?: number;
}

// Tipos para entidades auxiliares
export interface Compania {
  codCia: number;
  desCia: string;
  desCorta: string;
  vigente: string;
}

export interface Proyecto {
  codCia: number;
  codPyto: number;
  nombPyto: string; // Nombre del proyecto
  emplJefeProy: number;
  codCia1: number;
  codCliente: number;
  fecIni: string;
  fecFin: string;
  vigente: string;
}

export interface Cliente {
  codCia: number;
  codCliente: number;
  nroRuc: string;
  vigente: string;
  desPersona?: string; // Nombre de la persona
  desCorta?: string;
}

export interface Proveedor {
  codCia: number;
  codProveedor: number;
  nroRuc: string;
  vigente: string;
  desPersona?: string; // Nombre de la persona
  desCorta?: string;
}

export interface Elemento {
  codTab: string;
  codElem: string;
  denEle: string; // Denominación del elemento
  denCorta: string;
  vigente: string;
}

export interface Tabs {
  codTab: string;
  denTab: string;
  vigente: string;
}

// Tipos para formularios
export interface ComprobanteIngresoForm {
  codCia: number;
  nroCp: string;
  codPyto: number;
  codCliente: number;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecCp: string;
  tMoneda: string;
  eMoneda: string;
  tipCambio: number;
  impMo: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  tabEstado: string;
  codEstado: string;
  detalles: Array<{
    sec: number;
    ingEgr: string;
    codPartida: number;
    impNetoMn: number;
    impIgvMn: number;
    impTotalMn: number;
  }>;
}

export interface ComprobanteEgresoForm {
  codCia: number;
  codProveedor: number;
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
  impIgvMn: number;
  impTotalMn: number;
  tabEstado: string;
  codEstado: string;
  detalles: Array<{
    sec: number;
    codPartida: number;
    descripcion?: string;
    cantidad: number;
    precio: number;
    total: number;
  }>;
}
