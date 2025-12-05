/**
 * Constantes de estados de comprobantes según la base de datos Oracle
 *
 * IMPORTANTE: Estos códigos deben coincidir exactamente con los valores
 * almacenados en la tabla ELEMENTOS de la base de datos.
 *
 * TabEstado = '014' (Tabla de estados de comprobante)
 * CodEstado = Código específico del estado (REG, PAG, ANU, PEN)
 */

export const ESTADOS_COMPROBANTE = {
  REGISTRADO: 'REG',
  PENDIENTE: 'PEN',
  PAGADO: 'PAG',
  ANULADO: 'ANU',
} as const;

export const ESTADOS_LABELS = {
  'REG': 'Registrado',
  'PEN': 'Pendiente',
  'PAG': 'Pagado',
  'ANU': 'Anulado',
} as const;

export const ESTADOS_VARIANTS = {
  'REG': 'outline' as const,      // Registrado - Amarillo/Outline
  'PEN': 'secondary' as const,    // Pendiente - Gris/Secondary
  'PAG': 'default' as const,      // Pagado - Verde/Default
  'ANU': 'destructive' as const,  // Anulado - Rojo/Destructive
} as const;

export const ESTADOS_COLORS = {
  'REG': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  'PEN': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
  'PAG': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  'ANU': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
  },
} as const;

/**
 * Obtiene la etiqueta legible de un estado
 */
export function getEstadoLabel(codigo: string): string {
  return ESTADOS_LABELS[codigo as keyof typeof ESTADOS_LABELS] || codigo;
}

/**
 * Obtiene la variante de badge para un estado
 */
export function getEstadoVariant(codigo: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  return ESTADOS_VARIANTS[codigo as keyof typeof ESTADOS_VARIANTS] || 'outline';
}

/**
 * Obtiene los colores CSS para un estado
 */
export function getEstadoColors(codigo: string) {
  return ESTADOS_COLORS[codigo as keyof typeof ESTADOS_COLORS] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  };
}

/**
 * Verifica si un comprobante está en estado registrado (pendiente de pago)
 */
export function isRegistrado(codigo: string): boolean {
  return codigo === ESTADOS_COMPROBANTE.REGISTRADO;
}

/**
 * Verifica si un comprobante está pagado
 */
export function isPagado(codigo: string): boolean {
  return codigo === ESTADOS_COMPROBANTE.PAGADO;
}

/**
 * Verifica si un comprobante está anulado
 */
export function isAnulado(codigo: string): boolean {
  return codigo === ESTADOS_COMPROBANTE.ANULADO;
}

/**
 * Verifica si un comprobante puede ser editado
 * Solo se pueden editar comprobantes en estado REGISTRADO
 */
export function canEdit(codigo: string): boolean {
  return isRegistrado(codigo);
}

/**
 * Verifica si un comprobante puede ser anulado
 * Se pueden anular comprobantes REGISTRADOS y PAGADOS (con confirmación)
 */
export function canAnular(codigo: string): boolean {
  return !isAnulado(codigo);
}

/**
 * Verifica si un comprobante puede cambiar a estado PAGADO
 * Solo comprobantes REGISTRADOS pueden marcarse como PAGADOS
 */
export function canMarcarPagado(codigo: string): boolean {
  return isRegistrado(codigo);
}

/**
 * Mapea códigos de estado de la base de datos a códigos de componentes UI
 * Base de datos y UI ahora usan los mismos códigos: 'REG', 'PEN', 'PAG', 'ANU'
 */
export function mapEstadoToUI(codigo: string): 'REG' | 'PEN' | 'PAG' | 'ANU' {
  const validCodigos = ['REG', 'PEN', 'PAG', 'ANU'];
  if (validCodigos.includes(codigo)) {
    return codigo as 'REG' | 'PEN' | 'PAG' | 'ANU';
  }
  return 'REG';
}
