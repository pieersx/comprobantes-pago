package com.proyectos.comprobantespago.property.generators;

import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;
import net.jqwik.api.Combinators;

import java.math.BigDecimal;

/**
 * Generador de partidas válidas para property tests.
 * Genera partidas con niveles válidos según tipo de movimiento.
 */
public class PartidaGenerator {

    /**
     * DTO simple para representar una partida en tests
     */
    public static class PartidaDTO {
        public Integer codPartida;
        public String desPartida;
        public Integer nivel;
        public String tipoMovimiento; // 'I' o 'E'
        public Integer padCodPartida;

        public PartidaDTO(Integer codPartida, String desPartida, Integer nivel,
                         String tipoMovimiento, Integer padCodPartida) {
            this.codPartida = codPartida;
            this.desPartida = desPartida;
            this.nivel = nivel;
            this.tipoMovimiento = tipoMovimiento;
            this.padCodPartida = padCodPartida;
        }
    }

    /**
     * Genera partidas de ingreso (nivel 1 o 2)
     */
    public static Arbitrary<PartidaDTO> partidasIngreso() {
        return Combinators.combine(
            Arbitraries.integers().between(1000, 9999),
            Arbitraries.strings().alpha().ofLength(20),
            Arbitraries.integers().between(1, 2),
            Arbitraries.just("I")
        ).as((cod, des, nivel, tipo) -> {
            Integer padre = nivel == 1 ? 0 : Arbitraries.integers().between(1000, 9999).sample();
            return new PartidaDTO(cod, des, nivel, tipo, padre);
        });
    }

    /**
     * Genera partidas de egreso (nivel 1, 2 o 3)
     */
    public static Arbitrary<PartidaDTO> partidasEgreso() {
        return Combinators.combine(
            Arbitraries.integers().between(2000, 9999),
            Arbitraries.strings().alpha().ofLength(20),
            Arbitraries.integers().between(1, 3),
            Arbitraries.just("E")
        ).as((cod, des, nivel, tipo) -> {
            Integer padre = nivel == 1 ? 0 : Arbitraries.integers().between(2000, 9999).sample();
            return new PartidaDTO(cod, des, nivel, tipo, padre);
        });
    }

    /**
     * Genera partidas del último nivel para ingresos (nivel 2)
     */
    public static Arbitrary<PartidaDTO> partidasIngresoUltimoNivel() {
        return Combinators.combine(
            Arbitraries.integers().between(1000, 9999),
            Arbitraries.strings().alpha().ofLength(20),
            Arbitraries.just(2),
            Arbitraries.just("I"),
            Arbitraries.integers().between(1000, 9999)
        ).as(PartidaDTO::new);
    }

    /**
     * Genera partidas del último nivel para egresos (nivel 3)
     */
    public static Arbitrary<PartidaDTO> partidasEgresoUltimoNivel() {
        return Combinators.combine(
            Arbitraries.integers().between(2000, 9999),
            Arbitraries.strings().alpha().ofLength(20),
            Arbitraries.just(3),
            Arbitraries.just("E"),
            Arbitraries.integers().between(2000, 9999)
        ).as(PartidaDTO::new);
    }
}
