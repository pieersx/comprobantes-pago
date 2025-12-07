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
import { partidasService, proyPartidaMezclaService } from '@/services/partidas.service';
import { proyectosService } from '@/services/proyectos.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Edit,
    FolderKanban,
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

interface ProyPartidaMezclaForm {
  codCia: number;
  codPyto: number;
  ingEgr: string;
  nroVersion: number;
  codPartida: number;
  corr: number;
  padCodPartida: number;
  tUniMed: string;
  eUniMed: string;
  nivel: number;
  orden: number;
  costoUnit: number;
  cant: number;
  costoTot: number;
}

const initialFormState: ProyPartidaMezclaForm = {
  codCia: 1,
  codPyto: 0,
  ingEgr: 'E',
  nroVersion: 1,
  codPartida: 0,
  corr: 0,
  padCodPartida: 0,
  tUniMed: '012',
  eUniMed: '001',
  nivel: 1,
  orden: 1,
  costoUnit: 0,
  cant: 0,
  costoTot: 0,
};

export default function ProyPartidaMezclaPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProyecto, setFilterProyecto] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterNivel, setFilterNivel] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProyPartidaMezclaForm>(initialFormState);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Obtener proyectos
  const { data: proyectos = [] } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => proyectosService.getAll(1),
  });

  // Obtener partidas mezcla de proyecto
  const { data: proyPartidasMezcla = [], isLoading } = useQuery({
    queryKey: ['proy-partida-mezcla'],
    queryFn: () => proyPartidaMezclaService.getAll(),
  });

  // Obtener partidas para el selector
  const { data: partidas = [] } = useQuery({
    queryKey: ['partidas-catalogo'],
    queryFn: () => partidasService.getAll(1),
  });

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: (data: ProyPartidaMezclaForm) => {
      console.log('=== DATOS ENVIADOS (PROY PARTIDA MEZCLA) ===');
      console.log('codCia:', data.codCia);
      console.log('codPyto:', data.codPyto);
      console.log('ingEgr:', data.ingEgr);
      console.log('nroVersion:', data.nroVersion);
      console.log('codPartida:', data.codPartida);
      console.log('corr:', data.corr);
      console.log('padCodPartida:', data.padCodPartida);
      console.log('tUniMed:', data.tUniMed);
      console.log('eUniMed:', data.eUniMed);
      console.log('nivel:', data.nivel);
      console.log('orden:', data.orden);
      console.log('costoUnit:', data.costoUnit);
      console.log('cant:', data.cant);
      console.log('costoTot:', data.costoTot);
      console.log('========================================');
      return proyPartidaMezclaService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida-mezcla'] });
      toast.success('Partida mezcla de proyecto creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear partida mezcla de proyecto');
    },
  });

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      proyPartidaMezclaService.update(
        data.codCia,
        data.codPyto,
        data.ingEgr,
        data.nroVersion,
        data.codPartida,
        data.corr,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida-mezcla'] });
      toast.success('Partida mezcla de proyecto actualizada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar partida mezcla de proyecto');
    },
  });

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (item: any) =>
      proyPartidaMezclaService.delete(
        item.codCia,
        item.codPyto,
        item.ingEgr,
        item.nroVersion,
        item.codPartida,
        item.corr
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida-mezcla'] });
      toast.success('Partida mezcla de proyecto eliminada exitosamente');
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar partida mezcla de proyecto');
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
      ingEgr: item.ingEgr,
      nroVersion: item.nroVersion,
      codPartida: item.codPartida,
      corr: item.corr,
      padCodPartida: item.padCodPartida,
      tUniMed: item.tUniMed || '012',
      eUniMed: item.eUniMed || '001',
      nivel: item.nivel || 1,
      orden: item.orden || 1,
      costoUnit: item.costoUnit || 0,
      cant: item.cant || 0,
      costoTot: item.costoTot || 0,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.codPyto || formData.codPyto === 0) {
      toast.error('Debes seleccionar un proyecto');
      return;
    }
    if (!formData.codPartida || formData.codPartida === 0) {
      toast.error('Debes seleccionar una partida');
      return;
    }
    if (!formData.corr || formData.corr === 0) {
      toast.error('El correlativo es obligatorio');
      return;
    }
    if (!formData.padCodPartida || formData.padCodPartida === 0) {
      toast.error('Debes seleccionar una partida padre');
      return;
    }
    if (!formData.tUniMed || formData.tUniMed.trim() === '') {
      toast.error('La tabla de unidad de medida es obligatoria');
      return;
    }
    if (!formData.eUniMed || formData.eUniMed.trim() === '') {
      toast.error('El estado de unidad de medida es obligatorio');
      return;
    }

    // Calcular costo total
    const data = {
      ...formData,
      costoTot: formData.costoUnit * formData.cant,
    };
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
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

  // Obtener partidas válidas como padre
  const getValidParentPartidas = () => {
    // Las partidas válidas como padre son aquellas que:
    // 1. Para nivel 1: cualquier partida del mismo tipo (raíz)
    // 2. Para nivel > 1: partidas que existen como padre en partida_mezcla del mismo tipo

    if (formData.nivel === 1) {
      // Nivel 1: pueden ser padre CUALQUIER partida del mismo tipo
      return partidas.filter((p: any) => p.ingEgr === formData.ingEgr);
    }

    // Nivel > 1: solo partidas que ya existen como padre
    const allParentCodes = new Set(
      proyPartidasMezcla.map((item: any) => item.padCodPartida)
    );

    return partidas.filter((p: any) => {
      return (
        allParentCodes.has(p.codPartida) &&
        p.ingEgr === formData.ingEgr &&
        p.codPartida !== formData.codPartida
      );
    });
  };

  const filteredData = proyPartidasMezcla
    .filter((item: any) =>
      String(item.codPartida).includes(searchTerm) ||
      getProyectoNombre(item.codPyto).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item: any) => (filterProyecto === 'all' ? true : String(item.codPyto) === filterProyecto))
    .filter((item: any) => (filterTipo === 'all' ? true : item.ingEgr === filterTipo))
    .filter((item: any) => (filterNivel === 'all' ? true : String(item.nivel) === filterNivel))
    .sort((a: any, b: any) => {
      if (a.codPyto !== b.codPyto) return a.codPyto - b.codPyto;
      if (a.padCodPartida !== b.padCodPartida) return a.padCodPartida - b.padCodPartida;
      if (a.nivel !== b.nivel) return a.nivel - b.nivel;
      if (a.orden !== b.orden) return a.orden - b.orden;
      return a.codPartida - b.codPartida;
    });

  // Calcular totales
  const totalCosto = filteredData.reduce((sum: number, item: any) => sum + (item.costoTot || 0), 0);

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
          <h1 className="text-3xl font-bold tracking-tight">Partida Mezcla de Proyecto</h1>
          <p className="text-muted-foreground">
            Gestión de composición específica de partidas por proyecto
          </p>
        </div>
        <Button onClick={handleOpenCreate} disabled={partidas.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida Mezcla
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <ListTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proyPartidasMezcla.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(proyPartidasMezcla.map((p: any) => p.codPyto)).size}
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
              {proyPartidasMezcla.filter((p: any) => p.ingEgr === 'I').length}
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
              {proyPartidasMezcla.filter((p: any) => p.ingEgr === 'E').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advertencia si no hay partidas */}
      {partidas.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <ListTree className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  No hay partidas disponibles
                </p>
                <p className="text-sm text-orange-700">
                  Necesitas crear partidas antes de crear partidas mezcla de proyecto.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => (window.location.href = '/partidas')}
              >
                Ir a Partidas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
            <SelectValue placeholder="Proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {proyectos.map((p: any) => (
              <SelectItem key={p.codPyto} value={String(p.codPyto)}>
                {p.nombPyto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Tabla - TABLA PROY_PARTIDA_MEZCLA */}
      <Card>
        <CardHeader className="py-3 bg-purple-50 border-b">
          <CardTitle className="text-sm font-medium">
            TABLA: PROY_PARTIDA_MEZCLA (Composición y Costos por Proyecto)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100/50">
                <TableHead className="font-bold">CODCIA</TableHead>
                <TableHead className="font-bold">CODPYTO</TableHead>
                <TableHead className="font-bold">INGEGR</TableHead>
                <TableHead className="font-bold">NROVERSION</TableHead>
                <TableHead className="font-bold">CODPARTIDA</TableHead>
                <TableHead className="font-bold">CORR</TableHead>
                <TableHead className="font-bold">PADCODPARTIDA</TableHead>
                <TableHead className="font-bold text-center">NIVEL</TableHead>
                <TableHead className="font-bold text-center">ORDEN</TableHead>
                <TableHead className="font-bold text-right">COSTUNIT</TableHead>
                <TableHead className="font-bold text-right">CANT</TableHead>
                <TableHead className="font-bold text-right">COSTOTOT</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                    No hay partidas mezcla de proyecto registradas
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredData.map((item: any) => {
                    const nivelColor = item.nivel === 1 ? 'bg-yellow-50' : item.nivel === 2 ? 'bg-orange-50' : item.nivel === 3 ? 'bg-green-50' : 'bg-blue-50';
                    return (
                      <TableRow
                        key={`${item.codCia}-${item.codPyto}-${item.ingEgr}-${item.nroVersion}-${item.codPartida}-${item.corr}`}
                        className={nivelColor}
                      >
                        <TableCell className="font-mono">{item.codCia}</TableCell>
                        <TableCell className="font-mono font-bold">{item.codPyto}</TableCell>
                        <TableCell>
                          <Badge className={item.ingEgr === 'I' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {item.ingEgr}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{item.nroVersion}</TableCell>
                        <TableCell className="font-mono font-bold">{item.codPartida}</TableCell>
                        <TableCell className="font-mono">{item.corr}</TableCell>
                        <TableCell className="font-mono font-bold text-blue-600">{item.padCodPartida}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            item.nivel === 1 ? 'bg-yellow-200 text-yellow-800' :
                            item.nivel === 2 ? 'bg-orange-200 text-orange-800' :
                            item.nivel === 3 ? 'bg-green-200 text-green-800' :
                            'bg-blue-200 text-blue-800'
                          }>
                            {item.nivel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">{item.orden}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.costoUnit?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {item.cant?.toFixed(3) || '0.000'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          {item.costoTot?.toFixed(2) || '0.00'}
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
                  })}
                  {/* Fila de totales */}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={11} className="text-right font-bold">
                      TOTAL:
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {totalCosto.toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Partida Mezcla de Proyecto</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifica los datos de la partida mezcla'
                : 'Ingresa los datos para crear una nueva partida mezcla de proyecto'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proyecto</Label>
                <Select
                  value={String(formData.codPyto)}
                  onValueChange={(value) => setFormData({ ...formData, codPyto: Number(value) })}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={formData.ingEgr}
                  onValueChange={(value) => setFormData({ ...formData, ingEgr: value, codPartida: 0, padCodPartida: 0 })}
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
              <div className="space-y-2">
                <Label>Correlativo *</Label>
                <Input
                  type="number"
                  value={formData.corr}
                  onChange={(e) => setFormData({ ...formData, corr: Number(e.target.value) })}
                  disabled={isEditing}
                  min={1}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Partida Padre *</Label>
                <Select
                  value={String(formData.padCodPartida)}
                  onValueChange={(value) => setFormData({ ...formData, padCodPartida: Number(value) })}
                  disabled={partidas.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona partida padre" />
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
                  Solo se muestran partidas válidas como padre (que existen en Partida Mezcla)
                </p>
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
                <Label>Costo Unitario</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costoUnit}
                  onChange={(e) => setFormData({ ...formData, costoUnit: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.cant}
                  onChange={(e) => setFormData({ ...formData, cant: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Total (calculado)</Label>
                <Input
                  type="number"
                  value={(formData.costoUnit * formData.cant).toFixed(2)}
                  disabled
                  className="bg-muted"
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
              ¿Estás seguro de que deseas eliminar esta partida mezcla de proyecto? Esta acción no se
              puede deshacer.
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
