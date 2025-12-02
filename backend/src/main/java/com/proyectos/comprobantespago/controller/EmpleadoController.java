package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.EmpleadoDTO;
import com.proyectos.comprobantespago.service.EmpleadoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/empleados")
@RequiredArgsConstructor
@Tag(name = "Empleados", description = "API para gestión de empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @Operation(summary = "Listar empleados", description = "Obtiene todos los empleados de una compañía")
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpleadoDTO>>> findAll(
            @RequestParam Long codCia,
            @RequestParam(required = false, defaultValue = "true") Boolean soloVigentes) {

        List<EmpleadoDTO> empleados = soloVigentes
                ? empleadoService.findAllVigentes(codCia)
                : empleadoService.findAll(codCia);

        return ResponseEntity.ok(ApiResponse.success("Empleados obtenidos", empleados));
    }

    @Operation(summary = "Buscar empleados", description = "Busca empleados por nombre, DNI o email")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmpleadoDTO>>> search(
            @RequestParam Long codCia,
            @RequestParam String query) {

        List<EmpleadoDTO> empleados = empleadoService.search(codCia, query);
        return ResponseEntity.ok(ApiResponse.success("Búsqueda completada", empleados));
    }

    @Operation(summary = "Obtener empleado", description = "Obtiene un empleado por su ID compuesto")
    @GetMapping("/{codCia}/{codEmpleado}")
    public ResponseEntity<ApiResponse<EmpleadoDTO>> findById(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado) {

        return empleadoService.findById(codCia, codEmpleado)
                .map(dto -> ResponseEntity.ok(ApiResponse.success("Empleado encontrado", dto)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Empleado no encontrado")));
    }


    @Operation(summary = "Crear empleado", description = "Crea un nuevo empleado")
    @PostMapping
    public ResponseEntity<ApiResponse<EmpleadoDTO>> create(@RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO created = empleadoService.create(empleadoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Empleado creado exitosamente", created));
    }

    @Operation(summary = "Actualizar empleado", description = "Actualiza un empleado existente")
    @PutMapping("/{codCia}/{codEmpleado}")
    public ResponseEntity<ApiResponse<EmpleadoDTO>> update(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @RequestBody EmpleadoDTO empleadoDTO) {

        EmpleadoDTO updated = empleadoService.update(codCia, codEmpleado, empleadoDTO);
        return ResponseEntity.ok(ApiResponse.success("Empleado actualizado exitosamente", updated));
    }

    @Operation(summary = "Desactivar empleado", description = "Desactiva un empleado (vigente='N')")
    @DeleteMapping("/{codCia}/{codEmpleado}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado) {

        empleadoService.delete(codCia, codEmpleado);
        return ResponseEntity.ok(ApiResponse.success("Empleado desactivado exitosamente", null));
    }

    // ==================== Endpoints de Foto ====================

    @Operation(summary = "Subir foto", description = "Sube la foto de un empleado (máx 10MB, jpg/png/pdf)")
    @PostMapping("/{codCia}/{codEmpleado}/foto")
    public ResponseEntity<ApiResponse<Void>> uploadFoto(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado,
            @RequestParam("file") MultipartFile file) {

        empleadoService.uploadFoto(codCia, codEmpleado, file);
        return ResponseEntity.ok(ApiResponse.success("Foto subida exitosamente", null));
    }

    @Operation(summary = "Obtener foto", description = "Obtiene la foto de un empleado como imagen binaria")
    @GetMapping("/{codCia}/{codEmpleado}/foto")
    public ResponseEntity<byte[]> getFoto(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado) {

        byte[] foto = empleadoService.getFoto(codCia, codEmpleado);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Por defecto JPEG
        headers.setContentLength(foto.length);
        headers.setCacheControl("max-age=3600"); // Cache de 1 hora

        return new ResponseEntity<>(foto, headers, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar foto", description = "Elimina la foto de un empleado")
    @DeleteMapping("/{codCia}/{codEmpleado}/foto")
    public ResponseEntity<ApiResponse<Void>> deleteFoto(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado) {

        empleadoService.deleteFoto(codCia, codEmpleado);
        return ResponseEntity.ok(ApiResponse.success("Foto eliminada exitosamente", null));
    }
}
