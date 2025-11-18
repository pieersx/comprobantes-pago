package com.proyectos.comprobantespago.controller;

import com.proyectos.comprobantespago.dto.CompaniaDTO;
import com.proyectos.comprobantespago.service.CompaniaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para Compañías
 */
@RestController
@RequestMapping("/companias")
@RequiredArgsConstructor
@Tag(name = "Compañías", description = "Gestión de compañías (multi-tenant)")
public class CompaniaController {
    
    private final CompaniaService companiaService;
    
    @GetMapping
    @Operation(summary = "Listar todas las compañías")
    public ResponseEntity<List<CompaniaDTO>> findAll() {
        return ResponseEntity.ok(companiaService.findAll());
    }
    
    @GetMapping("/activas")
    @Operation(summary = "Listar compañías activas")
    public ResponseEntity<List<CompaniaDTO>> findAllActive() {
        return ResponseEntity.ok(companiaService.findAllActive());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener compañía por ID")
    public ResponseEntity<CompaniaDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(companiaService.findById(id));
    }
    
    @PostMapping
    @Operation(summary = "Crear nueva compañía")
    public ResponseEntity<CompaniaDTO> create(@Valid @RequestBody CompaniaDTO dto) {
        CompaniaDTO created = companiaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar compañía")
    public ResponseEntity<CompaniaDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CompaniaDTO dto) {
        return ResponseEntity.ok(companiaService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (desactivar) compañía")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companiaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
