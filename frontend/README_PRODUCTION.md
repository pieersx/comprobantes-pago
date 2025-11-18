# 📊 Sistema de Gestión de Comprobantes de Pago - Frontend

## 🎯 Versión de Producción

Sistema completo para la gestión de comprobantes de pago (ingresos y egresos), desarrollado con Next.js 16, TypeScript, y Shadcn UI.

## ✨ Características

### Funcionalidades Principales
- ✅ **Dashboard con estadísticas en tiempo real**
  - Total de ingresos y egresos
  - Balance general
  - Comprobantes pendientes de aprobación
  - Gráficos y reportes visuales

- ✅ **Gestión de Comprobantes**
  - Crear, editar y eliminar comprobantes
  - Clasificación por tipo (Ingreso/Egreso)
  - Estados: Pendiente, Aprobado, Rechazado, Anulado
  - Búsqueda y filtrado avanzado
  - Exportación a PDF

- ✅ **Gestión de Entidades**
  - Clientes
  - Proveedores
  - Proyectos
  - Empleados
  - Partidas presupuestarias

- ✅ **Características de Producción**
  - Optimización de rendimiento
  - Caché inteligente
  - Compresión de assets
  - Standalone deployment
  - Docker support
  - Health checks

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 20.x o superior
- pnpm (recomendado) o npm
- Backend ejecutándose en http://localhost:8080

### Instalación

```bash
# Clonar el repositorio
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus configuraciones

# Modo desarrollo
pnpm dev

# Abrir http://localhost:3000
```

## 📦 Despliegue a Producción

### Opción 1: Script Automático (Recomendado)

```bash
chmod +x deploy.sh
./deploy.sh
```

El script te guiará a través de:
1. Verificación de dependencias
2. Build de producción
3. Configuración de PM2 o servidor Node.js

### Opción 2: Manual

```bash
# 1. Configurar variables de producción
cp .env.local.example .env.production
# Editar NEXT_PUBLIC_API_URL con tu URL de producción

# 2. Build
pnpm build

# 3. Iniciar
pnpm start
```

### Opción 3: Docker Compose (Stack Completo)

```bash
# Iniciar todo el stack (DB + Backend + Frontend)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

Acceder a:
- Frontend: http://localhost (puerto 80)
- Backend API: http://localhost/api
- Base de datos: localhost:5432

### Opción 4: Solo Frontend Docker

```bash
# Build
docker build -t comprobantes-frontend .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://tu-api.com/api \
  comprobantes-frontend
```

## 🔧 Configuración

### Variables de Entorno

#### Desarrollo (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=Sistema de Comprobantes
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Producción (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
NEXT_PUBLIC_APP_NAME=Sistema de Comprobantes
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/       # Rutas del dashboard
│   │   │   ├── dashboard-simple/
│   │   │   ├── comprobantes/
│   │   │   ├── clientes/
│   │   │   ├── proveedores/
│   │   │   └── ...
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── components/
│   │   ├── ui/                # Componentes UI base (Shadcn)
│   │   ├── dashboard/         # Componentes del dashboard
│   │   └── ...
│   ├── lib/
│   │   └── api/              # Configuración de API
│   ├── services/             # Servicios de API
│   ├── types/                # TypeScript types
│   └── store/                # Estado global (Zustand)
├── public/                   # Assets estáticos
├── .env.production           # Variables de producción
├── next.config.ts            # Configuración Next.js
├── tailwind.config.ts        # Configuración Tailwind
├── docker-compose.yml        # Docker Compose
├── Dockerfile                # Dockerfile
├── nginx.conf                # Configuración Nginx
├── deploy.sh                 # Script de despliegue
├── DEPLOYMENT.md             # Guía de despliegue
└── package.json              # Dependencias
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript 5.7
- **UI**: Shadcn UI + Tailwind CSS 4
- **Estado**: Zustand + TanStack Query
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Íconos**: Lucide React
- **HTTP**: Axios
- **Fechas**: date-fns

## 📊 API Endpoints

El frontend se conecta a estos endpoints del backend:

### Comprobantes
- `GET /api/comprobantes` - Listar todos
- `GET /api/comprobantes/{id}` - Obtener por ID
- `POST /api/comprobantes` - Crear nuevo
- `PUT /api/comprobantes/{id}` - Actualizar
- `DELETE /api/comprobantes/{id}` - Eliminar
- `GET /api/comprobantes/estadisticas` - Estadísticas
- `GET /api/comprobantes/tipo/{tipo}` - Filtrar por tipo
- `GET /api/comprobantes/{id}/pdf` - Exportar PDF

### Clientes
- `GET /api/clientes` - Listar todos
- `POST /api/clientes` - Crear nuevo
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar

### Proveedores
- `GET /api/proveedores` - Listar todos
- Similar a clientes...

### Proyectos, Empleados, Partidas
- Endpoints similares siguiendo patrón REST

## 🔒 Seguridad

- ✅ Headers de seguridad configurados
- ✅ CORS configurado en backend
- ✅ Validación de formularios con Zod
- ✅ Sanitización de inputs
- ✅ HTTPS recomendado en producción
- ✅ Environment variables seguras

## 🚀 Performance

### Optimizaciones Implementadas
- ✅ Standalone output para Docker
- ✅ Compresión Gzip/Brotli
- ✅ Code splitting automático
- ✅ Image optimization
- ✅ Static generation donde es posible
- ✅ React Query caching
- ✅ Lazy loading de componentes

### Métricas Objetivo
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

## 🐛 Troubleshooting

### Error de conexión con API
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8080/api/health

# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL
```

### Error de build
```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules
pnpm install
pnpm build
```

### Puerto 3000 en uso
```bash
# Cambiar puerto
PORT=3001 pnpm start
```

## 📝 Scripts Disponibles

```bash
pnpm dev          # Modo desarrollo
pnpm build        # Build de producción
pnpm start        # Iniciar producción
pnpm lint         # Linter
pnpm type-check   # Verificar tipos TypeScript
```

## 🔄 Actualizaciones

Para actualizar dependencias:

```bash
# Actualizar dependencias menores
pnpm update

# Actualizar dependencias mayores (con cuidado)
pnpm update --latest
```

## 📞 Soporte

Para problemas o consultas:
- Revisar logs: `pm2 logs` o `docker-compose logs`
- Revisar la documentación del backend
- Verificar configuración de CORS
- Consultar DEPLOYMENT.md para guía detallada

## 📄 Licencia

Este proyecto es propietario y confidencial.

---

## 🎉 ¡Listo para Producción!

El sistema está completamente configurado y optimizado para su uso en producción con usuarios reales.

**Desarrollado con ❤️ para gestión eficiente de comprobantes de pago**
