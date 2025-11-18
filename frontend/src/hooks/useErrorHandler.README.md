# useErrorHandler Hook

Hook personalizado para manejo centralizado de errores con toasts automáticos.

## Descripción

El hook `useErrorHandler` proporciona una forma consistente de manejar errores de API y mostrar mensajes apropiados al usuario mediante toasts. Maneja automáticamente diferentes códigos de estado HTTP y proporciona mensajes contextuales.

## Características

- ✅ Manejo automático de errores HTTP (400, 404, 409, 500)
- ✅ Toasts con mensajes apropiados según el tipo de error
- ✅ Soporte para contexto adicional en mensajes
- ✅ Manejo de errores de validación con detalles por campo
- ✅ Funciones auxiliares para mensajes de éxito, advertencia e información

## Uso Básico

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { handleError, showSuccess } = useErrorHandler();

  const handleSubmit = async (data: any) => {
    try {
      await someApiCall(data);
      showSuccess('Operación exitosa');
    } catch (error) {
      handleError(error, 'guardar datos');
    }
  };

  return <button onClick={handleSubmit}>Guardar</button>;
}
```

## API

### `handleError(error: unknown, contexto?: string)`

Maneja errores de API y muestra toasts apropiados.

**Parámetros:**
- `error`: Error capturado (puede ser AxiosError, Error o unknown)
- `contexto`: Contexto adicional para el mensaje (opcional)

**Códigos HTTP manejados:**
- **400 (Bad Request)**: Errores de validación
  - Muestra mensaje de error de validación
  - Si hay `validationErrors`, muestra detalles por campo

- **404 (Not Found)**: Recurso no encontrado
  - Muestra mensaje indicando que el recurso no existe

- **409 (Conflict)**: Conflicto/Duplicado
  - Muestra mensaje indicando que ya existe un registro

- **500 (Internal Server Error)**: Error del servidor
  - Muestra mensaje de error interno del servidor

**Ejemplo:**
```typescript
try {
  await createComprobante(data);
} catch (error) {
  // Mostrará: "Error en crear comprobante: [mensaje del servidor]"
  handleError(error, 'crear comprobante');
}
```

### `showSuccess(mensaje: string, titulo?: string)`

Muestra un toast de éxito.

**Parámetros:**
- `mensaje`: Mensaje a mostrar
- `titulo`: Título del toast (por defecto: "Éxito")

**Ejemplo:**
```typescript
showSuccess('Comprobante creado exitosamente');
showSuccess('Datos guardados', 'Operación completada');
```

### `showWarning(mensaje: string, titulo?: string)`

Muestra un toast de advertencia.

**Parámetros:**
- `mensaje`: Mensaje a mostrar
- `titulo`: Título del toast (por defecto: "Advertencia")

**Ejemplo:**
```typescript
showWarning('El presupuesto está al 90%');
```

### `showInfo(mensaje: string, titulo?: string)`

Muestra un toast informativo.

**Parámetros:**
- `mensaje`: Mensaje a mostrar
- `titulo`: Título del toast (por defecto: "Información")

**Ejemplo:**
```typescript
showInfo('Los cambios se guardarán automáticamente');
```

## Funciones Específicas

El hook también expone funciones específicas para cada tipo de error:

### `handleValidationError(errorData, contexto?)`
Maneja errores de validación (400).

### `handleNotFoundError(contexto?)`
Maneja errores de recurso no encontrado (404).

### `handleConflictError(errorData, contexto?)`
Maneja errores de conflicto/duplicado (409).

### `handleServerError(errorData, contexto?)`
Maneja errores del servidor (500).

### `handleGenericError(errorData, contexto?)`
Maneja errores genéricos.

## Ejemplos de Uso

### Crear Comprobante

```typescript
const { handleError, showSuccess } = useErrorHandler();

const createComprobante = async (data: ComprobanteDTO) => {
  try {
    await comprobantesService.createEgreso(data);
    showSuccess('Comprobante creado exitosamente');
    router.push('/comprobantes');
  } catch (error) {
    handleError(error, 'crear comprobante');
  }
};
```

### Editar Comprobante

```typescript
const { handleError, showSuccess } = useErrorHandler();

const updateComprobante = async (id: string, data: ComprobanteDTO) => {
  try {
    await comprobantesService.updateEgreso(id, data);
    showSuccess('Comprobante actualizado exitosamente');
  } catch (error) {
    handleError(error, 'actualizar comprobante');
  }
};
```

### Eliminar Comprobante

```typescript
const { handleError, showSuccess } = useErrorHandler();

const deleteComprobante = async (id: string) => {
  try {
    await comprobantesService.deleteEgreso(id);
    showSuccess('Comprobante eliminado exitosamente');
  } catch (error) {
    handleError(error, 'eliminar comprobante');
  }
};
```

### Validar Presupuesto

```typescript
const { handleError, showWarning } = useErrorHandler();

const validatePresupuesto = async (data: ValidacionDTO) => {
  try {
    const result = await presupuestoService.validarEgreso(data);

    if (!result.valido) {
      showWarning(result.mensajeError || 'Presupuesto insuficiente');
      return false;
    }

    return true;
  } catch (error) {
    handleError(error, 'validar presupuesto');
    return false;
  }
};
```

## Tipos de Respuesta de Error

El hook espera que el backend devuelva errores en el siguiente formato:

```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
```

### Ejemplo de Error de Validación (400)

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación",
  "path": "/api/v1/comprobantes-pago",
  "validationErrors": {
    "nroCp": "El número de comprobante es obligatorio",
    "codProveedor": "El proveedor es obligatorio"
  }
}
```

### Ejemplo de Error de Duplicado (409)

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Ya existe un comprobante con ese número",
  "path": "/api/v1/comprobantes-pago"
}
```

### Ejemplo de Error No Encontrado (404)

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Comprobante no encontrado",
  "path": "/api/v1/comprobantes-pago/123"
}
```

## Integración con Formularios

El hook se integra perfectamente con formularios:

```typescript
import { useForm } from 'react-hook-form';
import { useErrorHandler } from '@/hooks/useErrorHandler';

function ComprobanteForm() {
  const { handleError, showSuccess } = useErrorHandler();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await comprobantesService.createEgreso(data);
      showSuccess('Comprobante guardado correctamente');
    } catch (error) {
      handleError(error, 'guardar comprobante');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos del formulario */}
    </form>
  );
}
```

## Notas

- El hook utiliza `useToast` de shadcn/ui para mostrar los toasts
- Todos los callbacks están memoizados con `useCallback` para optimizar el rendimiento
- El hook maneja automáticamente errores de Axios, errores de JavaScript y errores desconocidos
- Los mensajes de error se pueden personalizar mediante el parámetro `contexto`

## Requisitos Cumplidos

✅ **Requirement 9.4**: Manejo de errores de validación (400), duplicados (409) y no encontrados (404)
✅ **Requirement 9.5**: Mostrar mensajes de error apropiados al usuario mediante toasts
