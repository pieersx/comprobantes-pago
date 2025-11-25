package com.proyectos.comprobantespago.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.ComprobantePagoDTO;
import com.proyectos.comprobantespago.service.ComprobantePagoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller REST para Comprobantes de Pago
 */
@RestController
@RequestMapping("/comprobantes-pago")
@RequiredArgsConstructor
@Tag(name = "Comprobantes de Pago", description = "Gestión de comprobantes de pago (egresos)")
public class ComprobantePagoController {

    private final ComprobantePagoService comprobantePagoService;

    @GetMapping("/compania/{codCia}")
    @Operation(summary = "Listar comprobantes por compañía")
    public ResponseEntity<ApiResponse<List<ComprobantePagoDTO>>> findAllByCompania(@PathVariable Long codCia) {
        List<ComprobantePagoDTO> comprobantes = comprobantePagoService.findAllByCompania(codCia);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes", comprobantes.size()), comprobantes));
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}")
    @Operation(summary = "Listar comprobantes por proyecto")
    public ResponseEntity<ApiResponse<List<ComprobantePagoDTO>>> findAllByProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        List<ComprobantePagoDTO> comprobantes = comprobantePagoService.findAllByProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes para el proyecto", comprobantes.size()), comprobantes));
    }

    @GetMapping("/proveedor/{codCia}/{codProveedor}")
    @Operation(summary = "Listar comprobantes por proveedor")
    public ResponseEntity<ApiResponse<List<ComprobantePagoDTO>>> findByProveedor(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor) {
        List<ComprobantePagoDTO> comprobantes = comprobantePagoService.findByProveedor(codCia, codProveedor);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes del proveedor", comprobantes.size()), comprobantes));
    }

    @GetMapping("/estado/{codCia}/{estado}")
    @Operation(summary = "Listar comprobantes por estado")
    public ResponseEntity<ApiResponse<List<ComprobantePagoDTO>>> findByEstado(
            @PathVariable Long codCia,
            @PathVariable String estado) {
        List<ComprobantePagoDTO> comprobantes = comprobantePagoService.findByEstado(codCia, estado);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes con estado %s", comprobantes.size(), estado),
                comprobantes));
    }

    @GetMapping("/fecha-range/{codCia}")
    @Operation(summary = "Listar comprobantes por rango de fechas")
    public ResponseEntity<ApiResponse<List<ComprobantePagoDTO>>> findByFechaRange(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<ComprobantePagoDTO> comprobantes = comprobantePagoService.findByFechaRange(codCia, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes en el rango solicitado", comprobantes.size()),
                comprobantes));
    }

    @GetMapping("/{codCia}/{codProveedor}/{nroCp}")
    @Operation(summary = "Obtener comprobante por ID")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> findById(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp) {
        ComprobantePagoDTO comprobante = comprobantePagoService.findById(codCia, codProveedor, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Comprobante obtenido exitosamente", comprobante));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo comprobante de pago")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> create(@Valid @RequestBody ComprobantePagoDTO dto) {
        System.out.println("🔍 DTO recibido en controller:");
        System.out.println("  tCompPago: " + dto.getTCompPago());
        System.out.println("  eCompPago: " + dto.getECompPago());
        System.out.println("  tMoneda: " + dto.getTMoneda());
        System.out.println("  eMoneda: " + dto.getEMoneda());

        ComprobantePagoDTO created = comprobantePagoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comprobante creado exitosamente", created));
    }

    @PutMapping("/{codCia}/{codProveedor}/{nroCp}")
    @Operation(summary = "Actualizar comprobante de pago")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> update(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @Valid @RequestBody ComprobantePagoDTO dto) {
        ComprobantePagoDTO actualizado = comprobantePagoService.update(codCia, codProveedor, nroCp, dto);
        return ResponseEntity.ok(ApiResponse.success("Comprobante actualizado correctamente", actualizado));
    }

    @PatchMapping("/{codCia}/{codProveedor}/{nroCp}/estado")
    @Operation(summary = "Cambiar estado del comprobante")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @RequestBody Map<String, String> request) {
        String nuevoEstado = request.get("estado");
        comprobantePagoService.cambiarEstado(codCia, codProveedor, nroCp, nuevoEstado);
        return ResponseEntity.ok(ApiResponse.success("Estado actualizado correctamente", null));
    }

    @GetMapping("/total-pagado/{codCia}/{codPyto}")
    @Operation(summary = "Obtener total pagado por proyecto")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getTotalPagado(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        BigDecimal total = comprobantePagoService.getTotalPagadoByProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Total pagado calculado correctamente",
                Map.of("totalPagado", total)));
    }

    @PatchMapping("/{codCia}/{codProveedor}/{nroCp}/anular")
    @Operation(summary = "Anular comprobante de pago", description = "Cambia el estado del comprobante a ANU (Anulado) y restaura el presupuesto disponible. "
            +
            "Si el comprobante está en estado PAG (Pagado), requiere confirmación explícita.")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> anular(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @RequestBody(required = false) Map<String, Boolean> request) {

        boolean confirmarPagado = request != null && Boolean.TRUE.equals(request.get("confirmarPagado"));

        comprobantePagoService.anular(codCia, codProveedor, nroCp, confirmarPagado);

        ComprobantePagoDTO comprobanteAnulado = comprobantePagoService.findById(codCia, codProveedor, nroCp);

        return ResponseEntity.ok(ApiResponse.success("Comprobante anulado exitosamente", comprobanteAnulado));
    }

    @GetMapping("/calcular-impuesto")
    @Operation(summary = "Calcular impuesto según tipo de comprobante", description = "Calcula automáticamente el impuesto (IGV o retención) según el tipo de comprobante. "
            +
            "Los valores calculados pueden ser editados manualmente por el usuario.")
    public ResponseEntity<ApiResponse<com.proyectos.comprobantespago.dto.CalculoImpuestoResponse>> calcularImpuesto(
            @RequestParam @Parameter(description = "Monto base sin impuestos", required = true) BigDecimal montoBase,
            @RequestParam @Parameter(description = "Tipo de comprobante (FAC, BOL, REC, OTR)", required = true) String tipoComprobante) {

        com.proyectos.comprobantespago.dto.CalculoImpuestoResponse calculo = comprobantePagoService
                .calcularImpuestoPorTipo(montoBase, tipoComprobante);

        return ResponseEntity.ok(ApiResponse.success("Impuesto calculado exitosamente", calculo));
    }

    @PatchMapping("/{codCia}/{codProveedor}/{nroCp}/abono")
    @Operation(summary = "Registrar abono en comprobante", description = "Registra un abono (pago parcial o total) en un comprobante. "
            +
            "Actualiza automáticamente el estado a PARCIALMENTE_PAGADO o TOTALMENTE_PAGADO según corresponda.")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> registrarAbono(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @RequestBody @Valid com.proyectos.comprobantespago.dto.AbonoDTO abonoDTO) {

        ComprobantePagoDTO comprobante = comprobantePagoService.registrarAbono(codCia, codProveedor, nroCp, abonoDTO);

        return ResponseEntity.ok(ApiResponse.success("Abono registrado exitosamente", comprobante));
    }

    // ==================== Endpoints específicos para mejoras ====================
    // Feature: comprobantes-mejoras
    // Requirements: 1.1, 8.1, 8.2, 8.3, 8.4

    @PostMapping("/egreso")
    @Operation(summary = "Crear comprobante de egreso", description = "Crea un nuevo comprobante de egreso (COMP_PAGOCAB). "
            +
            "Asociado a un proveedor.")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> crearComprobanteEgreso(
            @Valid @RequestBody ComprobantePagoDTO dto) {

        ComprobantePagoDTO created = comprobantePagoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comprobante de egreso creado exitosamente", created));
    }

    @PostMapping("/ingreso")
    @Operation(summary = "Crear comprobante de ingreso", description = "Crea un nuevo comprobante de ingreso (VTACOMP_PAGOCAB). "
            +
            "Asociado a un cliente. Nota: Actualmente usa el mismo servicio, se diferenciará en implementación futura.")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> crearComprobanteIngreso(
            @Valid @RequestBody ComprobantePagoDTO dto) {

        // TODO: Implementar servicio específico para ingresos que use VTACOMP_PAGOCAB
        ComprobantePagoDTO created = comprobantePagoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comprobante de ingreso creado exitosamente", created));
    }

    @PatchMapping("/{codCia}/{codProveedor}/{nroCp}/archivos")
    @Operation(summary = "Actualizar archivos adjuntos del comprobante", description = "Actualiza las rutas de los archivos adjuntos (comprobante y/o abono) de un comprobante existente. "
            +
            "Permite actualizar fotoCp y fotoAbono independientemente.")
    public ResponseEntity<ApiResponse<ComprobantePagoDTO>> updateFiles(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @RequestBody Map<String, String> archivos) {

        String fotoCp = archivos.get("fotoCp");
        String fotoAbono = archivos.get("fotoAbono");

        ComprobantePagoDTO actualizado = comprobantePagoService.updateFiles(codCia, codProveedor, nroCp, fotoCp,
                fotoAbono);

        return ResponseEntity.ok(ApiResponse.success("Archivos actualizados correctamente", actualizado));
    }
}
