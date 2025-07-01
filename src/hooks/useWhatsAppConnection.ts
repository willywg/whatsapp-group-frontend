import { useState, useEffect, useCallback } from 'react';
import { connectionApi, CreateConnectionRequest } from '@/lib/api';
import { websocketService, ConnectionStatus, QRCodeData } from '@/lib/websocket';
import { useToast } from './use-toast';

interface UseWhatsAppConnectionReturn {
  // Estados
  isCreating: boolean;
  isReconnecting: boolean;
  currentConnectionId: number | null;
  qrCode: string | null;
  connectionStatus: ConnectionStatus['status'] | null;
  error: string | null;
  
  // Funciones
  createConnection: (data: CreateConnectionRequest) => Promise<void>;
  reconnectConnection: (connectionId: number) => Promise<void>;
  clearConnection: () => void;
}

interface UseWhatsAppConnectionProps {
  onConnectionsUpdate?: () => Promise<void>;
}

export const useWhatsAppConnection = ({ onConnectionsUpdate }: UseWhatsAppConnectionProps = {}): UseWhatsAppConnectionReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [currentConnectionId, setCurrentConnectionId] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus['status'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Limpiar suscripciones al desmontar o cambiar connectionId
  useEffect(() => {
    return () => {
      if (currentConnectionId) {
        websocketService.unsubscribeFromConnection(currentConnectionId);
      }
    };
  }, [currentConnectionId]);

  // Función para crear una nueva conexión
  const createConnection = useCallback(async (data: CreateConnectionRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      setQrCode(null);
      setConnectionStatus(null);

      // Llamar al endpoint para crear la conexión
      const response = await connectionApi.create(data);
      
      if (response.success) {
        const connectionId = response.data.connectionId;
        setCurrentConnectionId(connectionId);
        setConnectionStatus(response.data.status);

        // Suscribirse a los eventos del WebSocket para esta conexión
        websocketService.subscribeToConnectionStatus(connectionId, (status: ConnectionStatus) => {
          setConnectionStatus(status.status);
          if (status.status === 'ERROR') {
            setError(status.message || 'Error en la conexión');
          }
          if (status.status === 'CONNECTED') {
            // Actualizar la lista de conexiones cuando se conecte
            onConnectionsUpdate?.();
            setError(null); // Limpiar cualquier error previo
            
            // Mostrar notificación de éxito
            toast({
              title: "¡Conexión exitosa!",
              description: "El número de WhatsApp se ha conectado correctamente.",
            });
          }
        });

        websocketService.subscribeToQRCode(connectionId, (qrData: QRCodeData) => {
          setQrCode(qrData.qrCode);
        });

      } else {
        setError(response.message || 'Error al crear la conexión');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsCreating(false);
    }
  }, [onConnectionsUpdate, toast]);

  // Función para reconectar una conexión existente
  const reconnectConnection = useCallback(async (connectionId: number) => {
    try {
      setIsReconnecting(true);
      setError(null);
      setQrCode(null);
      setConnectionStatus(null);

      // Llamar al endpoint para reconectar
      const response = await connectionApi.reconnect(connectionId);
      
      if (response.success) {
        setCurrentConnectionId(connectionId);
        setConnectionStatus(response.data.status);

        // Suscribirse a los eventos del WebSocket para esta conexión
        websocketService.subscribeToConnectionStatus(connectionId, (status: ConnectionStatus) => {
          setConnectionStatus(status.status);
          if (status.status === 'ERROR') {
            setError(status.message || 'Error en la reconexión');
          }
          if (status.status === 'CONNECTED') {
            // Actualizar la lista de conexiones cuando se conecte
            onConnectionsUpdate?.();
            setError(null); // Limpiar cualquier error previo
            
            // Mostrar notificación de éxito
            toast({
              title: "¡Reconexión exitosa!",
              description: "El número de WhatsApp se ha reconectado correctamente.",
            });
          }
        });

        websocketService.subscribeToQRCode(connectionId, (qrData: QRCodeData) => {
          setQrCode(qrData.qrCode);
        });

      } else {
        setError(response.message || 'Error al reconectar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsReconnecting(false);
    }
  }, [onConnectionsUpdate, toast]);

  // Función para limpiar el estado actual
  const clearConnection = useCallback(async () => {
    // Si hay una conexión en proceso (no completada), cancelarla en el servidor
    if (currentConnectionId && connectionStatus && connectionStatus !== 'CONNECTED') {
      try {
        await connectionApi.cancelConnection(currentConnectionId);
        console.log(`Conexión ${currentConnectionId} cancelada exitosamente`);
      } catch (error) {
        console.error('Error al cancelar la conexión:', error);
        // No mostramos error al usuario ya que es un proceso de limpieza
      }
    }

    // Limpiar suscripciones WebSocket
    if (currentConnectionId) {
      websocketService.unsubscribeFromConnection(currentConnectionId);
    }

    // Limpiar estado local
    setCurrentConnectionId(null);
    setQrCode(null);
    setConnectionStatus(null);
    setError(null);
    setIsCreating(false);
    setIsReconnecting(false);
  }, [currentConnectionId, connectionStatus]);

  return {
    isCreating,
    isReconnecting,
    currentConnectionId,
    qrCode,
    connectionStatus,
    error,
    createConnection,
    reconnectConnection,
    clearConnection,
  };
}; 