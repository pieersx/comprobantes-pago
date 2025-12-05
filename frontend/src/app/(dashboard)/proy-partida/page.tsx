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
import { partidasService, proyPartidaService } from '@/services/partidas.service';
import { proyectosService } from '@/services/proyectos.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Edit,
    FolderKanban,
    Layers,
    Loader2,
    Plus,
    Search,
    Trash2,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProyPartidaForm {
  codCia: number;
  codPyto: number;
  nroVersion: number;
  ingEgr: string;
  codPartida: number;
  codPartidas: string;
  flgCC: string;
  nivel: number;
  uniMed: string;
  tabEstado: string;
  codEstado: string;
  vigente: string;
}

const initialFormState: ProyPartidaForm = {
  codCia: 1,
  codPyto: 0,
  nroVersion: 1,
  ingEgr: 'E',
  codPartida: 0,
  codPartidas: '',
  flgCC: 'N',
  nivel: 1,
  uniMed: 'UND',
  tabEstado: '014',
  codEstado: 'REG',
  vigente: '1',
};

export default function ProyPartidaPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProyecto, setFilterProyecto] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProyPartidaForm>(initialFormState);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Obtener proyectos
  const { data: proyectos = [] } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => proyectosService.getAll(1),
  });

  // Obtener partidas de proyecto
  const { data: proyPartidas = [], isLoading } = useQuery({
    queryKey: ['proy-partida'],
    queryFn: () => proyPartidaService.getAll(),
  });

  // Obtener partidas para el selector
  const { data: partidas = [] } = useQuery({
    queryKey: ['partidas-catalogo'],
    queryFn: () => partidasService.getAll(1),
  });

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: proyPartidaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida'] });
      toast.success('Partida de proyecto creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear partida de proyecto');
    },
  });

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      proyPartidaService.update(
        data.codCia,
        data.codPyto,
        data.nroVersion,
        data.ingEgr,
        data.codPartida,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida'] });
      toast.success('Partida de proyecto actualizada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar partida de proyecto');
    },
  });

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (item: any) =>
      proyPartidaService.delete(
        item.codCia,
        item.codPyto,
        item.nroVersion,
        item.ingEgr,
        item.codPartida
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida'] });
      toast.success('Partida de proyecto eliminada exitosamente');
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar partida de proyecto');
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

  const handleOpenEdit = (item: any) => {
    setFormData({
      codCia: item.codCia,
      codPyto: item.codPyto,
      nroVersion: item.nroVersion,
      ingEgr: item.ingEgr,
      codPartida: item.codPartida,
      codPartidas: item.codPartidas || '',
      flgCC: item.flgCC || item.flgCc || 'N',
      nivel: item.nivel || 1,
      uniMed: item.uniMed || 'UND',
      tabEstado: item.tabEstado || '014',
      codEstado: item.codEstado || 'REG',
      vigente: item.vigente || '1',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const getProyectoNombre = (codPyto: number) => {
    const proyecto = proyectos.find((p: any) => p.codPyto === codPyto);
    return proyecto?.nombPyto || `Proyecto ${codPyto}`;
  };

  const getPartidaNombre = (codPartida: number) => {
    const partida = partidas.find((p: any) => p.codPartida === codPartida);
    return partida?.desPartida || `Partida ${codPartida}`;
  };

  const filteredData = proyPartidas.filter((item: any) => {
    const matchesSearch =
      String(item.codPartida).includes(searchTerm) ||
      item.codPartidas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProyectoNombre(item.codPyto).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProyecto = filterProyecto === 'all' || String(item.codPyto) === filterProyecto;

    return matchesSearch && matchesProyecto;
  });

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partidas de Proyecto</h1>
          <p className="text-muted-foreground">
            Gestión de partidas asignadas a proyectos específicos
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida de Proyecto
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proyPartidas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(proyPartidas.map((p: any) => p.codPyto)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proyPartidas.filter((p: any) => p.ingEgr === 'I').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {proyPartidas.filter((p: any) => p.ingEgr === 'E').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterProyecto} onValueChange={setFilterProyecto}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {proyectos.map((p: any) => (
              <SelectItem key={p.codPyto} value={String(p.codPyto)}>
                {p.nombPyto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cód. Partida</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No hay partidas de proyecto registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow
                    key={`${item.codCia}-${item.codPyto}-${item.nroVersion}-${item.ingEgr}-${item.codPartida}`}
                  >
                    <TableCell>
                      <div className="font-medium">{getProyectoNombre(item.codPyto)}</div>
                      <div className="text-xs text-muted-foreground">Cód: {item.codPyto}</div>
                    </TableCell>
                    <TableCell>{item.nroVersion}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }
                      >
                        {item.ingEgr === 'I' ? 'Ingreso' : 'Egreso'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{item.codPartida}</span>
                      <div className="text-xs text-muted-foreground">
                        {getPartidaNombre(item.codPartida)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.codPartidas}</TableCell>
                    <TableCell>{item.nivel}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.uniMed}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.vigente === '1' || item.vigente === 'S' ? 'default' : 'secondary'}>
                        {item.vigente === '1' || item.vigente === 'S' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Partida de Proyecto</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifica los datos de la partida de proyecto'
                : 'Ingresa los datos para asignar una partida a un proyecto'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proyecto</Label>
                <Select
                  value={String(formData.codPyto)}
                  onValueChange={(value) => setFormData({ ...formData, codPyto: Number(value) })}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {proyectos.map((p: any) => (
                      <SelectItem key={p.codPyto} value={String(p.codPyto)}>
                        {p.nombPyto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Versión</Label>
                <Input
                  type="number"
                  value={formData.nroVersion}
                  onChange={(e) => setFormData({ ...formData, nroVersion: Number(e.target.value) })}
                  disabled={isEditing}
                />
              </div>
            </div>
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
                <Label>Cód. Partida</Label>
                <Input
                  type="number"
                  value={formData.codPartida}
                  onChange={(e) => setFormData({ ...formData, codPartida: Number(e.target.value) })}
                  disabled={isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código Partida (Texto)</Label>
                <Input
                  value={formData.codPartidas}
                  onChange={(e) => setFormData({ ...formData, codPartidas: e.target.value })}
                  placeholder="Ej: EGR-001-01"
                />
              </div>
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Input
                  type="number"
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unidad de Medida</Label>
                <Input
                  value={formData.uniMed}
                  onChange={(e) => setFormData({ ...formData, uniMed: e.target.value })}
                />
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
              ¿Estás seguro de que deseas eliminar esta partida de proyecto? Esta acción no se puede
              deshacer.
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
