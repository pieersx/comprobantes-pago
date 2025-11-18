"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clientesService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import {
    Download,
    Filter,
    Loader2,
    Plus,
    Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClientesPage() {
 const [searchTerm, setSearchTerm] = useState("");

 const { data: clientes = [], isLoading } = useQuery({
 queryKey: ["clientes"],
 queryFn: () => clientesService.getAll(),
 });

 const filteredClientes = clientes.filter(
 (cliente) =>
 cliente.desPersona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 cliente.nroRuc?.includes(searchTerm) ||
 String(cliente.codCliente).includes(searchTerm)
 );

 const getStatusColor = (vigente: string) => {
 return vigente === "S"
 ? "bg-green-100 text-green-700"
 : "bg-muted text-gray-700";
 };

 if (isLoading) {
 return (
 <div className="flex h-[450px] items-center justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-foreground">
 Clientes
 </h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Gestiona todos los clientes y sus proyectos
 </p>
 </div>
 <Button asChild>
 <Link href="/clientes/nuevo">
 <Plus className="h-4 w-4" />
 Nuevo Cliente
 </Link>
 </Button>
 </div>

 {/* Stats */}
 <div className="grid gap-4 md:grid-cols-4">
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Total Clientes
 </p>
 <p className="mt-2 text-3xl font-bold text-blue-600">
 {clientes.length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Clientes Activos
 </p>
 <p className="mt-2 text-3xl font-bold text-green-600">
 {clientes.filter((c) => c.vigente === "S").length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 Clientes Inactivos
 </p>
 <p className="mt-2 text-3xl font-bold text-gray-600">
 {clientes.filter((c) => c.vigente === "N").length}
 </p>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="pt-6">
 <div className="text-center">
 <p className="text-sm font-medium text-muted-foreground">
 RUCs Registrados
 </p>
 <p className="mt-2 text-3xl font-bold text-purple-600">
 {clientes.filter((c) => c.nroRuc).length}
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

 {/* Clientes Grid */}
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {filteredClientes.length === 0 ? (
 <div className="text-center py-8 text-muted-foreground">
 No hay clientes registrados
 </div>
 ) : (
 filteredClientes.map((cliente) => (
 <Link key={`${cliente.codCia}-${cliente.codCliente}`} href={`/clientes/${cliente.codCia}-${cliente.codCliente}`}>
 <Card className="hover:shadow-md transition-shadow cursor-pointer">
 <CardHeader>
 <div className="flex items-start justify-between">
 <div className="mt-3">
  <CardTitle className="text-lg leading-tight">
  {cliente.desPersona || 'Sin nombre'}
  </CardTitle>
  <p className="mt-1 text-sm text-muted-foreground">
  CLI-{String(cliente.codCliente).padStart(3, '0')} • RUC: {cliente.nroRuc || 'N/A'}
  </p>
 </div>
 <span
  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
  cliente.vigente
  )}`}
 >
  {cliente.vigente === 'S' ? 'Activo' : 'Inactivo'}
 </span>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-2">
 <div className="text-sm">
  <span className="text-muted-foreground">Descripción Corta:</span>
  <span className="ml-2 text-foreground">{cliente.desCorta || 'N/A'}</span>
 </div>
 {cliente.descAlterna && (
  <div className="text-sm">
  <span className="text-muted-foreground">Descripción Alterna:</span>
  <span className="ml-2 text-foreground">{cliente.descAlterna}</span>
  </div>
 )}
 </div>
 </CardContent>
 </Card>
 </Link>
 ))
 )}
 </div>
 </div>
 );
}
