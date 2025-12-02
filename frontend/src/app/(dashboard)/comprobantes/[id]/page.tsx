'use client';

import { AbonoInfo, BlobImageUploader, EstadoBadge } from '@/components/comprobantes';
import { FileUploader } from '@/components/comprobantes/FileUploader';
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
import { mapEstadoToUI } from '@/constants/estados';
import { comprobantesEmpleadoService } from '@/services/comprobantes-empleado.service';
import {
    comprobantesEgresoService,
    comprobantesIngresoService,
} from '@/services/comprobantes.service';
import { generarComprobantePDF } from '@/services/pdf-generator.service';
import { useAppStore } from '@/store/useAppStore';
import { Download, Edit, ExternalLink, FileImage, FileX, Image as ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

/**
 * Componente para visualizar imágenes con manejo de errores
 */
interface ImageViewerProps {
  src: string;
  alt: string;
  title: string;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  downloadFilename?: string;
  onError?: () => void;
}

const ImageViewer = ({ src, alt, title, thumbnailSize = 'md', downloadFilename, onError }: ImageViewerProps) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resetear estado cuando cambia la URL de la imagen
  useEffect(() => {
    setImageError(false);
    setLoading(true);
  }, [src]);

  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-40 w-40',
    lg: 'h-56 w-56',
  };

  if (imageError) {
    return (
      <div className={`flex flex-col items-center justify-center ${sizeClasses[thumbnailSize]} bg-muted rounded-lg border border-dashed`}>
        <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`relative ${sizeClasses[thumbnailSize]} bg-muted rounded-lg overflow-hidden border`}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          title={title}
          className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImageError(true);
            setLoading(false);
            onError?.();
          }}
        />
      </div>
      {!imageError && !loading && (
        <div className="flex gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver completa
          </a>
        </div>
      )}
    </div>
  );
};

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
  const [tipo, setTipo] = useState<'ingreso' | 'egreso' | 'egreso-empleado'>('egreso');
  const [anularDialogOpen, setAnularDialogOpen] = useState(false);
  const [anulando, setAnulando] = useState(false);
  const [subirFacturaDialogOpen, setSubirFacturaDialogOpen] = useState(false);
  const [fotoCP, setFotoCP] = useState<string>('');

  const comprobanteId = params.id as string;

  useEffect(() => {
    const cargarComprobante = async () => {
      try {
        setLoading(true);

        // Detectar el tipo de comprobante basado en el prefijo del ID
        // Formatos: egreso-{codProveedor}-{nroCp}, egreso-empleado-{codEmpleado}-{nroCp}, ingreso-{nroCp}
        if (comprobanteId.startsWith('egreso-empleado-')) {
          // Comprobante de empleado: egreso-empleado-{codEmpleado}-{nroCp}
          const withoutPrefix = comprobanteId.replace('egreso-empleado-', '');
          const parts = withoutPrefix.split('-');
          if (parts.length < 2) {
            throw new Error('ID de comprobante de empleado inválido');
          }
          const codEmpleado = parseInt(parts[0]);
          const nroCp = parts.slice(1).join('-');

          if (isNaN(codEmpleado) || codEmpleado <= 0) {
            throw new Error('Código de empleado inválido');
          }

          setTipo('egreso-empleado');
          const data = await comprobantesEmpleadoService.getById(codCia, codEmpleado, nroCp);
          setComprobante(data);
        } else if (comprobanteId.startsWith('egreso-')) {
          // Comprobante de egreso (proveedor): egreso-{codProveedor}-{nroCp}
          const withoutPrefix = comprobanteId.replace('egreso-', '');
          const parts = withoutPrefix.split('-');
          if (parts.length < 2) {
            throw new Error('ID de comprobante de egreso inválido');
          }
          const codProveedor = parseInt(parts[0]);
          const nroCp = parts.slice(1).join('-');

          if (isNaN(codProveedor) || codProveedor <= 0) {
            throw new Error('Código de proveedor inválido');
          }

          setTipo('egreso');
          const data = await comprobantesEgresoService.getById(codCia, codProveedor, nroCp);
          setComprobante(data);
        } else if (comprobanteId.startsWith('ingreso-')) {
          // Comprobante de ingreso: ingreso-{nroCp}
          const nroCp = comprobanteId.replace('ingreso-', '');

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

      if (tipo === 'egreso-empleado') {
        const withoutPrefix = comprobanteId.replace('egreso-empleado-', '');
        const parts = withoutPrefix.split('-');
        const codEmpleado = parseInt(parts[0]);
        const nroCp = parts.slice(1).join('-');
        await comprobantesEmpleadoService.anular(codCia, codEmpleado, nroCp);
      } else if (tipo === 'egreso') {
        const withoutPrefix = comprobanteId.replace('egreso-', '');
        const parts = withoutPrefix.split('-');
        const codProveedor = parseInt(parts[0]);
        const nroCp = parts.slice(1).join('-');
        await comprobantesEgresoService.anular(codCia, codProveedor, nroCp);
      } else {
        const nroCp = comprobanteId.replace('ingreso-', '');
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

  const handleGuardarFotoCP = async () => {
    if (!fotoCP) {
      sonnerToast.error('Debe seleccionar un archivo');
      return;
    }

    try {
      // Guardar FotoCP en el backend - por ahora solo soporta egreso e ingreso
      // TODO: Agregar soporte para empleados cuando el backend lo soporte
      if (tipo === 'egreso') {
        await comprobantesEgresoService.actualizarFotoCP(
          codCia,
          comprobante.codProveedor,
          comprobante.nroCp,
          fotoCP
        );
      } else if (tipo === 'ingreso') {
        await comprobantesIngresoService.actualizarFotoCP(
          codCia,
          comprobante.nroCp,
          fotoCP
        );
      }

      sonnerToast.success('Factura subida correctamente');
      setSubirFacturaDialogOpen(false);
      setFotoCP('');

      // Recargar comprobante
      if (tipo === 'egreso-empleado') {
        const withoutPrefix = comprobanteId.replace('egreso-empleado-', '');
        const parts = withoutPrefix.split('-');
        const codEmpleado = parseInt(parts[0]);
        const nroCp = parts.slice(1).join('-');
        const data = await comprobantesEmpleadoService.getById(codCia, codEmpleado, nroCp);
        setComprobante(data);
      } else if (tipo === 'egreso') {
        const withoutPrefix = comprobanteId.replace('egreso-', '');
        const parts = withoutPrefix.split('-');
        const codProveedor = parseInt(parts[0]);
        const nroCp = parts.slice(1).join('-');
        const data = await comprobantesEgresoService.getById(codCia, codProveedor, nroCp);
        setComprobante(data);
      } else {
        const nroCp = comprobanteId.replace('ingreso-', '');
        const data = await comprobantesIngresoService.getById(codCia, nroCp);
        setComprobante(data);
      }
    } catch (error: any) {
      console.error('Error al subir factura:', error);
      sonnerToast.error(error.message || 'Error al subir la factura');
    }
  };

  const handleDescargarPDF = () => {
    try {
      if (!comprobante) return;

      // Calcular subtotal e IGV desde los detalles si no vienen en el comprobante
      let subtotal = comprobante.impSubTotMn || 0;
      let igvTotal = comprobante.impIgvMn || 0;

      if (comprobante.detalles && comprobante.detalles.length > 0) {
        if (!subtotal) {
          subtotal = comprobante.detalles.reduce((sum: number, d: any) => sum + (d.impNetoMn || 0), 0);
        }
        if (!igvTotal) {
          igvTotal = comprobante.detalles.reduce((sum: number, d: any) => sum + (d.impIgvMn || 0), 0);
        }
      }

      // Convertir detalles a formato de partidas para el PDF
      const partidasParaPDF = comprobante.detalles?.map((detalle: any) => ({
        numSec: detalle.sec,
        codPartida: detalle.codPartida,
        desPartida: detalle.descripcion,
        impNetMn: detalle.impNetoMn,
        impIgvMn: detalle.impIgvMn,
        impTotMn: detalle.impTotalMn,
      })) || [];

      console.log('Datos del comprobante para PDF:', {
        nroCp: comprobante.nroCp,
        codPyto: comprobante.codPyto,
        codProveedor: comprobante.codProveedor,
        codCliente: comprobante.codCliente,
        detalles: comprobante.detalles,
        partidasParaPDF,
        impSubTotMn: subtotal,
        impIgvMn: igvTotal,
        impTotalMn: comprobante.impTotalMn,
      });

      generarComprobantePDF({
        nroCp: comprobante.nroCp,
        fecCp: comprobante.fecCp,
        desCp: comprobante.desCp,
        codEstado: comprobante.codEstado || 'REG',
        codProveedor: comprobante.codProveedor,
        codCliente: comprobante.codCliente,
        desProveedor: comprobante.desProveedor,
        desCliente: comprobante.desCliente,
        codProyecto: comprobante.codPyto,
        desProyecto: comprobante.desPyto,
        codMoneda: comprobante.tMoneda,
        partidas: partidasParaPDF,
        impSubTotMn: subtotal,
        impIgvMn: igvTotal,
        monTotal: comprobante.impTotalMn || 0,
        tipo: tipo === 'egreso-empleado' ? 'egreso' : tipo, // Mapear egreso-empleado a egreso para el PDF
      });

      toast({
        title: 'PDF generado',
        description: 'El PDF se ha descargado correctamente',
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el PDF',
        variant: 'destructive',
      });
    }
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

  const estadoUI = mapEstadoToUI(comprobante.codEstado || 'REG');
  const estadoVariant =
    estadoUI === 'PAG'
      ? 'default'
      : estadoUI === 'ANU'
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
            {tipo === 'egreso' ? 'Comprobante de Egreso' : tipo === 'egreso-empleado' ? 'Comprobante de Egreso (Empleado)' : 'Comprobante de Ingreso'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDescargarPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          {tipo === 'egreso' && mapEstadoToUI(comprobante.codEstado) !== 'ANU' && (
            <Button variant="outline" onClick={() => setSubirFacturaDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Subir Factura
            </Button>
          )}
          {mapEstadoToUI(comprobante.codEstado) !== 'ANU' && mapEstadoToUI(comprobante.codEstado) !== 'PAG' && (
            <Button variant="outline" asChild>
              <Link href={`/comprobantes/${comprobanteId}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          {mapEstadoToUI(comprobante.codEstado) !== 'ANU' && (
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
              <div className="mt-1">
                <EstadoBadge estado={mapEstadoToUI(comprobante.codEstado || 'REG')} />
              </div>
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
                {tipo === 'egreso' ? 'Proveedor' : tipo === 'egreso-empleado' ? 'Empleado' : 'Cliente'}
              </p>
              <p className="text-lg font-semibold mt-1">
                {tipo === 'egreso'
                  ? `Proveedor ${comprobante.codProveedor}`
                  : tipo === 'egreso-empleado'
                  ? comprobante.nombreEmpleado || `Empleado ${comprobante.codEmpleado}`
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
                      {(detalle.nombrePartida || detalle.descripcion) && (
                        <span className="text-muted-foreground block text-sm">
                          {detalle.nombrePartida || detalle.descripcion}
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
                S/ {(comprobante.impIgvMn || comprobante.impIgvmn || 0).toFixed(2)}
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

      {/* Imágenes del Comprobante - Feature: empleados-comprobantes-blob */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Documentos Adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen del Comprobante (FotoCP) */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Imagen del Comprobante</p>
              {tipo === 'egreso' && comprobante.codProveedor ? (
                <>
                  {comprobante.tieneFotoCp ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${comprobante.codProveedor}/${comprobante.nroCp}/foto-cp`}
                      alt="Comprobante"
                      title="Imagen del Comprobante"
                      thumbnailSize="lg"
                      downloadFilename={`comprobante-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de comprobante')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Factura"
                    tipoComprobante="egreso"
                    tipoImagen="foto-cp"
                    codCia={codCia}
                    codProveedor={comprobante.codProveedor}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : tipo === 'egreso-empleado' && comprobante.codEmpleado ? (
                <>
                  {comprobante.tieneFotoCp ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${comprobante.codEmpleado}/${comprobante.nroCp}/foto-cp`}
                      alt="Comprobante"
                      title="Imagen del Comprobante"
                      thumbnailSize="lg"
                      downloadFilename={`comprobante-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de comprobante')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Factura"
                    tipoComprobante="egreso-empleado"
                    tipoImagen="foto-cp"
                    codCia={codCia}
                    codEmpleado={comprobante.codEmpleado}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : tipo === 'ingreso' ? (
                <>
                  {comprobante.fotoCp ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/files/download?path=${encodeURIComponent(comprobante.fotoCp)}`}
                      alt="Comprobante"
                      title="Imagen del Comprobante"
                      thumbnailSize="lg"
                      downloadFilename={`comprobante-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de comprobante')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Factura"
                    tipoComprobante="ingreso"
                    tipoImagen="foto-cp"
                    codCia={codCia}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No disponible</p>
              )}
            </div>

            {/* Imagen del Abono (FotoAbono) */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Imagen del Abono</p>
              {tipo === 'egreso' && comprobante.codProveedor ? (
                <>
                  {comprobante.tieneFotoAbono ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/comprobantes-pago/${codCia}/${comprobante.codProveedor}/${comprobante.nroCp}/foto-abono`}
                      alt="Abono"
                      title="Imagen del Abono"
                      thumbnailSize="lg"
                      downloadFilename={`abono-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de abono')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Voucher"
                    tipoComprobante="egreso"
                    tipoImagen="foto-abono"
                    codCia={codCia}
                    codProveedor={comprobante.codProveedor}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : tipo === 'egreso-empleado' && comprobante.codEmpleado ? (
                <>
                  {comprobante.tieneFotoAbono ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/comprobantes-empleado/${codCia}/${comprobante.codEmpleado}/${comprobante.nroCp}/foto-abono`}
                      alt="Abono"
                      title="Imagen del Abono"
                      thumbnailSize="lg"
                      downloadFilename={`abono-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de abono')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Voucher"
                    tipoComprobante="egreso-empleado"
                    tipoImagen="foto-abono"
                    codCia={codCia}
                    codEmpleado={comprobante.codEmpleado}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : tipo === 'ingreso' ? (
                <>
                  {comprobante.fotoAbono ? (
                    <ImageViewer
                      src={`${process.env.NEXT_PUBLIC_API_URL}/files/download?path=${encodeURIComponent(comprobante.fotoAbono)}`}
                      alt="Abono"
                      title="Imagen del Abono"
                      thumbnailSize="lg"
                      downloadFilename={`abono-${comprobante.nroCp}`}
                      onError={() => console.log('No hay imagen de abono')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 w-56 bg-muted rounded-lg border border-dashed">
                      <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">Sin imagen</p>
                    </div>
                  )}
                  <BlobImageUploader
                    label="Subir/Actualizar Voucher"
                    tipoComprobante="ingreso"
                    tipoImagen="foto-abono"
                    codCia={codCia}
                    nroCP={comprobante.nroCp}
                    onUploadSuccess={() => window.location.reload()}
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No disponible</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Abonos - Para egreso, ingreso y empleados */}
      <AbonoInfo
        tipo={tipo}
        codCia={codCia}
        codProveedor={tipo === 'egreso' ? comprobante.codProveedor : undefined}
        codEmpleado={tipo === 'egreso-empleado' ? comprobante.codEmpleado : undefined}
        nroCP={comprobante.nroCp}
        estado={mapEstadoToUI(comprobante.codEstado || 'REG')}
        onEstadoChange={async () => {
          // Recargar comprobante para actualizar el estado
          if (tipo === 'egreso') {
            const data = await comprobantesEgresoService.getById(
              codCia,
              comprobante.codProveedor,
              comprobante.nroCp
            );
            setComprobante(data);
          } else if (tipo === 'ingreso') {
            const data = await comprobantesIngresoService.getById(codCia, comprobante.nroCp);
            setComprobante(data);
          } else if (tipo === 'egreso-empleado') {
            const data = await comprobantesEmpleadoService.getById(
              codCia,
              comprobante.codEmpleado,
              comprobante.nroCp
            );
            setComprobante(data);
          }
        }}
      />

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
                  <EstadoBadge estado={estadoUI} />
                </TableCell>
                <TableCell>{new Date(comprobante.fecCp).toLocaleDateString('es-PE')}</TableCell>
                <TableCell>Sistema</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para subir factura (FotoCP) */}
      <Dialog open={subirFacturaDialogOpen} onOpenChange={setSubirFacturaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subir Factura del Proveedor</DialogTitle>
            <DialogDescription>
              Cargue el PDF o imagen de la factura recibida del proveedor para el comprobante <strong>{comprobante?.nroCp}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FileUploader
              label="Factura del Proveedor (PDF o Imagen)"
              tipo={tipo === 'egreso-empleado' ? 'egreso' : tipo}
              onUploadSuccess={(path) => setFotoCP(path)}
              currentFile={fotoCP || comprobante?.fotoCP}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={10}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubirFacturaDialogOpen(false);
                setFotoCP('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardarFotoCP} disabled={!fotoCP}>
              Guardar Factura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para anular */}
      <Dialog open={anularDialogOpen} onOpenChange={setAnularDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar anulación</DialogTitle>
            <DialogDescription>
              {mapEstadoToUI(comprobante.codEstado) === 'PAG'
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
