# Tacos Bora Bora

Sistema de gestión para taquería con características modernas, seguras y responsive.

## Características

- Menú dinámico con "Haz tu pedido"
- Sistema de pedidos en tiempo real
- Panel de administración para meseros y cocineros
- Gestión de inventario
- Reportes de ventas
- Sistema de autenticación segura (email, Google, Facebook)
- Carrito de compras persistente
- Protección CSRF en formularios
- Validación de entrada segura
- Headers de seguridad HTTP
- Prevención de inyección SQL y XSS
- Rate limiting para protección contra ataques de fuerza bruta

## Tecnologías

### Frontend
- Next.js 13
- TailwindCSS
- React
- TypeScript
- NextAuth.js
- Axios

### Backend
- FastAPI
- MongoDB
- Beanie
- Python-Jose (JWT)
- Motor (MongoDB driver)
- Passlib (hashing)
- Middleware de seguridad personalizado
- Validación de entrada estricta
- Protección CSRF
- Rate limiting
- Headers de seguridad HTTP

## Instalación

### Configuración Automatizada (Recomendada)

El proyecto incluye un script de configuración que automatiza la instalación y configuración:

```bash
# Ejecuta el script de configuración
python setup_dev.py

# Sigue las instrucciones en pantalla
```

### Instalación Manual

#### Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
pip install -r requirements-security.txt

# Configurar variables de entorno
cp .env.example .env
# Editar el archivo .env con tus configuraciones
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev
```

## Variables de Entorno

El archivo `.env.example` contiene todas las variables de entorno necesarias. Copia este archivo a `.env` y configura los valores según tu entorno.

### Variables Críticas (Backend)
```env
# Configuración de la base de datos
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=tacosborabora

# Seguridad
SECRET_KEY=tu_secreto_seguro_aqui
JWT_SECRET=tu_secreto_jwt_aqui
JWT_ALGORITHM=HS256
CSRF_SECRET_KEY=tu_secreto_csrf_aqui

# Configuración de CORS (orígenes permitidos separados por comas)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Configuración de rate limiting
RATE_LIMIT_DEFAULT=1000/day, 100/hour
```

### Generación de Secretos Seguros

Para generar secretos seguros, puedes usar el siguiente comando:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

O usa el script incluido:

```bash
python scripts/generate_env.py
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_id_aqui
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=tu_id_aqui
```

## Estructura del Proyecto

```
tacosborabora/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py      # Configuración de la aplicación
│   │   │   └── security.py   # Utilidades de seguridad
│   │   ├── db/              # Configuración de la base de datos
│   │   ├── middleware/       # Middlewares personalizados
│   │   │   └── security_middleware.py
│   │   ├── models/          # Modelos de datos
│   │   ├── routers/         # Rutas de la API
│   │   │   └── security.py  # Rutas de seguridad (CSRF, etc.)
│   │   ├── schemas/         # Esquemas Pydantic
│   │   └── services/        # Lógica de negocio
├── scripts/
│   ├── check_security.py   # Verificación de seguridad
│   ├── generate_env.py      # Generación de .env seguro
│   └── README.md           # Documentación de scripts
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       │   └── forms/      # Componentes de formularios seguros
│       ├── context/
│       ├── hooks/
│       ├── lib/
│       ├── styles/
│       └── types/
├── .env.example           # Plantilla de variables de entorno
├── requirements.txt       # Dependencias principales
├── requirements-security.txt # Herramientas de seguridad
└── setup_dev.py           # Script de configuración del entorno
```
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── types/
│   ├── package.json
│   └── next.config.js
└── docker-compose.yml
```

## Seguridad

El proyecto implementa múltiples capas de seguridad:

### 1. Protección CSRF
- Tokens CSRF en formularios
- Verificación de origen (SameSite cookies)
- Protección contra ataques de falsificación de solicitudes

### 2. Validación de Entrada
- Validación del lado del cliente y del servidor
- Sanitización de entradas
- Prevención de inyección SQL y XSS

### 3. Headers de Seguridad HTTP
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 4. Autenticación y Autorización
- JWT con tiempo de expiración corto
- Refresh tokens
- Contraseñas con hash seguro (bcrypt)
- Protección contra fuerza bruta

### 5. Monitoreo y Auditoría
- Scripts de verificación de seguridad
- Logging de eventos de seguridad
- Detección de actividades sospechosas

## Verificación de Seguridad

Para verificar la configuración de seguridad del proyecto, ejecuta:

```bash
python scripts/check_security.py
```

Este script verificará:
- Configuración de variables de entorno
- Permisos de archivos sensibles
- Dependencias con vulnerabilidades conocidas
- Configuración de encabezados de seguridad

## Despliegue

El proyecto está configurado para desplegarse con Docker usando docker-compose. Asegúrate de:

1. Configurar correctamente las variables de entorno en producción
2. Habilitar HTTPS
3. Configurar un WAF (Web Application Firewall)
4. Monitorear los logs de seguridad
5. Mantener actualizadas todas las dependencias

## Reporte de Vulnerabilidades

Si descubres alguna vulnerabilidad de seguridad, por favor repórtala de manera responsable a nuestro equipo de seguridad en seguridad@tacosborabora.com. Agradecemos tu ayuda para mantener nuestro sistema seguro.

```bash
docker-compose up --build
```

## Licencia

MIT
