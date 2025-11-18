# useMontoCalculator Hook

Hook personalizado para cálculos automáticos de montos, IGV y conversión de moneda en comprobantes de pago.

## Descripción

Este hook proporciona funciones para:
- Calcular IGV automáticamente (18%)
- Calcular totales (neto + IGV)
- Calcular total del comprobante (suma de partidas)
- Manejar conversión de moneda (USD ↔ PEN)
- Validar y formatear montos

## Requisitos Implementados

- **Requirement 1.3**: Cálculo automático de IGV (18%) y total
- **Requirement 2.4**: Cálculo automático de IGV para ingresos
- **Requirement 8.1**: Calcular IGV como 18% del importe neto
- **Requirement 8.2**: Calcular total como neto + IGV
- **Requirement 8.3**: Calcular total del comprobante (suma de partidas)
- **Requirement 8.4**: Conversión de moneda USD a PEN

## Uso

```typescript
import { useMontoCalculator } from '@/hooks';

function ComprobanteForm() {
  const {
    calcularDesdeNeto,
    calcularTotalComprobante,
    convertirMoneda,
    validarMonto,
    formatearMonto,
    IGV_RATE
  } = useMontoCalculator();

  // Calcular IGV y total desde el neto
  const resultado = calcularDesdeNeto(1000);
  // { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }

  // Calcular total del comprobante
  const total = calcularTotalComprobante(detalles);

  // Convertir de USD a PEN
  const conversion = convertirMoneda(100, 3.75);
  // { impNetoMn: 375, impIgvMn: 67.5, impTotalMn: 442.5, ... }

  // Validar monto
  const esValido = validarMonto(1000); // true

  // Formatear monto
  const formateado = formatearMonto(1234.56, 'PEN'); // "S/ 1234.56"
}
```

## API

### calcularDesdeNeto(impNetoMn: number): CalculoMonto

Calcula el IGV (18%) y el total a partir del importe neto.

**Parámetros:**
- `impNetoMn`: Importe neto en moneda nacional

**Retorna:**
```typescript
{
  impNetoMn: number;
  impIgvMn: number;    // 18% del neto
  impTotalMn: number;  // neto + IGV
}
```

**Ejemplo:**
```typescript
calcularDesdeNeto(1000);
// { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }
```

### calcularDesdeTotal(impTotalMn: number): CalculoMonto

Calcula el neto y el IGV a partir del total.

**Parámetros:**
- `impTotalMn`: Importe total en moneda nacional

**Retorna:**
```typescript
{
  impNetoMn: number;   // total / 1.18
  impIgvMn: number;    // total - neto
  impTotalMn: number;
}
```

**Ejemplo:**
```typescript
calcularDesdeTotal(1180);
// { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 }
```

### calcularTotalComprobante(detalles: Array): CalculoMonto

Calcula el total del comprobante sumando todas las partidas.

**Parámetros:**
- `detalles`: Array de objetos con `impNetoMn`, `impIgvMn`, `impTotalMn`

**Retorna:**
```typescript
{
  impNetoMn: number;   // suma de todos los netos
  impIgvMn: number;    // suma de todos los IGVs
  impTotalMn: number;  // suma de todos los totales
}
```

**Ejemplo:**
```typescript
const detalles = [
  { impNetoMn: 1000, impIgvMn: 180, impTotalMn: 1180 },
  { impNetoMn: 500, impIgvMn: 90, impTotalMn: 590 }
];
calcularTotalComprobante(detalles);
// { impNetoMn: 1500, impIgvMn: 270, impTotalMn: 1770 }
```

### convertirMoneda(impNetoMe: number, tipCambio: number): CalculoMontoConversion

Convierte montos de moneda extranjera (USD) a moneda nacional (PEN).

**Parámetros:**
- `impNetoMe`: Importe neto en moneda extranjera
- `tipCambio`: Tipo de cambio (ej: 3.75)

**Retorna:**
```typescript
{
  impNetoMn: number;   // neto en PEN
  impIgvMn: number;    // IGV en PEN
  impTotalMn: number;  // total en PEN
  impNetoMe: number;   // neto en USD
  impIgvMe: number;    // IGV en USD
  impTotalMe: number;  // total en USD
}
```

**Ejemplo:**
```typescript
convertirMoneda(100, 3.75);
// {
//   impNetoMn: 375,
//   impIgvMn: 67.5,
//   impTotalMn: 442.5,
//   impNetoMe: 100,
//   impIgvMe: 18,
//   impTotalMe: 118
// }
```

### convertirAMonedaExtranjera(impNetoMn: number, tipCambio: number): CalculoMontoConversion

Convierte montos de moneda nacional (PEN) a moneda extranjera (USD).

**Parámetros:**
- `impNetoMn`: Importe neto en moneda nacional
- `tipCambio`: Tipo de cambio (ej: 3.75)

**Retorna:** Mismo formato que `convertirMoneda`

**Ejemplo:**
```typescript
convertirAMonedaExtranjera(375, 3.75);
// {
//   impNetoMn: 375,
//   impIgvMn: 67.5,
//   impTotalMn: 442.5,
//   impNetoMe: 100,
//   impIgvMe: 18,
//   impTotalMe: 118
// }
```

### validarMonto(monto: number): boolean

Valida que un monto sea válido (positivo y no cero).

**Parámetros:**
- `monto`: Monto a validar

**Retorna:** `true` si el monto es válido, `false` en caso contrario

**Ejemplo:**
```typescript
validarMonto(100);   // true
validarMonto(0);     // false
validarMonto(-100);  // false
validarMonto(NaN);   // false
```

### formatearMonto(monto: number, moneda?: string): string

Formatea un monto para mostrar con 2 decimales y símbolo de moneda.

**Parámetros:**
- `monto`: Monto a formatear
- `moneda`: Código de moneda ('PEN' o 'USD', por defecto 'PEN')

**Retorna:** String formateado con símbolo y 2 decimales

**Ejemplo:**
```typescript
formatearMonto(1234.56, 'PEN');  // "S/ 1234.56"
formatearMonto(1234.56, 'USD');  // "$ 1234.56"
formatearMonto(1234.56);         // "S/ 1234.56" (PEN por defecto)
```

### calcularIGV(monto: number): number

Calcula solo el IGV de un monto (sin incluirlo en el total).

**Parámetros:**
- `monto`: Monto base

**Retorna:** IGV calculado (18% del monto)

**Ejemplo:**
```typescript
calcularIGV(1000);  // 180
```

### calcularTotalConIGV(monto: number): number

Calcula el total incluyendo IGV.

**Parámetros:**
- `monto`: Monto base

**Retorna:** Total con IGV incluido

**Ejemplo:**
```typescript
calcularTotalConIGV(1000);  // 1180
```

### IGV_RATE: number

Constante que expone la tasa de IGV (0.18 = 18%).

**Ejemplo:**
```typescript
const { IGV_RATE } = useMontoCalculator();
console.log(IGV_RATE);  // 0.18
```

## Tipos

### CalculoMonto

```typescript
interface CalculoMonto {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
}
```

### CalculoMontoConversion

```typescript
interface CalculoMontoConversion {
  impNetoMn: number;
  impIgvMn: number;
  impTotalMn: number;
  impNetoMe: number;
  impIgvMe: number;
  impTotalMe: number;
}
```

## Notas

- Todos los cálculos se redondean a 2 decimales
- La tasa de IGV es fija en 18% (0.18)
- Los montos negativos o cero son considerados inválidos
- El tipo de cambio por defecto es 1.0 (misma moneda)
- Todos los callbacks están memoizados con `useCallback` para optimizar el rendimiento

## Testing

Se incluyen tests completos en `__tests__/useMontoCalculator.test.ts` que verifican:
- Cálculo de IGV (18%)
- Cálculo de totales
- Suma de partidas
- Conversión de moneda bidireccional
- Validación de montos
- Formateo de montos
- Manejo de casos edge (cero, decimales, etc.)
