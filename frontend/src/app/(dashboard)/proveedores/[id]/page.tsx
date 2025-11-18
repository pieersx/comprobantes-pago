"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proveedoresService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, DollarSign, Edit, FileText, Package, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetalleProveedorPage() {
  const params = useParams();
  const proveedorId = params.id as string;

  const { data: proveedor, isLoading, error } = useQuery({
    queryKey: ["proveedor", proveedorId],
    queryFn: async () => {
      // Asumiendo que el ID viene en formato "codCia-codProveedor"
      const [codCia, codProveedor] = proveedorId.split("-").map(Number);
      return await proveedoresService.getById(codCia, codProveedor);
    },
    enabled: !!proveedorId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !proveedor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Proveedor no encontrado</h1>
          <Link href="/proveedores">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información del proveedor
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {proveedor.desPersona || proveedor.desCorta}
            </h1>
            <Badge variant={proveedor.vigente === "S" ? "default" : "secondary"}>
              {proveedor.vigente === "S" ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            RUC: {proveedor.nroRuc} | Código: {proveedor.codCia}-{proveedor.codProveedor}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/proveedores">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href={`/proveedores/${proveedorId}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comprobantes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Comprobantes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ 0.00
            </div>
            <p className="text-xs text-muted-foreground">
              Suma de comprobantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={proveedor.vigente === "S" ? "default" : "secondary"} className="text-base">
              {proveedor.vigente === "S" ? "Activo" : "Inactivo"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Información del Proveedor */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Proveedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Razón Social</span>
              </div>
              <p className="font-medium text-lg">{proveedor.desPersona || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Nombre Corto</span>
              </div>
              <p className="font-medium text-lg">{proveedor.desCorta || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>RUC</span>
              </div>
              <p className="font-mono font-medium text-lg">{proveedor.nroRuc}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Código de Proveedor</span>
              </div>
              <p className="font-mono font-medium text-lg">{proveedor.codProveedor}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprobantes del Proveedor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comprobantes de Pago</CardTitle>
            <Badge variant="outline">0 comprobantes</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay comprobantes registrados para este proveedor</p>
            <p className="text-sm mt-2">
              Los comprobantes aparecerán aquí cuando se registren
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/comprobantes/nuevo/egreso?proveedor=${proveedorId}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Nuevo Comprobante
            </Button>
          </Link>
          <Link href={`/comprobantes?proveedor=${proveedorId}`}>
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Ver Todos los Comprobantes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
