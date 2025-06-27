import { useState, useEffect } from 'react';
import { connectionApi } from '@/lib/api';

export interface Connection {
  id: number;
  name: string;
  whatsapp_id: string;
  status: 'INITIALIZING' | 'QR_GENERATED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'DISCONNECTED_BY_USER' | 'ERROR';
  created_at: string;
  updated_at: string;
}

interface UseConnectionsReturn {
  connections: Connection[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  disconnectConnection: (connectionId: number) => Promise<void>;
}

export const useConnections = (): UseConnectionsReturn => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await connectionApi.getAll();
      setConnections(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener conexiones');
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectConnection = async (connectionId: number) => {
    try {
      await connectionApi.disconnect(connectionId);
      // Actualizar la lista después de desconectar
      await fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desconectar');
      console.error('Error disconnecting connection:', err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    loading,
    error,
    refetch: fetchConnections,
    disconnectConnection,
  };
}; 