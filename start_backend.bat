@echo off
setlocal

cd /d %~dp0

REM Verificar si Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Python no está instalado o no está en el PATH.
    exit /b 1
)

REM Verificar si el entorno virtual existe
if not exist "backend\venv\Scripts\activate" (
    echo Creando entorno virtual...
    python -m venv backend\venv
    if %ERRORLEVEL% neq 0 (
        echo Error al crear el entorno virtual.
        exit /b 1
    )
)

REM Activar el entorno virtual e instalar dependencias
call backend\venv\Scripts\activate.bat
pip install -r backend/requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Error al instalar las dependencias.
    exit /b 1
)

REM Crear archivo .env si no existe
if not exist "backend\.env" (
    echo Creando archivo .env...
    echo MONGODB_URI=mongodb://localhost:27017> backend\.env
    echo MONGODB_DB=tacosborabora>> backend\.env
    echo JWT_SECRET=tu_clave_secreta_aqui>> backend\.env
)

echo.
echo ===========================================
echo  Iniciando el backend de Tacos Bora Bora...
echo ===========================================
echo.

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
