/**
 * Utilidades para validación de partidas presupuestales
 * Feature: partidas-jerarquia-filtros
 * Requirements: 2.1, 2.2
 */

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Interfaz mínima para partida en validación
 */
export interface PartidaForValidation {
  codPartida: number;
  codPartidas?: string;
  ingEgr: string;
}

/**
 * Valida que el código numérico de partida (codPartida) sea único
 * para el mismo tipo de partida (ingEgr)
 *
 * @param codPartida - Código numérico a validar
 * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
 * @param existingPartidas - Lista de partidas existentes
 * @param isEditing - Si es true, se está editando una partida existente
 * @param originalCodPartida - Código original de la partida (solo para edición)
 * @returns Resultado de validación con isValid y mensaje de error si aplica
 */
export function validateCodPartidaUnique(
  codPartida: number,
  ingEgr: string,
  existingPartidas: PartidaForValidation[],
  isEditing: boolean = false,
  originalCodPartida?: number
): ValidationResult {
  // Si estamos editando y el código no cambió, es válido
  if (isEditing && codPartida === originalCodPartida) {
    return { isValid: true };
  }

  // Buscar si existe otra partida con el mismo código y tipo
  const exists = existingPartidas.some(
    p => p.codPartida === codPartida && p.ingEgr === ingEgr
  );

  const tipoLabel = ingEgr === 'I' ? 'Ingresos' : 'Egresos';

  return {
    isValid: !exists,
    error: exists
      ? `El código ${codPartida} ya existe para ${tipoLabel}`
      : undefined
  };
}

/**
 * Valida que el código alfanumérico de partida (codPartidas) sea único
 * para el mismo tipo de partida (ingEgr)
 *
 * @param codPartidas - Código alfanumérico a validar
 * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
 * @param existingPartidas - Lista de partidas existentes
 * @param isEditing - Si es true, se está editando una partida existente
 * @param originalCodPartidas - Código original de la partida (solo para edición)
 * @returns Resultado de validación con isValid y mensaje de error si aplica
 */
export function validateCodPartidasUnique(
  codPartidas: string,
  ingEgr: string,
  existingPartidas: PartidaForValidation[],
  isEditing: boolean = false,
  originalCodPartidas?: string
): ValidationResult {
  // Si estamos editando y el código no cambió, es válido
  if (isEditing && codPartidas === originalCodPartidas) {
    return { isValid: true };
  }

  // Normalizar para comparación (trim y case-insensitive)
  const normalizedCode = codPartidas.trim().toUpperCase();

  // Buscar si existe otra partida con el mismo código y tipo
  const exists = existingPartidas.some(
    p => p.codPartidas?.trim().toUpperCase() === normalizedCode && p.ingEgr === ingEgr
  );

  const tipoLabel = ingEgr === 'I' ? 'Ingresos' : 'Egresos';

  return {
    isValid: !exists,
    error: exists
      ? `El código "${codPartidas}" ya existe para ${tipoLabel}`
      : undefined
  };
}

/**
 * Valida ambos códigos de partida (numérico y alfanumérico)
 *
 * @param codPartida - Código numérico a validar
 * @param codPartidas - Código alfanumérico a validar
 * @param ingEgr - Tipo de partida: 'I' (Ingreso) o 'E' (Egreso)
 * @param existingPartidas - Lista de partidas existentes
 * @param isEditing - Si es true, se está editando una partida existente
 * @param originalCodPartida - Código numérico original (solo para edición)
 * @param originalCodPartidas - Código alfanumérico original (solo para edición)
 * @returns Objeto con resultados de validación para ambos códigos
 */
export function validatePartidaCodes(
  codPartida: number,
  codPartidas: string,
  ingEgr: string,
  existingPartidas: PartidaForValidation[],
  isEditing: boolean = false,
  originalCodPartida?: number,
  originalCodPartidas?: string
): { codPartida: ValidationResult; codPartidas: ValidationResult } {
  return {
    codPartida: validateCodPartidaUnique(
      codPartida,
      ingEgr,
      existingPartidas,
      isEditing,
      originalCodPartida
    ),
    codPartidas: validateCodPartidasUnique(
      codPartidas,
      ingEgr,
      existingPartidas,
      isEditing,
      originalCodPartidas
    ),
  };
}
