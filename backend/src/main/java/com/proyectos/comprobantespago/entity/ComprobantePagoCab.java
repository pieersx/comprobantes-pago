package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

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
 * Entidad COMP_PAGOCAB - Comprobantes de Pago (Cabecera)
 */
@Entity
@Table(name = "COMP_PAGOCAB")
@IdClass(ComprobantePagoCab.ComprobantePagoCabId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobantePagoCab implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPROVEEDOR", nullable = false)
    private Long codProveedor;

    @Id
    @NotBlank
    @Size(max = 20)
    @Column(name = "NROCP", nullable = false, length = 20)
    private String nroCp;

    @NotNull
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @NotNull
    @Column(name = "NROPAGO", nullable = false)
    private Integer nroPago;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TCOMPPAGO", nullable = false, length = 3)
    private String tCompPago;

    // Getters y setters explícitos para evitar problemas con Lombok
    public String getTCompPago() {
        return tCompPago;
    }

    public void setTCompPago(String tCompPago) {
        this.tCompPago = tCompPago;
    }

    @Size(max = 3)
    @NotBlank
    @Column(name = "ECOMPPAGO", nullable = false, length = 3)
    private String eCompPago;

    public String getECompPago() {
        return eCompPago;
    }

    public void setECompPago(String eCompPago) {
        this.eCompPago = eCompPago;
    }

    @NotNull
    @Column(name = "FECCP", nullable = false)
    private LocalDate fecCp;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TMONEDA", nullable = false, length = 3)
    private String tMoneda;

    public String getTMoneda() {
        return tMoneda;
    }

    public void setTMoneda(String tMoneda) {
        this.tMoneda = tMoneda;
    }

    @Size(max = 3)
    @NotBlank
    @Column(name = "EMONEDA", nullable = false, length = 3)
    private String eMoneda;

    public String getEMoneda() {
        return eMoneda;
    }

    public void setEMoneda(String eMoneda) {
        this.eMoneda = eMoneda;
    }

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "TIPCAMBIO", nullable = false, precision = 7, scale = 4)
    private BigDecimal tipCambio;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPMO", nullable = false, precision = 9, scale = 2)
    private BigDecimal impMo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPNETOMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impNetoMn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPIGVMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impIgvmn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPTOTALMN", nullable = false, precision = 10, scale = 2)
    private BigDecimal impTotalMn;

    @Size(max = 200)
    @Column(name = "FOTOCP", length = 200)
    private String fotoCp;

    @Size(max = 200)
    @Column(name = "FOTOABONO", length = 200)
    private String fotoAbono;

    @Column(name = "FECABONO")
    private LocalDate fecAbono;

    @Size(max = 500)
    @Column(name = "DESABONO", length = 500)
    private String desAbono;

    @NotNull
    @Column(name = "SEMILLA", nullable = false)
    private Integer semilla;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TABESTADO", nullable = false, length = 3)
    private String tabEstado;

    @Size(max = 3)
    @NotBlank
    @Column(name = "CODESTADO", nullable = false, length = 3)
    private String codEstado;

    // Relaciones
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPROVEEDOR", referencedColumnName = "CODPROVEEDOR", insertable = false, updatable = false)
    })
    private Proveedor proveedor;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false)
    })
    private Proyecto proyecto;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "TMONEDA", referencedColumnName = "CODTAB", insertable = false, updatable = false),
            @JoinColumn(name = "EMONEDA", referencedColumnName = "CODELEM", insertable = false, updatable = false)
    })
    private Elementos moneda;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "TCOMPPAGO", referencedColumnName = "CODTAB", insertable = false, updatable = false),
            @JoinColumn(name = "ECOMPPAGO", referencedColumnName = "CODELEM", insertable = false, updatable = false)
    })
    private Elementos tipoComprobante;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "TABESTADO", referencedColumnName = "CODTAB", insertable = false, updatable = false),
            @JoinColumn(name = "CODESTADO", referencedColumnName = "CODELEM", insertable = false, updatable = false)
    })
    private Elementos estado;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComprobantePagoCabId implements Serializable {
        private Long codCia;
        private Long codProveedor;
        private String nroCp;
    }
}
