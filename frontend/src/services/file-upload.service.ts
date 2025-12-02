import { apiClient } from '@/lib/api';
import { FileUploadResponse } from '@/types/comprobante';

/**
 * Servicio para manejo de archivos PDF de comprobantes y abonos
 * Incluye retry logic con backoff exponencial y manejo de errores específicos
 */

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 segundo

/**
 * Espera un tiempo determinado (para retry logic)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calcula el delay con backoff exponencial
 */
const getRetryDelay = (attempt: number): number => {
  return INITIAL_DELAY * Math.pow(2, attempt);
};

// ===================================
// FUNCIONES MEJORADAS DE SUBIDA DE ARCHIVOS
// Feature: comprobantes-mejoras
// Requirements: 3.1, 3.2, 3.4, 3.5
// ===================================

/**
 * Sube un archivo del comprobante con estructura de carpetas por año/mes
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2
 *
 * @param file - Archivo a subir (PDF o imagen)
 * @param codCia - Código de la compañía
 * @param year - Año del comprobante
 * @param month - Mes del comprobante
 * @param tipo - Tipo de comprobante (ingreso/egreso)
 * @returns Información del archivo subido
 */
export async function uploadComprobanteFile(
  file: File,
  codCia: number,
  year: number,
  month: number,
  tipo: 'ingreso' | 'egreso'
): Promise<FileUploadResponse> {
  // Validar archivo antes de subir
  const validationError = validateFileFormat(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('codCia', codCia.toString());
  formData.append('year', year.toString());
  formData.append('month', month.toString());
  formData.append('tipo', tipo);

  return uploadWithRetry('/files/comprobante', formData);
}

/**
 * Sube un archivo del abono con estructura de carpetas por año/mes
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2
 *
 * @param file - Archivo a subir (PDF o imagen)
 * @param codCia - Código de la compañía
 * @param year - Año del abono
 * @param month - Mes del abono
 * @returns Información del archivo subido
 */
export async function uploadAbonoFile(
  file: File,
  codCia: number,
  year: number,
  month: number
): Promise<FileUploadResponse> {
  // Validar archivo antes de subir
  const validationError = validateFileFormat(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('codCia', codCia.toString());
  formData.append('year', year.toString());
  formData.append('month', month.toString());

  return uploadWithRetry('/files/abono', formData);
}

/**
 * Sube un archivo PDF del comprobante (método legacy)
 *
 * @param file - Archivo PDF a subir
 * @param codCia - Código de la compañía
 * @param nroComprobante - Número del comprobante
 * @param tipoDocumento - Tipo de documento (FAC, BOL, REC)
 * @returns Información del archivo subido
 */
export async function uploadComprobante(
  file: File,
  codCia: number,
  nroComprobante: string,
  tipoDocumento: string
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('codCia', codCia.toString());
  formData.append('nroComprobante', nroComprobante);
  formData.append('tipoDocumento', tipoDocumento);

  return uploadWithRetry('/files/upload/comprobante', formData);
}

/**
 * Sube un archivo PDF del abono (método legacy)
 *
 * @param file - Archivo PDF a subir
 * @param codCia - Código de la compañía
 * @param nroComprobante - Número del comprobante asociado
 * @returns Información del archivo subido
 */
export async function uploadAbono(
  file: File,
  codCia: number,
  nroComprobante: string
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('codCia', codCia.toString());
  formData.append('nroComprobante', nroComprobante);

  return uploadWithRetry('/files/upload/abono', formData);
}

/**
 * Descarga un archivo por su ruta
 *
 * @param filePath - Ruta relativa del archivo
 * @returns Blob del archivo
 */
export async function downloadFile(filePath: string): Promise<Blob> {
  try {
    const response = await apiClient.get(`/files/download/${filePath}`, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error: any) {
    throw handleFileError(error);
  }
}

/**
 * Descarga un archivo y lo abre en una nueva pestaña
 *
 * @param filePath - Ruta relativa del archivo
 * @param fileName - Nombre del archivo para descarga
 */
export async function downloadAndOpenFile(filePath: string, fileName?: string): Promise<void> {
  try {
    const blob = await downloadFile(filePath);
    const url = window.URL.createObjectURL(blob);

    // Crear link temporal para descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || filePath.split('/').pop() || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpiar URL
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw handleFileError(error);
  }
}

/**
 * Elimina un archivo del servidor
 *
 * @param filePath - Ruta relativa del archivo
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await apiClient.delete(`/files/${filePath}`);
  } catch (error: any) {
    throw handleFileError(error);
  }
}

/**
 * Verifica si un archivo existe
 *
 * @param filePath - Ruta relativa del archivo
 * @returns true si el archivo existe
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await apiClient.head(`/files/download/${filePath}`);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Sube un archivo con retry logic y backoff exponencial
 *
 * @param url - URL del endpoint
 * @param formData - FormData con el archivo y parámetros
 * @returns Respuesta del servidor
 */
async function uploadWithRetry(
  url: string,
  formData: FormData,
  attempt: number = 0
): Promise<FileUploadResponse> {
  try {
    const response = await apiClient.post<FileUploadResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    // Si es el último intento o es un error no recuperable, lanzar error
    if (attempt >= MAX_RETRIES - 1 || !isRetryableError(error)) {
      throw handleFileError(error);
    }

    // Esperar con backoff exponencial y reintentar
    const retryDelay = getRetryDelay(attempt);
    console.log(`Reintentando subida en ${retryDelay}ms (intento ${attempt + 1}/${MAX_RETRIES})`);
    await delay(retryDelay);

    return uploadWithRetry(url, formData, attempt + 1);
  }
}

/**
 * Determina si un error es recuperable y vale la pena reintentar
 *
 * @param error - Error de axios
 * @returns true si el error es recuperable
 */
function isRetryableError(error: any): boolean {
  // Errores de red o timeout son recuperables
  if (!error.response) {
    return true;
  }

  // Errores 5xx del servidor son recuperables
  const status = error.response.status;
  if (status >= 500 && status < 600) {
    return true;
  }

  // Errores 429 (Too Many Requests) son recuperables
  if (status === 429) {
    return true;
  }

  // Otros errores no son recuperables
  return false;
}

/**
 * Maneja errores específicos de archivos y retorna mensajes claros
 *
 * @param error - Error de axios
 * @returns Error con mensaje específico
 */
function handleFileError(error: any): Error {
  if (!error.response) {
    return new Error('Error de conexión. Verifica tu conexión a internet.');
  }

  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      if (data.message?.includes('formato')) {
        return new Error('El archivo debe ser formato PDF');
      }
      if (data.message?.includes('tamaño')) {
        return new Error('El archivo excede el tamaño máximo de 10MB');
      }
      return new Error(data.message || 'Archivo inválido');

    case 404:
      return new Error('Archivo no encontrado en el servidor');

    case 413:
      return new Error('El archivo es demasiado grande. Máximo 10MB');

    case 415:
      return new Error('Formato de archivo no soportado. Solo se permiten archivos PDF');

    case 500:
      return new Error('Error del servidor al procesar el archivo. Intenta nuevamente.');

    case 507:
      return new Error('No hay espacio suficiente en el servidor');

    default:
      return new Error(data.message || 'Error al procesar el archivo');
  }
}

/**
 * Valida el formato de archivo (PDF o imágenes)
 * Feature: comprobantes-mejoras
 * Requirements: 3.3
 *
 * @param file - Archivo a validar
 * @param maxSize - Tamaño máximo en bytes (default: 10MB)
 * @returns null si es válido, mensaje de error si no lo es
 */
export function validateFileFormat(file: File, maxSize: number = 10 * 1024 * 1024): string | null {
  // Validar que no esté vacío
  if (!file || file.size === 0) {
    return 'El archivo está vacío';
  }

  // Formatos permitidos: PDF, JPG, JPEG, PNG
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

  // Validar tipo MIME
  if (!allowedTypes.some(type => file.type.includes(type))) {
    return 'El archivo debe ser formato PDF, JPG, JPEG o PNG';
  }

  // Validar extensión
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return 'El archivo debe tener extensión .pdf, .jpg, .jpeg o .png';
  }

  // Validar tamaño
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
  }

  return null;
}

/**
 * Valida un archivo antes de subirlo (validación en cliente - legacy)
 *
 * @param file - Archivo a validar
 * @param maxSize - Tamaño máximo en bytes (default: 10MB)
 * @returns null si es válido, mensaje de error si no lo es
 */
export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024): string | null {
  // Validar que no esté vacío
  if (!file || file.size === 0) {
    return 'El archivo está vacío';
  }

  // Validar formato
  if (!file.type.includes('pdf')) {
    return 'El archivo debe ser formato PDF';
  }

  // Validar tamaño
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
  }

  // Validar extensión
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return 'El archivo debe tener extensión .pdf';
  }

  return null;
}

/**
 * Formatea el tamaño de un archivo para mostrar
 *
 * @param bytes - Tamaño en bytes
 * @returns Tamaño formateado (ej: "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Exportar todas las funciones como un objeto para facilitar el uso
export const fileUploadService = {
  // Nuevas funciones mejoradas
  uploadComprobanteFile,
  uploadAbonoFile,
  validateFileFormat,
  // Funciones legacy
  uploadComprobante,
  uploadAbono,
  // Funciones de descarga y gestión
  downloadFile,
  downloadAndOpenFile,
  deleteFile,
  fileExists,
  // Funciones de validación y utilidades
  validateFile,
  formatFileSize,
};
