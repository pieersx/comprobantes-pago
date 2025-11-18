# 🚀 Guía de Despliegue a Producción

## Frontend - Sistema de Gestión de Comprobantes de Pago

### 📋 Requisitos Previos

- Node.js 20.x o superior
- pnpm (recomendado) o npm
- Backend corriendo en producción
- Base de datos PostgreSQL configurada

### 🔧 Configuración

#### 1. Variables de Entorno

Crea o actualiza el archivo `.env.production`:

```bash
# API Configuration - IMPORTANTE: Cambiar a tu URL de producción
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Sistema de Comprobantes de Pago
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 2. Instalación de Dependencias

```bash
cd frontend
pnpm install
# o
npm install
```

### 🏗️ Construcción para Producción

```bash
# Construir la aplicación
pnpm build
# o
npm run build
```

Esto generará los archivos optimizados en la carpeta `.next/`

### 🚀 Despliegue

#### Opción 1: Servidor Node.js (Recomendado)

```bash
# Iniciar en modo producción
pnpm start
# o
npm start
```

La aplicación estará disponible en `http://localhost:3000`

#### Opción 2: PM2 (Para producción con auto-restart)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar con PM2
pm2 start npm --name "comprobantes-frontend" -- start

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

#### Opción 3: Docker

Crea un `Dockerfile` en la carpeta frontend:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

Construir y ejecutar:

```bash
docker build -t comprobantes-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://tu-api.com/api comprobantes-frontend
```

#### Opción 4: Vercel (Más simple)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

#### Opción 5: Nginx como Reverse Proxy

Configuración de Nginx (`/etc/nginx/sites-available/comprobantes`):

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar y reiniciar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/comprobantes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 📊 Verificación del Despliegue

1. **Verificar que el backend esté corriendo:**
   ```bash
   curl http://tu-backend-url/api/health
   ```

2. **Verificar conectividad del frontend:**
   - Abre `https://tu-dominio.com` en el navegador
   - Verifica la consola del navegador (F12) para errores
   - Comprueba que el dashboard carga las estadísticas

3. **Verificar logs:**
   ```bash
   # Si usas PM2
   pm2 logs comprobantes-frontend

   # Si usas Docker
   docker logs -f <container-id>
   ```

### 🔒 Seguridad

1. **Configurar HTTPS con Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com
   ```

2. **Configurar CORS en el backend** (application.properties):
   ```properties
   spring.web.cors.allowed-origins=https://tu-dominio.com
   spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
   spring.web.cors.allowed-headers=*
   ```

### 📈 Optimizaciones

1. **Habilitar compresión en next.config.ts:**
   ```typescript
   module.exports = {
     compress: true,
     output: 'standalone',
   }
   ```

2. **Configurar caché en Nginx:**
   ```nginx
   location /_next/static {
       alias /path/to/.next/static;
       expires 365d;
       access_log off;
   }
   ```

### 🐛 Troubleshooting

#### Error: "API connection failed"
- Verificar que `NEXT_PUBLIC_API_URL` apunta correctamente al backend
- Verificar que el backend esté corriendo: `curl http://backend-url/api/health`
- Revisar configuración de CORS en el backend

#### Error: "Module not found"
- Ejecutar: `rm -rf .next node_modules && pnpm install && pnpm build`

#### Performance lento
- Verificar logs del servidor: `pm2 logs`
- Aumentar recursos del servidor si es necesario
- Verificar latencia de red con el backend

### 📞 Soporte

Para problemas o consultas:
- Revisar logs del servidor
- Consultar documentación de Next.js: https://nextjs.org/docs
- Verificar configuración del backend

### 🎯 Checklist de Producción

- [ ] Variables de entorno configuradas correctamente
- [ ] Backend desplegado y funcionando
- [ ] Base de datos migrada y poblada
- [ ] Certificado SSL configurado
- [ ] CORS configurado en el backend
- [ ] PM2 o servicio de proceso configurado
- [ ] Nginx configurado (si aplica)
- [ ] Backups programados
- [ ] Monitoreo configurado
- [ ] DNS apuntando al servidor

---

## 🎉 ¡Listo para Producción!

Tu sistema de Gestión de Comprobantes de Pago está listo para ser usado por los usuarios finales.
