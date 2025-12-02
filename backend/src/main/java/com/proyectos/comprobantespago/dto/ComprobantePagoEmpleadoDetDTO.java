package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el detalle de comprobante de pago a empleado
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComprobantePagoEmpleadoDetDTO {

    @NotNull(message = "El código de compañía es requerido")
    private Long codCia;

    @NotNull(message = "El código de empleado es requerido")
    private Long codEmpleado;

    @NotBlank(message = "El número de comprobante es requerido")
    private String nroCp;

    private Integer sec;

    @NotBlank(message = "El indicador ingreso/egreso es requerido")
    private String ingEgr;

    @NotNull(message = "El código de partida es requerido")
    private Long codPartida;

    private String nombrePartida;

    @NotNull(message = "El importe neto es requerido")
    private BigDecimal impNetoMn;

    private BigDecimal impIgvMn;

    @NotNull(message = "El importe total es requerido")
    private BigDecimal impTotalMn;

    private Integer semilla;

    // Campos adicionales para información del empleado
    private String nombreEmpleado;
}
