# 🚀 Guía Rápida de Despliegue - Producción

## Para Administradores del Sistema

### ✅ Prerrequisitos Instalados
- [x] Node.js 20.x
- [x] Base de datos PostgreSQL
- [x] Backend Spring Boot

---

## 🎯 Opción 1: Despliegue Rápido (Recomendado)

### Paso 1: Preparar el entorno
```bash
cd frontend
cp .env.local.example .env.production
```

### Paso 2: Editar `.env.production`
```bash
# Cambiar esta URL por tu servidor de producción
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
```

### Paso 3: Ejecutar script de despliegue
```bash
./deploy.sh
```

Selecciona opción **2** para usar PM2 (producción recomendada)

### ✅ ¡Listo!
Tu aplicación estará disponible en: `http://localhost:3000`

---

## 🐳 Opción 2: Despliegue con Docker (Stack Completo)

### Todo en uno: Base de Datos + Backend + Frontend

```bash
cd frontend
./deploy-docker.sh
```

Selecciona opción **1** para desplegar el stack completo

### ✅ Acceso
- Frontend: `http://localhost`
- API: `http://localhost/api`
- Base de datos: `localhost:5432`

---

## 📊 Verificar que Todo Funciona

### 1. Verificar Backend
```bash
curl http://localhost:8080/api/health
```
Debería responder: `{"status":"OK"}`

### 2. Verificar Frontend
Abrir en navegador: `http://localhost:3000`

### 3. Ver Dashboard
Debería mostrar:
- ✅ Estadísticas de ingresos
- ✅ Estadísticas de egresos
- ✅ Balance total
- ✅ Lista de comprobantes

---

## 🔧 Comandos Útiles

### Ver logs de la aplicación
```bash
pm2 logs comprobantes-frontend
```

### Reiniciar aplicación
```bash
pm2 restart comprobantes-frontend
```

### Detener aplicación
```bash
pm2 stop comprobantes-frontend
```

### Ver estado
```bash
pm2 status
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to API"
**Solución:**
1. Verificar que el backend esté corriendo: `curl http://localhost:8080/api/health`
2. Verificar URL en `.env.production`
3. Reiniciar frontend: `pm2 restart comprobantes-frontend`

### ❌ Error: "Port 3000 already in use"
**Solución:**
```bash
# Cambiar puerto
PORT=3001 pm2 start npm --name "comprobantes-frontend" -- start
```

### ❌ Dashboard no carga datos
**Solución:**
1. Abrir consola del navegador (F12)
2. Ver errores en pestaña "Console"
3. Verificar que el backend responda: `curl http://localhost:8080/api/comprobantes`

---

## 🌐 Configurar Dominio Público

### Con Nginx (si tienes dominio)

1. Instalar Nginx:
```bash
sudo apt install nginx
```

2. Configurar:
```bash
sudo nano /etc/nginx/sites-available/comprobantes
```

Pegar:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

3. Activar:
```bash
sudo ln -s /etc/nginx/sites-available/comprobantes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### ✅ Acceso
Tu aplicación estará en: `http://tu-dominio.com`

---

## 🔒 Configurar HTTPS (Certificado SSL)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Sigue las instrucciones. ¡Listo! Ahora tienes HTTPS.

---

## 📱 Acceso para Usuarios

Una vez desplegado, comparte esta información con tus usuarios:

### 🌐 URL de Acceso
```
http://tu-dominio.com
o
http://tu-ip-servidor:3000
```

### 📋 Funcionalidades Disponibles
1. **Dashboard** - Vista general de ingresos y egresos
2. **Comprobantes** - Gestión completa de comprobantes
3. **Ingresos** - Registro de ingresos
4. **Egresos** - Registro de egresos
5. **Clientes** - Gestión de clientes
6. **Proveedores** - Gestión de proveedores
7. **Proyectos** - Gestión de proyectos

---

## 📞 ¿Necesitas Ayuda?

### Revisar logs
```bash
# Frontend
pm2 logs comprobantes-frontend

# Docker
docker-compose logs -f

# Backend (Spring Boot)
cd ../backend
tail -f logs/application.log
```

### Reiniciar todo
```bash
# Con PM2
pm2 restart all

# Con Docker
docker-compose restart

# Backend
cd ../backend
./mvnw spring-boot:restart
```

---

## ✅ Checklist Final

Antes de entregar a usuarios, verificar:

- [ ] Backend corriendo y respondiendo
- [ ] Frontend desplegado y accesible
- [ ] Base de datos con datos de prueba
- [ ] Dashboard muestra estadísticas correctamente
- [ ] Se pueden crear comprobantes
- [ ] Se pueden editar comprobantes
- [ ] Se pueden eliminar comprobantes
- [ ] Filtros funcionan correctamente
- [ ] Búsqueda funciona
- [ ] No hay errores en consola del navegador
- [ ] HTTPS configurado (si aplica)
- [ ] Backups configurados

---

## 🎉 ¡Sistema Listo!

Tu **Sistema de Gestión de Comprobantes de Pago** está completamente desplegado y listo para que los usuarios lo usen en producción.

**¡Éxito con tu proyecto! 🚀**
