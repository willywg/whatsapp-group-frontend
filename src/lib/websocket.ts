import { io, Socket } from 'socket.io-client';

export interface ConnectionStatus {
  connectionId: number;
  status: 'INITIALIZING' | 'QR_GENERATED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'DISCONNECTED_BY_USER' | 'ERROR';
  message?: string;
}

export interface QRCodeData {
  connectionId: number;
  qrCode: string; // Base64 encoded QR code
}

class WebSocketService {
  private socket: Socket | null = null;
  private connectionCallbacks: Map<number, (status: ConnectionStatus) => void> = new Map();
  private qrCallbacks: Map<number, (qr: QRCodeData) => void> = new Map();

  connect() {
    // Si ya existe una conexión, no crear otra
    if (this.socket) {
      if (this.socket.connected) {
        console.log('🔌 WebSocket ya está conectado');
        return this.socket;
      } else {
        console.log('🔌 Reconectando WebSocket existente...');
        this.socket.connect();
        return this.socket;
      }
    }

    console.log('🔌 Creando nueva conexión WebSocket...');
    console.log(import.meta.env.VITE_WEBSOCKET_URL);
    const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000';
    this.socket = io(`${websocketUrl}/baileys`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Evento para cambios de estado de conexión
    this.socket.on('connection-status', (data: ConnectionStatus) => {
      console.log('Estado de conexión actualizado:', data);
      const callback = this.connectionCallbacks.get(data.connectionId);
      if (callback) {
        callback(data);
      }
    });

    // Evento para códigos QR
    this.socket.on('qr-code', (data: QRCodeData) => {
      console.log('Código QR recibido:', data);
      const callback = this.qrCallbacks.get(data.connectionId);
      if (callback) {
        callback(data);
      }
    });

    // Eventos de conexión del socket
    this.socket.on('connect', () => {
      console.log('✅ Conectado al WebSocket - ID:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Error de conexión WebSocket:', error);
    });
  }

  // Suscribirse a cambios de estado de una conexión específica
  subscribeToConnectionStatus(connectionId: number, callback: (status: ConnectionStatus) => void) {
    this.connectionCallbacks.set(connectionId, callback);
  }

  // Suscribirse a códigos QR de una conexión específica
  subscribeToQRCode(connectionId: number, callback: (qr: QRCodeData) => void) {
    this.qrCallbacks.set(connectionId, callback);
  }

  // Desuscribirse de una conexión específica
  unsubscribeFromConnection(connectionId: number) {
    this.connectionCallbacks.delete(connectionId);
    this.qrCallbacks.delete(connectionId);
  }

  // Desconectar el socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionCallbacks.clear();
      this.qrCallbacks.clear();
    }
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Instancia singleton del servicio
export const websocketService = new WebSocketService(); 