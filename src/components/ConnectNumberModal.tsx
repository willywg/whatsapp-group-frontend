
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, RefreshCw } from 'lucide-react';

interface ConnectNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConnectNumberModal = ({ open, onOpenChange }: ConnectNumberModalProps) => {
  const [connectionName, setConnectionName] = useState('');
  const [qrCode, setQrCode] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='); // Placeholder QR
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQR = () => {
    setIsGenerating(true);
    // Simular generación de QR
    setTimeout(() => {
      setQrCode(`data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="60" y="20" width="20" height="20" fill="black"/>
          <rect x="100" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <rect x="20" y="60" width="20" height="20" fill="black"/>
          <rect x="100" y="60" width="20" height="20" fill="black"/>
          <rect x="180" y="60" width="20" height="20" fill="black"/>
          <rect x="20" y="100" width="20" height="20" fill="black"/>
          <rect x="60" y="100" width="20" height="20" fill="black"/>
          <rect x="140" y="100" width="20" height="20" fill="black"/>
          <rect x="20" y="140" width="20" height="20" fill="black"/>
          <rect x="100" y="140" width="20" height="20" fill="black"/>
          <rect x="180" y="140" width="20" height="20" fill="black"/>
          <text x="100" y="190" text-anchor="middle" font-size="12" fill="gray">QR Code</text>
        </svg>
      `)}`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleConnect = () => {
    if (!connectionName.trim()) return;
    
    // Aquí se haría la petición al backend
    console.log('Conectando:', connectionName);
    onOpenChange(false);
    setConnectionName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-text">Conectar Nuevo Número</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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

            <Button 
              onClick={generateQR}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generando QR...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Generar Código QR
                </>
              )}
            </Button>

            <p className="text-sm text-whatsapp-secondary">
              Escanea este código QR con WhatsApp para conectar el número
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={!connectionName.trim()}
              className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-white"
            >
              Conectar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectNumberModal;
