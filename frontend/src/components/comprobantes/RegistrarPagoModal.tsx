'use client';

import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from './FileUploader';

interface RegistrarPagoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'egreso' | 'ingreso';
  codCia: number;
  codProveedor?: number;
  nroCP: string;
  onSuccess?: () => void;
}

const MEDIOS_PAGO = [
  'Efectivo',
  'Transferencia bancaria',
  'Yape',
  'Plin',
  'Cheque',
  'Depósito bancario',
  'Otro',
];

export function RegistrarPagoModal({
  open,
  onOpenChange,
  tipo,
  codCia,
  codProveedor,
  nroCP,
  onSuccess,
}: RegistrarPagoModalProps) {
  const [formData, setFormData] = useState<AbonoData>({
    fechaAbono: new Date().toISOString().split('T')[0],
    descripcionMedioPago: '',
    montoAbono: undefined,
    fotoAbono: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcionMedioPago) {
      toast.error('Debe seleccionar un medio de pago');
      return;
    }

    setLoading(true);

    try {
      if (tipo === 'egreso' && codProveedor) {
        await abonosService.registrarAbonoEgreso(
          codCia,
          codProveedor,
          nroCP,
          formData
        );
      } else if (tipo === 'ingreso') {
        await abonosService.registrarAbonoIngreso(codCia, nroCP, formData);
      }

      toast.success('Pago registrado exitosamente');
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error al registrar abono:', error);
      toast.error(error.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fechaAbono: new Date().toISOString().split('T')[0],
      descripcionMedioPago: '',
      fotoAbono: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>
            Complete la información del pago realizado para el comprobante <strong>{nroCP}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fechaAbono">Fecha del Pago *</Label>
            <Input
              id="fechaAbono"
              type="date"
              value={formData.fechaAbono}
              onChange={(e) =>
                setFormData({ ...formData, fechaAbono: e.target.value })
              }
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medioPago">Medio de Pago *</Label>
            <Select
              value={formData.descripcionMedioPago}
              onValueChange={(val) =>
                setFormData({ ...formData, descripcionMedioPago: val })
              }
              required
            >
              <SelectTrigger id="medioPago">
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

          <div className="space-y-2">
            <Label htmlFor="montoAbono">Monto del Abono *</Label>
            <Input
              id="montoAbono"
              type="number"
              min={0.01}
              step={0.01}
              value={formData.montoAbono ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, montoAbono: e.target.value ? parseFloat(e.target.value) : undefined })
              }
              required
              placeholder="Ingrese el monto del abono"
            />
          </div>

          <FileUploader
            label="Voucher del Pago (FotoAbono)"
            tipo="abono"
            onUploadSuccess={(path) =>
              setFormData({ ...formData, fotoAbono: path })
            }
            currentFile={formData.fotoAbono}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
          />
          <p className="text-xs text-muted-foreground mt-1">
            💡 Suba el voucher de pago (transferencia, Yape, depósito, etc.)
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Registrar Pago'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
