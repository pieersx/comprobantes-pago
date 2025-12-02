"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    DollarSign,
    Download,
    FileSpreadsheet,
    RefreshCw,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";

import { CompanySelector } from "@/components/layout/company-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { proyectosService } from "@/services/entities.service";
import { flujoCajaPresupuestoService } from "@/services/flujo-caja-presupuesto.service";
import { useAppStore } from "@/store/useAppStore";
import type { Proyecto } from "@/types/voucher";

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export default function FlujoCajaPresupuestoPage() {
  const companiaActual = useAppStore((state) => state.companiaActual);
  const [selectedProyecto, setSelectedProyecto] = useState<number | null>(null);
  const [selectedAnno, setSelectedAnno] = useState<number>(new Date().getFullYear());

  // Query para proyectos
  const {
    data: proyectos,
    isLoading: loadingProyectos,
  } = useQuery({
    queryKey: ["proyectos", companiaActual?.codCia],
    queryFn: () => proyectosService.getAll(companiaActual!.codCia),
    enabled: Boolean(companiaActual?.codCia),
    staleTime: 1000 * 60 * 10,
  });

  // Query para años disponibles
  const {
    data: annosDisponibles,
  } = useQuery({
    queryKey: ["flujo-caja-annos", companiaActual?.codCia, selectedProyecto],
    queryFn: () =>
      selectedProyecto
        ? flujoCajaPresupuestoService.getAnnosByProyecto(companiaActual!.codCia, selectedProyecto)
        : flujoCajaPresupuestoService.getAnnosByCompania(companiaActual!.codCia),
    enabled: Boolean(companiaActual?.codCia),
    staleTime: 1000 * 60 * 5,
  });

  // Query principal para el reporte
  const {
    data: reporte,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["flujo-caja-presupuesto", companiaActual?.codCia, selectedProyecto, selectedAnno],
    queryFn: () =>
      flujoCajaPresupuestoService.getReporte(
        companiaActual!.codCia,
        selectedProyecto!,
        selectedAnno
      ),
    enabled: Boolean(companiaActual?.codCia) && Boolean(selectedProyecto),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "S/ 0.00";
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "0.0%";
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getVariacionColor = (variacion: number | undefined | null) => {
    if (!variacion) return "text-muted-foreground";
    if (variacion > 5) return "text-green-600";
    if (variacion < -5) return "text-red-600";
    return "text-yellow-600";
  };

  // Calcular totales de proyección
  const totalesProyeccion = useMemo(() => {
    if (!reporte?.proyeccionesMensuales) return null;

    return reporte.proyeccionesMensuales.reduce(
      (acc, mes) => ({
        presupuestoIngresos: acc.presupuestoIngresos + (mes.ingresosPresupuestados || 0),
        realIngresos: acc.realIngresos + (mes.ingresosReales || 0),
        presupuestoEgresos: acc.presupuestoEgresos + (mes.egresosPresupuestados || 0),
        realEgresos: acc.realEgresos + (mes.egresosReales || 0),
      }),
      { presupuestoIngresos: 0, realIngresos: 0, presupuestoEgresos: 0, realEgresos: 0 }
    );
  }, [reporte]);

  if (!companiaActual) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-xl text-center">
          <CardHeader>
            <CardTitle>Selecciona una compañía</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Necesitas elegir una compañía activa para visualizar el presupuesto de flujo de caja.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Presupuesto de Flujo de Caja
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análisis presupuestado vs real por proyecto
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <CompanySelector className="w-full sm:w-72" />
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Proyecto
              </label>
              <Select
                value={selectedProyecto?.toString() || ""}
                onValueChange={(val) => setSelectedProyecto(val ? Number(val) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar proyecto..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingProyectos ? (
                    <SelectItem value="loading" disabled>
                      Cargando...
                    </SelectItem>
                  ) : (
                    proyectos?.map((p: Proyecto) => (
                      <SelectItem key={p.codPyto} value={p.codPyto.toString()}>
                        {p.nombPyto}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[150px]">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Año
              </label>
              <Select
                value={selectedAnno.toString()}
                onValueChange={(val) => setSelectedAnno(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {(annosDisponibles && annosDisponibles.length > 0
                    ? annosDisponibles
                    : [2023, 2024, 2025]
                  ).map((anno) => (
                    <SelectItem key={anno} value={anno.toString()}>
                      {anno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={!selectedProyecto}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" disabled={!reporte}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedProyecto ? (
        <Card className="min-h-[300px] flex items-center justify-center">
          <CardContent className="text-center py-12">
            <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecciona un proyecto</h3>
            <p className="text-muted-foreground max-w-md">
              Elige un proyecto del selector para ver el análisis de presupuesto vs ejecución real del flujo de caja.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <Card key={idx} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
          <Card className="h-96 animate-pulse bg-muted" />
        </div>
      ) : isError || !reporte ? (
        <Card className="min-h-[300px] flex items-center justify-center">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No se encontraron datos de presupuesto para este proyecto y año.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumen General */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ingresos Presupuestados
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      {formatCurrency(reporte.resumenIngresos?.totalPresupuestado)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ingresos Reales
                    </p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {formatCurrency(reporte.resumenIngresos?.totalReal)}
                    </p>
                    <p className={`text-sm ${getVariacionColor(reporte.resumenIngresos?.variacionPorcentual)}`}>
                      {formatPercent(reporte.resumenIngresos?.variacionPorcentual)} vs presupuesto
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Egresos Presupuestados
                    </p>
                    <p className="mt-2 text-2xl font-bold text-orange-600">
                      {formatCurrency(reporte.resumenEgresos?.totalPresupuestado)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Egresos Reales
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {formatCurrency(reporte.resumenEgresos?.totalReal)}
                    </p>
                    <p className={`text-sm ${getVariacionColor(-(reporte.resumenEgresos?.variacionPorcentual || 0))}`}>
                      {formatPercent(reporte.resumenEgresos?.variacionPorcentual)} vs presupuesto
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saldo Neto */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Saldo Neto Presupuestado
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${
                      (reporte.resumenNeto?.totalPresupuestado || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(reporte.resumenNeto?.totalPresupuestado)}
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Saldo Neto Real
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${
                      (reporte.resumenNeto?.totalReal || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(reporte.resumenNeto?.totalReal)}
                    </p>
                    <p className={`text-sm ${getVariacionColor(reporte.resumenNeto?.variacionPorcentual)}`}>
                      {formatPercent(reporte.resumenNeto?.variacionPorcentual)} vs presupuesto
                    </p>
                  </div>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    (reporte.resumenNeto?.totalReal || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {(reporte.resumenNeto?.totalReal || 0) >= 0 ? (
                      <ArrowUpRight className="h-8 w-8 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs para vista detallada */}
          <Tabs defaultValue="mensual" className="w-full">
            <TabsList>
              <TabsTrigger value="mensual">Vista Mensual</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
            </TabsList>

            <TabsContent value="mensual">
              <Card>
                <CardHeader>
                  <CardTitle>Proyección Mensual - {selectedAnno}</CardTitle>
                  <CardDescription>
                    Comparación de presupuesto vs ejecución real por mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Mes</TableHead>
                          <TableHead className="text-right">Ppto. Ingresos</TableHead>
                          <TableHead className="text-right">Real Ingresos</TableHead>
                          <TableHead className="text-right">Var. Ing.</TableHead>
                          <TableHead className="text-right">Ppto. Egresos</TableHead>
                          <TableHead className="text-right">Real Egresos</TableHead>
                          <TableHead className="text-right">Var. Egr.</TableHead>
                          <TableHead className="text-right">Saldo Ppto.</TableHead>
                          <TableHead className="text-right">Saldo Real</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reporte.proyeccionesMensuales?.map((mes, idx) => {
                          const saldoPpto = (mes.ingresosPresupuestados || 0) - (mes.egresosPresupuestados || 0);
                          const saldoReal = (mes.ingresosReales || 0) - (mes.egresosReales || 0);

                          return (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                {MESES[idx] || mes.mes}
                              </TableCell>
                              <TableCell className="text-right text-blue-600">
                                {formatCurrency(mes.ingresosPresupuestados)}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {formatCurrency(mes.ingresosReales)}
                              </TableCell>
                              <TableCell className={`text-right ${getVariacionColor(mes.cumplimientoIngresos - 100)}`}>
                                {formatPercent(mes.cumplimientoIngresos - 100)}
                              </TableCell>
                              <TableCell className="text-right text-orange-600">
                                {formatCurrency(mes.egresosPresupuestados)}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(mes.egresosReales)}
                              </TableCell>
                              <TableCell className={`text-right ${getVariacionColor(-(mes.cumplimientoEgresos - 100))}`}>
                                {formatPercent(mes.cumplimientoEgresos - 100)}
                              </TableCell>
                              <TableCell className={`text-right font-medium ${saldoPpto >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {formatCurrency(saldoPpto)}
                              </TableCell>
                              <TableCell className={`text-right font-medium ${saldoReal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(saldoReal)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {/* Fila de totales */}
                        {totalesProyeccion && (
                          <TableRow className="bg-muted/50 font-bold">
                            <TableCell>TOTAL</TableCell>
                            <TableCell className="text-right text-blue-600">
                              {formatCurrency(totalesProyeccion.presupuestoIngresos)}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatCurrency(totalesProyeccion.realIngresos)}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right text-orange-600">
                              {formatCurrency(totalesProyeccion.presupuestoEgresos)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatCurrency(totalesProyeccion.realEgresos)}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className={`text-right ${
                              totalesProyeccion.presupuestoIngresos - totalesProyeccion.presupuestoEgresos >= 0
                                ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(totalesProyeccion.presupuestoIngresos - totalesProyeccion.presupuestoEgresos)}
                            </TableCell>
                            <TableCell className={`text-right ${
                              totalesProyeccion.realIngresos - totalesProyeccion.realEgresos >= 0
                                ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(totalesProyeccion.realIngresos - totalesProyeccion.realEgresos)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparativo">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Comparativo</CardTitle>
                  <CardDescription>
                    Visualización de desviaciones del presupuesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reporte.proyeccionesMensuales?.map((mes, idx) => {
                      const presupuestoTotal = (mes.ingresosPresupuestados || 0) + (mes.egresosPresupuestados || 0) || 1;
                      const realTotal = (mes.ingresosReales || 0) + (mes.egresosReales || 0);
                      const porcentajeEjecucion = Math.min((realTotal / presupuestoTotal) * 100, 100);

                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">
                              {MESES[idx] || mes.mes}
                            </span>
                            <div className="flex flex-wrap gap-4">
                              <span className="text-blue-600">
                                Ppto: {formatCurrency((mes.ingresosPresupuestados || 0) - (mes.egresosPresupuestados || 0))}
                              </span>
                              <span className={`font-semibold ${
                                (mes.ingresosReales || 0) - (mes.egresosReales || 0) >= 0
                                  ? 'text-green-600' : 'text-red-600'
                              }`}>
                                Real: {formatCurrency((mes.ingresosReales || 0) - (mes.egresosReales || 0))}
                              </span>
                            </div>
                          </div>
                          <div className="relative h-8 overflow-hidden rounded-lg bg-gray-200">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                              style={{ width: "100%" }}
                            />
                            <div
                              className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                                porcentajeEjecucion > 100
                                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                                  : 'bg-gradient-to-r from-green-400 to-green-600'
                              }`}
                              style={{ width: `${Math.min(porcentajeEjecucion, 100)}%` }}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center px-3 z-10">
                              <span className="text-xs font-medium text-white drop-shadow">
                                {porcentajeEjecucion.toFixed(0)}% ejecutado
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
