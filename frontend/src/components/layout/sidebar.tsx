'use client';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Building2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    FolderKanban,
    Layers,
    LayoutDashboard,
    ListTree,
    Package,
    Settings,
    Shuffle,
    TrendingDown,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Navegación principal
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Comprobantes', href: '/comprobantes', icon: FileText },
  { name: 'Ingresos', href: '/ingresos', icon: TrendingUp },
  { name: 'Egresos', href: '/egresos', icon: TrendingDown },
  { name: 'Flujo de Caja', href: '/flujo-caja', icon: Wallet },
  { name: 'Proyectos', href: '/proyectos', icon: FolderKanban },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Proveedores', href: '/proveedores', icon: Building2 },
  { name: 'Empleados', href: '/empleados', icon: Users },
];

// Submenú de Partidas
const partidasSubmenu = [
  { name: 'Partidas', href: '/partidas', icon: Package },
  { name: 'Partida Mezcla', href: '/partida-mezcla', icon: Shuffle },
  { name: 'Proy. Partida', href: '/proy-partida', icon: Layers },
  { name: 'Proy. Partida Mezcla', href: '/proy-partida-mezcla', icon: ListTree },
];

// Navegación secundaria
const secondaryNavigation = [
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const [partidasOpen, setPartidasOpen] = useState(
    pathname.includes('/partida') || pathname.includes('/proy-partida')
  );

  const isPartidaActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white transition-all duration-300 lg:static',
          open ? 'w-64' : 'w-0 lg:w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {open && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold">CompPago</span>
                <span className="text-xs text-muted-foreground">v1.0</span>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className={cn('hidden lg:flex', !open && 'mx-auto')}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {/* Navegación principal */}
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  !open && 'justify-center'
                )}
                title={!open ? item.name : undefined}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
                {open && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Submenú de Partidas */}
          {open ? (
            <Collapsible open={partidasOpen} onOpenChange={setPartidasOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    partidasOpen || pathname.includes('/partida')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Package className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Partidas</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      partidasOpen && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4 pt-1">
                {partidasSubmenu.map((item) => {
                  const isActive = isPartidaActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              href="/partidas"
              className={cn(
                'flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                pathname.includes('/partida')
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title="Partidas"
            >
              <Package className="h-5 w-5 flex-shrink-0" />
            </Link>
          )}

          {/* Navegación secundaria */}
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  !open && 'justify-center'
                )}
                title={!open ? item.name : undefined}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
                {open && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {open && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-900">Sistema de Gestión</p>
              <p className="text-xs text-blue-700 mt-1">Comprobantes de Pago</p>
              <p className="text-xs text-blue-600 mt-1">Versión 1.0.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
