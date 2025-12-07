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
    mutationFn: (data: PartidaForm) => {
      console.log('=== DATOS ENVIADOS ===');
      console.log('codCia:', data.codCia);
      console.log('ingEgr:', data.ingEgr);
      console.log('codPartida:', data.codPartida);
      console.log('codPartidas:', data.codPartidas);
      console.log('desPartida:', data.desPartida);
      console.log('nivel:', data.nivel);
      console.log('tUniMed:', data.tUniMed, '(tipo:', typeof data.tUniMed + ')');
      console.log('eUniMed:', data.eUniMed, '(tipo:', typeof data.eUniMed + ')');
      console.log('vigente:', data.vigente);
      console.log('=== FIN DATOS ===');
      return partidasService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      toast.success('Partida creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error al crear partida:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear partida';
      toast.error(errorMessage);
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
    const newFormState = { ...initialFormState };
    console.log('Abriendo modal crear con estado inicial:', newFormState);
    setFormData(newFormState);
    setIsEditing(false);
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
    // Validar campos obligatorios
    if (!formData.ingEgr || formData.ingEgr.trim() === '') {
      toast.error('El tipo (Ingreso/Egreso) es obligatorio');
      return;
    }
    if (formData.codPartida === null || formData.codPartida === 0 || isNaN(formData.codPartida)) {
      toast.error('El código numérico es obligatorio y debe ser mayor a 0');
      return;
    }
    if (!formData.desPartida.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }
    if (!formData.codPartidas.trim()) {
      toast.error('El código de partida es obligatorio');
      return;
    }
    if (formData.nivel === null || formData.nivel === 0) {
      toast.error('El nivel es obligatorio');
      return;
    }
    if (!formData.tUniMed || formData.tUniMed.trim() === '') {
      toast.error('La unidad de medida técnica es obligatoria');
      return;
    }
    if (!formData.eUniMed || formData.eUniMed.trim() === '') {
      toast.error('La unidad de medida económica es obligatoria');
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

      {/* Tabla de Partidas - TABLA PARTIDA */}
      <Card>
        <CardHeader className="py-3 bg-yellow-50 border-b">
          <CardTitle className="text-sm font-medium">
            TABLA: PARTIDA (Catálogo Base de Partidas Presupuestales)
          </CardTitle>
        </CardHeader>
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
                <TableRow className="bg-yellow-100/50">
                  <TableHead className="font-bold">CODCIA</TableHead>
                  <TableHead className="font-bold">INGEGR</TableHead>
                  <TableHead className="font-bold">CODPARTIDA</TableHead>
                  <TableHead className="font-bold">CODPARTIDAS</TableHead>
                  <TableHead className="font-bold">DESPARTIDA</TableHead>
                  <TableHead className="font-bold text-center">NIVEL</TableHead>
                  <TableHead className="font-bold">VIGENTE</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartidas
                  .sort((a, b) => {
                    if (a.ingEgr !== b.ingEgr) return a.ingEgr.localeCompare(b.ingEgr);
                    if (a.nivel !== b.nivel) return a.nivel - b.nivel;
                    return a.codPartida - b.codPartida;
                  })
                  .map((partida: Partida) => {
                    const nivelColor = partida.nivel === 1 ? 'bg-yellow-100' : partida.nivel === 2 ? 'bg-orange-100' : 'bg-green-100';
                    return (
                      <TableRow
                        key={`${partida.codCia}-${partida.ingEgr}-${partida.codPartida}`}
                        className={nivelColor}
                      >
                        <TableCell className="font-mono">{partida.codCia}</TableCell>
                        <TableCell>
                          <Badge className={partida.ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {partida.ingEgr}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-bold">{partida.codPartida}</TableCell>
                        <TableCell className="font-mono text-sm">{partida.codPartidas}</TableCell>
                        <TableCell className="max-w-[250px]" title={partida.desPartida}>
                          {partida.desPartida}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            partida.nivel === 1 ? 'bg-yellow-200 text-yellow-800' :
                            partida.nivel === 2 ? 'bg-orange-200 text-orange-800' :
                            'bg-green-200 text-green-800'
                          }>
                            {partida.nivel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={partida.vigente === 'S' || partida.vigente === '1' ? 'default' : 'secondary'}>
                            {partida.vigente}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
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
