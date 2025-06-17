# WhatsApp Groups Frontend

Panel de control para gestionar conexiones de WhatsApp y monitorear el envío de mensajes grupales.

## 🚀 Descripción del Proyecto

Este frontend es una aplicación web desarrollada en React que permite:

- **Gestionar múltiples conexiones de WhatsApp**: Conectar y desconectar números de teléfono
- **Monitorear grupos**: Ver los grupos asociados a cada conexión
- **Historial de mensajes**: Consultar logs detallados de todos los mensajes enviados
- **Interfaz en tiempo real**: Conexión vía WebSocket para actualizaciones instantáneas

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Gestión de Estado**: React Hooks
- **Comunicación**: Axios + WebSocket
- **Enrutamiento**: React Router

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/willywg/whatsapp-group-frontend.git

# 2. Navegar al directorio del proyecto
cd whatsapp-group-frontend

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── Layout.tsx      # Layout principal
│   ├── Sidebar.tsx     # Barra lateral de navegación
│   ├── ConnectNumberModal.tsx  # Modal para conectar números
│   ├── GroupsModal.tsx         # Modal para ver grupos
│   └── DisconnectAlert.tsx     # Alerta de desconexión
├── pages/              # Páginas principales
│   ├── Dashboard.tsx   # Panel principal de conexiones
│   ├── Logs.tsx       # Historial de mensajes
│   └── Index.tsx      # Página de inicio
├── hooks/             # Custom hooks
├── lib/               # Utilidades y configuraciones
└── main.tsx          # Punto de entrada de la aplicación
```

## 🎯 Funcionalidades Principales

### Dashboard de Conexiones (`/`)
- Lista de todas las conexiones de WhatsApp activas
- Estados en tiempo real (conectado/desconectado)
- Botón para conectar nuevos números
- Acciones para ver grupos y desconectar

### Modal de Conexión QR
- Generación de códigos QR en tiempo real
- Conexión vía WebSocket con el backend
- Estados de conexión actualizados automáticamente

### Vista de Logs (`/logs`)
- Historial completo de mensajes enviados
- Filtros por conexión y fecha
- Paginación de resultados
- Información detallada: origen, destino, mensaje, estado

### Modal de Grupos
- Lista de grupos de WhatsApp por conexión
- Información actualizada de cada grupo

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Vista previa del build

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos de TypeScript
```

## 🌐 API Backend

Este frontend se conecta con una API backend que maneja:

- **Conexiones**: `/api/connections`
- **Logs**: `/api/logs`
- **Grupos**: `/api/connections/:id/groups`
- **WebSocket**: Para actualizaciones en tiempo real

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

Los archivos de producción se generan en la carpeta `dist/`.

### Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request
