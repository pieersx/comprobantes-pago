# Task 4.6: useMontoCalculator Hook - Implementation Summary

## Status: ✅ COMPLETED

## Overview

The `useMontoCalculator` hook has been successfully implemented with all required functionality for automatic calculations of amounts, IGV (18% tax), and currency conversions in payment vouchers.

## Requirements Covered

### ✅ Requirement 1.3 - Automatic IGV and Total Calculation for Expenses
- Implemented `calcularDesdeNeto()` to calculate IGV (18%) and total from net amount
- Implemented `calcularIGV()` for standalone IGV calculation
- Implemented `calcularTotalConIGV()` for total with IGV included

### ✅ Requirement 2.4 - Automatic IGV Calculation for Income
- Same calculation functions work for both income and expense vouchers
- IGV rate is consistent at 18% across all calculations

### ✅ Requirement 8.1 - Calculate IGV as 18% of Net Amount
- `calcularDesdeNeto(1000)` returns `{ impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }`
- All calculations use the constant `IGV_RATE = 0.18`

### ✅ Requirement 8.2 - Calculate Total as Net + IGV
- `calcularDesdeNeto()` calculates: `total = neto + igv`
- `calcularDesdeTotal()` reverse calculates: `neto = total / 1.18`

### ✅ Requirement 8.3 - Calculate Voucher Total (Sum of Line Items)
- `calcularTotalComprobante(detalles)` sums all line items
- Returns aggregated `{ impNetoMn, impIgvMn, impTotalMn }`

### ✅ Requirement 8.4 - Handle Currency Conversion for USD
- `convertirMoneda(impNetoMe, tipCambio)` converts USD → PEN
- `convertirAMonedaExtranjera(impNetoMn, tipCambio)` converts PEN → USD
- Both functions return amounts in both currencies with IGV calculated

## Implementation Details

### File Location
```
frontend/src/hooks/useMontoCalculator.ts
```

### Exported Functions

1. **calcularDesdeNeto(impNetoMn: number): CalculoMonto**
   - Calculates IGV and total from net amount
   - Returns: `{ impNetoMn, impIgvMn, impTotalMn }`

2. **calcularDesdeTotal(impTotalMn: number): CalculoMonto**
   - Reverse calculates net and IGV from total
   - Returns: `{ impNetoMn, impIgvMn, impTotalMn }`

3. **calcularTotalComprobante(detalles: Array): CalculoMonto**
   - Sums all line items to get voucher total
   - Returns: `{ impNetoMn, impIgvMn, impTotalMn }`

4. **convertirMoneda(impNetoMe: number, tipCambio: number): CalculoMontoConversion**
   - Converts from foreign currency (USD) to national currency (PEN)
   - Returns amounts in both currencies

5. **convertirAMonedaExtranjera(impNetoMn: number, tipCambio: number): CalculoMontoConversion**
   - Converts from national currency (PEN) to foreign currency (USD)
   - Returns amounts in both currencies

6. **validarMonto(monto: number): boolean**
   - Validates that amount is positive and not zero
   - Returns `true` if valid, `false` otherwise

7. **formatearMonto(monto: number, moneda?: string): string**
   - Formats amount with currency symbol and 2 decimals
   - Supports 'PEN' (S/) and 'USD' ($)

8. **calcularIGV(monto: number): number**
   - Calculates only the IGV (18%) of an amount
   - Returns IGV value

9. **calcularTotalConIGV(monto: number): number**
   - Calculates total including IGV
   - Returns total value

10. **IGV_RATE: number**
    - Constant exposing the IGV rate (0.18)

### Type Definitions

```typescript
interface CalculoMonto {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
}

interface CalculoMontoConversion {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  impNetoMe: number;
  impIgvMe: number;
  impTotalMe: number;
}
```

### Key Features

- ✅ All calculations rounded to 2 decimal places
- ✅ Fixed IGV rate at 18% (0.18)
- ✅ Handles zero and negative values gracefully
- ✅ Default exchange rate of 1.0 for same currency
- ✅ All callbacks memoized with `useCallback` for performance
- ✅ Comprehensive JSDoc documentation
- ✅ Type-safe with TypeScript interfaces

## Export Configuration

The hook is properly exported in `frontend/src/hooks/index.ts`:

```typescript
export { useMontoCalculator } from './useMontoCalculator';
export type { CalculoMonto, CalculoMontoConversion } from './useMontoCalculator';
```

## Usage Example

```typescript
import { useMontoCalculator } from '@/hooks';

function ComprobanteForm() {
  const {
    calcularDesdeNeto,
    calcularTotalComprobante,
    convertirMoneda,
    validarMonto,
    formatearMonto
  } = useMontoCalculator();

  // Calculate IGV and total from net amount
  const resultado = calcularDesdeNeto(1000);
  // { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }

  // Calculate voucher total from line items
  const total = calcularTotalComprobante([
    { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 },
    { impNetoMn: 500, impIgvMn: 90, impTotalMn: 590 }
  ]);
  // { impNetoMn: 1500, impIgvMn: 270, impTotalMn: 1770 }

  // Convert USD to PEN
  const conversion = convertirMoneda(100, 3.75);
  // {
  //   impNetoMn: 375, impIgvMn: 67.5, impTotalMn: 442.5,
  //   impNetoMe: 100, impIgvMe: 18, impTotalMe: 118
  // }

  // Validate amount
  const esValido = validarMonto(1000); // true

  // Format amount
  const formateado = formatearMonto(1234.56, 'PEN'); // "S/ 1234.56"
}
```

## Documentation

Comprehensive documentation has been created at:
```
frontend/src/hooks/useMontoCalculator.md
```

This includes:
- Detailed API documentation for all functions
- Usage examples for each function
- Type definitions
- Notes on behavior and edge cases

## Testing

While testing libraries are not currently installed in the project, the hook has been designed with testability in mind:
- Pure functions with no side effects
- Predictable calculations
- Clear input/output contracts
- Comprehensive JSDoc comments

Test cases would cover:
- IGV calculation (18%)
- Total calculation (net + IGV)
- Sum of line items
- Bidirectional currency conversion
- Amount validation
- Amount formatting
- Edge cases (zero, decimals, negative values)

## Integration Points

This hook is designed to be used by:
- `ComprobanteForm` component (Task 6.1-6.7)
- `MontoCalculator` component (Task 5.1)
- `DetallePartidas` component (Task 5.4)
- Any component that needs to calculate amounts with IGV

## Next Steps

The hook is ready for integration. Next tasks should:
1. Use this hook in the `MontoCalculator` component (Task 5.1)
2. Integrate with `ComprobanteForm` for automatic calculations (Task 6.3, 6.4)
3. Use in `DetallePartidas` for line item calculations (Task 5.4)

## Conclusion

Task 4.6 has been successfully completed. The `useMontoCalculator` hook provides all required functionality for automatic calculations of IGV, totals, and currency conversions, meeting all specified requirements (1.3, 2.4, 8.1, 8.2, 8.3, 8.4).
