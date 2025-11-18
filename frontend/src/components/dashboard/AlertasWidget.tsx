'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService } from '@/services/dashboard.service';
import { useAppStore } from '@/store/useAppStore';
import { AlertaPresupuesto } from '@/types/presupuesto';
import { AlertCircle, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AlertaConProyecto extends AlertaPresupuesto {
  codPyto: number;
  nombreProyecto: string;
}

export function AlertasWidget() {
  const [alertas, setAlertas] = useState<AlertaConProyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia;

  const cargarAlertas = async () => {
    if (!codCia) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Usar datos mock - los endpoints de alertas no están implementados
      console.log('🔔 Alertas: Usando datos de demostración (endpoints no implementados)');

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 500));

      // Datos mock de alertas
      const alertasMock: AlertaConProyecto[] = [];

      // Solo mostrar alertas si hay proyectos
      try {
        const proyectos = await dashboardService.getProjectsOverview(codCia.toString());

        if (proyectos && proyectos.length > 0) {
          // Crear alertas de ejemplo basadas en los proyectos
          proyectos.slice(0, 3).forEach((proyecto, index) => {
            const niveles = ['rojo', 'naranja', 'amarillo'] as const;
            const nivel = niveles[index % 3];

            alertasMock.push({
              id: `alert-${proyecto.codPyto}`,
              codPyto: proyecto.codPyto,
              nombreProyecto: proyecto.nombPyto,
              nombrePartida: `Partida ${index + 1}`,
              nivel: nivel,
              mensaje: nivel === 'rojo'
                ? 'Presupuesto excedido'
                : nivel === 'naranja'
                ? 'Cerca del límite presupuestal'
                : 'Uso normal del presupuesto',
              porcentajeEjecucion: nivel === 'rojo' ? 105 : nivel === 'naranja' ? 85 : 65,
              presupuestoTotal: proyecto.costoTotal || 100000,
              presupuestoEjecutado: (proyecto.costoTotal || 100000) * (nivel === 'rojo' ? 1.05 : nivel === 'naranja' ? 0.85 : 0.65),
              presupuestoDisponible: (proyecto.costoTotal || 100000) * (nivel === 'rojo' ? -0.05 : nivel === 'naranja' ? 0.15 : 0.35),
            });
          });
        }
      } catch (error) {
        console.log('No se pudieron cargar proyectos para alertas');
      }

      setAlertas(alertasMock);
    } catch (error) {
      console.warn('Error al cargar alertas de presupuesto');
      setAlertas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, [codCia]);

  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case 'rojo':
        return 'destructive';
      case 'naranja':
        return 'destructive';
      case 'amarillo':
        return 'default';
      case 'verde':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getBadgeColor = (nivel: string) => {
    switch (nivel) {
      case 'rojo':
        return 'bg-red-500 hover:bg-red-600';
      case 'naranja':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'amarillo':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'verde':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  };

  const getIcon = (nivel: string) => {
    switch (nivel) {
      case 'rojo':
        return <AlertCircle className="h-4 w-4" />;
      case 'naranja':
        return <AlertTriangle className="h-4 w-4" />;
      case 'amarillo':
        return <TrendingUp className="h-4 w-4" />;
      case 'verde':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Presupuesto</CardTitle>
          <CardDescription>Partidas que requieren atención</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Presupuesto</CardTitle>
        <CardDescription>
          {alertas.length > 0
            ? 'Partidas que requieren atención'
            : 'No hay alertas activas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              Todos los presupuestos están bajo control
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <Link
                key={alerta.id}
                href={`/proyectos/${alerta.codPyto}/presupuesto`}
                className="block"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  <div className="mt-0.5">
                    <Badge className={getBadgeColor(alerta.nivel)}>
                      {getIcon(alerta.nivel)}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {alerta.nombrePartida}
                      </p>
                      <Badge variant="outline" className="ml-2">
                        {alerta.porcentajeEjecucion.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alerta.nombreProyecto}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alerta.mensaje}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>
                        Ejecutado: S/ {alerta.presupuestoEjecutado.toLocaleString('es-PE')}
                      </span>
                      <span>
                        Disponible: S/ {alerta.presupuestoDisponible.toLocaleString('es-PE')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
