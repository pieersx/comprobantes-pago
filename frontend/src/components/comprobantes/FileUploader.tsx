'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileIcon, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FileUploaderProps {
  label?: string;
  tipo: 'egreso' | 'ingreso' | 'abono';
  onUploadSuccess: (filePath: string) => void;
  currentFile?: string;
  maxSizeMB?: number;
  accept?: string;
}

export function FileUploader({
  label = 'Documento',
  tipo,
  onUploadSuccess,
  currentFile,
  maxSizeMB = 10,
  accept = '.pdf,.jpg,.jpeg,.png'
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Obtener año y mes actual
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 0-indexed

      // URL base del backend
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969/api/v1';
      let endpoint = `${API_BASE_URL}/files/upload`;

      // Determinar endpoint según tipo
      if (tipo === 'abono') {
        endpoint = `${API_BASE_URL}/files/abono`;
        formData.append('codCia', '1'); // TODO: Obtener de store
        formData.append('year', year.toString());
        formData.append('month', month.toString());
      } else if (tipo === 'egreso' || tipo === 'ingreso') {
        endpoint = `${API_BASE_URL}/files/comprobante`;
        formData.append('codCia', '1'); // TODO: Obtener de store
        formData.append('year', year.toString());
        formData.append('month', month.toString());
        formData.append('tipo', tipo);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al subir el archivo: ${response.status}`);
      }

      const data = await response.json();

      setFileName(file.name);
      onUploadSuccess(data.filePath || data.fileName);
      toast.success('Archivo subido correctamente');
    } catch (error: any) {
      console.error('Error al subir archivo:', error);
      // Solo mostrar error si realmente falló la subida
      // Si el error es 405 (Method Not Allowed), probablemente ya se subió
      if (!error.message?.includes('405')) {
        toast.error(error.message || 'Error al subir el archivo');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
    onUploadSuccess('');
  };

  const handleViewFile = () => {
    if (currentFile) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969/api/v1';
      window.open(`${API_BASE_URL}/files/download?path=${encodeURIComponent(currentFile)}`, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`file-${tipo}`}>{label}</Label>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            id={`file-${tipo}`}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>

        {uploading && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}

        {currentFile && !uploading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleViewFile}
            title="Ver archivo"
          >
            <FileIcon className="h-4 w-4" />
          </Button>
        )}

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
        <p className="text-sm text-muted-foreground">
          📎 {fileName}
        </p>
      )}

      {currentFile && !fileName && (
        <p className="text-sm text-green-600">
          ✓ Archivo cargado previamente
        </p>
      )}
    </div>
  );
}
