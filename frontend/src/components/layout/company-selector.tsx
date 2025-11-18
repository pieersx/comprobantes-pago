"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { catalogosService } from "@/services/comprobantes.service";
import { useAppStore } from "@/store/useAppStore";
import type { Compania } from "@/types/comprobante";

interface CompanySelectorProps {
  className?: string;
}

export function CompanySelector({ className }: CompanySelectorProps) {
  const { companiaActual, setCompaniaActual } = useAppStore();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const {
    data: companias = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Compania[]>({
    queryKey: ["companias"],
    queryFn: () => catalogosService.getCompanias(),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!companias.length) {
      return;
    }

    if (!companiaActual) {
      setCompaniaActual(companias[0]);
      return;
    }

    const exists = companias.some((comp) => comp.codCia === companiaActual.codCia);
    if (!exists) {
      setCompaniaActual(companias[0]);
    }
  }, [companiaActual, companias, setCompaniaActual]);

  if (isLoading) {
    return (
      <div className={cn("h-9 w-48 animate-pulse rounded-lg bg-gray-100", className)} />
    );
  }

  if (isError || !companias.length) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
        onClick={() => refetch()}
      >
        <Building2 className="h-4 w-4" />
        Cargar compañías
      </Button>
    );
  }

  const handleSelect = (compania: Compania) => {
    setCompaniaActual(compania);
    setOpen(false);
    toast({
      title: "Compañía cambiada",
      description: `Ahora estás viendo datos de: ${compania.desCia}`,
      duration: 3000,
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-8 gap-2 px-2 hover:bg-blue-100 border-0",
            className
          )}
        >
          <span className="text-sm font-semibold text-blue-900">
            {companiaActual?.desCorta || "Seleccionar"}
          </span>
          <ChevronDown className="h-3 w-3 text-blue-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">
          Seleccionar Compañía
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {companias.map((compania) => {
            const isSelected = companiaActual?.codCia === compania.codCia;
            return (
              <DropdownMenuItem
                key={compania.codCia}
                onClick={() => handleSelect(compania)}
                className={cn(
                  "flex items-start gap-2 p-3 cursor-pointer",
                  isSelected && "bg-blue-50"
                )}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-medium truncate",
                    isSelected ? "text-blue-900" : "text-gray-900"
                  )}>
                    {compania.desCia}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    Código {compania.codCia} • {compania.desCorta}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
