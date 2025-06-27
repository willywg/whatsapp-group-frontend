import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useWhatsAppConnection } from '@/hooks/useWhatsAppConnection';

interface ReconnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: number | null;
  connectionName: string;
}

const ReconnectModal = ({ open, onOpenChange, connectionId, connectionName }: ReconnectModalProps) => {
  const [countdown, setCountdown] = useState(0);
  const {
    isReconnecting,
    qrCode,
    connectionStatus,
    error,
    reconnectConnection,
    clearConnection,
  } = useWhatsAppConnection();

  // Iniciar reconexión cuando se abre el modal
  useEffect(() => {
    if (open && connectionId && !isReconnecting && !connectionStatus) {
      reconnectConnection(connectionId);
    }
  }, [open, connectionId, isReconnecting, connectionStatus, reconnectConnection]);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      clearConnection();
    }
  }, [open, clearConnection]);

  // Cerrar modal automáticamente cuando la reconexión sea exitosa
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

  const handleClose = () => {
    clearConnection();
    onOpenChange(false);
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'INITIALIZING':
        return 'Inicializando reconexión...';
      case 'QR_GENERATED':
        return 'Código QR generado. Escanea con WhatsApp para reconectar.';
      case 'CONNECTING':
        return 'Conectando con WhatsApp...';
      case 'CONNECTED':
        return `¡Reconexión exitosa! El número se ha conectado correctamente. ${countdown > 0 ? `Cerrando en ${countdown}...` : ''}`;
      case 'ERROR':
        return 'Error en la reconexión. Por favor, inténtalo de nuevo.';
      default:
        return 'Iniciando proceso de reconexión...';
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
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-text flex items-center justify-between">
            <span>Reconectar {connectionName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Mostrar errores */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mostrar estado de reconexión */}
          <Alert className={connectionStatus === 'CONNECTED' ? 'border-green-200 bg-green-50' : 
                           connectionStatus === 'ERROR' ? 'border-red-200 bg-red-50' : ''}>
            {getStatusIcon()}
            <AlertDescription className="ml-2">
              {getStatusMessage()}
            </AlertDescription>
          </Alert>

          {/* Área del código QR */}
          {(connectionStatus === 'QR_GENERATED' || qrCode) && (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code para reconexión" 
                    className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <p className="text-sm text-whatsapp-secondary">
                Escanea este código QR con WhatsApp para reconectar el número
              </p>
            </div>
          )}

          {/* Estado de carga inicial */}
          {isReconnecting && !connectionStatus && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-whatsapp" />
              <p className="text-whatsapp-secondary">Iniciando proceso de reconexión...</p>
            </div>
          )}

          {/* Botón de cerrar */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleClose}
              className={connectionStatus === 'CONNECTED' 
                ? "bg-whatsapp hover:bg-whatsapp/90 text-white" 
                : ""}
              variant={connectionStatus === 'CONNECTED' ? "default" : "outline"}
            >
              {connectionStatus === 'CONNECTED' ? 'Completado' : 'Cerrar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReconnectModal; 