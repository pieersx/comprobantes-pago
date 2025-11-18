// ═══════════════════════════════════════════════════════════════
// TIPOS PARA TODAS LAS 16 TABLAS DEL SISTEMA
// Sistema de Gestión de Comprobantes de Pago Ingresos/Egresos
// ═══════════════════════════════════════════════════════════════

// 1. CIA - Empresas/Compañías
export interface Empresa {
  codCia: number;
  desCia: string;
  desCorta: string;
  vigente: string;
}

// 2. PERSONA - Base única para clientes, proveedores, empleados
export interface Persona {
  codCia: number;
  codPersona: number;
  tipPersona: string; // 'C'=Cliente, 'P'=Proveedor, 'E'=Empleado
  desPersona: string;
  desCorta: string;
  descAlterna: string;
  desCortaAlt: string;
  vigente: string;
}

// 3. CLIENTE - Clientes
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

// 4. PROVEEDOR - Proveedores
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

// 5. TABS - Catálogos maestros
export interface Catalogo {
  codTab: string;
  denTab: string;
  denCorta: string;
  vigente: string;
}

// 6. ELEMENTOS - Valores de catálogos
export interface Elemento {
  codTab: string;
  codElem: string;
  denEle: string;
  denCorta: string;
  vigente: string;
}

// 7. PARTIDA - Conceptos contables (Ingresos/Egresos)
export interface Partida {
  codCia: number;
  ingEgr: string; // 'I' = Ingreso, 'E' = Egreso
  codPartida: number;
  codPartidas: string; // Código alfanumérico (ING-001, EGR-001)
  desPartida: string;
  flgCC: string;
  nivel: number;
  tuniMed: string; // Nota: API retorna 'tuniMed' en minúsculas
  euniMed: string; // Nota: API retorna 'euniMed' en minúsculas
  semilla: number;
  vigente: string;
}

// 8. PROYECTO - Proyectos
export interface Proyecto {
  codCia: number;
  codPyto: number;
  nombPyto: string;
  emplJefeProy: number;
  codCia1: number;
  ciaContrata: number;
  codCc: number;
  codCliente: number;
  flgEmpConsorcio: string;
  codSnip: string;
  fecReg: string;
  codFase: number;
  codNivel: number;
  codFuncion: string;
  codSituacion: number;
  numInfor: number;
  numInforEntrg: number;
  estPyto: number;
  fecEstado: string;
  valRefer: number;
  costoDirecto: number;
  costoGgen: number;
  costoFinan: number;
  impUtilidad: number;
  costoTotSinIgv: number;
  impIgv: number;
  costoTotal: number;
  costoPenalid: number;
  codDpto: string;
  codProv: string;
  codDist: string;
  fecViab: string;
  rutaDoc: string;
  annoIni: number;
  annoFin: number;
  codObjC: number;
  logoProy?: Blob;
  tabEstado: string;
  codEstado: string;
  observac: string;
  vigente: string;
}

// 9. PROY_PARTIDA - Partidas asignadas a proyectos
export interface ProyectoPartida {
  codCia: number;
  codPyto: number;
  nroVersion: number;
  ingEgr: string;
  codPartida: number;
  codPartidas: string;
  flgCc: string;
  nivel: number;
  uniMed: string;
  tabEstado: string;
  codEstado: string;
  vigente: string;
}

// 10. PROY_PARTIDA_MEZCLA - Mezcla de partidas por proyecto
export interface ProyectoPartidaMezcla {
  codCia: number;
  codPyto: number;
  ingEgr: string;
  nroVersion: number;
  codPartida: number;
  corr: number;
  padCodPartida: number;
  tUniMed: string;
  eUniMed: string;
  nivel: number;
  orden: number;
  costoUnit: number;
  cant: number;
  costoTot: number;
}

// 11. PARTIDA_MEZCLA - Composición de partidas
export interface PartidaMezcla {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  corr: number;
  padCodPartida: number;
  tUniMed: string;
  eUniMed: string;
  costoUnit: number;
  nivel: number;
  orden: number;
  vigente: string;
}

// 12. DPROY_PARTIDA_MEZCLA - Detalles de partida mezcla proyecto
export interface DetalleProyectoPartidaMezcla {
  codCia: number;
  codPyto: number;
  ingEgr: string;
  nroVersion: number;
  codPartida: number;
  corr: number;
  sec: number;
  tDesembolso: string;
  eDesembolso: string;
  nroPago: number;
  tCompPago: string;
  eCompPago: string;
  fecDesembolso: string;
  impDesembNeto: number;
  impDesembIgv: number;
  impDesembTot: number;
  semilla: number;
}

// 13. COMP_PAGOCAB - Comprobantes de pago (Egresos) - Cabecera
export interface ComprobantePagoCabecera {
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
  fotoCp: string;
  fotoAbono: string;
  fecAbono: string;
  desAbono: string;
  semilla: number;
  tabEstado: string;
  codEstado: string;
}

// 14. COMP_PAGODET - Detalle de comprobantes de pago
export interface ComprobantePagoDetalle {
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

// 15. VTACOMP_PAGOCAB - Comprobantes de venta (Ingresos) - Cabecera
export interface ComprobanteVentaCabecera {
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
  fotoCp: string;
  fotoAbono: string;
  fecAbono: string;
  desAbono: string;
  semilla: number;
  tabEstado: string;
  codEstado: string;
}

// 16. VTACOMP_PAGODET - Detalle de comprobantes de venta
export interface ComprobanteVentaDetalle {
  codCia: number;
  nroCp: string;
  sec: number;
  ingEgr: string;
  codPartida: number;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  semilla: number;
}

// ═══════════════════════════════════════════════════════════════
// TIPOS AUXILIARES
// ═══════════════════════════════════════════════════════════════

// Respuesta estándar de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Filtros para reportes
export interface FiltrosReporte {
  codCia?: number;
  fechaInicio?: string;
  fechaFin?: string;
  codProveedor?: number;
  codCliente?: number;
  codPyto?: number;
  tipo?: 'ingreso' | 'egreso';
}
