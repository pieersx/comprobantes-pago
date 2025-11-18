'use client';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { CompanySelector } from '@/components/layout/company-selector';
import { comprobantesEgresoService, comprobantesIngresoService } from '@/services/comprobantes.service';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import {
    DollarSign,
    FileText,
    FolderOpen,
    TrendingDown,
    TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
 const { companiaActual } = useAppStore();

 // Obtener comprobantes de ingreso
 const { data: ingresos = [] } = useQuery({
 queryKey: ['comprobantes-ingreso', companiaActual?.codCia],
 queryFn: () =>
 companiaActual
 ? comprobantesIngresoService.getAll(companiaActual.codCia)
 : Promise.resolve([]),
 enabled: !!companiaActual,
 });

 // Obtener comprobantes de egreso
 const { data: egresos = [] } = useQuery({
 queryKey: ['comprobantes-egreso', companiaActual?.codCia],
 queryFn: () =>
 companiaActual
 ? comprobantesEgresoService.getAll(companiaActual.codCia)
 : Promise.resolve([]),
 enabled: !!companiaActual,
 });

 // Calcular totales
 const totalIngresos = ingresos.reduce(
 (sum, comp) => sum + (comp.impTotalMn || 0),
 0
 );
 const totalEgresos = egresos.reduce(
 (sum, comp) => sum + (comp.impTotalMn || 0),
 0
 );
 const balance = totalIngresos - totalEgresos;

 const formatCurrency = (value: number) => {
 return new Intl.NumberFormat('es-PE', {
 style: 'currency',
 currency: 'PEN',
 }).format(value);
 };

 if (!companiaActual) {
 return (
 <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
 <div className="text-center">
 <h2 className="text-2xl font-bold">Bienvenido al Sistema de Comprobantes</h2>
 <p className="text-muted-foreground mt-2">
 Selecciona una compañía para comenzar
 </p>
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Header */}
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
     <h1 className="text-3xl font-bold">Dashboard</h1>
     <p className="text-muted-foreground mt-1">
        Vista general de {companiaActual.desCia}
     </p>
    </div>
    <CompanySelector className="w-full md:w-64" />
    </div>

 {/* Stats Cards */}
 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 <StatsCard
 title="Total Ingresos"
 value={formatCurrency(totalIngresos)}
 icon={TrendingUp}
 description={`${ingresos.length} comprobantes`}
 className="bg-linear-to-br from-green-50 to-green-100"
 />
 <StatsCard
 title="Total Egresos"
 value={formatCurrency(totalEgresos)}
 icon={TrendingDown}
 description={`${egresos.length} comprobantes`}
 className="bg-linear-to-br from-red-50 to-red-100"
 />
 <StatsCard
 title="Balance"
 value={formatCurrency(balance)}
 icon={DollarSign}
 description={balance >= 0 ? 'Positivo' : 'Negativo'}
 className={
 balance >= 0
 ? 'bg-linear-to-br from-blue-50 to-blue-100'
 : 'bg-linear-to-br from-orange-50 to-orange-100'
 }
 />
 <StatsCard
 title="Total Comprobantes"
 value={ingresos.length + egresos.length}
 icon={FileText}
 description="Ingresos + Egresos"
 className="bg-linear-to-br from-purple-50 to-purple-100"
 />
 </div>

 {/* Recent Activity */}
 <div className="grid gap-4 md:grid-cols-2">
 {/* Recent Ingresos */}
 <div className="rounded-lg border bg-card p-6">
 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-green-600" />
 Últimos Ingresos
 </h3>
 {ingresos.slice(0, 5).length > 0 ? (
 <div className="space-y-3">
 {ingresos.slice(0, 5).map((ingreso) => (
 <div
  key={ingreso.nroCp}
  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
 >
  <div>
  <p className="font-medium">{ingreso.nroCp}</p>
  <p className="text-sm text-muted-foreground">
  {ingreso.nombreCliente || `Cliente ${ingreso.codCliente}`}
  </p>
  </div>
  <p className="font-semibold text-green-600">
  {formatCurrency(ingreso.impTotalMn)}
  </p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">
 No hay ingresos registrados
 </p>
 )}
 </div>

 {/* Recent Egresos */}
 <div className="rounded-lg border bg-card p-6">
 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
 <TrendingDown className="h-5 w-5 text-red-600" />
 Últimos Egresos
 </h3>
 {egresos.slice(0, 5).length > 0 ? (
 <div className="space-y-3">
 {egresos.slice(0, 5).map((egreso) => (
 <div
  key={egreso.nroCp}
  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
 >
  <div>
  <p className="font-medium">{egreso.nroCp}</p>
  <p className="text-sm text-muted-foreground">
  {egreso.nombreProveedor || `Proveedor ${egreso.codProveedor}`}
  </p>
  </div>
  <p className="font-semibold text-red-600">
  {formatCurrency(egreso.impTotalMn)}
  </p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">
 No hay egresos registrados
 </p>
 )}
 </div>
 </div>

 {/* Quick Actions */}
 <div className="rounded-lg border bg-card p-6">
 <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
 <div className="grid gap-4 md:grid-cols-3">
 <a
 href="/ingresos/nuevo"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <div className="p-3 rounded-lg bg-green-100">
 <TrendingUp className="h-5 w-5 text-green-600" />
 </div>
 <div>
 <p className="font-medium">Nuevo Ingreso</p>
 <p className="text-sm text-muted-foreground">Registrar ingreso</p>
 </div>
 </a>
 <a
 href="/egresos/nuevo"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <div className="p-3 rounded-lg bg-red-100">
 <TrendingDown className="h-5 w-5 text-red-600" />
 </div>
 <div>
 <p className="font-medium">Nuevo Egreso</p>
 <p className="text-sm text-muted-foreground">Registrar egreso</p>
 </div>
 </a>
 <a
 href="/proyectos"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <div className="p-3 rounded-lg bg-blue-100">
 <FolderOpen className="h-5 w-5 text-blue-600" />
 </div>
 <div>
 <p className="font-medium">Ver Proyectos</p>
 <p className="text-sm text-muted-foreground">Gestionar proyectos</p>
 </div>
 </a>
 </div>
 </div>
 </div>
 );
}
