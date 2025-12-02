"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { empleadosService } from "@/services/empleados.service";
import { Empleado, EmpleadoCreate, EmpleadoUpdate } from "@/types/empleado";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validación
const empleadoSchema = z.object({
  desPersona: z.string().min(1, "El nombre es obligatorio").max(100),
  desCorta: z.string().max(50).optional(),
  direcc: z.string().min(1, "La dirección es obligatoria").max(100),
  celular: z.string().min(1, "El celular es obligatorio").max(33),
  dni: z.string().min(1, "El DNI es obligatorio").max(20).regex(/^[0-9]+$/, "El DNI debe contener solo números"),
  email: z.string().email("Email inválido").max(100),
  fecNac: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  hobby: z.string().max(2000).optional(),
  nroCip: z.string().max(10).optional(),
  fecCipVig: z.string().optional(),
  licCond: z.enum(["S", "N"]).optional(),
  flgEmplIea: z.enum(["S", "N"]).optional(),
  observac: z.string().max(300).optional(),
  codCargo: z.number().optional(),
  vigente: z.enum(["S", "N"]).default("S"),
});

type EmpleadoFormData = z.infer<typeof empleadoSchema>;

interface EmpleadoFormProps {
  empleado?: Empleado;
  onSubmit: (data: EmpleadoCreate | EmpleadoUpdate) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function EmpleadoForm({ empleado, onSubmit, isLoading, mode }: EmpleadoFormProps) {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      desPersona: empleado?.desPersona || "",
      desCorta: empleado?.desCorta || "",
      direcc: empleado?.direcc || "",
      celular: empleado?.celular || "",
      dni: empleado?.dni || "",
      email: empleado?.email || "",
      fecNac: empleado?.fecNac || "",
      hobby: empleado?.hobby || "",
      nroCip: empleado?.nroCip || "",
      fecCipVig: empleado?.fecCipVig || "",
      licCond: (empleado?.licCond as "S" | "N") || "N",
      flgEmplIea: (empleado?.flgEmplIea as "S" | "N") || "N",
      observac: empleado?.observac || "",
      vigente: (empleado?.vigente as "S" | "N") || "S",
    },
  });

  // Cargar foto existente
  useEffect(() => {
    if (empleado?.tieneFoto) {
      setFotoPreview(empleadosService.getFotoUrl(empleado.codCia, empleado.codEmpleado));
    }
  }, [empleado]);


  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no puede exceder 10MB");
      return;
    }

    // Validar tipo
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG o PNG");
      return;
    }

    setFotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (data: EmpleadoFormData) => {
    try {
      // Primero guardar el empleado
      await onSubmit({
        codCia: empleado?.codCia || 1,
        codEmpleado: empleado?.codEmpleado || 0,
        ...data,
      });

      // Si hay foto nueva y estamos editando, subirla
      if (fotoFile && mode === "edit" && empleado) {
        setUploadingFoto(true);
        await empleadosService.uploadFoto(empleado.codCia, empleado.codEmpleado, fotoFile);
        toast.success("Foto actualizada correctamente");
        setUploadingFoto(false);
      }
    } catch (error) {
      setUploadingFoto(false);
      throw error;
    }
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Foto del empleado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Foto del Empleado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {fotoPreview ? (
                <AvatarImage src={fotoPreview} alt="Foto del empleado" />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(watch("desPersona"))}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFotoChange}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFoto}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {fotoPreview ? "Cambiar Foto" : "Subir Foto"}
                </Button>
                {fotoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeFoto}
                    disabled={uploadingFoto}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Quitar
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG o PNG. Máximo 10MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos personales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="desPersona">Nombre Completo *</Label>
            <Input
              id="desPersona"
              {...register("desPersona")}
              placeholder="Juan Pérez García"
            />
            {errors.desPersona && (
              <p className="text-sm text-red-500">{errors.desPersona.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="desCorta">Nombre Corto</Label>
            <Input
              id="desCorta"
              {...register("desCorta")}
              placeholder="Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI *</Label>
            <Input
              id="dni"
              {...register("dni")}
              placeholder="12345678"
              maxLength={20}
            />
            {errors.dni && (
              <p className="text-sm text-red-500">{errors.dni.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecNac">Fecha de Nacimiento *</Label>
            <Input
              id="fecNac"
              type="date"
              {...register("fecNac")}
            />
            {errors.fecNac && (
              <p className="text-sm text-red-500">{errors.fecNac.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="juan@ejemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular">Celular *</Label>
            <Input
              id="celular"
              {...register("celular")}
              placeholder="+51 999 999 999"
            />
            {errors.celular && (
              <p className="text-sm text-red-500">{errors.celular.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direcc">Dirección *</Label>
            <Input
              id="direcc"
              {...register("direcc")}
              placeholder="Av. Principal 123, Lima"
            />
            {errors.direcc && (
              <p className="text-sm text-red-500">{errors.direcc.message}</p>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Datos adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos Adicionales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nroCip">Número CIP</Label>
            <Input
              id="nroCip"
              {...register("nroCip")}
              placeholder="123456"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecCipVig">Vigencia CIP</Label>
            <Input
              id="fecCipVig"
              type="date"
              {...register("fecCipVig")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licCond">Licencia de Conducir</Label>
            <Select
              value={watch("licCond")}
              onValueChange={(value) => setValue("licCond", value as "S" | "N")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Sí</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="flgEmplIea">Empleado IEA</Label>
            <Select
              value={watch("flgEmplIea")}
              onValueChange={(value) => setValue("flgEmplIea", value as "S" | "N")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Sí</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vigente">Estado</Label>
            <Select
              value={watch("vigente")}
              onValueChange={(value) => setValue("vigente", value as "S" | "N")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Activo</SelectItem>
                <SelectItem value="N">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hobby">Hobby / Intereses</Label>
            <Textarea
              id="hobby"
              {...register("hobby")}
              placeholder="Deportes, lectura, música..."
              rows={2}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observac">Observaciones</Label>
            <Textarea
              id="observac"
              {...register("observac")}
              placeholder="Notas adicionales..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || uploadingFoto}>
          {(isLoading || uploadingFoto) && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          {mode === "create" ? "Crear Empleado" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
