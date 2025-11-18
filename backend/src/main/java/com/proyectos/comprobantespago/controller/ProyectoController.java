package com.proyectos.comprobantespago.controller;

import com.proyectos.comprobantespago.dto.ProyectoDTO;
import com.proyectos.comprobantespago.service.ProyectoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para Proyectos
 */
@RestController
@RequestMapping("/proyectos")
@RequiredArgsConstructor
@Tag(name = "Proyectos", description = "Gestión de proyectos")
public class ProyectoController {
    
    private final ProyectoService proyectoService;
    
    @GetMapping
    @Operation(summary = "Listar proyectos por compañía")
    public ResponseEntity<List<ProyectoDTO>> findAllByCodCia(
            @Parameter(description = "Código de compañía") @RequestParam Long codCia) {
        return ResponseEntity.ok(proyectoService.findAllByCodCia(codCia));
    }
    
    @GetMapping("/{codCia}/{codPyto}")
    @Operation(summary = "Obtener proyecto por ID")
    public ResponseEntity<ProyectoDTO> findById(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return ResponseEntity.ok(proyectoService.findById(codCia, codPyto));
    }
    
    @GetMapping("/jefe/{codCia}/{codEmpleado}")
    @Operation(summary = "Listar proyectos por jefe de proyecto")
    public ResponseEntity<List<ProyectoDTO>> findByJefeProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codEmpleado) {
        return ResponseEntity.ok(proyectoService.findByJefeProyecto(codCia, codEmpleado));
    }
    
    @GetMapping("/cliente/{codCia}/{codCliente}")
    @Operation(summary = "Listar proyectos por cliente")
    public ResponseEntity<List<ProyectoDTO>> findByCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente) {
        return ResponseEntity.ok(proyectoService.findByCliente(codCia, codCliente));
    }
    
    @GetMapping("/anio/{codCia}/{anio}")
    @Operation(summary = "Listar proyectos por año")
    public ResponseEntity<List<ProyectoDTO>> findByAnio(
            @PathVariable Long codCia,
            @PathVariable Integer anio) {
        return ResponseEntity.ok(proyectoService.findByAnio(codCia, anio));
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo proyecto")
    public ResponseEntity<ProyectoDTO> create(@Valid @RequestBody ProyectoDTO dto) {
        ProyectoDTO created = proyectoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{codCia}/{codPyto}")
    @Operation(summary = "Actualizar proyecto")
    public ResponseEntity<ProyectoDTO> update(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @Valid @RequestBody ProyectoDTO dto) {
        return ResponseEntity.ok(proyectoService.update(codCia, codPyto, dto));
    }
    
    @DeleteMapping("/{codCia}/{codPyto}")
    @Operation(summary = "Eliminar (desactivar) proyecto")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        proyectoService.delete(codCia, codPyto);
        return ResponseEntity.noContent().build();
    }
}
