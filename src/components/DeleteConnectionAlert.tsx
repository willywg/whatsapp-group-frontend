import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteConnectionAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionName: string;
  onConfirm: () => void;
}

const DeleteConnectionAlert: React.FC<DeleteConnectionAlertProps> = ({
  open,
  onOpenChange,
  connectionName,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <AlertDialogTitle className="text-red-600">
              Eliminar Conexión
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            ¿Estás seguro de que quieres eliminar la conexión{' '}
            <span className="font-semibold text-whatsapp-text">"{connectionName}"</span>?
            <br />
            <br />
            <span className="text-red-600 font-medium">
              Esta acción no se puede deshacer.
            </span>{' '}
            Se eliminará permanentemente la conexión y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Conexión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConnectionAlert; 