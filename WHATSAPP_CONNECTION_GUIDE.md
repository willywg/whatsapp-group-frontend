# Guía de Conexiones WhatsApp

Esta guía explica cómo usar las nuevas funcionalidades de conexión y reconexión de WhatsApp en el frontend.

## Funcionalidades Implementadas

### 1. Crear Nueva Conexión
- **Endpoint**: `POST /api/connections/initiate`
- **Componente**: `ConnectNumberModal`
- **Hook**: `useWhatsAppConnection`

**Flujo de trabajo**:
1. El usuario hace clic en "Conectar Nuevo Número"
2. Se abre el modal `ConnectNumberModal`
3. El usuario ingresa el nombre de la conexión
4. Se llama al endpoint `/api/connections/initiate`
5. Se establece conexión WebSocket para recibir el QR
6. Se muestra el código QR al usuario
7. El usuario escanea el QR con WhatsApp
8. Se actualiza el estado de la conexión en tiempo real
9. **Cuando la conexión es exitosa**: 
   - Se muestra notificación de éxito
   - Se inicia contador regresivo de 3 segundos
   - El modal se cierra automáticamente
   - El dashboard se actualiza automáticamente

### 2. Reconectar Sesión Existente
- **Endpoint**: `POST /api/connections/{id}/reconnect`
- **Componente**: `ReconnectModal`
- **Hook**: `useWhatsAppConnection`

**Flujo de trabajo**:
1. El usuario hace clic en "Reconectar" en una conexión desconectada
2. Se abre el modal `ReconnectModal`
3. Se llama automáticamente al endpoint de reconexión
4. Se establece conexión WebSocket para recibir el QR
5. Se muestra el código QR al usuario
6. El usuario escanea el QR con WhatsApp
7. Se actualiza el estado de la conexión en tiempo real
8. **Cuando la reconexión es exitosa**:
   - Se muestra notificación de éxito
   - Se inicia contador regresivo de 3 segundos
   - El modal se cierra automáticamente
   - El dashboard se actualiza automáticamente

### 3. WebSocket para Tiempo Real
- **URL**: `ws://localhost:3000/baileys`
- **Namespace**: `/baileys`
- **Eventos**:
  - `connection-status`: Cambios de estado de conexión
  - `qr-code`: Códigos QR generados

## Componentes Principales

### `useWhatsAppConnection` Hook
```typescript
const {
  isCreating,
  isReconnecting,
  currentConnectionId,
  qrCode,
  connectionStatus,
  error,
  createConnection,
  reconnectConnection,
  clearConnection,
} = useWhatsAppConnection();
```

### `ConnectNumberModal` Component
Modal para crear nuevas conexiones con:
- Campo de nombre de conexión
- Visualización de QR en tiempo real
- Estados de conexión
- Manejo de errores

### `ReconnectModal` Component
Modal para reconectar sesiones existentes con:
- Inicio automático de reconexión
- Visualización de QR en tiempo real
- Estados de reconexión
- Manejo de errores

### `websocketService` Service
Servicio singleton para manejar conexiones WebSocket:
- Conexión automática
- Suscripción a eventos por conexión
- Manejo de errores de conexión

## Estados de Conexión

1. **INITIALIZING**: Inicializando conexión
2. **QR_GENERATED**: Código QR generado y listo para escanear
3. **CONNECTING**: Conectando con WhatsApp
4. **CONNECTED**: Conexión exitosa
5. **DISCONNECTED**: Desconectado
6. **DISCONNECTED_BY_USER**: Desconectado por el usuario
7. **ERROR**: Error en la conexión

## Ejemplos de Uso

### Crear Nueva Conexión
```typescript
// En un componente
const { createConnection, qrCode, connectionStatus } = useWhatsAppConnection();

const handleCreate = async () => {
  await createConnection({ name: "Mi Línea de Ventas" });
};
```

### Reconectar Sesión
```typescript
// En un componente
const { reconnectConnection, qrCode, connectionStatus } = useWhatsAppConnection();

const handleReconnect = async () => {
  await reconnectConnection(connectionId);
};
```

### Escuchar Estados en Tiempo Real
```typescript
// El hook maneja automáticamente los eventos WebSocket
// Los estados se actualizan automáticamente en:
// - connectionStatus
// - qrCode
// - error
```

## Estructura de Archivos

```
src/
├── components/
│   ├── ConnectNumberModal.tsx    # Modal para nuevas conexiones
│   ├── ReconnectModal.tsx        # Modal para reconexión
│   └── ui/
├── hooks/
│   ├── useWhatsAppConnection.ts  # Hook principal para conexiones
│   └── useConnections.ts         # Hook para listar conexiones
├── lib/
│   ├── api.ts                    # Configuración de API
│   └── websocket.ts              # Servicio WebSocket
└── pages/
    └── Dashboard.tsx             # Dashboard principal
```

## Configuración Requerida

### Dependencias
```json
{
  "socket.io-client": "^4.x.x"
}
```

### Variables de Entorno
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/baileys
```

## Notas Técnicas

1. **WebSocket Singleton**: Se usa un patrón singleton para el WebSocket para evitar múltiples conexiones
2. **Limpieza de Estado**: Los modales limpian automáticamente su estado al cerrarse
3. **Manejo de Errores**: Todos los errores se muestran en la UI con componentes Alert
4. **Estados Reactivos**: Los estados se actualizan automáticamente via WebSocket
5. **Optimización**: Se evitan llamadas innecesarias con useCallback y useEffect
6. **Cierre Automático**: Los modales se cierran automáticamente después de una conexión exitosa
7. **Actualización Automática**: El dashboard se actualiza automáticamente cuando se cierran los modales
8. **Notificaciones**: Se muestran toasts de éxito cuando las conexiones son exitosas
9. **Contador Regresivo**: Se muestra un contador de 3 segundos antes del cierre automático

## Mejoras de UX Implementadas

### Experiencia de Conexión Exitosa
- ✅ **Notificación Toast**: Aparece inmediatamente cuando la conexión es exitosa
- ✅ **Mensaje con Contador**: Se muestra "Cerrando en X..." en el modal
- ✅ **Cierre Automático**: El modal se cierra después de 3 segundos
- ✅ **Actualización Automática**: El dashboard se actualiza sin intervención del usuario
- ✅ **Limpieza de Estado**: Todos los estados se limpian correctamente

### Manejo de Estados
- ✅ **Estados en Tiempo Real**: Actualizaciones instantáneas via WebSocket
- ✅ **Limpieza de Errores**: Los errores se limpian cuando la conexión es exitosa
- ✅ **Persistencia de Datos**: Las conexiones se mantienen actualizadas en la lista

## Solución de Problemas

### WebSocket no conecta
- Verificar que el servidor esté ejecutándose en el puerto correcto
- Revisar la URL del WebSocket en la configuración

### QR no aparece
- Verificar que el endpoint de creación/reconexión responda correctamente
- Revisar los logs del WebSocket en la consola del navegador

### Estados no se actualizan
- Verificar que los eventos WebSocket se estén emitiendo correctamente desde el backend
- Revisar que los IDs de conexión coincidan entre frontend y backend 