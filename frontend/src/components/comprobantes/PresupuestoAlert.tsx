'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertaPresupuesto } from '@/types/presupuesto';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface PresupuestoAlertProps {
  alertas: AlertaPresupuesto[];
  onDismiss?: (alertaId: string) => void;
}

/**
 * Componente para mostrar alertas de presupuesto con semáforo visual
 * Muestra alertas con colores según el nivel de criticidad
 *
 * @param alertas - Array de alertas a mostrar
 * @param onDismiss - Callback cuando se descarta una alerta
 */
export function PresupuestoAlert({ alertas, onDismiss }: PresupuestoAlertProps) {
  if (alertas.length === 0) {
    return null;
  }

  const getAlertConfig = (alerta: AlertaPresupuesto) => {
    switch (alerta.nivel) {
      case 'verde':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          badgeVariant: 'success' as const,
        };
      case 'amarillo':
        return {
          icon: Info,
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          badgeVariant: 'warning' as const,
        };
      case 'naranja':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          badgeVariant: 'warning' as const,
        };
      case 'rojo':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          badgeVariant: 'destructive' as const,
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          badgeVariant: 'secondary' as const,
        };
    }
  };

  const formatearMonto = (monto: number): string => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const getTipoLabel = (tipo: string): string => {
    switch (tipo) {
      case 'info':
        return 'Información';
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Error';
      default:
        return 'Alerta';
    }
  };

  return (
    <div className="space-y-3">
      {alertas.map((alerta) => {
        const config = getAlertConfig(alerta);
        const Icon = config.icon;

        return (
          <div
            key={alerta.id}
            className={`relative rounded-lg border p-4 ${config.bgColor}`}
          >
            <div className="flex items-start gap-3">
              {/* Icono */}
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Contenido */}
              <div className="flex-1 space-y-2">
                {/* Encabezado */}
                <div className="flex items-center gap-2">
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {getTipoLabel(alerta.tipo)}
                  </Badge>
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    Partida {alerta.codPartida} - {alerta.nombrePartida}
                  </span>
                </div>

                {/* Mensaje */}
                <p className={`text-sm ${config.textColor}`}>{alerta.mensaje}</p>

                {/* Detalles de presupuesto */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-current/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Presupuesto Original</p>
                    <p className={`text-sm font-medium ${config.textColor}`}>
                      {formatearMonto(alerta.presupuestoOriginal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ejecutado</p>
                    <p className={`text-sm font-medium ${config.textColor}`}>
                      {formatearMonto(alerta.presupuestoEjecutado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Disponible</p>
                    <p className={`text-sm font-medium ${config.textColor}`}>
                      {formatearMonto(alerta.presupuestoDisponible)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">% Ejecutado</p>
                    <p className={`text-sm font-medium ${config.textColor}`}>
                      {alerta.porcentajeEjecucion.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de cerrar */}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex-shrink-0 h-6 w-6 ${config.iconColor} hover:bg-current/10`}
                  onClick={() => onDismiss(alerta.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Descartar alerta</span>
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
