/**
 * Property-based tests for partida hierarchy utilities
 * Feature: partidas-jerarquia-filtros, Property 3: Ordenamiento jerárquico correcto
 * Validates: Requirements 1.3
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
    buildFullPath,
    buildPartidaHierarchy,
    PartidaBase,
    sortHierarchically,
} from '../partida-hierarchy';

// Arbitrary para generar partidas base con nombres únicos
const partidaBaseArb = (
  codPartida: number,
  ingEgr: 'I' | 'E',
  padCodPartida?: number
): fc.Arbitrary<PartidaBase> =>
  fc.record({
    codCia: fc.constant(1),
    ingEgr: fc.constant(ingEgr),
    codPartida: fc.constant(codPartida),
    codPartidas: fc.stringMatching(/^[A-Z]{3}-\d{3}$/), // Formato EGR-001
    desPartida: fc.stringMatching(/^[A-Za-z]{3,10}_\d+$/), // Nombre único con sufijo
    nivel: fc.constant(padCodPartida ? 2 : 1),
    padCodPartida: fc.constant(padCodPartida),
  });

// Genera una estructura jerárquica válida de partidas
// Todos los hijos tienen el mismo ingEgr que su padre
const hierarchicalPartidasArb: fc.Arbitrary<PartidaBase[]> = fc
  .tuple(
    fc.constantFrom<'I' | 'E'>('I', 'E'),
    fc.integer({ min: 1, max: 5 })
  )
  .chain(([ingEgr, numPadres]) => {
    // Generar padres (nivel 1)
    const padreIds = Array.from({ length: numPadres }, (_, i) => i + 1);

    return fc
      .tuple(
        // Generar partidas padre
        fc.tuple(...padreIds.map((id) => partidaBaseArb(id, ingEgr, undefined))),
        // Generar número de hijos por padre
        fc.array(fc.integer({ min: 0, max: 3 }), {
          minLength: numPadres,
          maxLength: numPadres,
        })
      )
      .chain(([padres, hijosCount]) => {
        // Generar hijos para cada padre (mismo ingEgr que el padre)
        let nextId = numPadres + 1;
        const hijosArbs: fc.Arbitrary<PartidaBase>[] = [];

        padres.forEach((padre, idx) => {
          const numHijos = hijosCount[idx];
          for (let i = 0; i < numHijos; i++) {
            hijosArbs.push(partidaBaseArb(nextId++, ingEgr, padre.codPartida));
          }
        });

        if (hijosArbs.length === 0) {
          return fc.constant(padres);
        }

        return fc.tuple(...hijosArbs).map((hijos) => [...padres, ...hijos]);
      });
  });

describe('Partida Hierarchy Utilities', () => {
  /**
   * **Feature: partidas-jerarquia-filtros, Property 3: Ordenamiento jerárquico correcto**
   * **Validates: Requirements 1.3**
   *
   * For any list of partidas sorted hierarchically, each child SHALL appear
   * after its parent in the list.
   */
  it('Property 3: sortHierarchically - children always appear after their parents', () => {
    fc.assert(
      fc.property(hierarchicalPartidasArb, (partidas) => {
        // Mezclar aleatoriamente las partidas
        const shuffled = [...partidas].sort(() => Math.random() - 0.5);

        // Ordenar jerárquicamente
        const sorted = sortHierarchically(shuffled);

        // Crear mapa de índices
        const indexMap = new Map<number, number>();
        sorted.forEach((p, idx) => indexMap.set(p.codPartida, idx));

        // Verificar que cada hijo aparece después de su padre
        for (const partida of sorted) {
          if (partida.padCodPartida) {
            const parentIndex = indexMap.get(partida.padCodPartida);
            const childIndex = indexMap.get(partida.codPartida);

            // Si el padre existe en la lista, debe aparecer antes
            if (parentIndex !== undefined && childIndex !== undefined) {
              expect(parentIndex).toBeLessThan(childIndex);
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: buildFullPath generates correct path from root to leaf
   * Uses codPartida for verification since it's unique
   */
  it('buildFullPath - path contains all ancestors', () => {
    fc.assert(
      fc.property(hierarchicalPartidasArb, (partidas) => {
        const partidaMap = new Map<number, PartidaBase>();
        partidas.forEach((p) => partidaMap.set(p.codPartida, p));

        for (const partida of partidas) {
          const fullPath = buildFullPath(partida, partidaMap);

          // El path debe contener el código de la partida actual
          expect(fullPath).toContain(String(partida.codPartida));

          // Si tiene padre, el path debe contener el código del padre
          if (partida.padCodPartida) {
            const padre = partidaMap.get(partida.padCodPartida);
            if (padre) {
              expect(fullPath).toContain(String(padre.codPartida));
            }
          }

          // Contar cuántos " > " hay en el path para verificar la estructura
          const separatorCount = (fullPath.match(/ > /g) || []).length;

          // Si no tiene padre, no debe haber separadores
          // Si tiene padre, debe haber al menos un separador
          if (!partida.padCodPartida) {
            expect(separatorCount).toBe(0);
          } else {
            expect(separatorCount).toBeGreaterThanOrEqual(1);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: buildPartidaHierarchy enriches partidas with parent info
   */
  it('buildPartidaHierarchy - enriches partidas with parent information', () => {
    fc.assert(
      fc.property(hierarchicalPartidasArb, (partidas) => {
        const enriched = buildPartidaHierarchy(partidas);

        // Crear mapa de partidas originales
        const originalMap = new Map<number, PartidaBase>();
        partidas.forEach((p) => originalMap.set(p.codPartida, p));

        for (const partida of enriched) {
          // Debe tener fullPath
          expect(partida.fullPath).toBeDefined();
          expect(partida.fullPath.length).toBeGreaterThan(0);

          // Si tiene padre, debe tener info del padre
          if (partida.padCodPartida) {
            const padre = originalMap.get(partida.padCodPartida);
            if (padre) {
              expect(partida.padreDesPartida).toBe(padre.desPartida);
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: sortHierarchically preserves all elements
   */
  it('sortHierarchically - preserves all elements (no loss or duplication)', () => {
    fc.assert(
      fc.property(hierarchicalPartidasArb, (partidas) => {
        const sorted = sortHierarchically(partidas);

        // Mismo número de elementos
        expect(sorted.length).toBe(partidas.length);

        // Mismos códigos de partida
        const originalCodes = new Set(partidas.map((p) => p.codPartida));
        const sortedCodes = new Set(sorted.map((p) => p.codPartida));

        expect(sortedCodes.size).toBe(originalCodes.size);
        for (const code of originalCodes) {
          expect(sortedCodes.has(code)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});
