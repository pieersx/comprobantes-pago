'use client';

import { Progress } from '@/components/ui/progress';
import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

export function ProjectsOverview() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-overview'],
    queryFn: () => dashboardService.getProjectsOverview(),
  });

  if (isLoading) {
    return <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-2 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      {projects?.map((project) => (
        <div key={project.codPyto} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {project.nombPyto}
              </p>
              <p className="text-xs text-muted-foreground">
                Código: {project.codPyto}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{project.porcentaje}%</p>
              <p className="text-xs text-muted-foreground">
                S/ {project.gastado.toLocaleString('es-PE')} / {project.costoTotal.toLocaleString('es-PE')}
              </p>
            </div>
          </div>
          <Progress value={project.porcentaje} className="h-2" />
        </div>
      ))}
    </div>
  );
}
