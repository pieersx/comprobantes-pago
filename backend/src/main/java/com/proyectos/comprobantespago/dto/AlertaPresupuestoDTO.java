package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para alertas de presupuesto
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertaPresupuestoDTO {
    private String id;
    private String tipo; // info, warning, error
    private String nivel; // verde, amarillo, naranja, rojo
    private String mensaje;
    private Long codPartida;
    private String nombrePartida;
    private BigDecimal porcentajeEjecucion;
    private BigDecimal presupuestoOriginal;
    private BigDecimal presupuestoEjecutado;
    private BigDecimal presupuestoDisponible;
    private LocalDateTime fechaGeneracion;
}
