package com.proyectos.comprobantespago.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.proyectos.comprobantespago.dto.CalculoImpuestoResponse;
import com.proyectos.comprobantespago.enums.TipoComprobanteEnum;
import com.proyectos.comprobantespago.service.TaxCalculationService;

/**
 * Implementación del servicio de cálculo de impuestos.
 *
 * Implementa las reglas de negocio para:
 * - IGV del 18% para Facturas y Boletas (editable por redondeo SUNAT)
 * - Porcentaje manual para Recibos por Honorarios (editable)
 * - Redondeo a 2 decimales según SUNAT
 *
 * Feature: comprobantes-mejoras
 * Requirements: 1.2, 1.4, 2.1, 2.3
 */
@Service
public class TaxCalculationServiceImpl implements TaxCalculationService {

    /**
     * Tasa de IGV fija: 18%
     */
    private static final BigDecimal TASA_IGV = new BigDecimal("0.18");

    /**
     * Porcentaje como valor: 18
     */
    private static final BigDecimal PORCENTAJE_IGV = new BigDecimal("18");

    /**
     * Escala de decimales para valores monetarios
     */
    private static final int ESCALA_MONETARIA = 2;

    @Override
    public BigDecimal calcularImpuestoPorTipo(BigDecimal montoBase, String tipoComprobante) {
        if (montoBase == null) {
            throw new IllegalArgumentException("El monto base no puede ser nulo");
        }

        TipoComprobanteEnum tipo = TipoComprobanteEnum.fromCodigo(tipoComprobante);
        return tipo.calcularImpuesto(montoBase);
    }

    @Override
    public BigDecimal calcularTotalPorTipo(BigDecimal montoBase, BigDecimal impuesto, String tipoComprobante) {
        if (montoBase == null) {
            throw new IllegalArgumentException("El monto base no puede ser nulo");
        }

        TipoComprobanteEnum tipo = TipoComprobanteEnum.fromCodigo(tipoComprobante);
        return tipo.calcularTotal(montoBase, impuesto);
    }

    @Override
    public BigDecimal calcularIGV(BigDecimal subtotal) {
        if (subtotal == null) {
            throw new IllegalArgumentException("El subtotal no puede ser nulo");
        }

        // IGV = subtotal * 0.18
        BigDecimal igv = subtotal.multiply(TASA_IGV);
        return redondearSUNAT(igv);
    }

    @Override
    public BigDecimal calcularTotalConIGV(BigDecimal subtotal, BigDecimal igv) {
        if (subtotal == null || igv == null) {
            throw new IllegalArgumentException("El subtotal y el IGV no pueden ser nulos");
        }

        // Total = subtotal + IGV
        BigDecimal total = subtotal.add(igv);
        return redondearSUNAT(total);
    }

    @Override
    public BigDecimal calcularTotalConRetencion(BigDecimal subtotal, BigDecimal retencion) {
        if (subtotal == null) {
            throw new IllegalArgumentException("El subtotal no puede ser nulo");
        }

        // Si no hay retención, asumir 0
        if (retencion == null) {
            retencion = BigDecimal.ZERO;
        }

        // Total = subtotal - retención
        BigDecimal total = subtotal.subtract(retencion);
        return redondearSUNAT(total);
    }

    @Override
    public BigDecimal redondearSUNAT(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("El valor no puede ser nulo");
        }

        // Redondeo HALF_UP a 2 decimales
        return valor.setScale(ESCALA_MONETARIA, RoundingMode.HALF_UP);
    }

    @Override
    public CalculoImpuestoResponse calcularImpuesto(String tipoComprobante, BigDecimal montoNeto) {
        if (montoNeto == null) {
            throw new IllegalArgumentException("El monto neto no puede ser nulo");
        }
        if (tipoComprobante == null || tipoComprobante.trim().isEmpty()) {
            throw new IllegalArgumentException("El tipo de comprobante no puede ser nulo o vacío");
        }

        // Para FAC y BOL: IGV fijo del 18%
        if ("FAC".equals(tipoComprobante) || "BOL".equals(tipoComprobante)) {
            BigDecimal igv = calcularIGV(montoNeto);
            BigDecimal total = calcularTotalConIGV(montoNeto, igv);

            return new CalculoImpuestoResponse(
                PORCENTAJE_IGV,
                igv,
                total,
                true, // Es editable para ajustes de redondeo SUNAT
                tipoComprobante
            );
        }

        // Para REC: requiere porcentaje manual
        if ("REC".equals(tipoComprobante)) {
            return new CalculoImpuestoResponse(
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                montoNeto,
                true, // Es editable, el usuario debe ingresar el porcentaje
                tipoComprobante
            );
        }

        // Para otros tipos: sin impuesto
        return new CalculoImpuestoResponse(
            BigDecimal.ZERO,
            BigDecimal.ZERO,
            montoNeto,
            false,
            tipoComprobante
        );
    }

    @Override
    public CalculoImpuestoResponse calcularImpuestoPersonalizado(BigDecimal montoNeto, BigDecimal porcentaje) {
        if (montoNeto == null) {
            throw new IllegalArgumentException("El monto neto no puede ser nulo");
        }
        if (porcentaje == null) {
            throw new IllegalArgumentException("El porcentaje no puede ser nulo");
        }

        // Calcular IGV: montoNeto * (porcentaje / 100)
        BigDecimal tasaDecimal = porcentaje.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal igv = montoNeto.multiply(tasaDecimal);
        igv = redondearSUNAT(igv);

        // Calcular total
        BigDecimal total = montoNeto.add(igv);
        total = redondearSUNAT(total);

        return new CalculoImpuestoResponse(
            porcentaje,
            igv,
            total,
            true,
            "REC" // Asumimos que es para recibo por honorarios
        );
    }

    @Override
    public BigDecimal obtenerPorcentajeImpuesto(String tipoComprobante) {
        if (tipoComprobante == null || tipoComprobante.trim().isEmpty()) {
            throw new IllegalArgumentException("El tipo de comprobante no puede ser nulo o vacío");
        }

        // Para FAC y BOL: 18%
        if ("FAC".equals(tipoComprobante) || "BOL".equals(tipoComprobante)) {
            return PORCENTAJE_IGV;
        }

        // Para REC y otros: 0 (debe ser ingresado manualmente)
        return BigDecimal.ZERO;
    }
}
