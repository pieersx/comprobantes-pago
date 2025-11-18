package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoPartidaDTO {
    private Long codPartida;
    private String ingEgr;
    private String nombrePartida;
    private BigDecimal presupuestoTotal;
    private BigDecimal ejecutado;
    private BigDecimal disponible;
    private BigDecimal porcentajeEjecutado;
    private String estado;
}
