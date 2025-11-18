"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useQuery } from "@tanstack/react-query";
import { Filter, Plus, Search, Tag } from "lucide-react";
import { useState } from "react";

interface Elemento {
  codTab: string;
  codElem: string;
  denEle: string;
  denCorta: string;
  vigente: string;
}

export default function ElementosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatalogo, setSelectedCatalogo] = useState<string>("all");

  const { data: elementos = [], isLoading } = useQuery({
    queryKey: ["elementos"],
    queryFn: async () => {
      // Nota: El endpoint /elementos tiene un error 500
      // Vamos a obtener elementos por catálogo específico
      const catalogos = ["001", "002", "003", "004", "005"];
      const allElementos: Elemento[] = [];

      for (const codTab of catalogos) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/elementos/tabla/${codTab}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              allElementos.push(...result.data);
            }
          }
        } catch (error) {
          console.error(`Error cargando elementos de ${codTab}:`, error);
        }
      }

      return allElementos;
    },
  });

  const filteredElementos = elementos.filter((elem) => {
    const matchesSearch =
      elem.denEle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elem.denCorta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elem.codElem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCatalogo =
      selectedCatalogo === "all" || elem.codTab === selectedCatalogo;

    return matchesSearch && matchesCatalogo;
  });

  const stats = {
    total: elementos.length,
    activos: elementos.filter((e) => e.vigente === "S").length,
    catalogos: [...new Set(elementos.map((e) => e.codTab))].length,
  };

  const catalogoNames: Record<string, string> = {
    "001": "TIPOS DE MONEDA",
    "002": "UNIDADES DE MEDIDA",
    "003": "TIPOS DE COMPROBANTE",
    "004": "ESTADOS",
    "005": "DESEMBOLSOS",
  };

  if (isLoading) {
    return <div className="p-8">Cargando elementos...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Elementos de Catálogos
          </h1>
          <p className="text-muted-foreground">
            Valores específicos de cada catálogo maestro
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Elemento
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Elementos
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catálogos</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.catalogos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCatalogo} onValueChange={setSelectedCatalogo}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrar por catálogo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los catálogos</SelectItem>
            {Object.entries(catalogoNames).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {code} - {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de Elementos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catálogo</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Descripción Corta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElementos.map((elemento) => (
                <TableRow key={`${elemento.codTab}-${elemento.codElem}`}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-muted-foreground">
                        {elemento.codTab}
                      </span>
                      <span className="text-xs">
                        {catalogoNames[elemento.codTab]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {elemento.codElem}
                  </TableCell>
                  <TableCell className="font-medium">
                    {elemento.denEle}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{elemento.denCorta}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        elemento.vigente === "S" ? "default" : "secondary"
                      }
                    >
                      {elemento.vigente === "S" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredElementos.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No se encontraron elementos que coincidan con la búsqueda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen por Catálogo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(catalogoNames).map(([code, name]) => {
          const count = elementos.filter((e) => e.codTab === code).length;
          return (
            <Card key={code}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{name}</CardTitle>
                  <Badge variant="secondary">{count} elementos</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Código: <span className="font-mono">{code}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
