@echo off
setlocal

cd /d %~dp0

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js no está instalado o no está en el PATH.
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: npm no está instalado o no está en el PATH.
    exit /b 1
)

REM Instalar dependencias
echo Instalando dependencias del frontend...
cd frontend
npm install
if %ERRORLEVEL% neq 0 (
    echo Error al instalar las dependencias.
    exit /b 1
)

echo.
echo ===========================================
echo  Iniciando el frontend de Tacos Bora Bora...
echo ===========================================
echo.

echo URL: http://localhost:3000
echo.

npm run dev

pause
