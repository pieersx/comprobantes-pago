package com.proyectos.comprobantespago.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Controller REST para Reportes Financieros
 * Requisito 16: Reportes Financieros y Análisis
 */
@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Generación de reportes financieros y análisis")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/financiero/proyecto/{codCia}/{codPyto}")
    @Operation(summary = "Reporte financiero por proyecto", description = "Muestra presupuesto vs. real con análisis de varianza")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteFinancieroProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        Map<String, Object> reporte = reportService.reporteFinancieroProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Reporte financiero generado exitosamente", reporte));
    }

    @GetMapping("/flujo-caja/proyecto/{codCia}/{codPyto}")
    @Operation(summary = "Reporte de flujo de caja por proyecto", description = "Muestra desembolsos planeados vs. reales")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteFlujosCajaProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> reporte = reportService.reporteFlujosCajaProyecto(codCia, codPyto, fechaInicio,
                fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Reporte de flujo de caja generado exitosamente", reporte));
    }

    @GetMapping("/fiscal/igv/{codCia}")
    @Operation(summary = "Reporte fiscal: IGV por período", description = "Muestra IGV por tipo de transacción y período")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteFiscalIGV(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> reporte = reportService.reporteFiscalIGV(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Reporte fiscal de IGV generado exitosamente", reporte));
    }

    @GetMapping("/ingresos/cliente/{codCia}")
    @Operation(summary = "Reporte de ingresos por cliente", description = "Muestra ingresos agregados por cliente")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteIngresosPorCliente(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> reporte = reportService.reporteIngresosPorCliente(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Reporte de ingresos por cliente generado exitosamente", reporte));
    }

    @GetMapping("/gastos/proveedor/{codCia}")
    @Operation(summary = "Reporte de gastos por proveedor", description = "Muestra gastos agregados por proveedor")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteGastosPorProveedor(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> reporte = reportService.reporteGastosPorProveedor(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Reporte de gastos por proveedor generado exitosamente", reporte));
    }

    @GetMapping("/consolidado/empresa/{codCia}")
    @Operation(summary = "Reporte consolidado de empresa", description = "Muestra ingresos, gastos, ganancia y métricas clave")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reporteConsolidadoEmpresa(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> reporte = reportService.reporteConsolidadoEmpresa(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Reporte consolidado de empresa generado exitosamente", reporte));
    }
}
