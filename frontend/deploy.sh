#!/bin/bash

# Script de despliegue para producción
# Sistema de Gestión de Comprobantes de Pago

set -e

echo "🚀 Iniciando despliegue a producción..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_message "Node.js detectado: $(node --version)"

# Verificar pnpm o npm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    print_message "Usando pnpm"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    print_message "Usando npm"
else
    print_error "No se encontró npm ni pnpm"
    exit 1
fi

# Verificar archivo .env.production
if [ ! -f ".env.production" ]; then
    print_warning "Archivo .env.production no encontrado"
    print_warning "Creando desde ejemplo..."
    cp .env.local.example .env.production
    print_error "Por favor, configure .env.production con sus valores de producción"
    exit 1
fi
print_message "Archivo .env.production encontrado"

# Limpiar instalaciones anteriores
print_message "Limpiando instalaciones anteriores..."
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependencias
print_message "Instalando dependencias..."
$PKG_MANAGER install --frozen-lockfile

# Verificar linter
print_message "Ejecutando linter..."
$PKG_MANAGER run lint || print_warning "Advertencias de lint encontradas"

# Verificar type check
print_message "Verificando tipos TypeScript..."
$PKG_MANAGER run type-check || {
    print_error "Errores de TypeScript encontrados"
    exit 1
}

# Build para producción
print_message "Construyendo aplicación para producción..."
NODE_ENV=production $PKG_MANAGER run build

# Verificar que el build fue exitoso
if [ ! -d ".next" ]; then
    print_error "El build falló - directorio .next no encontrado"
    exit 1
fi
print_message "Build completado exitosamente"

# Crear backup si existe instalación previa
if [ -d ".next.backup" ]; then
    print_message "Eliminando backup anterior..."
    rm -rf .next.backup
fi

# Opciones de despliegue
echo ""
echo "📦 Build completado. Seleccione método de despliegue:"
echo "1) Iniciar servidor Node.js (desarrollo/pruebas)"
echo "2) Configurar PM2 (producción recomendada)"
echo "3) Solo build (despliegue manual)"
echo "4) Salir"
read -p "Seleccione opción [1-4]: " deploy_option

case $deploy_option in
    1)
        print_message "Iniciando servidor en modo producción..."
        NODE_ENV=production $PKG_MANAGER start
        ;;
    2)
        if ! command -v pm2 &> /dev/null; then
            print_error "PM2 no está instalado"
            read -p "¿Desea instalar PM2? (y/n): " install_pm2
            if [ "$install_pm2" = "y" ]; then
                npm install -g pm2
            else
                exit 1
            fi
        fi

        print_message "Configurando PM2..."
        pm2 delete comprobantes-frontend 2>/dev/null || true
        pm2 start $PKG_MANAGER --name "comprobantes-frontend" -- start
        pm2 save

        print_message "Aplicación iniciada con PM2"
        print_message "Ver logs: pm2 logs comprobantes-frontend"
        print_message "Ver estado: pm2 status"
        print_message "Reiniciar: pm2 restart comprobantes-frontend"
        ;;
    3)
        print_message "Build completado. Archivos en directorio .next/"
        print_message "Para iniciar: $PKG_MANAGER start"
        ;;
    4)
        print_message "Saliendo..."
        exit 0
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_message "✨ Despliegue completado exitosamente"
echo ""
echo "📋 Información del sistema:"
echo "   - Aplicación: Sistema de Comprobantes de Pago"
echo "   - Puerto: 3000 (por defecto)"
echo "   - URL: http://localhost:3000"
echo ""
echo "📚 Comandos útiles:"
echo "   - Ver logs PM2: pm2 logs comprobantes-frontend"
echo "   - Reiniciar: pm2 restart comprobantes-frontend"
echo "   - Detener: pm2 stop comprobantes-frontend"
echo ""
