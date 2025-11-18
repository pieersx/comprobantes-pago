import { presupuestoService } from '@/services/presupuesto.service';
import {
    AlertaPresupuesto,
    DetalleEgreso,
    PresupuestoDisponible,
    ValidacionPresupuesto,
} from '@/types/presupuesto';
import { useCallback, useState } from 'react';

/**
 * Hook para validación de presupuesto y generación de alertas
 */
export function usePresupuestoValidation() {
  const [validando, setValidando] = useState(false);
  const [alertas, setAlertas] = useState<AlertaPresupuesto[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Determina el nivel de alerta según el porcentaje de ejecución
   * @param porcentaje - Porcentaje de ejecución del presupuesto
   * @returns Nivel de alerta: verde, amarillo, naranja o rojo
   */
  const determinarNivelAlerta = useCallback(
    (porcentaje: number): 'verde' | 'amarillo' | 'naranja' | 'rojo' => {
      if (porcentaje >= 100) return 'rojo';
      if (porcentaje >= 91) return 'naranja';
      if (porcentaje >= 76) return 'amarillo';
      return 'verde';
    },
    []
  );

  /**
   * Calcula el porcentaje de ejecución del presupuesto
   * @param presupuestoOriginal - Presupuesto original de la partida
   * @param presupuestoEjecutado - Presupuesto ya ejecutado
   * @returns Porcentaje de ejecución
   */
  const calcularPorcentajeEjecucion = useCallback(
    (presupuestoOriginal: number, presupuestoEjecutado: number): number => {
      if (presupuestoOriginal === 0) return 0;
      return Number(((presupuestoEjecutado / presupuestoOriginal) * 100).toFixed(2));
    },
    []
  );

  /**
   * Genera un mensaje de alerta según el nivel
   * @param nivel - Nivel de alerta
   * @param nombrePartida - Nombre de la partida
   * @param porcentaje - Porcentaje de ejecución
   * @returns Mensaje descriptivo de la alerta
   */
  const generarMensajeAlerta = useCallback(
    (nivel: 'verde' | 'amarillo' | 'naranja' | 'rojo', nombrePartida: string, porcentaje: number): string => {
      switch (nivel) {
        case 'rojo':
          return `Presupuesto insuficiente en partida "${nombrePartida}". Ejecutado: ${porcentaje.toFixed(1)}%`;
        case 'naranja':
          return `Partida "${nombrePartida}" al ${porcentaje.toFixed(1)}% - URGENTE`;
        case 'amarillo':
          return `Partida "${nombrePartida}" al ${porcentaje.toFixed(1)}% - Requiere atención`;
        case 'verde':
        default:
          return `Partida "${nombrePartida}" al ${porcentaje.toFixed(1)}% - Normal`;
      }
    },
    []
  );

  /**
   * Valida el presupuesto disponible para un egreso
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param detalles - Detalles del egreso a validar
   * @returns Resultado de la validación
   */
  const validarPresupuestoDisponible = useCallback(
    async (
      codCia: number,
      codPyto: number,
      detalles: DetalleEgreso[]
    ): Promise<ValidacionPresupuesto | null> => {
      setValidando(true);
      setError(null);

      try {
        const validacion = await presupuestoService.validarEgreso(
          codCia,
          codPyto,
          detalles
        );

        // Actualizar alertas
        if (validacion.alertas && validacion.alertas.length > 0) {
          setAlertas(validacion.alertas);
        } else {
          setAlertas([]);
        }

        return validacion;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al validar presupuesto';
        setError(errorMsg);
        return null;
      } finally {
        setValidando(false);
      }
    },
    []
  );

  /**
   * Valida una partida individual al agregarla
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   * @param codPartida - Código de partida
   * @param montoSolicitado - Monto que se desea registrar
   * @returns Información de validación de la partida
   */
  const validarPartida = useCallback(
    async (
      codCia: number,
      codPyto: number,
      codPartida: number,
      montoSolicitado: number
    ): Promise<{
      valido: boolean;
      presupuestoDisponible: number;
      porcentajeEjecucion: number;
      nivelAlerta: 'verde' | 'amarillo' | 'naranja' | 'rojo';
      mensaje: string;
    } | null> => {
      setValidando(true);
      setError(null);

      try {
        const presupuesto: PresupuestoDisponible = await presupuestoService.getPresupuestoDisponible(
          codCia,
          codPyto,
          codPartida
        );

        const nuevoEjecutado = presupuesto.presupuestoEjecutado + montoSolicitado;
        const porcentaje = calcularPorcentajeEjecucion(
          presupuesto.presupuestoOriginal,
          nuevoEjecutado
        );
        const nivel = determinarNivelAlerta(porcentaje);
        const valido = montoSolicitado <= presupuesto.presupuestoDisponible;

        return {
          valido,
          presupuestoDisponible: presupuesto.presupuestoDisponible,
          porcentajeEjecucion: porcentaje,
          nivelAlerta: nivel,
          mensaje: generarMensajeAlerta(nivel, presupuesto.nombrePartida, porcentaje),
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al validar partida';
        setError(errorMsg);
        return null;
      } finally {
        setValidando(false);
      }
    },
    [calcularPorcentajeEjecucion, determinarNivelAlerta, generarMensajeAlerta]
  );

  /**
   * Obtiene las alertas activas de un proyecto
   * @param codCia - Código de compañía
   * @param codPyto - Código de proyecto
   */
  const obtenerAlertas = useCallback(
    async (codCia: number, codPyto: number): Promise<void> => {
      setValidando(true);
      setError(null);

      try {
        const alertasProyecto = await presupuestoService.getAlertas(codCia, codPyto);
        setAlertas(alertasProyecto);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al obtener alertas';
        setError(errorMsg);
      } finally {
        setValidando(false);
      }
    },
    []
  );

  /**
   * Limpia las alertas actuales
   */
  const limpiarAlertas = useCallback(() => {
    setAlertas([]);
    setError(null);
  }, []);

  /**
   * Descarta una alerta específica
   * @param alertaId - ID de la alerta a descartar
   */
  const descartarAlerta = useCallback((alertaId: string) => {
    setAlertas((prev) => prev.filter((a) => a.id !== alertaId));
  }, []);

  return {
    validando,
    alertas,
    error,
    validarPresupuestoDisponible,
    validarPartida,
    obtenerAlertas,
    limpiarAlertas,
    descartarAlerta,
    determinarNivelAlerta,
    calcularPorcentajeEjecucion,
    generarMensajeAlerta,
  };
}
