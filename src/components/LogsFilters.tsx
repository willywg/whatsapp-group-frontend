
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Calendar } from 'lucide-react';

interface LogsFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  status: string[];
  dateFrom: string;
  dateTo: string;
  origin: string;
  destination: string;
}

const LogsFilters = ({ onFiltersChange }: LogsFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    dateFrom: '',
    dateTo: '',
    origin: '',
    destination: '',
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    const cleared = { search: '', status: [], dateFrom: '', dateTo: '', origin: '', destination: '' };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const activeFiltersCount = 
    (filters.origin ? 1 : 0) + 
    (filters.destination ? 1 : 0) + 
    filters.status.length + 
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Filtros en línea */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Origen */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Origen
          </label>
          <Input
            placeholder="Filtrar por origen..."
            value={filters.origin}
            onChange={(e) => updateFilters({ origin: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Destino */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Destino
          </label>
          <Input
            placeholder="Filtrar por destino..."
            value={filters.destination}
            onChange={(e) => updateFilters({ destination: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-whatsapp-secondary mb-1">
            Estado
          </label>
          <Select
            value={filters.status[0] || 'all'}
            onValueChange={(value) => updateFilters({ status: value === 'all' ? [] : [value] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="SENT">Enviado</SelectItem>
              <SelectItem value="FAILED">Fallido</SelectItem>
            </SelectContent>
          </Select>
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
          />
        </div>
      </div>

      {/* Filtros activos y botón limpiar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-whatsapp-secondary">Filtros activos:</span>
          
          {filters.origin && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Origen: "{filters.origin}"
              <button 
                onClick={() => updateFilters({ origin: '' })}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.destination && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Destino: "{filters.destination}"
              <button 
                onClick={() => updateFilters({ destination: '' })}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.status.map(status => (
            <Badge 
              key={status} 
              variant="outline" 
              className={`${
                status === 'SENT' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              Estado: {status === 'SENT' ? 'Enviado' : 'Fallido'}
              <button 
                onClick={() => updateFilters({ status: [] })}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {filters.dateFrom && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Desde: {filters.dateFrom}
              <button 
                onClick={() => updateFilters({ dateFrom: '' })}
                className="ml-1 hover:text-purple-900"
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
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <button
            onClick={clearAllFilters}
            className="text-sm text-whatsapp-secondary hover:text-whatsapp underline ml-2"
          >
            Limpiar todos
          </button>
        </div>
      )}
    </div>
  );
};

export default LogsFilters;
