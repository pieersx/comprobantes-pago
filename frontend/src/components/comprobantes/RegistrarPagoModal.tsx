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
import { apiClient } from '@/lib/api';
import { abonosService, type AbonoData } from '@/services/abonos.service';
import { FileImage, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RegistrarPagoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'egreso' | 'ingreso' | 'egreso-empleado';
  codCia: number;
  codProveedor?: number;
  codEmpleado?: number;
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
  codEmpleado,
  nroCP,
  onSuccess,
}: RegistrarPagoModalProps) {
  // Obtener fecha local en formato YYYY-MM-DD
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState<AbonoData>({
    fechaAbono: obtenerFechaLocal(),
    descripcionMedioPago: '',
    montoAbono: undefined,
    fotoAbono: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Subir imagen como BLOB al comprobante
  const uploadFotoAbono = async (file: File) => {
    const formDataFile = new FormData();
    formDataFile.append('file', file);

    let endpoint = '';
    if (tipo === 'egreso' && codProveedor) {
      endpoint = `/comprobantes-pago/${codCia}/${codProveedor}/${nroCP}/foto-abono`;
    } else if (tipo === 'ingreso') {
      endpoint = `/comprobantes-venta/${codCia}/${nroCP}/foto-abono`;
    } else if (tipo === 'egreso-empleado' && codEmpleado) {
      endpoint = `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCP}/foto-abono`;
    }

    if (endpoint) {
      await apiClient.post(endpoint, formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcionMedioPago) {
      toast.error('Debe seleccionar un medio de pago');
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar el abono (fecha, medio de pago, monto)
      if (tipo === 'egreso' && codProveedor) {
        await abonosService.registrarAbonoEgreso(
          codCia,
          codProveedor,
          nroCP,
          formData
        );
      } else if (tipo === 'ingreso') {
        await abonosService.registrarAbonoIngreso(codCia, nroCP, formData);
      } else if (tipo === 'egreso-empleado' && codEmpleado) {
        await abonosService.registrarAbonoEmpleado(codCia, codEmpleado, nroCP, formData);
      }

      // 2. Si hay archivo seleccionado, subirlo como BLOB
      if (selectedFile) {
        setUploadingImage(true);
        try {
          await uploadFotoAbono(selectedFile);
          toast.success('Pago e imagen registrados exitosamente');
        } catch (imgError) {
          console.error('Error al subir imagen:', imgError);
          toast.warning('Pago registrado, pero hubo un error al subir la imagen');
        }
        setUploadingImage(false);
      } else {
        toast.success('Pago registrado exitosamente');
      }

      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error al registrar abono:', error);
      toast.error(error.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no debe superar los 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    setFormData({
      fechaAbono: obtenerFechaLocal(),
      descripcionMedioPago: '',
      fotoAbono: '',
    });
    setSelectedFile(null);
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
              max={obtenerFechaLocal()}
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

          <div className="space-y-2">
            <Label htmlFor="fotoAbono">Voucher del Pago (opcional)</Label>
            <Input
              id="fotoAbono"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                {selectedFile.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              💡 Suba el voucher de pago (transferencia, Yape, depósito, etc.). Máx 10MB
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading || uploadingImage}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploadingImage}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadingImage ? 'Subiendo imagen...' : 'Guardando...'}
                </>
              ) : (
                'Registrar Pago'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
