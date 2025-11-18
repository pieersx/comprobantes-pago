// Tipos para partidas presupuestales
export interface Partida {
  codCia: number;
  codPartida: number;
  desPartida: string;
  ingEgr: string; // 'I' para Ingreso, 'E' para Egreso
  vigente: string;
}

export interface PartidaProyecto {
  codCia: number;
  codPyto: number;
  codPartida: number;
  desPartida: string;
  ingEgr: string;
  presupuestoOriginal: number;
  presupuestoEjecutado: number;
  presupuestoDisponible: number;
  porcentajeEjecucion: number;
  nivelAlerta?: 'verde' | 'amarillo' | 'naranja' | 'rojo';
}
