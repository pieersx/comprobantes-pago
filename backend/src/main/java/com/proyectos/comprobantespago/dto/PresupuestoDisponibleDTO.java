package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para presupuesto disponible de una partida
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoDisponibleDTO {
    private Long codCia;
    private Long codPyto;
    private String ingEgr;
    private Long codPartida;
    private String nombrePartida;
    private BigDecimal presupuestoOriginal;
    private BigDecimal presupuestoEjecutado;
    private BigDecimal presupuestoDisponible;
    private BigDecimal porcentajeEjecucion;
    private String nivelAlerta; // verde, amarillo, naranja, rojo
    private boolean disponible;

    // Backward compatibility
    @Deprecated
    public BigDecimal getPresupuestoTotal() {
        return presupuestoOriginal;
    }

    @Deprecated
    public BigDecimal getEjecutado() {
        return presupuestoEjecutado;
    }

    @Deprecated
    public BigDecimal getDisponible() {
        return presupuestoDisponible;
    }

    @Deprecated
    public BigDecimal getPorcentajeEjecutado() {
        return porcentajeEjecucion;
    }

    @Deprecated
    public String getEstado() {
        return nivelAlerta;
    }
}
