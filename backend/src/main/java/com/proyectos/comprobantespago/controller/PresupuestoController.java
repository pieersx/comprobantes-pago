package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.AlertaPresupuestoDTO;
import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.ComprobantePagoDetalleDTO;
import com.proyectos.comprobantespago.dto.PresupuestoDisponibleDTO;
import com.proyectos.comprobantespago.dto.PresupuestoPartidaDTO;
import com.proyectos.comprobantespago.dto.ResumenPresupuestoProyectoDTO;
import com.proyectos.comprobantespago.dto.ValidacionPresupuestoDTO;
import com.proyectos.comprobantespago.service.PresupuestoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controlador REST para gestión de presupuesto
 */
@RestController
@RequestMapping("/presupuesto")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Presupuesto", description = "APIs para control presupuestal de proyectos")
@Slf4j
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    /**
     * Obtiene el presupuesto disponible de una partida específica
     * GET /presupuesto/disponible/{codCia}/{codPyto}/{codPartida}
     */
    @GetMapping("/disponible/{codCia}/{codPyto}/{codPartida}")
    @Operation(summary = "Obtener presupuesto disponible de una partida", description = "Retorna el presupuesto original, ejecutado, disponible y porcentaje de ejecución de una partida específica")
    public ResponseEntity<ApiResponse<PresupuestoDisponibleDTO>> obtenerPresupuestoDisponible(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Long codPartida) {

        log.info("GET /presupuesto/disponible/{}/{}/{}", codCia, codPyto, codPartida);

        PresupuestoDisponibleDTO presupuesto = presupuestoService
                .getPresupuestoDisponible(codCia, codPyto, codPartida);

        return ResponseEntity.ok(ApiResponse.<PresupuestoDisponibleDTO>builder()
                .success(true)
                .message("Presupuesto disponible obtenido exitosamente")
                .data(presupuesto)
                .build());
    }

    /**
     * Obtiene el resumen de presupuesto de todas las partidas de un proyecto
     * GET /presupuesto/resumen/{codCia}/{codPyto}
     */
    @GetMapping("/resumen/{codCia}/{codPyto}")
    @Operation(summary = "Obtener resumen de presupuesto del proyecto", description = "Retorna el resumen consolidado del presupuesto del proyecto con todas sus partidas")
    public ResponseEntity<ApiResponse<ResumenPresupuestoProyectoDTO>> obtenerResumenProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {

        log.info("GET /presupuesto/resumen/{}/{}", codCia, codPyto);

        ResumenPresupuestoProyectoDTO resumen = presupuestoService
                .obtenerResumenProyecto(codCia, codPyto);

        return ResponseEntity.ok(ApiResponse.<ResumenPresupuestoProyectoDTO>builder()
                .success(true)
                .message("Resumen de presupuesto obtenido exitosamente")
                .data(resumen)
                .build());
    }

    /**
     * Obtiene las alertas activas de presupuesto de un proyecto
     * GET /presupuesto/alertas/{codCia}/{codPyto}
     */
    @GetMapping("/alertas/{codCia}/{codPyto}")
    @Operation(summary = "Obtener alertas de presupuesto", description = "Retorna las alertas activas de sobrecosto del proyecto ordenadas por criticidad")
    public ResponseEntity<ApiResponse<List<AlertaPresupuestoDTO>>> obtenerAlertas(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {

        log.info("GET /presupuesto/alertas/{}/{}", codCia, codPyto);

        List<AlertaPresupuestoDTO> alertas = presupuestoService
                .generarAlertas(codCia, codPyto);

        return ResponseEntity.ok(ApiResponse.<List<AlertaPresupuestoDTO>>builder()
                .success(true)
                .message(String.format("Se encontraron %d alertas activas", alertas.size()))
                .data(alertas)
                .build());
    }

    /**
     * Valida si un egreso puede ser registrado (no supera el presupuesto)
     * POST /presupuesto/validar
     */
    @PostMapping("/validar")
    @Operation(summary = "Validar egreso antes de guardar", description = "Valida que los detalles del comprobante no superen el presupuesto disponible de cada partida")
    public ResponseEntity<ApiResponse<ValidacionPresupuestoDTO>> validarEgreso(
            @Valid @RequestBody ValidarEgresoRequest request) {

        log.info("POST /presupuesto/validar - Proyecto: {}-{}, Detalles: {}",
                request.getCodCia(), request.getCodPyto(), request.getDetalles().size());

        ValidacionPresupuestoDTO validacion = presupuestoService
                .validarEgreso(request.getCodCia(), request.getCodPyto(), request.getDetalles());

        return ResponseEntity.ok(ApiResponse.<ValidacionPresupuestoDTO>builder()
                .success(true)
                .message(validacion.isValido() ? "Validación exitosa" : "Validación con alertas")
                .data(validacion)
                .build());
    }

    /**
     * Obtiene el presupuesto de todas las partidas de un proyecto
     * GET /presupuesto/proyecto/{codCia}/{codPyto}
     */
    @GetMapping("/proyecto/{codCia}/{codPyto}")
    @Operation(summary = "Obtener presupuesto de todas las partidas", description = "Retorna el presupuesto de todas las partidas del proyecto")
    public ResponseEntity<ApiResponse<List<PresupuestoPartidaDTO>>> obtenerPresupuestoProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {

        log.info("GET /presupuesto/proyecto/{}/{}", codCia, codPyto);

        List<PresupuestoPartidaDTO> partidas = presupuestoService
                .obtenerPresupuestoProyecto(codCia, codPyto);

        return ResponseEntity.ok(ApiResponse.<List<PresupuestoPartidaDTO>>builder()
                .success(true)
                .message(String.format("Se encontraron %d partidas", partidas.size()))
                .data(partidas)
                .build());
    }

    // ==================== DTOs internos ====================

    /**
     * DTO para request de validación de egreso
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ValidarEgresoRequest {
        private Long codCia;
        private Long codPyto;
        private List<ComprobantePagoDetalleDTO> detalles;
    }
}
