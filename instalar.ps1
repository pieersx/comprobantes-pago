# INSTALADOR - Comprobantes de Pago
Write-Host "=== INSTALANDO ===" -ForegroundColor Cyan

# Instalar pnpm (mas rapido que npm)
npm install -g pnpm

# Frontend - instalar dependencias
Write-Host "Instalando dependencias del Frontend..." -ForegroundColor Yellow
cd frontend; pnpm install; cd ..

# Scripts de ejecucion (modo desarrollo)
"cd `"$PSScriptRoot\backend`"; mvn spring-boot:run" | Out-File backend.ps1
"cd `"$PSScriptRoot\frontend`"; pnpm dev" | Out-File frontend.ps1

Write-Host "=== LISTO ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para ejecutar:" -ForegroundColor Yellow
Write-Host "  Terminal 1: .\backend.ps1   (API: http://localhost:6969/api/v1)"
Write-Host "  Terminal 2: .\frontend.ps1  (Web: http://localhost:4584)"
