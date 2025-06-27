import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ConnectionStats {
  total: number;
  connected: number;
  disconnected: number;
  error: number;
  activeInstances: number;
}

interface UseConnectionStatsReturn {
  stats: ConnectionStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useConnectionStats = (): UseConnectionStatsReturn => {
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<ConnectionStats>('/connections/stats/overview');
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
      console.error('Error fetching connection stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}; 