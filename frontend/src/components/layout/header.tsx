'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, User } from 'lucide-react';
import { CompanySelector } from './company-selector';
import { GlobalSearch } from './global-search';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      {/* Left side - Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <GlobalSearch />
      </div>

      {/* Center - Company Selector */}
      <div className="flex items-center justify-center px-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Compañía:</span>
          <CompanySelector />
        </div>
      </div>

      {/* Right side - Notifications + User */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="space-y-1 p-2">
                <div className="rounded-lg border bg-blue-50 border-blue-200 p-3 text-sm hover:bg-blue-100 transition-colors cursor-pointer">
                  <p className="font-medium text-blue-900">Comprobante pendiente</p>
                  <p className="text-blue-700 text-xs mt-1">CP-001 requiere aprobación</p>
                  <p className="text-blue-600 text-xs mt-1">Hace 2 horas</p>
                </div>
                <div className="rounded-lg border p-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="font-medium">Pago registrado</p>
                  <p className="text-muted-foreground text-xs mt-1">Se registró el pago de CP-045</p>
                  <p className="text-muted-foreground text-xs mt-1">Hace 5 horas</p>
                </div>
                <div className="rounded-lg border p-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="font-medium">Nuevo proyecto</p>
                  <p className="text-muted-foreground text-xs mt-1">Se creó el proyecto "Construcción Norte"</p>
                  <p className="text-muted-foreground text-xs mt-1">Hace 1 día</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm">
                Ver todas las notificaciones
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Usuario Admin</p>
                <p className="text-xs text-muted-foreground">admin@comprobantes.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
