/**
 * Ejemplo de uso del hook useErrorHandler
 *
 * Este archivo demuestra cómo usar el hook useErrorHandler
 * para manejar diferentes tipos de errores en componentes.
 */

import { useErrorHandler } from '@/hooks/useErrorHandler';
import { comprobantesService } from '@/services/comprobantes.service';

export function ExampleComponent() {
  const { handleError, showSuccess } = useErrorHandler();

  // Ejemplo 1: Manejo de error 400 (validación)
  const handleValidationError = async () => {
    try {
      // Intento de crear un comprobante con datos inválidos
      await comprobantesService.createComprobanteEgreso({
        codCia: 1,
        nroCp: '', // Campo vacío - error de validación
        codPyto: 1,
        // ... otros campos
      } as any);
    } catch (error) {
      // El hook mostrará un toast con el mensaje de validación
      handleError(error, 'crear comprobante');
    }
  };

  // Ejemplo 2: Manejo de error 404 (no encontrado)
  const handleNotFoundError = async () => {
    try {
      // Intento de obtener un comprobante que no existe
      // await comprobantesService.getComprobanteById('1', '999', '99999');
      throw new Error('Not found'); // Simulated error
    } catch (error) {
      // El hook mostrará un toast indicando que no se encontró
      handleError(error, 'comprobante');
    }
  };

  // Ejemplo 3: Manejo de error 409 (duplicado)
  const handleDuplicateError = async () => {
    try {
      // Intento de crear un comprobante con número duplicado
      await comprobantesService.createComprobanteEgreso({
        codCia: 1,
        nroCp: 'COMP-001', // Número ya existe
        codPyto: 1,
        // ... otros campos
      } as any);
    } catch (error) {
      // El hook mostrará un toast indicando que es duplicado
      handleError(error, 'comprobante');
    }
  };

  // Ejemplo 4: Operación exitosa
  const handleSuccess = async () => {
    try {
      const result = await comprobantesService.createComprobanteEgreso({
        // ... datos válidos
      } as any);

      // Mostrar mensaje de éxito
      showSuccess('Comprobante creado exitosamente');
    } catch (error) {
      handleError(error, 'crear comprobante');
    }
  };

  return (
    <div>
      <button onClick={handleValidationError}>
        Probar Error de Validación (400)
      </button>
      <button onClick={handleNotFoundError}>
        Probar Error No Encontrado (404)
      </button>
      <button onClick={handleDuplicateError}>
        Probar Error Duplicado (409)
      </button>
      <button onClick={handleSuccess}>
        Probar Operación Exitosa
      </button>
    </div>
  );
}

/**
 * Ejemplo de uso en un formulario
 */
export function FormExample() {
  const { handleError, showSuccess } = useErrorHandler();

  const onSubmit = async (data: any) => {
    try {
      await comprobantesService.createComprobanteEgreso(data);
      showSuccess('Comprobante guardado correctamente');
    } catch (error) {
      // Manejo automático de todos los tipos de error
      handleError(error, 'guardar comprobante');
    }
  };

  return <form onSubmit={onSubmit}>{/* campos del formulario */}</form>;
}
