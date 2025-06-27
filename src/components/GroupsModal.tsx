
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Users, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGroups } from '@/hooks/useGroups';

interface GroupsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionName: string;
  connectionId: number | null;
}

const GroupsModal = ({ open, onOpenChange, connectionName, connectionId }: GroupsModalProps) => {
  const { toast } = useToast();
  const { groups, loading, error, refetch } = useGroups(connectionId);

  const copyToClipboard = async (groupId: string, groupName: string) => {
    try {
      await navigator.clipboard.writeText(groupId);
      toast({
        title: "ID copiado",
        description: `ID del grupo "${groupName}" copiado al portapapeles`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el ID al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-text flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Grupos de {connectionName}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al cargar grupos</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reintentar
              </Button>
            </div>
          )}

          {!error && (
            <div className="text-sm text-whatsapp-secondary">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cargando grupos...</span>
                </div>
              ) : (
                `${groups.length} grupos encontrados`
              )}
            </div>
          )}

          <div className="overflow-y-auto max-h-96 space-y-2">
            {loading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="ml-4 w-20 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : groups.length === 0 && !error ? (
              <div className="text-center py-8 text-whatsapp-secondary">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No hay grupos disponibles</p>
                <p className="text-sm">Esta conexión no tiene grupos de WhatsApp</p>
              </div>
            ) : (
              groups.map((group) => (
                <div 
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-whatsapp-text">{group.name}</h3>
                        {group.isAdmin && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-whatsapp-secondary">
                        {group.participants} participantes
                      </p>
                      <p className="text-xs text-whatsapp-secondary font-mono mt-1 break-all">
                        {group.id}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(group.id, group.name)}
                      className="ml-4 text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar ID
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupsModal;
