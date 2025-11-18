# 🚀 Guía de Deployment - Sistema de Comprobantes de Pago

## 📋 Índice
- [Requisitos Previos](#requisitos-previos)
- [Preparación del Entorno](#preparación-del-entorno)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Construcción del Proyecto](#construcción-del-proyecto)
- [Deployment en Producción](#deployment-en-producción)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Troubleshooting](#troubleshooting)

---

## 📦 Requisitos Previos

### Software Necesario
- **Java 21** (OpenJDK o Oracle JDK)
- **Maven 3.9+**
- **Oracle Database 12c+** (o Oracle 23c)
- **Servidor Linux** (Ubuntu 20.04+ o CentOS 7+)
- **Nginx** (opcional, como reverse proxy)

### Verificar Instalaciones
```bash
java -version    # Debe mostrar Java 21
mvn -version     # Debe mostrar Maven 3.9+
```

---

## 🔧 Preparación del Entorno

### 1. Crear Usuario del Sistema
```bash
sudo useradd -m -s /bin/bash comprobantes
sudo usermod -aG sudo comprobantes
```

### 2. Crear Directorios
```bash
sudo mkdir -p /opt/comprobantes-pago
sudo mkdir -p /var/log/comprobantes-pago
sudo mkdir -p /etc/comprobantes-pago

sudo chown -R comprobantes:comprobantes /opt/comprobantes-pago
sudo chown -R comprobantes:comprobantes /var/log/comprobantes-pago
sudo chown -R comprobantes:comprobantes /etc/comprobantes-pago
```

### 3. Variables de Entorno
Crear archivo `/etc/comprobantes-pago/env.conf`:
```bash
export DB_HOST=your-database-host
export DB_PORT=1521
export DB_SERVICE=XEPDB1
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_secure_password
export JWT_SECRET=your-very-long-secure-jwt-secret-key-min-256-bits
export CORS_ORIGINS=https://your-frontend-domain.com
export SPRING_PROFILES_ACTIVE=prod
```

Cargar variables:
```bash
source /etc/comprobantes-pago/env.conf
```

---

## 🗄️ Configuración de Base de Datos

### 1. Ejecutar Schema SQL
```sql
-- Conectarse a Oracle como SYSDBA
sqlplus / as sysdba

-- Crear usuario para la aplicación (si no existe)
CREATE USER comprobantes_user IDENTIFIED BY secure_password;
GRANT CONNECT, RESOURCE TO comprobantes_user;
GRANT CREATE SESSION TO comprobantes_user;
GRANT UNLIMITED TABLESPACE TO comprobantes_user;

-- Ejecutar el schema
@schema.sql
```

### 2. Verificar Tablas
```sql
-- Conectarse como usuario de aplicación
sqlplus comprobantes_user/secure_password@XEPDB1

-- Verificar tablas creadas
SELECT table_name FROM user_tables ORDER BY table_name;

-- Verificar datos de ejemplo
SELECT COUNT(*) FROM CIA;
SELECT COUNT(*) FROM PERSONA;
SELECT COUNT(*) FROM PROYECTO;
```

---

## 🏗️ Construcción del Proyecto

### 1. Clonar Repositorio
```bash
cd /opt/comprobantes-pago
git clone https://github.com/your-repo/payment-vouchers-management.git
cd payment-vouchers-management/backend
```

### 2. Compilar Proyecto
```bash
# Asegurarse de tener las variables de entorno cargadas
source /etc/comprobantes-pago/env.conf

# Compilar sin ejecutar tests (para primera vez)
./mvnw clean package -DskipTests

# O con tests
./mvnw clean package
```

### 3. Verificar JAR Generado
```bash
ls -lh target/comprobantes-pago-1.0.0.jar
```

---

## 🚀 Deployment en Producción

### Opción 1: Servicio Systemd (Recomendado)

#### 1. Crear Archivo de Servicio
Crear `/etc/systemd/system/comprobantes-pago.service`:
```ini
[Unit]
Description=Sistema de Comprobantes de Pago - API Backend
After=syslog.target network.target

[Service]
Type=simple
User=comprobantes
Group=comprobantes
WorkingDirectory=/opt/comprobantes-pago/payment-vouchers-management/backend
EnvironmentFile=/etc/comprobantes-pago/env.conf

ExecStart=/usr/bin/java \
    -Xms512m \
    -Xmx2048m \
    -Dspring.profiles.active=prod \
    -Dserver.port=8080 \
    -jar /opt/comprobantes-pago/payment-vouchers-management/backend/target/comprobantes-pago-1.0.0.jar

SuccessExitStatus=143
StandardOutput=journal
StandardError=journal
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 2. Activar y Iniciar Servicio
```bash
sudo systemctl daemon-reload
sudo systemctl enable comprobantes-pago
sudo systemctl start comprobantes-pago
sudo systemctl status comprobantes-pago
```

#### 3. Comandos de Gestión
```bash
# Ver estado
sudo systemctl status comprobantes-pago

# Ver logs en tiempo real
sudo journalctl -u comprobantes-pago -f

# Reiniciar servicio
sudo systemctl restart comprobantes-pago

# Detener servicio
sudo systemctl stop comprobantes-pago
```

### Opción 2: Script de Inicio Manual

Crear script `/opt/comprobantes-pago/start.sh`:
```bash
#!/bin/bash
source /etc/comprobantes-pago/env.conf

java -Xms512m -Xmx2048m \
     -Dspring.profiles.active=prod \
     -jar /opt/comprobantes-pago/payment-vouchers-management/backend/target/comprobantes-pago-1.0.0.jar \
     > /var/log/comprobantes-pago/application.log 2>&1 &

echo $! > /var/run/comprobantes-pago.pid
```

Hacer ejecutable:
```bash
chmod +x /opt/comprobantes-pago/start.sh
```

---

## 🌐 Configuración de Nginx (Reverse Proxy)

### 1. Instalar Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Configurar Virtual Host
Crear `/etc/nginx/sites-available/comprobantes-pago`:
```nginx
upstream comprobantes_api {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name api.comprobantes-pago.com;

    # Logs
    access_log /var/log/nginx/comprobantes-access.log;
    error_log /var/log/nginx/comprobantes-error.log;

    # Límites de tamaño
    client_max_body_size 10M;

    # Proxy settings
    location / {
        proxy_pass http://comprobantes_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /actuator/health {
        proxy_pass http://comprobantes_api;
        access_log off;
    }
}
```

### 3. Activar Configuración
```bash
sudo ln -s /etc/nginx/sites-available/comprobantes-pago /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Configurar SSL con Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.comprobantes-pago.com
```

---

## 📊 Monitoreo y Logs

### 1. Ver Logs de Aplicación
```bash
# Logs en tiempo real
tail -f /var/log/comprobantes-pago/application.log

# Últimas 100 líneas
tail -100 /var/log/comprobantes-pago/application.log

# Buscar errores
grep ERROR /var/log/comprobantes-pago/application.log
```

### 2. Endpoints de Monitoreo (Actuator)
```bash
# Health check
curl http://localhost:8080/api/v1/actuator/health

# Métricas
curl http://localhost:8080/api/v1/actuator/metrics

# Info de aplicación
curl http://localhost:8080/api/v1/actuator/info
```

### 3. Prometheus y Grafana (Opcional)
```bash
# Métricas para Prometheus
curl http://localhost:8080/api/v1/actuator/prometheus
```

---

## 🔒 Seguridad

### 1. Firewall
```bash
# Permitir solo puertos necesarios
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Protección contra ataques)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Backup Automático
Crear script `/opt/comprobantes-pago/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/comprobantes-pago"

mkdir -p $BACKUP_DIR

# Backup de base de datos
exp comprobantes_user/password@XEPDB1 \
    file=$BACKUP_DIR/db_backup_$DATE.dmp \
    log=$BACKUP_DIR/db_backup_$DATE.log

# Comprimir y mantener últimos 30 días
find $BACKUP_DIR -name "*.dmp" -mtime +30 -delete
```

Programar en crontab:
```bash
crontab -e
# Agregar: Backup diario a las 2 AM
0 2 * * * /opt/comprobantes-pago/backup.sh
```

---

## 🔧 Troubleshooting

### Problema: Aplicación no inicia
```bash
# Verificar logs
sudo journalctl -u comprobantes-pago -n 100

# Verificar puerto ocupado
sudo lsof -i :8080

# Verificar conexión a BD
telnet your-database-host 1521
```

### Problema: Error de conexión a BD
```bash
# Verificar credenciales
sqlplus comprobantes_user/password@XEPDB1

# Verificar listener de Oracle
lsnrctl status

# Verificar variables de entorno
echo $DB_HOST
echo $DB_USERNAME
```

### Problema: OutOfMemoryError
```bash
# Aumentar memoria en systemd service
# Editar /etc/systemd/system/comprobantes-pago.service
# Cambiar -Xmx2048m a -Xmx4096m
sudo systemctl daemon-reload
sudo systemctl restart comprobantes-pago
```

### Problema: Logs no se generan
```bash
# Verificar permisos
ls -la /var/log/comprobantes-pago/
sudo chown -R comprobantes:comprobantes /var/log/comprobantes-pago/
```

---

## 📈 Actualización de la Aplicación

### 1. Detener Servicio
```bash
sudo systemctl stop comprobantes-pago
```

### 2. Backup Actual
```bash
cp target/comprobantes-pago-1.0.0.jar target/comprobantes-pago-1.0.0.jar.backup
```

### 3. Obtener Nueva Versión
```bash
git pull origin main
./mvnw clean package -DskipTests
```

### 4. Reiniciar Servicio
```bash
sudo systemctl start comprobantes-pago
sudo systemctl status comprobantes-pago
```

---

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo o revisar la documentación completa en el repositorio.

---

**¡Backend listo para producción!** ✅
