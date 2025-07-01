import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Filter } from 'lucide-react';
import { LogsFilters as LogsFiltersType } from '@/hooks/useLogs';
import { useConnections } from '@/hooks/useConnections';

interface LogsFiltersProps {
  onFiltersChange: (filters: Partial<LogsFiltersType>) => void;
  loading?: boolean;
}

export interface FilterState {
  connectionId?: number;
  status?: 'SENT' | 'FAILED' | 'PENDING';
  dateFrom: string;
  dateTo: string;
  recipient: string;
}

const LogsFilters = ({ onFiltersChange, loading = false }: LogsFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    connectionId: undefined,
    status: undefined,
    dateFrom: '',
    dateTo: '',
    recipient: '',
  });

  // Obtener conexiones para el selector
  const { connections } = useConnections();

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Convertir FilterState a LogsFiltersType para el hook
    const logsFilters: Partial<LogsFiltersType> = {
      connectionId: updated.connectionId,
      status: updated.status,
      dateFrom: updated.dateFrom || undefined,
      dateTo: updated.dateTo || undefined,
      recipient: updated.recipient || undefined,
    };
    
    onFiltersChange(logsFilters);
  };

  const clearAllFilters = () => {
    const cleared: FilterState = { 
      connectionId: undefined,
      status: undefined,
      dateFrom: '', 
      dateTo: '', 
      recipient: '' 
    };
    setFilters(cleared);
    onFiltersChange({});
  };

  const activeFiltersCount = 
    (filters.connectionId ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.recipient ? 1 : 0) + 
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-whatsapp-secondary" />
        <h3 className="text-sm font-medium text-whatsapp-text">Filtros de Búsqueda</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filtros en línea */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Conexión */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Conexión Específica
          </label>
          <Select
            value={filters.connectionId?.toString() || 'all'}
            onValueChange={(value) => updateFilters({ 
              connectionId: value === 'all' ? undefined : parseInt(value) 
            })}
            disabled={loading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas las conexiones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las conexiones</SelectItem>
              {connections.map((connection) => (
                <SelectItem key={connection.id} value={connection.id.toString()}>
                  {connection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-whatsapp-secondary mt-1">Filtro por conexión exacta</p>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Estado
          </label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => updateFilters({ 
              status: value === 'all' ? undefined : value as 'SENT' | 'FAILED' | 'PENDING'
            })}
            disabled={loading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="SENT">Enviado</SelectItem>
              <SelectItem value="FAILED">Fallido</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destinatario */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Destinatario
          </label>
          <Input
            placeholder="Número o ID de grupo..."
            value={filters.recipient}
            onChange={(e) => updateFilters({ recipient: e.target.value })}
            className="h-9"
            disabled={loading}
          />
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Desde
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilters({ dateFrom: e.target.value })}
            className="h-9"
            disabled={loading}
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Hasta
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilters({ dateTo: e.target.value })}
            className="h-9"
            disabled={loading}
          />
        </div>
      </div>

      {/* Filtros activos y botón limpiar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-whatsapp-secondary">Filtros activos:</span>
          
          {filters.connectionId && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Conexión: {connections.find(c => c.id === filters.connectionId)?.name || `ID ${filters.connectionId}`}
              <button 
                onClick={() => updateFilters({ connectionId: undefined })}
                className="ml-1 hover:text-blue-900"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.status && (
            <Badge 
              variant="outline" 
              className={`${
                filters.status === 'SENT' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : filters.status === 'FAILED'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}
            >
              Estado: {filters.status === 'SENT' ? 'Enviado' : filters.status === 'FAILED' ? 'Fallido' : 'Pendiente'}
              <button 
                onClick={() => updateFilters({ status: undefined })}
                className="ml-1 hover:opacity-70"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.recipient && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Destinatario: "{filters.recipient}"
              <button 
                onClick={() => updateFilters({ recipient: '' })}
                className="ml-1 hover:text-blue-900"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.dateFrom && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Desde: {filters.dateFrom}
              <button 
                onClick={() => updateFilters({ dateFrom: '' })}
                className="ml-1 hover:text-purple-900"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.dateTo && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Hasta: {filters.dateTo}
              <button 
                onClick={() => updateFilters({ dateTo: '' })}
                className="ml-1 hover:text-purple-900"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <button
            onClick={clearAllFilters}
            className="text-sm text-whatsapp-secondary hover:text-whatsapp underline ml-2"
            disabled={loading}
          >
            Limpiar todos
          </button>
        </div>
      )}

      {loading && (
        <div className="text-sm text-whatsapp-secondary italic">
          Aplicando filtros...
        </div>
      )}
    </div>
  );
};

export default LogsFilters;
