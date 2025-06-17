
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  participants: number;
}

interface GroupsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionName: string;
}

const GroupsModal = ({ open, onOpenChange, connectionName }: GroupsModalProps) => {
  const { toast } = useToast();
  
  // Datos de ejemplo
  const [groups] = useState<Group[]>([
    { id: "120363041234567890@g.us", name: "Equipo de Ventas", participants: 15 },
    { id: "120363041234567891@g.us", name: "Soporte Técnico", participants: 8 },
    { id: "120363041234567892@g.us", name: "Marketing Digital", participants: 12 },
    { id: "120363041234567893@g.us", name: "Desarrollo", participants: 6 },
    { id: "120363041234567894@g.us", name: "Gerencia", participants: 4 }
  ]);

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
          <DialogTitle className="text-whatsapp-text flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Grupos de {connectionName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-whatsapp-secondary">
            {groups.length} grupos encontrados
          </div>

          <div className="overflow-y-auto max-h-96 space-y-2">
            {groups.map((group) => (
              <div 
                key={group.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-whatsapp-text">{group.name}</h3>
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
            ))}
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
