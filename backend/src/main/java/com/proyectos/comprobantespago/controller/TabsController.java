package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.TabsDTO;
import com.proyectos.comprobantespago.service.TabsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para gestión de Catálogos Maestros (TABS)
 */
@RestController
@RequestMapping("/tabs")
@RequiredArgsConstructor
@Tag(name = "Catálogos Maestros", description = "Gestión de catálogos maestros del sistema")
public class TabsController {

    private final TabsService tabsService;

    @Operation(summary = "Obtener todas las tablas vigentes")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TabsDTO>>> obtenerTodas() {
        List<TabsDTO> tabs = tabsService.obtenerTodasVigentes();
        return ResponseEntity.ok(ApiResponse.success("Tablas obtenidas exitosamente", tabs));
    }

    @Operation(summary = "Obtener tabla por código")
    @GetMapping("/{codTab}")
    public ResponseEntity<ApiResponse<TabsDTO>> obtenerPorCodigo(@PathVariable String codTab) {
        TabsDTO tabs = tabsService.obtenerPorCodigo(codTab);
        return ResponseEntity.ok(ApiResponse.success("Tabla obtenida exitosamente", tabs));
    }

    @Operation(summary = "Crear nueva tabla")
    @PostMapping
    public ResponseEntity<ApiResponse<TabsDTO>> crear(@Valid @RequestBody TabsDTO tabsDTO) {
        TabsDTO nuevaTabla = tabsService.crear(tabsDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tabla creada exitosamente", nuevaTabla));
    }

    @Operation(summary = "Actualizar tabla existente")
    @PutMapping("/{codTab}")
    public ResponseEntity<ApiResponse<TabsDTO>> actualizar(
            @PathVariable String codTab,
            @Valid @RequestBody TabsDTO tabsDTO) {
        TabsDTO tablaActualizada = tabsService.actualizar(codTab, tabsDTO);
        return ResponseEntity.ok(ApiResponse.success("Tabla actualizada exitosamente", tablaActualizada));
    }

    @Operation(summary = "Inactivar tabla")
    @DeleteMapping("/{codTab}")
    public ResponseEntity<ApiResponse<Void>> inactivar(@PathVariable String codTab) {
        tabsService.inactivar(codTab);
        return ResponseEntity.ok(ApiResponse.success("Tabla inactivada exitosamente", null));
    }
}
