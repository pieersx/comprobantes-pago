package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para ComprobantePagoCab (Egresos)
 */
@RestController
@RequestMapping("/comp-pago-cab")
@RequiredArgsConstructor
@Tag(name = "Comprobantes de Pago - Cabecera", description = "Gestión de comprobantes de egresos")
@CrossOrigin(origins = "*")
public class CompPagoCabController {

    private final ComprobantePagoCabRepository comprobantePagoCabRepository;

    @Operation(summary = "Obtener todos los comprobantes de pago por compañía")
    @GetMapping
    public List<ComprobantePagoCab> obtenerTodos(@RequestParam Long codCia) {
        return comprobantePagoCabRepository.findAll().stream()
                .filter(c -> c.getCodCia().equals(codCia))
                .toList();
    }

    @Operation(summary = "Obtener comprobante por ID")
    @GetMapping("/{codCia}/{codProveedor}/{nroCp}")
    public ComprobantePagoCab obtenerPorId(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp) {
        return comprobantePagoCabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
    }

    @Operation(summary = "Obtener comprobantes por proyecto")
    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public List<ComprobantePagoCab> obtenerPorProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return comprobantePagoCabRepository.findByCodCiaAndCodPyto(codCia, codPyto);
    }

    @Operation(summary = "Obtener comprobantes por proveedor")
    @GetMapping("/proveedor/{codCia}/{codProveedor}")
    public List<ComprobantePagoCab> obtenerPorProveedor(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor) {
        return comprobantePagoCabRepository.findByCodCiaAndCodProveedor(codCia, codProveedor);
    }

    @Operation(summary = "Obtener comprobantes por estado")
    @GetMapping("/estado/{codCia}/{estado}")
    public List<ComprobantePagoCab> obtenerPorEstado(
            @PathVariable Long codCia,
            @PathVariable String estado) {
        return comprobantePagoCabRepository.findByEstado(codCia, estado);
    }

    @Operation(summary = "Actualizar archivos adjuntos del comprobante de egreso", description = "Actualiza las rutas de los archivos adjuntos (comprobante y/o abono) de un comprobante de egreso existente.")
    @PutMapping("/{codCia}/{codProveedor}/{nroCp}/archivos")
    public ComprobantePagoCab actualizarArchivos(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @RequestBody java.util.Map<String, String> archivos) {

        ComprobantePagoCab comprobante = comprobantePagoCabRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        String fotoCp = archivos.get("fotoCp");
        String fotoAbono = archivos.get("fotoAbono");

        if (fotoCp != null) {
            comprobante.setFotoCp(fotoCp);
        }

        if (fotoAbono != null) {
            comprobante.setFotoAbono(fotoAbono);
        }

        return comprobantePagoCabRepository.save(comprobante);
    }
}
