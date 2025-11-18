'use client';

import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
    comprobantesEgresoService,
    comprobantesIngresoService,
} from '@/services/comprobantes.service';
import { useAppStore } from '@/store/useAppStore';
import { Download, Edit, FileX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Página de detalle de un comprobante
 * Muestra toda la información en modo readonly con opciones para editar y anular
 */
export default function DetalleComprobantePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia ? Number(companiaActual.codCia) : 1;

  const [loading, setLoading] = useState(true);
  const [comprobante, setComprobante] = useState<any>(null);
  const [tipo, setTipo] = useState<'ingreso' | 'egreso'>('egreso');
  const [anularDialogOpen, setAnularDialogOpen] = useState(false);
  const [anulando, setAnulando] = useState(false);

  const comprobanteId = params.id as string;

  useEffect(() => {
    const cargarComprobante = async () => {
      try {
        setLoading(true);

        const parts = comprobanteId.split('-');
        const tipoComprobante = parts[0];

        if (tipoComprobante === 'egreso') {
          if (parts.length < 3) {
            throw new Error('ID de comprobante inválido');
          }
          const codProveedor = parseInt(parts[1]);
          const nroCp = parts.slice(2).join('-');

          setTipo('egreso');
          const data = await comprobantesEgresoService.getById(codCia, codProveedor, nroCp);
          setComprobante(data);
        } else if (tipoComprobante === 'ingreso') {
          if (parts.length < 2) {
            throw new Error('ID de comprobante inválido');
          }
          const nroCp = parts.slice(1).join('-');

          setTipo('ingreso');
          const data = await comprobantesIngresoService.getById(codCia, nroCp);
          setComprobante(data);
        } else {
          throw new Error('Tipo de comprobante inválido');
        }
      } catch (err: any) {
        console.error('Error al cargar comprobante:', err);
        toast({
          title: 'Error',
          description: err.message || 'No se pudo cargar el comprobante',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (comprobanteId) {
      cargarComprobante();
    }
  }, [comprobanteId, codCia, toast]);

  const handleAnular = async () => {
    try {
      setAnulando(true);

      const parts = comprobanteId.split('-');
      if (tipo === 'egreso') {
        const codProveedor = parseInt(parts[1]);
        const nroCp = parts.slice(2).join('-');
        await comprobantesEgresoService.anular(codCia, codProveedor, nroCp);
      } else {
        const nroCp = parts.slice(1).join('-');
        await comprobantesIngresoService.anular(codCia, nroCp);
      }

      toast({
        title: 'Comprobante anulado',
        description: 'El comprobante ha sido anulado exitosamente',
      });

      // Recargar datos
      setAnularDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error('Error al anular comprobante:', err);
      toast({
        title: 'Error',
        description: err.message || 'No se pudo anular el comprobante',
        variant: 'destructive',
      });
    } finally {
      setAnulando(false);
    }
  };

  const handleDescargarPDF = () => {
    toast({
      title: 'Funcionalidad en desarrollo',
      description: 'La descarga de PDF estará disponible próximamente',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando comprobante...</p>
        </div>
      </div>
    );
  }

  if (!comprobante) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 py-12">
          <h2 className="text-2xl font-bold">Comprobante no encontrado</h2>
          <Link
            href="/comprobantes"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Volver a Comprobantes
          </Link>
        </div>
      </div>
    );
  }

  const estadoVariant =
    comprobante.codEstado === 'PAG'
      ? 'default'
      : comprobante.codEstado === 'ANU'
      ? 'destructive'
      : 'secondary';

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/comprobantes">Comprobantes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{comprobante.nroCp}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Encabezado con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Comprobante {comprobante.nroCp}
          </h1>
          <p className="text-muted-foreground mt-2">
            {tipo === 'egreso' ? 'Comprobante de Egreso' : 'Comprobante de Ingreso'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDescargarPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          {comprobante.codEstado !== 'ANU' && comprobante.codEstado !== 'PAG' && (
            <Button variant="outline" asChild>
              <Link href={`/comprobantes/${comprobanteId}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          {comprobante.codEstado !== 'ANU' && (
            <Button variant="destructive" onClick={() => setAnularDialogOpen(true)}>
              <FileX className="mr-2 h-4 w-4" />
              Anular
            </Button>
          )}
        </div>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Comprobante</p>
              <p className="text-lg font-semibold mt-1">{comprobante.nroCp}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={estadoVariant} className="mt-1">
                {comprobante.codEstado}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Emisión</p>
              <p className="text-lg font-semibold mt-1">
                {new Date(comprobante.fecCp).toLocaleDateString('es-PE')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Proyecto</p>
              <p className="text-lg font-semibold mt-1">Proyecto {comprobante.codPyto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tipo === 'egreso' ? 'Proveedor' : 'Cliente'}
              </p>
              <p className="text-lg font-semibold mt-1">
                {tipo === 'egreso'
                  ? `Proveedor ${comprobante.codProveedor}`
                  : `Cliente ${comprobante.codCliente}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Moneda</p>
              <p className="text-lg font-semibold mt-1">{comprobante.tMoneda}</p>
            </div>
            {comprobante.tMoneda === 'USD' && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Cambio</p>
                <p className="text-lg font-semibold mt-1">{comprobante.tipCambio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalle de Partidas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Partidas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sec</TableHead>
                <TableHead>Partida</TableHead>
                <TableHead className="text-right">Importe Neto</TableHead>
                <TableHead className="text-right">IGV</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comprobante.detalles && comprobante.detalles.length > 0 ? (
                comprobante.detalles.map((detalle: any) => (
                  <TableRow key={detalle.sec}>
                    <TableCell>{detalle.sec}</TableCell>
                    <TableCell>
                      Partida {detalle.codPartida}
                      {detalle.descripcion && (
                        <span className="text-muted-foreground block text-sm">
                          {detalle.descripcion}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      S/ {(detalle.impNetoMn || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      S/ {(detalle.impIgvMn || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      S/ {(detalle.impTotalMn || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay detalles disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totales */}
      <Card>
        <CardHeader>
          <CardTitle>Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
              <p className="text-2xl font-semibold mt-1">
                S/ {(comprobante.impNetoMn || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">IGV Total</p>
              <p className="text-2xl font-semibold mt-1">
                S/ {(comprobante.impIgvMn || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total General</p>
              <p className="text-2xl font-bold text-primary mt-1">
                S/ {(comprobante.impTotalMn || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant={estadoVariant}>{comprobante.codEstado}</Badge>
                </TableCell>
                <TableCell>{new Date(comprobante.fecCp).toLocaleDateString('es-PE')}</TableCell>
                <TableCell>Sistema</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para anular */}
      <Dialog open={anularDialogOpen} onOpenChange={setAnularDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar anulación</DialogTitle>
            <DialogDescription>
              {comprobante.codEstado === 'PAG'
                ? 'Este comprobante ya fue pagado. ¿Está seguro que desea anularlo? Esta acción no se puede deshacer.'
                : '¿Está seguro que desea anular este comprobante? Esta acción no se puede deshacer.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAnularDialogOpen(false)}
              disabled={anulando}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleAnular} disabled={anulando}>
              {anulando ? 'Anulando...' : 'Confirmar anulación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
