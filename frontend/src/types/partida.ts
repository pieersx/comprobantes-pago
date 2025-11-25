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
  // Campos de jerarquía (Feature: comprobantes-jerarquicos)
  nivel?: number;
  padreNivel1?: number;
  desPartidaNivel1?: string;
  padreNivel2?: number;
  desPartidaNivel2?: string;
  jerarquiaCompleta?: string;
  // Nuevos campos para todos los niveles (Feature: selector-todos-niveles)
  padCodPartida?: number; // Código del padre inmediato
  hierarchyPath?: string; // Ruta completa: "NIVEL1 > NIVEL2 > NIVEL3"
  codPartidas?: string; // Código compuesto de partida
}

// ==================== Types para jerarquía de partidas ====================
// Feature: comprobantes-mejoras
// Requirements: 5.1, 5.2, 5.3, 5.4

/**
 * Partida con información de jerarquía completa
 */
export interface PartidaHierarchy {
  codCia: number;
  ingEgr: 'I' | 'E';
  codPartida: number;
  codPartidas: string;
  desPartida: string;
  nivel: number;
  esUltimoNivel: boolean;
  padCodPartida?: number;
  fullPath: string;
  tUniMed?: string;
  eUniMed?: string;
  children?: PartidaHierarchy[];
}

/**
 * Nodo del árbol de partidas
 */
export interface PartidaTreeNodeExtended {
  codPartida: number;
  desPartida: string;
  nivel: number;
  padCodPartida?: number;
  fullPath: string;
  isLeaf: boolean;
  children: PartidaTreeNodeExtended[];
  orden: number;
  codPartidas?: string;
  esUltimoNivel?: boolean;
}

/**
 * Filtros para selección de partidas
 */
export interface PartidaFilters {
  codCia: number;
  codProyecto: number;
  ingEgr: 'I' | 'E';
  soloUltimoNivel: boolean;
  busqueda?: string;
}

/**
 * Partida seleccionada en el formulario
 */
export interface PartidaSeleccionada {
  codPartida: number;
  desPartida: string;
  nivel: number;
  fullPath: string;
  montoNeto: number;
  igv: number;
  total: number;
}
