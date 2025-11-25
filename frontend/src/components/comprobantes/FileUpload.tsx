'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFileUploadWithDragDrop } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';
import { AlertCircle, Download, File, FileImage, Upload, X } from 'lucide-react';
import { useState } from 'react';

// ===================================
// COMPONENTE FILE UPLOAD
// Feature: comprobantes-mejoras
// Requirements: 3.1, 3.2, 3.4, 3.5
// ===================================

interface FileUploadProps {
  tipo: 'comprobante' | 'abono';
  codCia: number;
  year: number;
  month: number;
  tipoComprobante?: 'ingreso' | 'egreso';
  onUploadSuccess: (filePath: string) => void;
  onUploadError?: (error: string) => void;
  existingFile?: string;
  label?: string;
  disabled?: boolean;
}

/**
 * Componente para subir archivos de comprobantes y abonos
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2, 3.4, 3.5
 */
export function FileUpload({
  tipo,
  codCia,
  year,
  month,
  tipoComprobante,
  onUploadSuccess,
  onUploadError,
  existingFile,
  label,
  disabled = false,
}: FileUploadProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    file,
    filePath,
    progress,
    isUploading,
    error,
    uploadFile,
    clearFile,
    isDragging,
    dragHandlers,
  } = useFileUploadWithDragDrop({
    tipo,
    codCia,
    year,
    month,
    tipoComprobante,
    onUploadSuccess,
    onUploadError,
  });

  const handleFileSelect = async (selectedFile: File) => {
    // Crear preview si es imagen
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    await uploadFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    clearFile();
    setPreviewUrl(null);
    setShowPreview(false);
  };

  const handleDownload = () => {
    if (existingFile) {
      // Implementar descarga del archivo existente
      window.open(`/api/v1/files/download/${existingFile}`, '_blank');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <FileImage className="h-8 w-8 text-primary" />;
    }
    return <File className="h-8 w-8 text-primary" />;
  };

  const defaultLabel =
    tipo === 'comprobante'
      ? 'Archivo del Comprobante'
      : 'Archivo del Abono';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label || defaultLabel}</label>

      <Card
        className={cn(
          'relative border-2 border-dashed transition-colors',
          isDragging && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && !isUploading && 'cursor-pointer hover:border-primary/50'
        )}
        {...dragHandlers}
      >
        <div className="p-6">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="hidden"
            id={`file-input-${tipo}`}
            disabled={disabled || isUploading}
          />

          {/* Estado: Subiendo */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {file && getFileIcon(file.name)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Subiendo... {progress}%
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Estado: Archivo subido exitosamente */}
          {!isUploading && filePath && file && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • Subido exitosamente
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Preview de imagen */}
              {previewUrl && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Ocultar' : 'Ver'} Preview
                  </Button>
                  {showPreview && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Estado: Archivo existente */}
          {!isUploading && !filePath && existingFile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Archivo existente</p>
                  <p className="text-xs text-muted-foreground">{existingFile}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <label htmlFor={`file-input-${tipo}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}

          {/* Estado: Sin archivo */}
          {!isUploading && !filePath && !existingFile && (
            <label
              htmlFor={`file-input-${tipo}`}
              className="flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Arrastra un archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos: PDF, JPG, JPEG, PNG • Máximo 10MB
              </p>
            </label>
          )}
        </div>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
