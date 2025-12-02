"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { File, FileImage, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  /** URL de la imagen existente (para preview) */
  imageUrl?: string | null;
  /** Callback cuando se selecciona un archivo */
  onFileSelect: (file: File) => void;
  /** Callback cuando se elimina la imagen */
  onRemove?: () => void;
  /** Indica si está cargando */
  isLoading?: boolean;
  /** Tamaño máximo en bytes (default: 10MB) */
  maxSize?: number;
  /** Tipos de archivo permitidos */
  accept?: string;
  /** Texto del placeholder */
  placeholder?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Deshabilitar el componente */
  disabled?: boolean;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPT = "image/jpeg,image/jpg,image/png,application/pdf";

export function ImageUpload({
  imageUrl,
  onFileSelect,
  onRemove,
  isLoading = false,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
  placeholder = "Arrastra una imagen o haz clic para seleccionar",
  className,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Validar tamaño
    if (file.size > maxSize) {
      toast.error(`El archivo excede el límite de ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }

    // Validar tipo
    const allowedTypes = accept.split(",").map(t => t.trim());
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Use JPG, PNG o PDF");
      return false;
    }

    return true;
  }, [maxSize, accept]);

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    // Determinar tipo de archivo
    if (file.type === "application/pdf") {
      setFileType("pdf");
      setPreview(null); // No preview para PDF
    } else {
      setFileType("image");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isLoading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [disabled, isLoading, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      setIsDragging(true);
    }
  }, [disabled, isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  }, [onRemove]);

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isLoading]);


  // Si hay URL de imagen existente y no hay preview local
  const displayUrl = preview || imageUrl;

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={accept}
        className="hidden"
        disabled={disabled || isLoading}
      />

      {displayUrl || fileType === "pdf" ? (
        // Vista con imagen/archivo cargado
        <div className="relative rounded-lg border border-border overflow-hidden">
          {fileType === "pdf" ? (
            // Preview para PDF
            <div className="flex items-center justify-center h-48 bg-muted">
              <div className="text-center">
                <File className="h-16 w-16 mx-auto text-red-500" />
                <p className="mt-2 text-sm text-muted-foreground">Documento PDF</p>
              </div>
            </div>
          ) : (
            // Preview para imagen
            <div className="relative h-48 bg-muted">
              <img
                src={displayUrl!}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Overlay con botones */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Cambiar
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Quitar
              </Button>
            )}
          </div>

          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        // Vista de dropzone vacío
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            (disabled || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          ) : (
            <>
              <FileImage className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center px-4">
                {placeholder}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG o PDF (máx. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
