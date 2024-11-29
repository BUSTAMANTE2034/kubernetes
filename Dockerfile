# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia todos los archivos de tu proyecto al contenedor
COPY . /app

# Instala http-server para servir los archivos estáticos
RUN npm install -g http-server

# Expone el puerto 8080 (puedes ajustar si prefieres otro puerto)
EXPOSE 8080

# Comando para iniciar el servidor y servir los archivos
CMD ["http-server", ".", "-p", "8080"]
