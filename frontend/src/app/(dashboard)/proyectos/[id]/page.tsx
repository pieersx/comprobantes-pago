"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { proyectosService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, DollarSign, Edit, FileText, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetalleProyectoPage() {
  const params = useParams();
  const proyectoId = params.id as string;

  const { data: proyecto, isLoading, error } = useQuery({
    queryKey: ["proyecto", proyectoId],
    queryFn: async () => {
      // Asumiendo que el ID viene en formato "codCia-codPyto"
      const [codCia, codPyto] = proyectoId.split("-").map(Number);
      return await proyectosService.getById(codCia, codPyto);
    },
    enabled: !!proyectoId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Proyecto no encontrado</h1>
          <Link href="/proyectos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información del proyecto
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular porcentaje de ejecución
  const porcentajeEjecucion = proyecto.costoTotal > 0
    ? ((proyecto.costoTotal - (proyecto.costoTotal || 0)) / proyecto.costoTotal) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{proyecto.nombPyto}</h1>
          <p className="text-muted-foreground">
            Código: {proyecto.codCia}-{proyecto.codPyto}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/proyectos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href={`/proyectos/${proyectoId}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Estado y Progreso */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={proyecto.vigente === "S" ? "default" : "secondary"}>
              {proyecto.vigente === "S" ? "Activo" : "Inactivo"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {proyecto.costoTotal?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Referencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {proyecto.valRefer?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(porcentajeEjecucion)}%</div>
            <Progress value={porcentajeEjecucion} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Cliente</span>
              </div>
              <p className="font-medium">
                {proyecto.nombreCliente || `Cliente ${proyecto.codCliente}`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Jefe de Proyecto</span>
              </div>
              <p className="font-medium">
                {proyecto.nombreJefeProyecto || `Empleado ${proyecto.emplJefeProy}`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fecha de Registro</span>
              </div>
              <p className="font-medium">
                {proyecto.fecReg ? new Date(proyecto.fecReg).toLocaleDateString("es-PE") : "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Período</span>
              </div>
              <p className="font-medium">
                {proyecto.annoIni} - {proyecto.annoFin}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Financiera */}
      <Card>
        <CardHeader>
          <CardTitle>Información Financiera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Costo Directo</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.costoDirecto?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gastos Generales</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.costoGgen?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Costos Financieros</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.costoFinan?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Utilidad</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.impUtilidad?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total sin IGV</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.costoTotSinIgv?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IGV</p>
              <p className="text-lg font-semibold">
                S/ {proyecto.impIgv?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      {proyecto.observac && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {proyecto.observac}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/proyectos/${proyectoId}/presupuesto`}>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Ver Presupuesto
            </Button>
          </Link>
          <Link href={`/comprobantes?proyecto=${proyectoId}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Comprobantes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
