"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { proveedoresService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import {
    Download,
    Edit,
    Eye,
    Filter,
    Loader2,
    MoreVertical,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProveedoresPage() {
 const [searchTerm, setSearchTerm] = useState("");

 // Obtener proveedores desde la API real
 const { data: proveedores = [], isLoading, error } = useQuery({
 queryKey: ["proveedores"],
 queryFn: () => proveedoresService.getAll(),
 });

 const filteredProveedores = proveedores.filter(
 (prov) =>
 prov.desPersona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 prov.nroRuc?.includes(searchTerm) ||
 String(prov.codProveedor).includes(searchTerm)
 );

 if (isLoading) {
 return (
 <div className="flex h-96 items-center justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 <p className="ml-2 text-muted-foreground">Cargando proveedores...</p>
 </div>
 );
 }

 if (error) {
 return (
 <div className="flex h-96 items-center justify-center">
 <p className="text-red-600">Error al cargar proveedores: {String(error)}</p>
 </div>
 );
 }

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat("es-PE", {
 style: "currency",
 currency: "PEN",
 }).format(amount);
 };

 const getStatusColor = (estado: string) => {
 return estado === "Activo"
 ? "bg-green-100 text-green-700"
 : "bg-muted text-gray-700";
 };

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-foreground">
 Proveedores
 </h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Gestiona todos los proveedores del sistema
 </p>
 </div>
 <Button asChild>
 <Link href="/proveedores/nuevo">
 <Plus className="h-4 w-4" />
 Nuevo Proveedor
 </Link>
 </Button>
 </div>

 {/* Stats */}
 <div className="grid gap-4 md:grid-cols-4">
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Total Proveedores
 </p>
 <p className="mt-2 text-3xl font-bold text-blue-600">
 {proveedores.length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Activos
 </p>
 <p className="mt-2 text-3xl font-bold text-green-600">
 {proveedores.filter((p) => p.vigente === "S").length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Con RUC
 </p>
 <p className="mt-2 text-3xl font-bold text-purple-600">
 {proveedores.filter((p) => p.nroRuc).length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Inactivos
 </p>
 <p className="mt-2 text-3xl font-bold text-orange-600">
 {proveedores.filter((p) => p.vigente === "N").length}
 </p>
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
 placeholder="Buscar por razón social, RUC o código..."
 className="pl-10"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex gap-2">
 <Button variant="outline">
 <Filter className="h-4 w-4" />
 Filtros
 </Button>
 <Button variant="outline">
 <Download className="h-4 w-4" />
 Exportar
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Proveedores Grid */}
 <div className="grid gap-6 md:grid-cols-2">
 {filteredProveedores.map((proveedor) => (
 <Link key={`${proveedor.codCia}-${proveedor.codProveedor}`} href={`/proveedores/${proveedor.codCia}-${proveedor.codProveedor}`}>
 <Card className="hover:shadow-md transition-shadow cursor-pointer">
 <CardHeader>
 <div className="flex items-start justify-between">
 <div className="flex-1">
  <div className="flex items-center gap-2">
  <CardTitle className="text-lg">
  {proveedor.desPersona || 'Sin nombre'}
  </CardTitle>
  <span
  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
  proveedor.vigente === "S" ? "Activo" : "Inactivo"
  )}`}
  >
  {proveedor.vigente === "S" ? "Activo" : "Inactivo"}
  </span>
  </div>
  <p className="mt-1 text-sm text-muted-foreground">
  PROV-{String(proveedor.codProveedor).padStart(3, '0')} • RUC: {proveedor.nroRuc || 'N/A'}
  </p>
 </div>
 <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Button variant="ghost" size="icon">
  <MoreVertical className="h-4 w-4" />
  </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
  <DropdownMenuItem>
  <Eye className="mr-2 h-4 w-4" />
  Ver Detalles
  </DropdownMenuItem>
  <DropdownMenuItem>
  <Edit className="mr-2 h-4 w-4" />
  Editar
  </DropdownMenuItem>
  <DropdownMenuItem className="text-red-600">
  <Trash2 className="mr-2 h-4 w-4" />
  Eliminar
  </DropdownMenuItem>
  </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-3">
 <div className="flex items-center justify-between text-sm">
  <span className="text-muted-foreground">Descripción Corta:</span>
  <span className="text-foreground font-medium">
  {proveedor.desCorta || 'N/A'}
  </span>
 </div>
 {proveedor.descAlterna && (
  <div className="flex items-center justify-between text-sm">
  <span className="text-muted-foreground">Descripción Alterna:</span>
  <span className="text-foreground font-medium">
  {proveedor.descAlterna}
  </span>
  </div>
 )}
 <div className="flex items-center justify-between text-sm">
  <span className="text-muted-foreground">Código Compañía:</span>
  <span className="text-foreground font-medium">
  {proveedor.codCia}
  </span>
 </div>
 </div>
 </CardContent>
 </Card>
 </Link>
 ))}
 </div>
 </div>
 );
}
