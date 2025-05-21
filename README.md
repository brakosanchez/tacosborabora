# Tacos Bora Bora

Sistema de gestión para taquería con características modernas y responsive.

## Características

- Menú dinámico con "Haz tu pedido"
- Sistema de pedidos en tiempo real
- Panel de administración para meseros y cocineros
- Gestión de inventario
- Reportes de ventas
- Sistema de autenticación (email, Google, Facebook)
- Carrito de compras persistente

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

## Instalación

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configurar variables de entorno
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev
```

## Variables de Entorno

### Backend
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=tacosborabora
JWT_SECRET=tu_secreto_aqui
JWT_ALGORITHM=HS256
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
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
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

## Despliegue

El proyecto está configurado para desplegarse con Docker usando docker-compose.

```bash
docker-compose up --build
```

## Licencia

MIT
