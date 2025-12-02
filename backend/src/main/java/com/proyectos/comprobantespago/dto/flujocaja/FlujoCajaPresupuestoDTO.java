package com.proyectos.comprobantespago.dto.flujocaja;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta completa del flujo de caja presupuestario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCajaPresupuestoDTO {

    private Integer anno;
    private Long codCia;
    private Long codPyto;
    private String nombreProyecto;

    // Resumen general
    private ResumenAnual resumenIngresos;
    private ResumenAnual resumenEgresos;
    private ResumenAnual resumenNeto;

    // Detalle por partida
    private List<FlujoCajaDetDTO> detalleIngresos;
    private List<FlujoCajaDetDTO> detalleEgresos;

    // Proyecciones mensuales consolidadas
    private List<ProyeccionMensual> proyeccionesMensuales;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumenAnual {
        private BigDecimal totalPresupuestado;
        private BigDecimal totalReal;
        private BigDecimal variacion;
        private Double variacionPorcentual;

        // Desglose mensual
        private BigDecimal presupuestoEne;
        private BigDecimal realEne;
        private BigDecimal presupuestoFeb;
        private BigDecimal realFeb;
        private BigDecimal presupuestoMar;
        private BigDecimal realMar;
        private BigDecimal presupuestoAbr;
        private BigDecimal realAbr;
        private BigDecimal presupuestoMay;
        private BigDecimal realMay;
        private BigDecimal presupuestoJun;
        private BigDecimal realJun;
        private BigDecimal presupuestoJul;
        private BigDecimal realJul;
        private BigDecimal presupuestoAgo;
        private BigDecimal realAgo;
        private BigDecimal presupuestoSep;
        private BigDecimal realSep;
        private BigDecimal presupuestoOct;
        private BigDecimal realOct;
        private BigDecimal presupuestoNov;
        private BigDecimal realNov;
        private BigDecimal presupuestoDic;
        private BigDecimal realDic;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProyeccionMensual {
        private String mes;
        private Integer mesNumero;
        private BigDecimal ingresosPresupuestados;
        private BigDecimal ingresosReales;
        private BigDecimal egresosPresupuestados;
        private BigDecimal egresosReales;
        private BigDecimal saldoPresupuestado;
        private BigDecimal saldoReal;
        private Double cumplimientoIngresos;
        private Double cumplimientoEgresos;
    }
}
