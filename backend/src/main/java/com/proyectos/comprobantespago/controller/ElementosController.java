package com.proyectos.comprobantespago.controller;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.dto.ElementosDTO;
import com.proyectos.comprobantespago.service.ElementosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de Elementos de Catálogos
 */
@RestController
@RequestMapping("/elementos")
@RequiredArgsConstructor
@Tag(name = "Elementos de Catálogos", description = "Gestión de elementos de los catálogos maestros")
public class ElementosController {

    private final ElementosService elementosService;

    @Operation(summary = "Obtener elementos de una tabla específica")
    @GetMapping("/tabla/{codTab}")
    public ResponseEntity<ApiResponse<List<ElementosDTO>>> obtenerPorTabla(@PathVariable String codTab) {
        List<ElementosDTO> elementos = elementosService.obtenerPorTabla(codTab);
        return ResponseEntity.ok(ApiResponse.success("Elementos obtenidos exitosamente", elementos));
    }

    @Operation(summary = "Obtener elemento específico")
    @GetMapping("/{codTab}/{codElem}")
    public ResponseEntity<ApiResponse<ElementosDTO>> obtenerElemento(
            @PathVariable String codTab,
            @PathVariable String codElem) {
        ElementosDTO elemento = elementosService.obtenerElemento(codTab, codElem);
        return ResponseEntity.ok(ApiResponse.success("Elemento obtenido exitosamente", elemento));
    }

    @Operation(summary = "Obtener tipos de moneda")
    @GetMapping("/monedas")
    public ResponseEntity<ApiResponse<List<ElementosDTO>>> obtenerTiposMoneda() {
        List<ElementosDTO> monedas = elementosService.obtenerTiposMoneda();
        return ResponseEntity.ok(ApiResponse.success("Tipos de moneda obtenidos exitosamente", monedas));
    }

    @Operation(summary = "Obtener unidades de medida")
    @GetMapping("/unidades-medida")
    public ResponseEntity<ApiResponse<List<ElementosDTO>>> obtenerUnidadesMedida() {
        List<ElementosDTO> unidades = elementosService.obtenerUnidadesMedida();
        return ResponseEntity.ok(ApiResponse.success("Unidades de medida obtenidas exitosamente", unidades));
    }

    @Operation(summary = "Obtener tipos de comprobante")
    @GetMapping("/tipos-comprobante")
    public ResponseEntity<ApiResponse<List<ElementosDTO>>> obtenerTiposComprobante() {
        List<ElementosDTO> tipos = elementosService.obtenerTiposComprobante();
        return ResponseEntity.ok(ApiResponse.success("Tipos de comprobante obtenidos exitosamente", tipos));
    }

    @Operation(summary = "Crear nuevo elemento")
    @PostMapping
    public ResponseEntity<ApiResponse<ElementosDTO>> crear(@Valid @RequestBody ElementosDTO elementosDTO) {
        ElementosDTO nuevoElemento = elementosService.crear(elementosDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Elemento creado exitosamente", nuevoElemento));
    }

    @Operation(summary = "Actualizar elemento existente")
    @PutMapping("/{codTab}/{codElem}")
    public ResponseEntity<ApiResponse<ElementosDTO>> actualizar(
            @PathVariable String codTab,
            @PathVariable String codElem,
            @Valid @RequestBody ElementosDTO elementosDTO) {
        ElementosDTO elementoActualizado = elementosService.actualizar(codTab, codElem, elementosDTO);
        return ResponseEntity.ok(ApiResponse.success("Elemento actualizado exitosamente", elementoActualizado));
    }

    @Operation(summary = "Inactivar elemento")
    @DeleteMapping("/{codTab}/{codElem}")
    public ResponseEntity<ApiResponse<Void>> inactivar(
            @PathVariable String codTab,
            @PathVariable String codElem) {
        elementosService.inactivar(codTab, codElem);
        return ResponseEntity.ok(ApiResponse.success("Elemento inactivado exitosamente", null));
    }
}
