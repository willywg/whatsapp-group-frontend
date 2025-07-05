import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import LogsFilters from '../components/LogsFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Loader2, Eye } from 'lucide-react';
import { useLogs, LogsFilters as LogsFiltersType } from '@/hooks/useLogs';
import { useToast } from '@/hooks/use-toast';

const Logs = () => {
  const { toast } = useToast();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const {
    logs,
    stats,
    loading,
    statsLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchLogs,
    fetchStats,
    setPage,
    refetch,
  } = useLogs();

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Función para manejar cambios en filtros
  const handleFiltersChange = (filters: Partial<LogsFiltersType>) => {
    fetchLogs({ ...filters, page: 1 }); // Resetear a página 1 cuando cambien filtros
    fetchStats(filters);
  };

  // Función para refrescar datos
  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Datos actualizados",
      description: "Los logs y estadísticas han sido actualizados",
    });
  };

  // Función para abrir modal de imagen
  const handleImageClick = (mediaUrl: string) => {
    setSelectedImageUrl(mediaUrl);
    setImageLoadError(false);
    setImageModalOpen(true);
  };

  // Función para cerrar modal de imagen
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImageUrl(null);
    setImageLoadError(false);
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    setImageLoadError(true);
  };

  // Función para verificar si el tipo de mensaje es una imagen
  const isImageType = (messageType: string) => {
    const imageTypes = ['image', 'imagen', 'photo', 'foto', 'picture'];
    return imageTypes.includes(messageType.toLowerCase());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enviado
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Fallido
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRecipient = (recipient: string) => {
    // Formatear número de WhatsApp para mostrar más amigable
    if (recipient.includes('@g.us')) {
      // Extraer el ID del grupo
      const groupId = recipient.replace('@g.us', '');
      return `Grupo: ${groupId}`;
    }
    if (recipient.includes('@s.whatsapp.net')) {
      return recipient.replace('@s.whatsapp.net', '');
    }
    return recipient;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-whatsapp-text">Historial de Envíos</h1>
          <Button
            onClick={handleRefresh}
            disabled={loading || statsLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading || statsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <LogsFilters onFiltersChange={handleFiltersChange} loading={loading} />

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-whatsapp-secondary" />
              ) : (
                <p className="text-2xl font-bold text-whatsapp-text">
                  {stats?.totalMensajes || 0}
                </p>
              )}
              <p className="text-sm text-whatsapp-secondary">Total Mensajes</p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-whatsapp-secondary" />
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {stats?.enviados || 0}
                </p>
              )}
              <p className="text-sm text-whatsapp-secondary">Enviados</p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-whatsapp-secondary" />
              ) : (
                <p className="text-2xl font-bold text-red-600">
                  {stats?.fallidos || 0}
                </p>
              )}
              <p className="text-sm text-whatsapp-secondary">Fallidos</p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-whatsapp-secondary" />
              ) : (
                <p className="text-2xl font-bold text-whatsapp">
                  {stats?.tasaExito || 0}%
                </p>
              )}
              <p className="text-sm text-whatsapp-secondary">Tasa de Éxito</p>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-whatsapp-container rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-whatsapp-text">
              Registro de Mensajes
              {totalItems > 0 && (
                <span className="text-sm font-normal text-whatsapp-secondary ml-2">
                  ({totalItems} total{totalItems > 1 ? 'es' : ''})
                </span>
              )}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-whatsapp-secondary" />
                <p className="text-whatsapp-secondary">Cargando mensajes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600 mb-2">Error al cargar los datos</p>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Reintentar
                </Button>
              </div>
            ) : logs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Mensaje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-whatsapp-text">
                          {truncateText(log.connectionName, 20)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whatsapp-secondary font-mono">
                          {log.recipient.includes('@g.us') ? (
                            // Para grupos, mostrar el ID completo con @g.us
                            <div>
                              <div className="break-all">{log.recipient}</div>
                            </div>
                          ) : (
                            // Para individuos, formatear normalmente
                            log.recipient
                          )}
                        </div>

                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-whatsapp-text max-w-xs">
                          {log.content ? truncateText(log.content, 60) : (
                            <span className="text-whatsapp-secondary italic">
                              {log.messageType === 'text' ? 'Sin contenido' : 'Archivo multimedia'}
                            </span>
                          )}
                        </div>
                        {log.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">
                            Error: {truncateText(log.errorMessage, 40)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whatsapp-secondary capitalize">
                          {isImageType(log.messageType) && log.mediaUrl ? (
                            <div 
                              className="flex items-center cursor-pointer hover:text-whatsapp transition-colors"
                              onClick={() => handleImageClick(log.mediaUrl!)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{log.messageType}</span>
                            </div>
                          ) : (
                            <span>{log.messageType}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whatsapp-secondary">
                          {formatDate(log.sentAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-whatsapp-secondary">No se encontraron mensajes con los filtros aplicados</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-whatsapp-secondary">
                  Mostrando {((currentPage - 1) * 2) + 1} a {Math.min(currentPage * 2, totalItems)} de {totalItems} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  
                  <span className="px-3 py-1 text-sm text-whatsapp-secondary">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                    className="border-gray-300"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

              {/* Image Modal */}
        <Dialog open={imageModalOpen} onOpenChange={handleCloseImageModal}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] max-w-full p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-whatsapp-text">Vista de Imagen</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-6 pt-2">
              {selectedImageUrl && (
                <>
                  {imageLoadError ? (
                    <div className="text-red-500 text-center p-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Error al cargar la imagen</p>
                      <p className="text-sm text-gray-500 mt-2">
                        La imagen no se pudo cargar correctamente
                      </p>
                    </div>
                  ) : (
                    <img 
                      src={selectedImageUrl} 
                      alt="Imagen del mensaje" 
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                      onError={handleImageError}
                    />
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
    </Layout>
  );
};

export default Logs;
