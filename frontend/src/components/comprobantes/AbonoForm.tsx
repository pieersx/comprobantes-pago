'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

// ===================================
// COMPONENTE ABONO FORM
// Feature: comprobantes-mejoras
// Requirements: 6.1, 6.2, 6.3, 6.4
// ===================================

interface AbonoFormProps {
  comprobanteId: string;
  montoTotal: number;
  montoPagado?: number;
  codCia: number;
  onSubmit: (abono: AbonoData) => Promise<void>;
  onCancel?: () => void;
}

interface AbonoData {
  fechaAbono: string;
  descripcionMedioPago: string;
  montoAbono: number;
  fotoAbono?: string;
}

/**
 * Componente formulario para registrar abonos
 * Feature: comprobantes-mejoras
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export function AbonoForm({
  comprobanteId,
  montoTotal,
  montoPagado = 0,
  codCia,
  onSubmit,
  onCancel,
}: AbonoFormProps) {
  // Obtener fecha local en formato YYYY-MM-DD
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  };

  const [fechaAbono, setFechaAbono] = useState<string>(obtenerFechaLocal());
  const [descripcionMedioPago, setDescripcionMedioPago] = useState<string>('');
  const [montoAbono, setMontoAbono] = useState<number>(0);
  const [fotoAbono, setFotoAbono] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular monto pendiente (Requirement 6.4)
  const montoPendiente = montoTotal - montoPagado;

  // Validar que el monto no exceda el pendiente (Requirement 6.4)
  const validarMonto = (monto: number): string | null => {
    if (monto <= 0) {
      return 'El monto debe ser mayor a cero';
    }
    if (monto > montoPendiente) {
      return `El monto no puede exceder el pendiente (${formatCurrency(montoPendiente)})`;
    }
    return null;
  };

  const handleMontoChange = (value: string) => {
    const monto = parseFloat(value) || 0;
    setMontoAbono(monto);

    const errorMonto = validarMonto(monto);
    if (errorMonto) {
      setError(errorMonto);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones (Requirements 6.1, 6.2, 6.3)
    if (!fechaAbono) {
      setError('La fecha del abono es obligatoria');
      return;
    }

    if (!descripcionMedioPago.trim()) {
      setError('La descripción del medio de pago es obligatoria');
      return;
    }

    const errorMonto = validarMonto(montoAbono);
    if (errorMonto) {
      setError(errorMonto);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        fechaAbono,
        descripcionMedioPago,
        montoAbono,
        fotoAbono,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el abono');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen de montos */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total del Comprobante:</span>
            <span className="font-semibold">{formatCurrency(montoTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monto Pagado:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(montoPagado)}
            </span>
          </div>
          <div className="flex justify-between text-base border-t pt-2">
            <span className="font-semibold">Monto Pendiente:</span>
            <span className="font-bold text-lg text-orange-600">
              {formatCurrency(montoPendiente)}
            </span>
          </div>
        </div>
      </Card>

      {/* Fecha del abono (Requirement 6.1) */}
      <div className="space-y-2">
        <Label htmlFor="fechaAbono">
          Fecha del Abono <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fechaAbono"
          type="date"
          value={fechaAbono}
          onChange={(e) => setFechaAbono(e.target.value)}
          max={obtenerFechaLocal()}
          required
        />
      </div>

      {/* Monto del abono (Requirement 6.3) */}
      <div className="space-y-2">
        <Label htmlFor="montoAbono">
          Monto del Abono <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="montoAbono"
            type="number"
            step="0.01"
            value={montoAbono}
            onChange={(e) => handleMontoChange(e.target.value)}
            placeholder="0.00"
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Máximo: {formatCurrency(montoPendiente)}
        </p>
      </div>

      {/* Descripción del medio de pago (Requirement 6.2) */}
      <div className="space-y-2">
        <Label htmlFor="descripcionMedioPago">
          Descripción del Medio de Pago <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="descripcionMedioPago"
          value={descripcionMedioPago}
          onChange={(e) => setDescripcionMedioPago(e.target.value)}
          placeholder="Ej: Transferencia bancaria BCP, Efectivo, Cheque N° 12345, etc."
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">
          Especifique el método de pago utilizado
        </p>
      </div>

      {/* Foto del abono (Requirement 6.3) */}
      <FileUpload
        tipo="abono"
        codCia={codCia}
        year={new Date(fechaAbono).getFullYear()}
        month={new Date(fechaAbono).getMonth() + 1}
        onUploadSuccess={(filePath) => setFotoAbono(filePath)}
        onUploadError={(err) => setError(err)}
        label="Comprobante de Pago (Opcional)"
      />

      {/* Mensaje de error */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !!error}>
          {isSubmitting ? 'Registrando...' : 'Registrar Abono'}
        </Button>
      </div>
    </form>
  );
}
