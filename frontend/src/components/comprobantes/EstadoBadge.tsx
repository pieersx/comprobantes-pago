'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';

interface EstadoBadgeProps {
  estado: 'REG' | 'PEN' | 'PAG' | 'ANU';
  className?: string;
}

export function EstadoBadge({ estado, className = '' }: EstadoBadgeProps) {
  const config = {
    'REG': {
      variant: 'secondary' as const,
      label: 'Registrado',
      icon: <FileText className="h-3 w-3" />,
      description: 'Sin pago registrado',
      colorClass: ''
    },
    'PEN': {
      variant: 'outline' as const,
      label: 'Pendiente',
      icon: <Clock className="h-3 w-3" />,
      description: 'Pago pendiente',
      colorClass: ''
    },
    'PAG': {
      variant: 'default' as const,
      label: 'Pagado',
      icon: <CheckCircle className="h-3 w-3" />,
      description: 'Pago completado',
      colorClass: 'bg-green-600 hover:bg-green-700'
    },
    'ANU': {
      variant: 'destructive' as const,
      label: 'Anulado',
      icon: <XCircle className="h-3 w-3" />,
      description: 'Comprobante anulado',
      colorClass: ''
    },
  };

  const { variant, label, icon, description, colorClass } = config[estado] || config['REG'];

  return (
    <Badge
      variant={variant}
      className={`gap-1 ${colorClass || ''} ${className}`}
      title={description}
    >
      {icon}
      {label}
    </Badge>
  );
}
