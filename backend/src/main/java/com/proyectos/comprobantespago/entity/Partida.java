package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad PARTIDA
 */
@Entity
@Table(name = "PARTIDA")
@IdClass(Partida.PartidaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partida implements Serializable {

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

    @NotBlank
    @Size(max = 12)
    @Column(name = "CODPARTIDAS", nullable = false, length = 12)
    private String codPartidas;

    @NotBlank
    @Size(max = 30)
    @Column(name = "DESPARTIDA", nullable = false, length = 30)
    private String desPartida;

    @NotBlank
    @Size(max = 1)
    @Column(name = "FLGCC", nullable = false, length = 1)
    private String flgCC;

    @Column(name = "NIVEL", nullable = false)
    private Integer nivel;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TUNIMED", nullable = false, length = 3)
    private String tUniMed;

    @NotBlank
    @Size(max = 3)
    @Column(name = "EUNIMED", nullable = false, length = 3)
    private String eUniMed;

    @Column(name = "SEMILLA")
    private Integer semilla;

    @NotBlank
    @Size(max = 1)
    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "S";

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartidaId implements Serializable {
        private Long codCia;
        private String ingEgr;
        private Long codPartida;
    }
}
