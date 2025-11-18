"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientesService, proyectosService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, DollarSign, Edit, FileText, FolderKanban, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetalleClientePage() {
  const params = useParams();
  const clienteId = params.id as string;

  const { data: cliente, isLoading, error } = useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: async () => {
      // Asumiendo que el ID viene en formato "codCia-codCliente"
      const [codCia, codCliente] = clienteId.split("-").map(Number);
      return await clientesService.getById(codCia, codCliente);
    },
    enabled: !!clienteId,
  });

  // Cargar proyectos del cliente
  const { data: proyectos = [] } = useQuery({
    queryKey: ["proyectos-cliente", clienteId],
    queryFn: async () => {
      if (!cliente) return [];
      return await proyectosService.getByCliente(cliente.codCia, cliente.codCliente);
    },
    enabled: !!cliente,
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cliente no encontrado</h1>
          <Link href="/clientes">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información del cliente
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular estadísticas
  const totalProyectos = proyectos.length;
  const montoTotalProyectos = proyectos.reduce((sum, p) => sum + (p.costoTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {cliente.desPersona || cliente.desCorta}
            </h1>
            <Badge variant={cliente.vigente === "S" ? "default" : "secondary"}>
              {cliente.vigente === "S" ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            RUC: {cliente.nroRuc} | Código: {cliente.codCia}-{cliente.codCliente}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/clientes">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href={`/clientes/${clienteId}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProyectos}</div>
            <p className="text-xs text-muted-foreground">
              Proyectos contratados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {montoTotalProyectos.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Suma de todos los proyectos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={cliente.vigente === "S" ? "default" : "secondary"} className="text-base">
              {cliente.vigente === "S" ? "Activo" : "Inactivo"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Razón Social</span>
              </div>
              <p className="font-medium text-lg">{cliente.desPersona || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Nombre Corto</span>
              </div>
              <p className="font-medium text-lg">{cliente.desCorta || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>RUC</span>
              </div>
              <p className="font-mono font-medium text-lg">{cliente.nroRuc}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Código de Cliente</span>
              </div>
              <p className="font-mono font-medium text-lg">{cliente.codCliente}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción Alterna */}
      {cliente.descAlterna && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción Alterna</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{cliente.descAlterna}</p>
          </CardContent>
        </Card>
      )}

      {/* Proyectos del Cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Proyectos del Cliente</CardTitle>
            <Badge variant="outline">{totalProyectos} proyectos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {proyectos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay proyectos registrados para este cliente</p>
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
          <Link href={`/proyectos?cliente=${clienteId}`}>
            <Button variant="outline">
              <FolderKanban className="mr-2 h-4 w-4" />
              Ver Todos los Proyectos
            </Button>
          </Link>
          <Link href={`/comprobantes?cliente=${clienteId}`}>
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
