'use client';

/**
 * Componente para mostrar el estado de un comprobante con badge visual
 * Estados: REGISTRADO, PARCIALMENTE_PAGADO, TOTALMENTE_PAGADO, ANULADO
 */

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';

interface EstadoComprobanteBadgeProps {
  codEstado: string;
  descripcionEstado?: string;
  showIcon?: boolean;
  className?: string;
}

const ESTADOS_CONFIG = {
  '001': {
    label: 'Registrado',
    variant: 'secondary' as const,
    icon: Circle,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  '002': {
    label: 'Parcialmente Pagado',
    variant: 'default' as const,
    icon: Clock,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  '003': {
    label: 'Totalmente Pagado',
    variant: 'default' as const,
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  '004': {
    label: 'Anulado',
    variant: 'destructive' as const,
    icon: XCircle,
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
};

export function EstadoComprobanteBadge({
  codEstado,
  descripcionEstado,
  showIcon = true,
  className = '',
}: EstadoComprobanteBadgeProps) {
  const config = ESTADOS_CONFIG[codEstado as keyof typeof ESTADOS_CONFIG] || ESTADOS_CONFIG['001'];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className} flex items-center gap-1.5 px-3 py-1`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{descripcionEstado || config.label}</span>
    </Badge>
  );
}

/**
 * Hook para obtener información del estado
 */
export function useEstadoInfo(codEstado: string) {
  const config = ESTADOS_CONFIG[codEstado as keyof typeof ESTADOS_CONFIG];

  return {
    label: config?.label || 'Desconocido',
    variant: config?.variant || 'secondary',
    icon: config?.icon || Circle,
    canEdit: codEstado === '001' || codEstado === '002', // Solo registrado o parcialmente pagado
    canAddPayment: codEstado === '001' || codEstado === '002',
    canCancel: codEstado !== '004', // No se puede anular uno ya anulado
    isFinal: codEstado === '003' || codEstado === '004', // Totalmente pagado o anulado
  };
}

/**
 * Componente para mostrar el flujo de estados
 */
export function EstadoFlow({ currentEstado }: { currentEstado: string }) {
  const estados = ['001', '002', '003', '004'];
  const currentIndex = estados.indexOf(currentEstado);

  return (
    <div className="flex items-center gap-2">
      {estados.map((estado, index) => {
        const config = ESTADOS_CONFIG[estado as keyof typeof ESTADOS_CONFIG];
        const isActive = estado === currentEstado;
        const isPast = index < currentIndex;
        const Icon = config.icon;

        return (
          <div key={estado} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? config.className
                  : isPast
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{config.label}</span>
            </div>
            {index < estados.length - 1 && (
              <div
                className={`h-px w-8 ${
                  isPast ? 'bg-gray-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
