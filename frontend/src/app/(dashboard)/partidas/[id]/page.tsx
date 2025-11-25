"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { partidasService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, FileText, Layers, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetallePartidaPage() {
  const params = useParams();
  const partidaId = params.id as string;

  const { data: partida, isLoading, error } = useQuery({
    queryKey: ["partida", partidaId],
    queryFn: async () => {
      // Asumiendo que el ID viene en formato "codCia-ingEgr-codPartida"
      const [codCia, ingEgr, codPartida] = partidaId.split("-");
      return await partidasService.getById(Number(codCia), ingEgr, Number(codPartida));
    },
    enabled: !!partidaId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !partida) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Partida no encontrada</h1>
          <Link href="/partidas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información de la partida
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTipoColor = (ingEgr: string) => {
    return ingEgr === "I" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const TipoIcon = partida.ingEgr === "I" ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{partida.desPartida}</h1>
            <Badge className={getTipoColor(partida.ingEgr)}>
              <TipoIcon className="h-3 w-3 mr-1" />
              {partida.ingEgr === "I" ? "Ingreso" : "Egreso"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Código: {partida.codPartidas} | ID: {partida.codCia}-{partida.ingEgr}-{partida.codPartida}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/partidas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href={`/partidas/${partidaId}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Información General */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={partida.vigente === "S" ? "default" : "secondary"}>
              {partida.vigente === "S" ? "Activa" : "Inactiva"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Jerárquico</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partida.nivel}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidad de Medida</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-base">
              {partida.eUniMed || partida.tUniMed}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la Partida */}
      <Card>
        <CardHeader>
          <CardTitle>Información Detallada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Código de Partida</p>
              <p className="font-mono font-medium text-lg">{partida.codPartidas}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Código Interno</p>
              <p className="font-mono font-medium text-lg">{partida.codPartida}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipo</p>
              <div className="flex items-center gap-2">
                <Badge className={getTipoColor(partida.ingEgr)}>
                  <TipoIcon className="h-3 w-3 mr-1" />
                  {partida.ingEgr === "I" ? "Ingreso" : "Egreso"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Centro de Costo</p>
              <p className="font-medium">
                {partida.flgCc === "S" ? "Sí" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipo Unidad Medida</p>
              <p className="font-medium">{partida.tUniMed || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estado Unidad Medida</p>
              <p className="font-medium">{partida.eUniMed || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción Completa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {partida.desPartida}
          </p>
        </CardContent>
      </Card>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Compañía</p>
              <p className="font-medium">{partida.codCia}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Semilla</p>
              <p className="font-medium">{partida.semilla || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vigencia</p>
              <Badge variant={partida.vigente === "S" ? "default" : "secondary"}>
                {partida.vigente === "S" ? "Vigente" : "No Vigente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/proyectos?partida=${partidaId}`}>
            <Button variant="outline">
              <Layers className="mr-2 h-4 w-4" />
              Ver Proyectos con esta Partida
            </Button>
          </Link>
          <Link href={`/comprobantes?partida=${partidaId}`}>
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
