import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Group {
  id: string;
  name: string;
  participants: number;
  isAdmin: boolean;
}

interface UseGroupsReturn {
  groups: Group[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGroups = (connectionId: number | null): UseGroupsReturn => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    if (!connectionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<Group[]>(`/connections/${connectionId}/groups`);
      setGroups(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener grupos');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connectionId) {
      fetchGroups();
    } else {
      setGroups([]);
      setError(null);
    }
  }, [connectionId]);

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
  };
}; 