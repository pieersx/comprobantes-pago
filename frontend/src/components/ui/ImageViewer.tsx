"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, File, ImageOff, Loader2, ZoomIn } from "lucide-react";
import { useCallback, useState } from "react";

interface ImageViewerProps {
  /** URL de la imagen */
  src: string;
  /** Texto alternativo */
  alt?: string;
  /** Título para el modal */
  title?: string;
  /** Clase CSS adicional para el thumbnail */
  className?: string;
  /** Tamaño del thumbnail */
  thumbnailSize?: "sm" | "md" | "lg";
  /** Mostrar botón de descarga */
  showDownload?: boolean;
  /** Nombre del archivo para descarga */
  downloadFilename?: string;
  /** Callback cuando hay error al cargar */
  onError?: () => void;
}

const thumbnailSizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

export function ImageViewer({
  src,
  alt = "Imagen",
  title = "Vista de imagen",
  className,
  thumbnailSize = "md",
  showDownload = true,
  downloadFilename = "imagen",
  onError,
}: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Determinar extensión basada en el tipo de contenido
      const contentType = response.headers.get("content-type") || "";
      let extension = ".jpg";
      if (contentType.includes("png")) extension = ".png";
      if (contentType.includes("pdf")) extension = ".pdf";

      a.download = `${downloadFilename}${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  }, [src, downloadFilename]);

  const handleOpenInNewTab = useCallback(() => {
    window.open(src, "_blank");
  }, [src]);

  // Detectar si es PDF basado en la URL
  const checkIfPdf = useCallback(() => {
    return src.toLowerCase().includes("pdf") || src.toLowerCase().endsWith(".pdf");
  }, [src]);

  // Verificar tipo al montar
  useState(() => {
    setIsPdf(checkIfPdf());
  });

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-muted",
          thumbnailSizes[thumbnailSize],
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative rounded-lg border border-border overflow-hidden cursor-pointer group",
          thumbnailSizes[thumbnailSize],
          className
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isPdf ? (
          <div className="flex items-center justify-center h-full bg-muted">
            <File className="h-8 w-8 text-red-500" />
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full object-cover transition-transform group-hover:scale-105",
              isLoading && "opacity-0"
            )}
          />
        )}

        {/* Overlay de zoom */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white" />
        </div>
      </div>


      {/* Modal de vista completa */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>{title}</DialogTitle>
              <div className="flex items-center gap-2">
                {showDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="relative flex items-center justify-center p-4 bg-muted/50 min-h-[400px] max-h-[70vh] overflow-auto">
            {isPdf ? (
              <div className="text-center">
                <File className="h-24 w-24 mx-auto text-red-500" />
                <p className="mt-4 text-muted-foreground">
                  Documento PDF
                </p>
                <Button
                  className="mt-4"
                  onClick={handleOpenInNewTab}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir PDF
                </Button>
              </div>
            ) : (
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Componente para mostrar múltiples imágenes en una galería
 */
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
  }>;
  className?: string;
  thumbnailSize?: "sm" | "md" | "lg";
}

export function ImageGallery({
  images,
  className,
  thumbnailSize = "md",
}: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No hay imágenes disponibles
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {images.map((image, index) => (
        <ImageViewer
          key={index}
          src={image.src}
          alt={image.alt}
          title={image.title}
          thumbnailSize={thumbnailSize}
        />
      ))}
    </div>
  );
}
