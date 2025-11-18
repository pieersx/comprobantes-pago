package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
 * Entidad PROY_PARTIDA_MEZCLA - Detalle de partidas en proyectos
 */
@Entity
@Table(name = "PROY_PARTIDA_MEZCLA")
@IdClass(ProyPartidaMezcla.ProyPartidaMezclaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProyPartidaMezcla implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @Id
    @NotBlank
    @Size(max = 1)
    @Column(name = "INGEGR", nullable = false, length = 1)
    private String ingEgr;

    @Id
    @Column(name = "NROVERSION", nullable = false)
    private Integer nroVersion;

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
    @Column(name = "NIVEL", nullable = false)
    private Integer nivel;

    @NotNull
    @Column(name = "ORDEN", nullable = false)
    private Integer orden;

    @NotNull
    @Column(name = "COSTOUNIT", nullable = false, precision = 9, scale = 2)
    private BigDecimal costoUnit;

    @NotNull
    @Column(name = "CANT", nullable = false, precision = 7, scale = 3)
    private BigDecimal cant;

    @NotNull
    @Column(name = "COSTOTOT", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoTot;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false),
            @JoinColumn(name = "NROVERSION", referencedColumnName = "NROVERSION", insertable = false, updatable = false),
            @JoinColumn(name = "INGEGR", referencedColumnName = "INGEGR", insertable = false, updatable = false),
            @JoinColumn(name = "CODPARTIDA", referencedColumnName = "CODPARTIDA", insertable = false, updatable = false)
    })
    @JsonIgnore
    private ProyPartida proyPartida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "TUNIMED", referencedColumnName = "CODTAB", insertable = false, updatable = false),
            @JoinColumn(name = "EUNIMED", referencedColumnName = "CODELEM", insertable = false, updatable = false)
    })
    @JsonIgnore
    private Elementos elementos;

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProyPartidaMezclaId implements Serializable {
        private Long codCia;
        private Long codPyto;
        private String ingEgr;
        private Integer nroVersion;
        private Long codPartida;
        private Long corr;
    }
}
