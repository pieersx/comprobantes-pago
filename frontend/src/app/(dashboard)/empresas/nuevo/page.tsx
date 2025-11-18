"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companiasService } from "@/services/entities.service";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NuevaEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    desCia: "",
    desCorta: "",
    vigente: "S",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!formData.desCia.trim()) {
        toast.error("La razón social es obligatoria");
        return;
      }

      if (formData.desCia.length > 100) {
        toast.error("La razón social no puede exceder 100 caracteres");
        return;
      }

      if (!formData.desCorta.trim()) {
        toast.error("El nombre corto es obligatorio");
        return;
      }

      if (formData.desCorta.length > 20) {
        toast.error("El nombre corto no puede exceder 20 caracteres");
        return;
      }

      // Preparar datos para enviar
      const companiaData = {
        desCia: formData.desCia,
        desCorta: formData.desCorta,
        vigente: formData.vigente,
      };

      await companiasService.create(companiaData);

      toast.success("Empresa creada exitosamente");
      router.push("/empresas");
    } catch (error: any) {
      console.error("Error al crear empresa:", error);
      toast.error(error.message || "Error al crear la empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nueva Empresa
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra una nueva empresa/compañía en el sistema
          </p>
        </div>
        <Link href="/empresas">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Razón Social */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="desCia">
                  Razón Social <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="desCia"
                  name="desCia"
                  type="text"
                  placeholder="Nombre completo de la empresa"
                  value={formData.desCia}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Máximo 100 caracteres
                </p>
              </div>

              {/* Nombre Corto */}
              <div className="space-y-2">
                <Label htmlFor="desCorta">
                  Nombre Corto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="desCorta"
                  name="desCorta"
                  type="text"
                  placeholder="Nombre abreviado"
                  value={formData.desCorta}
                  onChange={handleChange}
                  required
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  Máximo 20 caracteres
                </p>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="vigente">Estado</Label>
                <select
                  id="vigente"
                  name="vigente"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.vigente}
                  onChange={handleChange}
                >
                  <option value="S">Activo</option>
                  <option value="N">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Link href="/empresas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Guardando..." : "Guardar Empresa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
