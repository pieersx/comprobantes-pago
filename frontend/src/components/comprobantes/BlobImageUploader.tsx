'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { FileImage, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BlobImageUploaderProps {
  label?: string;
  tipoComprobante: 'egreso' | 'ingreso' | 'egreso-empleado';
  tipoImagen: 'foto-cp' | 'foto-abono';
  codCia: number;
  codProveedor?: number;
  codEmpleado?: number;
  nroCP: string;
  onUploadSuccess?: () => void;
  maxSizeMB?: number;
  accept?: string;
}

/**
 * Componente para subir imágenes directamente como BLOB a la base de datos
 * Usa los endpoints de comprobantes-pago, comprobantes-venta o comprobantes-empleado
 */
export function BlobImageUploader({
  label = 'Imagen',
  tipoComprobante,
  tipoImagen,
  codCia,
  codProveedor,
  codEmpleado,
  nroCP,
  onUploadSuccess,
  maxSizeMB = 10,
  accept = '.jpg,.jpeg,.png,.pdf',
}: BlobImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const getEndpoint = () => {
    if (tipoComprobante === 'egreso' && codProveedor) {
      return `/comprobantes-pago/${codCia}/${codProveedor}/${nroCP}/${tipoImagen}`;
    } else if (tipoComprobante === 'ingreso') {
      return `/comprobantes-venta/${codCia}/${nroCP}/${tipoImagen}`;
    } else if (tipoComprobante === 'egreso-empleado' && codEmpleado) {
      return `/comprobantes-empleado/${codCia}/${codEmpleado}/${nroCP}/${tipoImagen}`;
    }
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`El archivo no debe superar los ${maxSizeMB}MB`);
      return;
    }

    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = accept.split(',');
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Solo se permiten archivos: ${accept}`);
      return;
    }

    const endpoint = getEndpoint();
    if (!endpoint) {
      toast.error('Configuración de comprobante inválida');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFileName(file.name);
      toast.success('Imagen subida correctamente');
      onUploadSuccess?.();
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      const message = error.response?.data?.message || error.message || 'Error al subir la imagen';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`blob-${tipoImagen}`}>{label}</Label>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            id={`blob-${tipoImagen}`}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>

        {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}

        {fileName && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFile}
            title="Limpiar"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {fileName && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <FileImage className="h-4 w-4" />
          {fileName} - Subido correctamente
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Formatos: JPG, PNG, PDF. Máximo {maxSizeMB}MB
      </p>
    </div>
  );
}
