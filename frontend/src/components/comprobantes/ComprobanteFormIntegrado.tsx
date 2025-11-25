'use client';

/**
 * FORMULARIO DE COMPROBANTES INTEGRADO
 * Este archivo muestra cómo debe quedar ComprobanteForm.tsx con todas las integraciones
 *
 * NUEVAS FUNCIONALIDADES:
 * 1. Selector de Tipo de Comprobante (Factura/Boleta/Recibo)
 * 2. Cálculo automático de impuestos (editable)
 * 3. Subida de PDFs (comprobante y abono)
 * 4. Selector jerárquico de partidas
 * 5. Validación de partidas únicas
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// NUEVOS IMPORTS
import { comprobantesExtendedService } from '@/services/comprobantes-extended.service';
import { fileUploadService } from '@/services/file-upload.service';
import { FileUploadZone } from './FileUploadZone';
import { PartidaTreeSelector } from './PartidaTreeSelector';
import { TaxCalculator } from './TaxCalculator';

// Imports existentes
import { useComprobanteForm } from '@/hooks/useComprobanteForm';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { DetallePartidas } from './DetallePartidas';

interface ComprobanteFormIntegradoProps {
  tipo: 'ingreso' | 'egreso';
  modo: 'crear' | 'editar';
  comprobanteId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ComprobanteFormIntegrado({
  tipo,
  modo,
  comprobanteId,
  onSuccess,
  onCancel,
}: ComprobanteFormIntegradoProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { handleError, showSuccess } = useErrorHandler();

  const {
    formState,
    updateField,
    agregarPartida,
    editarPartida,
    eliminarPartida,
    validarFormulario,
    esValido,
  } = useComprobanteForm(tipo);

  // NUEVOS ESTADOS PARA ARCHIVOS
  const [comprobantePdf, setComprobantePdf] = useState<File | null>(null);
  const [abonoPdf, setAbonoPdf] = useState<File | null>(null);

  // Estados existentes
  const [loading, setLoading] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Calcular subtotal de los detalles
  const calcularSubtotal = () => {
    return formState.detalles.reduce((sum, det) => sum + (det.impNetoMn || 0), 0);
  };

  // NUEVA FUNCIÓN: Validar partidas únicas
  const validarPartidasUnicas = (): boolean => {
    const partidasUnicas = new Set(formState.detalles.map(d => d.codPartida));
    if (partidasUnicas.size !== formState.detalles.length) {
      toast({
        title: "Partidas duplicadas",
        description: "No puede haber partidas duplicadas en el comprobante",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // NUEVA FUNCIÓN: Guardar con archivos
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Validar formulario básico
      if (!validarFormulario()) {
        toast({
          title: "Error de validación",
          description: "Complete todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      // 2. Validar tipo de comprobante
      if (!formState.tCompPago) {
        toast({
          title: "Tipo de comprobante requerido",
          description: "Debe seleccionar el tipo de comprobante",
          variant: "destructive",
        });
        return;
      }

      // 3. Validar partidas únicas
      if (!validarPartidasUnicas()) {
        return;
      }

      // 4. Subir archivos PDF si existen
      let fotoCpPath = formState.fotoCp;
      let fotoAbonoPath = formState.fotoAbono;

      if (comprobantePdf) {
        try {
          const response = await fileUploadService.uploadComprobante(
            comprobantePdf,
            formState.codCia,
            formState.nroCp,
            formState.tCompPago || 'FAC'
          );
          fotoCpPath = response.filePath;
          toast({
            title: "PDF subido",
            description: "Comprobante subido correctamente",
          });
        } catch (error: any) {
          toast({
            title: "Error al subir PDF",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      }

      if (abonoPdf) {
        try {
          const response = await fileUploadService.uploadAbono(
            abonoPdf,
            formState.codCia,
            formState.nroCp
          );
          fotoAbonoPath = response.filePath;
        } catch (error: any) {
          toast({
            title: "Error al subir PDF del abono",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      }

      // 5. Preparar datos según tipo
      const detallesConSec = formState.detalles.map((det, idx) => ({
        codCia: formState.codCia,
        nroCp: formState.nroCp,
        sec: idx + 1,
        ingEgr: tipo === 'ingreso' ? 'I' : 'E',
        codPartida: det.codPartida,
        impNetoMn: det.impNetoMn,
        impIgvMn: det.impIgvMn,
        impTotalMn: det.impTotalMn,
        semilla: 1,
        ...(tipo === 'egreso' && { codProveedor: formState.codProveedor || 0 })
      }));

      // 6. Guardar comprobante
      if (modo === 'crear') {
        if (tipo === 'egreso') {
          const comprobanteEgreso: any = {
            codCia: formState.codCia,
            codProveedor: formState.codProveedor || 0,
            nroCp: formState.nroCp,
            codPyto: formState.codPyto,
            nroPago: 1,
            tCompPago: formState.tCompPago || 'FAC',
            eCompPago: formState.tCompPago || 'FAC',
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
            semilla: 1,
            tabEstado: '001',
            codEstado: '001',
            detalles: detallesConSec
          };

          await comprobantesExtendedService.createEgresoWithFiles({
            comprobante: comprobanteEgreso,
            fotoCpPath,
            fotoAbonoPath,
          });
        } else {
          const comprobanteIngreso: any = {
            codCia: formState.codCia,
            nroCp: formState.nroCp,
            codPyto: formState.codPyto,
            codCliente: formState.codCliente || 0,
            nroPago: 1,
            tCompPago: formState.tCompPago || 'FAC',
            eCompPago: formState.tCompPago || 'FAC',
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
            semilla: 1,
            tabEstado: '001',
            codEstado: '001',
            detalles: detallesConSec
          };

          await comprobantesExtendedService.createIngresoWithFiles({
            comprobante: comprobanteIngreso,
            fotoCpPath,
            fotoAbonoPath,
          });
        }
      } else {
        // Actualizar...
      }

      showSuccess('Comprobante guardado correctamente');
      onSuccess?.();

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {modo === 'crear' ? 'Nuevo' : 'Editar'} Comprobante de {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* 1. SELECTOR DE TIPO DE COMPROBANTE */}
          <div className="space-y-2">
            <Label htmlFor="tipoComprobante">
              Tipo de Comprobante *
            </Label>
            <Select
              value={formState.tCompPago}
              onValueChange={(value) => updateField('tCompPago', value)}
              disabled={loading}
            >
              <SelectTrigger id="tipoComprobante">
                <SelectValue placeholder="Seleccione tipo de comprobante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FAC">Factura (IGV 18%)</SelectItem>
                <SelectItem value="BOL">Boleta (IGV 18%)</SelectItem>
                <SelectItem value="REC">Recibo por Honorarios (Retención 8%)</SelectItem>
                <SelectItem value="OTR">Otro Documento (Sin Impuesto)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              El tipo de comprobante determina el cálculo de impuestos
            </p>
          </div>

          {/* 2. Proveedor/Cliente (código existente) */}
          <div className="space-y-2">
            <Label htmlFor="proveedor">
              {tipo === 'egreso' ? 'Proveedor' : 'Cliente'} *
            </Label>
            <Select
              value={formState.codProveedor?.toString() || formState.codCliente?.toString()}
              onValueChange={(value) => {
                if (tipo === 'egreso') {
                  updateField('codProveedor', parseInt(value));
                } else {
                  updateField('codCliente', parseInt(value));
                }
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Seleccione ${tipo === 'egreso' ? 'proveedor' : 'cliente'}`} />
              </SelectTrigger>
              <SelectContent>
                {(tipo === 'egreso' ? proveedores : clientes).map((item: any) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Proyecto */}
          <div className="space-y-2">
            <Label htmlFor="proyecto">Proyecto *</Label>
            <Select
              value={formState.codPyto?.toString()}
              onValueChange={(value) => updateField('codPyto', parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione proyecto" />
              </SelectTrigger>
              <SelectContent>
                {proyectos.map((proy: any) => (
                  <SelectItem key={proy.id} value={proy.id.toString()}>
                    {proy.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Número de Comprobante */}
          <div className="space-y-2">
            <Label htmlFor="nroComprobante">Número de Comprobante *</Label>
            <Input
              id="nroComprobante"
              value={formState.nroCp}
              onChange={(e) => updateField('nroCp', e.target.value)}
              disabled={loading}
              placeholder="Ej: F001-00001234"
            />
          </div>

          {/* 5. Fecha de Emisión */}
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Emisión *</Label>
            <Input
              id="fecha"
              type="date"
              value={formState.fecCp}
              onChange={(e) => updateField('fecCp', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 6. NUEVO: SUBIDA DE PDF DEL COMPROBANTE */}
          <FileUploadZone
            label="PDF del Comprobante *"
            onFileSelect={(file) => setComprobantePdf(file)}
            existingFile={formState.fotoCp}
            onDownload={() => {
              if (formState.fotoCp) {
                fileUploadService.downloadAndOpenFile(formState.fotoCp);
              }
            }}
            disabled={loading}
          />

          {/* 7. NUEVO: SUBIDA DE PDF DEL ABONO */}
          <FileUploadZone
            label="PDF del Abono (Opcional)"
            onFileSelect={(file) => setAbonoPdf(file)}
            existingFile={formState.fotoAbono}
            onDownload={() => {
              if (formState.fotoAbono) {
                fileUploadService.downloadAndOpenFile(formState.fotoAbono);
              }
            }}
            disabled={loading}
          />

          {/* 8. Fecha del Abono */}
          <div className="space-y-2">
            <Label htmlFor="fechaAbono">Fecha del Abono</Label>
            <Input
              id="fechaAbono"
              type="date"
              value={formState.fecAbono}
              onChange={(e) => updateField('fecAbono', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 9. Descripción del Abono */}
          <div className="space-y-2">
            <Label htmlFor="desAbono">Descripción del Abono (Medio de Pago)</Label>
            <Input
              id="desAbono"
              value={formState.desAbono}
              onChange={(e) => updateField('desAbono', e.target.value)}
              disabled={loading}
              placeholder="Ej: Transferencia bancaria, Efectivo, Yape, etc."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Indique el medio de pago utilizado
            </p>
          </div>

          {/* 10. NUEVO: SELECTOR JERÁRQUICO DE PARTIDAS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agregar Partidas</h3>

            <PartidaTreeSelector
              codCia={formState.codCia}
              codProyecto={formState.codPyto}
              ingEgr={tipo === 'ingreso' ? 'I' : 'E'}
              onSelect={(partida) => {
                // Validar que no esté duplicada
                const yaExiste = formState.detalles.some(
                  d => d.codPartida === partida.codPartida
                );

                if (yaExiste) {
                  toast({
                    title: "Partida duplicada",
                    description: `La partida "${partida.desPartida}" ya está en el comprobante`,
                    variant: "destructive",
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
                  title: "Partida agregada",
                  description: `${partida.desPartida} agregada correctamente`,
                });
              }}
              selectedPartidas={formState.detalles.map(d => d.codPartida)}
              disabled={loading || !formState.codPyto}
            />
          </div>

          {/* 11. Lista de Partidas Agregadas */}
          {formState.detalles.length > 0 && (
            <DetallePartidas
              detalles={formState.detalles}
              codPyto={formState.codPyto}
              tipo={tipo}
              onAdd={agregarPartida}
              onUpdate={editarPartida}
              onRemove={eliminarPartida}
              readonly={loading}
            />
          )}

          {/* 12. NUEVO: CALCULADORA DE IMPUESTOS */}
          {formState.detalles.length > 0 && (
            <TaxCalculator
              montoNeto={calcularSubtotal()}
              tipoComprobante={formState.tCompPago || 'FAC'}
              onTaxChange={(igv, total) => {
                updateField('impIgvMn', igv);
                updateField('impTotalMn', total);
              }}
              allowEdit={!loading}
              initialIgv={formState.impIgvMn}
            />
          )}

          {/* 13. Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !esValido}
            >
              {loading ? 'Guardando...' : 'Guardar Comprobante'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
