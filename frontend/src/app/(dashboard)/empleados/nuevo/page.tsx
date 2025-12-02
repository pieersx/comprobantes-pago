"use client";

import { EmpleadoForm } from "@/components/empleados/EmpleadoForm";
import { Button } from "@/components/ui/button";
import { empleadosService } from "@/services/empleados.service";
import { EmpleadoCreate, EmpleadoUpdate } from "@/types/empleado";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: EmpleadoCreate) => empleadosService.create(data),
    onSuccess: (empleado) => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado creado correctamente");
      router.push(`/empleados/${empleado.codCia}-${empleado.codEmpleado}`);
    },
    onError: (error) => {
      toast.error(`Error al crear empleado: ${error.message}`);
    },
  });

  const handleSubmit = async (data: EmpleadoCreate | EmpleadoUpdate) => {
    await createMutation.mutateAsync(data as EmpleadoCreate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/empleados">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nuevo Empleado
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos para registrar un nuevo empleado
          </p>
        </div>
      </div>

      {/* Formulario */}
      <EmpleadoForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
