"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clientesService } from "@/services/entities.service";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NuevoClientePage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
 codCia: 1,
 codCliente: 0,
 desPersona: "",
 desCorta: "",
 nroRuc: "",
 vigente: "S",
 });

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);

 try {
 // Validaciones
 if (!formData.nroRuc || formData.nroRuc.length !== 11) {
 toast.error("El RUC debe tener 11 dígitos");
 return;
 }

 if (!formData.desPersona.trim()) {
 toast.error("La razón social es obligatoria");
 return;
 }

 if (!formData.desCorta.trim()) {
 toast.error("El nombre corto es obligatorio");
 return;
 }

 // Preparar datos para enviar
 const clienteData = {
 codCia: formData.codCia,
 codCliente: formData.codCliente || Date.now(), // Generar código si no se proporciona
 desPersona: formData.desPersona,
 desCorta: formData.desCorta,
 nroRuc: formData.nroRuc,
 vigente: formData.vigente,
 };

 await clientesService.create(clienteData);

 toast.success("Cliente creado exitosamente");
 router.push("/clientes");
 } catch (error: any) {
 console.error("Error al crear cliente:", error);
 toast.error(error.message || "Error al crear el cliente");
 } finally {
 setLoading(false);
 }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
 setFormData({
 ...formData,
 [e.target.name]: e.target.value,
 });
 };

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-foreground">
 Nuevo Cliente
 </h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Registra un nuevo cliente en el sistema
 </p>
 </div>
 <Link href="/clientes">
 <Button variant="outline">
 <ArrowLeft className="mr-2 h-4 w-4" />
 Volver
 </Button>
 </Link>
 </div>

 {/* Formulario */}
 <Card>
 <CardHeader>
 <CardTitle>Datos del Cliente</CardTitle>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid gap-6 md:grid-cols-2">
 {/* RUC */}
 <div className="space-y-2">
 <label htmlFor="nroRuc" className="text-sm font-medium text-foreground">
  RUC <span className="text-destructive">*</span>
 </label>
 <Input
  id="nroRuc"
  name="nroRuc"
  type="text"
  placeholder="20123456789"
  maxLength={11}
  value={formData.nroRuc}
  onChange={handleChange}
  required
 />
 </div>

 {/* Razón Social */}
 <div className="space-y-2">
 <label htmlFor="desPersona" className="text-sm font-medium text-foreground">
  Razón Social <span className="text-destructive">*</span>
 </label>
 <Input
  id="desPersona"
  name="desPersona"
  type="text"
  placeholder="Nombre completo del cliente"
  value={formData.desPersona}
  onChange={handleChange}
  required
 />
 </div>

 {/* Nombre Corto */}
 <div className="space-y-2">
 <label htmlFor="desCorta" className="text-sm font-medium text-foreground">
  Nombre Corto <span className="text-destructive">*</span>
 </label>
 <Input
  id="desCorta"
  name="desCorta"
  type="text"
  placeholder="Nombre corto"
  maxLength={30}
  value={formData.desCorta}
  onChange={handleChange}
  required
 />
 </div>

 {/* Estado */}
 <div className="space-y-2">
 <label htmlFor="vigente" className="text-sm font-medium text-foreground">
  Estado
 </label>
 <select
  id="vigente"
  name="vigente"
  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  value={formData.vigente}
  onChange={(e) =>
  setFormData({ ...formData, vigente: e.target.value })
  }
 >
  <option value="S">Activo</option>
  <option value="N">Inactivo</option>
 </select>
 </div>
 </div>

 {/* Botones */}
 <div className="flex justify-end gap-4">
 <Link href="/clientes">
 <Button type="button" variant="outline">
  Cancelar
 </Button>
 </Link>
 <Button type="submit" disabled={loading}>
 <Save className="mr-2 h-4 w-4" />
 {loading ? "Guardando..." : "Guardar Cliente"}
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>
 </div>
 );
}
