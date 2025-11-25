package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de cálculo de impuestos
 * Feature: comprobantes-mejoras
 * Requirements: 1.2, 1.4, 2.1
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculoImpuestoResponse {

    private BigDecimal porcentaje;
    private BigDecimal igv;
    private BigDecimal total;
    private Boolean esEditable;
    private String tipoComprobante;

}
