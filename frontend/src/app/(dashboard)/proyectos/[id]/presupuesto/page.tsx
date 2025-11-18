'use client';

import { PresupuestoAlert } from '@/components/comprobantes/PresupuestoAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePresupuestoValidation } from '@/hooks/usePresupuestoValidation';
import { presupuestoService } from '@/services/presupuesto.service';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function PresupuestoProyectoPage() {
  const params = useParams();
  const proyectoId = params.id as string;
  const [tipoFiltro, setTipoFiltro] = useState<'TODOS' | 'I' | 'E'>('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState<'TODAS' | 'CON_ALERTAS'>('TODAS');

  const companiaActual = useAppStore((state) => state.companiaActual);

  // Extraer codCia y codPyto del proyectoId
  // El ID puede venir en formato "codCia-codPyto" o solo "codPyto"
  let codCia: number;
  let codPyto: number | null = null;

  if (proyectoId && proyectoId.includes('-')) {
    // Formato: "codCia-codPyto"
    const [ciaStr, pytoStr] = proyectoId.split('-');
    codCia = Number(ciaStr);
    codPyto = Number(pytoStr);
  } else if (proyectoId && !isNaN(Number(proyectoId))) {
    // Formato: solo "codPyto"
    codCia = companiaActual?.codCia ? Number(companiaActual.codCia) : 1;
    codPyto = Number(proyectoId);
  } else {
    // Usar valores por defecto
    codCia = companiaActual?.codCia ? Number(companiaActual.codCia) : 1;
    codPyto = null;
  }

  const { determinarNivelAlerta } = usePresupuestoValidation();

  // Cargar resumen del proyecto
  const { data: resumen, isLoading: isLoadingResumen, error: errorResumen } = useQuery({
    queryKey: ['presupuesto-resumen', codCia, codPyto],
    queryFn: () => presupuestoService.getResumenProyecto(codCia, codPyto!),
    enabled: codPyto !== null && codPyto > 0, // Solo ejecutar si codPyto es válido
  });

  // Cargar alertas del proyecto
  const { data: alertas = [], isLoading: isLoadingAlertas } = useQuery({
    queryKey: ['presupuesto-alertas', codCia, codPyto],
    queryFn: () => presupuestoService.getAlertas(codCia, codPyto!),
    enabled: codPyto !== null && codPyto > 0, // Solo ejecutar si codPyto es válido
  });

  // Filtrar partidas según los filtros seleccionados
  const partidasFiltradas = useMemo(() => {
    if (!resumen?.partidas) return [];

    let partidas = resumen.partidas;

    // Filtrar por tipo
    if (tipoFiltro !== 'TODOS') {
      partidas = partidas.filter((p) => p.ingEgr === tipoFiltro);
    }

    // Filtrar por estado (con alertas)
    if (estadoFiltro === 'CON_ALERTAS') {
      partidas = partidas.filter((p) => {
        const nivel = determinarNivelAlerta(p.porcentajeEjecutado || 0);
        return nivel === 'amarillo' || nivel === 'naranja' || nivel === 'rojo';
      });
    }

    return partidas;
  }, [resumen?.partidas, tipoFiltro, estadoFiltro, determinarNivelAlerta]);

  // Calcular totales de las partidas filtradas
  const totales = useMemo(() => {
    if (!partidasFiltradas.length) {
      return {
        presupuestoOriginal: 0,
        presupuestoEjecutado: 0,
        presupuestoDisponible: 0,
        porcentajeEjecucion: 0,
      };
    }

    const original = partidasFiltradas.reduce((sum, p) => sum + (p.presupuestoTotal || 0), 0);
    const ejecutado = partidasFiltradas.reduce((sum, p) => sum + (p.ejecutado || 0), 0);
    const disponible = partidasFiltradas.reduce((sum, p) => sum + (p.disponible || 0), 0);
    const porcentaje = original > 0 ? (ejecutado / original) * 100 : 0;

    return {
      presupuestoOriginal: original,
      presupuestoEjecutado: ejecutado,
      presupuestoDisponible: disponible,
      porcentajeEjecucion: porcentaje,
    };
  }, [partidasFiltradas]);

  // Ordenar alertas por criticidad (rojo > naranja > amarillo)
  const alertasOrdenadas = useMemo(() => {
    const ordenCriticidad = { rojo: 0, naranja: 1, amarillo: 2, verde: 3 };
    return [...alertas].sort((a, b) => {
      return ordenCriticidad[a.nivel] - ordenCriticidad[b.nivel];
    });
  }, [alertas]);

  /**
   * Obtiene el badge de estado según el porcentaje de ejecución
   * Implementa el semáforo visual según los requisitos
   */
  const getBadgeEstado = (porcentaje: number) => {
    const nivel = determinarNivelAlerta(porcentaje);

    switch (nivel) {
      case 'verde':
        return (
          <Badge variant="success" className="text-xs">
            Normal
          </Badge>
        );
      case 'amarillo':
        return (
          <Badge variant="warning" className="text-xs">
            Atención
          </Badge>
        );
      case 'naranja':
        return (
          <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
            Urgente
          </Badge>
        );
      case 'rojo':
        return (
          <Badge variant="destructive" className="text-xs">
            Excedido
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatearMonto = (monto: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  };

  // Validar ID del proyecto
  if (!codPyto || codPyto <= 0) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/proyectos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estado Presupuestal</h2>
            <p className="text-muted-foreground text-red-600">
              ID de proyecto inválido: {proyectoId}
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              El ID del proyecto no es válido. Por favor, selecciona un proyecto desde la lista.
            </p>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/proyectos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Proyectos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingResumen || isLoadingAlertas) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorResumen || !resumen) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/proyectos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estado Presupuestal</h2>
            <p className="text-muted-foreground">No se encontró información del proyecto</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              {errorResumen ? 'Error al cargar el presupuesto del proyecto.' : 'No se encontró información del proyecto.'}
            </p>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/proyectos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Proyectos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/proyectos/${proyectoId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Estado Presupuestal</h2>
          <p className="text-muted-foreground">{resumen.nombPyto}</p>
        </div>
      </div>

      {/* Resumen Financiero del Proyecto */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearMonto(resumen.costoTotal || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Costo total del proyecto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatearMonto(resumen.totalEjecutadoIngresos || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {formatearMonto(resumen.totalPresupuestoIngresos || 0)} presupuestado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatearMonto(resumen.totalEjecutadoEgresos || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {formatearMonto(resumen.totalPresupuestoEgresos || 0)} presupuestado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(resumen.balanceReal || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatearMonto(resumen.balanceReal || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margen: {(resumen.margenReal || 0).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Alertas Activas */}
      {alertasOrdenadas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <CardTitle>Alertas Activas</CardTitle>
            </div>
            <CardDescription>
              {alertasOrdenadas.length} {alertasOrdenadas.length === 1 ? 'partida requiere' : 'partidas requieren'} atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PresupuestoAlert
              alertas={alertasOrdenadas}
              onDismiss={undefined}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/comprobantes?search=${resumen.nombreProyecto}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver comprobantes del proyecto
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Presupuesto */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Partidas</CardTitle>
          <CardDescription>
            {partidasFiltradas.length} {partidasFiltradas.length === 1 ? 'partida' : 'partidas'} presupuestales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={tipoFiltro} onValueChange={(value) => setTipoFiltro(value as 'TODOS' | 'I' | 'E')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todas</SelectItem>
                  <SelectItem value="I">Ingresos</SelectItem>
                  <SelectItem value="E">Egresos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Estado:</label>
              <Select value={estadoFiltro} onValueChange={(value) => setEstadoFiltro(value as 'TODAS' | 'CON_ALERTAS')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAS">Todas</SelectItem>
                  <SelectItem value="CON_ALERTAS">Con alertas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partida</TableHead>
                  <TableHead className="text-right">Presupuesto</TableHead>
                  <TableHead className="text-right">Ejecutado</TableHead>
                  <TableHead className="text-right">Disponible</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partidasFiltradas.length > 0 ? (
                  partidasFiltradas.map((partida) => (
                    <TableRow key={partida.codPartida}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {partida.codPartida} - {partida.nombrePartida}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {partida.ingEgr === 'I' ? 'Ingreso' : 'Egreso'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatearMonto(partida.presupuestoTotal || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatearMonto(partida.ejecutado || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatearMonto(partida.disponible || 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(partida.porcentajeEjecutado || 0).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        {getBadgeEstado(partida.porcentajeEjecutado || 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron partidas con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {partidasFiltradas.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold">TOTALES</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatearMonto(totales.presupuestoOriginal)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatearMonto(totales.presupuestoEjecutado)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatearMonto(totales.presupuestoDisponible)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {totales.porcentajeEjecucion.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      {getBadgeEstado(totales.porcentajeEjecucion)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
