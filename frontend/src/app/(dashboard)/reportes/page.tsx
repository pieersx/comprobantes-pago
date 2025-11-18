'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart3,
    Calendar,
    Download,
    FileBarChart,
    FileSpreadsheet,
    FileText,
    Printer,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function ReportesPage() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: string, format: 'PDF' | 'Excel' = 'PDF') => {
    setGeneratingReport(reportType);

    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mostrar mensaje informativo
    alert(`🚧 Funcionalidad en Desarrollo\n\nLa generación de reportes ${format} está siendo implementada.\n\nPróximamente podrás descargar:\n• ${reportType}\n• Formato: ${format}\n\nMientras tanto, puedes usar los datos mostrados en el dashboard.`);

    setGeneratingReport(null);
  };

  const reportes = [
    {
      id: 'comprobantes-general',
      title: 'Reporte General de Comprobantes',
      description: 'Listado completo de todos los comprobantes de pago (ingresos y egresos)',
      icon: FileText,
      color: 'blue',
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'ingresos-periodo',
      title: 'Reporte de Ingresos por Período',
      description: 'Análisis detallado de ingresos con filtros por fecha y proyecto',
      icon: TrendingUp,
      color: 'green',
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'egresos-periodo',
      title: 'Reporte de Egresos por Período',
      description: 'Análisis detallado de egresos con filtros por fecha y proveedor',
      icon: TrendingDown,
      color: 'red',
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'flujo-caja',
      title: 'Reporte de Flujo de Caja',
      description: 'Proyección mensual de ingresos vs egresos con saldos acumulados',
      icon: BarChart3,
      color: 'purple',
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'proyectos-financiero',
      title: 'Reporte Financiero por Proyecto',
      description: 'Estado financiero detallado de cada proyecto con presupuesto vs gastado',
      icon: FileBarChart,
      color: 'orange',
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'proveedores-ranking',
      title: 'Ranking de Proveedores',
      description: 'Top proveedores por monto total de egresos y cantidad de comprobantes',
      icon: FileSpreadsheet,
      color: 'indigo',
      formats: ['PDF', 'Excel'],
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
          <p className="text-muted-foreground">
            Genera reportes personalizados del sistema
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Configurar Período
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Disponibles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportes.length}</div>
            <p className="text-xs text-muted-foreground">Tipos de reportes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formatos</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">PDF y Excel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generados Hoy</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Reportes generados</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportes.map((reporte) => {
          const Icon = reporte.icon;
          const isGenerating = generatingReport === reporte.id;

          return (
            <Card key={reporte.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${reporte.color}-100`}>
                    <Icon className={`h-6 w-6 text-${reporte.color}-600`} />
                  </div>
                  <div className="flex gap-1">
                    {reporte.formats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardTitle className="mt-4">{reporte.title}</CardTitle>
                <CardDescription>{reporte.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleGenerateReport(reporte.id, 'PDF')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generar PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport(reporte.id, 'Excel')}
                    disabled={isGenerating}
                    title="Generar Excel"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Información sobre Reportes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>
            • Los reportes se generan con los datos actuales de la compañía seleccionada
          </p>
          <p>
            • Puedes exportar en formato PDF para impresión o Excel para análisis
          </p>
          <p>
            • Los reportes incluyen gráficos, tablas y resúmenes ejecutivos
          </p>
          <p>
            • Configura el período de análisis usando el botón "Configurar Período"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
