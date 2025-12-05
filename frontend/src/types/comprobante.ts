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
  nomCliente?: string;
  nombreProyecto?: string;
  nomProyecto?: string;
  descripcionEstado?: string;
  descEstado?: string;
  descripcionMoneda?: string;
  descMoneda?: string;
  descripcionTipoComprobante?: string;
  descTipoComprobante?: string;
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
  descripcionMoneda?: string;
  descripcionTipoComprobante?: string;
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
  nombrePartida?: string;
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

// Tipos para manejo de archivos
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadResponse {
  fileName: string;
  filePath: string;
  fileDownloadUri: string;
  fileType: string;
  size: number;
  uploadedAt: string;
}

// Tipos para cálculos fiscales
export interface TaxBreakdown {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxType: 'IGV' | 'RETENCION';
  taxRate: number;
  manuallyEdited: boolean;
}

export interface TaxCalculationRequest {
  subtotal: number;
  tipoComprobante: string;
  manualTax?: number;
}

// Tipos para jerarquía de partidas
export interface PartidaTreeNode {
  codPartida: number;
  desPartida: string;
  nivel: number;
  padCodPartida?: number;
  fullPath: string;
  isLeaf: boolean;
  children: PartidaTreeNode[];
  orden: number;
  codPartidas?: string;
}

export interface PartidaSelectionContext {
  codCia: number;
  codProyecto: number;
  ingEgr: 'I' | 'E';
  selectedPartidas: number[];
}

// ==================== Types para mejoras ====================
// Feature: comprobantes-mejoras
// Requirements: Todos

/**
 * Tipo principal para comprobantes (unificado)
 */
export interface Comprobante {
  codCia: number;
  codProveedorCliente: number; // codProveedor para egresos, codCliente para ingresos
  nroCP: string;
  codPyto: number;
  nroPago: number;
  tipoComprobante: TipoComprobante;
  fechaCP: Date | string;
  moneda: Moneda;
  tipoCambio: number;
  montoNeto: number;
  igv: number;
  total: number;
  fotoCP?: string;
  fotoAbono?: string;
  fechaAbono?: Date | string;
  descripcionAbono?: string;
  estado: EstadoComprobante;
  detalles: DetalleComprobante[];
  porcentajeImpuesto?: number;
  igvEditable: boolean;
}

/**
 * Detalle de comprobante
 */
export interface DetalleComprobante {
  sec: number;
  ingEgr: 'I' | 'E';
  codPartida: number;
  desPartida: string;
  nivel: number;
  montoNeto: number;
  igv: number;
  total: number;
}

/**
 * DTO para registro de abonos
 */
export interface Abono {
  fechaAbono: Date | string;
  descripcionMedioPago: string;
  montoAbono: number;
  fotoAbono?: string;
}

/**
 * Respuesta de cálculo de impuestos
 */
export interface TaxCalculation {
  porcentaje: number;
  igv: number;
  total: number;
  esEditable: boolean;
  tipoComprobante?: string;
}

/**
 * Tipos de comprobante
 */
export type TipoComprobante = 'FAC' | 'BOL' | 'REC' | 'OTR';

/**
 * Estados de comprobante
 */
export type EstadoComprobante = 'REG' | 'PEN' | 'PAG' | 'ANU';

/**
 * Tipos de moneda
 */
export interface Moneda {
  codigo: string;
  descripcion: string;
}

/**
 * Partida con información de jerarquía
 */
export interface PartidaDTO {
  codCia: number;
  ingEgr: 'I' | 'E';
  codPartida: number;
  codPartidas: string;
  desPartida: string;
  nivel: number;
  esUltimoNivel?: boolean;
  padCodPartida?: number;
  fullPath?: string;
  tUniMed?: string;
  eUniMed?: string;
}

/**
 * Props para componente TaxCalculator
 */
export interface TaxCalculatorProps {
  tipoComprobante: string;
  montoNeto: number;
  onTaxChange: (igv: number, total: number) => void;
  allowEdit?: boolean;
  initialIgv?: number;
}

/**
 * Props para componente FileUpload
 */
export interface FileUploadProps {
  tipo: 'comprobante' | 'abono';
  codCia: number;
  year: number;
  month: number;
  tipoComprobante?: string;
  onUploadSuccess: (filePath: string) => void;
  onUploadError: (error: string) => void;
  existingFile?: string;
}

/**
 * Props para componente PartidaSelector
 */
export interface PartidaSelectorProps {
  codCia: number;
  codProyecto: number;
  ingEgr: 'I' | 'E';
  partidasSeleccionadas: number[];
  onPartidaSelect: (partida: PartidaDTO) => void;
  showOnlyLastLevel?: boolean;
}

/**
 * Props para componente AbonoForm
 */
export interface AbonoFormProps {
  comprobanteId: string;
  montoTotal: number;
  onSuccess: () => void;
}

/**
 * Datos del formulario de abono
 */
export interface AbonoFormData {
  fechaAbono: Date;
  descripcionMedioPago: string;
  montoAbono: number;
  fotoAbono?: string;
}

/**
 * Request para crear comprobante
 */
export interface CreateComprobanteRequest {
  codCia: number;
  codProveedor?: number; // Para egresos
  codCliente?: number; // Para ingresos
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
  tabEstado: string;
  codEstado: string;
  porcentajeImpuesto?: number;
  igvEditable?: boolean;
  detalles: Array<{
    sec: number;
    ingEgr: string;
    codPartida: number;
    impNetoMn: number;
    impIgvMn: number;
    impTotalMn: number;
  }>;
}

/**
 * Response de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

/**
 * Opciones de tipo de comprobante
 */
export interface TipoComprobanteOption {
  codigo: string;
  descripcion: string;
  porcentajeIGV: number;
  esEditable: boolean;
}

/**
 * Estado del formulario de comprobante
 */
export interface ComprobanteFormState {
  codCia: number;
  codProyecto: number;
  codProveedorCliente: number;
  nroComprobante: string;
  tipoComprobante: string;
  fechaComprobante: Date;
  moneda: string;
  tipoCambio: number;
  montoNeto: number;
  igv: number;
  total: number;
  detalles: DetalleComprobante[];
  fotoComprobante?: string;
  porcentajeImpuesto?: number;
  igvEditadoManualmente: boolean;
}
