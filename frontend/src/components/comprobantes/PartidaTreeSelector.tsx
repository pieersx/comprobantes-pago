'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PartidaTreeNode } from '@/types/comprobante';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PartidaTreeSelectorProps {
  codCia: number;
  codProyecto: number;
  ingEgr: 'I' | 'E';
  onSelect: (partida: PartidaTreeNode) => void;
  selectedPartidas?: number[];
  disabled?: boolean;
}

export function PartidaTreeSelector({
  codCia,
  codProyecto,
  ingEgr,
  onSelect,
  selectedPartidas = [],
  disabled = false,
}: PartidaTreeSelectorProps) {
  const [tree, setTree] = useState<PartidaTreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar árbol de partidas
  useEffect(() => {
    loadPartidaTree();
  }, [codCia, ingEgr]);

  const loadPartidaTree = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamada al API para obtener solo partidas del último nivel
      // Backend filtra: nivel 2 para ingresos, nivel 3 para egresos
      const url = `/api/v1/partidas/ultimo-nivel/${codCia}/${ingEgr}${codProyecto ? `?codProyecto=${codProyecto}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al cargar las partidas');
      }

      const data = await response.json();

      // Convertir lista plana a formato de árbol para visualización
      // Las partidas ya vienen filtradas por nivel (2 para ingresos, 3 para egresos)
      const leafNodes: PartidaTreeNode[] = data.map((partida: any) => ({
        codPartida: partida.codPartida,
        desPartida: partida.desPartida,
        nivel: partida.nivel,
        fullPath: partida.ruta || partida.desPartida,
        isLeaf: true,
        orden: partida.orden || 1,
        children: [],
      }));

      setTree(leafNodes);
    } catch (err) {
      setError('Error al cargar las partidas del último nivel');
      console.error('Error loading leaf partidas:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (codPartida: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(codPartida)) {
      newExpanded.delete(codPartida);
    } else {
      newExpanded.add(codPartida);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSelect = (node: PartidaTreeNode) => {
    if (!node.isLeaf) {
      // Si no es hoja, expandir/colapsar
      toggleNode(node.codPartida);
      return;
    }

    // Validar partidas duplicadas
    if (selectedPartidas.includes(node.codPartida)) {
      setError('Esta partida ya está incluida en el comprobante. No se pueden repetir partidas.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!disabled) {
      onSelect(node);
    }
  };

  const filterTree = (nodes: PartidaTreeNode[], term: string): PartidaTreeNode[] => {
    if (!term) return nodes;

    const lowerTerm = term.toLowerCase();

    return nodes.reduce<PartidaTreeNode[]>((acc, node) => {
      const matchesSearch =
        node.desPartida.toLowerCase().includes(lowerTerm) ||
        node.fullPath.toLowerCase().includes(lowerTerm);

      const filteredChildren = filterTree(node.children, term);

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
        // Auto-expandir nodos que coinciden con la búsqueda
        if (filteredChildren.length > 0) {
          expandedNodes.add(node.codPartida);
        }
      }

      return acc;
    }, []);
  };

  const renderNode = (node: PartidaTreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.codPartida);
    const isSelected = selectedPartidas.includes(node.codPartida);
    const isDisabled = isSelected || disabled;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.codPartida} className="select-none">
        <div
          className={cn(
            'flex items-center space-x-2 py-2 px-3 rounded-md cursor-pointer transition-colors',
            level > 0 && 'ml-6',
            isDisabled && 'opacity-50 cursor-not-allowed',
            !isDisabled && node.isLeaf && 'hover:bg-accent',
            !isDisabled && !node.isLeaf && 'hover:bg-muted',
            isSelected && 'bg-primary/10 border border-primary'
          )}
          onClick={() => handleSelect(node)}
        >
          {/* Icono de expandir/colapsar */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.codPartida);
              }}
              className="p-0.5 hover:bg-accent rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Icono de carpeta o archivo */}
          {node.isLeaf ? (
            <FileText className="h-4 w-4 text-blue-600" />
          ) : isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-600" />
          ) : (
            <Folder className="h-4 w-4 text-amber-600" />
          )}

          {/* Nombre de la partida */}
          <span className={cn(
            'flex-1 text-sm',
            node.isLeaf && 'font-medium',
            !node.isLeaf && 'font-semibold text-muted-foreground'
          )}>
            {node.desPartida}
          </span>

          {/* Badge de nivel */}
          <Badge variant="outline" className="text-xs">
            Nivel {node.nivel}
          </Badge>

          {/* Indicador de seleccionada */}
          {isSelected && (
            <Badge variant="default" className="text-xs">
              Seleccionada
            </Badge>
          )}
        </div>

        {/* Ruta completa (tooltip) */}
        {node.isLeaf && (
          <div className={cn('text-xs text-muted-foreground px-3 pb-1', level > 0 && 'ml-6')}>
            {node.fullPath}
          </div>
        )}

        {/* Hijos */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTree = filterTree(tree, searchTerm);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Cargando partidas...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-destructive">{error}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Seleccionar Partida {ingEgr === 'I' ? '(Ingreso)' : '(Egreso)'}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {ingEgr === 'I' ? 'Nivel 2 únicamente' : 'Nivel 3 únicamente'}
          </Badge>
        </div>

        {/* Mensaje informativo */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
          {ingEgr === 'I'
            ? '📋 Mostrando solo partidas de ingreso del nivel 2 (último nivel según especificaciones)'
            : '📋 Mostrando solo partidas de egreso del nivel 3 (último nivel según especificaciones)'
          }
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o ruta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>

        {/* Árbol de partidas */}
        <div className="max-h-96 overflow-y-auto space-y-1 border rounded-md p-2">
          {filteredTree.length > 0 ? (
            filteredTree.map((node) => renderNode(node))
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No se encontraron partidas
            </div>
          )}
        </div>

        {/* Leyenda */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>• Solo se muestran partidas del último nivel según tipo de movimiento</p>
          <p>• {ingEgr === 'I' ? 'Ingresos: nivel 2' : 'Egresos: nivel 3'}</p>
          <p>• No se pueden repetir partidas en el mismo comprobante</p>
        </div>
      </div>
    </Card>
  );
}
