'use client';

/**
 * Página para crear un nuevo comprobante de ingreso
 * Usa el componente ComprobanteForm.tsx que tiene todas las validaciones correctas
 */

import { ComprobanteForm } from '@/components/comprobantes/ComprobanteForm';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function NuevoIngresoPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ingresos">Ingresos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo Ingreso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Comprobante de Ingreso</h1>
        <p className="text-muted-foreground mt-2">
          Registre un nuevo comprobante de cobro a cliente
        </p>
      </div>

      {/* Formulario - Usa ComprobanteForm con auto-selección de cliente según proyecto */}
      <ComprobanteForm tipo="ingreso" modo="crear" />
    </div>
  );
}
