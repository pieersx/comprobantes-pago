/**
 * Hook personalizado para gestionar el estado y lógica de formularios de comprobantes
 *
 * Este hook proporciona funcionalidad completa para:
 * - Gestionar el estado del formulario (datos generales y detalles)
 * - Agregar, editar y eliminar partidas
 * - Validar campos obligatorios
 * - Manejar errores y mensajes de validación
 *
 * @example
 * ```tsx
 * const {
 *   formState,
 *   updateField,
 *   agregarPartida,
 *   editarPartida,
 *   eliminarPartida,
 *   validarFormulario,
 *   esValido,
 *   getError,
 *   hasError
 * } = useComprobanteForm('egreso');
 *
 * // Actualizar un campo
 * updateField('nroCp', 'F001-00123');
 *
 * // Agregar una partida
 * agregarPartida({
 *   codPartida: 1,
 *   nombrePartida: 'Materiales',
 *   impNetoMn: 1000,
 *   impIgvMn: 180,
 *   impTotalMn: 1180
 * });
 *
 * // Validar antes de guardar
 * if (esValido()) {
 *   // Guardar comprobante
 * }
 * ```
 *
 * @module useComprobanteForm
 * @see Requirements 1.1, 2.1, 7.5, 10.1
 */

import { CompPagoCab, VtaCompPagoCab } from '@/types/comprobante';
import { useCallback, useState } from 'react';

/**
 * Tipos para el detalle de partidas en el formulario
 * Representa una línea de detalle con información de presupuesto
 */
export interface DetallePartidaForm {
  sec: number;
  codPartida: number;
  nombrePartida: string;
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  presupuestoDisponible?: number;
  porcentajeEjecucion?: number;
  nivelAlerta?: 'verde' | 'amarillo' | 'naranja' | 'rojo';
}

/**
 * Estado del formulario de comprobante
 * Contiene todos los datos necesarios para crear/editar un comprobante
 */
export interface ComprobanteFormState {
  // Datos generales
  codCia: number;
  nroCp: string;
  codPyto: number;
  codProveedor?: number; // Solo egresos a proveedores
  codEmpleado?: number; // Feature: empleados-comprobantes-blob - Solo egresos a empleados
  codCliente?: number; // Solo ingresos
  fecCp: string;
  tMoneda: string;
  tipCambio: number;
  tCompPago?: string;
  porcentajeImpuesto?: number; // Porcentaje manual para recibos por honorarios

  // Archivos adjuntos
  fotoCp?: string;
  fotoAbono?: string;

  // Información de abono/pago
  fecAbono?: string;
  desAbono?: string;

  // Detalle de partidas
  detalles: DetallePartidaForm[];

  // Totales calculados
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;

  // Estado de validación
  errores: Record<string, string>;
  isDirty: boolean;
}

/**
 * Errores de validación del formulario
 * Mapea campos a mensajes de error
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Hook para gestionar el estado y lógica del formulario de comprobantes
 * @param tipo - Tipo de comprobante: 'ingreso' o 'egreso'
 * @param initialData - Datos iniciales del comprobante (para edición)
 */
export function useComprobanteForm(
  tipo: 'ingreso' | 'egreso',
  initialData?: Partial<CompPagoCab | VtaCompPagoCab>
) {
  // Obtener fecha local en formato YYYY-MM-DD
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  };

  // Estado inicial del formulario
  const [formState, setFormState] = useState<ComprobanteFormState>({
    codCia: initialData?.codCia || 0,
    nroCp: initialData?.nroCp || '',
    codPyto: initialData?.codPyto || 0,
    codProveedor: tipo === 'egreso' ? (initialData as CompPagoCab)?.codProveedor : undefined,
    codEmpleado: undefined, // Feature: empleados-comprobantes-blob
    codCliente: tipo === 'ingreso' ? (initialData as VtaCompPagoCab)?.codCliente : undefined,
    fecCp: initialData?.fecCp || obtenerFechaLocal(), // Usar fecha local, no UTC
    tMoneda: initialData?.eMoneda || '001', // Código de elemento de moneda: 001=Soles, 002=Dólares
    tipCambio: initialData?.tipCambio || 1.0,
    tCompPago: initialData?.eCompPago || '',
    detalles: [],
    impNetoMn: initialData?.impNetoMn || 0,
    impIgvMn: initialData?.impIgvMn || 0,
    impTotalMn: initialData?.impTotalMn || 0,
    errores: {},
    isDirty: false,
  });

  /**
   * Actualiza un campo del formulario
   */
  const updateField = useCallback(
    <K extends keyof ComprobanteFormState>(
      field: K,
      value: ComprobanteFormState[K]
    ) => {
      setFormState((prev: ComprobanteFormState) => ({
        ...prev,
        [field]: value,
        isDirty: true,
      }));
    },
    []
  );

  /**
   * Recalcula los totales del comprobante sumando todos los detalles
   */
  const recalcularTotales = useCallback((detalles: DetallePartidaForm[]) => {
    const impNetoMn = detalles.reduce((sum: number, d: DetallePartidaForm) => sum + d.impNetoMn, 0);
    const impIgvMn = detalles.reduce((sum: number, d: DetallePartidaForm) => sum + d.impIgvMn, 0);
    const impTotalMn = detalles.reduce((sum: number, d: DetallePartidaForm) => sum + d.impTotalMn, 0);

    setFormState((prev: ComprobanteFormState) => ({
      ...prev,
      detalles,
      impNetoMn: Number(impNetoMn.toFixed(2)),
      impIgvMn: Number(impIgvMn.toFixed(2)),
      impTotalMn: Number(impTotalMn.toFixed(2)),
      isDirty: true,
    }));
  }, []);

  /**
   * Agrega una nueva partida al detalle
   */
  const agregarPartida = useCallback(
    (partida: Omit<DetallePartidaForm, 'sec'>) => {
      const nuevaSec = formState.detalles.length > 0
        ? Math.max(...formState.detalles.map((d: DetallePartidaForm) => d.sec)) + 1
        : 1;

      const nuevaPartida: DetallePartidaForm = {
        ...partida,
        sec: nuevaSec,
      };

      const nuevosDetalles = [...formState.detalles, nuevaPartida];
      recalcularTotales(nuevosDetalles);
    },
    [formState.detalles, recalcularTotales]
  );

  /**
   * Edita una partida existente por su número de secuencia
   */
  const editarPartida = useCallback(
    (sec: number, partidaActualizada: Partial<DetallePartidaForm>) => {
      const nuevosDetalles = formState.detalles.map((d: DetallePartidaForm) =>
        d.sec === sec ? { ...d, ...partidaActualizada } : d
      );
      recalcularTotales(nuevosDetalles);
    },
    [formState.detalles, recalcularTotales]
  );

  /**
   * Elimina una partida del detalle por su número de secuencia
   */
  const eliminarPartida = useCallback(
    (sec: number) => {
      const nuevosDetalles = formState.detalles.filter((d: DetallePartidaForm) => d.sec !== sec);
      recalcularTotales(nuevosDetalles);
    },
    [formState.detalles, recalcularTotales]
  );

  /**
   * Valida que no haya partidas duplicadas
   * Feature: comprobantes-mejoras
   * Requirements: 4.2
   */
  const validarPartidasDuplicadas = useCallback((): boolean => {
    const partidasVistas = new Set<number>();

    for (const detalle of formState.detalles) {
      if (partidasVistas.has(detalle.codPartida)) {
        return false; // Hay duplicados
      }
      partidasVistas.add(detalle.codPartida);
    }

    return true; // No hay duplicados
  }, [formState.detalles]);

  /**
   * Valida la consistencia de totales
   * Feature: comprobantes-mejoras
   * Requirements: 7.2
   */
  const validarConsistenciaTotales = useCallback((): boolean => {
    const sumaDetalles = formState.detalles.reduce(
      (sum: number, d: DetallePartidaForm) => sum + d.impTotalMn,
      0
    );

    // Permitir una diferencia de 0.01 por redondeo
    const diferencia = Math.abs(formState.impTotalMn - sumaDetalles);
    return diferencia < 0.01;
  }, [formState.detalles, formState.impTotalMn]);

  /**
   * Valida los campos obligatorios del formulario
   * Retorna un objeto con los errores encontrados
   * Feature: comprobantes-mejoras
   * Requirements: 7.1, 4.2, 7.2
   */
  const validarFormulario = useCallback((): ValidationErrors => {
    const errores: ValidationErrors = {};

    // Validar campos generales (Requirement 7.1)
    if (!formState.codCia || formState.codCia === 0) {
      errores.codCia = 'La compañía es obligatoria';
    }

    if (!formState.nroCp || formState.nroCp.trim() === '') {
      errores.nroCp = 'El número de comprobante es obligatorio';
    } else if (formState.nroCp.length > 20) {
      errores.nroCp = 'El número de comprobante no puede exceder 20 caracteres';
    }

    if (!formState.codPyto || formState.codPyto === 0) {
      errores.codPyto = 'El proyecto es obligatorio';
    }

    // Feature: empleados-comprobantes-blob - Validar proveedor O empleado para egresos
    if (tipo === 'egreso') {
      const tieneProveedor = formState.codProveedor && formState.codProveedor > 0;
      const tieneEmpleado = formState.codEmpleado && formState.codEmpleado > 0;

      if (!tieneProveedor && !tieneEmpleado) {
        errores.codProveedor = 'Debe seleccionar un proveedor o empleado';
        errores.codEmpleado = 'Debe seleccionar un proveedor o empleado';
      }
    }

    if (tipo === 'ingreso' && (!formState.codCliente || formState.codCliente === 0)) {
      errores.codCliente = 'El cliente es obligatorio';
    }

    if (!formState.fecCp) {
      errores.fecCp = 'La fecha de emisión es obligatoria';
    } else {
      // Validar que la fecha no sea futura (Requirement 7.2)
      // Comparar solo strings de fecha para evitar problemas de zona horaria
      const fechaEmisionStr = formState.fecCp; // formato: "YYYY-MM-DD"
      const hoy = new Date();
      const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

      if (fechaEmisionStr > hoyStr) {
        errores.fecCp = 'La fecha de emisión no puede ser futura';
      }
    }

    if (!formState.tMoneda) {
      errores.tMoneda = 'El tipo de moneda es obligatorio';
    }

    // Validar tipo de cambio para monedas distintas a Soles (001/PEN)
    // Códigos: 001=Soles, 002=Dólares, 003=Euros
    const esSoles = formState.tMoneda === '001' || formState.tMoneda === 'PEN';
    if (!esSoles && (!formState.tipCambio || formState.tipCambio <= 0)) {
      errores.tipCambio = 'El tipo de cambio es obligatorio para monedas extranjeras';
    }

    // Validar que haya al menos una partida (Requirement 7.5)
    if (formState.detalles.length === 0) {
      errores.detalles = 'Debe agregar al menos una partida';
    }

    // Validar partidas duplicadas (Requirement 4.2)
    if (!validarPartidasDuplicadas()) {
      errores.partidasDuplicadas = 'No se pueden agregar partidas duplicadas al mismo comprobante';
    }

    // Validar consistencia de totales (Requirement 7.2)
    if (!validarConsistenciaTotales()) {
      errores.totalesInconsistentes = 'El total del comprobante no coincide con la suma de los detalles';
    }

    // Validar montos de partidas (Requirement 7.3)
    formState.detalles.forEach((detalle: DetallePartidaForm, index: number) => {
      if (detalle.impNetoMn <= 0) {
        errores[`detalle_${index}_monto`] = 'El monto debe ser mayor a cero';
      }
      if (detalle.impNetoMn > 999999999.99) {
        errores[`detalle_${index}_monto`] = 'El monto excede el límite permitido';
      }
      if (!detalle.codPartida || detalle.codPartida === 0) {
        errores[`detalle_${index}_partida`] = 'Debe seleccionar una partida';
      }
    });

    // Actualizar estado con errores
    setFormState((prev: ComprobanteFormState) => ({
      ...prev,
      errores,
    }));

    return errores;
  }, [formState, tipo, validarPartidasDuplicadas, validarConsistenciaTotales]);

  /**
   * Verifica si el formulario es válido
   */
  const esValido = useCallback((): boolean => {
    const errores = validarFormulario();
    return Object.keys(errores).length === 0;
  }, [validarFormulario]);

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetFormulario = useCallback(() => {
    setFormState({
      codCia: initialData?.codCia || 0,
      nroCp: initialData?.nroCp || '',
      codPyto: initialData?.codPyto || 0,
      codProveedor: tipo === 'egreso' ? (initialData as CompPagoCab)?.codProveedor : undefined,
      codEmpleado: undefined, // Feature: empleados-comprobantes-blob
      codCliente: tipo === 'ingreso' ? (initialData as VtaCompPagoCab)?.codCliente : undefined,
      fecCp: initialData?.fecCp || obtenerFechaLocal(),
      tMoneda: initialData?.tMoneda || 'PEN',
      tipCambio: initialData?.tipCambio || 1.0,
      tCompPago: initialData?.tCompPago || '',
      detalles: [],
      impNetoMn: initialData?.impNetoMn || 0,
      impIgvMn: initialData?.impIgvMn || 0,
      impTotalMn: initialData?.impTotalMn || 0,
      errores: {},
      isDirty: false,
    });
  }, [initialData, tipo]);

  /**
   * Establece todos los datos del formulario (para edición)
   */
  const setFormData = useCallback((data: any) => {
    // Convertir fecha si viene en formato ISO
    const convertirFecha = (fecha: string): string => {
      if (!fecha) return obtenerFechaLocal();
      // Si viene como ISO (2023-08-30T00:00:00), extraer solo la fecha
      if (fecha.includes('T')) {
        return fecha.split('T')[0];
      }
      return fecha;
    };

    // Transformar detalles del backend al formato del formulario
    const transformarDetalles = (detalles: any[]): DetallePartidaForm[] => {
      if (!detalles || !Array.isArray(detalles)) return [];
      return detalles.map((d: any) => ({
        sec: d.sec || 0,
        codPartida: d.codPartida || 0,
        nombrePartida: d.nombrePartida || d.desPartida || '',
        impNetoMn: d.impNetoMn || 0,
        impIgvMn: d.impIgvMn || 0,
        impTotalMn: d.impTotalMn || d.total || 0,
        presupuestoDisponible: d.presupuestoDisponible,
        porcentajeEjecucion: d.porcentajeEjecucion,
        nivelAlerta: d.nivelAlerta,
      }));
    };

    setFormState((prev: ComprobanteFormState) => ({
      ...prev,
      codCia: data.codCia || prev.codCia,
      nroCp: data.nroCp || data.nroCp || prev.nroCp,
      codPyto: data.codPyto || prev.codPyto,
      codProveedor: data.codProveedor || prev.codProveedor,
      codEmpleado: data.codEmpleado || prev.codEmpleado,
      codCliente: data.codCliente || prev.codCliente,
      fecCp: convertirFecha(data.fecCp || data.fecCp),
      // Manejar variantes de capitalización del backend (eMoneda vs emoneda)
      tMoneda: data.eMoneda || data.emoneda || data.tMoneda || data.tmoneda || prev.tMoneda,
      tipCambio: data.tipCambio || prev.tipCambio,
      // Manejar variantes de capitalización del backend (eCompPago vs ecompPago)
      tCompPago: data.eCompPago || data.ecompPago || data.tCompPago || data.tcompPago || prev.tCompPago,
      impNetoMn: data.impNetoMn || prev.impNetoMn,
      impIgvMn: data.impIgvMn || data.impIgvmn || prev.impIgvMn,
      impTotalMn: data.impTotalMn || prev.impTotalMn,
      fotoCp: data.fotoCp || prev.fotoCp,
      fotoAbono: data.fotoAbono || prev.fotoAbono,
      fecAbono: data.fecAbono || prev.fecAbono,
      desAbono: data.desAbono || prev.desAbono,
      detalles: transformarDetalles(data.detalles), // Cargar detalles del backend
      isDirty: false, // No está dirty porque son datos cargados
    }));
  }, []);

  /**
   * Limpia los errores de validación del formulario
   */
  const limpiarErrores = useCallback(() => {
    setFormState((prev: ComprobanteFormState) => ({
      ...prev,
      errores: {},
    }));
  }, []);

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  const getError = useCallback((field: string): string | undefined => {
    return formState.errores[field];
  }, [formState.errores]);

  /**
   * Verifica si un campo tiene error
   */
  const hasError = useCallback((field: string): boolean => {
    return !!formState.errores[field];
  }, [formState.errores]);

  /**
   * Establece un error específico para un campo
   */
  const setError = useCallback((field: string, mensaje: string) => {
    setFormState((prev: ComprobanteFormState) => ({
      ...prev,
      errores: {
        ...prev.errores,
        [field]: mensaje,
      },
    }));
  }, []);

  /**
   * Limpia el error de un campo específico
   */
  const clearError = useCallback((field: string) => {
    setFormState((prev: ComprobanteFormState) => {
      const { [field]: _, ...restErrores } = prev.errores;
      return {
        ...prev,
        errores: restErrores,
      };
    });
  }, []);

  return {
    // Estado del formulario
    formState,

    // Funciones de actualización
    updateField,
    setFormData,

    // Gestión de partidas
    agregarPartida,
    editarPartida,
    eliminarPartida,

    // Validación
    validarFormulario,
    esValido,
    validarPartidasDuplicadas,
    validarConsistenciaTotales,

    // Gestión de errores
    getError,
    hasError,
    setError,
    clearError,
    limpiarErrores,

    // Utilidades
    resetFormulario,
  };
}
