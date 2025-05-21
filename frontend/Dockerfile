FROM node:20-slim

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Instalar servidor de producción
RUN npm install -g serve

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
