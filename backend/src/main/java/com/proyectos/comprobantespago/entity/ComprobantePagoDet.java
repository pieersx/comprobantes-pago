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
import jakarta.validation.constraints.DecimalMin;
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
 * Entidad COMP_PAGODET - Detalle de Comprobantes de Pago (egresos)
 */
@Entity
@Table(name = "COMP_PAGODET")
@IdClass(ComprobantePagoDet.ComprobantePagoDetId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobantePagoDet implements Serializable {

    @Id
    @NotNull
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @NotNull
    @Column(name = "CODPROVEEDOR", nullable = false)
    private Long codProveedor;

    @Id
    @NotBlank
    @Size(max = 20)
    @Column(name = "NROCP", nullable = false, length = 20)
    private String nroCp;

    @Id
    @NotNull
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
    @DecimalMin(value = "0.0")
    @Column(name = "IMPNETOMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impNetoMn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPIGVMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impIgvMn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPTOTALMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impTotalMn;

    @NotNull
    @Column(name = "SEMILLA", nullable = false)
    private Integer semilla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPROVEEDOR", referencedColumnName = "CODPROVEEDOR", insertable = false, updatable = false),
            @JoinColumn(name = "NROCP", referencedColumnName = "NROCP", insertable = false, updatable = false)
    })
    private ComprobantePagoCab comprobanteCabecera;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "INGEGR", referencedColumnName = "INGEGR", insertable = false, updatable = false),
            @JoinColumn(name = "CODPARTIDA", referencedColumnName = "CODPARTIDA", insertable = false, updatable = false)
    })
    private Partida partida;

    /**
     * Retorna el importe total en moneda nacional (alias de compatibilidad)
     */
    public BigDecimal getTotal() {
        return impTotalMn;
    }

    public void setTotal(BigDecimal total) {
        this.impTotalMn = total;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComprobantePagoDetId implements Serializable {
        private Long codCia;
        private Long codProveedor;
        private String nroCp;
        private Integer sec;
    }
}
