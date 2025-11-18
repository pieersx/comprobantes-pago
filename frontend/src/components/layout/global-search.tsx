'use client';

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { comprobantesUnifiedService } from '@/services/comprobantes-unified.service';
import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { FileText, FolderKanban, Loader2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch data only when searching
  const { data: comprobantes = [], isLoading: loadingComprobantes } = useQuery({
    queryKey: ['search-comprobantes', query],
    queryFn: async () => {
      try {
        return await comprobantesUnifiedService.getAll();
      } catch (error) {
        console.error('Error fetching comprobantes:', error);
        return [];
      }
    },
    enabled: query.length >= 2,
  });

  const { data: proyectos = [], isLoading: loadingProyectos } = useQuery({
    queryKey: ['search-proyectos', query],
    queryFn: async () => {
      try {
        return await dashboardService.getProjectsOverview();
      } catch (error) {
        console.error('Error fetching proyectos:', error);
        return [];
      }
    },
    enabled: query.length >= 2,
  });

  // Filter results based on query (with null/undefined checks)
  const filteredComprobantes = comprobantes
    .filter((c) => {
      const searchQuery = query.toLowerCase();
      return (
        (c.nroCP?.toLowerCase() || '').includes(searchQuery) ||
        (c.proveedor?.toLowerCase() || '').includes(searchQuery) ||
        (c.proyecto?.toLowerCase() || '').includes(searchQuery)
      );
    })
    .slice(0, 5);

  const filteredProyectos = proyectos
    .filter((p) => {
      const searchQuery = query.toLowerCase();
      return (
        (p.nombPyto?.toLowerCase() || '').includes(searchQuery) ||
        String(p.codPyto || '').includes(query)
      );
    })
    .slice(0, 3);

  const hasResults = filteredComprobantes.length > 0 || filteredProyectos.length > 0;
  const isLoading = loadingComprobantes || loadingProyectos;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when typing
  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectComprobante = (comprobante: any) => {
    toast({
      title: "Comprobante seleccionado",
      description: `${comprobante.nroCP} - ${comprobante.proveedor}`,
    });
    router.push('/comprobantes');
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectProyecto = (proyecto: any) => {
    toast({
      title: "Proyecto seleccionado",
      description: `${proyecto.nombPyto}`,
    });
    router.push('/proyectos');
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors',
            isFocused ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <Input
          type="search"
          placeholder="Buscar comprobantes, proyectos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={cn(
            'pl-9 pr-9 w-full transition-all',
            isFocused
              ? 'bg-white border-primary ring-2 ring-primary/20'
              : 'bg-gray-50 border-gray-200'
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg border shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Buscando...</span>
            </div>
          ) : hasResults ? (
            <div className="p-2">
              {/* Comprobantes */}
              {filteredComprobantes.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    Comprobantes
                  </div>
                  {filteredComprobantes.map((comprobante) => (
                    <button
                      key={comprobante.nroCP || Math.random()}
                      onClick={() => handleSelectComprobante(comprobante)}
                      className="w-full flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-md flex-shrink-0',
                          comprobante.tipo === 'INGRESO' ? 'bg-green-100' : 'bg-red-100'
                        )}
                      >
                        <FileText
                          className={cn(
                            'h-4 w-4',
                            comprobante.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {comprobante.nroCP || 'Sin número'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {comprobante.proveedor || 'Sin proveedor'} • S/{' '}
                          {(comprobante.impTotalMn || 0).toLocaleString('es-PE')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Proyectos */}
              {filteredProyectos.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    Proyectos
                  </div>
                  {filteredProyectos.map((proyecto) => (
                    <button
                      key={proyecto.codPyto || Math.random()}
                      onClick={() => handleSelectProyecto(proyecto)}
                      className="w-full flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 flex-shrink-0">
                        <FolderKanban className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {proyecto.nombPyto || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Código {proyecto.codPyto || 'N/A'} • {proyecto.porcentaje || 0}%
                          completado
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No se encontraron resultados</p>
              <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Escribe al menos 2 caracteres</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
