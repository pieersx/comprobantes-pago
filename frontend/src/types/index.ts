// Common Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Entity Types based on Oracle Schema
export interface Compania {
  codCia: number;
  desCia: string;
  desCorta: string;
  vigente: string;
}

export interface Persona {
  codCia: number;
  codPersona: number;
  tipPersona: string;
  desPersona: string;
  desCorta: string;
  descAlterna: string;
  desCortaAlt: string;
  vigente: string;
}

export interface Cliente {
  codCia: number;
  codCliente: number;
  ruc?: string;
  vigente: string;
  desPersona?: string;
  desCorta?: string;
  dirLegal?: string;
  persona?: Persona;
}

export interface Proveedor {
  codCia: number;
  codProveedor: number;
  nroRuc: string;
  vigente: string;
  persona?: Persona;
}

export interface Empleado {
  codCia: number;
  codEmpleado: number;
  direcc: string;
  celular: string;
  hobby: string;
  fecNac: Date;
  dni: string;
  nroCip: string;
  fecCipVig: Date;
  licCond: string;
  flgEmplIea: string;
  observac: string;
  codCargo: number;
  email: string;
  vigente: string;
  persona?: Persona;
}

export interface Proyecto {
  codCia: number;
  codPyto: number;
  desProyecto?: string;
  desCorta?: string;
  codCliente?: number;
  fecInicio?: string;
  fecTermino?: string;
  montoPresupuestado?: number;
  nroVersion?: number;
  vigente: string;
  nombPyto?: string;
  emplJefeProy?: number;
  flgEmpConsorcio?: string;
  codSnip?: string;
  fecReg?: Date;
  valRefer?: number;
  costoDirecto?: number;
  costoGgen?: number;
  costoFinan?: number;
  impUtilidad?: number;
  costoTotSinIgv?: number;
  impIgv?: number;
  costoTotal?: number;
  annoIni?: number;
  annoFin?: number;
  observac?: string;
}

export interface ComprobantePagoCab {
  codCia: number;
  codProveedor: number;
  nroCp: string;
  codPyto: number;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecCp: Date;
  tMoneda: string;
  eMoneda: string;
  tipCambio: number;
  impMo: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  fotoCP: string;
  fotoAbono: string;
  fecAbono: Date;
  desAbono: string;
  semilla: number;
  tabEstado: string;
  codEstado: string;
}

export interface ComprobantePagoDet {
  codCia: number;
  codProveedor: number;
  nroCp: string;
  sec: number;
  ingEgr: string;
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  semilla: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
  tenantId?: number;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    tenantId: number;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  tenantId: number;
  roles: string[];
}

// Export new types
export * from './comprobante';
export * from './partida';
export * from './presupuesto';
