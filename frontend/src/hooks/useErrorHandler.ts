import { useToast } from '@/components/ui/use-toast';
import { ErrorResponse } from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { useCallback } from 'react';

/**
 * Hook para manejo centralizado de errores con toasts
 */
export function useErrorHandler() {
  const { toast } = useToast();

  /**
   * Maneja errores de API y muestra toasts apropiados
   * @param error - Error capturado
   * @param contexto - Contexto adicional para el mensaje (opcional)
   */
  const handleError = useCallback(
    (error: unknown, contexto?: string) => {
      // Error de Axios (respuesta HTTP)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const status = axiosError.response?.status;
        const errorData = axiosError.response?.data;

        switch (status) {
          case 400:
            // Error de validación
            handleValidationError(errorData, contexto);
            break;

          case 404:
            // No encontrado
            handleNotFoundError(contexto);
            break;

          case 409:
            // Conflicto (duplicado)
            handleConflictError(errorData, contexto);
            break;

          case 500:
            // Error del servidor
            handleServerError(errorData, contexto);
            break;

          default:
            // Error genérico
            handleGenericError(errorData, contexto);
        }
      } else if (error instanceof Error) {
        // Error de JavaScript
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Error desconocido
        toast({
          title: 'Error',
          description: 'Ocurrió un error inesperado',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  /**
   * Maneja errores de validación (400)
   */
  const handleValidationError = useCallback(
    (errorData: ErrorResponse | undefined, contexto?: string) => {
      const mensaje = errorData?.message || 'Error de validación';
      const titulo = contexto ? `Error en ${contexto}` : 'Error de validación';

      // Si hay errores de validación específicos por campo
      if (errorData?.validationErrors) {
        const errores = Object.entries(errorData.validationErrors)
          .map(([campo, error]) => `${campo}: ${error}`)
          .join('\n');

        toast({
          title: titulo,
          description: errores,
          variant: 'destructive',
        });
      } else {
        toast({
          title: titulo,
          description: mensaje,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  /**
   * Maneja errores de recurso no encontrado (404)
   */
  const handleNotFoundError = useCallback(
    (contexto?: string) => {
      const mensaje = contexto
        ? `${contexto} no encontrado`
        : 'El recurso solicitado no existe';

      toast({
        title: 'No encontrado',
        description: mensaje,
        variant: 'destructive',
      });
    },
    [toast]
  );

  /**
   * Maneja errores de conflicto/duplicado (409)
   */
  const handleConflictError = useCallback(
    (errorData: ErrorResponse | undefined, contexto?: string) => {
      const mensaje =
        errorData?.message || 'Ya existe un registro con esos datos';
      const titulo = contexto ? `Duplicado en ${contexto}` : 'Registro duplicado';

      toast({
        title: titulo,
        description: mensaje,
        variant: 'destructive',
      });
    },
    [toast]
  );

  /**
   * Maneja errores del servidor (500)
   */
  const handleServerError = useCallback(
    (errorData: ErrorResponse | undefined, contexto?: string) => {
      const mensaje =
        errorData?.message || 'Error interno del servidor. Intente nuevamente.';
      const titulo = contexto ? `Error en ${contexto}` : 'Error del servidor';

      toast({
        title: titulo,
        description: mensaje,
        variant: 'destructive',
      });
    },
    [toast]
  );

  /**
   * Maneja errores genéricos
   */
  const handleGenericError = useCallback(
    (errorData: ErrorResponse | undefined, contexto?: string) => {
      const mensaje =
        errorData?.message || 'Ocurrió un error inesperado. Intente nuevamente.';
      const titulo = contexto ? `Error en ${contexto}` : 'Error';

      toast({
        title: titulo,
        description: mensaje,
        variant: 'destructive',
      });
    },
    [toast]
  );

  /**
   * Muestra un mensaje de éxito
   * @param mensaje - Mensaje a mostrar
   * @param titulo - Título del toast (opcional)
   */
  const showSuccess = useCallback(
    (mensaje: string, titulo: string = 'Éxito') => {
      toast({
        title: titulo,
        description: mensaje,
        variant: 'default',
      });
    },
    [toast]
  );

  /**
   * Muestra un mensaje de advertencia
   * @param mensaje - Mensaje a mostrar
   * @param titulo - Título del toast (opcional)
   */
  const showWarning = useCallback(
    (mensaje: string, titulo: string = 'Advertencia') => {
      toast({
        title: titulo,
        description: mensaje,
        variant: 'default',
      });
    },
    [toast]
  );

  /**
   * Muestra un mensaje informativo
   * @param mensaje - Mensaje a mostrar
   * @param titulo - Título del toast (opcional)
   */
  const showInfo = useCallback(
    (mensaje: string, titulo: string = 'Información') => {
      toast({
        title: titulo,
        description: mensaje,
        variant: 'default',
      });
    },
    [toast]
  );

  return {
    handleError,
    handleValidationError,
    handleNotFoundError,
    handleConflictError,
    handleServerError,
    handleGenericError,
    showSuccess,
    showWarning,
    showInfo,
  };
}
