'use client';

import { AlertasWidget } from '@/components/dashboard/AlertasWidget';
import { CashFlowChart } from '@/components/dashboard/cashflow-chart';
import { MonthlyComparison } from '@/components/dashboard/monthly-comparison';
import { ProjectsOverview } from '@/components/dashboard/projects-overview';
import { RecentVouchers } from '@/components/dashboard/recent-vouchers';
import { TopProviders } from '@/components/dashboard/top-providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardService } from '@/services/dashboard.service';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Building2,
    DollarSign,
    FileText,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia;
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', codCia],
    queryFn: () => dashboardService.getStats(codCia?.toString()),
  });

  const { data: cashflow } = useQuery({
    queryKey: ['dashboard-cashflow', codCia],
    queryFn: () => dashboardService.getCashFlowData(codCia?.toString()),
  });

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleString('es-PE')}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {stats?.totalIngresos?.toLocaleString('es-PE') || '0'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {stats?.totalEgresos?.toLocaleString('es-PE') || '0'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              +8.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {((stats?.totalIngresos || 0) - (stats?.totalEgresos || 0)).toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Activity className="h-3 w-3 text-blue-600 mr-1" />
              Flujo positivo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comprobantes</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalComprobantes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.comprobantesPendientes || 0} pendientes de pago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Estados de Comprobantes */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Comprobantes por Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Registrados (REG)</span>
              </div>
              <span className="font-bold">{stats?.comprobantesRegistrados || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Pagados (PAG)</span>
              </div>
              <span className="font-bold">{stats?.comprobantesPagados || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Anulados (ANU)</span>
              </div>
              <span className="font-bold">{stats?.comprobantesAnulados || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Presupuesto General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Presupuestado</span>
                <span className="font-medium">S/ {(stats?.presupuestoTotal || 0).toLocaleString('es-PE')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ejecutado</span>
                <span className="font-medium">S/ {(stats?.presupuestoEjecutado || 0).toLocaleString('es-PE')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disponible</span>
                <span className="font-medium text-green-600">
                  S/ {((stats?.presupuestoTotal || 0) - (stats?.presupuestoEjecutado || 0)).toLocaleString('es-PE')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alertas de Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Críticas</span>
              </div>
              <span className="font-bold text-red-600">{stats?.alertasCriticas || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Urgentes</span>
              </div>
              <span className="font-bold text-orange-600">{stats?.alertasUrgentes || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Atención</span>
              </div>
              <span className="font-bold text-yellow-600">{stats?.alertasAtencion || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Flujo de Caja</CardTitle>
                <CardDescription>
                  Comparación mensual de ingresos vs egresos
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <CashFlowChart data={cashflow} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Comprobantes Recientes</CardTitle>
                <CardDescription>
                  Últimos movimientos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentVouchers />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Proyectos Activos</CardTitle>
                <CardDescription>
                  Estado financiero por proyecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsOverview />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Proveedores</CardTitle>
                <CardDescription>
                  Mayores montos de egresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopProviders />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div key={refreshKey}>
              <AlertasWidget />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comparación Mensual</CardTitle>
                <CardDescription>
                  Análisis mes a mes del año actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyComparison />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Clave</CardTitle>
                <CardDescription>
                  KPIs del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Proveedores Activos</span>
                  </div>
                  <span className="font-bold">{stats?.proveedoresActivos || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Clientes Activos</span>
                  </div>
                  <span className="font-bold">{stats?.clientesActivos || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Proyectos en Curso</span>
                  </div>
                  <span className="font-bold">{stats?.proyectosActivos || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
              <CardDescription>
                Genera reportes personalizados del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Funcionalidad de reportes en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
