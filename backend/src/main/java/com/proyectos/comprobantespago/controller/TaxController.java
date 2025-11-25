package com.proyectos.comprobantespago.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.CalculoImpuestoResponse;
import com.proyectos.comprobantespago.service.TaxCalculationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para cálculos de impuestos
 * Endpoints: /api/tax
 *
 * Feature: comprobantes-jerarquicos
 * Requirements: 2.2, 2.3, 2.4, 3.2
 */
@RestController
@RequestMapping("/tax")
@CrossOrigin(origins = "*")
@Tag(name = "Tax", description = "Cálculo de impuestos para comprobantes")
@RequiredArgsConstructor
public class TaxController {

    private final TaxCalculationService taxCalculationService;

    /**
     * GET /tax/calculate
     * Calcula el IGV según el tipo de comprobante
     *
     * - Para FAC y BOL: Usa 18% fijo (no requiere porcentajeIgv)
     * - Para REC: Usa porcentajeIgv proporcionado por el usuario
     */
    @GetMapping("/calculate")
    @Operation(
        summary = "Calcular IGV según tipo de comprobante",
        description = "Calcula el IGV basado en el tipo de comprobante y monto base. " +
                     "Para FAC y BOL: usa 18% fijo. " +
                     "Para REC: requiere porcentajeIgv ingresado por el usuario."
    )
    public ResponseEntity<CalculoImpuestoResponse> calcularImpuesto(
            @RequestParam @Parameter(description = "Tipo de comprobante: FAC, BOL, REC") String tipoComprobante,
            @RequestParam @Parameter(description = "Monto base sin impuestos") BigDecimal montoBase,
            @RequestParam(required = false) @Parameter(description = "Porcentaje de IGV (solo para REC)") BigDecimal porcentajeIgv) {

        CalculoImpuestoResponse response;

        // Para FAC y BOL: usar 18% fijo
        if ("FAC".equals(tipoComprobante) || "BOL".equals(tipoComprobante)) {
            response = taxCalculationService.calcularImpuesto(tipoComprobante, montoBase);
        }
        // Para REC: usar porcentaje proporcionado
        else if ("REC".equals(tipoComprobante)) {
            if (porcentajeIgv == null) {
                // Si no se proporciona porcentaje, retornar respuesta con valores en 0
                response = taxCalculationService.calcularImpuesto(tipoComprobante, montoBase);
            } else {
                response = taxCalculationService.calcularImpuestoPersonalizado(montoBase, porcentajeIgv);
            }
        }
        // Para otros tipos
        else {
            response = taxCalculationService.calcularImpuesto(tipoComprobante, montoBase);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * GET /tax/rate
     * Obtiene el porcentaje de impuesto por defecto para un tipo de comprobante
     */
    @GetMapping("/rate")
    @Operation(
        summary = "Obtener porcentaje de impuesto por defecto",
        description = "Retorna el porcentaje de impuesto por defecto para el tipo de comprobante. " +
                     "FAC y BOL: 18%. REC: 0 (debe ser ingresado manualmente)."
    )
    public ResponseEntity<BigDecimal> obtenerPorcentajeImpuesto(
            @RequestParam @Parameter(description = "Tipo de comprobante: FAC, BOL, REC") String tipoComprobante) {

        BigDecimal porcentaje = taxCalculationService.obtenerPorcentajeImpuesto(tipoComprobante);
        return ResponseEntity.ok(porcentaje);
    }
}
