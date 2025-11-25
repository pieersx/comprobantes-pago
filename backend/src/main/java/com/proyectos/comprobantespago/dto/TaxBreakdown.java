package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para desglose de impuestos en comprobantes
 * Soporta IGV (18%) para Facturas y Boletas, y Retención (8%) para Recibos por Honorarios
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxBreakdown {

    /**
     * Subtotal antes de impuestos
     */
    private BigDecimal subtotal;

    /**
     * Monto del impuesto (IGV o Retención)
     */
    private BigDecimal taxAmount;

    /**
     * Total final del comprobante
     * Para Facturas/Boletas: Total = Subtotal + IGV
     * Para Recibos por Honorarios: Total = Subtotal - Retención
     */
    private BigDecimal total;

    /**
     * Tipo de impuesto: "IGV" o "RETENCION"
     */
    private String taxType;

    /**
     * Tasa del impuesto (0.18 para IGV, 0.08 para Retención)
     */
    private BigDecimal taxRate;

    /**
     * Indica si algún valor fue editado manualmente por el usuario
     */
    private boolean manuallyEdited;
}
