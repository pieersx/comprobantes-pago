#!/bin/bash

# Script de despliegue con Docker Compose
# Sistema de Gestión de Comprobantes de Pago - Stack Completo

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

echo ""
echo "🚀 Sistema de Gestión de Comprobantes de Pago"
echo "   Despliegue con Docker Compose"
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi
print_message "Docker detectado: $(docker --version)"

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi
print_message "Docker Compose detectado"

# Verificar archivo .env.production
if [ ! -f ".env.production" ]; then
    print_warning "Archivo .env.production no encontrado"
    cp .env.local.example .env.production
    print_info "Archivo .env.production creado desde ejemplo"
    print_warning "Por favor, configure las variables de producción"
fi

# Opciones
echo ""
echo "📦 Seleccione acción:"
echo "1) Desplegar stack completo (DB + Backend + Frontend + Nginx)"
echo "2) Solo frontend"
echo "3) Reconstruir imágenes"
echo "4) Ver logs"
echo "5) Detener servicios"
echo "6) Limpiar todo (containers, volumes, images)"
echo "7) Salir"
read -p "Seleccione opción [1-7]: " option

case $option in
    1)
        print_message "Desplegando stack completo..."
        docker-compose up -d

        echo ""
        print_message "✨ Stack desplegado exitosamente"
        echo ""
        print_info "📋 Servicios disponibles:"
        echo "   🌐 Frontend:  http://localhost"
        echo "   🔧 Backend:   http://localhost/api"
        echo "   🗄️  Database:  localhost:5432"
        echo ""
        print_info "📊 Ver estado de servicios:"
        echo "   docker-compose ps"
        echo ""
        print_info "📝 Ver logs:"
        echo "   docker-compose logs -f"
        echo ""
        ;;

    2)
        print_message "Desplegando solo frontend..."
        docker-compose up -d frontend

        echo ""
        print_message "✨ Frontend desplegado"
        echo ""
        print_info "🌐 Acceder en: http://localhost:3000"
        echo ""
        ;;

    3)
        print_message "Reconstruyendo imágenes..."
        docker-compose build --no-cache
        docker-compose up -d

        print_message "✨ Imágenes reconstruidas y servicios reiniciados"
        ;;

    4)
        print_info "Mostrando logs (Ctrl+C para salir)..."
        docker-compose logs -f
        ;;

    5)
        print_message "Deteniendo servicios..."
        docker-compose down
        print_message "✨ Servicios detenidos"
        ;;

    6)
        print_warning "⚠️  ADVERTENCIA: Esta acción eliminará:"
        echo "   - Todos los containers"
        echo "   - Todos los volumes (¡SE PERDERÁN LOS DATOS!)"
        echo "   - Todas las imágenes"
        read -p "¿Está seguro? (escriba 'yes' para confirmar): " confirm

        if [ "$confirm" = "yes" ]; then
            print_message "Limpiando..."
            docker-compose down -v
            docker system prune -af --volumes
            print_message "✨ Limpieza completada"
        else
            print_info "Operación cancelada"
        fi
        ;;

    7)
        print_message "Saliendo..."
        exit 0
        ;;

    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_info "💡 Comandos útiles:"
echo "   docker-compose ps              # Ver estado de servicios"
echo "   docker-compose logs -f         # Ver logs en tiempo real"
echo "   docker-compose restart         # Reiniciar servicios"
echo "   docker-compose exec backend sh # Acceder al contenedor backend"
echo ""
