'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { partidasService } from '@/services/partidas.service';
import { PartidaProyecto } from '@/types/partida';
import { useEffect, useState } from 'react';

interface PartidaSelectorProps {
  codPyto: number;
  tipo: 'I' | 'E'; // Ingreso o Egreso
  value?: number;
  onChange: (partida: PartidaProyecto) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
}

/**
 * Componente selector de partidas con búsqueda y filtrado
 * Muestra el presupuesto disponible y deshabilita partidas sin presupuesto
 *
 * @param codPyto - Código del proyecto
 * @param tipo - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
 * @param value - Código de partida seleccionada
 * @param onChange - Callback cuando se selecciona una partida
 * @param disabled - Si es true, el selector está deshabilitado
 * @param label - Etiqueta personalizada
 * @param error - Mensaje de error a mostrar
 */
export function PartidaSelector({
  codPyto,
  tipo,
  value,
  onChange,
  disabled = false,
  label = 'Partida',
  error,
}: PartidaSelectorProps) {
  const [partidas, setPartidas] = useState<PartidaProyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar partidas del proyecto - TODOS LOS NIVELES (1, 2, 3)
  useEffect(() => {
    const cargarPartidas = async () => {
      if (!codPyto) {
        console.log('⚠️ No hay codPyto, no se cargan partidas');
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        // Obtener compañía del localStorage o contexto
        const codCia = 1; // TODO: Obtener de useAppStore o contexto
        console.log(`🔄 Cargando TODAS las partidas (niveles 1, 2, 3) para proyecto ${codPyto}, tipo ${tipo}...`);

        // Nuevo requerimiento: Cargar TODAS las partidas (niveles 1, 2, 3)
        // El usuario puede seleccionar cualquier nivel
        const data = await partidasService.getTodasPartidasPorProyecto(codCia, codPyto, tipo);
        console.log(`✅ TODAS las partidas cargadas (${data.length} partidas):`, data);

        // Ordenar jerárquicamente: primero por código de partida
        // Esto asegura que las partidas estén en orden: 2000, 2100, 2101, 2102, 2200, 2201, etc.
        const partidasOrdenadas = [...data].sort((a, b) => {
          return a.codPartida - b.codPartida;
        });

        setPartidas(partidasOrdenadas);
      } catch (err) {
        setErrorMsg('Error cargando partidas. Por favor contacte al administrador del sistema.');
        console.error('❌ Error cargando partidas:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPartidas();
  }, [codPyto, tipo]);

  const handleValueChange = (partidaId: string) => {
    const partida = partidas.find((p) => p.codPartida === parseInt(partidaId));
    if (partida) {
      onChange(partida);
    }
  };

  const formatearMonto = (monto: number): string => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const getNivelAlertaColor = (nivel?: string): string => {
    switch (nivel) {
      case 'verde':
        return 'text-green-600';
      case 'amarillo':
        return 'text-yellow-600';
      case 'naranja':
        return 'text-orange-600';
      case 'rojo':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getNivelBadgeVariant = (nivel?: number): 'default' | 'secondary' | 'outline' => {
    switch (nivel) {
      case 1:
        return 'default'; // Nivel 1: Badge azul (default)
      case 2:
        return 'secondary'; // Nivel 2: Badge gris
      case 3:
        return 'outline'; // Nivel 3: Badge con outline
      default:
        return 'secondary';
    }
  };

  // Obtener la partida seleccionada para mostrar en el trigger
  const partidaSeleccionada = partidas.find((p) => p.codPartida === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="partida-selector" className={error ? 'text-destructive' : ''}>
        {label}
      </Label>
      <Select
        value={value ? value.toString() : ''}
        onValueChange={handleValueChange}
        disabled={disabled || loading || partidas.length === 0}
      >
        <SelectTrigger id="partida-selector" className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={loading ? 'Cargando partidas...' : 'Seleccione una partida'}>
            {partidaSeleccionada && (
              <div className="flex items-center gap-2">
                <Badge variant={getNivelBadgeVariant(partidaSeleccionada.nivel)} className="text-xs px-2 py-0.5">
                  N{partidaSeleccionada.nivel || '?'}
                </Badge>
                <span className="font-medium">
                  {partidaSeleccionada.codPartida} - {partidaSeleccionada.desPartida}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {errorMsg ? (
            <div className="p-4 text-sm text-destructive">{errorMsg}</div>
          ) : partidas.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {loading ? 'Cargando partidas...' : `No hay partidas de ${tipo === 'E' ? 'egreso' : 'ingreso'} disponibles para este proyecto`}
            </div>
          ) : (
            partidas.map((partida) => {
              const partidaValue = String(partida.codPartida);
              // Calcular indentación según el nivel
              const indentacion = (partida.nivel || 1) - 1;
              const paddingLeft = indentacion * 16; // 16px por nivel

              // Solo las partidas de nivel 3 son seleccionables
              // Niveles 1 y 2 son encabezados/categorías
              const esSeleccionable = partida.nivel === 3;

              return (
                <SelectItem
                  key={partida.codPartida}
                  value={partidaValue}
                  disabled={!esSeleccionable}
                  className={!esSeleccionable ? 'opacity-70 cursor-default' : ''}
                >
                  <div className="flex flex-col gap-1" style={{ paddingLeft: `${paddingLeft}px` }}>
                    <div className="flex items-center gap-2">
                      <Badge variant={getNivelBadgeVariant(partida.nivel)} className="text-xs px-2 py-0.5">
                        N{partida.nivel || '?'}
                      </Badge>
                      <span className={`font-medium ${!esSeleccionable ? 'text-muted-foreground' : ''}`}>
                        {partida.codPartida} - {partida.desPartida}
                      </span>
                      {!esSeleccionable && (
                        <span className="text-xs text-muted-foreground">(categoría)</span>
                      )}
                    </div>
                    {partida.hierarchyPath && partida.nivel === 3 && (
                      <div className="text-xs text-muted-foreground pl-1">
                        📁 {partida.hierarchyPath}
                      </div>
                    )}
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
