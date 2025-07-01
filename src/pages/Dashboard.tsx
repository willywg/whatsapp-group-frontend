import { useState } from 'react';
import Layout from '../components/Layout';
import ConnectNumberModal from '../components/ConnectNumberModal';
import GroupsModal from '../components/GroupsModal';
import DisconnectAlert from '../components/DisconnectAlert';
import ReconnectModal from '../components/ReconnectModal';
import { Button } from '@/components/ui/button';
import { Plus, Users, Power, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConnectionStats } from '@/hooks/useConnectionStats';
import { useConnections, Connection } from '@/hooks/useConnections';
import { useWhatsAppConnection } from '@/hooks/useWhatsAppConnection';

const Dashboard = () => {
  const { toast } = useToast();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useConnectionStats();
  const { connections, loading: connectionsLoading, error: connectionsError, refetch: refetchConnections, disconnectConnection } = useConnections();
  const { reconnectConnection, isReconnecting } = useWhatsAppConnection({ onConnectionsUpdate: refetchConnections });
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [disconnectAlertOpen, setDisconnectAlertOpen] = useState(false);
  const [reconnectModalOpen, setReconnectModalOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const loading = statsLoading || connectionsLoading;
  const error = statsError || connectionsError;

  const refetch = async () => {
    await Promise.all([refetchStats(), refetchConnections()]);
  };

  const handleViewGroups = (connection: Connection) => {
    setSelectedConnection(connection);
    setGroupsModalOpen(true);
  };

  const handleDisconnect = (connection: Connection) => {
    setSelectedConnection(connection);
    setDisconnectAlertOpen(true);
  };

  const handleConnect = (connection: Connection) => {
    setSelectedConnection(connection);
    setReconnectModalOpen(true);
  };

  const confirmDisconnect = async () => {
    if (selectedConnection) {
      try {
        toast({
          title: "Desconectando...",
          description: `Desconectando ${selectedConnection.name}`,
        });
        
        await disconnectConnection(selectedConnection.id);
        
        toast({
          title: "Número desconectado",
          description: `${selectedConnection.name} ha sido desconectado exitosamente`,
        });
        
        // Actualizar datos después de la acción
        await refetch();
      } catch (error) {
        toast({
          title: "Error al desconectar",
          description: "No se pudo desconectar el número. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: Connection['status']) => {
    const statusConfig = {
      INITIALIZING: {
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: 'Inicializando'
      },
      QR_GENERATED: {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        label: 'QR Generado'
      },
      CONNECTING: {
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: 'Conectando'
      },
      CONNECTED: {
        color: 'bg-whatsapp',
        textColor: 'text-whatsapp',
        bgColor: 'bg-green-50',
        label: 'Conectado'
      },
      DISCONNECTED: {
        color: 'bg-status-disconnected',
        textColor: 'text-status-disconnected',
        bgColor: 'bg-red-50',
        label: 'Desconectado'
      },
      DISCONNECTED_BY_USER: {
        color: 'bg-gray-500',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        label: 'Desconectado por Usuario'
      },
      ERROR: {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        label: 'Error'
      }
    };

    const config = statusConfig[status];
    
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <div className={`w-2 h-2 ${config.color} rounded-full mr-1.5`}></div>
        {config.label}
      </div>
    );
  };

  const getActionButtons = (connection: Connection) => {
    const canViewGroups = connection.status === 'CONNECTED';
    const canConnect = ['DISCONNECTED', 'DISCONNECTED_BY_USER', 'ERROR'].includes(connection.status);
    const canDisconnect = connection.status === 'CONNECTED';
    const isProcessing = ['INITIALIZING', 'QR_GENERATED', 'CONNECTING'].includes(connection.status);

    return (
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`${canViewGroups 
            ? 'text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white' 
            : 'opacity-50 cursor-not-allowed'}`}
          onClick={() => canViewGroups && handleViewGroups(connection)}
          disabled={!canViewGroups}
        >
          <Users className="w-4 h-4 mr-1" />
          Ver Grupos
        </Button>
        
        {canConnect && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
            onClick={() => handleConnect(connection)}
            disabled={isReconnecting}
          >
            {isReconnecting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Reconectando...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-1" />
                Reconectar
              </>
            )}
          </Button>
        )}
        
        {canDisconnect && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-status-disconnected border-status-disconnected hover:bg-status-disconnected hover:text-white"
            onClick={() => handleDisconnect(connection)}
          >
            <Power className="w-4 h-4 mr-1" />
            Desconectar
          </Button>
        )}
        
        {isProcessing && (
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            className="opacity-50"
          >
            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            Procesando...
          </Button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-whatsapp-text">Dashboard de Conexiones</h1>
            {stats && (
              <div className="text-sm text-whatsapp-secondary">
                {stats.activeInstances} instancias activas
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button 
              className="bg-whatsapp hover:bg-whatsapp/90 text-white shadow-md"
              onClick={() => setConnectModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Conectar Nuevo Número
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Error al cargar estadísticas</p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-whatsapp-container rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-whatsapp-secondary">Total Conexiones</p>
                <p className="text-2xl font-bold text-whatsapp-text">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.total || 0
                  )}
                </p>
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
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.connected || 0
                  )}
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
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.disconnected || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Power className="w-6 h-6 text-status-disconnected" />
              </div>
            </div>
          </div>

          <div className="bg-whatsapp-container rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-whatsapp-secondary">Con Error</p>
                <p className="text-2xl font-bold text-whatsapp-text">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.error || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
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
                {connectionsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-whatsapp" />
                        <span className="text-whatsapp-secondary">Cargando conexiones...</span>
                      </div>
                    </td>
                  </tr>
                ) : connections.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="text-whatsapp-secondary">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-lg font-medium">No hay conexiones configuradas</p>
                        <p className="text-sm">Conecta tu primer número de WhatsApp para comenzar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  connections.map((connection) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButtons(connection)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <ConnectNumberModal 
          open={connectModalOpen} 
          onOpenChange={(open) => {
            setConnectModalOpen(open);
            // Si se cierra el modal, actualizar el dashboard
            if (!open) {
              refetch();
            }
          }} 
          onConnectionsUpdate={refetchConnections}
        />
        
        <GroupsModal 
          open={groupsModalOpen} 
          onOpenChange={setGroupsModalOpen}
          connectionName={selectedConnection?.name || ''}
          connectionId={selectedConnection?.id || null}
        />
        
        <DisconnectAlert 
          open={disconnectAlertOpen} 
          onOpenChange={setDisconnectAlertOpen}
          connectionName={selectedConnection?.name || ''}
          onConfirm={confirmDisconnect}
        />
        
        <ReconnectModal 
          open={reconnectModalOpen} 
          onOpenChange={(open) => {
            setReconnectModalOpen(open);
            // Si se cierra el modal, actualizar el dashboard
            if (!open) {
              refetch();
            }
          }}
          connectionId={selectedConnection?.id || null}
          connectionName={selectedConnection?.name || ''}
          onConnectionsUpdate={refetchConnections}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
