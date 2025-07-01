import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Interfaces para los datos de logs
export interface MessageLog {
  id: number;
  connectionId: number;
  connectionName: string;
  recipient: string;
  messageType: string;
  content: string;
  mediaUrl: string | null;
  status: 'SENT' | 'FAILED' | 'PENDING';
  errorMessage: string | null;
  sentAt: string;
}

export interface MessageStats {
  totalMensajes: number;
  enviados: number;
  fallidos: number;
  pendientes: number;
  tasaExito: number;
}

export interface LogsFilters {
  page: number;
  limit: number;
  connectionId?: number;
  status?: 'SENT' | 'FAILED' | 'PENDING';
  dateFrom?: string;
  dateTo?: string;
  recipient?: string;
}

// Estructura de respuesta corregida según la documentación
export interface LogsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MessageLog[];
  timestamp: string;
  path: string;
  metadata: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface StatsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MessageStats;
  timestamp: string;
  path: string;
}

export interface UseLogsReturn {
  // Datos
  logs: MessageLog[];
  stats: MessageStats | null;
  
  // Estados
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  
  // Paginación
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Funciones
  fetchLogs: (filters?: Partial<LogsFilters>) => Promise<void>;
  fetchStats: (filters?: Partial<Omit<LogsFilters, 'page' | 'limit'>>) => Promise<void>;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const useLogs = (initialFilters: Partial<LogsFilters> = {}): UseLogsReturn => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<Partial<LogsFilters>>(initialFilters);

  // Función para construir query parameters
  const buildQueryParams = (filters: Partial<LogsFilters>): string => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  // Función para obtener logs
  const fetchLogs = useCallback(async (filters: Partial<LogsFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { 
        ...currentFilters, 
        ...filters,
        page: filters.page || currentPage,
        limit: filters.limit || 10
      };
      
      setCurrentFilters(mergedFilters);
      
      const queryParams = buildQueryParams(mergedFilters);
      const response = await api.get<LogsApiResponse>(`/messages/logs?${queryParams}`);
      
      // La API devuelve directamente un array de MessageLog
      const logs = Array.isArray(response.data) ? response.data : [];
      setLogs(logs);
      
      // Para debugging - ver qué estructura devuelve realmente la API
      console.log('API Response:', response);
      
      // Si no hay paginación del servidor, simular con todos los datos disponibles
      // En un escenario real, esto debería venir del servidor
      const itemsPerPage = mergedFilters.limit || 2;
      
      // Si solo recibimos los datos de la página actual, no podemos paginar correctamente
      // Necesitamos que el servidor nos dé el total de registros
      if (logs.length === itemsPerPage) {
        // Probablemente hay más páginas, pero no sabemos cuántas
        setTotalItems(logs.length * 10); // Estimación temporal
        setTotalPages(10); // Estimación temporal
      } else {
        // Si recibimos menos registros que el límite, probablemente es la última página
        setTotalItems(logs.length);
        setTotalPages(1);
      }
      
      setCurrentPage(mergedFilters.page || 1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, currentPage]);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async (filters: Partial<Omit<LogsFilters, 'page' | 'limit'>> = {}) => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const statsFilters = { ...currentFilters, ...filters };
      // Remover page y limit para stats
      const { page, limit, ...cleanFilters } = statsFilters;
      
      const queryParams = buildQueryParams(cleanFilters);
      const response = await api.get<StatsApiResponse>(`/messages/stats?${queryParams}`);
      
      // La API puede devolver directamente los stats o en una estructura anidada
      const stats = response.data.data || response.data;
      // Verificar que los stats tienen la estructura correcta
      if (stats && typeof stats === 'object' && 'totalMensajes' in stats) {
        setStats(stats as MessageStats);
      } else {
        setStats(null);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las estadísticas');
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [currentFilters]);

  // Función para cambiar página
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchLogs({ page });
  }, [fetchLogs]);

  // Función para refrescar todos los datos
  const refetch = useCallback(async () => {
    await Promise.all([
      fetchLogs(),
      fetchStats()
    ]);
  }, [fetchLogs, fetchStats]);

  // Cargar datos inicial
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []); // Solo al montar el componente

  return {
    // Datos
    logs,
    stats,
    
    // Estados
    loading,
    statsLoading,
    error,
    
    // Paginación
    currentPage,
    totalPages,
    totalItems,
    
    // Funciones
    fetchLogs,
    fetchStats,
    setPage,
    refetch,
  };
}; 