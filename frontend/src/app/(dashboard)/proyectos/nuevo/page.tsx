"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientesService, proyectosService } from "@/services/entities.service";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const companiaActual = useAppStore((state) => state.companiaActual);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    codCia: companiaActual?.codCia || 1,
    nombPyto: "",
    codCliente: "",
    emplJefeProy: "",
    ciaContrata: companiaActual?.codCia || 1,
    fecReg: new Date().toISOString().split('T')[0],
    annoIni: new Date().getFullYear(),
    annoFin: new Date().getFullYear() + 1,
    valRefer: "",
    costoTotal: "",
    observac: "",
    vigente: "S",
  });

  // Cargar clientes activos
  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes", "activos"],
    queryFn: () => clientesService.getActivos(),
  });

  useEffect(() => {
    if (companiaActual?.codCia) {
      setFormData(prev => ({
        ...prev,
        codCia: companiaActual.codCia,
        ciaContrata: companiaActual.codCia,
      }));
    }
  }, [companiaActual]);

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
        // Campos opcionales con valores por defecto
        codCia1: formData.codCia,
        flgEmpConsorcio: "N",
        codFase: 1,
        codNivel: 1,
        estPyto: 1,
        tabEstado: "001",
        codEstado: "ACT",
      };

      const response = await proyectosService.create(proyectoData);

      toast.success("Proyecto creado exitosamente");
      router.push("/proyectos");
    } catch (error: any) {
      console.error("Error al crear proyecto:", error);
      toast.error(error.message || "Error al crear el proyecto");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nuevo Proyecto
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra un nuevo proyecto en el sistema
          </p>
        </div>
        <Link href="/proyectos">
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
            <Link href="/proyectos">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Guardando..." : "Guardar Proyecto"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
