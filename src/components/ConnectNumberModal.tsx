import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWhatsAppConnection } from '@/hooks/useWhatsAppConnection';

interface ConnectNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectionsUpdate?: () => Promise<void>;
}

const ConnectNumberModal = ({ open, onOpenChange, onConnectionsUpdate }: ConnectNumberModalProps) => {
  const [connectionName, setConnectionName] = useState('');
  const [countdown, setCountdown] = useState(0);
  const {
    isCreating,
    isReconnecting,
    currentConnectionId,
    qrCode,
    connectionStatus,
    error,
    createConnection,
    reconnectConnection,
    clearConnection,
  } = useWhatsAppConnection({ onConnectionsUpdate });

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      clearConnection();
      setConnectionName('');
    }
  }, [open, clearConnection]);

  // Cerrar modal automáticamente cuando la conexión sea exitosa
  useEffect(() => {
    if (connectionStatus === 'CONNECTED' && open) {
      setCountdown(3);
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [connectionStatus, open]);

  const handleCreateConnection = async () => {
    if (!connectionName.trim()) return;
    
    await createConnection({ name: connectionName.trim() });
  };

  const handleReconnect = async () => {
    if (currentConnectionId) {
      await reconnectConnection(currentConnectionId);
    }
  };

  const handleClose = async () => {
    await clearConnection();
    setConnectionName('');
    onOpenChange(false);
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'INITIALIZING':
        return 'Inicializando conexión...';
      case 'QR_GENERATED':
        return 'Código QR generado. Escanea con WhatsApp para conectar.';
      case 'CONNECTING':
        return 'Conectando con WhatsApp...';
      case 'CONNECTED':
        return `¡Conexión exitosa! El número se ha conectado correctamente. ${countdown > 0 ? `Cerrando en ${countdown}...` : ''}`;
      case 'ERROR':
        return 'Error en la conexión. Por favor, inténtalo de nuevo.';
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'INITIALIZING':
      case 'CONNECTING':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'CONNECTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Determinar si se debe mostrar el formulario inicial (nombre + botón crear)
  const showInitialForm = !connectionStatus && !isCreating && !isReconnecting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-text">Conectar Nuevo Número</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Campo de nombre de conexión - solo mostrar antes de crear la conexión */}
          {showInitialForm && (
            <div>
              <label className="block text-sm font-medium text-whatsapp-secondary mb-2">
                Nombre de la conexión
              </label>
              <Input
                placeholder="Ej: Ventas Principal"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Mostrar errores */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mostrar estado de conexión */}
          {connectionStatus && (
            <Alert className={connectionStatus === 'CONNECTED' ? 'border-green-200 bg-green-50' : 
                             connectionStatus === 'ERROR' ? 'border-red-200 bg-red-50' : ''}>
              {getStatusIcon()}
              <AlertDescription className="ml-2">
                {getStatusMessage()}
              </AlertDescription>
            </Alert>
          )}

          {/* Área del código QR */}
          {(connectionStatus === 'QR_GENERATED' || qrCode) && (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <p className="text-sm text-whatsapp-secondary">
                Escanea este código QR con WhatsApp para conectar el número
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isCreating || isReconnecting}
            >
              {connectionStatus === 'CONNECTED' ? 'Cerrar' : 'Cancelar'}
            </Button>
            
            {/* Botón Crear Conexión - solo mostrar antes de iniciar el proceso */}
            {showInitialForm && (
              <Button 
                onClick={handleCreateConnection}
                disabled={!connectionName.trim()}
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-white"
              >
                Crear Conexión
              </Button>
            )}

            {/* Botón Reconectar - solo mostrar cuando hay error */}
            {error && connectionStatus === 'ERROR' && (
              <Button 
                onClick={handleReconnect}
                disabled={isReconnecting}
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-white"
              >
                {isReconnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reconectando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reconectar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectNumberModal;
