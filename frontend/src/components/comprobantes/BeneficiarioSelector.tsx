"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { empleadosService } from "@/services/empleados.service";
import { proveedoresService } from "@/services/entities.service";
import { Empleado } from "@/types/empleado";
import { Proveedor } from "@/types/voucher";
import { useQuery } from "@tanstack/react-query";
import { Building2, Loader2, User } from "lucide-react";

export type TipoBeneficiario = "proveedor" | "empleado";

interface BeneficiarioSelectorProps {
  codCia: number;
  tipoBeneficiario: TipoBeneficiario;
  onTipoBeneficiarioChange: (tipo: TipoBeneficiario) => void;
  codProveedor?: number;
  codEmpleado?: number;
  onProveedorChange: (codProveedor: number | undefined) => void;
  onEmpleadoChange: (codEmpleado: number | undefined) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Componente para seleccionar el tipo de beneficiario (Proveedor o Empleado)
 * y el beneficiario específico para comprobantes de egreso.
 *
 * Feature: empleados-comprobantes-blob
 * Requirements: 2.1, 8.2, 8.4
 */
export function BeneficiarioSelector({
  codCia,
  tipoBeneficiario,
  onTipoBeneficiarioChange,
  codProveedor,
  codEmpleado,
  onProveedorChange,
  onEmpleadoChange,
  error,
  disabled = false,
}: BeneficiarioSelectorProps) {
  // Cargar proveedores (vigente='1' porque el profesor usa '1' en lugar de 'S')
  const { data: proveedores = [], isLoading: loadingProveedores } = useQuery({
    queryKey: ["proveedores", codCia],
    queryFn: () => proveedoresService.getAll('1'),
    enabled: tipoBeneficiario === "proveedor",
  });

  // Cargar empleados
  const { data: empleados = [], isLoading: loadingEmpleados } = useQuery({
    queryKey: ["empleados", codCia],
    queryFn: () => empleadosService.getAll(codCia, true),
    enabled: tipoBeneficiario === "empleado",
  });

  // Limpiar selección al cambiar tipo
  const handleTipoChange = (tipo: TipoBeneficiario) => {
    onTipoBeneficiarioChange(tipo);
    if (tipo === "proveedor") {
      onEmpleadoChange(undefined);
    } else {
      onProveedorChange(undefined);
    }
  };

  const isLoading = tipoBeneficiario === "proveedor" ? loadingProveedores : loadingEmpleados;

  return (
    <div className="space-y-4">
      {/* Selector de tipo de beneficiario */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo de Beneficiario *</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={tipoBeneficiario === "proveedor" ? "default" : "outline"}
            onClick={() => handleTipoChange("proveedor")}
            disabled={disabled}
            className={cn(
              "flex-1",
              tipoBeneficiario === "proveedor" && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Proveedor
          </Button>
          <Button
            type="button"
            variant={tipoBeneficiario === "empleado" ? "default" : "outline"}
            onClick={() => handleTipoChange("empleado")}
            disabled={disabled}
            className={cn(
              "flex-1",
              tipoBeneficiario === "empleado" && "bg-green-600 hover:bg-green-700"
            )}
          >
            <User className="h-4 w-4 mr-2" />
            Empleado
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {tipoBeneficiario === "proveedor"
            ? "El pago se registrará como egreso a proveedor"
            : "El pago se registrará como egreso a empleado"}
        </p>
      </div>

      {/* Selector de beneficiario específico */}
      <div className="space-y-2">
        <Label className={error ? "text-destructive" : ""}>
          {tipoBeneficiario === "proveedor" ? "Proveedor" : "Empleado"} *
        </Label>

        {isLoading ? (
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Cargando {tipoBeneficiario === "proveedor" ? "proveedores" : "empleados"}...
            </span>
          </div>
        ) : tipoBeneficiario === "proveedor" ? (
          <Select
            value={codProveedor?.toString() || ""}
            onValueChange={(value) => onProveedorChange(parseInt(value))}
            disabled={disabled}
          >
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder="Seleccione un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {proveedores
                .filter((p: Proveedor) => p.codCia === codCia)
                .map((proveedor: Proveedor) => (
                  <SelectItem
                    key={proveedor.codProveedor}
                    value={proveedor.codProveedor.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{proveedor.desPersona || proveedor.nroRuc}</span>
                      {proveedor.nroRuc && (
                        <span className="text-xs text-muted-foreground">
                          (RUC: {proveedor.nroRuc})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={codEmpleado?.toString() || ""}
            onValueChange={(value) => onEmpleadoChange(parseInt(value))}
            disabled={disabled}
          >
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder="Seleccione un empleado" />
            </SelectTrigger>
            <SelectContent>
              {empleados.map((empleado: Empleado) => (
                <SelectItem
                  key={empleado.codEmpleado}
                  value={empleado.codEmpleado.toString()}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{empleado.desPersona}</span>
                    <span className="text-xs text-muted-foreground">
                      (DNI: {empleado.dni})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
