/**
 * Tipos para Flujo de Caja Presupuestario
 */

export interface FlujoCajaDTO {
  codCia: number
  codPyto: number
  ingEgr: string
  tipo: string
  codPartida: number
  nivel: number
  orden: number
  desConcepto: string
  desConceptoCorto: string
  semilla?: number
  raiz?: number
  tabEstado?: string
  codEstado?: string
  vigente: string
  nombreProyecto?: string
  nombrePartida?: string
  tipoDescripcion?: string
}

export interface FlujoCajaDetDTO {
  anno: number
  codCia: number
  codPyto: number
  ingEgr: string
  tipo: string
  codPartida: number
  orden: number

  // Valores presupuestados
  impIni: number
  impEne: number
  impFeb: number
  impMar: number
  impAbr: number
  impMay: number
  impJun: number
  impJul: number
  impAgo: number
  impSep: number
  impOct: number
  impNov: number
  impDic: number
  impAcum: number

  // Valores reales
  impRealIni: number
  impRealEne: number
  impRealFeb: number
  impRealMar: number
  impRealAbr: number
  impRealMay: number
  impRealJun: number
  impRealJul: number
  impRealAgo: number
  impRealSep: number
  impRealOct: number
  impRealNov: number
  impRealDic: number
  impRealAcum: number

  // Calculados
  totalPresupuestado?: number
  totalReal?: number
  variacion?: number
  variacionPorcentual?: number
  desConcepto?: string
  tipoDescripcion?: string
}

export interface ResumenAnual {
  totalPresupuestado: number
  totalReal: number
  variacion: number
  variacionPorcentual: number

  // Desglose mensual
  presupuestoEne: number
  realEne: number
  presupuestoFeb: number
  realFeb: number
  presupuestoMar: number
  realMar: number
  presupuestoAbr: number
  realAbr: number
  presupuestoMay: number
  realMay: number
  presupuestoJun: number
  realJun: number
  presupuestoJul: number
  realJul: number
  presupuestoAgo: number
  realAgo: number
  presupuestoSep: number
  realSep: number
  presupuestoOct: number
  realOct: number
  presupuestoNov: number
  realNov: number
  presupuestoDic: number
  realDic: number
}

export interface ProyeccionMensual {
  mes: string
  mesNumero: number
  ingresosPresupuestados: number
  ingresosReales: number
  egresosPresupuestados: number
  egresosReales: number
  saldoPresupuestado: number
  saldoReal: number
  cumplimientoIngresos: number
  cumplimientoEgresos: number
}

export interface FlujoCajaPresupuestoDTO {
  anno: number
  codCia: number
  codPyto: number
  nombreProyecto: string

  resumenIngresos: ResumenAnual
  resumenEgresos: ResumenAnual
  resumenNeto: ResumenAnual

  detalleIngresos: FlujoCajaDetDTO[]
  detalleEgresos: FlujoCajaDetDTO[]

  proyeccionesMensuales: ProyeccionMensual[]
}

// Para formularios de creación/edición
export interface FlujoCajaCreateDTO {
  codCia: number
  codPyto: number
  ingEgr: 'I' | 'E'
  tipo: string
  codPartida: number
  nivel: number
  orden: number
  desConcepto: string
  desConceptoCorto: string
  semilla?: number
  raiz?: number
  vigente?: string
}

export interface FlujoCajaDetCreateDTO {
  anno: number
  codCia: number
  codPyto: number
  ingEgr: 'I' | 'E'
  tipo: string
  codPartida: number
  orden: number

  // Presupuesto mensual
  impEne?: number
  impFeb?: number
  impMar?: number
  impAbr?: number
  impMay?: number
  impJun?: number
  impJul?: number
  impAgo?: number
  impSep?: number
  impOct?: number
  impNov?: number
  impDic?: number
}
