'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { comprobantesUnifiedService } from '@/services/comprobantes-unified.service';
import {
    comprobantesEgresoService,
    comprobantesIngresoService,
} from '@/services/comprobantes.service';
import { useAppStore } from '@/store/useAppStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, Edit, Eye, FileX, Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Comprobante {
  nroCP: string;
  codProveedor: number;
  codEmpleado?: number; // Feature: empleados-comprobantes-blob
  proveedor: string;
  codPyto: number;
  proyecto: string;
  fecCP: string;
  impTotalMn: number;
  estado: string;
  tipo: string;
}

export default function ComprobantesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [anularDialogOpen, setAnularDialogOpen] = useState(false);
  const [comprobanteToAnular, setComprobanteToAnular] = useState<Comprobante | null>(null);
  const [anulando, setAnulando] = useState(false);

  const companiaActual = useAppStore((state) => state.companiaActual);
  const codCia = companiaActual?.codCia ? Number(companiaActual.codCia) : 1;
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comprobantes = [], isLoading } = useQuery({
    queryKey: ['comprobantes', codCia],
    queryFn: () => comprobantesUnifiedService.getAll(codCia),
  });

  // Leer parámetro de búsqueda de la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        setGlobalFilter(searchQuery);
      }
    }
  }, []);

  // Función para generar el ID del comprobante
  // Feature: empleados-comprobantes-blob - Soporte para comprobantes de empleados
  const getComprobanteId = (comprobante: Comprobante) => {
    if (comprobante.tipo === 'EGRESO') {
      // Validar que codProveedor sea un número válido
      const codProv = comprobante.codProveedor || 0;
      return `egreso-${codProv}-${comprobante.nroCP}`;
    } else if (comprobante.tipo === 'EGRESO_EMPLEADO') {
      const codEmp = (comprobante as any).codEmpleado || 0;
      return `egreso-empleado-${codEmp}-${comprobante.nroCP}`;
    } else {
      return `ingreso-${comprobante.nroCP}`;
    }
  };

  // Función para anular comprobante
  const handleAnular = async () => {
    if (!comprobanteToAnular) return;

    try {
      setAnulando(true);

      if (comprobanteToAnular.tipo === 'EGRESO') {
        await comprobantesEgresoService.anular(
          codCia,
          comprobanteToAnular.codProveedor,
          comprobanteToAnular.nroCP
        );
      } else {
        await comprobantesIngresoService.anular(codCia, comprobanteToAnular.nroCP);
      }

      toast({
        title: 'Comprobante anulado',
        description: 'El comprobante ha sido anulado exitosamente',
      });

      // Refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['comprobantes', codCia] });
      setAnularDialogOpen(false);
      setComprobanteToAnular(null);
    } catch (error: any) {
      console.error('Error al anular comprobante:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo anular el comprobante',
        variant: 'destructive',
      });
    } finally {
      setAnulando(false);
    }
  };

  const columns: ColumnDef<Comprobante>[] = [
    {
      accessorKey: 'nroCP',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nro. Comprobante
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue('nroCP')}</div>,
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = row.getValue('tipo') as string;
        // Feature: empleados-comprobantes-blob - Soporte para tipo EGRESO_EMPLEADO
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
          'INGRESO': 'default',
          'EGRESO': 'secondary',
          'EGRESO_EMPLEADO': 'outline',
        };
        const labels: Record<string, string> = {
          'INGRESO': 'INGRESO',
          'EGRESO': 'EGRESO',
          'EGRESO_EMPLEADO': 'EGRESO EMP.',
        };
        return (
          <Badge variant={variants[tipo] || 'secondary'}>
            {labels[tipo] || tipo}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'proveedor',
      header: 'Proveedor/Cliente',
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('proveedor')}</div>,
    },
    {
      accessorKey: 'proyecto',
      header: 'Proyecto',
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('proyecto')}</div>,
    },
    {
      accessorKey: 'fecCP',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('fecCP'));
        return <div>{date.toLocaleDateString('es-PE')}</div>;
      },
    },
    {
      accessorKey: 'impTotalMn',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Monto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('impTotalMn'));
        const formatted = new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as string;
        // Estados según la base de datos: '001' = Registrado, '002' = Pagado, '003' = Anulado
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
          '001': 'outline',      // Registrado
          '002': 'default',      // Pagado
          '003': 'destructive',  // Anulado
          // Mantener compatibilidad con códigos antiguos
          PAG: 'default',
          PEN: 'secondary',
          REG: 'outline',
          ANU: 'destructive',
        };
        const labels: Record<string, string> = {
          '001': 'Registrado',
          '002': 'Pagado',
          '003': 'Anulado',
        };
        return <Badge variant={variants[estado] || 'outline'}>{labels[estado] || estado}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const comprobante = row.original;
        const comprobanteId = getComprobanteId(comprobante);
        // Estados normalizados: '001' = Registrado, '002' = Pagado, '003' = Anulado
        const puedeEditar = comprobante.estado !== '002' && comprobante.estado !== '003';
        const puedeAnular = comprobante.estado !== '003';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/comprobantes/${comprobanteId}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </Link>
              </DropdownMenuItem>
              {puedeEditar && (
                <DropdownMenuItem asChild>
                  <Link href={`/comprobantes/${comprobanteId}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
              )}
              {puedeAnular && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setComprobanteToAnular(comprobante);
                      setAnularDialogOpen(true);
                    }}
                  >
                    <FileX className="mr-2 h-4 w-4" />
                    Anular
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: comprobantes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comprobantes</h2>
          <p className="text-muted-foreground">
            Gestiona todos los comprobantes de pago del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/comprobantes/nuevo/egreso">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Egreso
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/comprobantes/nuevo/ingreso">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Comprobantes</CardTitle>
          <CardDescription>
            {comprobantes.length} comprobantes registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar comprobantes..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                comprobantes.length
              )}{' '}
              de {comprobantes.length} resultados
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para anular */}
      <Dialog open={anularDialogOpen} onOpenChange={setAnularDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar anulación</DialogTitle>
            <DialogDescription>
              {comprobanteToAnular?.estado === 'PAG'
                ? `Este comprobante (${comprobanteToAnular?.nroCP}) ya fue pagado. ¿Está seguro que desea anularlo? Esta acción no se puede deshacer.`
                : `¿Está seguro que desea anular el comprobante ${comprobanteToAnular?.nroCP}? Esta acción no se puede deshacer.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAnularDialogOpen(false);
                setComprobanteToAnular(null);
              }}
              disabled={anulando}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleAnular} disabled={anulando}>
              {anulando ? 'Anulando...' : 'Confirmar anulación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
