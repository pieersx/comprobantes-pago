'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Download, File, FileImage, Upload, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';

interface FileUploadComponentProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  existingFile?: string;
  onDownload?: () => void;
  disabled?: boolean;
  showPreview?: boolean;
}

/**
 * Componente de carga de archivos con soporte para PDF e imágenes
 * Feature: comprobantes-jerarquicos
 * Requirements: 4.1, 4.2, 4.3
 *
 * - Acepta formatos: PDF, JPG, JPEG, PNG
 * - Valida tamaño máximo de archivo
 * - Muestra preview para imágenes
 * - Muestra nombre de archivo para PDFs
 * - Drag & drop support
 *
 * @param onFileSelect - Callback cuando se selecciona un archivo
 * @param accept - Tipos de archivo aceptados (por defecto: PDF e imágenes)
 * @param maxSize - Tamaño máximo en bytes (por defecto: 10MB)
 * @param label - Etiqueta del componente
 * @param existingFile - Ruta del archivo existente
 * @param onDownload - Callback para descargar archivo existente
 * @param disabled - Si es true, el componente está deshabilitado
 * @param showPreview - Si es true, muestra preview de imágenes
 */
export function FileUploadComponent({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  label = 'Subir archivo',
  existingFile,
  onDownload,
  disabled = false,
  showPreview = true,
}: FileUploadComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida el formato y tamaño del archivo
   * Feature: comprobantes-jerarquicos
   * Requirements: 4.1, 4.2, 4.3
   */
  const validateFile = (file: File): string | null => {
    // Validar formato: PDF, JPG, JPEG, PNG
    const validFormats = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const isValidFormat = validFormats.some((format) => file.type.includes(format.split('/')[1]));

    if (!isValidFormat) {
      return 'El archivo debe ser formato PDF, JPG, JPEG o PNG';
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
    }

    return null;
  };

  /**
   * Verifica si el archivo es una imagen
   */
  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  /**
   * Maneja la selección de archivo
   */
  const handleFile = (file: File) => {
    setError(null);
    setPreviewUrl(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Generar preview para imágenes
    if (showPreview && isImage(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (isImage(file)) {
      return <FileImage className="h-8 w-8 text-primary" />;
    }
    return <File className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <Card
        className={cn(
          'relative border-2 border-dashed transition-colors',
          isDragging && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:border-primary/50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          {selectedFile ? (
            <div className="space-y-3">
              {/* Preview de imagen */}
              {previewUrl && showPreview && (
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 rounded-md border border-border"
                  />
                </div>
              )}

              {/* Información del archivo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedFile)}
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : existingFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Archivo existente</p>
                  <p className="text-xs text-muted-foreground">{existingFile}</p>
                </div>
              </div>
              {onDownload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Arrastra un archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos: PDF, JPG, JPEG, PNG • Máximo {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
