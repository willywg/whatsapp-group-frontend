import { useState } from 'react';
import Layout from '../components/Layout';
import ConnectNumberModal from '../components/ConnectNumberModal';
import GroupsModal from '../components/GroupsModal';
import DisconnectAlert from '../components/DisconnectAlert';
import { Button } from '@/components/ui/button';
import { Plus, Users, Power, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Datos de ejemplo para las conexiones
const connections = [
  { id: 1, name: "Línea de Ventas Principal", whatsapp_id: "51999888777@s.whatsapp.net", status: "CONNECTED" },
  { id: 2, name: "Soporte Técnico", whatsapp_id: "51999111222@s.whatsapp.net", status: "DISCONNECTED" },
  { id: 3, name: "Marketing LATAM", whatsapp_id: "5491122334455@s.whatsapp.net", status: "CONNECTED" }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [disconnectAlertOpen, setDisconnectAlertOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);

  const handleViewGroups = (connection: any) => {
    setSelectedConnection(connection);
    setGroupsModalOpen(true);
  };

  const handleDisconnect = (connection: any) => {
    setSelectedConnection(connection);
    setDisconnectAlertOpen(true);
  };

  const handleConnect = (connection: any) => {
    // Simular reconexión
    toast({
      title: "Reconectando...",
      description: `Iniciando proceso de conexión para ${connection.name}`,
    });
  };

  const confirmDisconnect = () => {
    if (selectedConnection) {
      toast({
        title: "Número desconectado",
        description: `${selectedConnection.name} ha sido desconectado exitosamente`,
      });
      console.log('Desconectando:', selectedConnection.name);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'CONNECTED') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-whatsapp rounded-full"></div>
          <span className="text-sm font-medium text-whatsapp">Conectado</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-status-disconnected rounded-full"></div>
        <span className="text-sm font-medium text-status-disconnected">Desconectado</span>
      </div>
    );
  };

  const getActionButtons = (connection: any) => {
    if (connection.status === 'CONNECTED') {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
            onClick={() => handleViewGroups(connection)}
          >
            Ver Grupos
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-status-disconnected border-status-disconnected hover:bg-status-disconnected hover:text-white"
            onClick={() => handleDisconnect(connection)}
          >
            Desconectar
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
            onClick={() => handleConnect(connection)}
          >
            <Wifi className="w-4 h-4 mr-1" />
            Conectar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            className="opacity-50"
          >
            Ver Grupos
          </Button>
        </>
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-whatsapp-text">Dashboard de Conexiones</h1>
          <Button 
            className="bg-whatsapp hover:bg-whatsapp/90 text-white shadow-md"
            onClick={() => setConnectModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Conectar Nuevo Número
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-whatsapp-container rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-whatsapp-secondary">Total Conexiones</p>
                <p className="text-2xl font-bold text-whatsapp-text">{connections.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-whatsapp-container rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-whatsapp-secondary">Conectadas</p>
                <p className="text-2xl font-bold text-whatsapp-text">
                  {connections.filter(c => c.status === 'CONNECTED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-whatsapp rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-whatsapp-container rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-whatsapp-secondary">Desconectadas</p>
                <p className="text-2xl font-bold text-whatsapp-text">
                  {connections.filter(c => c.status === 'DISCONNECTED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Power className="w-6 h-6 text-status-disconnected" />
              </div>
            </div>
          </div>
        </div>

        {/* Connections Table */}
        <div className="bg-whatsapp-container rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-whatsapp-text">Conexiones Activas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                    ID de WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connections.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-whatsapp-text">
                        {connection.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-whatsapp-secondary font-mono">
                        {connection.whatsapp_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(connection.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {getActionButtons(connection)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <ConnectNumberModal 
          open={connectModalOpen} 
          onOpenChange={setConnectModalOpen} 
        />
        
        <GroupsModal 
          open={groupsModalOpen} 
          onOpenChange={setGroupsModalOpen}
          connectionName={selectedConnection?.name || ''}
        />
        
        <DisconnectAlert 
          open={disconnectAlertOpen} 
          onOpenChange={setDisconnectAlertOpen}
          connectionName={selectedConnection?.name || ''}
          onConfirm={confirmDisconnect}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
