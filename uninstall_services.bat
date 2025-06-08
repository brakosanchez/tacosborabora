@echo off
setlocal enabledelayedexpansion

echo ====================================
echo Desinstalando servicios de Windows...
echo ====================================
echo.

set NSSM=%SystemRoot%\System32\nssm.exe
set PROJECT_DIR=%~dp0
set PROJECT_DIR=!PROJECT_DIR:~0,-1!

:: Función para detener y eliminar un servicio
:remove_service
echo Procesando servicio: %~1

:: Verificar si el servicio existe
sc query "%~1" >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo Deteniendo el servicio "%~1"...
    net stop "%~1" 2>nul
    
    echo Eliminando el servicio "%~1"...
    %NSSM% remove "%~1" confirm
    if !ERRORLEVEL! NEQ 0 (
        echo Error al eliminar el servicio "%~1".
        echo Intentando forzar la eliminación...
        sc delete "%~1"
    )
    
    echo El servicio "%~1" ha sido eliminado correctamente.
) else (
    echo El servicio "%~1" no existe, omitiendo...
)
echo.
goto :eof

:: Detener y eliminar servicios
call :remove_service "TacosBoraBora-Backend"
call :remove_service "TacosBoraBora-Frontend"

:: Limpiar archivos temporales si es necesario
if exist "%TEMP%\nssm.exe" del /q "%TEMP%\nssm.exe"

echo ====================================
echo Proceso de desinstalación completado!
echo ====================================
echo.
echo Se recomienda reiniciar el sistema para completar la desinstalación.
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
