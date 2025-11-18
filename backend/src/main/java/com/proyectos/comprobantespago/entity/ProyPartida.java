package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

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
 * Entidad PROY_PARTIDA - Partidas asignadas a proyectos
 */
@Entity
@Table(name = "PROY_PARTIDA")
@IdClass(ProyPartida.ProyPartidaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProyPartida implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @Id
    @Column(name = "NROVERSION", nullable = false)
    private Integer nroVersion;

    @Id
    @NotBlank
    @Size(max = 1)
    @Column(name = "INGEGR", nullable = false, length = 1)
    private String ingEgr;

    @Id
    @Column(name = "CODPARTIDA", nullable = false)
    private Long codPartida;

    @NotBlank
    @Size(max = 12)
    @Column(name = "CODPARTIDAS", nullable = false, length = 12)
    private String codPartidas;

    @NotBlank
    @Size(max = 1)
    @Column(name = "FLGCC", nullable = false, length = 1)
    private String flgCC;

    @NotNull
    @Column(name = "NIVEL", nullable = false)
    private Integer nivel;

    @NotBlank
    @Size(max = 5)
    @Column(name = "UNIMED", nullable = false, length = 5)
    private String uniMed;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TABESTADO", nullable = false, length = 3)
    private String tabEstado;

    @NotBlank
    @Size(max = 3)
    @Column(name = "CODESTADO", nullable = false, length = 3)
    private String codEstado;

    @NotBlank
    @Size(max = 1)
    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "S";

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false)
    })
    @JsonIgnore
    private Proyecto proyecto;

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

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProyPartidaId implements Serializable {
        private Long codCia;
        private Long codPyto;
        private Integer nroVersion;
        private String ingEgr;
        private Long codPartida;
    }
}
