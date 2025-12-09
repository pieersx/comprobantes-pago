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
  corr: 1,
  padCodPartida: 0,
  tUniMed: '012',
  eUniMed: '001',
  costoUnit: 0,
  nivel: 3,
  orden: 1,
  vigente: '1',
};

export default function PartidaMezclaPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterNivel, setFilterNivel] = useState<string>('all');
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
    mutationFn: (data: PartidaMezclaForm) => {
      console.log('=== DATOS ENVIADOS (PARTIDA MEZCLA) ===');
      console.log('codCia:', data.codCia);
      console.log('ingEgr:', data.ingEgr);
      console.log('codPartida:', data.codPartida);
      console.log('corr:', data.corr);
      console.log('padCodPartida:', data.padCodPartida);
      console.log('tUniMed:', data.tUniMed, '(tipo:', typeof data.tUniMed + ')');
      console.log('eUniMed:', data.eUniMed, '(tipo:', typeof data.eUniMed + ')');
      console.log('costoUnit:', data.costoUnit);
      console.log('nivel:', data.nivel);
      console.log('orden:', data.orden);
      console.log('vigente:', data.vigente);
      console.log('=== FIN DATOS ===');
      return partidaMezclaService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partida-mezcla'] });
      toast.success('Partida mezcla creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error al crear partida mezcla:', error);
      const errorMessage = error.message || 'Error al crear partida mezcla';
      toast.error(errorMessage);
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
    // Validar campos obligatorios
    if (!formData.ingEgr || formData.ingEgr.trim() === '') {
      toast.error('El tipo (Ingreso/Egreso) es obligatorio');
      return;
    }
    if (formData.codPartida === null || formData.codPartida === 0) {
      toast.error('El código de partida es obligatorio');
      return;
    }
    if (formData.corr === null || formData.corr === 0) {
      toast.error('El correlativo es obligatorio');
      return;
    }
    if (formData.padCodPartida === null || formData.padCodPartida === 0) {
      toast.error('La partida padre es obligatoria');
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

  const filteredData = partidasMezcla
    .filter((item: any) =>
      String(item.codPartida).includes(searchTerm) ||
      String(item.padCodPartida).includes(searchTerm)
    )
    .filter((item: any) => (filterTipo === 'all' ? true : item.ingEgr === filterTipo))
    .filter((item: any) => (filterNivel === 'all' ? true : String(item.nivel) === filterNivel))
    .sort((a: any, b: any) => {
      // Orden jerárquico: padre -> nivel -> orden -> hijo
      if (a.padCodPartida !== b.padCodPartida) return a.padCodPartida - b.padCodPartida;
      if (a.nivel !== b.nivel) return a.nivel - b.nivel;
      if (a.orden !== b.orden) return a.orden - b.orden;
      return a.codPartida - b.codPartida;
    });

  const getPartidaNombre = (codPartida: number) => {
    const partida = partidas.find((p: any) => p.codPartida === codPartida);
    return partida?.desPartida || `Partida ${codPartida}`;
  };

  // Obtener partidas válidas como padre
  const getValidParentPartidas = () => {
    // Nivel 1: la partida se referencia a sí misma (auto-referencia)
    if (formData.nivel === 1) {
      // Solo mostrar partidas de nivel 1 del mismo tipo
      return partidas.filter((p: any) => p.ingEgr === formData.ingEgr && p.nivel === 1);
    }

    // Nivel 2: puede tener como padre partidas de nivel 1
    if (formData.nivel === 2) {
      return partidas.filter((p: any) => p.ingEgr === formData.ingEgr && p.nivel === 1);
    }

    // Nivel 3: puede tener como padre partidas de nivel 2
    if (formData.nivel === 3) {
      return partidas.filter((p: any) => p.ingEgr === formData.ingEgr && p.nivel === 2);
    }

    // Nivel > 3: partidas del nivel anterior
    return partidas.filter((p: any) => p.ingEgr === formData.ingEgr && p.nivel === formData.nivel - 1);
  };  if (isLoading) {
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
        <Button onClick={handleOpenCreate} disabled={partidas.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida Mezcla
        </Button>
      </div>

      {/* Alerta si no hay partidas */}
      {partidas.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  No hay partidas disponibles
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Para crear partidas mezcla, primero necesitas crear partidas en el módulo de
                  Partidas. Las partidas mezcla requieren partidas existentes como referencia.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = '/partidas')}
                  className="border-yellow-300 hover:bg-yellow-100"
                >
                  Ir a Partidas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o padre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="I">Ingresos</SelectItem>
            <SelectItem value="E">Egresos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterNivel} onValueChange={setFilterNivel}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="1">Nivel 1</SelectItem>
            <SelectItem value="2">Nivel 2</SelectItem>
            <SelectItem value="3">Nivel 3</SelectItem>
            <SelectItem value="4">Nivel 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla - TABLA PARTIDA_MEZCLA */}
      <Card>
        <CardHeader className="py-3 bg-orange-50 border-b">
          <CardTitle className="text-sm font-medium">
            TABLA: PARTIDA_MEZCLA (Composición Jerárquica General)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-100/50">
                <TableHead className="font-bold">CODCIA</TableHead>
                <TableHead className="font-bold">INGEGR</TableHead>
                <TableHead className="font-bold">CODPARTIDA</TableHead>
                <TableHead className="font-bold">PADCODPARTIDA</TableHead>
                <TableHead className="font-bold">CORR</TableHead>
                <TableHead className="font-bold text-center">NIVEL</TableHead>
                <TableHead className="font-bold text-center">ORDEN</TableHead>
                <TableHead className="font-bold">VIGENTE</TableHead>
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
                filteredData
                  .sort((a: any, b: any) => {
                    if (a.ingEgr !== b.ingEgr) return a.ingEgr.localeCompare(b.ingEgr);
                    if (a.padCodPartida !== b.padCodPartida) return a.padCodPartida - b.padCodPartida;
                    if (a.nivel !== b.nivel) return a.nivel - b.nivel;
                    return a.orden - b.orden;
                  })
                  .map((item: any) => {
                    const nivelColor = item.nivel === 1 ? 'bg-yellow-50' : item.nivel === 2 ? 'bg-orange-50' : 'bg-green-50';
                    return (
                      <TableRow
                        key={`${item.codCia}-${item.ingEgr}-${item.codPartida}-${item.corr}`}
                        className={nivelColor}
                      >
                        <TableCell className="font-mono">{item.codCia}</TableCell>
                        <TableCell>
                          <Badge className={item.ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {item.ingEgr}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono font-bold">{item.codPartida}</div>
                          <div className="text-xs text-muted-foreground">{getPartidaNombre(item.codPartida)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono font-bold text-blue-600">{item.padCodPartida}</div>
                          <div className="text-xs text-muted-foreground">{getPartidaNombre(item.padCodPartida)}</div>
                        </TableCell>
                        <TableCell className="font-mono">{item.corr}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            item.nivel === 1 ? 'bg-yellow-200 text-yellow-800' :
                            item.nivel === 2 ? 'bg-orange-200 text-orange-800' :
                            'bg-green-200 text-green-800'
                          }>
                            {item.nivel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">{item.orden}</TableCell>
                        <TableCell>
                          <Badge variant={item.vigente === '1' || item.vigente === 'S' ? 'default' : 'secondary'}>
                            {item.vigente}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
            {/* Advertencia si no hay partidas */}
            {partidas.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <strong>⚠️ Advertencia:</strong> No hay partidas registradas. Primero debes crear
                partidas en el módulo de <strong>Partidas</strong> antes de crear partidas mezcla.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
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
                <Label>Partida *</Label>
                <Select
                  value={String(formData.codPartida)}
                  onValueChange={(value) => setFormData({ ...formData, codPartida: Number(value) })}
                  disabled={isEditing || partidas.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona partida" />
                  </SelectTrigger>
                  <SelectContent>
                    {partidas
                      .filter((p: any) => p.ingEgr === formData.ingEgr)
                      .map((p: any) => (
                        <SelectItem key={p.codPartida} value={String(p.codPartida)}>
                          {p.codPartida} - {p.desPartida}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Correlativo *</Label>
                <Input
                  type="number"
                  value={formData.corr}
                  onChange={(e) => setFormData({ ...formData, corr: Number(e.target.value) })}
                  disabled={isEditing}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Partida Padre *</Label>
                <Select
                  value={String(formData.padCodPartida)}
                  onValueChange={(value) => setFormData({ ...formData, padCodPartida: Number(value) })}
                  disabled={partidas.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona padre" />
                  </SelectTrigger>
                  <SelectContent>
                    {getValidParentPartidas().map((p: any) => (
                      <SelectItem key={p.codPartida} value={String(p.codPartida)}>
                        {p.codPartida} - {p.desPartida}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo partidas válidas como padre
                </p>
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
                <Label>Nivel *</Label>
                <Select
                  value={String(formData.nivel)}
                  onValueChange={(value) => setFormData({ ...formData, nivel: Number(value), padCodPartida: 0 })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nivel 1 (Raíz)</SelectItem>
                    <SelectItem value="2">Nivel 2</SelectItem>
                    <SelectItem value="3">Nivel 3</SelectItem>
                  </SelectContent>
                </Select>
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
