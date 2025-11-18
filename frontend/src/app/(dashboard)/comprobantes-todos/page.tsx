'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { comprobantesEgresoService, comprobantesIngresoService } from '@/services/comprobantes.service'
import { useAppStore } from '@/store/useAppStore'
import { CompPagoCab, VtaCompPagoCab } from '@/types/comprobante'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, DollarSign, FileText, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function ComprobantesPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('todos')
  const companiaActual = useAppStore((state) => state.companiaActual)
  const codCia = companiaActual?.codCia ?? 1

  const { data: egresos = [], isLoading: isLoadingEgresos } = useQuery<CompPagoCab[]>({
    queryKey: ['comprobantes', 'egresos', codCia],
    queryFn: () => comprobantesEgresoService.getAll(codCia),
  })

  const { data: ingresos = [], isLoading: isLoadingIngresos } = useQuery<VtaCompPagoCab[]>({
    queryKey: ['comprobantes', 'ingresos', codCia],
    queryFn: () => comprobantesIngresoService.getAll(codCia),
  })

  const totalEgresos = useMemo(
    () => egresos.reduce((sum, egreso) => sum + (egreso.impTotalMn || 0), 0),
    [egresos]
  )
  const totalIngresos = useMemo(
    () => ingresos.reduce((sum, ingreso) => sum + (ingreso.impTotalMn || 0), 0),
    [ingresos]
  )
  const balance = totalIngresos - totalEgresos

  const filteredEgresos = egresos.filter((egreso) =>
    egreso.nroCp?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredIngresos = ingresos.filter((ingreso) =>
    ingreso.nroCp?.toLowerCase().includes(search.toLowerCase())
  )

  const isLoading = isLoadingEgresos || isLoadingIngresos

  const formatAmount = (value?: number | null) =>
    Number(value ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando comprobantes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comprobantes de Pago</h1>
          <p className="text-muted-foreground">Vista unificada de ingresos y egresos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comprobantes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Array.isArray(egresos) ? egresos.length : 0) + (Array.isArray(ingresos) ? ingresos.length : 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(ingresos) ? ingresos.length : 0} ingresos, {Array.isArray(egresos) ? egresos.length : 0} egresos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              S/ {totalIngresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(ingresos) ? ingresos.length : 0} comprobantes
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
              S/ {totalEgresos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(egresos) ? egresos.length : 0} comprobantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S/ {balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? 'Superávit' : 'Déficit'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por número de comprobante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos ({egresos.length + ingresos.length})</TabsTrigger>
          <TabsTrigger value="ingresos">
            <TrendingUp className="h-4 w-4 mr-2" />
            Ingresos ({ingresos.length})
          </TabsTrigger>
          <TabsTrigger value="egresos">
            <TrendingDown className="h-4 w-4 mr-2" />
            Egresos ({egresos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {filteredIngresos.length === 0 && filteredEgresos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay comprobantes registrados</p>
                <p className="text-sm text-muted-foreground">Comienza registrando tu primer comprobante</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {[...filteredIngresos.map((i) => ({ ...i, tipo: 'ingreso' })), ...filteredEgresos.map((e) => ({ ...e, tipo: 'egreso' }))].map((comp: any) => (
              <Card key={comp.nroCp}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{comp.nroCp}</h3>
                        <Badge variant={comp.tipo === 'ingreso' ? 'default' : 'destructive'}>
                          {comp.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                        <Badge variant="outline">{comp.eCompPago}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(comp.fecCp), 'dd MMM yyyy', { locale: es })}
                        </span>
                        <span>Proyecto: {comp.codPyto}</span>
                        <span>Pago #{comp.nroPago}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${comp.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {comp.tipo === 'ingreso' ? '+' : '-'} S/ {formatAmount(comp.impTotalMn)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        + IGV: S/ {formatAmount(comp.impIgvMn)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ingresos" className="space-y-4">
          {filteredIngresos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay comprobantes de ingreso</p>
                <p className="text-sm text-muted-foreground">Los ingresos registrados aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            filteredIngresos.map((ingreso) => (
            <Card key={ingreso.nroCp}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{ingreso.nroCp}</h3>
                      <Badge>Ingreso</Badge>
                      <Badge variant="outline">{ingreso.eCompPago}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(ingreso.fecCp), 'dd MMM yyyy', { locale: es })}
                      </span>
                      <span>Cliente: {ingreso.codCliente}</span>
                      <span>Proyecto: {ingreso.codPyto}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      + S/ {formatAmount(ingreso.impTotalMn)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      + IGV: S/ {formatAmount(ingreso.impIgvMn)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="egresos" className="space-y-4">
          {filteredEgresos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay comprobantes de egreso</p>
                <p className="text-sm text-muted-foreground">Los egresos registrados aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            filteredEgresos.map((egreso) => (
            <Card key={egreso.nroCp}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{egreso.nroCp}</h3>
                      <Badge variant="destructive">Egreso</Badge>
                      <Badge variant="outline">{egreso.eCompPago}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(egreso.fecCp), 'dd MMM yyyy', { locale: es })}
                      </span>
                      <span>Proveedor: {egreso.codProveedor}</span>
                      <span>Proyecto: {egreso.codPyto}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      - S/ {formatAmount(egreso.impTotalMn)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      + IGV: S/ {formatAmount(egreso.impIgvMn)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
