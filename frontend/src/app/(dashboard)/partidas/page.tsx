'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { partidasService } from '@/services/partidas.service';
import { Partida } from '@/types/database';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Edit,
    ListTree,
    Loader2,
    Plus,
    Search,
    Trash2,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PartidaForm {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  codPartidas: string;
  desPartida: string;
  flgCC: string;
  nivel: number;
  tUniMed: string;
  eUniMed: string;
  semilla: number;
  vigente: string;
}

const initialFormState: PartidaForm = {
  codCia: 1,
  ingEgr: 'E',
  codPartida: 0,
  codPartidas: '',
  desPartida: '',
  flgCC: 'N',
  nivel: 1,
  tUniMed: '012',
  eUniMed: '001',
  semilla: 0,
  vigente: '1',
};

export default function PartidasPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PartidaForm>(initialFormState);
  const [selectedItem, setSelectedItem] = useState<Partida | null>(null);

  // Obtener partidas
  const {
    data: partidas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => partidasService.getAll(1),
  });

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: partidasService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear partida');
    },
  });

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: PartidaForm) =>
      partidasService.update(data.codCia, data.ingEgr, data.codPartida, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida actualizada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar partida');
    },
  });

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (item: Partida) => partidasService.delete(item.codCia, item.ingEgr, item.codPartida),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida eliminada exitosamente');
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar partida');
    },
  });

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Partida) => {
    setFormData({
      codCia: item.codCia,
      ingEgr: item.ingEgr,
      codPartida: item.codPartida,
      codPartidas: item.codPartidas || '',
      desPartida: item.desPartida || '',
      flgCC: item.flgCC || 'N',
      nivel: item.nivel || 1,
      tUniMed: item.tuniMed || '012',
      eUniMed: item.euniMed || '001',
      semilla: item.semilla || 0,
      vigente: item.vigente || '1',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: Partida) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.desPartida.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }
    if (!formData.codPartidas.trim()) {
      toast.error('El código de partida es obligatorio');
      return;
    }
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredPartidas = partidas.filter((partida: Partida) => {
    const matchesSearch =
      partida.desPartida?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partida.codPartidas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(partida.codPartida).includes(searchTerm);

    const matchesTipo = filterTipo === 'all' || partida.ingEgr === filterTipo;

    return matchesSearch && matchesTipo;
  });

  const stats = {
    total: partidas.length,
    ingresos: partidas.filter((p: Partida) => p.ingEgr === 'I').length,
    egresos: partidas.filter((p: Partida) => p.ingEgr === 'E').length,
    activas: partidas.filter((p: Partida) => p.vigente === 'S' || p.vigente === '1').length,
  };

  const getTipoColor = (ingEgr: string) => {
    return ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getTipoIcon = (ingEgr: string) => {
    return ingEgr === 'I' ? TrendingUp : TrendingDown;
  };

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar partidas. Verifica que el backend esté corriendo.</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partidas Presupuestales</h1>
          <p className="text-muted-foreground">Gestión de partidas contables - Ingresos y Egresos</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partidas</CardTitle>
            <ListTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ingresos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.egresos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="I">Ingresos</SelectItem>
            <SelectItem value="E">Egresos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de Partidas */}
      <Card>
        <CardContent className="p-0">
          {partidas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay partidas registradas</p>
              <p className="text-sm">Las partidas aparecerán aquí cuando se registren en el sistema</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Código Partida</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Unidad Medida</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartidas.map((partida: Partida) => {
                  const TipoIcon = getTipoIcon(partida.ingEgr);
                  return (
                    <TableRow key={`${partida.codCia}-${partida.ingEgr}-${partida.codPartida}`}>
                      <TableCell>
                        <Badge className={getTipoColor(partida.ingEgr)}>
                          <TipoIcon className="h-3 w-3 mr-1" />
                          {partida.ingEgr === 'I' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono font-medium">{partida.codPartida}</TableCell>
                      <TableCell className="font-mono text-sm">{partida.codPartidas}</TableCell>
                      <TableCell className="font-medium">{partida.desPartida}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{partida.euniMed || partida.tuniMed}</Badge>
                      </TableCell>
                      <TableCell>{partida.nivel}</TableCell>
                      <TableCell>
                        <Badge variant={partida.vigente === 'S' || partida.vigente === '1' ? 'default' : 'secondary'}>
                          {partida.vigente === 'S' || partida.vigente === '1' ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(partida)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(partida)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {filteredPartidas.length === 0 && partidas.length > 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No se encontraron partidas que coincidan con la búsqueda
          </CardContent>
        </Card>
      )}

      {/* Dialog para Crear/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Partida</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica los datos de la partida' : 'Ingresa los datos para crear una nueva partida'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.ingEgr}
                  onValueChange={(value) => setFormData({ ...formData, ingEgr: value })}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">Ingreso</SelectItem>
                    <SelectItem value="E">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Código Numérico</Label>
                <Input
                  type="number"
                  value={formData.codPartida}
                  onChange={(e) => setFormData({ ...formData, codPartida: Number(e.target.value) })}
                  disabled={isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Código de Partida</Label>
              <Input
                value={formData.codPartidas}
                onChange={(e) => setFormData({ ...formData, codPartidas: e.target.value })}
                placeholder="Ej: EGR-001-01"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={formData.desPartida}
                onChange={(e) => setFormData({ ...formData, desPartida: e.target.value })}
                placeholder="Descripción de la partida"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select
                  value={String(formData.nivel)}
                  onValueChange={(value) => setFormData({ ...formData, nivel: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nivel 1</SelectItem>
                    <SelectItem value="2">Nivel 2</SelectItem>
                    <SelectItem value="3">Nivel 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.vigente}
                  onValueChange={(value) => setFormData({ ...formData, vigente: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="0">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tab. Unidad Med.</Label>
                <Input
                  value={formData.tUniMed}
                  onChange={(e) => setFormData({ ...formData, tUniMed: e.target.value })}
                  placeholder="012"
                />
              </div>
              <div className="space-y-2">
                <Label>Elem. Unidad Med.</Label>
                <Input
                  value={formData.eUniMed}
                  onChange={(e) => setFormData({ ...formData, eUniMed: e.target.value })}
                  placeholder="001"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Eliminar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la partida{' '}
              <strong>{selectedItem?.desPartida}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
