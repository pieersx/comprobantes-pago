/**
 * Configuración centralizada de la API
 */

// URL base de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969/api/v1';

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Maestros
  companias: `${API_BASE_URL}/companias`,
  clientes: `${API_BASE_URL}/clientes`,
  proveedores: `${API_BASE_URL}/proveedores`,
  personas: `${API_BASE_URL}/personas`,
  partidas: `${API_BASE_URL}/partidas?codCia=1`,

  // Proyectos
  proyectos: `${API_BASE_URL}/proyectos?codCia=1`,

  // Comprobantes
  comprobantesPago: `${API_BASE_URL}/comprobantes-pago?codCia=1`,
  comprobantesDetalle: `${API_BASE_URL}/comprobantes-detalle`,

  // Flujo de Caja
  flujoCaja: `${API_BASE_URL}/flujo-caja`,

  // Tablas
  tabs: `${API_BASE_URL}/tabs`,
} as const;

/**
 * Helper para construir URLs con parámetros
 */
export const buildUrl = (base: string, ...params: (string | number)[]): string => {
  return `${base}/${params.join('/')}`;
};

/**
 * Configuración de headers por defecto
 */
export const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Helper para hacer fetch con configuración por defecto
 */
export const apiFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  return fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
    ...options,
  });
};
