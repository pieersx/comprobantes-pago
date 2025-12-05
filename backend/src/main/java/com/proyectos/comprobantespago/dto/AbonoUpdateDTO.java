package com.proyectos.comprobantespago.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualización de abonos/pagos
 * Solo permite actualizar fecha y medio de pago, no el monto
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbonoUpdateDTO {

    private LocalDate fechaAbono;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcionMedioPago;
}
