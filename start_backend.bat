@echo off
setlocal enabledelayedexpansion

:: Establecer variables de entorno
set PYTHONUNBUFFERED=1
set PYTHONPATH=%~dp0backend
set PATH=%~dp0backend\venv\Scripts;%PATH%
set VIRTUAL_ENV=%~dp0backend\venv

:: Cambiar al directorio del proyecto
cd /d "%~dp0backend"

:: Crear directorio de logs si no existe
if not exist "..\logs" mkdir "..\logs"

:: Iniciar el servidor con salida a consola
echo Iniciando el backend...
call venv\Scripts\activate.bat
python start_server.py

:: Si hay un error, mostrar mensaje
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error al iniciar el backend.
    echo Revisa el archivo de logs en: %~dp0logs\backend-console.log
    pause
)