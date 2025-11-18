package com.proyectos.comprobantespago.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.cashflow.CashflowResponseDTO;
import com.proyectos.comprobantespago.service.CashflowService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cashflow")
@RequiredArgsConstructor
@Tag(name = "Flujo de Caja", description = "Consolidado de ingresos y egresos por compañía")
@CrossOrigin(origins = "*")
public class CashflowController {

    private final CashflowService cashflowService;

    @Operation(summary = "Obtener flujo de caja consolidado por compañía")
    @GetMapping("/compania/{codCia}")
    public ResponseEntity<ApiResponse<CashflowResponseDTO>> obtenerFlujoCaja(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha de inicio (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha de fin (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        CashflowResponseDTO response = cashflowService.obtenerFlujoCaja(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success("Flujo de caja generado correctamente", response));
    }
}
