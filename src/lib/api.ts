// Configuración base para las peticiones API
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api`;
console.log(import.meta.env.VITE_API_BASE_URL);
interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Interfaces para los endpoints de conexiones
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

// Función para obtener el token del localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Función para hacer peticiones autenticadas
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    // Si la respuesta es 401, el token expiró
    if (response.status === 401) {
      // Limpiar localStorage y redirigir al login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
};

// Métodos específicos para diferentes tipos de peticiones
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
    
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};

// Función específica para login (sin token)
export const loginRequest = async (credentials: { identifier: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error en el servidor');
  }

  return await response.json();
};

// Funciones específicas para conexiones
export const connectionApi = {
  // Crear nueva conexión
  create: async (data: CreateConnectionRequest): Promise<ApiResponse<CreateConnectionResponse>> => {
    return api.post<CreateConnectionResponse>('/connections/initiate', data);
  },

  // Reconectar sesión existente
  reconnect: async (connectionId: number): Promise<ApiResponse<ReconnectResponse>> => {
    return api.post<ReconnectResponse>(`/connections/${connectionId}/reconnect`);
  },

  // Obtener todas las conexiones
  getAll: async () => {
    return api.get('/connections');
  },

  // Desconectar una conexión
  disconnect: async (connectionId: number) => {
    return api.post(`/connections/${connectionId}/logout`);
  },

  // Cancelar/eliminar proceso de conexión (cuando se cierra el modal del QR)
  cancelConnection: async (connectionId: number) => {
    return api.delete(`/connections/${connectionId}`);
  },

  // Eliminar conexión permanentemente
  deleteConnection: async (connectionId: number) => {
    return api.delete(`/connections/${connectionId}`);
  }
}; 