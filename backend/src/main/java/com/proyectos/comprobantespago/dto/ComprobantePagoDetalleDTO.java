package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Detalle de Comprobante de Pago
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComprobantePagoDetalleDTO {

    @NotNull
    private Long codCia;

    @NotNull
    private Long codProveedor;

    @NotBlank
    @Size(max = 20)
    private String nroCp;

    @NotNull
    private Integer sec;

    @NotBlank
    @Size(max = 1)
    private String ingEgr;

    @NotNull
    private Long codPartida;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal impNetoMn;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal impIgvMn;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal impTotalMn;

    @NotNull
    private Integer semilla;

    private String nombrePartida;

    public BigDecimal getTotal() {
        return impTotalMn;
    }

    public BigDecimal getImpTotalMn() {
        return impTotalMn;
    }

    public void setImpTotalMn(BigDecimal impTotalMn) {
        this.impTotalMn = impTotalMn;
    }
}
