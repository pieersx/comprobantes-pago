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
import Link from 'next/link';

/**
 * Página para crear un nuevo comprobante de egreso
 * Renderiza el formulario ComprobanteForm en modo creación
 * Feature: comprobantes-mejoras
 * Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 4.1, 8.2
 */
export default function NuevoEgresoPage() {
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
            <BreadcrumbPage>Nuevo Egreso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Comprobante de Egreso</h1>
        <p className="text-muted-foreground mt-2">
          Registre un nuevo comprobante de pago a proveedor o empleado
        </p>
      </div>

      {/* Formulario */}
      <ComprobanteForm tipo="egreso" modo="crear" />
    </div>
  );
}
