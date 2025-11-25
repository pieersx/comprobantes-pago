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
import { DollarSign, FileText, Plus, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function IngresosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: comprobantes = [], isLoading } = useQuery({
    queryKey: ['ingresos'],
    queryFn: () => comprobantesUnifiedService.getAll(),
  });

  const ingresos = comprobantes.filter(c => c.tipo === 'INGRESO');

  const filteredIngresos = ingresos.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      (c.nroCP?.toLowerCase() || '').includes(query) ||
      (c.proveedor?.toLowerCase() || '').includes(query) ||
      (c.proyecto?.toLowerCase() || '').includes(query)
    );
  });

  const totalIngresos = ingresos.reduce((sum, c) => sum + c.impTotalMn, 0);
  // Estados según la base de datos: '001' = Registrado, '002' = Pagado, '003' = Anulado
  const ingresosPagados = ingresos.filter(c => c.estado === '002');
  const ingresosPendientes = ingresos.filter(c => c.estado === '001');

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
          <h2 className="text-3xl font-bold tracking-tight">Ingresos</h2>
          <p className="text-muted-foreground">
            Gestiona todos los comprobantes de ingreso
          </p>
        </div>
        <Button onClick={() => window.location.href = '/ingresos/nuevo'}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Ingreso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              S/ {totalIngresos.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-muted-foreground">
              {ingresos.length} comprobantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagados</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingresosPagados.length}</div>
            <p className="text-xs text-muted-foreground">
              S/ {ingresosPagados.reduce((sum, c) => sum + c.impTotalMn, 0).toLocaleString('es-PE')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingresosPendientes.length}</div>
            <p className="text-xs text-muted-foreground">
              S/ {ingresosPendientes.reduce((sum, c) => sum + c.impTotalMn, 0).toLocaleString('es-PE')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {ingresos.length > 0 ? Math.round(totalIngresos / ingresos.length).toLocaleString('es-PE') : 0}
            </div>
            <p className="text-xs text-muted-foreground">Por comprobante</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ingresos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ingresos</CardTitle>
          <CardDescription>
            {filteredIngresos.length} comprobantes de ingreso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nro. Comprobante</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Archivos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngresos.length > 0 ? (
                  filteredIngresos.map((ingreso) => (
                    <TableRow key={ingreso.nroCP} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{ingreso.nroCP || 'N/A'}</TableCell>
                      <TableCell>
                        {ingreso.tCompPago === 'FAC' ? (
                          <Badge variant="outline">📄 Factura</Badge>
                        ) : ingreso.tCompPago === 'BOL' ? (
                          <Badge variant="outline">🧾 Boleta</Badge>
                        ) : ingreso.tCompPago === 'REC' ? (
                          <Badge variant="outline">📋 Recibo</Badge>
                        ) : (
                          <Badge variant="outline">📝 Otro</Badge>
                        )}
                      </TableCell>
                      <TableCell>{ingreso.proveedor || 'Sin cliente'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ingreso.proyecto || 'Sin proyecto'}</TableCell>
                      <TableCell>
                        {ingreso.fecCP ? new Date(ingreso.fecCP).toLocaleDateString('es-PE') : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        S/ {(ingreso.impTotalMn || 0).toLocaleString('es-PE')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {ingreso.fotoCp && (
                            <Badge variant="secondary" className="text-xs">
                              📎 CP
                            </Badge>
                          )}
                          {ingreso.fotoAbono && (
                            <Badge variant="secondary" className="text-xs">
                              💰 Cobro
                            </Badge>
                          )}
                          {!ingreso.fotoCp && !ingreso.fotoAbono && (
                            <span className="text-xs text-muted-foreground">Sin archivos</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {ingreso.estado === 'PAG' || ingreso.estado === '002' ? (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            <span className="flex items-center gap-1">
                              ✓ Cobrado
                            </span>
                          </Badge>
                        ) : ingreso.estado === 'REG' || ingreso.estado === '001' ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <span className="flex items-center gap-1">
                              📝 Registrado
                            </span>
                          </Badge>
                        ) : ingreso.estado === 'ANU' || ingreso.estado === '003' ? (
                          <Badge variant="destructive">
                            <span className="flex items-center gap-1">
                              ✕ Anulado
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {ingreso.estado || 'N/A'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron ingresos.
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
