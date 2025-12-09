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
import {
    buildPartidaHierarchy,
    getNivelConnector,
    getNivelIndent
} from '@/lib/partida-hierarchy';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProyPartidaForm>(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProyecto, setFilterProyecto] = useState('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');
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
    mutationFn: (data: ProyPartidaForm) => {
      console.log('=== DATOS ENVIADOS (PROY PARTIDA) ===');
      console.log('codCia:', data.codCia);
      console.log('codPyto:', data.codPyto);
      console.log('nroVersion:', data.nroVersion);
      console.log('ingEgr:', data.ingEgr);
      console.log('codPartida:', data.codPartida);
      console.log('codPartidas:', data.codPartidas);
      console.log('flgCC:', data.flgCC);
      console.log('nivel:', data.nivel);
      console.log('uniMed:', data.uniMed);
      console.log('tabEstado:', data.tabEstado);
      console.log('codEstado:', data.codEstado);
      console.log('vigente:', data.vigente);
      console.log('=== FIN DATOS ===');
      return proyPartidaService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proy-partida'] });
      toast.success('Partida de proyecto creada exitosamente');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error al crear:', error);
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
    // Validaciones
    if (!formData.codPyto || formData.codPyto === 0) {
      toast.error('Selecciona un proyecto');
      return;
    }
    if (!formData.codPartida || formData.codPartida === 0) {
      toast.error('Selecciona una partida');
      return;
    }
    if (!formData.codPartidas || formData.codPartidas.trim() === '') {
      toast.error('El código de partida es obligatorio');
      return;
    }
    if (!formData.uniMed || formData.uniMed.trim() === '') {
      toast.error('La unidad de medida es obligatoria');
      return;
    }
    if (!formData.tabEstado || formData.tabEstado.trim() === '') {
      toast.error('La tabla de estado es obligatoria');
      return;
    }
    if (!formData.codEstado || formData.codEstado.trim() === '') {
      toast.error('El código de estado es obligatorio');
      return;
    }

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

  const getPartidaPadre = (codPartida: number) => {
    const partida = partidas.find((p: any) => p.codPartida === codPartida);
    if (!partida || !partida.padCodPartida) {
      return { codPadre: codPartida, nombrePadre: getPartidaNombre(codPartida) };
    }
    return {
      codPadre: partida.padCodPartida,
      nombrePadre: getPartidaNombre(partida.padCodPartida)
    };
  };

  const filteredData = proyPartidas.filter((item: any) => {
    const matchesSearch =
      String(item.codPartida).includes(searchTerm) ||
      item.codPartidas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProyectoNombre(item.codPyto).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProyecto = filterProyecto === 'all' || String(item.codPyto) === filterProyecto;
    const matchesTipo = filterTipo === 'all' || item.ingEgr === filterTipo;

    return matchesSearch && matchesProyecto && matchesTipo;
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
        <Button onClick={handleOpenCreate} disabled={partidas.length === 0}>
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

      {/* Advertencia si no hay partidas */}
      {partidas.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  No hay partidas disponibles
                </p>
                <p className="text-sm text-orange-700">
                  Necesitas crear partidas antes de asignarlas a proyectos.
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

      {/* Leyenda de Jerarquía */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Jerarquía Visual de Partidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-green-700 flex items-center justify-center text-white font-bold text-xl">
                    ▶
                  </div>
                  <div>
                    <div className="font-semibold text-sm">NIVEL 1</div>
                    <div className="text-xs text-muted-foreground">Categoría Principal</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-green-200 flex items-center justify-center text-green-700 font-bold text-xl">
                    ├─
                  </div>
                  <div>
                    <div className="font-semibold text-sm">NIVEL 2</div>
                    <div className="text-xs text-muted-foreground">Subcategoría</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl">
                    └──
                  </div>
                  <div>
                    <div className="font-semibold text-sm">NIVEL 3</div>
                    <div className="text-xs text-muted-foreground">Detalle Específico</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
      </div>

      {/* Tabla - TABLA PROY_PARTIDA */}
      <Card>
        <CardHeader className="py-3 bg-green-50 border-b">
          <CardTitle className="text-sm font-medium">
            TABLA: PROY_PARTIDA (Partidas Asignadas a Proyectos)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100/50">
                <TableHead className="font-bold">CODCIA</TableHead>
                <TableHead className="font-bold">CODPYTO</TableHead>
                <TableHead className="font-bold">INGEGR</TableHead>
                <TableHead className="font-bold">CODPARTIDA</TableHead>
                <TableHead className="font-bold">PADCODPARTIDA</TableHead>
                <TableHead className="font-bold text-center">NIVEL</TableHead>
                <TableHead className="font-bold">VIGENTE</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No hay partidas de proyecto registradas
                  </TableCell>
                </TableRow>
              ) : (
                // Agrupar por proyecto+versión y renderizar jerarquía por grupo
                Object.entries(
                  filteredData.reduce((acc: any, itm: any) => {
                    const key = `${itm.codPyto}-${itm.nroVersion}`;
                    acc[key] = acc[key] || [];
                    acc[key].push(itm);
                    return acc;
                  }, {})
                )
                  .sort((a: any, b: any) => {
                    const [pytoA, verA] = a[0].split('-').map(Number);
                    const [pytoB, verB] = b[0].split('-').map(Number);
                    if (pytoA !== pytoB) return pytoA - pytoB;
                    return verA - verB;
                  })
                  .flatMap(([key, items]: any) => {
                    const [codPyto, nroVersion] = key.split('-');
                    const headerRow = (
                      <TableRow key={`header-${key}`} className="bg-muted/10">
                        <TableCell colSpan={8} className="font-medium text-sm py-2">
                          Proyecto: <strong>{getProyectoNombre(Number(codPyto))}</strong> — Versión: <strong>{nroVersion}</strong>
                        </TableCell>
                      </TableRow>
                    );

                    // Enriquecer items con nombres de partidas
                    const enrichedItems = items.map((item: any) => {
                      const partidaInfo = partidas.find((p: any) => p.codPartida === item.codPartida);
                      return {
                        ...item,
                        desPartida: partidaInfo?.desPartida || `Partida ${item.codPartida}`,
                      };
                    });

                    const hierarchyRows = buildPartidaHierarchy(enrichedItems, partidas).map((item: any) => {
                      const nivelColor = item.nivel === 1 ? 'bg-yellow-100' : item.nivel === 2 ? 'bg-orange-100' : 'bg-green-100';
                      const indent = getNivelIndent(item.nivel);
                      const connector = getNivelConnector(item.nivel);
                      const badgeColor = item.nivel === 1 ? 'bg-yellow-200 text-yellow-800' : item.nivel === 2 ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800';
                      const isNivel1 = item.nivel === 1;

                      return (
                        <TableRow
                          key={`${item.codCia}-${item.codPyto}-${item.nroVersion}-${item.ingEgr}-${item.codPartida}`}
                          className={nivelColor}
                        >
                          <TableCell className={`font-mono ${isNivel1 ? 'font-bold text-black' : ''}`}>{item.codCia}</TableCell>
                          <TableCell className={`font-mono ${isNivel1 ? 'font-bold text-black' : ''}`}>{item.codPyto}</TableCell>
                          <TableCell>
                            <Badge className={item.ingEgr === 'I' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                              {item.ingEgr === 'I' ? 'INGRESO' : 'EGRESO'}
                            </Badge>
                          </TableCell>
                          <TableCell className={`${indent}`}>
                            <div className="flex items-center gap-3">
                              <span className={`font-bold text-lg ${isNivel1 ? 'text-black' : item.ingEgr === 'I' ? 'text-green-600' : 'text-red-600'}`}>
                                {connector}
                              </span>
                              <div className="flex-1">
                                <div className={`font-mono ${isNivel1 ? 'font-bold text-lg text-black' : 'font-semibold'}`}>
                                  {item.codPartida} - {item.desPartida?.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const padre = getPartidaPadre(item.codPartida);
                              return (
                                <div className={`font-mono ${isNivel1 ? 'font-bold text-black' : 'font-semibold text-blue-600'}`}>
                                  {padre.codPadre} - {padre.nombrePadre.toUpperCase()}
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-center">
                            {isNivel1 ? (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}
                                style={{ color: 'black' }}
                              >
                                NIVEL {item.nivel}
                              </span>
                            ) : (
                              <Badge className={badgeColor}>
                                NIVEL {item.nivel}
                              </Badge>
                            )}
                          </TableCell>
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
                    });

                    return [headerRow, ...hierarchyRows];
                  })
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
                <Label>Tipo *</Label>
                <Select
                  value={formData.ingEgr}
                  onValueChange={(value) => setFormData({ ...formData, ingEgr: value, codPartida: 0 })}
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
                  onValueChange={(value) => {
                    const partida = partidas.find((p: any) => p.codPartida === Number(value));
                    setFormData({
                      ...formData,
                      codPartida: Number(value),
                      codPartidas: partida?.codPartidas || '',
                      nivel: partida?.nivel || 1,
                    });
                  }}
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
            <div className="space-y-2">
              <Label>Código Partida *</Label>
              <Input
                value={formData.codPartidas}
                onChange={(e) => setFormData({ ...formData, codPartidas: e.target.value })}
                placeholder="Ej: EGR-001-01"
                readOnly
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Input type="number" value={formData.nivel} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Control Costos</Label>
                <Select
                  value={formData.flgCC}
                  onValueChange={(value) => setFormData({ ...formData, flgCC: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">Sí</SelectItem>
                    <SelectItem value="N">No</SelectItem>
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Unid. Medida *</Label>
                <Input
                  value={formData.uniMed}
                  onChange={(e) => setFormData({ ...formData, uniMed: e.target.value })}
                  placeholder="012"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Tab. Estado *</Label>
                <Input
                  value={formData.tabEstado}
                  onChange={(e) => setFormData({ ...formData, tabEstado: e.target.value })}
                  placeholder="014"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Cód. Estado *</Label>
                <Input
                  value={formData.codEstado}
                  onChange={(e) => setFormData({ ...formData, codEstado: e.target.value })}
                  placeholder="001"
                  maxLength={3}
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
