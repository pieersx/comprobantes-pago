"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Check, FileText, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "./button";

interface FileUploadProps {
  /**
   * Callback cuando se selecciona un archivo
   */
  onFileSelect?: (file: File) => void;

  /**
   * Callback cuando se sube el archivo exitosamente
   */
  onUploadSuccess?: (filePath: string) => void;

  /**
   * Callback cuando falla la subida
   */
  onUploadError?: (error: Error) => void;

  /**
   * Archivo actual (URL o path)
   */
  currentFile?: string | null;

  /**
   * Etiqueta del botón
   */
  label?: string;

  /**
   * Tipos de archivo aceptados
   */
  accept?: string;

  /**
   * Tamaño máximo en MB
   */
  maxSizeMB?: number;

  /**
   * Clase CSS adicional
   */
  className?: string;

  /**
   * Deshabilitado
   */
  disabled?: boolean;

  /**
   * Modo: 'button' o 'dropzone'
   */
  mode?: "button" | "dropzone";
}

export function FileUpload({
  onFileSelect,
  onUploadSuccess,
  onUploadError,
  currentFile,
  label = "Subir archivo",
  accept = ".pdf,image/*",
  maxSizeMB = 10,
  className,
  disabled = false,
  mode = "button",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Validar tamaño
    if (file.size > maxSizeBytes) {
      return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
    }

    // Validar tipo
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileType = file.type;
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    const isValid = acceptedTypes.some((type) => {
      if (type === "image/*") {
        return fileType.startsWith("image/");
      }
      if (type.startsWith(".")) {
        return fileExtension === type.toLowerCase();
      }
      return fileType === type;
    });

    if (!isValid) {
      return `Tipo de archivo no permitido. Aceptados: ${accept}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Renderizado modo botón
  if (mode === "button") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={disabled || uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {label}
              </>
            )}
          </Button>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[200px] truncate">{selectedFile.name}</span>
              <span className="text-muted-foreground">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={disabled || uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {currentFile && !selectedFile && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Archivo cargado</span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Archivos permitidos: {accept}. Máximo {maxSizeMB}MB
        </p>
      </div>
    );
  }

  // Renderizado modo dropzone
  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          dragActive && "border-primary bg-primary/5",
          !dragActive && "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-medium">Subiendo archivo...</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
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
              <X className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center gap-2">
            <Check className="h-8 w-8 text-green-600" />
            <p className="text-sm font-medium text-green-600">Archivo cargado</p>
            <p className="text-xs text-muted-foreground">Click para cambiar</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Arrastra un archivo o haz click aquí
            </p>
            <p className="text-xs text-muted-foreground">
              {accept} - Máximo {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
