"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportesService } from "@/services/reportes.service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, BarChart3, Download, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function ReportesFinancierosPage() {
  const [codCia, setCodCia] = useState<number>(1);
  const [codPyto, setCodPyto] = useState<number | null>(null);

  const { data: reporte, isLoading, refetch } = useQuery({
    queryKey: ["reporte-financiero", codCia, codPyto],
    queryFn: () => reportesService.getReporteFinancieroProyecto(codCia, codPyto!),
    enabled: codPyto !== null,
  });

  const handleGenerarReporte = () => {
    if (codPyto) {
      refetch();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes Financieros</h1>
          <p className="text-muted-foreground">
            Análisis de presupuesto vs. real con varianza
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="codCia">Empresa</Label>
              <Select value={codCia.toString()} onValueChange={(value) => setCodCia(Number(value))}>
                <SelectTrigger id="codCia">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">CONSTRUCTORA ANDINA S.A.</SelectItem>
                  <SelectItem value="2">INGENIERIA CIVIL MODERNA</SelectItem>
                  <SelectItem value="3">PROYECTOS INTEGRALES SAC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codPyto">Proyecto</Label>
              <Input
                id="codPyto"
                type="number"
                placeholder="Código de proyecto"
                value={codPyto || ""}
                onChange={(e) => setCodPyto(e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerarReporte} disabled={!codPyto} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporte */}
      {isLoading && (
        <Card>
          <CardContent className="py-8 text-center">
            Cargando reporte...
          </CardContent>
        </Card>
      )}

      {reporte && (
        <>
          {/* Información del Proyecto */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{reporte.nombreProyecto}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Proyecto #{reporte.codPyto} - Empresa #{reporte.codCia}
                  </p>
                </div>
                <Badge variant={reporte.estado === "ACT" ? "default" : "secondary"}>
                  {reporte.estado}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Métricas Principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Presupuesto Original
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(reporte.presupuestoOriginal)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Egresos
                </CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(reporte.totalEgresos)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercentage(reporte.porcentajeEjecucion)} ejecutado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ingresos
                </CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(reporte.totalIngresos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ganancia
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${reporte.ganancia >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(reporte.ganancia)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis de Varianza */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Varianza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Presupuesto Disponible:</span>
                  <span className={`text-lg font-bold ${reporte.presupuestoDisponible >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(reporte.presupuestoDisponible)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Porcentaje de Ejecución:</span>
                  <span className="text-lg font-bold">
                    {formatPercentage(reporte.porcentajeEjecucion)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Porcentaje de Varianza:</span>
                  <span className={`text-lg font-bold ${reporte.porcentajeVarianza >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatPercentage(reporte.porcentajeVarianza)}
                  </span>
                </div>

                {/* Barra de Progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progreso de Ejecución</span>
                    <span>{formatPercentage(reporte.porcentajeEjecucion)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        reporte.porcentajeEjecucion > 100
                          ? "bg-red-600"
                          : reporte.porcentajeEjecucion > 80
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(reporte.porcentajeEjecucion, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Reporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha de Generación:</span>
                    <span className="font-medium">
                      {format(new Date(reporte.fechaGeneracion), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Código de Empresa:</span>
                    <span className="font-medium">{reporte.codCia}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Código de Proyecto:</span>
                    <span className="font-medium">{reporte.codPyto}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado del Proyecto:</span>
                    <Badge variant={reporte.estado === "ACT" ? "default" : "secondary"}>
                      {reporte.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!reporte && !isLoading && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Seleccione una empresa y proyecto para generar el reporte
          </CardContent>
        </Card>
      )}
    </div>
  );
}
