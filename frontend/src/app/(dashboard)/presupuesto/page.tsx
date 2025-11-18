'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, FileText, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Proyecto {
  codCia: number
  codPyto: number
  nombPyto: string
  costoTotal: number
  costoDirecto: number
  costoGGen: number
  impIGV: number
  vigente: string
}

interface ProyPartida {
  codCia: number
  codPyto: number
  nroVersion: number
  ingEgr: string
  codPartida: number
  codPartidas: string
  nivel: number
  vigente: string
}

interface ProyPartidaMezcla {
  codCia: number
  codPyto: number
  ingEgr: string
  nroVersion: number
  codPartida: number
  corr: number
  costoUnit: number
  cant: number
  costoTot: number
}

const formatAmount = (value?: number | null) =>
  Number(value ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })

export default function PresupuestoPage() {
  const [selectedProyecto, setSelectedProyecto] = useState<string>('')

  const { data: proyectos = [] } = useQuery<Proyecto[]>({
    queryKey: ['proyectos'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/api/v1/proyectos?codCia=1')
      if (!res.ok) return []
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
  })

  const { data: partidas = [] } = useQuery<ProyPartida[]>({
    queryKey: ['proy-partidas', selectedProyecto],
    queryFn: async () => {
      if (!selectedProyecto) return []
      const res = await fetch(`http://localhost:8080/api/v1/proy-partida?codCia=1&codPyto=${selectedProyecto}`)
      if (!res.ok) return []
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
    enabled: !!selectedProyecto,
  })

  const { data: mezclas = [] } = useQuery<ProyPartidaMezcla[]>({
    queryKey: ['proy-partida-mezcla', selectedProyecto],
    queryFn: async () => {
      if (!selectedProyecto) return []
      const res = await fetch(`http://localhost:8080/api/v1/proy-partida-mezcla?codCia=1&codPyto=${selectedProyecto}`)
      if (!res.ok) return []
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
    enabled: !!selectedProyecto,
  })

  const proyecto = proyectos?.find(p => p.codPyto === Number(selectedProyecto))

  const totalIngresos = Array.isArray(mezclas)
    ? mezclas.filter(m => m.ingEgr === 'I').reduce((sum, m) => sum + (m.costoTot || 0), 0)
    : 0

  const totalEgresos = Array.isArray(mezclas)
    ? mezclas.filter(m => m.ingEgr === 'E').reduce((sum, m) => sum + (m.costoTot || 0), 0)
    : 0

  const balance = totalIngresos - totalEgresos
  const margen = totalIngresos > 0 ? ((balance / totalIngresos) * 100) : 0

  const partidasIngresos = Array.isArray(partidas) ? partidas.filter(p => p.ingEgr === 'I') : []
  const partidasEgresos = Array.isArray(partidas) ? partidas.filter(p => p.ingEgr === 'E') : []

  if (!Array.isArray(proyectos) || proyectos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No hay proyectos disponibles</p>
            <p className="text-sm text-muted-foreground text-center">
              Crea un proyecto para comenzar a gestionar presupuestos
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Presupuesto por Proyecto</h1>
          <p className="text-muted-foreground">Análisis detallado de ingresos y egresos por proyecto</p>
        </div>
      </div>

      {/* Selector de Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProyecto} onValueChange={setSelectedProyecto}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un proyecto..." />
            </SelectTrigger>
            <SelectContent>
              {proyectos.map((proyecto) => (
                <SelectItem key={proyecto.codPyto} value={proyecto.codPyto.toString()}>
                  {proyecto.codPyto} - {proyecto.nombPyto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!selectedProyecto ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">Selecciona un proyecto</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Elige un proyecto del menú superior para ver su presupuesto detallado
            </p>
          </CardContent>
        </Card>
      ) : proyecto ? (
        <>
          {/* Información del Proyecto */}
          <Card>
            <CardHeader>
              <CardTitle>{proyecto.nombPyto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Costo Total</p>
                  <p className="text-2xl font-bold">
                    S/ {formatAmount(proyecto.costoTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Costo Directo</p>
                  <p className="text-xl font-semibold">
                    S/ {formatAmount(proyecto.costoDirecto)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gastos Generales</p>
                  <p className="text-xl font-semibold">
                    S/ {formatAmount(proyecto.costoGGen)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IGV</p>
                  <p className="text-xl font-semibold">
                    S/ {formatAmount(proyecto.impIGV)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  S/ {formatAmount(totalIngresos)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {partidasIngresos.length} partidas de ingreso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  S/ {formatAmount(totalEgresos)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {partidasEgresos.length} partidas de egreso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  S/ {formatAmount(balance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {balance >= 0 ? 'Superávit' : 'Déficit'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margen</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${margen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {margen.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Margen de utilidad
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Desglose de Partidas */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Ingresos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Partidas de Ingreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partidasIngresos.map((partida) => {
                    const mezcla = mezclas.filter(
                      m => m.ingEgr === 'I' && m.codPartida === partida.codPartida
                    )
                    const total = mezcla.reduce((sum, m) => sum + (m.costoTot ?? 0), 0)

                    return (
                      <div key={partida.codPartida} className="border-b pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{partida.codPartidas}</div>
                            <div className="text-sm text-muted-foreground">
                              {mezcla.length} líneas de detalle
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              S/ {formatAmount(total)}
                            </div>
                            <Badge variant="outline" className="mt-1">
                              Nivel {partida.nivel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Egresos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Partidas de Egreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partidasEgresos.map((partida) => {
                    const mezcla = mezclas.filter(
                      m => m.ingEgr === 'E' && m.codPartida === partida.codPartida
                    )
                    const total = mezcla.reduce((sum, m) => sum + (m.costoTot ?? 0), 0)

                    return (
                      <div key={partida.codPartida} className="border-b pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{partida.codPartidas}</div>
                            <div className="text-sm text-muted-foreground">
                              {mezcla.length} líneas de detalle
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">
                              S/ {formatAmount(total)}
                            </div>
                            <Badge variant="outline" className="mt-1">
                              Nivel {partida.nivel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
