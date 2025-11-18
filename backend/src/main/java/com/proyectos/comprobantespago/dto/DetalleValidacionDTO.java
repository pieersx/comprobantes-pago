package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para detalle de validación de presupuesto por partida
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleValidacionDTO {
    private Long codPartida;
    private String nombrePartida;
    private BigDecimal presupuestoOriginal;
    private BigDecimal presupuestoEjecutado;
    private BigDecimal presupuestoDisponible;
    private BigDecimal montoSolicitado;
    private BigDecimal porcentajeEjecucion;
    private String nivelAlerta; // verde, amarillo, naranja, rojo
    private boolean excedido;
}
