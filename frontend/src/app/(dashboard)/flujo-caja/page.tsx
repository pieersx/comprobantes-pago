"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
    Download,
    Filter,
    RefreshCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import { CompanySelector } from "@/components/layout/company-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cashflowService } from "@/services/cashflow.service";
import { useAppStore } from "@/store/useAppStore";
import type { CashflowMovement } from "@/types/cashflow";

export default function FlujoCajaPage() {
  const companiaActual = useAppStore((state) => state.companiaActual);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cashflow", companiaActual?.codCia],
    queryFn: () => cashflowService.getCompanyCashflow(companiaActual!.codCia),
    enabled: Boolean(companiaActual?.codCia),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  if (!companiaActual) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-xl text-center">
          <CardHeader>
            <CardTitle>Selecciona una compañía</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Necesitas elegir una compañía activa para visualizar su flujo de caja.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/2 rounded-lg bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="h-32 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-xl text-center">
          <CardHeader>
            <CardTitle>Error al cargar el flujo de caja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No pudimos obtener los datos desde el backend. Intenta recargar la información.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, projections, movements } = data;
  const resumenMovimientos = (movements ?? []).slice(0, 8);

  return (
    <div className="space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Flujo de Caja
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análisis financiero de ingresos y egresos
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <CompanySelector className="w-full sm:w-72" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4" />
              Periodo {summary.periodLabel}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ingresos del periodo
                </p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(summary.ingresos)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Egresos del periodo
                </p>
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {formatCurrency(summary.egresos)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Saldo del periodo
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {formatCurrency(summary.saldo)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <ArrowUpRight
                    className={`h-4 w-4 ${summary.variacion >= 0 ? "text-green-600" : "text-red-600"}`}
                  />
                  <span
                    className={`font-medium ${summary.variacion >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {summary.variacion >= 0 ? "+" : ""}
                    {summary.variacion.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">vs periodo anterior</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proyección Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Proyección Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          {projections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay suficientes movimientos para generar una proyección.
            </p>
          ) : (
            <div className="space-y-4">
              {projections.map((mes) => {
                const saldo = mes.saldo;
                const totalPeriodo = mes.ingresos + mes.egresos || 1;
                const porcentaje = (mes.ingresos / totalPeriodo) * 100;

                return (
                  <div key={mes.mes} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {mes.mes.toUpperCase()}
                      </span>
                      <div className="flex flex-wrap gap-4">
                        <span className="text-green-600">
                          ↑ {formatCurrency(mes.ingresos)}
                        </span>
                        <span className="text-red-600">
                          ↓ {formatCurrency(mes.egresos)}
                        </span>
                        <span className="font-semibold text-blue-600">
                          = {formatCurrency(saldo)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-8 overflow-hidden rounded-lg bg-gray-200">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center px-3 z-10">
                        <span className="text-xs font-medium text-white drop-shadow">
                          {porcentaje.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movimientos Recientes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Movimientos Recientes</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {resumenMovimientos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No encontramos movimientos en la compañía seleccionada.
            </p>
          ) : (
            <div className="space-y-3">
              {resumenMovimientos.map((mov: CashflowMovement) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        mov.tipo === "Ingreso" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {mov.tipo === "Ingreso" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mov.concepto}</p>
                      <p className="text-sm text-muted-foreground">
                        {mov.proyecto} • {formatDate(mov.fecha)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        mov.tipo === "Ingreso" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {mov.tipo === "Ingreso" ? "+" : "-"}
                      {formatCurrency(mov.monto)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saldo: {formatCurrency(mov.saldo)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
