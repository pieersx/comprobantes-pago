'use client';

import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';

export function TopProviders() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['top-providers'],
    queryFn: () => dashboardService.getTopProviders(),
  });

  if (isLoading) {
    return <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
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
      {providers?.map((provider) => (
        <div key={provider.codProveedor} className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              {provider.nombre}
            </p>
            <p className="text-xs text-muted-foreground">
              {provider.comprobantes} comprobantes
            </p>
          </div>
          <div className="font-medium">
            S/ {provider.total.toLocaleString('es-PE')}
          </div>
        </div>
      ))}
    </div>
  );
}
