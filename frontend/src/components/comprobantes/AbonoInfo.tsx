'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { abonosService, type AbonoData } from '@/services/abonos.service';
import { FileIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EstadoBadge } from './EstadoBadge';
import { RegistrarPagoModal } from './RegistrarPagoModal';

interface AbonoInfoProps {
  tipo: 'egreso' | 'ingreso';
  codCia: number;
  codProveedor?: number;
  nroCP: string;
  estado: 'REG' | 'PAG' | 'ANU';
  onEstadoChange?: () => void;
}

export function AbonoInfo({
  tipo,
  codCia,
  codProveedor,
  nroCP,
  estado,
  onEstadoChange,
}: AbonoInfoProps) {
  const [abono, setAbono] = useState<AbonoData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAbono();
  }, [codCia, codProveedor, nroCP, tipo]);

  const cargarAbono = async () => {
    setLoading(true);
    try {
      let data: AbonoData | null = null;

      if (tipo === 'egreso' && codProveedor) {
        data = await abonosService.consultarAbonoEgreso(codCia, codProveedor, nroCP);
      } else if (tipo === 'ingreso') {
        data = await abonosService.consultarAbonoIngreso(codCia, nroCP);
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
        nroCP={nroCP}
        onSuccess={handleSuccess}
      />
    </>
  );
}
