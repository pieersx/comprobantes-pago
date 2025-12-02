"use client";

import { EmpleadoForm } from "@/components/empleados/EmpleadoForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { empleadosService } from "@/services/empleados.service";
import { EmpleadoUpdate } from "@/types/empleado";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, CreditCard, Edit, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EmpleadoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Parsear el ID (formato: codCia-codEmpleado)
  const idParts = (params.id as string).split("-");
  const codCia = parseInt(idParts[0]);
  const codEmpleado = parseInt(idParts[1]);

  // Obtener empleado
  const { data: empleado, isLoading, error } = useQuery({
    queryKey: ["empleado", codCia, codEmpleado],
    queryFn: () => empleadosService.getById(codCia, codEmpleado),
    enabled: !isNaN(codCia) && !isNaN(codEmpleado),
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: EmpleadoUpdate) =>
      empleadosService.update(codCia, codEmpleado, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleado", codCia, codEmpleado] });
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado actualizado correctamente");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(`Error al actualizar empleado: ${error.message}`);
    },
  });

  const handleSubmit = async (data: EmpleadoUpdate) => {
    await updateMutation.mutateAsync(data);
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Cargando empleado...</p>
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-red-600">Error al cargar empleado</p>
        <Button asChild className="mt-4">
          <Link href="/empleados">Volver a la lista</Link>
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Editar Empleado
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Modifica los datos del empleado
            </p>
          </div>
        </div>

        {/* Formulario */}
        <EmpleadoForm
          empleado={empleado}
          mode="edit"
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/empleados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Detalle del Empleado
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              EMP-{String(empleado.codEmpleado).padStart(3, "0")}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Perfil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-32 w-32">
              {empleado.tieneFoto ? (
                <AvatarImage
                  src={empleadosService.getFotoUrl(empleado.codCia, empleado.codEmpleado)}
                  alt={empleado.desPersona}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {getInitials(empleado.desPersona)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{empleado.desPersona}</h2>
              {empleado.desCorta && (
                <p className="text-muted-foreground">{empleado.desCorta}</p>
              )}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    empleado.vigente === "S"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {empleado.vigente === "S" ? "Activo" : "Inactivo"}
                </span>
                {empleado.licCond === "S" && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Licencia de Conducir
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de contacto */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{empleado.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Celular</p>
                <p className="font-medium">{empleado.celular || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{empleado.direcc || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{empleado.dni || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-100 p-2">
                <Calendar className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">{formatDate(empleado.fecNac)}</p>
              </div>
            </div>
            {empleado.nroCip && (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CIP</p>
                  <p className="font-medium">
                    {empleado.nroCip}
                    {empleado.fecCipVig && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Vigencia: {formatDate(empleado.fecCipVig)})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      {(empleado.hobby || empleado.observac) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {empleado.hobby && (
              <div>
                <p className="text-sm text-muted-foreground">Hobby / Intereses</p>
                <p className="mt-1">{empleado.hobby}</p>
              </div>
            )}
            {empleado.observac && (
              <div>
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p className="mt-1">{empleado.observac}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
