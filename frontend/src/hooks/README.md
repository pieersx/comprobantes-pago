# Hooks Documentation

This directory contains all custom React hooks for the application.

## Hooks

### useComprobanteForm
Hook for managing voucher form state and logic.

**Features:**
- Form state management with general data and line item details
- Functions to add/edit/delete line items
- Validation of required fields
- Error handling and messages
- Automatic total calculations

**Usage:**
```typescript
const {
  formState,
  updateField,
  agregarPartida,
  editarPartida,
  eliminarPartida,
  validarFormulario,
  esValido,
  resetFormulario,
} = useComprobanteForm('egreso', initialData);
```

### usePresupuestoValidation
Hook for budget validation and alert generation.

**Features:**
- Validate available budget when adding line items
- Calculate execution percentage
- Determine alert level (green/yellow/orange/red)
- Generate alert messages

**Usage:**
```typescript
const {
  validando,
  alertas,
  validarPresupuestoDisponible,
  validarPartida,
  obtenerAlertas,
  determinarNivelAlerta,
} = usePresupuestoValidation();
```

### useMontoCalculator
Hook for automatic amount and tax calculations.

**Features:**
- Calculate IGV automatically (18%)
- Calculate total (net + IGV)
- Calculate voucher total (sum of line items)
- Handle currency conversion for USD

**Usage:**
```typescript
const {
  calcularDesdeNeto,
  calcularTotalComprobante,
  convertirMoneda,
  formatearMonto,
  IGV_RATE,
} = useMontoCalculator();

const montos = calcularDesdeNeto(1000); // { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }
```

### useErrorHandler
Hook for centralized error handling with toasts.

**Features:**
- Handle 400 errors (validation)
- Handle 409 errors (duplicate)
- Handle 404 errors (not found)
- Show toasts with appropriate messages
- Success, warning, and info messages

**Usage:**
```typescript
const { handleError, showSuccess, showWarning } = useErrorHandler();

try {
  await comprobantesService.create(data);
  showSuccess('Comprobante creado exitosamente');
} catch (error) {
  handleError(error, 'crear comprobante');
}
```

## Alert Levels

Budget alerts use a traffic light system:

- 🟢 **Verde (0-75%)**: Normal execution
- 🟡 **Amarillo (76-90%)**: Requires attention
- 🟠 **Naranja (91-99%)**: URGENT
- 🔴 **Rojo (100%+)**: Insufficient budget - Operation blocked
