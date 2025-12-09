'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Leyenda de niveles para las tablas jerárquicas de partidas
 * Similar al diseño de Flujo de Caja Proyectado
 */
export function HierarchyLegend() {
  return (
    <Card className="w-fit">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          Leyenda de niveles
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4 space-y-1">
        {/* Ingresos */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded" />
          <span className="text-xs">Nivel 1 (Ingresos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded border border-green-300" />
          <span className="text-xs">Nivel 2 (Ingresos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 rounded border border-green-200" />
          <span className="text-xs">Nivel 3 (Ingresos)</span>
        </div>

        {/* Separador */}
        <div className="border-t my-2" />

        {/* Egresos */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded" />
          <span className="text-xs">Nivel 1 (Egresos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 rounded border border-orange-300" />
          <span className="text-xs">Nivel 2 (Egresos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-50 rounded border border-orange-200" />
          <span className="text-xs">Nivel 3 (Egresos)</span>
        </div>
      </CardContent>
    </Card>
  );
}
