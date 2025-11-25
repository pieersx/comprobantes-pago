import { fileUploadService } from '@/services/file-upload.service';
import { FileUploadResponse } from '@/types/comprobante';
import { useCallback, useState } from 'react';

// ===================================
// HOOK PARA SUBIDA DE ARCHIVOS
// Feature: comprobantes-mejoras
// Requirements: 3.1, 3.2, 3.3, 3.4
// ===================================

interface UseFileUploadProps {
  tipo: 'comprobante' | 'abono';
  codCia: number;
  year: number;
  month: number;
  tipoComprobante?: 'ingreso' | 'egreso';
  onUploadSuccess?: (filePath: string) => void;
  onUploadError?: (error: string) => void;
}

interface UseFileUploadReturn {
  file: File | null;
  filePath: string | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  clearFile: () => void;
  validateFile: (file: File) => string | null;
}

/**
 * Hook para gestionar la subida de archivos de comprobantes y abonos
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2, 3.3, 3.4
 *
 * @param tipo - Tipo de archivo: 'comprobante' o 'abono'
 * @param codCia - Código de compañía
 * @param year - Año del documento
 * @param month - Mes del documento
 * @param tipoComprobante - Tipo de comprobante (ingreso/egreso) - solo para comprobantes
 * @param onUploadSuccess - Callback cuando la subida es exitosa
 * @param onUploadError - Callback cuando hay un error
 * @returns Estado y funciones para gestionar la subida de archivos
 */
export const useFileUpload = ({
  tipo,
  codCia,
  year,
  month,
  tipoComprobante,
  onUploadSuccess,
  onUploadError,
}: UseFileUploadProps): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Valida el formato del archivo
   * Requirements: 3.3
   */
  const validateFile = useCallback((fileToValidate: File): string | null => {
    return fileUploadService.validateFileFormat(fileToValidate);
  }, []);

  /**
   * Sube el archivo al servidor
   * Requirements: 3.1, 3.2, 3.4
   */
  const uploadFile = useCallback(
    async (fileToUpload: File) => {
      // Validar archivo antes de subir
      const validationError = validateFile(fileToUpload);
      if (validationError) {
        setError(validationError);
        if (onUploadError) {
          onUploadError(validationError);
        }
        return;
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);
      setFile(fileToUpload);

      try {
        let response: FileUploadResponse;

        // Simular progreso (ya que axios no proporciona progreso real en este caso)
        const progressInterval = setInterval(() => {
          setProgress((prev: number) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        if (tipo === 'comprobante') {
          if (!tipoComprobante) {
            throw new Error('Tipo de comprobante requerido para subir archivo de comprobante');
          }
          response = await fileUploadService.uploadComprobanteFile(
            fileToUpload,
            codCia,
            year,
            month,
            tipoComprobante
          );
        } else {
          response = await fileUploadService.uploadAbonoFile(
            fileToUpload,
            codCia,
            year,
            month
          );
        }

        clearInterval(progressInterval);
        setProgress(100);
        setFilePath(response.filePath);

        // Notificar éxito
        if (onUploadSuccess) {
          onUploadSuccess(response.filePath);
        }

        console.log('✅ Archivo subido exitosamente:', response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al subir archivo';
        setError(errorMessage);
        setProgress(0);

        // Notificar error
        if (onUploadError) {
          onUploadError(errorMessage);
        }

        console.error('❌ Error al subir archivo:', err);
      } finally {
        setIsUploading(false);
      }
    },
    [tipo, codCia, year, month, tipoComprobante, validateFile, onUploadSuccess, onUploadError]
  );

  /**
   * Limpia el archivo seleccionado
   */
  const clearFile = useCallback(() => {
    setFile(null);
    setFilePath(null);
    setProgress(0);
    setError(null);
  }, []);

  return {
    file,
    filePath,
    progress,
    isUploading,
    error,
    uploadFile,
    clearFile,
    validateFile,
  };
};

/**
 * Hook simplificado para subida de archivos con drag & drop
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2, 3.3
 */
export const useFileUploadWithDragDrop = (props: UseFileUploadProps) => {
  const fileUpload = useFileUpload(props);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          fileUpload.uploadFile(files[0]);
        }
      }
    },
    [fileUpload]
  );

  return {
    ...fileUpload,
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};
