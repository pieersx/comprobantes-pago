/**
 * Utilidades para ordenar partidas jerárquicamente
 * Ordena para que los hijos aparezcan inmediatamente después de sus padres
 */

export interface PartidaBase {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  nivel: number;
  padCodPartida?: number;
  orden?: number;
  desPartida?: string;
}

/**
 * Ordena partidas jerárquicamente para visualización tipo árbol
 * Los hijos aparecen inmediatamente después de sus padres
 */
export function sortPartidaHierarchy<T extends PartidaBase>(partidas: T[]): T[] {
  // Separar por tipo (Ingreso/Egreso)
  const ingresos = partidas.filter(p => p.ingEgr === 'I');
  const egresos = partidas.filter(p => p.ingEgr === 'E');

  // Ordenar cada grupo jerárquicamente
  const ingresosOrdenados = sortHierarchyGroup(ingresos);
  const egresosOrdenados = sortHierarchyGroup(egresos);

  // Combinar: primero ingresos, luego egresos
  return [...ingresosOrdenados, ...egresosOrdenados];
}

/**
 * Ordena un grupo de partidas (mismo tipo I/E) jerárquicamente
 */
function sortHierarchyGroup<T extends PartidaBase>(partidas: T[]): T[] {
  if (partidas.length === 0) return [];

  // Crear mapa de hijos por padre
  const childrenMap = new Map<number, T[]>();
  const roots: T[] = [];

  // Clasificar partidas
  for (const partida of partidas) {
    // Nivel 1 o sin padre = raíz
    if (partida.nivel === 1 || !partida.padCodPartida || partida.padCodPartida === partida.codPartida) {
      roots.push(partida);
    } else {
      const children = childrenMap.get(partida.padCodPartida) || [];
      children.push(partida);
      childrenMap.set(partida.padCodPartida, children);
    }
  }

  // Ordenar raíces por orden o codPartida
  roots.sort((a, b) => (a.orden || a.codPartida) - (b.orden || b.codPartida));

  // Construir lista ordenada recursivamente
  const result: T[] = [];

  function addWithChildren(partida: T) {
    result.push(partida);

    // Obtener hijos y ordenarlos
    const children = childrenMap.get(partida.codPartida) || [];
    children.sort((a, b) => (a.orden || a.codPartida) - (b.orden || b.codPartida));

    // Agregar hijos recursivamente
    for (const child of children) {
      addWithChildren(child);
    }
  }

  // Procesar cada raíz
  for (const root of roots) {
    addWithChildren(root);
  }

  return result;
}

/**
 * Enriquece partidas con información del padre
 */
export function enrichWithParentInfo<T extends PartidaBase>(
  partidas: T[],
  allPartidas: PartidaBase[]
): (T & { padDesPartida?: string; fullPath?: string })[] {
  // Crear mapa de partidas por código
  const partidaMap = new Map<number, PartidaBase>();
  for (const p of allPartidas) {
    partidaMap.set(p.codPartida, p);
  }

  return partidas.map(partida => {
    const padre = partida.padCodPartida ? partidaMap.get(partida.padCodPartida) : undefined;

    // Construir ruta completa
    const fullPath = buildFullPath(partida, partidaMap);

    return {
      ...partida,
      padDesPartida: padre?.desPartida,
      fullPath,
    };
  });
}

/**
 * Construye la ruta completa de una partida (para tooltip)
 */
function buildFullPath(partida: PartidaBase, partidaMap: Map<number, PartidaBase>): string {
  const path: string[] = [];
  let current: PartidaBase | undefined = partida;
  const visited = new Set<number>();

  while (current && !visited.has(current.codPartida)) {
    visited.add(current.codPartida);
    path.unshift(current.desPartida || `Partida ${current.codPartida}`);

    // Subir al padre
    if (current.padCodPartida && current.padCodPartida !== current.codPartida) {
      current = partidaMap.get(current.padCodPartida);
    } else {
      break;
    }
  }

  return path.join(' > ');
}
