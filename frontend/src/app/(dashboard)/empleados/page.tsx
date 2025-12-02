"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { empleadosService } from "@/services/empleados.service";
import { useAppStore } from "@/store/useAppStore";
import { Empleado } from "@/types/empleado";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  User,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function EmpleadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactivos, setShowInactivos] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState<Empleado | null>(null);
  const queryClient = useQueryClient();

  // Obtener compañía actual del store
  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia || 1;

  // Obtener empleados desde la API
  const { data: empleados = [], isLoading, error } = useQuery({
    queryKey: ["empleados", codCia, showInactivos],
    queryFn: () => empleadosService.getAll(codCia, !showInactivos),
    enabled: !!codCia,
  });

  // Mutation para eliminar empleado
  const deleteMutation = useMutation({
    mutationFn: (empleado: Empleado) =>
      empleadosService.delete(empleado.codCia, empleado.codEmpleado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado desactivado correctamente");
      setEmpleadoToDelete(null);
    },
    onError: (error) => {
      toast.error(`Error al desactivar empleado: ${error.message}`);
    },
  });


  const filteredEmpleados = empleados.filter(
    (emp) =>
      emp.desPersona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.dni?.includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(emp.codEmpleado).includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Cargando empleados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-600">Error al cargar empleados: {String(error)}</p>
      </div>
    );
  }

  const getStatusColor = (vigente: string) => {
    return vigente === "S"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
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

  const handleDelete = (empleado: Empleado) => {
    setEmpleadoToDelete(empleado);
  };

  const confirmDelete = () => {
    if (empleadoToDelete) {
      deleteMutation.mutate(empleadoToDelete);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Empleados
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona todos los empleados del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/empleados/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Empleados
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {empleados.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Activos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {empleados.filter((e) => e.vigente === "S").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Con Foto
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {empleados.filter((e) => e.tieneFoto).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <UserX className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inactivos
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {empleados.filter((e) => e.vigente === "N").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, DNI, email o código..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showInactivos ? "default" : "outline"}
                onClick={() => setShowInactivos(!showInactivos)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showInactivos ? "Mostrar Activos" : "Mostrar Todos"}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empleados Grid */}
      {filteredEmpleados.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay empleados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "No se encontraron empleados con ese criterio de búsqueda"
                  : "Comienza agregando un nuevo empleado"}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link href="/empleados/nuevo">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Empleado
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmpleados.map((empleado) => (
            <Card
              key={`${empleado.codCia}-${empleado.codEmpleado}`}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {empleado.tieneFoto ? (
                        <AvatarImage
                          src={empleadosService.getFotoUrl(empleado.codCia, empleado.codEmpleado)}
                          alt={empleado.desPersona}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(empleado.desPersona)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {empleado.desPersona || "Sin nombre"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        EMP-{String(empleado.codEmpleado).padStart(3, "0")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/empleados/${empleado.codCia}-${empleado.codEmpleado}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/empleados/${empleado.codCia}-${empleado.codEmpleado}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(empleado)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desactivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">DNI:</span>
                    <span className="font-medium">{empleado.dni || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium truncate max-w-[180px]">
                      {empleado.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Celular:</span>
                    <span className="font-medium">{empleado.celular || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estado:</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        empleado.vigente
                      )}`}
                    >
                      {empleado.vigente === "S" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={!!empleadoToDelete} onOpenChange={() => setEmpleadoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar empleado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará al empleado{" "}
              <strong>{empleadoToDelete?.desPersona}</strong>.
              El empleado no será eliminado permanentemente y podrá ser reactivado posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
