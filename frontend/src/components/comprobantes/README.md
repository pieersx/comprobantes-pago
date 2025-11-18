# Componentes de Comprobantes

Este directorio contiene los componentes UI base para la gestión de comprobantes de pago (ingresos y egresos).

## Componentes Implementados

### 1. MontoCalculator
**Archivo:** `MontoCalculator.tsx`

Componente para calcular automáticamente IGV (18%) y totales a partir del importe neto.

**Características:**
- Input para importe neto con formato de moneda
- Display automático de IGV calculado (18%)
- Display automático de total calculado
- Soporte para modo readonly
- Validación de formato numérico con 2 decimales
- Integración con shadcn/ui Input y Label

**Props:**
- `impNetoMn`: Importe neto inicial
- `onCalculate`: Callback que retorna los montos calculados
- `readonly`: Modo solo lectura (opcional)
- `label`: Etiqueta personalizada (opcional)

**Uso:**
```tsx
<MontoCalculator
  impNetoMn={1000}
  onCalculate={(resultado) => console.log(resultado)}
  readonly={false}
/>
```

---

### 2. PartidaSelector
**Archivo:** `PartidaSelector.tsx`

Selector de partidas presupuestales con búsqueda y filtrado.

**Características:**
- Select con búsqueda de partidas usando partidasService
- Filtrado automático por tipo (Ingreso/Egreso)
- Muestra presupuesto disponible en cada opción
- Deshabilita partidas sin presupuesto
- Indicador visual de nivel de alerta por color
- Integración con shadcn/ui Select

**Props:**
- `codPyto`: Código del proyecto
- `tipo`: Tipo de partida ('I' para Ingreso, 'E' para Egreso)
- `value`: Código de partida seleccionada (opcional)
- `onChange`: Callback cuando se selecciona una partida
- `disabled`: Deshabilitar selector (opcional)
- `label`: Etiqueta personalizada (opcional)
- `error`: Mensaje de error (opcional)

**Uso:**
```tsx
<PartidaSelector
  codPyto={1}
  tipo="E"
  onChange={(partida) => console.log(partida)}
/>
```

---

### 3. PresupuestoAlert
**Archivo:** `PresupuestoAlert.tsx`

Componente para mostrar alertas de presupuesto con semáforo visual.

**Características:**
- Badge con color según nivel (verde/amarillo/naranja/rojo)
- Mensaje descriptivo de la alerta
- Detalles de presupuesto (original/ejecutado/disponible)
- Botón para descartar alerta
- Iconos distintivos por tipo de alerta
- Usa tipos de @/types/presupuesto

**Niveles de Alerta:**
- 🟢 **Verde (0-75%)**: Normal, sin problemas
- 🟡 **Amarillo (76-90%)**: Atención, requiere monitoreo
- 🟠 **Naranja (91-99%)**: Urgente, cerca del límite
- 🔴 **Rojo (100%+)**: Error, presupuesto excedido

**Props:**
- `alertas`: Array de alertas a mostrar
- `onDismiss`: Callback para descartar una alerta (opcional)

**Uso:**
```tsx
<PresupuestoAlert
  alertas={alertasArray}
  onDismiss={(id) => console.log('Descartada:', id)}
/>
```

---

### 4. DetallePartidas
**Archivo:** `DetallePartidas.tsx`

Componente para gestionar el detalle de partidas de un comprobante.

**Características:**
- Tabla con columnas: Partida, Neto, IGV, Total, Presupuesto, Acciones
- Botón para agregar nueva partida (abre Dialog)
- Botón para editar partida inline
- Botón para eliminar partida con confirmación
- Indicador visual de presupuesto por partida con Badge
- Fila de totales automática
- Integración con MontoCalculator y PartidaSelector
- Usa tipos de useComprobanteForm hook

**Props:**
- `detalles`: Array de partidas del comprobante
- `codPyto`: Código del proyecto
- `tipo`: Tipo de comprobante ('ingreso' o 'egreso')
- `onAdd`: Callback para agregar una partida
- `onUpdate`: Callback para actualizar una partida
- `onRemove`: Callback para eliminar una partida
- `readonly`: Modo solo lectura (opcional)

**Uso:**
```tsx
<DetallePartidas
  detalles={formState.detalles}
  codPyto={formState.codPyto}
  tipo="egreso"
  onAdd={agregarPartida}
  onUpdate={editarPartida}
  onRemove={eliminarPartida}
/>
```

---

## Dependencias

Estos componentes dependen de:

### Hooks Personalizados
- `useMontoCalculator`: Cálculos de IGV y totales
- `useComprobanteForm`: Gestión del estado del formulario

### Servicios
- `partidasService`: Consulta de partidas presupuestales

### Tipos
- `@/types/presupuesto`: Tipos para validación y alertas
- `@/types/partida`: Tipos para partidas presupuestales
- `@/hooks/useComprobanteForm`: Tipo DetallePartidaForm

### Componentes UI (shadcn/ui)
- Input
- Label
- Select
- Badge
- Button
- Dialog
- Table

## Integración

Estos componentes están diseñados para ser utilizados en conjunto en el formulario principal de comprobantes (`ComprobanteForm`), que se implementará en la siguiente tarea.

## Próximos Pasos

La siguiente tarea (Tarea 6) implementará el componente `ComprobanteForm` que integrará todos estos componentes base para crear el formulario completo de creación/edición de comprobantes.
