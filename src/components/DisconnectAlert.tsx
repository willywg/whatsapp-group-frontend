
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DisconnectAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionName: string;
  onConfirm: () => void;
}

const DisconnectAlert = ({ open, onOpenChange, connectionName, onConfirm }: DisconnectAlertProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desconectar número?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres desconectar "{connectionName}"? 
            Esta acción detendrá el envío de mensajes desde este número y requerirá 
            escanear un nuevo código QR para reconectar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-status-disconnected hover:bg-status-disconnected/90"
          >
            Sí, desconectar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisconnectAlert;
