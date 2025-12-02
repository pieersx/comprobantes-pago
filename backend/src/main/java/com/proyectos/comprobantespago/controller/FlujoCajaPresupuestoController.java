package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaDTO;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaDetDTO;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaPresupuestoDTO;
import com.proyectos.comprobantespago.entity.FlujoCaja;
import com.proyectos.comprobantespago.entity.FlujoCajaDet;
import com.proyectos.comprobantespago.service.FlujoCajaPresupuestoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para Flujo de Caja Presupuestario
 * Gestiona las proyecciones presupuestarias vs ejecución real
 */
@RestController
@RequestMapping("/flujo-caja-presupuesto")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Flujo de Caja Presupuestario", description = "Gestión de presupuesto vs ejecución real")
public class FlujoCajaPresupuestoController {

    private final FlujoCajaPresupuestoService flujoCajaService;

    // ==================== ENDPOINTS CABECERA ====================

    @GetMapping("/compania/{codCia}")
    @Operation(summary = "Listar flujos de caja por compañía")
    public ResponseEntity<ApiResponse<List<FlujoCajaDTO>>> findByCodCia(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia) {
        List<FlujoCajaDTO> data = flujoCajaService.findByCodCia(codCia);
        return ResponseEntity.ok(ApiResponse.success("Flujos de caja obtenidos", data));
    }

    @GetMapping("/compania/{codCia}/proyecto/{codPyto}")
    @Operation(summary = "Listar flujos de caja por proyecto")
    public ResponseEntity<ApiResponse<List<FlujoCajaDTO>>> findByProyecto(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia,
            @Parameter(description = "Código de proyecto") @PathVariable Long codPyto) {
        List<FlujoCajaDTO> data = flujoCajaService.findByProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Flujos de caja del proyecto obtenidos", data));
    }

    @GetMapping("/compania/{codCia}/proyecto/{codPyto}/tipo/{ingEgr}")
    @Operation(summary = "Listar flujos de caja por proyecto y tipo (I/E)")
    public ResponseEntity<ApiResponse<List<FlujoCajaDTO>>> findByProyectoAndTipo(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia,
            @Parameter(description = "Código de proyecto") @PathVariable Long codPyto,
            @Parameter(description = "Tipo: I=Ingreso, E=Egreso") @PathVariable String ingEgr) {
        List<FlujoCajaDTO> data = flujoCajaService.findByProyectoAndTipo(codCia, codPyto, ingEgr);
        return ResponseEntity.ok(ApiResponse.success("Flujos de caja filtrados obtenidos", data));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo flujo de caja")
    public ResponseEntity<ApiResponse<FlujoCajaDTO>> create(
            @Valid @RequestBody FlujoCajaDTO dto) {
        FlujoCajaDTO created = flujoCajaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flujo de caja creado exitosamente", created));
    }

    @PutMapping("/compania/{codCia}/proyecto/{codPyto}/ingegr/{ingEgr}/tipo/{tipo}/partida/{codPartida}")
    @Operation(summary = "Actualizar flujo de caja existente")
    public ResponseEntity<ApiResponse<FlujoCajaDTO>> update(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable String tipo,
            @PathVariable Long codPartida,
            @Valid @RequestBody FlujoCajaDTO dto) {
        FlujoCaja.FlujoCajaId id = new FlujoCaja.FlujoCajaId(codCia, codPyto, ingEgr, tipo, codPartida);
        FlujoCajaDTO updated = flujoCajaService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Flujo de caja actualizado", updated));
    }

    @DeleteMapping("/compania/{codCia}/proyecto/{codPyto}/ingegr/{ingEgr}/tipo/{tipo}/partida/{codPartida}")
    @Operation(summary = "Eliminar flujo de caja")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable String tipo,
            @PathVariable Long codPartida) {
        FlujoCaja.FlujoCajaId id = new FlujoCaja.FlujoCajaId(codCia, codPyto, ingEgr, tipo, codPartida);
        flujoCajaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Flujo de caja eliminado", null));
    }

    // ==================== ENDPOINTS DETALLE ====================

    @GetMapping("/detalle/anno/{anno}/compania/{codCia}/proyecto/{codPyto}")
    @Operation(summary = "Obtener detalle mensual por año y proyecto")
    public ResponseEntity<ApiResponse<List<FlujoCajaDetDTO>>> findDetalle(
            @Parameter(description = "Año") @PathVariable Integer anno,
            @Parameter(description = "Código de compañía") @PathVariable Long codCia,
            @Parameter(description = "Código de proyecto") @PathVariable Long codPyto) {
        List<FlujoCajaDetDTO> data = flujoCajaService.findDetalleByAnnoAndProyecto(anno, codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Detalle de flujo de caja obtenido", data));
    }

    @GetMapping("/annos/compania/{codCia}")
    @Operation(summary = "Obtener años disponibles por compañía")
    public ResponseEntity<ApiResponse<List<Integer>>> findAnnosByCia(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia) {
        List<Integer> data = flujoCajaService.findAnnosDisponiblesByCia(codCia);
        return ResponseEntity.ok(ApiResponse.success("Años disponibles obtenidos", data));
    }

    @GetMapping("/annos/compania/{codCia}/proyecto/{codPyto}")
    @Operation(summary = "Obtener años disponibles por proyecto")
    public ResponseEntity<ApiResponse<List<Integer>>> findAnnosByProyecto(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia,
            @Parameter(description = "Código de proyecto") @PathVariable Long codPyto) {
        List<Integer> data = flujoCajaService.findAnnosDisponibles(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Años disponibles obtenidos", data));
    }

    @PostMapping("/detalle")
    @Operation(summary = "Crear detalle de flujo de caja")
    public ResponseEntity<ApiResponse<FlujoCajaDetDTO>> createDetalle(
            @Valid @RequestBody FlujoCajaDetDTO dto) {
        FlujoCajaDetDTO created = flujoCajaService.createDetalle(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Detalle creado exitosamente", created));
    }

    @PutMapping("/detalle/anno/{anno}/compania/{codCia}/proyecto/{codPyto}/ingegr/{ingEgr}/tipo/{tipo}/partida/{codPartida}")
    @Operation(summary = "Actualizar detalle de flujo de caja")
    public ResponseEntity<ApiResponse<FlujoCajaDetDTO>> updateDetalle(
            @PathVariable Integer anno,
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable String tipo,
            @PathVariable Long codPartida,
            @Valid @RequestBody FlujoCajaDetDTO dto) {
        FlujoCajaDet.FlujoCajaDetId id = new FlujoCajaDet.FlujoCajaDetId(
                anno, codCia, codPyto, ingEgr, tipo, codPartida);
        FlujoCajaDetDTO updated = flujoCajaService.updateDetalle(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Detalle actualizado", updated));
    }

    // ==================== REPORTE CONSOLIDADO ====================

    @GetMapping("/reporte/compania/{codCia}/proyecto/{codPyto}")
    @Operation(summary = "Obtener reporte consolidado de presupuesto vs real")
    public ResponseEntity<ApiResponse<FlujoCajaPresupuestoDTO>> getReporte(
            @Parameter(description = "Código de compañía") @PathVariable Long codCia,
            @Parameter(description = "Código de proyecto") @PathVariable Long codPyto,
            @Parameter(description = "Año (opcional, default: actual)") @RequestParam(required = false) Integer anno) {
        FlujoCajaPresupuestoDTO data = flujoCajaService.getReportePresupuesto(codCia, codPyto, anno);
        return ResponseEntity.ok(ApiResponse.success("Reporte de presupuesto obtenido", data));
    }
}
