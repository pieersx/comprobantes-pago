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
import { useComprobanteForm } from '@/hooks/useComprobanteForm';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { usePresupuestoValidation } from '@/hooks/usePresupuestoValidation';
import { comprobantesEmpleadoService } from '@/services/comprobantes-empleado.service';
import {
    catalogosService,
    clientesService,
    comprobantesEgresoService,
    comprobantesIngresoService,
    proveedoresService,
    proyectosService,
} from '@/services/comprobantes.service';
import { empleadosService } from '@/services/empleados.service';
import { Cliente, Elemento, Proveedor, Proyecto } from '@/types/comprobante';
import { Empleado } from '@/types/empleado';
import { DetalleEgreso } from '@/types/presupuesto';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DetallePartidas } from './DetallePartidas';
import { PresupuestoAlert } from './PresupuestoAlert';

interface ComprobanteFormProps {
  tipo: 'ingreso' | 'egreso';
  modo: 'crear' | 'editar';
  comprobanteId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Componente principal para crear y editar comprobantes de pago
 * Incluye validación de presupuesto, cálculos automáticos y alertas
 *
 * @param tipo - Tipo de comprobante: 'ingreso' o 'egreso'
 * @param modo - Modo del formulario: 'crear' o 'editar'
 * @param comprobanteId - ID del comprobante (solo para edición)
 * @param onSuccess - Callback ejecutado al guardar exitosamente
 * @param onCancel - Callback ejecutado al cancelar
 */
export function ComprobanteForm({
  tipo,
  modo,
  comprobanteId,
  onSuccess,
  onCancel,
}: ComprobanteFormProps) {
  const router = useRouter();
  const { handleError, showSuccess } = useErrorHandler();
  const {
    formState,
    updateField,
    agregarPartida,
    editarPartida,
    eliminarPartida,
    validarFormulario,
    esValido,
    getError,
    hasError,
  } = useComprobanteForm(tipo);

  const {
    alertas,
    validarPresupuestoDisponible,
    limpiarAlertas,
    descartarAlerta,
  } = usePresupuestoValidation();

  // Estados para catálogos
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [tiposMoneda, setTiposMoneda] = useState<Elemento[]>([]);
  const [tiposComprobante, setTiposComprobante] = useState<Elemento[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Feature: empleados-comprobantes-blob - Tipo de beneficiario para egresos
  const [tipoBeneficiario, setTipoBeneficiario] = useState<'proveedor' | 'empleado'>('proveedor');

  // Cargar catálogos al montar el componente
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoadingCatalogos(true);
        const codCia = 1; // TODO: Obtener de useAppStore o contexto

        console.log('🔄 Cargando catálogos...');

        const [proyectosData, tiposMonedaData, tiposComprobanteData] = await Promise.all([
          proyectosService.getAll(codCia),
          catalogosService.getTiposMoneda(),
          catalogosService.getTiposComprobante(),
        ]);

        console.log('✅ Proyectos cargados:', proyectosData);
        console.log('✅ Tipos de moneda cargados:', tiposMonedaData);
        console.log('✅ Tipos de comprobante cargados:', tiposComprobanteData);

        setProyectos(proyectosData);
        setTiposMoneda(tiposMonedaData);
        setTiposComprobante(tiposComprobanteData);

        // Cargar proveedores, empleados o clientes según el tipo
        if (tipo === 'egreso') {
          // Feature: empleados-comprobantes-blob - Cargar proveedores y empleados para egresos
          const [proveedoresData, empleadosData] = await Promise.all([
            proveedoresService.getAll(codCia),
            empleadosService.getAll(codCia, true).catch(() => []), // Graceful fallback
          ]);
          console.log('✅ Proveedores cargados:', proveedoresData);
          console.log('✅ Empleados cargados:', empleadosData);
          setProveedores(proveedoresData);
          setEmpleados(empleadosData);
        } else {
          const clientesData = await clientesService.getAll(codCia);
          console.log('✅ Clientes cargados:', clientesData);
          setClientes(clientesData);
        }

        // Establecer compañía en el formulario
        updateField('codCia', codCia);
        console.log('✅ Catálogos cargados exitosamente');
      } catch (error) {
        console.error('❌ Error al cargar catálogos:', error);
        handleError(error, 'cargar catálogos');
      } finally {
        setLoadingCatalogos(false);
      }
    };

    cargarCatalogos();
  }, [tipo, handleError, updateField]);

  // Manejar guardado del formulario
  const handleSubmit = async () => {
    // Validar que los catálogos estén cargados
    if (tiposComprobante.length === 0 || tiposMoneda.length === 0) {
      handleError(new Error('Los catálogos no se han cargado correctamente. Por favor recargue la página.'));
      console.error('❌ Catálogos no cargados:', {
        tiposComprobante: tiposComprobante.length,
        tiposMoneda: tiposMoneda.length
      });
      return;
    }

    // Validar formulario
    if (!esValido()) {
      handleError(new Error('Por favor complete todos los campos obligatorios'));
      return;
    }

    // Validar presupuesto para egresos (solo advertencias, no bloquea)
    if (tipo === 'egreso' && formState.detalles.length > 0) {
      const detallesEgreso: DetalleEgreso[] = formState.detalles.map((d) => ({
        codPartida: d.codPartida,
        impNetoMn: d.impNetoMn,
        impIgvMn: d.impIgvMn,
        impTotalMn: d.impTotalMn,
      }));

      try {
        const validacion = await validarPresupuestoDisponible(
          formState.codCia,
          formState.codPyto,
          detallesEgreso
        );

        // Solo mostrar advertencia si hay mensaje de error, pero NO bloquear
        if (validacion?.mensajeError) {
          console.warn('⚠️ Advertencia de presupuesto:', validacion.mensajeError);
          // No retornamos, continuamos con el guardado
        }
      } catch (error: any) {
        // Solo log de errores de validación, no bloquear el guardado
        console.warn('⚠️ Error en validación de presupuesto (se continúa con el guardado):', error);
      }
    }

    // Guardar comprobante
    setLoading(true);
    try {
      if (tipo === 'egreso') {
        // Convertir fecha a formato ISO (yyyy-MM-dd) si viene en formato DD/MM/YYYY
        const convertirFecha = (fecha: string): string => {
          if (!fecha) return new Date().toISOString().split('T')[0]; // Fecha actual si está vacío
          if (fecha.includes('/')) {
            const [dia, mes, año] = fecha.split('/');
            return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
          }
          return fecha;
        };

        const fechaISO = convertirFecha(formState.fecCp);

        console.log('📤 Enviando comprobante de egreso:', {
          nroCp: formState.nroCp,
          fechaOriginal: formState.fecCp,
          fechaISO: fechaISO,
          codProveedor: formState.codProveedor,
          codPyto: formState.codPyto,
          total: formState.impTotalMn,
          detalles: formState.detalles.length
        });

        // Obtener el elemento de moneda seleccionado
        const monedaSeleccionada = tiposMoneda.find(m => m.codElem === formState.tMoneda);

        // Usar el primer tipo de comprobante/moneda disponible si no hay selección
        const primerTipoComprobante = tiposComprobante.length > 0 ? tiposComprobante[0].codElem : '001';
        const primerTipoMoneda = tiposMoneda.length > 0 ? tiposMoneda[0].codElem : '001';

        const data = {
          codCia: Number(formState.codCia),
          codProveedor: Number(formState.codProveedor!),
          nroCp: formState.nroCp,
          codPyto: Number(formState.codPyto),
          nroPago: 1,
          tCompPago: '004', // Tabla de tipos de comprobante (codTab='004' según TABS)
          eCompPago: formState.tCompPago || primerTipoComprobante, // Usar primer tipo disponible de la BD
          fecCp: fechaISO,
          tMoneda: '003', // Tabla de monedas (codTab='003' según TABS)
          eMoneda: formState.tMoneda || primerTipoMoneda, // Usar primera moneda disponible de la BD
          tipCambio: Number(formState.tipCambio) || 1.00,
          impMo: Number(formState.impNetoMn), // Importe en moneda origen
          impNetoMn: Number(formState.impNetoMn),
          impIgvMn: Number(formState.impIgvMn),
          impTotalMn: Number(formState.impTotalMn),
          fotoCp: 'SIN_FOTO',
          fotoAbono: 'SIN_FOTO',
          fecAbono: fechaISO,
          desAbono: `PAGO ${formState.nroCp}`,
          // Incluir porcentaje de impuesto si es recibo (detectado por nombre del tipo)
          porcentajeImpuesto: (() => {
            const tipoSeleccionado = tiposComprobante.find(t => t.codElem === formState.tCompPago);
            return tipoSeleccionado?.denEle?.toLowerCase().includes('recibo') ? formState.porcentajeImpuesto : undefined;
          })(),
          semilla: 1,
          tabEstado: '001', // Tabla de estados
          codEstado: '001', // Estado inicial
          detalles: formState.detalles.map((d, index) => ({
            codCia: Number(formState.codCia),
            codProveedor: Number(formState.codProveedor!),
            nroCp: formState.nroCp,
            sec: index + 1,
            ingEgr: 'E',
            codPartida: Number(d.codPartida),
            impNetoMn: Number(d.impNetoMn),
            impIgvMn: Number(d.impIgvMn),
            impTotalMn: Number(d.impTotalMn),
            semilla: 1,
          })),
        };

        console.log('📦 Objeto completo a enviar:', JSON.stringify(data, null, 2));
        console.log('🔍 Verificando campos críticos:', {
          tCompPago: data.tCompPago,
          eCompPago: data.eCompPago,
          tMoneda: data.tMoneda,
          eMoneda: data.eMoneda,
          monedaSeleccionada: monedaSeleccionada
        });

        // Feature: empleados-comprobantes-blob - Enviar a servicio según tipo de beneficiario
        if (tipoBeneficiario === 'empleado') {
          // Comprobante de egreso a empleado
          // Usar el primer tipo de comprobante disponible si no hay selección
          const primerTipoComprobante = tiposComprobante.length > 0 ? tiposComprobante[0].codElem : '001';
          const primerTipoMoneda = tiposMoneda.length > 0 ? tiposMoneda[0].codElem : '001';

          // DEBUG: Mostrar qué valores se van a enviar
          console.log('🔍 DEBUG EMPLEADO - Valores de catálogos:', {
            tiposComprobanteCargados: tiposComprobante.length,
            tiposMonedaCargados: tiposMoneda.length,
            primerTipoComprobante,
            primerTipoMoneda,
            formStateTCompPago: formState.tCompPago,
            formStateTMoneda: formState.tMoneda,
            tiposComprobanteDisponibles: tiposComprobante.map(t => ({ codElem: t.codElem, denEle: t.denEle })),
            tiposMonedaDisponibles: tiposMoneda.map(m => ({ codElem: m.codElem, denEle: m.denEle })),
          });

          const empleadoData = {
            codCia: Number(formState.codCia),
            codEmpleado: Number(formState.codEmpleado!),
            nroCp: formState.nroCp,
            codPyto: Number(formState.codPyto),
            nroPago: 1,
            tCompPago: '004', // Tabla de tipos de comprobante (codTab='004' según TABS)
            eCompPago: formState.tCompPago || primerTipoComprobante, // Usar primer tipo disponible de la BD
            fecCp: fechaISO,
            tMoneda: '003', // Tabla de monedas (codTab='003' según TABS)
            eMoneda: formState.tMoneda || primerTipoMoneda, // Usar primera moneda disponible de la BD
            tipCambio: Number(formState.tipCambio) || 1.00,
            impMo: Number(formState.impNetoMn), // Importe en moneda origen
            impNetoMn: Number(formState.impNetoMn),
            impIgvmn: Number(formState.impIgvMn),
            impTotalMn: Number(formState.impTotalMn),
            fecAbono: fechaISO,
            desAbono: `PAGO ${formState.nroCp}`,
          };

          console.log('📤 EMPLEADO DATA A ENVIAR:', JSON.stringify(empleadoData, null, 2));
          console.log('📤 DETALLES A ENVIAR:', formState.detalles);

          if (modo === 'crear') {
            // 1. Crear el comprobante cabecera
            await comprobantesEmpleadoService.create(empleadoData);

            // 2. Agregar los detalles (partidas) uno por uno
            if (formState.detalles && formState.detalles.length > 0) {
              console.log('📤 Agregando', formState.detalles.length, 'detalles al comprobante...');
              for (const detalle of formState.detalles) {
                const detalleData = {
                  ingEgr: 'E', // Egreso
                  codPartida: Number(detalle.codPartida),
                  impNetoMn: Number(detalle.impNetoMn),
                  impIgvMn: Number(detalle.impIgvMn),
                  impTotalMn: Number(detalle.impTotalMn),
                };
                console.log('📤 Agregando detalle:', detalleData);
                await comprobantesEmpleadoService.addDetalle(
                  Number(formState.codCia),
                  Number(formState.codEmpleado!),
                  formState.nroCp,
                  detalleData
                );
              }
              console.log('✅ Todos los detalles agregados correctamente');
            }

            showSuccess('Comprobante de egreso a empleado creado exitosamente');
          } else {
            await comprobantesEmpleadoService.update(
              formState.codCia,
              formState.codEmpleado!,
              formState.nroCp,
              empleadoData
            );
            showSuccess('Comprobante de egreso a empleado actualizado exitosamente');
          }
        } else {
          // Comprobante de egreso a proveedor (flujo original)
          if (modo === 'crear') {
            await comprobantesEgresoService.create(data);
            showSuccess('Comprobante de egreso creado exitosamente');
          } else {
            await comprobantesEgresoService.update(
              formState.codCia,
              formState.codProveedor!,
              formState.nroCp,
              data
            );
            showSuccess('Comprobante de egreso actualizado exitosamente');
          }
        }
      } else {
        // Convertir fecha a formato ISO (yyyy-MM-dd) si viene en formato DD/MM/YYYY
        const convertirFecha = (fecha: string): string => {
          if (fecha.includes('/')) {
            const [dia, mes, año] = fecha.split('/');
            return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
          }
          return fecha;
        };

        const fechaISO = convertirFecha(formState.fecCp);

        // Obtener el elemento de moneda seleccionado
        const monedaSeleccionada = tiposMoneda.find(m => m.codElem === formState.tMoneda);

        // Usar el primer tipo de comprobante/moneda disponible si no hay selección
        const primerTipoComprobanteIngreso = tiposComprobante.length > 0 ? tiposComprobante[0].codElem : '001';
        const primerTipoMonedaIngreso = tiposMoneda.length > 0 ? tiposMoneda[0].codElem : '001';

        const data = {
          codCia: Number(formState.codCia),
          codCliente: Number(formState.codCliente!),
          nroCp: formState.nroCp,
          codPyto: Number(formState.codPyto),
          nroPago: 1,
          tCompPago: '004', // Tabla de tipos de comprobante (codTab='004' según TABS)
          eCompPago: formState.tCompPago || primerTipoComprobanteIngreso, // Usar primer tipo disponible de la BD
          fecCp: fechaISO,
          tMoneda: '003', // Tabla de monedas (codTab='003' según TABS) - siempre es '003'
          eMoneda: formState.tMoneda || primerTipoMonedaIngreso, // Usar primera moneda disponible de la BD
          tipCambio: Number(formState.tipCambio) || 1.00,
          impMo: Number(formState.impNetoMn), // Importe en moneda origen
          impNetoMn: Number(formState.impNetoMn),
          impIgvMn: Number(formState.impIgvMn),
          impTotalMn: Number(formState.impTotalMn),
          fotoCp: 'SIN_FOTO',
          fotoAbono: 'SIN_FOTO',
          fecAbono: fechaISO,
          desAbono: `PAGO ${formState.nroCp}`,
          // Incluir porcentaje de impuesto si es recibo (detectado por nombre del tipo)
          porcentajeImpuesto: (() => {
            const tipoSeleccionado = tiposComprobante.find(t => t.codElem === formState.tCompPago);
            return tipoSeleccionado?.denEle?.toLowerCase().includes('recibo') ? formState.porcentajeImpuesto : undefined;
          })(),
          semilla: 1,
          tabEstado: '001', // Tabla de estados
          codEstado: '001', // Estado inicial
          detalles: formState.detalles.map((d, index) => ({
            codCia: Number(formState.codCia),
            nroCp: formState.nroCp,
            sec: index + 1,
            ingEgr: 'I',
            codPartida: Number(d.codPartida),
            impNetoMn: Number(d.impNetoMn),
            impIgvMn: Number(d.impIgvMn),
            impTotalMn: Number(d.impTotalMn),
            semilla: 1,
          })),
        };

        if (modo === 'crear') {
          await comprobantesIngresoService.create(data);
          showSuccess('Comprobante de ingreso creado exitosamente');
        } else {
          await comprobantesIngresoService.update(
            formState.codCia,
            formState.nroCp,
            data
          );
          showSuccess('Comprobante de ingreso actualizado exitosamente');
        }
      }

      // Ejecutar callback de éxito o redirigir
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/comprobantes');
      }
    } catch (error: any) {
      // Manejo específico de errores de validación del backend
      if (error?.response?.data?.message) {
        const errorMsg = error.response.data.message;

        // Detectar errores específicos de niveles de partidas
        if (errorMsg.includes('último nivel') || errorMsg.includes('nivel 2') || errorMsg.includes('nivel 3')) {
          handleError(
            new Error(`❌ Error de nivel de partida: ${errorMsg}\n\nRecuerda:\n• Ingresos: solo nivel 2\n• Egresos: solo nivel 3`),
            'Validación de partidas'
          );
          return;
        }

        // Detectar errores de partidas duplicadas
        if (errorMsg.includes('duplicada') || errorMsg.includes('repetir partidas')) {
          handleError(
            new Error(`❌ Partida duplicada: ${errorMsg}\n\nNo se pueden repetir partidas en el mismo comprobante.`),
            'Validación de partidas'
          );
          return;
        }

        // Detectar errores de total negativo
        if (errorMsg.includes('negativo') || errorMsg.includes('total') && errorMsg.includes('recibo')) {
          handleError(
            new Error(`❌ Error de total: ${errorMsg}`),
            'Validación de montos'
          );
          return;
        }
      }

      handleError(error, 'guardar comprobante');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cancelación
  const handleCancelClick = () => {
    if (formState.isDirty) {
      setCancelDialogOpen(true);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/comprobantes');
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    handleCancel();
  };

  if (loadingCatalogos) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Cargando formulario...</p>
      </div>
    );
  }

  console.log('📊 Renderizando formulario con:', {
    proyectos: proyectos.length,
    proveedores: proveedores.length,
    clientes: clientes.length,
    tiposMoneda: tiposMoneda.length,
  });

  return (
    <div className="space-y-6">
      {/* Alertas de presupuesto */}
      {alertas.length > 0 && (
        <PresupuestoAlert alertas={alertas} onDismiss={descartarAlerta} />
      )}

      {/* Sección: Datos Generales */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Generales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Compañía (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="codCia">Compañía</Label>
              <Input
                id="codCia"
                value={formState.codCia}
                disabled
                className="bg-muted"
              />
            </div>

            {/* NUEVO: Tipo de Comprobante */}
            <div className="space-y-2">
              <Label htmlFor="tCompPago" className="text-base font-semibold">
                Tipo de Comprobante *
              </Label>
              <Select
                value={formState.tCompPago || ''}
                onValueChange={(value) => updateField('tCompPago', value)}
              >
                <SelectTrigger id="tCompPago" className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de comprobante" />
                </SelectTrigger>
                <SelectContent>
                  {tiposComprobante.map((tipoComp) => (
                    <SelectItem key={tipoComp.codElem} value={tipoComp.codElem}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{tipoComp.denEle}</span>
                        <span className="text-xs text-muted-foreground">
                          {tipoComp.denEle?.toLowerCase().includes('factura') || tipoComp.denEle?.toLowerCase().includes('boleta')
                            ? 'IGV 18%'
                            : tipoComp.denEle?.toLowerCase().includes('recibo')
                              ? 'Retención 8%'
                              : ''}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                El tipo de comprobante determina el cálculo de impuestos
              </p>
              {formState.tCompPago && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-900">
                    {(() => {
                      const tipoSeleccionado = tiposComprobante.find(t => t.codElem === formState.tCompPago);
                      const nombre = tipoSeleccionado?.denEle?.toLowerCase() || '';
                      if (nombre.includes('factura')) return '✓ Factura: IGV fijo del 18% (no editable)';
                      if (nombre.includes('boleta')) return '✓ Boleta: IGV fijo del 18% (no editable)';
                      if (nombre.includes('recibo')) return '✓ Recibo por Honorarios: Ingrese el porcentaje de retención manualmente';
                      return `✓ ${tipoSeleccionado?.denEle || 'Tipo seleccionado'}`;
                    })()}
                  </p>
                </div>
              )}
            </div>

            {/* Campo de Porcentaje de Impuesto (solo para Recibo por Honorarios) */}
            {(() => {
              const tipoSeleccionado = tiposComprobante.find(t => t.codElem === formState.tCompPago);
              return tipoSeleccionado?.denEle?.toLowerCase().includes('recibo');
            })() && (
              <div className="space-y-2">
                <Label htmlFor="porcentajeImpuesto" className="text-base font-semibold">
                  Porcentaje de Retención *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="porcentajeImpuesto"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formState.porcentajeImpuesto || 8.0}
                    onChange={(e) => updateField('porcentajeImpuesto', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 8.00"
                    className="w-32"
                  />
                  <span className="text-lg font-semibold">%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ingrese el porcentaje de retención. Por defecto es 8% pero puede variar.
                </p>
              </div>
            )}

            {/* Proyecto */}
            <div className="space-y-2">
              <Label htmlFor="codPyto" className={hasError('codPyto') ? 'text-destructive' : ''}>
                Proyecto *
              </Label>
              <Select
                value={formState.codPyto ? formState.codPyto.toString() : ''}
                onValueChange={(value) => {
                  const codPyto = parseInt(value);
                  updateField('codPyto', codPyto);

                  // Para ingresos: auto-seleccionar el cliente del proyecto
                  if (tipo === 'ingreso') {
                    const proyectoSeleccionado = proyectos.find(p => p.codPyto === codPyto);
                    if (proyectoSeleccionado?.codCliente) {
                      updateField('codCliente', proyectoSeleccionado.codCliente);
                      console.log('✅ Cliente auto-seleccionado:', proyectoSeleccionado.codCliente);
                    }
                  }
                }}
              >
                <SelectTrigger
                  id="codPyto"
                  className={hasError('codPyto') ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Seleccione un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {proyectos.map((proyecto) => (
                    <SelectItem key={proyecto.codPyto} value={proyecto.codPyto.toString()}>
                      {proyecto.nombPyto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError('codPyto') && (
                <p className="text-sm text-destructive">{getError('codPyto')}</p>
              )}
            </div>

            {/* Feature: empleados-comprobantes-blob - Tipo de Beneficiario (solo egresos) */}
            {tipo === 'egreso' && (
              <div className="space-y-2">
                <Label htmlFor="tipoBeneficiario" className="text-base font-semibold">
                  Tipo de Beneficiario *
                </Label>
                <Select
                  value={tipoBeneficiario}
                  onValueChange={(value: 'proveedor' | 'empleado') => {
                    setTipoBeneficiario(value);
                    // Limpiar selección anterior
                    if (value === 'proveedor') {
                      updateField('codEmpleado', undefined);
                    } else {
                      updateField('codProveedor', undefined);
                    }
                  }}
                >
                  <SelectTrigger id="tipoBeneficiario">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proveedor">Proveedor</SelectItem>
                    <SelectItem value="empleado">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Proveedor (solo egresos con tipo proveedor) */}
            {tipo === 'egreso' && tipoBeneficiario === 'proveedor' && (
              <div className="space-y-2">
                <Label
                  htmlFor="codProveedor"
                  className={hasError('codProveedor') ? 'text-destructive' : ''}
                >
                  Proveedor *
                </Label>
                <Select
                  value={formState.codProveedor ? formState.codProveedor.toString() : ''}
                  onValueChange={(value) => updateField('codProveedor', parseInt(value))}
                >
                  <SelectTrigger
                    id="codProveedor"
                    className={hasError('codProveedor') ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Seleccione un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem
                        key={proveedor.codProveedor}
                        value={proveedor.codProveedor.toString()}
                      >
                        {proveedor.desPersona || proveedor.nroRuc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError('codProveedor') && (
                  <p className="text-sm text-destructive">{getError('codProveedor')}</p>
                )}
              </div>
            )}

            {/* Feature: empleados-comprobantes-blob - Empleado (solo egresos con tipo empleado) */}
            {tipo === 'egreso' && tipoBeneficiario === 'empleado' && (
              <div className="space-y-2">
                <Label
                  htmlFor="codEmpleado"
                  className={hasError('codEmpleado') ? 'text-destructive' : ''}
                >
                  Empleado *
                </Label>
                <Select
                  value={formState.codEmpleado ? formState.codEmpleado.toString() : ''}
                  onValueChange={(value) => updateField('codEmpleado', parseInt(value))}
                >
                  <SelectTrigger
                    id="codEmpleado"
                    className={hasError('codEmpleado') ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Seleccione un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.map((empleado) => (
                      <SelectItem
                        key={`${empleado.codCia}-${empleado.codEmpleado}`}
                        value={empleado.codEmpleado.toString()}
                      >
                        {empleado.desPersona} - {empleado.dni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError('codEmpleado') && (
                  <p className="text-sm text-destructive">{getError('codEmpleado')}</p>
                )}
              </div>
            )}

            {/* Cliente (solo ingresos) - Auto-seleccionado según el proyecto */}
            {tipo === 'ingreso' && (
              <div className="space-y-2">
                <Label
                  htmlFor="codCliente"
                  className={hasError('codCliente') ? 'text-destructive' : ''}
                >
                  Cliente *
                </Label>
                {formState.codPyto ? (
                  // Cliente auto-seleccionado (readonly)
                  <div className="space-y-2">
                    <Input
                      id="codCliente"
                      value={(() => {
                        const cliente = clientes.find(c => c.codCliente === formState.codCliente);
                        return cliente?.desPersona || cliente?.nroRuc || 'Cargando...';
                      })()}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      ℹ️ El cliente se asigna automáticamente según el proyecto seleccionado
                    </p>
                  </div>
                ) : (
                  // Sin proyecto seleccionado - mostrar mensaje
                  <div className="space-y-2">
                    <Input
                      id="codCliente"
                      value=""
                      disabled
                      placeholder="Primero seleccione un proyecto"
                      className="bg-muted"
                    />
                    <p className="text-sm text-amber-600">
                      ⚠️ Seleccione un proyecto para asignar el cliente automáticamente
                    </p>
                  </div>
                )}
                {hasError('codCliente') && (
                  <p className="text-sm text-destructive">{getError('codCliente')}</p>
                )}
              </div>
            )}

            {/* Número de Comprobante */}
            <div className="space-y-2">
              <Label htmlFor="nroCp" className={hasError('nroCp') ? 'text-destructive' : ''}>
                Número de Comprobante *
              </Label>
              <Input
                id="nroCp"
                value={formState.nroCp}
                onChange={(e) => updateField('nroCp', e.target.value)}
                placeholder="Ej: F001-00123"
                className={hasError('nroCp') ? 'border-destructive' : ''}
              />
              {hasError('nroCp') && (
                <p className="text-sm text-destructive">{getError('nroCp')}</p>
              )}
            </div>

            {/* Fecha de Emisión */}
            <div className="space-y-2">
              <Label htmlFor="fecCp" className={hasError('fecCp') ? 'text-destructive' : ''}>
                Fecha de Emisión *
              </Label>
              <Input
                id="fecCp"
                type="date"
                value={formState.fecCp}
                onChange={(e) => updateField('fecCp', e.target.value)}
                className={hasError('fecCp') ? 'border-destructive' : ''}
              />
              {hasError('fecCp') && (
                <p className="text-sm text-destructive">{getError('fecCp')}</p>
              )}
            </div>

            {/* Tipo de Moneda */}
            <div className="space-y-2">
              <Label htmlFor="tMoneda" className={hasError('tMoneda') ? 'text-destructive' : ''}>
                Tipo de Moneda *
              </Label>
              <Select
                value={formState.tMoneda || ''}
                onValueChange={(value) => updateField('tMoneda', value)}
              >
                <SelectTrigger
                  id="tMoneda"
                  className={hasError('tMoneda') ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Seleccione moneda" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMoneda.map((moneda) => (
                    <SelectItem key={moneda.codElem} value={moneda.codElem}>
                      {moneda.denEle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError('tMoneda') && (
                <p className="text-sm text-destructive">{getError('tMoneda')}</p>
              )}
            </div>

            {/* Tipo de Cambio (solo si NO es Soles - moneda base) */}
            {(() => {
              const monedaSeleccionada = tiposMoneda.find(m => m.codElem === formState.tMoneda);
              const esMonedaExtranjera = monedaSeleccionada?.denEle?.toLowerCase().includes('dólar') ||
                                         monedaSeleccionada?.denEle?.toLowerCase().includes('dollar') ||
                                         monedaSeleccionada?.denEle?.toLowerCase().includes('usd') ||
                                         monedaSeleccionada?.denEle?.toLowerCase().includes('euro') ||
                                         (formState.tMoneda && formState.tMoneda !== '001'); // Cualquier moneda que no sea Soles (001)
              return esMonedaExtranjera;
            })() && (
              <div className="space-y-2">
                <Label
                  htmlFor="tipCambio"
                  className={hasError('tipCambio') ? 'text-destructive' : ''}
                >
                  Tipo de Cambio *
                </Label>
                <Input
                  id="tipCambio"
                  type="number"
                  step="0.001"
                  value={formState.tipCambio}
                  onChange={(e) => updateField('tipCambio', parseFloat(e.target.value))}
                  placeholder="Ej: 3.750"
                  className={hasError('tipCambio') ? 'border-destructive' : ''}
                />
                {hasError('tipCambio') && (
                  <p className="text-sm text-destructive">{getError('tipCambio')}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección: Detalle de Partidas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Partidas</CardTitle>
        </CardHeader>
        <CardContent>
          <DetallePartidas
            detalles={formState.detalles}
            codPyto={formState.codPyto}
            tipo={tipo}
            onAdd={agregarPartida}
            onUpdate={editarPartida}
            onRemove={eliminarPartida}
            porcentajeImpuesto={formState.porcentajeImpuesto || 18.0}
            tipoComprobante={formState.tCompPago || '001'}
          />
          {hasError('detalles') && (
            <p className="text-sm text-destructive mt-2">{getError('detalles')}</p>
          )}
        </CardContent>
      </Card>

      {/* Sección: Totales */}
      <Card>
        <CardHeader>
          <CardTitle>Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Subtotal</Label>
              <div className="text-2xl font-semibold">
                S/ {formState.impNetoMn.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>IGV Total</Label>
              <div className="text-2xl font-semibold">
                S/ {formState.impIgvMn.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total General</Label>
              <div className="text-2xl font-bold text-primary">
                S/ {formState.impTotalMn.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleCancelClick} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : modo === 'crear' ? 'Guardar' : 'Actualizar'}
        </Button>
      </div>

      {/* Dialog de confirmación de cancelación */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cancelación</DialogTitle>
            <DialogDescription>
              Hay cambios sin guardar. ¿Está seguro que desea salir sin guardar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Continuar editando
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Descartar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
