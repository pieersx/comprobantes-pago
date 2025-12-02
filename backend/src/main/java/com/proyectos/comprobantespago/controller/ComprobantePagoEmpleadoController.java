package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDetDTO;
import com.proyectos.comprobantespago.service.ComprobantePagoEmpleadoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/comprobantes-empleado")
@RequiredArgsConstructor
@Tag(name = "Comprobantes Empleado", description = "API para gestión de comprobantes de pago a empleados")
public class ComprobantePagoEmpleadoController {

    private final ComprobantePagoEmpleadoService service;

    @Operation(summary = "Listar comprobantes", description = "Obtiene todos los comprobantes de empleados")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ComprobantePagoEmpleadoDTO>>> findAll(
            @RequestParam Long codCia,
            @RequestParam(required = false) Long codEmpleado,
            @RequestParam(required = false) Long codPyto) {

        List<ComprobantePagoEmpleadoDTO> comprobantes;

        if (codEmpleado != null) {
            comprobantes = service.findByEmpleado(codCia, codEmpleado);
        } else if (codPyto != null) {
            comprobantes = service.findByProyecto(codCia, codPyto);
        } else {
            comprobantes = service.findAll(codCia);
        }

        return ResponseEntity.ok(ApiResponse.success("Comprobantes obtenidos", comprobantes));
    }

    @Operation(summary = "Obtener comprobante", description = "Obtiene un comprobante por su ID compuesto")
    @GetMapping("/{codCia}/{codEmpleado}/{nroCp}")
    public ResponseEntity<ApiResponse<ComprobantePagoEmpleadoDTO>> findById(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        return service.findById(codCia, codEmpleado, nroCp)
                .map(dto -> ResponseEntity.ok(ApiResponse.success("Comprobante encontrado", dto)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Comprobante no encontrado")));
    }

    @Operation(summary = "Crear comprobante", description = "Crea un nuevo comprobante de pago a empleado")
    @PostMapping
    public ResponseEntity<ApiResponse<ComprobantePagoEmpleadoDTO>> create(
            @RequestBody ComprobantePagoEmpleadoDTO dto) {

        ComprobantePagoEmpleadoDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comprobante creado exitosamente", created));
    }

    @Operation(summary = "Actualizar comprobante", description = "Actualiza un comprobante existente")
    @PutMapping("/{codCia}/{codEmpleado}/{nroCp}")
    public ResponseEntity<ApiResponse<ComprobantePagoEmpleadoDTO>> update(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @RequestBody ComprobantePagoEmpleadoDTO dto) {

        ComprobantePagoEmpleadoDTO updated = service.update(codCia, codEmpleado, nroCp, dto);
        return ResponseEntity.ok(ApiResponse.success("Comprobante actualizado exitosamente", updated));
    }

    @Operation(summary = "Anular comprobante", description = "Anula un comprobante (cambia estado a ANU)")
    @DeleteMapping("/{codCia}/{codEmpleado}/{nroCp}")
    public ResponseEntity<ApiResponse<Void>> anular(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        service.anular(codCia, codEmpleado, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Comprobante anulado exitosamente", null));
    }

    // ==================== Endpoints de Imágenes ====================

    @Operation(summary = "Subir imagen comprobante", description = "Sube la imagen del comprobante (FotoCP)")
    @PostMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-cp")
    public ResponseEntity<ApiResponse<Void>> uploadFotoCp(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @RequestParam("file") MultipartFile file) {

        service.uploadFotoCp(codCia, codEmpleado, nroCp, file);
        return ResponseEntity.ok(ApiResponse.success("Imagen de comprobante subida exitosamente", null));
    }

    @Operation(summary = "Obtener imagen comprobante", description = "Obtiene la imagen del comprobante (FotoCP)")
    @GetMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-cp")
    public ResponseEntity<byte[]> getFotoCp(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        byte[] foto = service.getFotoCp(codCia, codEmpleado, nroCp);
        return createImageResponse(foto);
    }

    @Operation(summary = "Eliminar imagen comprobante", description = "Elimina la imagen del comprobante (FotoCP)")
    @DeleteMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-cp")
    public ResponseEntity<ApiResponse<Void>> deleteFotoCp(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        service.deleteFotoCp(codCia, codEmpleado, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Imagen de comprobante eliminada", null));
    }

    @Operation(summary = "Subir imagen abono", description = "Sube la imagen del abono (FotoAbono)")
    @PostMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-abono")
    public ResponseEntity<ApiResponse<Void>> uploadFotoAbono(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @RequestParam("file") MultipartFile file) {

        service.uploadFotoAbono(codCia, codEmpleado, nroCp, file);
        return ResponseEntity.ok(ApiResponse.success("Imagen de abono subida exitosamente", null));
    }

    @Operation(summary = "Obtener imagen abono", description = "Obtiene la imagen del abono (FotoAbono)")
    @GetMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-abono")
    public ResponseEntity<byte[]> getFotoAbono(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        byte[] foto = service.getFotoAbono(codCia, codEmpleado, nroCp);
        return createImageResponse(foto);
    }

    @Operation(summary = "Eliminar imagen abono", description = "Elimina la imagen del abono (FotoAbono)")
    @DeleteMapping("/{codCia}/{codEmpleado}/{nroCp}/foto-abono")
    public ResponseEntity<ApiResponse<Void>> deleteFotoAbono(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        service.deleteFotoAbono(codCia, codEmpleado, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Imagen de abono eliminada", null));
    }

    private ResponseEntity<byte[]> createImageResponse(byte[] data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentLength(data.length);
        headers.setCacheControl("max-age=3600");
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    // ==================== Endpoints de Detalles (COMP_PAGOEMPLEADO_DET)
    // ====================

    @Operation(summary = "Listar detalles", description = "Obtiene todos los detalles de un comprobante")
    @GetMapping("/{codCia}/{codEmpleado}/{nroCp}/detalles")
    public ResponseEntity<ApiResponse<List<ComprobantePagoEmpleadoDetDTO>>> findDetalles(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        List<ComprobantePagoEmpleadoDetDTO> detalles = service.findDetalles(codCia, codEmpleado, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Detalles obtenidos", detalles));
    }

    @Operation(summary = "Agregar detalle", description = "Agrega un nuevo detalle al comprobante")
    @PostMapping("/{codCia}/{codEmpleado}/{nroCp}/detalles")
    public ResponseEntity<ApiResponse<ComprobantePagoEmpleadoDetDTO>> addDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @RequestBody ComprobantePagoEmpleadoDetDTO dto) {

        ComprobantePagoEmpleadoDetDTO created = service.addDetalle(codCia, codEmpleado, nroCp, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Detalle agregado exitosamente", created));
    }

    @Operation(summary = "Actualizar detalle", description = "Actualiza un detalle existente")
    @PutMapping("/{codCia}/{codEmpleado}/{nroCp}/detalles/{sec}")
    public ResponseEntity<ApiResponse<ComprobantePagoEmpleadoDetDTO>> updateDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @PathVariable Integer sec,
            @RequestBody ComprobantePagoEmpleadoDetDTO dto) {

        ComprobantePagoEmpleadoDetDTO updated = service.updateDetalle(codCia, codEmpleado, nroCp, sec, dto);
        return ResponseEntity.ok(ApiResponse.success("Detalle actualizado exitosamente", updated));
    }

    @Operation(summary = "Eliminar detalle", description = "Elimina un detalle específico")
    @DeleteMapping("/{codCia}/{codEmpleado}/{nroCp}/detalles/{sec}")
    public ResponseEntity<ApiResponse<Void>> deleteDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp,
            @PathVariable Integer sec) {

        service.deleteDetalle(codCia, codEmpleado, nroCp, sec);
        return ResponseEntity.ok(ApiResponse.success("Detalle eliminado exitosamente", null));
    }

    @Operation(summary = "Eliminar todos los detalles", description = "Elimina todos los detalles de un comprobante")
    @DeleteMapping("/{codCia}/{codEmpleado}/{nroCp}/detalles")
    public ResponseEntity<ApiResponse<Void>> deleteAllDetalles(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @PathVariable String nroCp) {

        service.deleteAllDetalles(codCia, codEmpleado, nroCp);
        return ResponseEntity.ok(ApiResponse.success("Todos los detalles eliminados exitosamente", null));
    }
}
