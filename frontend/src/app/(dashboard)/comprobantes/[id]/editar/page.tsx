'use client';

import { ComprobanteForm } from '@/components/comprobantes/ComprobanteForm';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import {
    comprobantesEgresoService,
    comprobantesIngresoService,
} from '@/services/comprobantes.service';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Página para editar un comprobante existente
 * Carga los datos del comprobante y valida que pueda ser editado
 */
export default function EditarComprobantePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia ? Number(companiaActual.codCia) : 1;

  const [loading, setLoading] = useState(true);
  const [comprobante, setComprobante] = useState<any>(null);
  const [tipo, setTipo] = useState<'ingreso' | 'egreso'>('egreso');
  const [error, setError] = useState<string | null>(null);

  // Extraer ID del comprobante de la URL
  // Formato esperado: [id] = "tipo-codProveedor-nroCp" o "tipo-nroCp"
  const comprobanteId = params.id as string;

  useEffect(() => {
    const cargarComprobante = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parsear el ID del comprobante
        const parts = comprobanteId.split('-');
        const tipoComprobante = parts[0]; // 'egreso' o 'ingreso'

        if (tipoComprobante === 'egreso') {
          // Para egresos: egreso-codProveedor-nroCp
          if (parts.length < 3) {
            throw new Error('ID de comprobante inválido');
          }
          const codProveedor = parseInt(parts[1]);
          const nroCp = parts.slice(2).join('-'); // El resto es el número de comprobante

          setTipo('egreso');
          const data = await comprobantesEgresoService.getById(codCia, codProveedor, nroCp);

          // Validar que el comprobante no esté en estado PAG
          if (data.codEstado === 'PAG') {
            setError('No se puede editar un comprobante que ya ha sido pagado');
            toast({
              title: 'No se puede editar',
              description: 'Este comprobante ya ha sido pagado y no puede ser modificado',
              variant: 'destructive',
            });
            return;
          }

          setComprobante(data);
        } else if (tipoComprobante === 'ingreso') {
          // Para ingresos: ingreso-nroCp
          if (parts.length < 2) {
            throw new Error('ID de comprobante inválido');
          }
          const nroCp = parts.slice(1).join('-'); // El resto es el número de comprobante

          setTipo('ingreso');
          const data = await comprobantesIngresoService.getById(codCia, nroCp);

          // Validar que el comprobante no esté en estado PAG
          if (data.codEstado === 'PAG') {
            setError('No se puede editar un comprobante que ya ha sido cobrado');
            toast({
              title: 'No se puede editar',
              description: 'Este comprobante ya ha sido cobrado y no puede ser modificado',
              variant: 'destructive',
            });
            return;
          }

          setComprobante(data);
        } else {
          throw new Error('Tipo de comprobante inválido');
        }
      } catch (err: any) {
        console.error('Error al cargar comprobante:', err);
        setError(err.message || 'Error al cargar el comprobante');
        toast({
          title: 'Error',
          description: err.message || 'No se pudo cargar el comprobante',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (comprobanteId) {
      cargarComprobante();
    }
  }, [comprobanteId, codCia, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando comprobante...</p>
        </div>
      </div>
    );
  }

  if (error || !comprobante) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/comprobantes">Comprobantes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center space-y-4 py-12">
          <h2 className="text-2xl font-bold">No se puede editar el comprobante</h2>
          <p className="text-muted-foreground">{error}</p>
          <Link
            href="/comprobantes"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Volver a Comprobantes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/comprobantes">Comprobantes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/comprobantes/${comprobanteId}`}>{comprobante.nroCp}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Editar Comprobante {tipo === 'egreso' ? 'de Egreso' : 'de Ingreso'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Modificar comprobante {comprobante.nroCp}
        </p>
      </div>

      {/* Formulario */}
      <ComprobanteForm
        tipo={tipo}
        modo="editar"
        comprobanteId={comprobanteId}
        onSuccess={() => router.push(`/comprobantes/${comprobanteId}`)}
      />
    </div>
  );
}
