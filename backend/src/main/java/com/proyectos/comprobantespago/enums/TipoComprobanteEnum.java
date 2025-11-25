package com.proyectos.comprobantespago.enums;

import java.math.BigDecimal;

/**
 * Enum para tipos de comprobantes de pago con sus tasas de impuestos
 */
public enum TipoComprobanteEnum {

    FACTURA("FAC", "Factura", new BigDecimal("0.18"), true),
    BOLETA("BOL", "Boleta", new BigDecimal("0.18"), true),
    RECIBO_HONORARIOS("REC", "Recibo por Honorarios", new BigDecimal("0.08"), false),
    OTROS("OTR", "Otros", BigDecimal.ZERO, false);

    private final String codigo;
    private final String descripcion;
    private final BigDecimal tasaImpuesto;
    private final boolean igvAplicable; // true si es IGV, false si es retención

    TipoComprobanteEnum(String codigo, String descripcion, BigDecimal tasaImpuesto, boolean igvAplicable) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.tasaImpuesto = tasaImpuesto;
        this.igvAplicable = igvAplicable;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getTasaImpuesto() {
        return tasaImpuesto;
    }

    public boolean isIgvAplicable() {
        return igvAplicable;
    }

    /**
     * Obtiene el enum por código
     */
    public static TipoComprobanteEnum fromCodigo(String codigo) {
        for (TipoComprobanteEnum tipo : values()) {
            if (tipo.codigo.equals(codigo)) {
                return tipo;
            }
        }
        return OTROS;
    }

    /**
     * Calcula el impuesto según el tipo de comprobante
     */
    public BigDecimal calcularImpuesto(BigDecimal montoBase) {
        if (montoBase == null) {
            return BigDecimal.ZERO;
        }
        return montoBase.multiply(tasaImpuesto).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Calcula el total según el tipo de comprobante
     */
    public BigDecimal calcularTotal(BigDecimal montoBase, BigDecimal impuesto) {
        if (montoBase == null) {
            montoBase = BigDecimal.ZERO;
        }
        if (impuesto == null) {
            impuesto = BigDecimal.ZERO;
        }

        if (igvAplicable) {
            // Para facturas y boletas: total = base + IGV
            return montoBase.add(impuesto).setScale(2, java.math.RoundingMode.HALF_UP);
        } else {
            // Para recibos por honorarios: total = base - retención
            return montoBase.subtract(impuesto).setScale(2, java.math.RoundingMode.HALF_UP);
        }
    }
}
