package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para registro de abonos/pagos
 * Feature: comprobantes-mejoras
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbonoDTO {

    @NotNull(message = "La fecha del abono es obligatoria")
    private LocalDate fechaAbono;

    @NotBlank(message = "La descripción del medio de pago es obligatoria")
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcionMedioPago;

    @NotNull(message = "El monto del abono es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto del abono debe ser mayor a 0")
    private BigDecimal montoAbono;

    /**
     * Ruta del archivo PDF/imagen del comprobante de pago
     */
    private String fotoAbono;
}
