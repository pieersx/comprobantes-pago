# 📚 Documentación del Frontend - Sistema de Comprobantes de Pago

## 🎨 Stack Tecnológico

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.2
- **Styling**: TailwindCSS 4.1.0
- **UI Components**: shadcn/ui 3.5.0
- **State Management**: Zustand 5.0.2
- **Data Fetching**: TanStack Query 5.62.7
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Estructura del Proyecto

```
frontend/src/
├── app/
│   ├── (dashboard)/          # Layout con sidebar
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── proyectos/        # Gestión de proyectos
│   │   ├── comprobantes/     # Gestión de comprobantes
│   │   ├── proveedores/      # Gestión de proveedores
│   │   ├── clientes/         # Gestión de clientes
│   │   ├── flujo-caja/       # Flujo de caja
│   │   └── configuracion/    # Configuración
│   ├── layout.tsx            # Layout raíz
│   ├── page.tsx              # Página principal (redirect)
│   └── globals.css           # Estilos globales
│
├── components/
│   ├── layout/               # Componentes de layout
│   │   ├── sidebar.tsx       # Barra lateral navegación
│   │   └── header.tsx        # Cabecera con búsqueda
│   ├── ui/                   # Componentes UI (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── dropdown-menu.tsx
│   └── providers.tsx         # Providers globales
│
├── lib/
│   ├── api/                  # Cliente API
│   │   └── client.ts
│   └── utils.ts              # Utilidades
│
└── types/
    └── index.ts              # Tipos TypeScript
```

## 🎨 Diseño UX/UI

### Principios de Diseño

1. **Claridad**: Información clara y jerarquizada
2. **Consistencia**: Patrones visuales coherentes
3. **Eficiencia**: Acciones rápidas y flujos optimizados
4. **Accesibilidad**: Diseño inclusivo y responsive
5. **Feedback**: Respuestas visuales inmediatas

### Sistema de Colores

```css
/* Primary - Blue */
--blue-50: #eff6ff;
--blue-600: #2563eb;  /* Main brand color */
--blue-700: #1d4ed8;

/* Success - Green */
--green-600: #16a34a;

/* Warning - Yellow */
--yellow-600: #ca8a04;

/* Error - Red */
--red-600: #dc2626;

/* Neutral - Gray */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### Tipografía

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, line-height optimizado
- **Code**: Monospace para códigos

## 🧩 Componentes Principales

### 1. Sidebar

**Características**:
- Navegación colapsable
- Iconos con Lucide React
- Estado activo visual
- Información de usuario
- Responsive

**Navegación**:
- Dashboard
- Proyectos
- Comprobantes
- Proveedores
- Clientes
- Flujo de Caja
- Configuración

### 2. Header

**Características**:
- Búsqueda global
- Toggle tema (light/dark)
- Notificaciones
- Responsive

### 3. Dashboard

**Widgets**:
- **Stats Cards**: Métricas clave con tendencias
- **Proyectos Recientes**: Lista con progreso
- **Comprobantes Recientes**: Últimas transacciones
- **Acciones Rápidas**: Botones de acceso directo

### 4. Tabla de Proyectos

**Características**:
- Búsqueda en tiempo real
- Filtros avanzados
- Barra de progreso visual
- Estados con colores
- Menú de acciones
- Exportación de datos

### 5. Lista de Comprobantes

**Características**:
- Estadísticas por estado
- Búsqueda y filtros
- Estados visuales (iconos + colores)
- Formato de moneda
- Vista detallada

## 🎯 Páginas Implementadas

### Dashboard (`/dashboard`)

**Secciones**:
1. Header con título y botón CTA
2. Grid de estadísticas (4 cards)
3. Proyectos recientes (tabla)
4. Comprobantes recientes (lista)
5. Acciones rápidas (grid de botones)

**Métricas mostradas**:
- Proyectos activos
- Comprobantes pendientes
- Total pagado del mes
- Comprobantes vencidos

### Proyectos (`/proyectos`)

**Características**:
- Tabla completa de proyectos
- Búsqueda por nombre, código, cliente
- Filtros y exportación
- Barra de progreso por proyecto
- Estados visuales
- Menú de acciones (ver, editar, eliminar)

**Datos mostrados**:
- Código del proyecto
- Nombre y responsable
- Cliente
- Presupuesto y gastado
- Avance (%)
- Estado

### Comprobantes (`/comprobantes`)

**Características**:
- Estadísticas por estado
- Lista de comprobantes
- Búsqueda y filtros
- Estados con iconos
- Vista detallada

**Estados**:
- **PAG**: Pagado (verde)
- **PEN**: Pendiente (amarillo)
- **VEN**: Vencido (rojo)
- **REG**: Registrado (azul)

## 🎨 Sistema de Diseño

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Buttons

```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Danger</Button>
```

### Estados Visuales

**Badges de Estado**:
- Rounded-full
- Padding: px-2.5 py-0.5
- Font: text-xs font-medium
- Colores según estado

**Barras de Progreso**:
- Container: bg-gray-200, rounded-full
- Fill: bg-blue-600, height: h-2
- Porcentaje visible

## 🌓 Dark Mode

**Implementación**:
- next-themes para gestión
- Clases `dark:` de Tailwind
- Toggle en header
- Persistencia en localStorage

**Colores Dark Mode**:
```css
dark:bg-gray-950      /* Backgrounds */
dark:bg-gray-900      /* Cards */
dark:bg-gray-800      /* Hover states */
dark:text-white       /* Primary text */
dark:text-gray-400    /* Secondary text */
dark:border-gray-800  /* Borders */
```

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Grid Responsivo

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

## 🔄 Estados de Carga

**Skeleton Loaders**: (Pendiente)
- Shimmer effect
- Placeholder content
- Smooth transitions

**Empty States**: (Pendiente)
- Ilustraciones
- Mensajes descriptivos
- Call-to-action

## ✨ Animaciones

**Transiciones**:
```css
transition-colors    /* Color changes */
transition-all       /* All properties */
hover:shadow-md      /* Elevation on hover */
```

**Micro-interacciones**:
- Hover states en botones
- Active states en navegación
- Smooth scrolling
- Fade in/out

## 🎯 Mejores Prácticas Aplicadas

1. ✅ **Atomic Design**: Componentes reutilizables
2. ✅ **Accessibility**: ARIA labels, keyboard navigation
3. ✅ **Performance**: Code splitting, lazy loading
4. ✅ **SEO**: Metadata, semantic HTML
5. ✅ **Type Safety**: TypeScript strict mode
6. ✅ **Responsive**: Mobile-first approach
7. ✅ **Dark Mode**: Sistema de temas
8. ✅ **Consistency**: Design system coherente

## 🚀 Próximas Mejoras

### Corto Plazo
- [ ] Formularios con validación
- [ ] Modales y dialogs
- [ ] Tooltips informativos
- [ ] Paginación en tablas
- [ ] Filtros avanzados

### Mediano Plazo
- [ ] Gráficos con Recharts
- [ ] Exportación a PDF/Excel
- [ ] Drag & drop
- [ ] Upload de archivos
- [ ] Notificaciones en tiempo real

### Largo Plazo
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Internacionalización (i18n)
- [ ] Tests E2E con Playwright
- [ ] Storybook para componentes

## 📊 Métricas de Rendimiento

**Objetivos**:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

## 🎓 Guía de Estilo

### Nomenclatura

```tsx
// Componentes: PascalCase
export function DashboardCard() {}

// Funciones: camelCase
const formatCurrency = () => {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = ""

// Props: camelCase con tipo
interface ButtonProps {
  variant: "default" | "outline";
}
```

### Organización de Imports

```tsx
// 1. React y Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Librerías externas
import { useQuery } from "@tanstack/react-query";

// 3. Componentes
import { Button } from "@/components/ui/button";

// 4. Utilidades
import { cn } from "@/lib/utils";

// 5. Tipos
import type { Project } from "@/types";
```

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024  
**Framework**: Next.js 16.0.1
