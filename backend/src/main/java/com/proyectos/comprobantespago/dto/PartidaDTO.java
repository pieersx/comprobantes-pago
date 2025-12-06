package com.proyectos.comprobantespago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad Partida
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartidaDTO {
    private Long codCia;
    private String ingEgr;
    private Long codPartida;
    private String codPartidas;
    private String desPartida;
    private String flgCC;
    private Integer nivel;

    @JsonProperty("tUniMed")
    private String tUniMed;

    @JsonProperty("eUniMed")
    private String eUniMed;

    private Integer semilla;
    private String vigente;

    // Datos para la relación jerárquica (PARTIDA_MEZCLA)
    private Long padCodPartida; // Código de la partida padre
    private Long corr; // Correlativo en PARTIDA_MEZCLA
    private Integer orden; // Orden entre hermanos
    private java.math.BigDecimal costoUnit; // Costo unitario (por defecto 0)

    /**
     * Ruta completa de la partida en la jerarquía
     * Ejemplo: "Ingresos > Ventas > Servicios Técnicos"
     */
    private String fullPath;

    /**
     * Indica si la partida es del último nivel (hoja) y puede usarse en
     * comprobantes
     * Feature: comprobantes-mejoras
     * Requirements: 5.1, 5.2
     */
    private Boolean esUltimoNivel;

    /**
     * Código de la partida padre
     */
    // Nota: se conserva por compatibilidad con el UI; se rellena desde
    // PARTIDA_MEZCLA

    // ========== Información de jerarquía (Feature: comprobantes-jerarquicos)
    // ==========

    /**
     * Código de la partida padre de nivel 2
     */
    private Long padreNivel2;

    /**
     * Descripción de la partida padre de nivel 2
     */
    private String desPartidaNivel2;

    /**
     * Código de la partida padre de nivel 1
     */
    private Long padreNivel1;

    /**
     * Descripción de la partida padre de nivel 1
     */
    private String desPartidaNivel1;

    /**
     * Jerarquía completa para display
     * Ejemplo: "EGRESOS > COSTOS DIRECTOS > MATERIALES DE CONSTRUCCION"
     */
    private String jerarquiaCompleta;
}
