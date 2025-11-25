'use client';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { elementosService, TipoComprobante } from '@/services/elementos.service';
import { useEffect, useState } from 'react';

interface TipoComprobanteSelectorProps {
  value?: string;
  onChange: (tipo: string) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * Componente selector de tipo de comprobante
 * Carga los tipos desde el endpoint /api/elementos/tipos-comprobante
 * Feature: comprobantes-jerarquicos
 * Requirements: 2.1, 3.1
 *
 * @param value - Código del tipo de comprobante seleccionado (FAC, BOL, REC, etc.)
 * @param onChange - Callback cuando cambia la selección
 * @param disabled - Si es true, el selector está deshabilitado
 * @param label - Etiqueta personalizada
 * @param error - Mensaje de error a mostrar
 * @param required - Si es true, muestra asterisco de campo requerido
 */
export function TipoComprobanteSelector({
  value,
  onChange,
  disabled = false,
  label = 'Tipo de Comprobante',
  error,
  required = false,
}: TipoComprobanteSelectorProps) {
  const [tipos, setTipos] = useState<TipoComprobante[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar tipos de comprobante al montar el componente
  useEffect(() => {
    const cargarTipos = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        console.log('🔄 Cargando tipos de comprobante...');
        const data = await elementosService.getTiposComprobante();
        console.log('✅ Tipos de comprobante cargados:', data);
        setTipos(data);
      } catch (err) {
        setErrorMsg('Error al cargar tipos de comprobante. Por favor contacte al administrador.');
        console.error('❌ Error cargando tipos de comprobante:', err);
        console.warn('💡 El backend necesita implementar el endpoint: GET /api/v1/elementos/tipos-comprobante');
      } finally {
        setLoading(false);
      }
    };

    cargarTipos();
  }, []);

  const handleValueChange = (tipoCode: string) => {
    onChange(tipoCode);
  };

  // Obtener el tipo seleccionado para mostrar en el trigger
  const tipoSeleccionado = tipos.find((t) => t.codigo === value);

  /**
   * Obtiene el ícono según el tipo de comprobante
   */
  const getIconoTipo = (codigo: string): string => {
    switch (codigo) {
      case 'FAC':
        return '📄'; // Factura
      case 'BOL':
        return '🧾'; // Boleta
      case 'REC':
        return '📋'; // Recibo por Honorarios
      case 'OTR':
        return '📝'; // Otro documento
      default:
        return '📄';
    }
  };

  /**
   * Obtiene información adicional según el tipo de comprobante
   */
  const getInfoTipo = (codigo: string): string => {
    switch (codigo) {
      case 'FAC':
        return 'IGV 18% (fijo)';
      case 'BOL':
        return 'IGV 18% (fijo)';
      case 'REC':
        return 'Retención manual';
      case 'OTR':
        return 'Sin impuesto';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tipo-comprobante-selector" className={error ? 'text-destructive' : ''}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={value || ''}
        onValueChange={handleValueChange}
        disabled={disabled || loading || tipos.length === 0}
      >
        <SelectTrigger
          id="tipo-comprobante-selector"
          className={error ? 'border-destructive' : ''}
        >
          <SelectValue placeholder={loading ? 'Cargando tipos...' : 'Seleccione tipo de comprobante'}>
            {tipoSeleccionado && (
              <span className="flex items-center gap-2">
                <span>{getIconoTipo(tipoSeleccionado.codigo)}</span>
                <span className="font-medium">{tipoSeleccionado.descripcion}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {errorMsg ? (
            <div className="p-4 text-sm text-destructive">{errorMsg}</div>
          ) : tipos.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {loading ? 'Cargando tipos de comprobante...' : 'No hay tipos de comprobante disponibles'}
            </div>
          ) : (
            tipos.map((tipo) => (
              <SelectItem key={tipo.codigo} value={tipo.codigo} className="py-3">
                <div className="flex flex-col gap-1">
                  {/* Nombre del tipo con ícono */}
                  <div className="flex items-center gap-2">
                    <span>{getIconoTipo(tipo.codigo)}</span>
                    <span className="font-medium">{tipo.descripcion}</span>
                  </div>

                  {/* Información adicional sobre impuestos */}
                  <div className="text-xs text-muted-foreground ml-6">
                    {getInfoTipo(tipo.codigo)}
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {value && (
        <p className="text-xs text-muted-foreground">
          {getInfoTipo(value)}
        </p>
      )}
    </div>
  );
}
