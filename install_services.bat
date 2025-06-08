@echo off
setlocal enabledelayedexpansion

echo Configurando servicios de Windows...
echo ====================================
echo.

set PROJECT_DIR=%~dp0
set PROJECT_DIR=!PROJECT_DIR:~0,-1!
set NSSM=%SystemRoot%\System32\nssm.exe

:: Función para verificar si un servicio existe
:check_service_exist
sc query "%~1" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo El servicio "%~1" ya existe. Eliminando...
    %NSSM% remove "%~1" confirm
    if !ERRORLEVEL! NEQ 0 (
        echo Error al eliminar el servicio "%~1".
        echo Por favor, cierra esta ventana e intenta nuevamente como administrador.
        pause
        exit /b 1
    )
    timeout /t 2 /nobreak >nul
)
goto :eof

:: Crear directorio de logs si no existe
if not exist "%PROJECT_DIR%\logs" mkdir "%PROJECT_DIR%\logs"

:: Configurar servicio para el backend
call :check_service_exist "TacosBoraBora-Backend"
echo Creando servicio para el backend...
%NSSM% install "TacosBoraBora-Backend" "%PROJECT_DIR%\start_backend.bat"
if !ERRORLEVEL! NEQ 0 (
    echo Error al crear el servicio del backend.
    pause
    exit /b 1
)

%NSSM% set "TacosBoraBora-Backend" AppDirectory "%PROJECT_DIR%"
%NSSM% set "TacosBoraBora-Backend" DisplayName "Tacos Bora Bora - Backend"
%NSSM% set "TacosBoraBora-Backend" Description "Servicio para la API de Tacos Bora Bora"
%NSSM% set "TacosBoraBora-Backend" Start SERVICE_AUTO_START
%NSSM% set "TacosBoraBora-Backend" AppStdout "%PROJECT_DIR%\logs\backend-service.log"
%NSSM% set "TacosBoraBora-Backend" AppStderr "%PROJECT_DIR%\logs\backend-service-error.log"
%NSSM% set "TacosBoraBora-Backend" AppRestartDelay 5000

:: Configurar servicio para el frontend
call :check_service_exist "TacosBoraBora-Frontend"
echo Creando servicio para el frontend...
%NSSM% install "TacosBoraBora-Frontend" "%PROJECT_DIR%\start_frontend.bat"
if !ERRORLEVEL! NEQ 0 (
    echo Error al crear el servicio del frontend.
    pause
    exit /b 1
)

%NSSM% set "TacosBoraBora-Frontend" AppDirectory "%PROJECT_DIR%"
%NSSM% set "TacosBoraBora-Frontend" DisplayName "Tacos Bora Bora - Frontend"
%NSSM% set "TacosBoraBora-Frontend" Description "Servicio para el frontend de Tacos Bora Bora"
%NSSM% set "TacosBoraBora-Frontend" Start SERVICE_AUTO_START
%NSSM% set "TacosBoraBora-Frontend" AppStdout "%PROJECT_DIR%\logs\frontend-service.log"
%NSSM% set "TacosBoraBora-Frontend" AppStderr "%PROJECT_DIR%\logs\frontend-service-error.log"
%NSSM% set "TacosBoraBora-Frontend" AppRestartDelay 5000

echo.
echo ====================================
echo Servicios configurados correctamente!
echo ====================================
echo.

echo [COMANDOS UTILES]
echo - Iniciar servicios:
    net start TacosBoraBora-Backend
    net start TacosBoraBora-Frontend
echo.
echo - Detener servicios:
    net stop TacosBoraBora-Backend
    net stop TacosBoraBora-Frontend
echo.
echo - Ver estado:
    sc query "TacosBoraBora-Backend"
    sc query "TacosBoraBora-Frontend"
echo.
echo - Ver logs en tiempo real:
    type "%PROJECT_DIR%\logs\backend-service.log"
    type "%PROJECT_DIR%\logs\frontend-service.log"
echo.
echo - Para desinstalar los servicios:
    "%PROJECT_DIR%\uninstall_services.bat"
echo.

timeout /t 10

:: Iniciar los servicios
echo.
echo Iniciando servicios...
net start "TacosBoraBora-Backend"
if !ERRORLEVEL! NEQ 0 (
    echo Error al iniciar el servicio del backend.
    pause
    exit /b 1
)

net start "TacosBoraBora-Frontend"
if !ERRORLEVEL! NEQ 0 (
    echo Error al iniciar el servicio del frontend.
    pause
    exit /b 1
)

echo.
echo ====================================
echo Servicios iniciados correctamente!
echo ====================================
echo.

timeout /t 5

:: Mostrar estado final
echo [ESTADO ACTUAL DE LOS SERVICIOS]
sc query "TacosBoraBora-Backend" | findstr /i "STATE"
sc query "TacosBoraBora-Frontend" | findstr /i "STATE"

echo.
echo La aplicación debería estar disponible en:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
