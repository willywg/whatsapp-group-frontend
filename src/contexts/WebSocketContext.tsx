import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { websocketService } from '@/lib/websocket';

interface WebSocketContextType {
  // En el futuro podríamos agregar más funcionalidades aquí
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  useEffect(() => {
    // Conectar WebSocket una sola vez cuando se monta el provider
    console.log('🔌 Conectando WebSocket...');
    const socket = websocketService.connect();
    
    return () => {
      // Desconectar cuando se desmonta
      console.log('🔌 Desconectando WebSocket...');
      websocketService.disconnect();
    };
  }, []);

  const contextValue: WebSocketContextType = {
    isConnected: websocketService.isConnected(),
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket debe ser usado dentro de un WebSocketProvider');
  }
  return context;
}; 