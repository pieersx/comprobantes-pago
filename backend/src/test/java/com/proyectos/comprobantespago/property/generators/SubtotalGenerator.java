package com.proyectos.comprobantespago.property.generators;

import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;
import net.jqwik.api.providers.ArbitraryProvider;
import net.jqwik.api.providers.TypeUsage;

import java.math.BigDecimal;
import java.util.Set;

/**
 * Generador de valores de subtotal válidos para property tests.
 * Genera valores monetarios entre 0.01 y 999999.99
 */
public class SubtotalGenerator implements ArbitraryProvider {

    @Override
    public boolean canProvideFor(TypeUsage targetType) {
        return targetType.isOfType(BigDecimal.class);
    }

    @Override
    public Set<Arbitrary<?>> provideFor(TypeUsage targetType, SubtypeProvider subtypeProvider) {
        Arbitrary<BigDecimal> subtotals = Arbitraries
            .doubles()
            .between(0.01, 999999.99)
            .map(d -> BigDecimal.valueOf(d).setScale(2, java.math.RoundingMode.HALF_UP));

        return Set.of(subtotals);
    }

    /**
     * Método estático para usar directamente en tests
     */
    public static Arbitrary<BigDecimal> subtotales() {
        return Arbitraries
            .doubles()
            .between(0.01, 999999.99)
            .map(d -> BigDecimal.valueOf(d).setScale(2, java.math.RoundingMode.HALF_UP));
    }
}
