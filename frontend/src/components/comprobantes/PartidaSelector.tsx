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

  // Cargar partidas del proyecto
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
        console.log(`🔄 Cargando partidas para proyecto ${codPyto}, tipo ${tipo}...`);
        const data = await partidasService.getPartidasByProyecto(codCia, codPyto, tipo);
        console.log(`✅ Partidas cargadas:`, data);
        setPartidas(data);
      } catch (err) {
        setErrorMsg('El endpoint de partidas no está disponible. Por favor contacte al administrador del sistema.');
        console.error('❌ Error cargando partidas:', err);
        console.warn('💡 El backend necesita implementar el endpoint: GET /api/v1/partidas/proyecto/{codCia}/{codPyto}?tipo={tipo}');
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
              <span className="font-medium">
                {partidaSeleccionada.codPartida} - {partidaSeleccionada.desPartida}
              </span>
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
              const sinPresupuesto = partida.presupuestoDisponible <= 0 && tipo === 'E';
              const partidaValue = String(partida.codPartida);

              return (
                <SelectItem
                  key={partida.codPartida}
                  value={partidaValue}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">
                      {partida.codPartida} - {partida.desPartida}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={getNivelAlertaColor(partida.nivelAlerta)}>
                        Disponible: {formatearMonto(partida.presupuestoDisponible)}
                      </span>
                      <span className="text-muted-foreground">
                        ({partida.porcentajeEjecucion.toFixed(1)}% ejecutado)
                      </span>
                    </div>
                    {sinPresupuesto && (
                      <span className="text-xs text-destructive font-medium">
                        Sin presupuesto disponible
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
    </div>
  );
}
