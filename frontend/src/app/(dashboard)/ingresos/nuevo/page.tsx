'use client';

/**
 * Página para crear un nuevo comprobante de ingreso
 * Feature: comprobantes-jerarquicos
 * Requirements: 3.1, 3.4, 4.1, 4.2, 5.1, 5.2, 3.5, 7.5
 */

import { FileUploadComponent } from '@/components/comprobantes/FileUploadComponent';
import { IGVCalculator } from '@/components/comprobantes/IGVCalculator';
import { PartidaHierarchicalSelector } from '@/components/comprobantes/PartidaHierarchicalSelector';
import { TipoComprobanteSelector } from '@/components/comprobantes/TipoComprobanteSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useComprobanteForm } from '@/hooks/useComprobanteForm';
import { comprobantesService } from '@/services/comprobantes.service';
import { fileUploadService } from '@/services/file-upload.service';
import { PartidaProyecto } from '@/types/partida';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NuevoIngresoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoComprobante, setTipoComprobante] = useState<string>('');
  const [comprobantePdf, setComprobantePdf] = useState<File | null>(null);
  const [abonoPdf, setAbonoPdf] = useState<File | null>(null);

  const {
    formState,
    updateField,
    agregarPartida,
    eliminarPartida,
    validarFormulario,
  } = useComprobanteForm('ingreso');

  // Calcular subtotal de los detalles
  const calcularSubtotal = (): number => {
    return formState.detalles.reduce((sum, det) => sum + (det.impNetoMn || 0), 0);
  };

  const handleTipoChange = (tipo: string) => {
    setTipoComprobante(tipo);
    updateField('tCompPago', tipo);
  };

  const handleTaxChange = (nuevoIgv: number, nuevoTotal: number) => {
    updateField('impIgvMn', nuevoIgv);
    updateField('impTotalMn', nuevoTotal);
  };

  const handlePartidaSelect = (partida: PartidaProyecto) => {
    // Validar que no esté duplicada
    const yaExiste = formState.detalles.some((d) => d.codPartida === partida.codPartida);

    if (yaExiste) {
      toast({
        title: 'Partida duplicada',
        description: `La partida "${partida.desPartida}" ya está en el comprobante`,
        variant: 'destructive',
      });
      return;
    }

    // Agregar partida
    agregarPartida({
      codPartida: partida.codPartida,
      nombrePartida: partida.desPartida,
      impNetoMn: 0,
      impIgvMn: 0,
      impTotalMn: 0,
    });

    toast({
      title: 'Partida agregada',
      description: `${partida.desPartida} agregada correctamente`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
      toast({
        title: 'Error de validación',
        description: 'Complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Validar tipo de comprobante
    if (!tipoComprobante) {
      toast({
        title: 'Tipo de comprobante requerido',
        description: 'Debe seleccionar el tipo de comprobante',
        variant: 'destructive',
      });
      return;
    }

    // Validar que haya al menos un detalle
    if (formState.detalles.length === 0) {
      toast({
        title: 'Sin partidas',
        description: 'Debe agregar al menos una partida',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Subir archivos si existen
      let fotoCpPath = formState.fotoCp;
      let fotoAbonoPath = formState.fotoAbono;

      if (comprobantePdf) {
        const response = await fileUploadService.uploadComprobanteFile(
          comprobantePdf,
          formState.codCia,
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          'ingreso'
        );
        fotoCpPath = response.filePath;
      }

      if (abonoPdf) {
        const response = await fileUploadService.uploadAbonoFile(
          abonoPdf,
          formState.codCia,
          new Date().getFullYear(),
          new Date().getMonth() + 1
        );
        fotoAbonoPath = response.filePath;
      }

      // Crear comprobante de ingreso
      await comprobantesService.createComprobanteIngreso({
        codCia: formState.codCia,
        codCliente: formState.codCliente || 0,
        nroCp: formState.nroCp,
        codPyto: formState.codPyto,
        nroPago: 1,
        tCompPago: tipoComprobante,
        eCompPago: tipoComprobante,
        fecCp: formState.fecCp,
        tMoneda: formState.tMoneda,
        eMoneda: formState.tMoneda,
        tipCambio: formState.tipCambio,
        impMo: formState.impTotalMn,
        impNetoMn: formState.impNetoMn,
        impIgvMn: formState.impIgvMn,
        impTotalMn: formState.impTotalMn,
        fotoCp: fotoCpPath,
        fotoAbono: fotoAbonoPath,
        fecAbono: formState.fecAbono,
        desAbono: formState.desAbono,
        tabEstado: '001',
        codEstado: '001',
        detalles: formState.detalles.map((d, idx) => ({
          codCia: formState.codCia,
          nroCp: formState.nroCp,
          sec: idx + 1,
          ingEgr: 'I',
          codPartida: d.codPartida,
          impNetoMn: d.impNetoMn,
          impIgvMn: d.impIgvMn,
          impTotalMn: d.impTotalMn,
        })),
      });

      toast({
        title: 'Comprobante creado',
        description: 'El comprobante de ingreso se creó exitosamente',
      });

      router.push('/ingresos');
    } catch (error: any) {
      console.error('Error al crear comprobante:', error);
      toast({
        title: 'Error al crear comprobante',
        description: error.message || 'Ocurrió un error al crear el comprobante',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nuevo Ingreso</h2>
          <p className="text-muted-foreground">
            Registra un nuevo comprobante de ingreso
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección Cabecera */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Comprobante - Subtask 14.1 */}
            <TipoComprobanteSelector
              value={tipoComprobante}
              onChange={handleTipoChange}
              required
              label="Tipo de Comprobante"
            />

            {/* Número de Comprobante */}
            <div className="space-y-2">
              <Label htmlFor="nroCp">
                Número de Comprobante <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nroCp"
                value={formState.nroCp}
                onChange={(e) => updateField('nroCp', e.target.value)}
                placeholder="Ej: F001-00001234"
                required
              />
            </div>

            {/* Fecha de Emisión */}
            <div className="space-y-2">
              <Label htmlFor="fecCp">
                Fecha de Emisión <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fecCp"
                type="date"
                value={formState.fecCp}
                onChange={(e) => updateField('fecCp', e.target.value)}
                required
              />
            </div>

            {/* Proyecto */}
            <div className="space-y-2">
              <Label htmlFor="codPyto">
                Proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="codPyto"
                type="number"
                value={formState.codPyto || ''}
                onChange={(e) => updateField('codPyto', parseInt(e.target.value))}
                placeholder="Código del proyecto"
                required
              />
            </div>
          </div>
        </Card>

        {/* Sección Partidas - Subtask 14.2 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Partidas Presupuestales</h3>

          {/* Selector jerárquico de partidas de ingreso (nivel 2) */}
          {formState.codPyto && (
            <div className="mb-4">
              <PartidaHierarchicalSelector
                codPyto={formState.codPyto}
                tipo="I"
                onChange={handlePartidaSelect}
                excludePartidas={formState.detalles.map((d) => d.codPartida)}
                label="Agregar Partida de Ingreso"
              />
            </div>
          )}

          {/* Lista de partidas agregadas */}
          {formState.detalles.length > 0 ? (
            <div className="space-y-3">
              {formState.detalles.map((detalle, index) => (
                <Card key={detalle.sec} className="p-4 bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium">
                          {detalle.codPartida} - {detalle.nombrePartida}
                        </p>
                        <p className="text-sm text-muted-foreground">Partida #{index + 1}</p>
                      </div>

                      {/* Inputs de montos */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`monto-${detalle.sec}`} className="text-xs">
                            Monto Neto
                          </Label>
                          <Input
                            id={`monto-${detalle.sec}`}
                            type="number"
                            step="0.01"
                            value={detalle.impNetoMn}
                            onChange={(e) => {
                              const nuevoMonto = parseFloat(e.target.value) || 0;
                              // Aquí se podría agregar lógica para recalcular IGV
                            }}
                            className="font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">IGV</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={detalle.impIgvMn}
                            readOnly
                            className="font-mono bg-muted"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Total</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={detalle.impTotalMn}
                            readOnly
                            className="font-mono bg-muted font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarPartida(detalle.sec)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay partidas agregadas</p>
              <p className="text-sm">Seleccione una partida para comenzar</p>
            </div>
          )}
        </Card>

        {/* Sección Cálculos - Subtask 14.3 */}
        {formState.detalles.length > 0 && tipoComprobante && (
          <IGVCalculator
            montoBase={calcularSubtotal()}
            tipoComprobante={tipoComprobante}
            onCalculate={handleTaxChange}
            editable={true}
          />
        )}

        {/* Sección Archivos - Subtask 14.4 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Documentos Adjuntos</h3>
          <div className="space-y-4">
            {/* PDF del Comprobante */}
            <FileUploadComponent
              onFileSelect={(file: File) => setComprobantePdf(file)}
              label="PDF del Comprobante de Venta"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              showPreview={true}
            />

            {/* PDF del Abono/Cobro */}
            <FileUploadComponent
              onFileSelect={(file: File) => setAbonoPdf(file)}
              label="Comprobante del Cobro (Opcional)"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              showPreview={true}
            />

            {/* Información del Cobro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="fecAbono">Fecha del Cobro</Label>
                <Input
                  id="fecAbono"
                  type="date"
                  value={formState.fecAbono || ''}
                  onChange={(e) => updateField('fecAbono', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Fecha en que se recibió el pago del cliente
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desAbono">Medio de Pago Recibido</Label>
                <Input
                  id="desAbono"
                  value={formState.desAbono || ''}
                  onChange={(e) => updateField('desAbono', e.target.value)}
                  placeholder="Ej: Transferencia bancaria, Efectivo, Yape"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Indique el medio de pago recibido
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Ingreso'}
          </Button>
        </div>
      </form>
    </div>
  );
}
