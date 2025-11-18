"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Empresa {
  codCia: number;
  desCia: string;
  desCorta: string;
  vigente: string;
}

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/companias");
      if (!response.ok) throw new Error("Error al cargar empresas");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.desCia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.desCorta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.codCia.toString().includes(searchTerm)
  );

  const stats = {
    total: empresas.length,
    activas: empresas.filter((e) => e.vigente === "S").length,
    inactivas: empresas.filter((e) => e.vigente === "N").length,
  };

  if (isLoading) {
    return <div className="p-8">Cargando empresas...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gestión de empresas/compañías del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/empresas/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gestión de empresas del sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactivas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o descripción corta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmpresas.map((empresa) => (
          <Link key={empresa.codCia} href={`/empresas/${empresa.codCia}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {empresa.desCia}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>CIA-{empresa.codCia.toString().padStart(3, "0")}</span>
                  </div>
                </div>
                <Badge variant={empresa.vigente === "S" ? "default" : "secondary"}>
                  {empresa.vigente === "S" ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descripción Corta:</span>
                  <span className="font-medium">{empresa.desCorta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Código:</span>
                  <span className="font-mono font-medium">{empresa.codCia}</span>
                </div>
              </div>
            </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredEmpresas.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se encontraron empresas que coincidan con la búsqueda
          </CardContent>
        </Card>
      )}
    </div>
  );
}
