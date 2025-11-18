package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST alternativo para VtaCompPagoCab (Ingresos) - ruta
 * simplificada
 */
@RestController
@RequestMapping("/vta-comp-pago-cab")
@RequiredArgsConstructor
@Tag(name = "Comprobantes de Venta - Cabecera", description = "Gestión de comprobantes de ingresos")
@CrossOrigin(origins = "*")
public class VtaCompPagoCabSimpleController {

    private final VtaCompPagoCabRepository vtaCompPagoCabRepository;

    @Operation(summary = "Obtener todos los comprobantes de venta por compañía")
    @GetMapping
    public List<VtaCompPagoCab> obtenerTodos(@RequestParam Long codCia) {
        return vtaCompPagoCabRepository.findAll().stream()
                .filter(c -> c.getCodCia().equals(codCia))
                .toList();
    }

    @Operation(summary = "Obtener comprobante por ID")
    @GetMapping("/{codCia}/{nroCp}")
    public VtaCompPagoCab obtenerPorId(
            @PathVariable Long codCia,
            @PathVariable String nroCp) {
        return vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
    }

    @Operation(summary = "Obtener comprobantes por proyecto")
    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public List<VtaCompPagoCab> obtenerPorProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return vtaCompPagoCabRepository.findByCodCiaAndCodPyto(codCia, codPyto);
    }

    @Operation(summary = "Obtener comprobantes por cliente")
    @GetMapping("/cliente/{codCia}/{codCliente}")
    public List<VtaCompPagoCab> obtenerPorCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente) {
        return vtaCompPagoCabRepository.findByCodCiaAndCodCliente(codCia, codCliente);
    }

    @Operation(summary = "Obtener comprobantes por estado")
    @GetMapping("/estado/{codCia}/{tabEstado}/{codEstado}")
    public List<VtaCompPagoCab> obtenerPorEstado(
            @PathVariable Long codCia,
            @PathVariable String tabEstado,
            @PathVariable String codEstado) {
        return vtaCompPagoCabRepository.findByCodCiaAndTabEstadoAndCodEstado(codCia, tabEstado, codEstado);
    }
}
