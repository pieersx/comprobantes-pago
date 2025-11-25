'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { comprobantesService } from '@/services/comprobantes.service';
import { useState } from 'react';
import { AbonoForm } from './AbonoForm';

// ===================================
// COMPONENTE ABONO MODAL
// Feature: comprobantes-mejoras
// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
// ===================================

interface AbonoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comprobanteId: string;
  montoTotal: number;
  montoPagado?: number;
  codCia: number;
  onSuccess?: () => void;
}

interface AbonoData {
  fechaAbono: string;
  descripcionMedioPago: string;
  montoAbono: number;
  fotoAbono?: string;
}

/**
 * Modal para registrar abonos en comprobantes
 * Feature: comprobantes-mejoras
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export function AbonoModal({
  open,
  onOpenChange,
  comprobanteId,
  montoTotal,
  montoPagado = 0,
  codCia,
  onSuccess,
}: AbonoModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (abono: AbonoData) => {
    try {
      setError(null);

      // Registrar abono (Requirement 6.4)
      await comprobantesService.registrarAbono(comprobanteId, {
        fechaAbono: abono.fechaAbono,
        descripcionMedioPago: abono.descripcionMedioPago,
        montoAbono: abono.montoAbono,
        fotoAbono: abono.fotoAbono,
      });

      // Cerrar modal y notificar éxito
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el abono');
      throw err;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Abono</DialogTitle>
          <DialogDescription>
            Complete la información del abono o pago realizado para el comprobante {comprobanteId}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <AbonoForm
          comprobanteId={comprobanteId}
          montoTotal={montoTotal}
          montoPagado={montoPagado}
          codCia={codCia}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
