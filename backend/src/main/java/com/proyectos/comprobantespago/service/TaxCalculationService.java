package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.dto.CalculoImpuestoResponse;
import java.math.BigDecimal;

/**
 * Servicio para cálculos de impuestos y totales en comprobantes de pago.
 *
 * Reglas de negocio:
 * - Facturas y Boletas: IGV fijo del 18% (editable por redondeo SUNAT)
 * - Recibos por Honorarios: Porcentaje manual (editable)
 * - Todos los valores se redondean a 2 decimales según SUNAT
 *
 * Feature: comprobantes-mejoras
 * Requirements: 1.2, 1.4, 2.1, 2.3
 */
public interface TaxCalculationService {

    /**
     * Calcula el impuesto según el tipo de comprobante
     *
     * @param montoBase       Monto base sin impuestos
     * @param tipoComprobante Código del tipo de comprobante (FAC, BOL, REC, OTR)
     * @return Impuesto calculado y redondeado a 2 decimales
     */
    BigDecimal calcularImpuestoPorTipo(BigDecimal montoBase, String tipoComprobante);

    /**
     * Calcula el total según el tipo de comprobante
     *
     * @param montoBase       Monto base sin impuestos
     * @param impuesto        Monto del impuesto
     * @param tipoComprobante Código del tipo de comprobante (FAC, BOL, REC, OTR)
     * @return Total calculado y redondeado a 2 decimales
     */
    BigDecimal calcularTotalPorTipo(BigDecimal montoBase, BigDecimal impuesto, String tipoComprobante);

    /**
     * Calcula el IGV automático (18% del subtotal).
     * Usado para Facturas y Boletas.
     *
     * @param subtotal Monto base sin impuestos
     * @return IGV calculado y redondeado a 2 decimales
     */
    BigDecimal calcularIGV(BigDecimal subtotal);

    /**
     * Calcula el total con IGV (subtotal + IGV).
     * Usado para Facturas y Boletas.
     *
     * @param subtotal Monto base sin impuestos
     * @param igv      Monto del IGV (18% del subtotal)
     * @return Total calculado y redondeado a 2 decimales
     */
    BigDecimal calcularTotalConIGV(BigDecimal subtotal, BigDecimal igv);

    /**
     * Calcula el total con retención (subtotal - retención).
     * Usado para Recibos por Honorarios.
     *
     * @param subtotal  Monto base
     * @param retencion Monto de retención ingresado manualmente
     * @return Total calculado y redondeado a 2 decimales
     */
    BigDecimal calcularTotalConRetencion(BigDecimal subtotal, BigDecimal retencion);

    /**
     * Redondea un valor a 2 decimales según reglas de SUNAT.
     * Usa RoundingMode.HALF_UP (redondeo aritmético estándar).
     *
     * @param valor Valor a redondear
     * @return Valor redondeado a 2 decimales
     */
    BigDecimal redondearSUNAT(BigDecimal valor);

    /**
     * Calcula el IGV basado en el tipo de comprobante y monto neto.
     * Para FAC y BOL: 18% fijo
     * Para REC: requiere porcentaje manual
     *
     * @param tipoComprobante Código del tipo de comprobante
     * @param montoNeto Monto sin impuestos
     * @return CalculoImpuestoResponse con IGV y total calculados
     */
    CalculoImpuestoResponse calcularImpuesto(String tipoComprobante, BigDecimal montoNeto);

    /**
     * Calcula el IGV con porcentaje personalizado (para recibos por honorarios).
     *
     * @param montoNeto Monto sin impuestos
     * @param porcentaje Porcentaje de impuesto
     * @return CalculoImpuestoResponse con IGV y total calculados
     */
    CalculoImpuestoResponse calcularImpuestoPersonalizado(BigDecimal montoNeto, BigDecimal porcentaje);

    /**
     * Obtiene el porcentaje de impuesto por defecto para un tipo de comprobante.
     *
     * @param tipoComprobante Código del tipo de comprobante
     * @return Porcentaje de impuesto
     */
    BigDecimal obtenerPorcentajeImpuesto(String tipoComprobante);
}
