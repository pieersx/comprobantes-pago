package com.proyectos.comprobantespago.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.AbonoDTO;
import com.proyectos.comprobantespago.enums.EstadoComprobante;
import com.proyectos.comprobantespago.service.AbonoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/abonos")
@RequiredArgsConstructor
@Tag(name = "Abonos", description = "Gestión de abonos y estados de comprobantes")
@CrossOrigin(origins = "*")
public class AbonoController {

    private final AbonoService abonoService;

    @PostMapping("/egreso/{codCia}/{codProveedor}/{nroCP}")
    @Operation(summary = "Registrar abono para comprobante de egreso", description = "Registra el pago de un comprobante de egreso y cambia su estado a PAGADO")
    public ResponseEntity<String> registrarAbonoEgreso(
            @PathVariable @Parameter(description = "Código de compañía") Long codCia,
            @PathVariable @Parameter(description = "Código del proveedor") Long codProveedor,
            @PathVariable @Parameter(description = "Número de comprobante") String nroCP,
            @Valid @RequestBody AbonoDTO abonoDTO) {

        log.info("POST /api/v1/abonos/egreso/{}/{}/{}", codCia, codProveedor, nroCP);
        abonoService.registrarAbonoEgreso(codCia, codProveedor, nroCP, abonoDTO);
        return ResponseEntity.ok("Abono registrado exitosamente");
    }

    @PostMapping("/ingreso/{codCia}/{nroCP}")
    @Operation(summary = "Registrar abono para comprobante de ingreso", description = "Registra el cobro de un comprobante de ingreso y cambia su estado a PAGADO")
    public ResponseEntity<String> registrarAbonoIngreso(
            @PathVariable @Parameter(description = "Código de compañía") Long codCia,
            @PathVariable @Parameter(description = "Número de comprobante") String nroCP,
            @Valid @RequestBody AbonoDTO abonoDTO) {

        log.info("POST /api/v1/abonos/ingreso/{}/{}", codCia, nroCP);
        abonoService.registrarAbonoIngreso(codCia, nroCP, abonoDTO);
        return ResponseEntity.ok("Abono registrado exitosamente");
    }

    @GetMapping("/egreso/{codCia}/{codProveedor}/{nroCP}")
    @Operation(summary = "Consultar abono de comprobante de egreso")
    public ResponseEntity<AbonoDTO> consultarAbonoEgreso(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCP) {

        AbonoDTO abono = abonoService.getAbonoEgreso(codCia, codProveedor, nroCP);
        return ResponseEntity.ok(abono);
    }

    @GetMapping("/ingreso/{codCia}/{nroCP}")
    @Operation(summary = "Consultar abono de comprobante de ingreso")
    public ResponseEntity<AbonoDTO> consultarAbonoIngreso(
            @PathVariable Long codCia,
            @PathVariable String nroCP) {

        AbonoDTO abono = abonoService.getAbonoIngreso(codCia, nroCP);
        return ResponseEntity.ok(abono);
    }

    @PutMapping("/egreso/{codCia}/{codProveedor}/{nroCP}/estado/{estado}")
    @Operation(summary = "Cambiar estado de comprobante de egreso")
    public ResponseEntity<String> cambiarEstadoEgreso(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCP,
            @PathVariable String estado) {

        EstadoComprobante nuevoEstado = EstadoComprobante.fromCodigo(estado);
        abonoService.cambiarEstadoEgreso(codCia, codProveedor, nroCP, nuevoEstado);
        return ResponseEntity.ok("Estado actualizado exitosamente");
    }

    @PutMapping("/ingreso/{codCia}/{nroCP}/estado/{estado}")
    @Operation(summary = "Cambiar estado de comprobante de ingreso")
    public ResponseEntity<String> cambiarEstadoIngreso(
            @PathVariable Long codCia,
            @PathVariable String nroCP,
            @PathVariable String estado) {

        EstadoComprobante nuevoEstado = EstadoComprobante.fromCodigo(estado);
        abonoService.cambiarEstadoIngreso(codCia, nroCP, nuevoEstado);
        return ResponseEntity.ok("Estado actualizado exitosamente");
    }
}
