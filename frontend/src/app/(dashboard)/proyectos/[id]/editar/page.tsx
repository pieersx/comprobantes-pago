"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientesService, proyectosService } from "@/services/entities.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditarProyectoPage() {
  const router = useRouter();
  const params = useParams();
  const proyectoId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    codCia: 0,
    codPyto: 0,
    nombPyto: "",
    codCliente: "",
    emplJefeProy: "",
    ciaContrata: 0,
    fecReg: "",
    annoIni: new Date().getFullYear(),
    annoFin: new Date().getFullYear() + 1,
    valRefer: "",
    costoTotal: "",
    observac: "",
    vigente: "S",
  });

  // Cargar datos del proyecto
  const { data: proyecto, isLoading: proyectoLoading } = useQuery({
    queryKey: ["proyecto", proyectoId],
    queryFn: async () => {
      const [codCia, codPyto] = proyectoId.split("-").map(Number);
      return await proyectosService.getById(codCia, codPyto);
    },
    enabled: !!proyectoId,
  });

  // Cargar clientes activos
  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes", "activos"],
    queryFn: () => clientesService.getActivos(),
  });

  // Cargar datos del proyecto en el formulario
  useEffect(() => {
    if (proyecto) {
      setFormData({
        codCia: proyecto.codCia,
        codPyto: proyecto.codPyto,
        nombPyto: proyecto.nombPyto || "",
        codCliente: proyecto.codCliente?.toString() || "",
        emplJefeProy: proyecto.empljefeproy?.toString() || "",
        ciaContrata: proyecto.ciaContrata || proyecto.codCia,
        fecReg: proyecto.fecReg ? new Date(proyecto.fecReg).toISOString().split('T')[0] : "",
        annoIni: proyecto.annoIni || new Date().getFullYear(),
        annoFin: proyecto.annoFin || new Date().getFullYear() + 1,
        valRefer: proyecto.valRefer?.toString() || "",
        costoTotal: proyecto.costoTotal?.toString() || "",
        observac: proyecto.observac || "",
        vigente: proyecto.vigente || "S",
      });
      setInitialLoading(false);
    }
  }, [proyecto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!formData.nombPyto.trim()) {
        toast.error("El nombre del proyecto es obligatorio");
        return;
      }

      if (!formData.codCliente) {
        toast.error("Debe seleccionar un cliente");
        return;
      }

      if (formData.annoFin < formData.annoIni) {
        toast.error("El año de fin debe ser mayor o igual al año de inicio");
        return;
      }

      // Preparar datos para enviar
      const proyectoData = {
        codCia: formData.codCia,
        codPyto: formData.codPyto,
        nombPyto: formData.nombPyto,
        codCliente: parseInt(formData.codCliente),
        emplJefeProy: formData.emplJefeProy ? parseInt(formData.emplJefeProy) : 1,
        ciaContrata: formData.ciaContrata,
        fecReg: formData.fecReg,
        annoIni: formData.annoIni,
        annoFin: formData.annoFin,
        valRefer: formData.valRefer ? parseFloat(formData.valRefer) : 0,
        costoTotal: formData.costoTotal ? parseFloat(formData.costoTotal) : 0,
        observac: formData.observac || null,
        vigente: formData.vigente,
        // Mantener campos existentes
        codCia1: formData.codCia,
        flgEmpConsorcio: proyecto?.flgEmpConsorcio || "N",
        codFase: proyecto?.codFase || 1,
        codNivel: proyecto?.codNivel || 1,
        estPyto: proyecto?.estPyto || 1,
        tabEstado: proyecto?.tabEstado || "001",
        codEstado: proyecto?.codEstado || "ACT",
      };

      await proyectosService.update(formData.codCia, formData.codPyto, proyectoData);

      toast.success("Proyecto actualizado exitosamente");
      router.push(`/proyectos/${proyectoId}`);
    } catch (error: any) {
      console.error("Error al actualizar proyecto:", error);
      toast.error(error.message || "Error al actualizar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (proyectoLoading || initialLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Proyecto no encontrado</h1>
          <Link href="/proyectos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se pudo cargar la información del proyecto
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Editar Proyecto
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Código: {formData.codCia}-{formData.codPyto}
          </p>
        </div>
        <Link href={`/proyectos/${proyectoId}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Nombre del Proyecto */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nombPyto">
                    Nombre del Proyecto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombPyto"
                    name="nombPyto"
                    type="text"
                    placeholder="Ej: Construcción de Puente Peatonal"
                    value={formData.nombPyto}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                  />
                </div>

                {/* Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="codCliente">
                    Cliente <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="codCliente"
                    name="codCliente"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.codCliente}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option
                        key={`${cliente.codCia}-${cliente.codCliente}`}
                        value={cliente.codCliente}
                      >
                        {cliente.desPersona || cliente.desCorta} - RUC: {cliente.nroRuc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jefe de Proyecto */}
                <div className="space-y-2">
                  <Label htmlFor="emplJefeProy">
                    Código Jefe de Proyecto
                  </Label>
                  <Input
                    id="emplJefeProy"
                    name="emplJefeProy"
                    type="number"
                    placeholder="1"
                    value={formData.emplJefeProy}
                    onChange={handleChange}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional - Por defecto: 1
                  </p>
                </div>

                {/* Fecha de Registro */}
                <div className="space-y-2">
                  <Label htmlFor="fecReg">
                    Fecha de Registro <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fecReg"
                    name="fecReg"
                    type="date"
                    value={formData.fecReg}
                    onChange={handleChange}
                    required
                  />
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
            </CardContent>
          </Card>

          {/* Información Temporal */}
          <Card>
            <CardHeader>
              <CardTitle>Período del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Año Inicio */}
                <div className="space-y-2">
                  <Label htmlFor="annoIni">
                    Año de Inicio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="annoIni"
                    name="annoIni"
                    type="number"
                    placeholder="2024"
                    value={formData.annoIni}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2100"
                  />
                </div>

                {/* Año Fin */}
                <div className="space-y-2">
                  <Label htmlFor="annoFin">
                    Año de Fin <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="annoFin"
                    name="annoFin"
                    type="number"
                    placeholder="2025"
                    value={formData.annoFin}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Financiera */}
          <Card>
            <CardHeader>
              <CardTitle>Información Financiera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Valor de Referencia */}
                <div className="space-y-2">
                  <Label htmlFor="valRefer">Valor de Referencia (S/)</Label>
                  <Input
                    id="valRefer"
                    name="valRefer"
                    type="number"
                    placeholder="0.00"
                    value={formData.valRefer}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Costo Total */}
                <div className="space-y-2">
                  <Label htmlFor="costoTotal">Costo Total (S/)</Label>
                  <Input
                    id="costoTotal"
                    name="costoTotal"
                    type="number"
                    placeholder="0.00"
                    value={formData.costoTotal}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observac">Observaciones</Label>
                <Textarea
                  id="observac"
                  name="observac"
                  placeholder="Ingrese observaciones adicionales sobre el proyecto..."
                  value={formData.observac}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Link href={`/proyectos/${proyectoId}`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
