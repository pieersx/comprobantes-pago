'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, FolderKanban, Plus, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProyectosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: proyectos = [], isLoading } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => dashboardService.getProjectsOverview(),
  });

  const filteredProyectos = proyectos.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      (p.nombPyto?.toLowerCase() || '').includes(query) ||
      String(p.codPyto || '').includes(searchQuery)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
          <p className="text-muted-foreground">
            Gestiona todos los proyectos activos del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/proyectos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proyectos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proyectos.length}</div>
            <p className="text-xs text-muted-foreground">Proyectos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {proyectos.reduce((sum, p) => sum + p.costoTotal, 0).toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-muted-foreground">Costo total de proyectos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proyectos.length > 0
                ? Math.round(proyectos.reduce((sum, p) => sum + p.porcentaje, 0) / proyectos.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Avance general</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProyectos.map((proyecto) => (
          <Card key={proyecto.codPyto} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{proyecto.nombPyto}</CardTitle>
                  <CardDescription className="mt-1">
                    Código: {proyecto.codPyto}
                  </CardDescription>
                </div>
                <Badge variant={proyecto.porcentaje >= 75 ? 'default' : 'secondary'}>
                  {proyecto.porcentaje}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{proyecto.porcentaje}%</span>
                </div>
                <Progress value={proyecto.porcentaje} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Presupuesto:</span>
                  <span className="font-medium">
                    S/ {proyecto.costoTotal.toLocaleString('es-PE')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gastado:</span>
                  <span className="font-medium text-blue-600">
                    S/ {proyecto.gastado.toLocaleString('es-PE')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Disponible:</span>
                  <span className="font-medium text-green-600">
                    S/ {(proyecto.costoTotal - proyecto.gastado).toLocaleString('es-PE')}
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/proyectos/${proyecto.codCia}-${proyecto.codPyto}`}>
                  Ver Detalles
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProyectos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No se encontraron proyectos</p>
            <p className="text-sm text-muted-foreground">
              Intenta con otro término de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
