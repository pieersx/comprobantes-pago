'use client';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    comprobantesEgresoService,
    comprobantesIngresoService,
} from '@/services/comprobantes.service';
import { useAppStore } from '@/store/useAppStore';
import { CompPagoCab, VtaCompPagoCab } from '@/types/comprobante';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Edit, Eye, Trash2 } from 'lucide-react';

type ComprobanteItem = VtaCompPagoCab | CompPagoCab;

interface ComprobantesListProps {
 tipo: 'ingreso' | 'egreso';
 onView?: (comprobante: ComprobanteItem) => void;
 onEdit?: (comprobante: ComprobanteItem) => void;
 onDelete?: (comprobante: ComprobanteItem) => void;
}

export function ComprobantesList({
 tipo,
 onView,
 onEdit,
 onDelete,
}: ComprobantesListProps) {
 const { companiaActual } = useAppStore();
 const codCia = companiaActual?.codCia ?? 1;

 const { data: comprobantes = [], isLoading } = useQuery<ComprobanteItem[]>({
 queryKey: ['comprobantes', tipo, codCia],
 queryFn: () =>
 tipo === 'ingreso'
 ? comprobantesIngresoService.getAll(codCia)
 : comprobantesEgresoService.getAll(codCia),
 });

 const getEstadoBadge = (estado: string) => {
 // Estados según la base de datos: '001' = Registrado, '002' = Pagado, '003' = Anulado
 const estados: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
 '001': { label: 'Registrado', variant: 'warning' },
 '002': { label: 'Pagado', variant: 'success' },
 '003': { label: 'Anulado', variant: 'destructive' },
 // Mantener compatibilidad con códigos antiguos por si acaso
 ACT: { label: 'Activo', variant: 'default' },
 PAG: { label: 'Pagado', variant: 'success' },
 PEN: { label: 'Pendiente', variant: 'warning' },
 ANU: { label: 'Anulado', variant: 'destructive' },
 };

 const est = estados[estado] || { label: estado, variant: 'secondary' };
 return <Badge variant={est.variant}>{est.label}</Badge>;
 };

 const formatCurrency = (value?: number | null) => {
 return new Intl.NumberFormat('es-PE', {
 style: 'currency',
 currency: 'PEN',
 }).format(value ?? 0);
 };

 const isIngreso = (comprobante: ComprobanteItem): comprobante is VtaCompPagoCab =>
 tipo === 'ingreso';

 const getEntidadLabel = (comprobante: ComprobanteItem) => {
 if (isIngreso(comprobante)) {
 return comprobante.nombreCliente || comprobante.codCliente;
 };
 return comprobante.nombreProveedor || comprobante.codProveedor;
 };

 const getProyectoLabel = (comprobante: ComprobanteItem) => {
 if (isIngreso(comprobante)) {
 return comprobante.nombreProyecto || comprobante.codPyto;
 }
 return comprobante.nombreProyecto || comprobante.codPyto;
 };

 const getMonedaLabel = (comprobante: ComprobanteItem) => {
 // Intentar obtener descripción, si no hay, mostrar código mapeado
 const desc = (comprobante as any).monedaDesc ||
              (comprobante as any).descMoneda ||
              (comprobante as any).descripcionMoneda;
 if (desc) return desc;

 // Fallback: mapear código a nombre
 const monedaMap: Record<string, string> = { '001': 'Soles', '002': 'Dólares', '003': 'Euros' };
 return monedaMap[comprobante.eMoneda] || comprobante.eMoneda;
 };

 const getTipoComprobanteLabel = (comprobante: ComprobanteItem) => {
 // Intentar obtener descripción, si no hay, mostrar código mapeado
 const desc = (comprobante as any).tipoComprobanteDesc ||
              (comprobante as any).descTipoComprobante ||
              (comprobante as any).descripcionTipoComprobante;
 if (desc) return desc;

 // Fallback: mapear código a nombre
 const tipoMap: Record<string, string> = { '001': 'Factura', '002': 'R x H', '003': 'Voucher' };
 return tipoMap[comprobante.eCompPago] || comprobante.eCompPago;
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
 <p className="mt-4 text-muted-foreground">Cargando comprobantes...</p>
 </div>
 </div>
 );
 }

 if (!comprobantes || comprobantes.length === 0) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="text-center">
 <p className="text-lg font-medium">No hay comprobantes registrados</p>
 <p className="text-sm text-muted-foreground mt-2">
 Crea tu primer comprobante para comenzar
 </p>
 </div>
 </div>
 );
 }

 return (
 <div className="rounded-md border">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>N° Comprobante</TableHead>
 <TableHead>Fecha</TableHead>
 <TableHead>Proyecto</TableHead>
 <TableHead>{tipo === 'ingreso' ? 'Cliente' : 'Proveedor'}</TableHead>
 <TableHead>Tipo</TableHead>
 <TableHead>Moneda</TableHead>
 <TableHead className="text-right">Monto Total</TableHead>
 <TableHead>Estado</TableHead>
 <TableHead className="text-right">Acciones</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {comprobantes.map((comprobante) => (
 <TableRow key={comprobante.nroCp}>
 <TableCell className="font-medium">{comprobante.nroCp}</TableCell>
 <TableCell>
 {format(new Date(comprobante.fecCp), 'dd/MM/yyyy', { locale: es })}
 </TableCell>
 <TableCell>{getProyectoLabel(comprobante)}</TableCell>
 <TableCell>{getEntidadLabel(comprobante)}</TableCell>
 <TableCell>{getTipoComprobanteLabel(comprobante)}</TableCell>
 <TableCell>{getMonedaLabel(comprobante)}</TableCell>
 <TableCell className="text-right font-medium">
 {formatCurrency(comprobante.impTotalMn)}
 </TableCell>
 <TableCell>{getEstadoBadge(comprobante.codEstado)}</TableCell>
 <TableCell className="text-right">
 <div className="flex justify-end gap-2">
  <Button
  variant="ghost"
  size="icon"
  onClick={() => onView?.(comprobante)}
  title="Ver detalle"
  >
  <Eye className="h-4 w-4" />
  </Button>
  <Button
  variant="ghost"
  size="icon"
  onClick={() => onEdit?.(comprobante)}
  title="Editar"
  >
  <Edit className="h-4 w-4" />
  </Button>
  <Button
  variant="ghost"
  size="icon"
  onClick={() => onDelete?.(comprobante)}
  title="Eliminar"
  className="text-destructive"
  >
  <Trash2 className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="icon" title="Descargar PDF">
  <Download className="h-4 w-4" />
  </Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}
