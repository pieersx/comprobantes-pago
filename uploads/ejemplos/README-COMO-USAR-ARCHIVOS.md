# 📖 GUÍA: Cómo usar FotoCP, FotoAbono y FecAbono

## 🎯 CONCEPTOS CLAROS

### 📄 FotoCP (Foto del Comprobante de Pago)
**¿Qué es?**
- Es la **factura, boleta o recibo** que te dio el proveedor/cliente
- Es el documento que justifica el gasto/ingreso

**¿Cuándo se sube?**
- Al **CREAR** el comprobante (NO al registrar el pago)

**¿Dónde se sube?**
- En el formulario de "Nuevo Comprobante de Egreso/Ingreso"

**Ejemplo:**
```
Situación: Un proveedor te vendió materiales
- Te da una FACTURA en PDF
- Ese PDF es el FotoCP
- Lo subes al crear el comprobante
```

---

### 💰 FotoAbono (Voucher del Pago)
**¿Qué es?**
- Es el **comprobante de que TÚ pagaste**
- Puede ser: captura de transferencia, foto de depósito, voucher de Yape, etc.

**¿Cuándo se sube?**
- Al **REGISTRAR EL PAGO** (después de que ya creaste el comprobante)

**¿Dónde se sube?**
- En el modal "Registrar Pago" → Campo "Voucher del Pago (Opcional)"

**Ejemplo:**
```
Situación: Pagaste la factura del proveedor
- Hiciste una transferencia bancaria
- El banco te dio un comprobante
- Ese comprobante es el FotoAbono
- Lo subes al registrar el pago
```

---

### 📅 FecAbono (Fecha del Abono)
**¿Qué es?**
- Es la **fecha en que pagaste**

**¿Cuándo se registra?**
- Al **REGISTRAR EL PAGO**

**¿Dónde se pone?**
- En el modal "Registrar Pago" → Campo "Fecha del Pago"

**Ejemplo:**
```
Situación: Pagaste hoy
- Seleccionas la fecha de hoy
- Esa es la FecAbono
```

---

## 🎬 FLUJO COMPLETO EJEMPLO

### Paso 1: CREAR COMPROBANTE (con FotoCP)

**Situación Real:**
```
📋 El 21 de Marzo 2023:
- El proveedor "CONSTRUCTORA EJEMPLO" te hizo un trabajo
- Te dio una FACTURA CP-002 en PDF
- Monto: S/ 88,500.00
```

**En el sistema:**
1. Ir a: "Comprobantes" → "Nuevo Egreso"
2. Completar:
   - Proveedor: CONSTRUCTORA EJEMPLO
   - Número CP: CP-002
   - Fecha: 21/03/2023
   - Monto: 88,500.00
3. **En "Comprobante (PDF o Imagen)":**
   - Click en "Choose File"
   - Seleccionar: `factura-cp002-ejemplo.html` (o conviértelo a PDF)
   - Este es el **FotoCP** ✅
4. Guardar

**Resultado:**
- ✅ Comprobante creado
- ✅ Estado: REGISTRADO (aún no pagado)
- ✅ FotoCP guardado
- ❌ FotoAbono: vacío (aún no has pagado)
- ❌ FecAbono: vacío (aún no has pagado)

---

### Paso 2: REGISTRAR PAGO (con FotoAbono y FecAbono)

**Situación Real:**
```
💰 El 25 de Noviembre 2025:
- Decides pagar la factura
- Haces una transferencia bancaria
- El banco te da un comprobante
```

**En el sistema:**
1. Ir al comprobante CP-002
2. Scroll hasta "Estado del Pago"
3. Click en **"Registrar Pago"**
4. Completar:
   - **Fecha del Pago:** 25/11/2025 (esta es la **FecAbono** ✅)
   - **Medio de Pago:** "Transferencia bancaria"
   - **Voucher del Pago:**
     - Click en "Choose File"
     - Seleccionar: `voucher-transferencia-ejemplo.html` (o conviértelo a PDF)
     - Este es el **FotoAbono** ✅
5. Click en "Registrar Pago"

**Resultado:**
- ✅ Estado cambia a: PAGADO
- ✅ FotoCP: guardado desde antes
- ✅ FotoAbono: guardado ahora
- ✅ FecAbono: 25/11/2025
- ✅ DesAbono: "Transferencia bancaria"

---

## 📁 ARCHIVOS DE EJEMPLO CREADOS

He creado 2 archivos HTML que puedes usar:

### 1. Factura (para FotoCP)
**Archivo:** `/workspace/uploads/ejemplos/factura-cp002-ejemplo.html`

**Cómo usar:**
1. Abrir el archivo en navegador
2. Click derecho → "Imprimir" o Ctrl+P
3. Seleccionar "Guardar como PDF"
4. Guardar como `factura-cp002.pdf`
5. Usar ese PDF al crear el comprobante

### 2. Voucher (para FotoAbono)
**Archivo:** `/workspace/uploads/ejemplos/voucher-transferencia-ejemplo.html`

**Cómo usar:**
1. Abrir el archivo en navegador
2. Click derecho → "Imprimir" o Ctrl+P
3. Seleccionar "Guardar como PDF"
4. Guardar como `voucher-pago-cp002.pdf`
5. Usar ese PDF al registrar el pago

---

## 🖼️ ALTERNATIVA: USAR IMÁGENES

Si no quieres PDFs, puedes usar capturas de pantalla:

### Para FotoCP (Factura):
```bash
# Tomar captura de pantalla de cualquier documento
# O buscar en Google Images: "ejemplo factura perú"
# Guardar como: factura.jpg
```

### Para FotoAbono (Voucher):
```bash
# Tomar captura de pantalla de tu banca online
# O buscar en Google Images: "voucher transferencia bancaria"
# Guardar como: voucher.jpg
```

---

## ⚠️ CAMPO OPCIONAL

**Importante:** El campo **"Voucher del Pago"** es **OPCIONAL**

Puedes registrar un pago sin subir archivo:
1. Solo completa Fecha y Medio de Pago
2. Deja Voucher vacío
3. El sistema igual cambiará el estado a PAGADO

---

## 🎯 RESUMEN RÁPIDO

| Campo | ¿Qué es? | ¿Cuándo? | ¿Obligatorio? |
|-------|----------|----------|---------------|
| **FotoCP** | Factura del proveedor | Al crear comprobante | Opcional* |
| **FotoAbono** | Comprobante de pago | Al registrar pago | Opcional |
| **FecAbono** | Fecha que pagaste | Al registrar pago | ✅ Sí |

\* En la práctica, FotoCP debería ser obligatorio, pero el sistema lo permite vacío.

---

## 🚀 PRUEBA RÁPIDA AHORA

```bash
# 1. Convertir HTML a PDF (en tu computadora):
# - Abre factura-cp002-ejemplo.html en Chrome
# - Ctrl+P → Guardar como PDF → factura-cp002.pdf
# - Abre voucher-transferencia-ejemplo.html en Chrome
# - Ctrl+P → Guardar como PDF → voucher-pago.pdf

# 2. O simplemente usa los HTML directamente
# El sistema acepta cualquier archivo imagen o PDF
```

¿Necesitas que te ayude con algo más específico?
