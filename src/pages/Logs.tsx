import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import LogsFilters, { FilterState } from '../components/LogsFilters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Datos de ejemplo para los logs de mensajes
const messageLogs = [
  { 
    id: 101, 
    connection_name: "Línea de Ventas Principal", 
    recipient: "120363041234567890@g.us", 
    content: "Hola, este es un mensaje de prueba para el equipo de desarrollo. Esperamos que todo funcione correctamente y que puedan recibir este mensaje sin problemas.", 
    status: "SENT", 
    sent_at: "2025-06-17 11:30:00" 
  },
  { 
    id: 102, 
    connection_name: "Soporte Técnico", 
    recipient: "51987654321@s.whatsapp.net", 
    content: "Su ticket #5432 ha sido actualizado. Por favor revise el estado en nuestro portal de soporte.", 
    status: "SENT", 
    sent_at: "2025-06-17 10:45:10" 
  },
  { 
    id: 103, 
    connection_name: "Línea de Ventas Principal", 
    recipient: "120363041234567891@g.us", 
    content: "No se pudo entregar el mensaje al destinatario. Error de conexión con el servidor.", 
    status: "FAILED", 
    sent_at: "2025-06-17 09:15:00" 
  },
  { 
    id: 104, 
    connection_name: "Marketing LATAM", 
    recipient: "5491122334455@s.whatsapp.net", 
    content: "¡Nueva promoción disponible! Descuentos especiales hasta el 30% en productos seleccionados.", 
    status: "SENT", 
    sent_at: "2025-06-17 08:20:15" 
  },
  { 
    id: 105, 
    connection_name: "Soporte Técnico", 
    recipient: "120363041234567892@g.us", 
    content: "Mantenimiento programado el próximo viernes de 2:00 AM a 4:00 AM. Disculpe las molestias.", 
    status: "FAILED", 
    sent_at: "2025-06-17 07:30:45" 
  }
];

const Logs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    dateFrom: '',
    dateTo: '',
    origin: '',
    destination: '',
  });
  const itemsPerPage = 10;

  // Filtrar logs según los filtros aplicados
  const filteredLogs = useMemo(() => {
    return messageLogs.filter(log => {
      // Filtro de origen
      if (filters.origin) {
        const searchTerm = filters.origin.toLowerCase();
        if (!log.connection_name.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Filtro de destino
      if (filters.destination) {
        const searchTerm = filters.destination.toLowerCase();
        if (!log.recipient.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Filtro de estado
      if (filters.status.length > 0 && !filters.status.includes(log.status)) {
        return false;
      }

      // Filtro de fecha
      if (filters.dateFrom || filters.dateTo) {
        const logDate = new Date(log.sent_at).toISOString().split('T')[0];
        if (filters.dateFrom && logDate < filters.dateFrom) return false;
        if (filters.dateTo && logDate > filters.dateTo) return false;
      }

      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Resetear página cuando cambien los filtros
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'SENT') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Enviado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Fallido
      </span>
    );
  };

  const truncateText = (text: string, maxLength: number = 50) => {
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

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-whatsapp-text">Historial de Envíos</h1>
        </div>

        {/* Filtros */}
        <LogsFilters onFiltersChange={handleFiltersChange} />

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-whatsapp-text">{filteredLogs.length}</p>
              <p className="text-sm text-whatsapp-secondary">
                {filters.origin || filters.destination || filters.status.length > 0 || filters.dateFrom || filters.dateTo 
                  ? 'Mensajes Filtrados' 
                  : 'Total Mensajes'
                }
              </p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredLogs.filter(log => log.status === 'SENT').length}
              </p>
              <p className="text-sm text-whatsapp-secondary">Enviados</p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredLogs.filter(log => log.status === 'FAILED').length}
              </p>
              <p className="text-sm text-whatsapp-secondary">Fallidos</p>
            </div>
          </div>
          
          <div className="bg-whatsapp-container rounded-lg p-4 shadow-md border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-whatsapp">
                {filteredLogs.length > 0 
                  ? Math.round((filteredLogs.filter(log => log.status === 'SENT').length / filteredLogs.length) * 100)
                  : 0
                }%
              </p>
              <p className="text-sm text-whatsapp-secondary">Tasa de Éxito</p>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-whatsapp-container rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-whatsapp-text">
              Registro de Mensajes
              {filteredLogs.length !== messageLogs.length && (
                <span className="text-sm font-normal text-whatsapp-secondary ml-2">
                  ({filteredLogs.length} de {messageLogs.length})
                </span>
              )}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            {paginatedLogs.length > 0 ? (
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
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whatsapp-secondary uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-whatsapp-text">
                          {log.connection_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whatsapp-secondary font-mono">
                          {truncateText(log.recipient, 25)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-whatsapp-text max-w-xs">
                          {truncateText(log.content, 60)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whatsapp-secondary">
                          {formatDate(log.sent_at)}
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
          {filteredLogs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-whatsapp-secondary">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredLogs.length)} de {filteredLogs.length} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
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
    </Layout>
  );
};

export default Logs;
