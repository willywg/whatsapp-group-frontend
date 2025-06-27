// Tipos para las conexiones de WhatsApp

export type ConnectionStatus = 
  | 'INITIALIZING'
  | 'QR_GENERATED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'DISCONNECTED_BY_USER'
  | 'ERROR';

export interface Connection {
  id: number;
  name: string;
  whatsapp_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateConnectionRequest {
  name: string;
}

export interface CreateConnectionResponse {
  status: 'QR_GENERATED';
  connectionId: number;
}

export interface ReconnectResponse {
  status: 'RECONNECTION_INITIATED';
}

export interface ConnectionStatusEvent {
  connectionId: number;
  status: ConnectionStatus;
  message?: string;
}

export interface QRCodeEvent {
  connectionId: number;
  qrCode: string; // Base64 encoded QR code
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Configuración de estados para la UI
export interface StatusConfig {
  color: string;
  textColor: string;
  bgColor: string;
  label: string;
}

export const STATUS_CONFIG: Record<ConnectionStatus, StatusConfig> = {
  INITIALIZING: {
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Inicializando'
  },
  QR_GENERATED: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    label: 'QR Generado'
  },
  CONNECTING: {
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Conectando'
  },
  CONNECTED: {
    color: 'bg-whatsapp',
    textColor: 'text-whatsapp',
    bgColor: 'bg-green-50',
    label: 'Conectado'
  },
  DISCONNECTED: {
    color: 'bg-status-disconnected',
    textColor: 'text-status-disconnected',
    bgColor: 'bg-red-50',
    label: 'Desconectado'
  },
  DISCONNECTED_BY_USER: {
    color: 'bg-gray-500',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    label: 'Desconectado por Usuario'
  },
  ERROR: {
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Error'
  }
};

// Tipos para los hooks
export interface UseWhatsAppConnectionReturn {
  isCreating: boolean;
  isReconnecting: boolean;
  currentConnectionId: number | null;
  qrCode: string | null;
  connectionStatus: ConnectionStatus | null;
  error: string | null;
  createConnection: (data: CreateConnectionRequest) => Promise<void>;
  reconnectConnection: (connectionId: number) => Promise<void>;
  clearConnection: () => void;
}

export interface UseConnectionsReturn {
  connections: Connection[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  disconnectConnection: (connectionId: number) => Promise<void>;
}

// Tipos para los componentes
export interface ConnectNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ReconnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: number | null;
  connectionName: string;
}

export interface ConnectionStatsProps {
  total: number;
  connected: number;
  disconnected: number;
  error: number;
  activeInstances: number;
} 