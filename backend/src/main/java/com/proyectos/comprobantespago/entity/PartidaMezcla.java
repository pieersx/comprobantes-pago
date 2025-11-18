package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad PARTIDA_MEZCLA - Define la composición de partidas
 */
@Entity
@Table(name = "PARTIDA_MEZCLA")
@IdClass(PartidaMezcla.PartidaMezclaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartidaMezcla implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @NotBlank
    @Size(max = 1)
    @Column(name = "INGEGR", nullable = false, length = 1)
    private String ingEgr;

    @Id
    @Column(name = "CODPARTIDA", nullable = false)
    private Long codPartida;

    @Id
    @Column(name = "CORR", nullable = false)
    private Long corr;

    @NotNull
    @Column(name = "PADCODPARTIDA", nullable = false)
    private Long padCodPartida;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TUNIMED", nullable = false, length = 3)
    private String tUniMed;

    @NotBlank
    @Size(max = 3)
    @Column(name = "EUNIMED", nullable = false, length = 3)
    private String eUniMed;

    @NotNull
    @Column(name = "COSTOUNIT", nullable = false, precision = 9, scale = 2)
    private BigDecimal costoUnit;

    @NotNull
    @Column(name = "NIVEL", nullable = false)
    private Integer nivel;

    @NotNull
    @Column(name = "ORDEN", nullable = false)
    private Integer orden;

    @NotBlank
    @Size(max = 1)
    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "S";

    // Relación con PARTIDA
    // Relación con Partida comentada temporalmente
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumns({
    // @JoinColumn(name = "CodCia", referencedColumnName = "CodCia", insertable =
    // false, updatable = false),
    // @JoinColumn(name = "IngEgr", referencedColumnName = "IngEgr", insertable =
    // false, updatable = false),
    // @JoinColumn(name = "CodPartida", referencedColumnName = "CodPartida",
    // insertable = false, updatable = false)
    // })
    // private Partida partida;

    // Relación con ELEMENTOS (Unidad de Medida)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "TUNIMED", referencedColumnName = "CODTAB", insertable = false, updatable = false),
            @JoinColumn(name = "EUNIMED", referencedColumnName = "CODELEM", insertable = false, updatable = false)
    })
    private Elementos elementos;

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartidaMezclaId implements Serializable {
        private Long codCia;
        private String ingEgr;
        private Long codPartida;
        private Long corr;
    }
}
