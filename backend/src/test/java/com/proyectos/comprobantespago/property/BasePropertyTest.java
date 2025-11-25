package com.proyectos.comprobantespago.property;

import net.jqwik.api.ForAll;
import net.jqwik.api.Property;
import net.jqwik.api.constraints.IntRange;
import net.jqwik.api.constraints.BigRange;
import org.junit.jupiter.api.Tag;

/**
 * Clase base para property-based tests usando jqwik.
 * Todos los property tests deben extender esta clase.
 *
 * Configuración:
 * - Cada property test ejecuta un mínimo de 100 iteraciones
 * - Los tests generan datos aleatorios válidos
 * - Cada test debe estar etiquetado con el número de propiedad del diseño
 */
@Tag("property-test")
public abstract class BasePropertyTest {

    /**
     * Número de iteraciones por defecto para property tests
     */
    protected static final int DEFAULT_TRIES = 100;

    /**
     * Redondea un valor BigDecimal a 2 decimales usando HALF_UP
     */
    protected java.math.BigDecimal redondear(java.math.BigDecimal valor) {
        return valor.setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
