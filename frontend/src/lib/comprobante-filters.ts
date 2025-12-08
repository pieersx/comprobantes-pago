/**
 * Utility functions for filtering comprobantes
 * Feature: partidas-jerarquia-filtros
 * Requirements: 3.1, 3.2, 4.1, 4.2
 */

import { ComprobanteUnificado } from '@/services/comprobantes-unified.service';

export interface ComprobanteFilters {
  proyecto: string;      // 'all' o codPyto
  proveedor: string;     // 'all' o codProveedor/codCliente
  busqueda: string;      // Texto libre
}

/**
 * Filters comprobantes by project code
 * Feature: partidas-jerarquia-filtros, Property 6
 * Validates: Requirements 3.2
 *
 * @param comprobantes - List of comprobantes to filter
 * @param codPyto - Project code to filter by ('all' for no filter)
 * @returns Filtered list of comprobantes
 */
export function filterByProyecto(
  comprobantes: ComprobanteUnificado[],
  codPyto: string
): ComprobanteUnificado[] {
  if (codPyto === 'all' || codPyto === '') {
    return comprobantes;
  }

  const codPytoNum = parseInt(codPyto, 10);
  if (isNaN(codPytoNum)) {
    return comprobantes;
  }

  return comprobantes.filter(c => c.codPyto === codPytoNum);
}

/**
 * Filters comprobantes by provider/client code
 * Feature: partidas-jerarquia-filtros, Property 7
 * Validates: Requirements 4.2
 *
 * @param comprobantes - List of comprobantes to filter
 * @param codProveedorCliente - Provider/client code to filter by ('all' for no filter)
 * @returns Filtered list of comprobantes
 */
export function filterByProveedorCliente(
  comprobantes: ComprobanteUnificado[],
  codProveedorCliente: string
): ComprobanteUnificado[] {
  if (codProveedorCliente === 'all' || codProveedorCliente === '') {
    return comprobantes;
  }

  const codNum = parseInt(codProveedorCliente, 10);
  if (isNaN(codNum)) {
    return comprobantes;
  }

  return comprobantes.filter(c => {
    // For INGRESO, codProveedor actually contains codCliente
    // For EGRESO, codProveedor contains the actual provider code
    // For EGRESO_EMPLEADO, codEmpleado contains the employee code
    if (c.tipo === 'EGRESO_EMPLEADO') {
      return c.codEmpleado === codNum;
    }
    return c.codProveedor === codNum;
  });
}

/**
 * Applies all filters to comprobantes
 *
 * @param comprobantes - List of comprobantes to filter
 * @param filters - Filter criteria
 * @returns Filtered list of comprobantes
 */
export function applyFilters(
  comprobantes: ComprobanteUnificado[],
  filters: ComprobanteFilters
): ComprobanteUnificado[] {
  let result = comprobantes;

  // Apply project filter
  result = filterByProyecto(result, filters.proyecto);

  // Apply provider/client filter
  result = filterByProveedorCliente(result, filters.proveedor);

  return result;
}

/**
 * Extracts unique providers/clients from comprobantes
 *
 * @param comprobantes - List of comprobantes
 * @returns Array of unique provider/client options
 */
export function extractProveedoresClientes(
  comprobantes: ComprobanteUnificado[]
): Array<{ value: string; label: string; tipo: string }> {
  const seen = new Map<string, { label: string; tipo: string }>();

  for (const c of comprobantes) {
    const key = c.tipo === 'EGRESO_EMPLEADO'
      ? `emp-${c.codEmpleado}`
      : `prov-${c.codProveedor}`;

    if (!seen.has(key)) {
      const tipo = c.tipo === 'INGRESO' ? 'Cliente' :
                   c.tipo === 'EGRESO_EMPLEADO' ? 'Empleado' : 'Proveedor';
      seen.set(key, { label: c.proveedor, tipo });
    }
  }

  return Array.from(seen.entries())
    .map(([key, { label, tipo }]) => ({
      value: key.split('-')[1], // Extract the numeric code
      label: `${label} (${tipo})`,
      tipo
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
