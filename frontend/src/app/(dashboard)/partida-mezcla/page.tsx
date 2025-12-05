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
import { partidaMezclaService, partidasService } from '@/services/partidas.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Edit,
    Loader2,
    Plus,
    Search,
    Shuffle,
    Trash2,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PartidaMezclaForm {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  corr: number;
  padCodPartida: number;
  tUniMed: string;
  eUniMed: string;
  costoUnit: number;
  nivel: number;
  orden: number;
  vigente: string;
}

const initialFormState: PartidaMezclaForm = {
  codCia: 1,
  ingEgr: 'E',
  codPartida: 0,
  corr: 0,
  padCodPartida: 0,
  tUniMed: '012',
  eUniMed: '001',
  costoUnit: 0,
  nivel: 1,
  orden: 1,
  vigente: '1',
};

export default function PartidaMezclaPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PartidaMezclaForm>(initialFormState);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Obtener partidas mezcla
  const { data: partidasMezcla = [], isLoading } = useQuery({
    queryKey: ['partida-mezcla'],
    queryFn: () => partidaMezclaService.getByCia(1),
  });

  // Obtener partidas para el selector
  const { data: partidas = [] } = useQuery({
    queryKey: ['partidas-catalogo'],
    queryFn: () => partidasService.getAll(1),
  });

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: partidaMezclaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partida-mezcla'] });
      toast.success('Partida mezcla creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear partida mezcla');
    },
  });

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      partidaMezclaService.update(
        data.codCia,
        data.ingEgr,
        data.codPartida,
        data.corr,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partida-mezcla'] });
      toast.success('Partida mezcla actualizada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar partida mezcla');
    },
  });

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (item: any) =>
      partidaMezclaService.delete(item.codCia, item.ingEgr, item.codPartida, item.corr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partida-mezcla'] });
      toast.success('Partida mezcla eliminada exitosamente');
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar partida mezcla');
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
      ingEgr: item.ingEgr,
      codPartida: item.codPartida,
      corr: item.corr,
      padCodPartida: item.padCodPartida,
      tUniMed: item.tUniMed || '012',
      eUniMed: item.eUniMed || '001',
      costoUnit: item.costoUnit || 0,
      nivel: item.nivel || 1,
      orden: item.orden || 1,
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

  const filteredData = partidasMezcla.filter(
    (item: any) =>
      String(item.codPartida).includes(searchTerm) ||
      String(item.padCodPartida).includes(searchTerm)
  );

  const getPartidaNombre = (codPartida: number) => {
    const partida = partidas.find((p: any) => p.codPartida === codPartida);
    return partida?.desPartida || `Partida ${codPartida}`;
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Partida Mezcla</h1>
          <p className="text-muted-foreground">
            Gestión de composición general de partidas presupuestales
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida Mezcla
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Shuffle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partidasMezcla.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {partidasMezcla.filter((p: any) => p.ingEgr === 'I').length}
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
              {partidasMezcla.filter((p: any) => p.ingEgr === 'E').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código de partida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Cód. Partida</TableHead>
                <TableHead>Corr</TableHead>
                <TableHead>Partida Padre</TableHead>
                <TableHead>Costo Unit.</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No hay partidas mezcla registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow key={`${item.codCia}-${item.ingEgr}-${item.codPartida}-${item.corr}`}>
                    <TableCell>
                      <Badge className={item.ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {item.ingEgr === 'I' ? 'Ingreso' : 'Egreso'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{item.codPartida}</TableCell>
                    <TableCell>{item.corr}</TableCell>
                    <TableCell>
                      <span className="font-mono">{item.padCodPartida}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        {getPartidaNombre(item.padCodPartida)}
                      </span>
                    </TableCell>
                    <TableCell>S/ {item.costoUnit?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{item.nivel}</TableCell>
                    <TableCell>{item.orden}</TableCell>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Partida Mezcla</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica los datos de la partida mezcla' : 'Ingresa los datos para crear una nueva partida mezcla'}
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
                <Label>Correlativo</Label>
                <Input
                  type="number"
                  value={formData.corr}
                  onChange={(e) => setFormData({ ...formData, corr: Number(e.target.value) })}
                  disabled={isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Partida Padre</Label>
                <Input
                  type="number"
                  value={formData.padCodPartida}
                  onChange={(e) => setFormData({ ...formData, padCodPartida: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Costo Unitario</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costoUnit}
                  onChange={(e) => setFormData({ ...formData, costoUnit: Number(e.target.value) })}
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
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: Number(e.target.value) })}
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
              ¿Estás seguro de que deseas eliminar esta partida mezcla? Esta acción no se puede deshacer.
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
