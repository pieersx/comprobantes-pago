# Frontend - Sistema de Comprobantes de Pago

## Stack Tecnológico

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.2
- **Styling**: TailwindCSS 4.1.0
- **Components**: shadcn/ui 3.5.0
- **State Management**: Zustand 5.0.2
- **Data Fetching**: TanStack Query 5.62.7
- **Forms**: React Hook Form 7.54.2 + Zod 3.24.1
- **Tables**: TanStack Table 8.20.6
- **Charts**: Recharts 2.14.1
- **Icons**: Lucide React 0.468.0
- **HTTP Client**: Axios 1.7.9

## Características

✅ Server Components (RSC)  
✅ App Router con layouts anidados  
✅ TypeScript estricto  
✅ Dark Mode nativo  
✅ Responsive Design  
✅ Optimistic UI  
✅ Type-safe API client  
✅ Form validation con Zod  

## Estructura del Proyecto

```
src/
├── app/                 # App Router pages
│   ├── (auth)/         # Rutas de autenticación
│   ├── (dashboard)/    # Rutas del dashboard
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React Components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── tables/         # Table components
│   └── charts/         # Chart components
├── lib/                # Utilities
│   ├── api/            # API client
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand stores
│   └── utils/          # Helper functions
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Instalación

```bash
# Instalar dependencias
npm install

# O con pnpm (recomendado)
pnpm install
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME="Sistema de Comprobantes de Pago"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## Desarrollo

El servidor de desarrollo se ejecuta en: http://localhost:3000

- **Hot Reload**: Cambios automáticos al editar archivos
- **Fast Refresh**: Preserva el estado de React
- **TypeScript**: Validación en tiempo real

## Componentes shadcn/ui

Los componentes están en `src/components/ui/`. Para agregar más:

```bash
# Ejemplo: agregar componente de input
npx shadcn@latest add input
```

## API Client

El cliente HTTP está configurado en `src/lib/api/client.ts`:

- Interceptores para auth tokens
- Manejo automático de tenant ID
- Manejo de errores centralizado
- TypeScript types para todas las respuestas

## Integración con Backend

El frontend se conecta al backend Spring Boot:

- **API Base URL**: http://localhost:8080/api
- **Auth Header**: `Authorization: Bearer {token}`
- **Tenant Header**: `X-Tenant-ID: {tenantId}`

## Build para Producción

```bash
npm run build
npm run start
```

El build optimizado incluye:
- Code splitting automático
- Image optimization
- CSS minification
- Tree shaking
- Static generation donde sea posible
