# Services Documentation

This directory contains all the service modules for API communication.

## Services

### presupuesto.service.ts
Service for budget management and validation.

**Methods:**
- `getPresupuestoDisponible(codCia, codPyto, codPartida)` - Get available budget for a specific line item
- `validarEgreso(codCia, codPyto, detalles)` - Validate that an expense doesn't exceed available budget
- `getResumenProyecto(codCia, codPyto)` - Get complete budget summary for a project
- `getAlertas(codCia, codPyto)` - Get active budget alerts for a project

### partidas.service.ts
Service for budget line items (partidas) management.

**Methods:**
- `getPartidasByProyecto(codCia, codPyto, tipo)` - Get all line items for a project filtered by type (I/E)
- `getPartidaById(codCia, codPartida)` - Get a specific line item by ID
- `buscarPartidas(codCia, codPyto, query)` - Search line items by code or description

### comprobantes.service.ts
Service for payment vouchers (income/expenses) management.

**Updated with complete CRUD methods:**
- Income vouchers: `getAll`, `getById`, `create`, `update`, `delete`, `anular`
- Expense vouchers: `getAll`, `getById`, `create`, `update`, `delete`, `anular`

## Usage Example

```typescript
import { presupuestoService } from '@/services/presupuesto.service';
import { partidasService } from '@/services/partidas.service';
import { comprobantesEgresoService } from '@/services/comprobantes.service';

// Validate budget before creating expense
const validacion = await presupuestoService.validarEgreso(1, 100, detalles);
if (!validacion.valido) {
  console.error('Insufficient budget:', validacion.mensajeError);
}

// Get line items for a project
const partidas = await partidasService.getPartidasByProyecto(1, 100, 'E');

// Create expense voucher
const comprobante = await comprobantesEgresoService.create(data);
```
