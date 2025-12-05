'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { abonosService, type AbonoData } from '@/services/abonos.service';
import { FileIcon, Loader2, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EstadoBadge } from './EstadoBadge';
import { RegistrarPagoModal } from './RegistrarPagoModal';

const MEDIOS_PAGO = [
  'Efectivo',
  'Transferencia bancaria',
  'Yape',
  'Plin',
  'Cheque',
  'Depósito bancario',
  'Otro',
];

interface AbonoInfoProps {
  tipo: 'egreso' | 'ingreso' | 'egreso-empleado';
  codCia: number;
  codProveedor?: number;
  codEmpleado?: number;
  nroCP: string;
  estado: 'REG' | 'PEN' | 'PAG' | 'ANU';
  onEstadoChange?: () => void;
}

export function AbonoInfo({
  tipo,
  codCia,
  codProveedor,
  codEmpleado,
  nroCP,
  estado,
  onEstadoChange,
}: AbonoInfoProps) {
  const [abono, setAbono] = useState<AbonoData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fechaAbono: '',
    descripcionMedioPago: '',
  });

  useEffect(() => {
    cargarAbono();
  }, [codCia, codProveedor, codEmpleado, nroCP, tipo]);

  const cargarAbono = async () => {
    setLoading(true);
    try {
      let data: AbonoData | null = null;

      if (tipo === 'egreso' && codProveedor) {
        data = await abonosService.consultarAbonoEgreso(codCia, codProveedor, nroCP);
      } else if (tipo === 'ingreso') {
        data = await abonosService.consultarAbonoIngreso(codCia, nroCP);
      } else if (tipo === 'egreso-empleado' && codEmpleado) {
        data = await abonosService.consultarAbonoEmpleado(codCia, codEmpleado, nroCP);
      }

      setAbono(data);
    } catch (error) {
      console.error('Error al cargar abono:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    cargarAbono();
    onEstadoChange?.();
  };

  const handleOpenEditModal = () => {
    if (abono) {
      // Convertir fecha si viene en formato ISO
      let fechaFormateada = abono.fechaAbono;
      if (fechaFormateada && fechaFormateada.includes('T')) {
        fechaFormateada = fechaFormateada.split('T')[0];
      }
      setEditForm({
        fechaAbono: fechaFormateada,
        descripcionMedioPago: abono.descripcionMedioPago || '',
      });
    }
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.fechaAbono) {
      toast.error('La fecha del pago es obligatoria');
      return;
    }

    setSaving(true);
    try {
      if (tipo === 'egreso' && codProveedor) {
        await abonosService.actualizarAbonoEgreso(codCia, codProveedor, nroCP, editForm);
      } else if (tipo === 'ingreso') {
        await abonosService.actualizarAbonoIngreso(codCia, nroCP, editForm);
      } else if (tipo === 'egreso-empleado' && codEmpleado) {
        await abonosService.actualizarAbonoEmpleado(codCia, codEmpleado, nroCP, editForm);
      }

      toast.success('Fecha de pago actualizada exitosamente');
      setEditModalOpen(false);
      cargarAbono();
    } catch (error: any) {
      console.error('Error al actualizar abono:', error);
      toast.error(error.message || 'Error al actualizar el pago');
    } finally {
      setSaving(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold">Estado del Pago</CardTitle>
          <EstadoBadge estado={estado} />
        </CardHeader>
        <CardContent className="space-y-4">
          {estado === 'REG' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Este comprobante aún no tiene un pago registrado.
              </p>
              <Button onClick={() => setModalOpen(true)} className="w-full">
                Registrar Pago
              </Button>
            </div>
          )}

          {estado === 'PAG' && abono && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Pago</p>
                  <p className="text-base font-semibold">
                    {formatFecha(abono.fechaAbono)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medio de Pago</p>
                  <p className="text-base font-semibold">
                    {abono.descripcionMedioPago}
                  </p>
                </div>
              </div>

              {/* Botón para editar la fecha de pago */}
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenEditModal}
                  className="w-full"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Fecha de Pago
                </Button>
              </div>

              {abono.fotoAbono && abono.fotoAbono.trim() !== '' && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/api/files/download?path=${encodeURIComponent(abono.fotoAbono || '')}`, '_blank')}
                    className="w-full"
                  >
                    <FileIcon className="h-4 w-4 mr-2" />
                    Ver Voucher de Pago
                  </Button>
                </div>
              )}
            </div>
          )}

          {estado === 'ANU' && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Este comprobante ha sido anulado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarPagoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tipo={tipo}
        codCia={codCia}
        codProveedor={codProveedor}
        codEmpleado={codEmpleado}
        nroCP={nroCP}
        onSuccess={handleSuccess}
      />

      {/* Modal para editar fecha de pago */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Fecha de Pago</DialogTitle>
            <DialogDescription>
              Modifique la fecha de pago del comprobante <strong>{nroCP}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFechaAbono">Fecha del Pago *</Label>
              <Input
                id="editFechaAbono"
                type="date"
                value={editForm.fechaAbono}
                onChange={(e) =>
                  setEditForm({ ...editForm, fechaAbono: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Puede seleccionar cualquier fecha (incluso pasada)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editMedioPago">Medio de Pago</Label>
              <Select
                value={editForm.descripcionMedioPago}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, descripcionMedioPago: val })
                }
              >
                <SelectTrigger id="editMedioPago">
                  <SelectValue placeholder="Seleccione el medio de pago" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIOS_PAGO.map((medio) => (
                    <SelectItem key={medio} value={medio}>
                      {medio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
