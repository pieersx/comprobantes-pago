'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { comprobantesUnifiedService } from '@/services/comprobantes-unified.service';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, FileText, Plus, Search, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function EgresosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: comprobantes = [], isLoading } = useQuery({
    queryKey: ['egresos'],
    queryFn: () => comprobantesUnifiedService.getAll(),
  });

  const egresos = comprobantes.filter(c => c.tipo === 'EGRESO');

  const filteredEgresos = egresos.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      (c.nroCP?.toLowerCase() || '').includes(query) ||
      (c.proveedor?.toLowerCase() || '').includes(query) ||
      (c.proyecto?.toLowerCase() || '').includes(query)
    );
  });

  const totalEgresos = egresos.reduce((sum, c) => sum + c.impTotalMn, 0);
  // Estados según la base de datos: '001' = Registrado, '002' = Pagado, '003' = Anulado
  const egresosPagados = egresos.filter(c => c.estado === '002');
  const egresosPendientes = egresos.filter(c => c.estado === '001');

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
          <h2 className="text-3xl font-bold tracking-tight">Egresos</h2>
          <p className="text-muted-foreground">
            Gestiona todos los comprobantes de egreso
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Egreso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              S/ {totalEgresos.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-muted-foreground">
              {egresos.length} comprobantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagados</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{egresosPagados.length}</div>
            <p className="text-xs text-muted-foreground">
              S/ {egresosPagados.reduce((sum, c) => sum + c.impTotalMn, 0).toLocaleString('es-PE')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{egresosPendientes.length}</div>
            <p className="text-xs text-muted-foreground">
              S/ {egresosPendientes.reduce((sum, c) => sum + c.impTotalMn, 0).toLocaleString('es-PE')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {egresos.length > 0 ? Math.round(totalEgresos / egresos.length).toLocaleString('es-PE') : 0}
            </div>
            <p className="text-xs text-muted-foreground">Por comprobante</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar egresos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Egresos</CardTitle>
          <CardDescription>
            {filteredEgresos.length} comprobantes de egreso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nro. Comprobante</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEgresos.length > 0 ? (
                  filteredEgresos.map((egreso) => (
                    <TableRow key={egreso.nroCP}>
                      <TableCell className="font-medium">{egreso.nroCP || 'N/A'}</TableCell>
                      <TableCell>{egreso.proveedor || 'Sin proveedor'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{egreso.proyecto || 'Sin proyecto'}</TableCell>
                      <TableCell>
                        {egreso.fecCP ? new Date(egreso.fecCP).toLocaleDateString('es-PE') : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        S/ {(egreso.impTotalMn || 0).toLocaleString('es-PE')}
                      </TableCell>
                      <TableCell>
                        {egreso.estado === 'PAG' ? (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            <span className="flex items-center gap-1">
                              ✓ Pagado
                            </span>
                          </Badge>
                        ) : egreso.estado === 'REG' ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <span className="flex items-center gap-1">
                              📝 Registrado
                            </span>
                          </Badge>
                        ) : egreso.estado === 'ANU' ? (
                          <Badge variant="destructive">
                            <span className="flex items-center gap-1">
                              ✕ Anulado
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {egreso.estado || 'N/A'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Navegar al detalle del comprobante
                            window.location.href = `/comprobantes/egreso-${egreso.codProveedor}-${egreso.nroCP}`;
                          }}
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron egresos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
