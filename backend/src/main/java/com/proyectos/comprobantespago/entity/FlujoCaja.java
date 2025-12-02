package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

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
 * Entidad FLUJOCAJA
 * Representa la cabecera del flujo de caja por proyecto y partida
 */
@Entity
@Table(name = "FLUJOCAJA")
@IdClass(FlujoCaja.FlujoCajaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCaja implements Serializable {

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
    @NotBlank
    @Size(max = 1)
    @Column(name = "TIPO", nullable = false, length = 1)
    private String tipo;

    @Id
    @Column(name = "CODPARTIDA", nullable = false)
    private Long codPartida;

    @NotNull
    @Column(name = "NIVEL", nullable = false)
    private Integer nivel;

    @NotNull
    @Column(name = "ORDEN", nullable = false)
    private Integer orden;

    @NotBlank
    @Size(max = 30)
    @Column(name = "DESCONCEPTO", nullable = false, length = 30)
    private String desConcepto;

    @NotBlank
    @Size(max = 10)
    @Column(name = "DESCONCEPTOCORTO", nullable = false, length = 10)
    private String desConceptoCorto;

    @Column(name = "SEMILLA")
    private Integer semilla;

    @Column(name = "RAIZ")
    private Integer raiz;

    @Size(max = 3)
    @Column(name = "TABESTADO", length = 3)
    private String tabEstado;

    @Size(max = 3)
    @Column(name = "CODESTADO", length = 3)
    private String codEstado;

    @NotBlank
    @Size(max = 1)
    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false)
    })
    private Proyecto proyecto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "INGEGR", referencedColumnName = "INGEGR", insertable = false, updatable = false),
            @JoinColumn(name = "CODPARTIDA", referencedColumnName = "CODPARTIDA", insertable = false, updatable = false)
    })
    private Partida partida;

    /**
     * Clase para la clave primaria compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlujoCajaId implements Serializable {
        private Long codCia;
        private Long codPyto;
        private String ingEgr;
        private String tipo;
        private Long codPartida;
    }
}
