'use client';

import { Badge } from '@/components/ui/badge';
import { comprobantesUnifiedService } from '@/services/comprobantes-unified.service';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function RecentVouchers() {
  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['recent-vouchers'],
    queryFn: () => comprobantesUnifiedService.getRecent(5),
  });

  if (isLoading) {
    return <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="ml-4 space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      {vouchers?.map((voucher: any) => (
        <div key={voucher.nroCP} className="flex items-center">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            voucher.tipo === 'INGRESO' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {voucher.tipo === 'INGRESO' ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              {voucher.nroCP}
            </p>
            <p className="text-sm text-muted-foreground">
              {voucher.proveedor || voucher.cliente}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium">
              S/ {voucher.impTotalMn?.toLocaleString('es-PE')}
            </div>
            <Badge
              variant={
                voucher.estado === '002' ? 'default' : // Pagado
                voucher.estado === '001' ? 'secondary' : // Registrado
                'destructive' // Anulado
              }
              className="text-xs"
            >
              {voucher.estado === '001' ? 'Registrado' :
               voucher.estado === '002' ? 'Pagado' :
               voucher.estado === '003' ? 'Anulado' :
               voucher.estado}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
