# INSTALADOR - Comprobantes de Pago
Write-Host "=== INSTALANDO ===" -ForegroundColor Cyan

# Instalar pnpm (mas rapido que npm)
npm install -g pnpm

# Backend
cd backend; mvn clean package -DskipTests -q; cd ..

# Frontend
cd frontend; pnpm install; pnpm build; cd ..

# Scripts
"cd backend; java -jar target/comprobantes-pago-1.0.0.jar" | Out-File backend.ps1
"cd frontend; pnpm start" | Out-File frontend.ps1

Write-Host "=== LISTO ===" -ForegroundColor Green
Write-Host "Ejecutar: .\backend.ps1 y .\frontend.ps1"
Write-Host "Web: http://localhost:4584 | API: http://localhost:6969/api/v1"
