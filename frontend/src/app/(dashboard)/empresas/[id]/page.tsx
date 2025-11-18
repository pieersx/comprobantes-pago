"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companiasService, proyectosService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, DollarSign, Edit, FileText, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetalleEmpresaPage() {
  const params = useParams();
  const empresaId = Number(params.id);

  const { data: empresa, isLoading, error } = useQuery({
    queryKey: ["empresa", empresaId],
    queryFn: async () => {
      return await companiasService.getById(empresaId);
    },
    enabled: !!empresaId,
  });

  // Cargar proyectos de la empresa
  const { data: proyectos = [] } = useQuery({
    queryKey: ["proyectos-empresa", empresaId],
    queryFn: async () => {
      return await proyectosService.getAll(empresaId);
    },
    enabled: !!empresaId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Empresa no encontrada</h1>
          <Link href="/empresas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información de la empresa
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular estadísticas
  const totalProyectos = proyectos.length;
  const montoTotalProyectos = proyectos.reduce((sum, p) => sum + (p.costoTotal || 0), 0);
  const proyectosActivos = proyectos.filter(p => p.vigente === "S").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{empresa.desCia}</h1>
            <Badge variant={empresa.vigente === "S" ? "default" : "secondary"}>
              {empresa.vigente === "S" ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {empresa.desCorta} | Código: {empresa.codCia}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/empresas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href={`/empresas/${empresaId}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProyectos}</div>
            <p className="text-xs text-muted-foreground">
              Proyectos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <FolderKanban className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{proyectosActivos}</div>
            <p className="text-xs text-muted-foreground">
              En ejecución
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {montoTotalProyectos.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Suma de proyectos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={empresa.vigente === "S" ? "default" : "secondary"} className="text-base">
              {empresa.vigente === "S" ? "Activa" : "Inactiva"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Razón Social</span>
              </div>
              <p className="font-medium text-lg">{empresa.desCia}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Nombre Corto</span>
              </div>
              <p className="font-medium text-lg">{empresa.desCorta}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Código de Compañía</span>
              </div>
              <p className="font-mono font-medium text-lg">{empresa.codCia}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Estado</span>
              </div>
              <Badge variant={empresa.vigente === "S" ? "default" : "secondary"}>
                {empresa.vigente === "S" ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proyectos de la Empresa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Proyectos de la Empresa</CardTitle>
            <Badge variant="outline">{totalProyectos} proyectos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {proyectos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay proyectos registrados para esta empresa</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proyectos.map((proyecto) => (
                <Link
                  key={`${proyecto.codCia}-${proyecto.codPyto}`}
                  href={`/proyectos/${proyecto.codCia}-${proyecto.codPyto}`}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-medium">{proyecto.nombPyto}</p>
                      <p className="text-sm text-muted-foreground">
                        Período: {proyecto.annoIni} - {proyecto.annoFin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        S/ {proyecto.costoTotal?.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant={proyecto.vigente === "S" ? "default" : "secondary"} className="mt-1">
                        {proyecto.vigente === "S" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/proyectos/nuevo?empresa=${empresaId}`}>
            <Button variant="outline">
              <FolderKanban className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </Link>
          <Link href={`/proyectos?empresa=${empresaId}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Todos los Proyectos
            </Button>
          </Link>
          <Link href={`/reportes?empresa=${empresaId}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Reportes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
