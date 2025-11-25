package com.proyectos.comprobantespago.property.generators;

import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;

/**
 * Generador de tipos de comprobante válidos para property tests.
 * Genera valores: 'FAC', 'BOL', 'REC'
 */
public class TipoComprobanteGenerator {

    /**
     * Genera tipos de comprobante válidos
     */
    public static Arbitrary<String> tiposComprobante() {
        return Arbitraries.of("FAC", "BOL", "REC");
    }

    /**
     * Genera solo tipos con IGV fijo (FAC, BOL)
     */
    public static Arbitrary<String> tiposConIGV() {
        return Arbitraries.of("FAC", "BOL");
    }

    /**
     * Genera solo tipo con retención (REC)
     */
    public static Arbitrary<String> tipoConRetencion() {
        return Arbitraries.just("REC");
    }
}
