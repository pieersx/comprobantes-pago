"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Database, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface Catalogo {
  codTab: string;
  denTab: string;
  denCorta: string;
  vigente: string;
}

export default function CatalogosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catalogos = [], isLoading } = useQuery<Catalogo[]>({
    queryKey: ["catalogos"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/v1/tabs");
      if (!res.ok) throw new Error("Error al cargar catálogos");
      const payload = await res.json();
      if (Array.isArray(payload)) {
        return payload as Catalogo[];
      }
      if (Array.isArray(payload?.data)) {
        return payload.data as Catalogo[];
      }
      return [];
    },
  });

  const filteredCatalogos = useMemo(
    () =>
      catalogos.filter((cat: Catalogo) =>
        cat.denTab.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.denCorta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.codTab.includes(searchTerm)
      ),
    [catalogos, searchTerm]
  );

  const stats = useMemo(
    () => ({
      total: catalogos.length,
      activos: catalogos.filter((catalogo) => catalogo.vigente === "S").length,
    }),
    [catalogos]
  );

  if (isLoading) {
    return <div className="p-8">Cargando catálogos...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Catálogos Maestros
          </h1>
          <p className="text-muted-foreground">
            Tablas de configuración del sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Catálogo
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Catálogos
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabla de Catálogos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Descripción Corta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCatalogos.map((catalogo) => (
                <TableRow key={catalogo.codTab}>
                  <TableCell className="font-mono font-medium">
                    {catalogo.codTab}
                  </TableCell>
                  <TableCell className="font-medium">
                    {catalogo.denTab}
                  </TableCell>
                  <TableCell>{catalogo.denCorta}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        catalogo.vigente === "S" ? "default" : "secondary"
                      }
                    >
                      {catalogo.vigente === "S" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Ver Elementos
                      </Button>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCatalogos.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No se encontraron catálogos que coincidan con la búsqueda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catálogos Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">001 - TIPOS DE MONEDA</p>
                <p className="text-xs text-muted-foreground">
                  Catálogo de monedas (PEN, USD, EUR, etc.)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-green-100 p-2">
                <Database className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">002 - UNIDADES DE MEDIDA</p>
                <p className="text-xs text-muted-foreground">
                  Unidades (UND, MTS, KG, etc.)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Database className="h-4 w-4 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">003 - TIPOS DE COMPROBANTE</p>
                <p className="text-xs text-muted-foreground">
                  Comprobantes (FAC, BOL, etc.)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Database className="h-4 w-4 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">004 - ESTADOS</p>
                <p className="text-xs text-muted-foreground">
                  Estados (ACT, INA, etc.)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
