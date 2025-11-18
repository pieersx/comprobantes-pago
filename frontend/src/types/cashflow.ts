export interface CashflowSummary {
  periodLabel: string
  ingresos: number
  egresos: number
  saldo: number
  variacion: number
}

export interface CashflowMovement {
  id: string
  fecha: string
  concepto: string
  tipo: 'Ingreso' | 'Egreso'
  monto: number
  proyecto?: string
  saldo: number
  referencia: string
}

export interface CashflowProjection {
  mes: string
  ingresos: number
  egresos: number
  saldo: number
}

export interface CashflowResponse {
  summary: CashflowSummary
  movements: CashflowMovement[]
  projections: CashflowProjection[]
}
