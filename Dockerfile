# Multi-stage build para optimizar la imagen final
# Etapa 1: Build
FROM node:22-alpine3.22 AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias primero para mejor caching
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci && npm cache clean --force

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Production
FROM node:22-alpine3.22 AS release

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Instalar serve globalmente para servir los archivos estáticos
RUN npm install -g serve

# Copiar solo los archivos de build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto 3000 (puerto por defecto de serve)
EXPOSE 3000

# Configurar variables de entorno
ENV NODE_ENV=production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar ownership de los archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Usar serve para servir los archivos estáticos
CMD ["serve", "-s", "dist", "-l", "3000"]