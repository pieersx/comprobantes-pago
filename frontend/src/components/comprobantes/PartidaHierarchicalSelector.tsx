'use client';

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

interface PartidaHierarchicalSelectorProps {
  codPyto: number;
  tipo: 'I' | 'E'; // Ingreso o Egreso
  value?: number;
  onChange: (partida: PartidaProyecto) => void;
  excludePartidas?: number[]; // Partidas ya seleccionadas para excluir
  disabled?: boolean;
  label?: string;
  error?: string;
}

/**
 * Componente selector de partidas con jerarquía completa
 * Muestra formato "NIVEL1 > NIVEL2 > NIVEL3" y filtra partidas ya seleccionadas
 * Feature: comprobantes-jerarquicos
 * Requirements: 1.2, 7.2
 *
 * @param codPyto - Código del proyecto
 * @param tipo - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
 * @param value - Código de partida seleccionada
 * @param onChange - Callback cuando se selecciona una partida
 * @param excludePartidas - Array de códigos de partidas a excluir (ya seleccionadas)
 * @param disabled - Si es true, el selector está deshabilitado
 * @param label - Etiqueta personalizada
 * @param error - Mensaje de error a mostrar
 */
export function PartidaHierarchicalSelector({
  codPyto,
  tipo,
  value,
  onChange,
  excludePartidas = [],
  disabled = false,
  label = 'Partida',
  error,
}: PartidaHierarchicalSelectorProps) {
  const [partidas, setPartidas] = useState<PartidaProyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar TODAS las partidas del proyecto (niveles 1, 2 y 3)
  // NUEVO REQUERIMIENTO: El usuario puede seleccionar cualquier nivel
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
        console.log(`🔄 Cargando TODAS las partidas (niveles 1, 2, 3) para proyecto ${codPyto}...`);

        // NUEVO: Llamar al endpoint que retorna TODAS las partidas (cualquier nivel)
        const data = await partidasService.getTodasPartidasPorProyecto(codCia, codPyto, tipo);
        console.log(`✅ Partidas con jerarquía cargadas:`, data);
        setPartidas(data);
      } catch (err) {
        setErrorMsg('Error al cargar partidas. Por favor contacte al administrador del sistema.');
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

  /**
   * Construye la jerarquía completa de la partida
   * Formato: "NIVEL1 > NIVEL2 > NIVEL3"
   */
  const construirJerarquia = (partida: PartidaProyecto): string => {
    const partes: string[] = [];

    // Agregar nivel 1 si existe
    if (partida.padreNivel1 && partida.desPartidaNivel1) {
      partes.push(`${partida.padreNivel1} - ${partida.desPartidaNivel1}`);
    }

    // Agregar nivel 2 si existe
    if (partida.padreNivel2 && partida.desPartidaNivel2) {
      partes.push(`${partida.padreNivel2} - ${partida.desPartidaNivel2}`);
    }

    // Agregar nivel actual (nivel 3 para egresos, nivel 2 para ingresos)
    partes.push(`${partida.codPartida} - ${partida.desPartida}`);

    return partes.join(' > ');
  };

  // Filtrar partidas excluyendo las ya seleccionadas
  const partidasDisponibles = partidas.filter(
    (p) => !excludePartidas.includes(p.codPartida)
  );

  // Obtener la partida seleccionada para mostrar en el trigger
  const partidaSeleccionada = partidas.find((p) => p.codPartida === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="partida-hierarchical-selector" className={error ? 'text-destructive' : ''}>
        {label}
      </Label>
      <Select
        value={value ? value.toString() : ''}
        onValueChange={handleValueChange}
        disabled={disabled || loading || partidasDisponibles.length === 0}
      >
        <SelectTrigger id="partida-hierarchical-selector" className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={loading ? 'Cargando partidas...' : 'Seleccione una partida'}>
            {partidaSeleccionada && (
              <span className="font-medium text-sm">
                {construirJerarquia(partidaSeleccionada)}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-w-2xl">
          {errorMsg ? (
            <div className="p-4 text-sm text-destructive">{errorMsg}</div>
          ) : partidasDisponibles.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {loading
                ? 'Cargando partidas...'
                : excludePartidas.length > 0
                ? 'No hay más partidas disponibles (todas ya fueron seleccionadas)'
                : `No hay partidas de ${tipo === 'E' ? 'egreso' : 'ingreso'} disponibles para este proyecto`}
            </div>
          ) : (
            partidasDisponibles.map((partida) => {
              const sinPresupuesto = partida.presupuestoDisponible <= 0 && tipo === 'E';
              const partidaValue = String(partida.codPartida);

              return (
                <SelectItem key={partida.codPartida} value={partidaValue} className="py-3">
                  <div className="flex flex-col gap-1">
                    {/* Jerarquía completa */}
                    <div className="font-medium text-sm">
                      {construirJerarquia(partida)}
                    </div>

                    {/* Información de presupuesto */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={getNivelAlertaColor(partida.nivelAlerta)}>
                        Disponible: {formatearMonto(partida.presupuestoDisponible)}
                      </span>
                      <span className="text-muted-foreground">
                        ({partida.porcentajeEjecucion.toFixed(1)}% ejecutado)
                      </span>
                    </div>

                    {/* Advertencia si no hay presupuesto */}
                    {sinPresupuesto && (
                      <span className="text-xs text-destructive font-medium">
                        ⚠️ Sin presupuesto disponible
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {excludePartidas.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {excludePartidas.length} partida(s) ya seleccionada(s)
        </p>
      )}
    </div>
  );
}
