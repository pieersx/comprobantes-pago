package com.proyectos.comprobantespago.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints para el dashboard y estadísticas")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Obtener estadísticas generales del dashboard")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) String codCia) {
        Map<String, Object> stats = dashboardService.getStats(codCia);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/cashflow")
    @Operation(summary = "Obtener datos de flujo de caja mensual")
    public ResponseEntity<List<Map<String, Object>>> getCashFlow(
            @RequestParam(required = false) String codCia) {
        List<Map<String, Object>> cashFlow = dashboardService.getCashFlow(codCia);
        return ResponseEntity.ok(cashFlow);
    }

    @GetMapping("/projects")
    @Operation(summary = "Obtener resumen de proyectos activos")
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @RequestParam(required = false) String codCia) {
        List<Map<String, Object>> projects = dashboardService.getProjects(codCia);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/top-providers")
    @Operation(summary = "Obtener top proveedores por monto")
    public ResponseEntity<List<Map<String, Object>>> getTopProviders(
            @RequestParam(required = false) String codCia) {
        List<Map<String, Object>> providers = dashboardService.getTopProviders(codCia);
        return ResponseEntity.ok(providers);
    }
}
