package com.proyectos.comprobantespago.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para la entidad VTACOMP_PAGODET (Detalle de Comprobantes de Venta/Ingreso)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VtaCompPagoDetDTO {
    
    @NotNull(message = "El código de compañía es obligatorio")
    private Long codCia;
    
    @NotBlank(message = "El número de comprobante es obligatorio")
    @Size(max = 20)
    private String nroCp;
    
    @NotNull(message = "El número de secuencia es obligatorio")
    private Integer sec;
    
    @NotBlank(message = "El tipo de partida (Ingreso/Egreso) es obligatorio")
    @Size(max = 1)
    private String ingEgr;
    
    @NotNull(message = "El código de partida es obligatorio")
    private Long codPartida;
    
    @NotNull(message = "El importe neto es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe neto debe ser mayor o igual a 0")
    private BigDecimal impNetoMn;
    
    @NotNull(message = "El importe IGV es obligatorio")
    @DecimalMin(value = "0.0", message = "El IGV debe ser mayor o igual a 0")
    private BigDecimal impIgvMn;
    
    @NotNull(message = "El importe total es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe total debe ser mayor o igual a 0")
    private BigDecimal impTotalMn;
    
    private Integer semilla;
    
    // Campos adicionales para información relacionada
    private String desPartida;
    private String codPartidas;
}
