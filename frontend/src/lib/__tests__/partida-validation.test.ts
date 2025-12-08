/**
 * Property-based tests for partida validation utilities
 * Feature: partidas-jerarquia-filtros
 * Property 4: Unicidad de código numérico
 * Property 5: Unicidad de código alfanumérico
 * Validates: Requirements 2.1, 2.2
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
    PartidaForValidation,
    validateCodPartidaUnique,
    validateCodPartidasUnique,
} from '../partida-validation';

// Arbitrary para generar partidas para validación
const partidaForValidationArb: fc.Arbitrary<PartidaForValidation> = fc.record({
  codPartida: fc.integer({ min: 1, max: 9999 }),
  codPartidas: fc.stringMatching(/^[A-Z]{3}-\d{3}$/), // Formato EGR-001
  ingEgr: fc.constantFrom('I', 'E'),
});

// Genera una lista de partidas con códigos únicos
const uniquePartidasListArb: fc.Arbitrary<PartidaForValidation[]> = fc
  .array(partidaForValidationArb, { minLength: 1, maxLength: 20 })
  .map((partidas) => {
    // Asegurar unicidad de codPartida por ingEgr
    const seen = new Map<string, Set<number>>();
    return partidas.filter((p) => {
      const key = p.ingEgr;
      if (!seen.has(key)) {
        seen.set(key, new Set());
      }
      const set = seen.get(key)!;
      if (set.has(p.codPartida)) {
        return false;
      }
      set.add(p.codPartida);
      return true;
    });
  })
  .filter((list) => list.length > 0);

describe('Partida Validation Utilities', () => {
  /**
   * **Feature: partidas-jerarquia-filtros, Property 4: Unicidad de código numérico**
   * **Validates: Requirements 2.1**
   *
   * For any attempt to create a partida with a codPartida that already exists
   * for the same ingEgr, the system SHALL reject the operation and show error.
   */
  it('Property 4: validateCodPartidaUnique - detects duplicate numeric codes', () => {
    fc.assert(
      fc.property(uniquePartidasListArb, (existingPartidas) => {
        // Tomar una partida existente
        const existingPartida = existingPartidas[0];

        // Intentar crear con el mismo código y tipo
        const result = validateCodPartidaUnique(
          existingPartida.codPartida,
          existingPartida.ingEgr,
          existingPartidas,
          false // No es edición
        );

        // Debe detectar el duplicado
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain(String(existingPartida.codPartida));
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4 complemento: códigos únicos son válidos
   */
  it('Property 4: validateCodPartidaUnique - accepts unique numeric codes', () => {
    fc.assert(
      fc.property(
        uniquePartidasListArb,
        fc.integer({ min: 10000, max: 99999 }), // Código que no existe
        fc.constantFrom<'I' | 'E'>('I', 'E'),
        (existingPartidas, newCode, ingEgr) => {
          // Verificar que el código no existe
          const exists = existingPartidas.some(
            (p) => p.codPartida === newCode && p.ingEgr === ingEgr
          );

          if (!exists) {
            const result = validateCodPartidaUnique(
              newCode,
              ingEgr,
              existingPartidas,
              false
            );

            // Debe ser válido
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: En modo edición, el código original es válido
   */
  it('Property 4: validateCodPartidaUnique - allows same code when editing', () => {
    fc.assert(
      fc.property(uniquePartidasListArb, (existingPartidas) => {
        const existingPartida = existingPartidas[0];

        // En modo edición con el código original
        const result = validateCodPartidaUnique(
          existingPartida.codPartida,
          existingPartida.ingEgr,
          existingPartidas,
          true, // Es edición
          existingPartida.codPartida // Código original
        );

        // Debe ser válido
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: partidas-jerarquia-filtros, Property 5: Unicidad de código alfanumérico**
   * **Validates: Requirements 2.2**
   *
   * For any attempt to create a partida with a codPartidas that already exists
   * for the same ingEgr, the system SHALL reject the operation and show error.
   */
  it('Property 5: validateCodPartidasUnique - detects duplicate alphanumeric codes', () => {
    fc.assert(
      fc.property(uniquePartidasListArb, (existingPartidas) => {
        // Filtrar partidas que tienen codPartidas definido
        const partidasConCodigo = existingPartidas.filter((p) => p.codPartidas);
        if (partidasConCodigo.length === 0) return;

        const existingPartida = partidasConCodigo[0];

        // Intentar crear con el mismo código alfanumérico y tipo
        const result = validateCodPartidasUnique(
          existingPartida.codPartidas!,
          existingPartida.ingEgr,
          existingPartidas,
          false
        );

        // Debe detectar el duplicado
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain(existingPartida.codPartidas!);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5 complemento: códigos alfanuméricos únicos son válidos
   */
  it('Property 5: validateCodPartidasUnique - accepts unique alphanumeric codes', () => {
    fc.assert(
      fc.property(
        uniquePartidasListArb,
        fc.stringMatching(/^NEW-\d{4}$/), // Código que no existe
        fc.constantFrom<'I' | 'E'>('I', 'E'),
        (existingPartidas, newCode, ingEgr) => {
          // Verificar que el código no existe
          const exists = existingPartidas.some(
            (p) =>
              p.codPartidas?.toUpperCase() === newCode.toUpperCase() &&
              p.ingEgr === ingEgr
          );

          if (!exists) {
            const result = validateCodPartidasUnique(
              newCode,
              ingEgr,
              existingPartidas,
              false
            );

            // Debe ser válido
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: En modo edición, el código original es válido
   */
  it('Property 5: validateCodPartidasUnique - allows same code when editing', () => {
    fc.assert(
      fc.property(uniquePartidasListArb, (existingPartidas) => {
        const partidasConCodigo = existingPartidas.filter((p) => p.codPartidas);
        if (partidasConCodigo.length === 0) return;

        const existingPartida = partidasConCodigo[0];

        // En modo edición con el código original
        const result = validateCodPartidasUnique(
          existingPartida.codPartidas!,
          existingPartida.ingEgr,
          existingPartidas,
          true, // Es edición
          existingPartida.codPartidas // Código original
        );

        // Debe ser válido
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Mismo código con diferente ingEgr es válido
   */
  it('validateCodPartidaUnique - same code with different ingEgr is valid', () => {
    fc.assert(
      fc.property(uniquePartidasListArb, (existingPartidas) => {
        const existingPartida = existingPartidas[0];
        const otherIngEgr = existingPartida.ingEgr === 'I' ? 'E' : 'I';

        // Verificar que no existe con el otro tipo
        const existsInOther = existingPartidas.some(
          (p) =>
            p.codPartida === existingPartida.codPartida && p.ingEgr === otherIngEgr
        );

        if (!existsInOther) {
          const result = validateCodPartidaUnique(
            existingPartida.codPartida,
            otherIngEgr,
            existingPartidas,
            false
          );

          // Debe ser válido porque es diferente tipo
          expect(result.isValid).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});
