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
  codProveedor?: number; // Solo egresos
  codCliente?: number; // Solo ingresos
  fecCp: string;
  tMoneda: string;
  tipCambio: number;
  tCompPago?: string;

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
  // Estado inicial del formulario
  const [formState, setFormState] = useState<ComprobanteFormState>({
    codCia: initialData?.codCia || 0,
    nroCp: initialData?.nroCp || '',
    codPyto: initialData?.codPyto || 0,
    codProveedor: tipo === 'egreso' ? (initialData as CompPagoCab)?.codProveedor : undefined,
    codCliente: tipo === 'ingreso' ? (initialData as VtaCompPagoCab)?.codCliente : undefined,
    fecCp: initialData?.fecCp || new Date().toISOString().split('T')[0],
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
   * Valida los campos obligatorios del formulario
   * Retorna un objeto con los errores encontrados
   */
  const validarFormulario = useCallback((): ValidationErrors => {
    const errores: ValidationErrors = {};

    // Validar campos generales
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

    if (tipo === 'egreso' && (!formState.codProveedor || formState.codProveedor === 0)) {
      errores.codProveedor = 'El proveedor es obligatorio';
    }

    if (tipo === 'ingreso' && (!formState.codCliente || formState.codCliente === 0)) {
      errores.codCliente = 'El cliente es obligatorio';
    }

    if (!formState.fecCp) {
      errores.fecCp = 'La fecha de emisión es obligatoria';
    } else {
      // Validar que la fecha no sea futura (Requirement 7.2)
      const fechaEmision = new Date(formState.fecCp);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaEmision > hoy) {
        errores.fecCp = 'La fecha de emisión no puede ser futura';
      }
    }

    if (!formState.tMoneda) {
      errores.tMoneda = 'El tipo de moneda es obligatorio';
    }

    // Validar tipo de cambio para USD (Requirement 7.4)
    if (formState.tMoneda === 'USD' && (!formState.tipCambio || formState.tipCambio <= 0)) {
      errores.tipCambio = 'El tipo de cambio es obligatorio para moneda USD';
    }

    // Validar que haya al menos una partida (Requirement 7.5)
    if (formState.detalles.length === 0) {
      errores.detalles = 'Debe agregar al menos una partida';
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
  }, [formState, tipo]);

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
      codCliente: tipo === 'ingreso' ? (initialData as VtaCompPagoCab)?.codCliente : undefined,
      fecCp: initialData?.fecCp || new Date().toISOString().split('T')[0],
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

    // Gestión de partidas
    agregarPartida,
    editarPartida,
    eliminarPartida,

    // Validación
    validarFormulario,
    esValido,

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
