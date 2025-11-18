'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComprobanteSimple, comprobantesSimpleService, ComprobanteStats } from '@/services/comprobantes-simple.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    DollarSign,
    FileText,
    Plus,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardPageSimple() {
 const [showNewDialog, setShowNewDialog] = useState(false);

 // Obtener estadísticas
 const { data: stats, isLoading: statsLoading } = useQuery<ComprobanteStats>({
 queryKey: ['voucher-stats'],
 queryFn: () => comprobantesSimpleService.getStats(),
 });

 // Obtener todos los comprobantes
 const { data: comprobantes = [], isLoading: comprobantesLoading } = useQuery<ComprobanteSimple[]>({
 queryKey: ['comprobantes'],
 queryFn: () => comprobantesSimpleService.getAll(),
 });

 const formatCurrency = (value: number) => {
 return new Intl.NumberFormat('es-PE', {
 style: 'currency',
 currency: 'PEN',
 minimumFractionDigits: 2,
 }).format(value);
 };

 // Filtrar ingresos y egresos recientes
 const ingresosRecientes = comprobantes
 .filter(c => c.tipo === 'INGRESO')
 .slice(0, 5);

 const egresosRecientes = comprobantes
 .filter(c => c.tipo === 'EGRESO')
 .slice(0, 5);

 return (
 <div className="container mx-auto py-8 space-y-8">
 {/* Header */}
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-bold">Dashboard</h1>
 <p className="text-muted-foreground mt-1">
 Gestión de Comprobantes de Pago
 </p>
 </div>
 <Button onClick={() => setShowNewDialog(true)}>
 <Plus className="mr-2 h-4 w-4" />
 Nuevo Comprobante
 </Button>
 </div>

 {/* Stats Cards */}
 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Total Ingresos
 </CardTitle>
 <TrendingUp className="h-4 w-4 text-green-600" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold text-green-700">
 {statsLoading ? '...' : formatCurrency(stats?.totalIngresos || 0)}
 </div>
 <p className="text-xs text-green-600 mt-1">
 {stats?.countIngresos || 0} comprobantes
 </p>
 </CardContent>
 </Card>

 <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Total Egresos
 </CardTitle>
 <TrendingDown className="h-4 w-4 text-red-600" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold text-red-700">
 {statsLoading ? '...' : formatCurrency(stats?.totalEgresos || 0)}
 </div>
 <p className="text-xs text-red-600 mt-1">
 {stats?.countEgresos || 0} comprobantes
 </p>
 </CardContent>
 </Card>

 <Card className={`bg-gradient-to-br ${
 (stats?.balance || 0) >= 0
 ? 'from-blue-50 to-blue-100 border-blue-200'
 : 'from-orange-50 to-orange-100 border-orange-200'
 }`}>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Balance
 </CardTitle>
 <DollarSign className="h-4 w-4 text-blue-600" />
 </CardHeader>
 <CardContent>
 <div className={`text-2xl font-bold ${
 (stats?.balance || 0) >= 0
 ? 'text-blue-700'
 : 'text-orange-700'
 }`}>
 {statsLoading ? '...' : formatCurrency(stats?.balance || 0)}
 </div>
 <p className="text-xs text-blue-600 mt-1">
 {(stats?.balance || 0) >= 0 ? 'Positivo' : 'Negativo'}
 </p>
 </CardContent>
 </Card>

 <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">
 Pendientes
 </CardTitle>
 <FileText className="h-4 w-4 text-purple-600" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold text-purple-700">
 {statsLoading ? '...' : stats?.totalPendientes || 0}
 </div>
 <p className="text-xs text-purple-600 mt-1">
 Por aprobar
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Recent Activity */}
 <div className="grid gap-4 md:grid-cols-2">
 {/* Recent Ingresos */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-green-600" />
 Últimos Ingresos
 </CardTitle>
 </CardHeader>
 <CardContent>
 {comprobantesLoading ? (
 <p className="text-center text-muted-foreground py-8">
 Cargando...
 </p>
 ) : ingresosRecientes.length > 0 ? (
 <div className="space-y-3">
 {ingresosRecientes.map((ingreso) => (
  <div
  key={ingreso.id}
  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
  >
  <div className="flex-1">
  <p className="font-medium">{ingreso.numeroComprobante}</p>
  <p className="text-sm text-muted-foreground truncate">
  {ingreso.beneficiario}
  </p>
  <p className="text-xs text-muted-foreground">
  {format(new Date(ingreso.fecha), 'dd MMM yyyy', { locale: es })}
  </p>
  </div>
  <p className="font-semibold text-green-600 ml-2">
  {formatCurrency(ingreso.monto)}
  </p>
  </div>
 ))}
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">
 No hay ingresos registrados
 </p>
 )}
 </CardContent>
 </Card>

 {/* Recent Egresos */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <TrendingDown className="h-5 w-5 text-red-600" />
 Últimos Egresos
 </CardTitle>
 </CardHeader>
 <CardContent>
 {comprobantesLoading ? (
 <p className="text-center text-muted-foreground py-8">
 Cargando...
 </p>
 ) : egresosRecientes.length > 0 ? (
 <div className="space-y-3">
 {egresosRecientes.map((egreso) => (
  <div
  key={egreso.id}
  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
  >
  <div className="flex-1">
  <p className="font-medium">{egreso.numeroComprobante}</p>
  <p className="text-sm text-muted-foreground truncate">
  {egreso.beneficiario}
  </p>
  <p className="text-xs text-muted-foreground">
  {format(new Date(egreso.fecha), 'dd MMM yyyy', { locale: es })}
  </p>
  </div>
  <p className="font-semibold text-red-600 ml-2">
  {formatCurrency(egreso.monto)}
  </p>
  </div>
 ))}
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">
 No hay egresos registrados
 </p>
 )}
 </CardContent>
 </Card>
 </div>

 {/* Quick Actions */}
 <Card>
 <CardHeader>
 <CardTitle>Acciones Rápidas</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid gap-4 md:grid-cols-3">
 <a
 href="/comprobantes?tipo=INGRESO"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
 >
 <div className="p-3 rounded-lg bg-green-100">
 <TrendingUp className="h-5 w-5 text-green-600" />
 </div>
 <div>
 <p className="font-medium">Ver Ingresos</p>
 <p className="text-sm text-muted-foreground">Administrar ingresos</p>
 </div>
 </a>

 <a
 href="/comprobantes?tipo=EGRESO"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
 >
 <div className="p-3 rounded-lg bg-red-100">
 <TrendingDown className="h-5 w-5 text-red-600" />
 </div>
 <div>
 <p className="font-medium">Ver Egresos</p>
 <p className="text-sm text-muted-foreground">Administrar egresos</p>
 </div>
 </a>

 <a
 href="/comprobantes"
 className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
 >
 <div className="p-3 rounded-lg bg-primary/10">
 <FileText className="h-5 w-5 text-primary" />
 </div>
 <div>
 <p className="font-medium">Todos los Comprobantes</p>
 <p className="text-sm text-muted-foreground">Ver listado completo</p>
 </div>
 </a>
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
