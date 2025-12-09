# Implementación de Jerarquía de Partidas

## ✅ Completado

### Frontend: `/partidas` - Gestión de Partidas Genéricas

**Archivo creado:** `frontend/src/app/(dashboard)/partidas/page.tsx`

#### Características implementadas:

1. **Vista Jerárquica con Árbol Expandible**
   - Visualización de partidas en estructura padre-hijo
   - Botones de expandir/colapsar para navegar por niveles
   - Indentación visual según el nivel de jerarquía

2. **Colores por Nivel** (similar a la imagen de referencia)
   - Nivel 1: Verde (Ingresos) / Rojo (Egresos)
   - Nivel 2: Teal (Ingresos) / Naranja (Egresos)
   - Nivel 3+: Colores adicionales según necesidad

3. **CRUD Completo**
   - ✅ Crear partida (con selección de padre opcional)
   - ✅ Editar partida
   - ✅ Eliminar partida
   - ✅ Listar todas las partidas

4. **Leyenda Visual**
   - Muestra los colores de cada nivel
   - Diferencia entre Ingresos y Egresos

5. **Formulario de Creación/Edición**
   - Campo: Descripción de la partida
   - Campo: Tipo (Ingreso/Egreso)
   - Campo: Partida Padre (opcional, para crear jerarquía)
   - Campo: Vigente (Sí/No)

### Backend: Endpoints Disponibles

El backend ya tiene todos los endpoints necesarios en `PartidaController.java`:

```
GET    /api/v1/partidas?codCia=1              - Listar todas las partidas
GET    /api/v1/partidas/{codCia}/{ingEgr}/{codPartida}  - Obtener una partida
POST   /api/v1/partidas                       - Crear partida
PUT    /api/v1/partidas/{codCia}/{ingEgr}/{codPartida}  - Actualizar partida
DELETE /api/v1/partidas/{codCia}/{ingEgr}/{codPartida}  - Eliminar partida
```

### Servicio Frontend

**Archivo:** `frontend/src/services/partidas.service.ts`

El servicio `partidasService` ya incluye todos los métodos necesarios:
- `getAll(codCia)` - Obtener todas las partidas
- `getById(codCia, ingEgr, codPartida)` - Obtener una partida
- `create(partida)` - Crear partida
- `update(codCia, ingEgr, codPartida, partida)` - Actualizar
- `delete(codCia, ingEgr, codPartida)` - Eliminar

## 🎯 Funcionalidad

### Jerarquías Disponibles

1. **Partidas Genéricas** (`/partidas`)
   - Endpoint: `http://localhost:4584/partidas`
   - Solo se crean las partidas base
   - Estructura jerárquica padre-hijo

2. **Partida Mezcla** (`/partida-mezcla`)
   - Endpoint: `http://localhost:4584/partida-mezcla`
   - Composición jerárquica genérica

3. **Proy Partida** (`/proy-partida`)
   - Endpoint: `http://localhost:4584/proy-partida`
   - Partidas específicas por proyecto

4. **Proy Partida Mezcla** (`/proy-partida-mezcla`)
   - Endpoint: `http://localhost:4584/proy-partida-mezcla`
   - Composición jerárquica específica por proyecto

## 🚀 Cómo Usar

1. Navegar a `http://localhost:3000/partidas`
2. Ver la lista de partidas en formato jerárquico
3. Hacer clic en los botones de expandir/colapsar para ver los hijos
4. Usar el botón "Nueva Partida" para crear una partida
5. Seleccionar un padre opcional para crear jerarquía
6. Editar o eliminar partidas con los botones de acción

## 📊 Estructura de Datos

```typescript
interface Partida {
  codCia: number;
  codPartida: number;
  desPartida: string;
  ingEgr: string;  // 'I' = Ingreso, 'E' = Egreso
  vigente: string;
  nivel?: number;
  padCodPartida?: number;  // Código del padre
  children?: Partida[];    // Hijos en el árbol
}
```

## 🎨 Diseño Visual

La interfaz sigue el diseño de la imagen de referencia "Flujo de Caja Proyectado":
- Colores diferenciados por nivel
- Estructura de árbol expandible
- Leyenda de colores
- Indentación visual clara
- Iconos de expandir/colapsar

## ✨ Próximos Pasos (Opcional)

- [ ] Agregar filtros por tipo (Ingreso/Egreso)
- [ ] Agregar búsqueda por nombre
- [ ] Agregar drag & drop para reordenar
- [ ] Exportar a Excel/PDF
- [ ] Validaciones adicionales (no permitir ciclos en jerarquía)
