/**
 * Property-based tests for comprobante filter utilities
 * Feature: partidas-jerarquia-filtros
 * Property 6: Filtrado por proyecto correcto
 * Property 7: Filtrado por proveedor/cliente correcto
 * Validates: Requirements 3.2, 4.2
 */

import { ComprobanteUnificado } from '@/services/comprobantes-unified.service';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
    extractProveedoresClientes,
    filterByProveedorCliente,
    filterByProyecto,
} from '../comprobante-filters';

// Helper to generate valid ISO date strings
const validDateStringArb = fc.integer({ min: 2020, max: 2025 }).chain(year =>
  fc.integer({ min: 1, max: 12 }).chain(month =>
    fc.integer({ min: 1, max: 28 }).map(day =>
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`
    )
  )
);

// Arbitrary para generar comprobantes unificados
const comprobanteUnificadoArb: fc.Arbitrary<ComprobanteUnificado> = fc.record({
  nroCP: fc.stringMatching(/^CP-\d{4}$/),
  codProveedor: fc.integer({ min: 1, max: 100 }),
  codEmpleado: fc.option(fc.integer({ min: 1, max: 50 }), { nil: undefined }),
  proveedor: fc.stringMatching(/^[A-Za-z]{3,15}$/),
  codPyto: fc.integer({ min: 1, max: 20 }),
  proyecto: fc.stringMatching(/^Proyecto_\d{1,3}$/),
  fecCP: validDateStringArb,
  impTotalMn: fc.float({ min: 100, max: 100000 }),
  estado: fc.constantFrom('001', '002', '003'),
  tipo: fc.constantFrom('INGRESO', 'EGRESO', 'EGRESO_EMPLEADO') as fc.Arbitrary<'INGRESO' | 'EGRESO' | 'EGRESO_EMPLEADO'>,
  tCompPago: fc.option(fc.constantFrom('FAC', 'BOL', 'REC', 'OTR'), { nil: undefined }),
  fotoCp: fc.option(fc.string(), { nil: undefined }),
  fotoAbono: fc.option(fc.string(), { nil: undefined }),
  fecAbono: fc.option(validDateStringArb, { nil: undefined }),
});

// Genera una lista de comprobantes con variedad de proyectos
const comprobantesListArb: fc.Arbitrary<ComprobanteUnificado[]> = fc
  .array(comprobanteUnificadoArb, { minLength: 1, maxLength: 50 });

describe('Comprobante Filter Utilities', () => {
  /**
   * **Feature: partidas-jerarquia-filtros, Property 6: Filtrado por proyecto correcto**
   * **Validates: Requirements 3.2**
   *
   * For any selection of project in the filter, all comprobantes shown SHALL have
   * codPyto equal to the selected project.
   */
  it('Property 6: filterByProyecto - all results have matching codPyto', () => {
    fc.assert(
      fc.property(
        comprobantesListArb,
        fc.integer({ min: 1, max: 20 }),
        (comprobantes, codPyto) => {
          const filtered = filterByProyecto(comprobantes, String(codPyto));

          // All filtered comprobantes must have the selected codPyto
          for (const comprobante of filtered) {
            expect(comprobante.codPyto).toBe(codPyto);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 complement: 'all' filter returns all comprobantes
   */
  it('Property 6: filterByProyecto - "all" returns all comprobantes', () => {
    fc.assert(
      fc.property(comprobantesListArb, (comprobantes) => {
        const filtered = filterByProyecto(comprobantes, 'all');

        expect(filtered.length).toBe(comprobantes.length);
        expect(filtered).toEqual(comprobantes);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 complement: empty string filter returns all comprobantes
   */
  it('Property 6: filterByProyecto - empty string returns all comprobantes', () => {
    fc.assert(
      fc.property(comprobantesListArb, (comprobantes) => {
        const filtered = filterByProyecto(comprobantes, '');

        expect(filtered.length).toBe(comprobantes.length);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 complement: filtered results are subset of original
   */
  it('Property 6: filterByProyecto - results are subset of original', () => {
    fc.assert(
      fc.property(
        comprobantesListArb,
        fc.integer({ min: 1, max: 20 }),
        (comprobantes, codPyto) => {
          const filtered = filterByProyecto(comprobantes, String(codPyto));

          // Filtered length should be <= original length
          expect(filtered.length).toBeLessThanOrEqual(comprobantes.length);

          // All filtered items should exist in original
          for (const item of filtered) {
            expect(comprobantes).toContainEqual(item);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: partidas-jerarquia-filtros, Property 7: Filtrado por proveedor/cliente correcto**
   * **Validates: Requirements 4.2**
   *
   * For any selection of provider/client in the filter, all comprobantes shown SHALL have
   * codProveedor or codCliente equal to the selected entity.
   */
  it('Property 7: filterByProveedorCliente - all results have matching codProveedor', () => {
    fc.assert(
      fc.property(
        comprobantesListArb,
        fc.integer({ min: 1, max: 100 }),
        (comprobantes, codProveedorCliente) => {
          const filtered = filterByProveedorCliente(comprobantes, String(codProveedorCliente));

          // All filtered comprobantes must have the selected codProveedor
          // (or codEmpleado for EGRESO_EMPLEADO type)
          for (const comprobante of filtered) {
            if (comprobante.tipo === 'EGRESO_EMPLEADO') {
              expect(comprobante.codEmpleado).toBe(codProveedorCliente);
            } else {
              expect(comprobante.codProveedor).toBe(codProveedorCliente);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7 complement: 'all' filter returns all comprobantes
   */
  it('Property 7: filterByProveedorCliente - "all" returns all comprobantes', () => {
    fc.assert(
      fc.property(comprobantesListArb, (comprobantes) => {
        const filtered = filterByProveedorCliente(comprobantes, 'all');

        expect(filtered.length).toBe(comprobantes.length);
        expect(filtered).toEqual(comprobantes);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7 complement: filtered results are subset of original
   */
  it('Property 7: filterByProveedorCliente - results are subset of original', () => {
    fc.assert(
      fc.property(
        comprobantesListArb,
        fc.integer({ min: 1, max: 100 }),
        (comprobantes, codProveedorCliente) => {
          const filtered = filterByProveedorCliente(comprobantes, String(codProveedorCliente));

          // Filtered length should be <= original length
          expect(filtered.length).toBeLessThanOrEqual(comprobantes.length);

          // All filtered items should exist in original
          for (const item of filtered) {
            expect(comprobantes).toContainEqual(item);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: extractProveedoresClientes returns unique entries
   */
  it('extractProveedoresClientes - returns unique entries', () => {
    fc.assert(
      fc.property(comprobantesListArb, (comprobantes) => {
        const result = extractProveedoresClientes(comprobantes);

        // Check uniqueness by value
        const values = result.map(r => r.value);
        const uniqueValues = new Set(values);

        // Note: values might not be unique because different types can have same code
        // But the combination of tipo + value should be unique
        const keys = result.map(r => `${r.tipo}-${r.value}`);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(result.length);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: extractProveedoresClientes labels contain tipo
   */
  it('extractProveedoresClientes - labels contain tipo information', () => {
    fc.assert(
      fc.property(comprobantesListArb, (comprobantes) => {
        const result = extractProveedoresClientes(comprobantes);

        for (const item of result) {
          // Label should contain the tipo in parentheses
          expect(item.label).toContain(`(${item.tipo})`);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Combining filters reduces or maintains result count
   */
  it('Combining filters - result count is less than or equal to single filter', () => {
    fc.assert(
      fc.property(
        comprobantesListArb,
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 1, max: 100 }),
        (comprobantes, codPyto, codProveedorCliente) => {
          const filteredByProyecto = filterByProyecto(comprobantes, String(codPyto));
          const filteredByProveedor = filterByProveedorCliente(comprobantes, String(codProveedorCliente));

          // Apply both filters
          const filteredBoth = filterByProveedorCliente(
            filterByProyecto(comprobantes, String(codPyto)),
            String(codProveedorCliente)
          );

          // Combined filter should have <= results than either single filter
          expect(filteredBoth.length).toBeLessThanOrEqual(filteredByProyecto.length);
          expect(filteredBoth.length).toBeLessThanOrEqual(filteredByProveedor.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
