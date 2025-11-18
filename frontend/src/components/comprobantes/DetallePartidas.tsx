'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DetallePartidaForm } from '@/hooks/useComprobanteForm';
import { PartidaProyecto } from '@/types/partida';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MontoCalculator } from './MontoCalculator';
import { PartidaSelector } from './PartidaSelector';

interface DetallePartidasProps {
  detalles: DetallePartidaForm[];
  codPyto: number;
  tipo: 'ingreso' | 'egreso';
  onAdd: (partida: Omit<DetallePartidaForm, 'sec'>) => void;
  onUpdate: (sec: number, partida: Partial<DetallePartidaForm>) => void;
  onRemove: (sec: number) => void;
  readonly?: boolean;
}

/**
 * Componente para gestionar el detalle de partidas de un comprobante
 * Muestra tabla con partidas y permite agregar, editar y eliminar
 *
 * @param detalles - Array de partidas del comprobante
 * @param codPyto - Código del proyecto
 * @param tipo - Tipo de comprobante: 'ingreso' o 'egreso'
 * @param onAdd - Callback para agregar una partida
 * @param onUpdate - Callback para actualizar una partida
 * @param onRemove - Callback para eliminar una partida
 * @param readonly - Si es true, no permite editar
 */
export function DetallePartidas({
  detalles,
  codPyto,
  tipo,
  onAdd,
  onUpdate,
  onRemove,
  readonly = false,
}: DetallePartidasProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartida, setEditingPartida] = useState<DetallePartidaForm | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partidaToDelete, setPartidaToDelete] = useState<number | null>(null);

  // Estado del formulario de partida
  const [selectedPartida, setSelectedPartida] = useState<PartidaProyecto | null>(null);
  const [montos, setMontos] = useState({
    impNetoMn: 0,
    impIgvMn: 0,
    impTotalMn: 0,
  });

  const tipoPartida = tipo === 'ingreso' ? 'I' : 'E';

  const handleOpenDialog = (partida?: DetallePartidaForm) => {
    if (partida) {
      // Modo edición
      setEditingPartida(partida);
      setMontos({
        impNetoMn: partida.impNetoMn,
        impIgvMn: partida.impIgvMn,
        impTotalMn: partida.impTotalMn,
      });
    } else {
      // Modo agregar
      setEditingPartida(null);
      setSelectedPartida(null);
      setMontos({
        impNetoMn: 0,
        impIgvMn: 0,
        impTotalMn: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPartida(null);
    setSelectedPartida(null);
    setMontos({
      impNetoMn: 0,
      impIgvMn: 0,
      impTotalMn: 0,
    });
  };

  const handleSavePartida = () => {
    if (editingPartida) {
      // Actualizar partida existente
      onUpdate(editingPartida.sec, montos);
    } else {
      // Agregar nueva partida
      if (!selectedPartida) return;

      onAdd({
        codPartida: selectedPartida.codPartida,
        nombrePartida: selectedPartida.desPartida,
        impNetoMn: montos.impNetoMn,
        impIgvMn: montos.impIgvMn,
        impTotalMn: montos.impTotalMn,
        presupuestoDisponible: selectedPartida.presupuestoDisponible,
        porcentajeEjecucion: selectedPartida.porcentajeEjecucion,
        nivelAlerta: selectedPartida.nivelAlerta,
      });
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (sec: number) => {
    setPartidaToDelete(sec);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partidaToDelete !== null) {
      onRemove(partidaToDelete);
    }
    setDeleteDialogOpen(false);
    setPartidaToDelete(null);
  };

  const getNivelAlertaBadge = (nivel?: string) => {
    switch (nivel) {
      case 'verde':
        return <Badge variant="success" className="text-xs">Normal</Badge>;
      case 'amarillo':
        return <Badge variant="warning" className="text-xs">Atención</Badge>;
      case 'naranja':
        return <Badge variant="warning" className="text-xs">Urgente</Badge>;
      case 'rojo':
        return <Badge variant="destructive" className="text-xs">Excedido</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">N/A</Badge>;
    }
  };

  const formatearMonto = (monto: number): string => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const calcularTotales = () => {
    return detalles.reduce(
      (acc, detalle) => ({
        neto: acc.neto + detalle.impNetoMn,
        igv: acc.igv + detalle.impIgvMn,
        total: acc.total + detalle.impTotalMn,
      }),
      { neto: 0, igv: 0, total: 0 }
    );
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-4">
      {/* Botón agregar partida */}
      {!readonly && (
        <div className="flex justify-end">
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Partida
          </Button>
        </div>
      )}

      {/* Tabla de partidas */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Partida</TableHead>
              <TableHead className="text-right">Neto</TableHead>
              <TableHead className="text-right">IGV</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Presupuesto</TableHead>
              {!readonly && <TableHead className="text-center w-[100px]">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readonly ? 6 : 7} className="text-center text-muted-foreground py-8">
                  No hay partidas agregadas
                </TableCell>
              </TableRow>
            ) : (
              <>
                {detalles.map((detalle, index) => (
                  <TableRow key={detalle.sec}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{detalle.codPartida}</span>
                        <span className="text-sm text-muted-foreground">
                          {detalle.nombrePartida}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatearMonto(detalle.impNetoMn)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatearMonto(detalle.impIgvMn)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatearMonto(detalle.impTotalMn)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getNivelAlertaBadge(detalle.nivelAlerta)}
                    </TableCell>
                    {!readonly && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(detalle)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(detalle.sec)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {/* Fila de totales */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2} className="text-right">
                    TOTALES
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatearMonto(totales.neto)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatearMonto(totales.igv)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatearMonto(totales.total)}
                  </TableCell>
                  <TableCell colSpan={readonly ? 1 : 2}></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para agregar/editar partida */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPartida ? 'Editar Partida' : 'Agregar Partida'}
            </DialogTitle>
            <DialogDescription>
              {editingPartida
                ? 'Modifique los montos de la partida'
                : 'Seleccione una partida e ingrese los montos'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Selector de partida (solo en modo agregar) */}
            {!editingPartida && (
              <PartidaSelector
                codPyto={codPyto}
                tipo={tipoPartida}
                value={selectedPartida?.codPartida}
                onChange={setSelectedPartida}
              />
            )}

            {/* Calculadora de montos */}
            {(editingPartida || selectedPartida) && (
              <MontoCalculator
                impNetoMn={montos.impNetoMn}
                onCalculate={setMontos}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSavePartida}
              disabled={!editingPartida && !selectedPartida}
            >
              {editingPartida ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta partida? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
