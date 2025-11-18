package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
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
 * Entidad DPROY_PARTIDA_MEZCLA - Detalles de desembolsos de partidas
 */
@Entity
@Table(name = "DPROY_PARTIDA_MEZCLA")
@IdClass(DProyPartidaMezcla.DProyPartidaMezclaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DProyPartidaMezcla implements Serializable {

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

    @Id
    @Column(name = "SEC", nullable = false)
    private Integer sec;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TDESEMBOLSO", nullable = false, length = 3)
    private String tDesembolso;

    @NotBlank
    @Size(max = 3)
    @Column(name = "EDESEMBOLSO", nullable = false, length = 3)
    private String eDesembolso;

    @NotNull
    @Column(name = "NROPAGO", nullable = false)
    private Integer nroPago;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TCOMPPAGO", nullable = false, length = 3)
    private String tCompPago;

    @NotBlank
    @Size(max = 3)
    @Column(name = "ECOMPPAGO", nullable = false, length = 3)
    private String eCompPago;

    @NotNull
    @Column(name = "FECDESEMBOLSO", nullable = false)
    private LocalDate fecDesembolso;

    @NotNull
    @Column(name = "IMPDESEMBNETO", nullable = false, precision = 9, scale = 2)
    private BigDecimal impDesembNeto;

    @NotNull
    @Column(name = "IMPDESEMBIGV", nullable = false, precision = 8, scale = 2)
    private BigDecimal impDesembIGV;

    @NotNull
    @Column(name = "IMPDESEMBTOT", nullable = false, precision = 9, scale = 2)
    private BigDecimal impDesembTot;

    @NotNull
    @Column(name = "SEMILLA", nullable = false)
    private Integer semilla;

    // Relaciones - Comentado temporalmente por incompatibilidad de columnas
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumns({
    // @JoinColumn(name = "CodCia", referencedColumnName = "CODCIA", insertable =
    // false, updatable = false),
    // @JoinColumn(name = "CodPyto", referencedColumnName = "CODPYTO", insertable =
    // false, updatable = false),
    // @JoinColumn(name = "CodPartida", referencedColumnName = "CODPARTIDA",
    // insertable = false, updatable = false),
    // @JoinColumn(name = "CodMezcla", referencedColumnName = "COD_MEZCLA",
    // insertable = false, updatable = false)
    // })
    // private ProyPartidaMezcla proyPartidaMezcla;

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DProyPartidaMezclaId implements Serializable {
        private Long codCia;
        private Long codPyto;
        private String ingEgr;
        private Integer nroVersion;
        private Long codPartida;
        private Long corr;
        private Integer sec;
    }
}
