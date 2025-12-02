package com.proyectos.comprobantespago.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import com.proyectos.comprobantespago.dto.VtaCompPagoCabDTO;
import com.proyectos.comprobantespago.service.VtaCompPagoCabService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para gestión de Comprobantes de Venta/Ingreso
 */
@RestController
@RequestMapping("/comprobantes-venta")
@RequiredArgsConstructor
@Tag(name = "Comprobantes de Venta/Ingreso", description = "Gestión de comprobantes de venta e ingresos")
@CrossOrigin(origins = "*")
public class VtaCompPagoCabController {

    private final VtaCompPagoCabService vtaCompPagoCabService;

    @Operation(summary = "Crear nuevo comprobante de venta/ingreso con detalles")
    @PostMapping
    public ResponseEntity<ApiResponse<VtaCompPagoCabDTO>> crear(@Valid @RequestBody VtaCompPagoCabDTO dto) {
        VtaCompPagoCabDTO nuevoComprobante = vtaCompPagoCabService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comprobante de venta/ingreso creado exitosamente", nuevoComprobante));
    }

    @Operation(summary = "Obtener comprobante por ID")
    @GetMapping("/{codCia}/{nroCp}")
    public ResponseEntity<ApiResponse<VtaCompPagoCabDTO>> obtenerPorId(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {
        VtaCompPagoCabDTO comprobante = vtaCompPagoCabService.obtenerPorId(codCia, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Comprobante obtenido exitosamente", comprobante));
    }

    @Operation(summary = "Obtener todos los comprobantes de una compañía")
    @GetMapping("/compania/{codCia}")
    public ResponseEntity<ApiResponse<List<VtaCompPagoCabDTO>>> obtenerPorCompania(@PathVariable Long codCia) {
        List<VtaCompPagoCabDTO> comprobantes = vtaCompPagoCabService.obtenerPorCompania(codCia);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes", comprobantes.size()), comprobantes));
    }

    @Operation(summary = "Obtener comprobantes por proyecto")
    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public ResponseEntity<ApiResponse<List<VtaCompPagoCabDTO>>> obtenerPorProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        List<VtaCompPagoCabDTO> comprobantes = vtaCompPagoCabService.obtenerPorProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes para el proyecto", comprobantes.size()), comprobantes));
    }

    @Operation(summary = "Obtener comprobantes por cliente")
    @GetMapping("/cliente/{codCia}/{codCliente}")
    public ResponseEntity<ApiResponse<List<VtaCompPagoCabDTO>>> obtenerPorCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente) {
        List<VtaCompPagoCabDTO> comprobantes = vtaCompPagoCabService.obtenerPorCliente(codCia, codCliente);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes para el cliente", comprobantes.size()), comprobantes));
    }

    @Operation(summary = "Obtener comprobantes por rango de fechas")
    @GetMapping("/rango-fechas/{codCia}")
    public ResponseEntity<ApiResponse<List<VtaCompPagoCabDTO>>> obtenerPorRangoFechas(
            @PathVariable Long codCia,
            @Parameter(description = "Fecha inicio (formato: yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @Parameter(description = "Fecha fin (formato: yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<VtaCompPagoCabDTO> comprobantes = vtaCompPagoCabService.obtenerPorRangoFechas(codCia, fechaInicio,
                fechaFin);
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Se encontraron %d comprobantes en el rango de fechas", comprobantes.size()),
                comprobantes));
    }

    @Operation(summary = "Actualizar comprobante de venta")
    @PutMapping("/{codCia}/{nroCp}")
    public ResponseEntity<ApiResponse<VtaCompPagoCabDTO>> actualizar(
            @PathVariable Long codCia,
            @PathVariable String nroCp,
            @Valid @RequestBody VtaCompPagoCabDTO dto) {
        VtaCompPagoCabDTO comprobanteActualizado = vtaCompPagoCabService.actualizar(codCia, nroCp, dto);
        return ResponseEntity.ok(ApiResponse.success("Comprobante actualizado exitosamente", comprobanteActualizado));
    }

    @Operation(summary = "Calcular total de ingresos por proyecto")
    @GetMapping("/total-ingresos/{codCia}/{codPyto}")
    public ResponseEntity<ApiResponse<BigDecimal>> calcularTotalIngresosPorProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        BigDecimal total = vtaCompPagoCabService.calcularTotalIngresosPorProyecto(codCia, codPyto);
        return ResponseEntity.ok(ApiResponse.success("Total de ingresos calculado exitosamente", total));
    }

    @Operation(summary = "Eliminar (inactivar) comprobante de venta")
    @DeleteMapping("/{codCia}/{nroCp}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {
        vtaCompPagoCabService.eliminar(codCia, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Comprobante eliminado exitosamente", null));
    }

    @Operation(summary = "Anular comprobante de venta/ingreso")
    @PatchMapping("/{codCia}/{nroCp}/anular")
    public ResponseEntity<ApiResponse<VtaCompPagoCabDTO>> anular(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {
        VtaCompPagoCabDTO comprobanteAnulado = vtaCompPagoCabService.anular(codCia, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Comprobante anulado exitosamente", comprobanteAnulado));
    }

    @Operation(summary = "Actualizar archivos adjuntos del comprobante de ingreso", description = "Actualiza las rutas de los archivos adjuntos (comprobante y/o abono) de un comprobante de ingreso existente. "
            +
            "Permite actualizar fotoCp y fotoAbono independientemente.")
    @PutMapping("/{codCia}/{nroCp}/archivos")
    public ResponseEntity<ApiResponse<VtaCompPagoCabDTO>> updateFiles(
            @PathVariable Long codCia,
            @PathVariable String nroCp,
            @RequestBody java.util.Map<String, String> archivos) {

        String fotoCp = archivos.get("fotoCp");
        String fotoAbono = archivos.get("fotoAbono");

        VtaCompPagoCabDTO actualizado = vtaCompPagoCabService.updateFiles(codCia, nroCp, fotoCp, fotoAbono);

        return ResponseEntity.ok(ApiResponse.success("Archivos actualizados correctamente", actualizado));
    }

    // ==================== Endpoints de Imágenes BLOB ====================
    // Feature: empleados-comprobantes-blob
    // Requirements: 6.1, 6.2, 6.3, 6.4

    @Operation(summary = "Subir imagen comprobante (BLOB)", description = "Sube la imagen del comprobante de ingreso como BLOB")
    @PostMapping("/{codCia}/{nroCp}/foto-cp")
    public ResponseEntity<ApiResponse<Void>> uploadFotoCp(
            @PathVariable Long codCia,
            @PathVariable String nroCp,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        vtaCompPagoCabService.uploadFotoCp(codCia, nroCp, file);
        return ResponseEntity.ok(ApiResponse.success("Imagen de comprobante subida exitosamente", null));
    }

    @Operation(summary = "Obtener imagen comprobante (BLOB)", description = "Obtiene la imagen del comprobante de ingreso desde BLOB")
    @GetMapping("/{codCia}/{nroCp}/foto-cp")
    public ResponseEntity<byte[]> getFotoCp(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {

        byte[] foto = vtaCompPagoCabService.getFotoCp(codCia, nroCp);
        return createImageResponse(foto);
    }

    @Operation(summary = "Eliminar imagen comprobante (BLOB)", description = "Elimina la imagen del comprobante de ingreso")
    @DeleteMapping("/{codCia}/{nroCp}/foto-cp")
    public ResponseEntity<ApiResponse<Void>> deleteFotoCp(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {

        vtaCompPagoCabService.deleteFotoCp(codCia, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Imagen de comprobante eliminada", null));
    }

    @Operation(summary = "Subir imagen abono (BLOB)", description = "Sube la imagen del abono de ingreso como BLOB")
    @PostMapping("/{codCia}/{nroCp}/foto-abono")
    public ResponseEntity<ApiResponse<Void>> uploadFotoAbono(
            @PathVariable Long codCia,
            @PathVariable String nroCp,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        vtaCompPagoCabService.uploadFotoAbono(codCia, nroCp, file);
        return ResponseEntity.ok(ApiResponse.success("Imagen de abono subida exitosamente", null));
    }

    @Operation(summary = "Obtener imagen abono (BLOB)", description = "Obtiene la imagen del abono de ingreso desde BLOB")
    @GetMapping("/{codCia}/{nroCp}/foto-abono")
    public ResponseEntity<byte[]> getFotoAbono(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {

        byte[] foto = vtaCompPagoCabService.getFotoAbono(codCia, nroCp);
        return createImageResponse(foto);
    }

    @Operation(summary = "Eliminar imagen abono (BLOB)", description = "Elimina la imagen del abono de ingreso")
    @DeleteMapping("/{codCia}/{nroCp}/foto-abono")
    public ResponseEntity<ApiResponse<Void>> deleteFotoAbono(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {

        vtaCompPagoCabService.deleteFotoAbono(codCia, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Imagen de abono eliminada", null));
    }

    private ResponseEntity<byte[]> createImageResponse(byte[] data) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentLength(data.length);
        headers.setCacheControl("max-age=3600");
        return new ResponseEntity<>(data, headers, org.springframework.http.HttpStatus.OK);
    }
}
