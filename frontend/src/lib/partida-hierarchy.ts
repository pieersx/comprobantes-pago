/**
 * Utilidades para jerarquía de partidas presupuestales
 * Feature: partidas-jerarquia-filtros
 * Requirements: 1.1, 1.2, 1.3
 */

/**
 * Interfaz base para partida con campos mínimos requeridos
 */
export interface PartidaBase {
  codCia: number;
  ingEgr: string;
  codPartida: number;
  codPartidas?: string;
  desPartida: string;
  nivel?: number;
  padCodPartida?: number;
  vigente?: string;
  flgCC?: string;
  tuniMed?: string;
  euniMed?: string;
  semilla?: number;
}

/**
 * Partida enriquecida con información de jerarquía
 */
export interface PartidaConJerarquia extends PartidaBase {
  // Información del padre (calculada)
  padreDesPartida?: string;
  padreCodPartidas?: string;
  // Ruta completa para tooltip
  fullPath: string;
  // Hijos (para vista de árbol)
  children?: PartidaConJerarquia[];
}

/**
 * Construye la ruta completa de una partida en la jerarquía
 * Recorre desde la partida actual hasta la raíz
 *
 * @param partida - Partida para la cual construir la ruta
 * @param partidaMap - Mapa de todas las partidas indexadas por codPartida
 * @returns Ruta completa en formato "Padre > Hijo > Nieto"
 */
export function buildFullPath(
  partida: PartidaBase,
  partidaMap: Map<number, PartidaBase>
): string {
  const path: string[] = [];
  let current: PartidaBase | undefined = partida;

  while (current) {
    path.unshift(`${current.codPartida} - ${current.desPartida}`);
    current = current.padCodPartida ? partidaMap.get(current.padCodPartida) : undefined;
  }

  return path.join(' > ');
}

/**
 * Ordena partidas jerárquicamente: padres antes que hijos
 * Agrupa las partidas hijas debajo de sus padres correspondientes
 *
 * @param partidas - Lista de partidas a ordenar
 * @returns Lista ordenada jerárquicamente
 */
export function sortHierarchically<T extends PartidaBase>(partidas: T[]): T[] {
  // Crear mapa para acceso rápido
  const partidaMap = new Map<number, T>();
  partidas.forEach(p => partidaMap.set(p.codPartida, p));

  // Función recursiva para obtener el orden de una partida
  // Retorna un array de códigos desde la raíz hasta la partida
  function getHierarchyPath(partida: T): number[] {
    const path: number[] = [];
    let current: T | undefined = partida;

    while (current) {
      path.unshift(current.codPartida);
      current = current.padCodPartida ? partidaMap.get(current.padCodPartida) : undefined;
    }

    return path;
  }

  // Ordenar comparando las rutas jerárquicas
  return [...partidas].sort((a, b) => {
    // Primero por tipo (I/E)
    if (a.ingEgr !== b.ingEgr) {
      return a.ingEgr.localeCompare(b.ingEgr);
    }

    // Obtener rutas jerárquicas
    const pathA = getHierarchyPath(a);
    const pathB = getHierarchyPath(b);

    // Comparar elemento por elemento
    const minLength = Math.min(pathA.length, pathB.length);
    for (let i = 0; i < minLength; i++) {
      if (pathA[i] !== pathB[i]) {
        return pathA[i] - pathB[i];
      }
    }

    // Si una ruta es prefijo de la otra, la más corta va primero (padre antes que hijo)
    return pathA.length - pathB.length;
  });
}

/**
 * Construye la estructura jerárquica de partidas
 * Enriquece cada partida con información del padre y ruta completa
 *
 * @param partidas - Lista de partidas a procesar
 * @param allPartidas - Lista completa de partidas para buscar padres (opcional, usa partidas si no se provee)
 * @returns Lista de partidas enriquecidas con jerarquía, ordenadas jerárquicamente
 */
export function buildPartidaHierarchy<T extends PartidaBase>(
  partidas: T[],
  allPartidas?: PartidaBase[]
): PartidaConJerarquia[] {
  // Usar allPartidas si se provee, sino usar partidas
  const sourcePartidas = allPartidas || partidas;

  // Crear mapa de partidas por código para búsqueda rápida
  const partidaMap = new Map<number, PartidaBase>();
  sourcePartidas.forEach(p => partidaMap.set(p.codPartida, p));

  // Enriquecer cada partida con info del padre
  const enriched: PartidaConJerarquia[] = partidas.map(p => {
    const padre = p.padCodPartida ? partidaMap.get(p.padCodPartida) : undefined;

    return {
      ...p,
      padreDesPartida: padre?.desPartida || '',
      padreCodPartidas: padre?.codPartidas || '',
      fullPath: buildFullPath(p, partidaMap),
    };
  });

  // Ordenar jerárquicamente
  return sortHierarchically(enriched);
}

/**
 * Obtiene el color de fondo según el nivel de la partida
 * Nivel 1: Verde oscuro, Nivel 2: Verde medio, Nivel 3: Verde claro
 *
 * @param nivel - Nivel de la partida (1, 2 o 3)
 * @param ingEgr - Tipo de partida (I para ingresos, E para egresos)
 * @returns Clase CSS de Tailwind para el color de fondo
 */
export function getNivelColor(nivel: number | undefined, ingEgr?: string): string {
  const isIngreso = ingEgr === 'I';

  switch (nivel) {
    case 1:
      return isIngreso
        ? 'bg-green-700 text-white hover:bg-green-800'
        : 'bg-red-700 text-white hover:bg-red-800';
    case 2:
      return isIngreso
        ? 'bg-green-200 hover:bg-green-300'
        : 'bg-red-200 hover:bg-red-300';
    case 3:
      return isIngreso
        ? 'bg-green-50 hover:bg-green-100'
        : 'bg-red-50 hover:bg-red-100';
    default:
      return 'hover:bg-gray-50';
  }
}

/**
 * Obtiene el padding de indentación según el nivel
 *
 * @param nivel - Nivel de la partida (1, 2 o 3)
 * @returns Clase CSS de Tailwind para el padding izquierdo
 */
export function getNivelIndent(nivel: number | undefined): string {
  switch (nivel) {
    case 1:
      return 'pl-4';
    case 2:
      return 'pl-12';
    case 3:
      return 'pl-20';
    default:
      return 'pl-4';
  }
}

/**
 * Obtiene el icono de conexión según el nivel
 *
 * @param nivel - Nivel de la partida
 * @returns Símbolo de conexión visual
 */
export function getNivelConnector(nivel: number | undefined): string {
  switch (nivel) {
    case 1:
      return '▶';
    case 2:
      return '├─';
    case 3:
      return '└──';
    default:
      return '';
  }
}

/**
 * Obtiene el badge de nivel con estilo visual
 *
 * @param nivel - Nivel de la partida
 * @param ingEgr - Tipo de partida (I para ingresos, E para egresos)
 * @returns Clase CSS de Tailwind para el badge
 */
export function getNivelBadgeColor(nivel: number | undefined, ingEgr?: string): string {
  const isIngreso = ingEgr === 'I';

  switch (nivel) {
    case 1:
      return isIngreso
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white';
    case 2:
      return isIngreso
        ? 'bg-green-400 text-green-900'
        : 'bg-red-400 text-red-900';
    case 3:
      return isIngreso
        ? 'bg-green-200 text-green-800'
        : 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}
