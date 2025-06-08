@echo off
setlocal enabledelayedexpansion

:: Cambiar al directorio del proyecto
cd /d "%~dp0frontend"

:: Crear directorio de logs si no existe
if not exist "..\logs" mkdir "..\logs"

:: Instalar dependencias si es necesario
if not exist "node_modules" (
    echo Instalando dependencias de Node.js...
    call npm install
)

:: Iniciar el servidor de desarrollo con registro de salida
echo Iniciando el frontend...
call npm run dev >> "..\logs\frontend-console.log" 2>&1

:: Mantener la ventana abierta si hay un error
if %ERRORLEVEL% NEQ 0 (
    echo Error al iniciar el frontend. Revisa los logs en %~dp0logs\
    pause
)
