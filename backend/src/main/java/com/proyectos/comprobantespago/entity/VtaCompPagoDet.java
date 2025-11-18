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
 * Entidad VTACOMP_PAGODET - Detalle de Comprobantes de Venta/Ingreso
 */
@Entity
@Table(name = "VTACOMP_PAGODET")
@IdClass(VtaCompPagoDet.VtaCompPagoDetId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VtaCompPagoDet implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @NotBlank
    @Size(max = 20)
    @Column(name = "NROCP", nullable = false, length = 20)
    private String nroCp;

    @Id
    @Column(name = "SEC", nullable = false)
    private Integer sec;

    @NotBlank
    @Size(max = 1)
    @Column(name = "INGEGR", nullable = false, length = 1)
    private String ingEgr;

    @NotNull
    @Column(name = "CODPARTIDA", nullable = false)
    private Long codPartida;

    @NotNull
    @Column(name = "IMPNETOMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impNetoMn;

    @NotNull
    @Column(name = "IMPIGVMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impIgvMn;

    @NotNull
    @Column(name = "IMPTOTALMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impTotalMn;

    @NotNull
    @Column(name = "SEMILLA", nullable = false)
    private Integer semilla;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "NROCP", referencedColumnName = "NROCP", insertable = false, updatable = false)
    })
    private VtaCompPagoCab vtaCompPagoCab; // Relación con Partida comentada temporalmente
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumns({
    // @JoinColumn(name = "CodCIA", referencedColumnName = "CodCia", insertable =
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
    public static class VtaCompPagoDetId implements Serializable {
        private Long codCia;
        private String nroCp;
        private Integer sec;
    }
}
