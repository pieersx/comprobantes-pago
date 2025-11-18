package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenPresupuestoProyectoDTO {
    private Long codCia;
    private Long codPyto;
    private String nombPyto;
    private BigDecimal costoTotal;

    // Ingresos
    private BigDecimal totalPresupuestoIngresos;
    private BigDecimal totalEjecutadoIngresos;

    // Egresos
    private BigDecimal totalPresupuestoEgresos;
    private BigDecimal totalEjecutadoEgresos;

    // Balance
    private BigDecimal balancePresupuestado;
    private BigDecimal balanceReal;

    // Márgenes
    private BigDecimal margenPresupuestado;
    private BigDecimal margenReal;

    // Detalle
    private List<PresupuestoPartidaDTO> partidas;
}
