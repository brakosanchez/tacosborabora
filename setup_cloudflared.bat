@echo off
setlocal enabledelayedexpansion

:: Configuración de rutas
set CLOUDFLARED_PATH=C:\tacosborabora\cloudflare\cloudflare.exe
set CONFIG_DIR=C:\Users\Abraham Sanchez\.cloudflared
set LOGS_DIR=C:\tacosborabora\logs

:: Crear directorio de logs si no existe
if not exist "%LOGS_DIR%" mkdir "%LOGS_DIR%"

:: Detener y eliminar servicio si existe
nssm stop TacosBoraBora-Tunnel >nul 2>&1
nssm remove TacosBoraBora-Tunnel confirm >nul 2>&1

:: Instalar servicio
nssm install TacosBoraBora-Tunnel "%CLOUDFLARED_PATH%" --config="%CONFIG_DIR%\config.yml" tunnel run
nssm set TacosBoraBora-Tunnel AppDirectory "C:\tacosborabora"
nssm set TacosBoraBora-Tunnel DisplayName "Tacos Bora Bora - Cloudflare Tunnel"
nssm set TacosBoraBora-Tunnel AppStdout "%LOGS_DIR%\cloudflared.log"
nssm set TacosBoraBora-Tunnel AppStderr "%LOGS_DIR%\cloudflared-error.log"
nssm set TacosBoraBora-Tunnel Start SERVICE_AUTO_START
nssm set TacosBoraBora-Tunnel AppRestartDelay 5000

:: Iniciar servicio
nssm start TacosBoraBora-Tunnel

echo Servicio configurado correctamente
pause