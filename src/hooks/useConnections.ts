import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

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
}

export const useConnections = (): UseConnectionsReturn => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<Connection[]>('/connections');
      setConnections(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener conexiones');
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
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
  };
}; 