package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para resultado de validación de presupuesto
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidacionPresupuestoDTO {
    private boolean valido;
    private String mensajeError;
    private List<DetalleValidacionDTO> detalles;
    private List<AlertaPresupuestoDTO> alertas;
}
