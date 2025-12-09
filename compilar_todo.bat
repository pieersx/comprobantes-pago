@echo off
REM ===================================================
REM Script para compilar Backend y Frontend
REM y abrir navegador en Google
REM ===================================================

setlocal enabledelayedexpansion

echo.
echo ===================================================
echo Iniciando compilacion de Backend y Frontend
echo ===================================================
echo.

REM Compilar Backend (sin ejecutar tests)
echo [1/3] Compilando Backend...
cd backend
call mvnw clean install -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Error al compilar el Backend
    pause
    exit /b 1
)
cd ..

REM Instalar dependencias Frontend
echo.
echo [2/3] Instalando dependencias del Frontend...
cd frontend
call pnpm install
if %ERRORLEVEL% neq 0 (
    echo Error al instalar dependencias del Frontend
    pause
    exit /b 1
)

REM Compilar Frontend
echo.
echo [3/3] Compilando Frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error al compilar el Frontend
    pause
    exit /b 1
)
cd ..

echo.
echo ===================================================
echo Compilacion completada exitosamente
echo ===================================================
echo.

REM Abrir Google en el navegador por defecto
echo Abriendo Google en el navegador...
timeout /t 3 /nobreak
start https://www.google.com

REM Iniciar servidor de desarrollo del Frontend
echo.
echo Iniciando servidor de desarrollo del Frontend...
echo Accede a: http://localhost:4584
echo Backend disponible en: http://localhost:6969
cd frontend
call pnpm run dev

pause
