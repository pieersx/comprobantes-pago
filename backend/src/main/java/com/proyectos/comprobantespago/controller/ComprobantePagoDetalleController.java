package com.proyectos.comprobantespago.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ComprobantePagoDetalleDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoDet;
import com.proyectos.comprobantespago.repository.ComprobantePagoDetRepository;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para gestión de Detalles de Comprobantes de Pago
 * Endpoints: /api/v1/comprobantes-detalle
 */
@RestController
@RequestMapping("/comprobantes-detalle")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ComprobantePagoDetalleController {

    private final ComprobantePagoDetRepository detalleRepository;

    /**
     * GET /comprobantes-detalle/cabecera/{codCia}/{codProveedor}/{nroCp}
     * Obtiene todos los detalles de un comprobante
     */
    @GetMapping("/cabecera/{codCia}/{codProveedor}/{nroCp}")
    public ResponseEntity<List<ComprobantePagoDetalleDTO>> listarDetallesPorCabecera(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp) {

        List<ComprobantePagoDet> detalles = detalleRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp);
        List<ComprobantePagoDetalleDTO> detallesDTO = detalles.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(detallesDTO);
    }

    /**
     * GET /comprobantes-detalle/{codCia}/{codProveedor}/{nroCp}/{sec}
     * Obtiene un detalle específico
     */
    @GetMapping("/{codCia}/{codProveedor}/{nroCp}/{sec}")
    public ResponseEntity<ComprobantePagoDetalleDTO> obtenerDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @PathVariable Integer sec) {

        ComprobantePagoDet.ComprobantePagoDetId id = new ComprobantePagoDet.ComprobantePagoDetId(
                codCia, codProveedor, nroCp, sec);
        return detalleRepository.findById(id)
                .map(this::convertirADTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /comprobantes-detalle
     * Crea un nuevo detalle de comprobante
     */
    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<ComprobantePagoDetalleDTO> crearDetalle(
            @RequestBody ComprobantePagoDetalleDTO detalleDTO) {
        try {
            ComprobantePagoDet detalle = convertirAEntidad(detalleDTO);
            ComprobantePagoDet detalleGuardado = detalleRepository.save(detalle);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertirADTO(detalleGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /comprobantes-detalle/{codCia}/{codProveedor}/{nroCp}/{sec}
     * Actualiza un detalle existente
     */
    @PutMapping("/{codCia}/{codProveedor}/{nroCp}/{sec}")
    public ResponseEntity<ComprobantePagoDetalleDTO> actualizarDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @PathVariable Integer sec,
            @RequestBody ComprobantePagoDetalleDTO detalleDTO) {

        ComprobantePagoDet.ComprobantePagoDetId id = new ComprobantePagoDet.ComprobantePagoDetId(
                codCia, codProveedor, nroCp, sec);
        return detalleRepository.findById(id)
                .map(detalleExistente -> {
                    detalleExistente.setIngEgr(detalleDTO.getIngEgr());
                    detalleExistente.setCodPartida(detalleDTO.getCodPartida());
                    detalleExistente.setImpNetoMn(detalleDTO.getImpNetoMn());
                    detalleExistente.setImpIgvMn(detalleDTO.getImpIgvMn());
                    detalleExistente.setImpTotalMn(detalleDTO.getImpTotalMn());
                    detalleExistente.setSemilla(detalleDTO.getSemilla());

                    ComprobantePagoDet actualizado = detalleRepository.save(detalleExistente);
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /comprobantes-detalle/{codCia}/{codProveedor}/{nroCp}/{sec}
     * Elimina un detalle
     */
    @DeleteMapping("/{codCia}/{codProveedor}/{nroCp}/{sec}")
    public ResponseEntity<Void> eliminarDetalle(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp,
            @PathVariable Integer sec) {

        ComprobantePagoDet.ComprobantePagoDetId id = new ComprobantePagoDet.ComprobantePagoDetId(
                codCia, codProveedor, nroCp, sec);
        if (detalleRepository.existsById(id)) {
            detalleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * GET /comprobantes-detalle/total/{codCia}/{codProveedor}/{nroCp}
     * Calcula el total de todos los detalles de un comprobante
     */
    @GetMapping("/total/{codCia}/{codProveedor}/{nroCp}")
    public ResponseEntity<BigDecimal> calcularTotal(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @PathVariable String nroCp) {

        List<ComprobantePagoDet> detalles = detalleRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp);
        BigDecimal total = detalles.stream()
                .map(ComprobantePagoDet::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(total);
    }

    /**
     * Convierte entidad a DTO
     */
    private ComprobantePagoDetalleDTO convertirADTO(ComprobantePagoDet detalle) {
        ComprobantePagoDetalleDTO dto = new ComprobantePagoDetalleDTO();
        dto.setCodCia(detalle.getCodCia());
        dto.setCodProveedor(detalle.getCodProveedor());
        dto.setNroCp(detalle.getNroCp());
        dto.setSec(detalle.getSec());
        dto.setIngEgr(detalle.getIngEgr());
        dto.setCodPartida(detalle.getCodPartida());
        dto.setImpNetoMn(detalle.getImpNetoMn());
        dto.setImpIgvMn(detalle.getImpIgvMn());
        dto.setImpTotalMn(detalle.getImpTotalMn());
        dto.setSemilla(detalle.getSemilla());
        if (detalle.getPartida() != null) {
            dto.setNombrePartida(detalle.getPartida().getDesPartida());
        }

        return dto;
    }

    /**
     * Convierte DTO a entidad
     */
    private ComprobantePagoDet convertirAEntidad(ComprobantePagoDetalleDTO dto) {
        ComprobantePagoDet detalle = new ComprobantePagoDet();
        detalle.setCodCia(dto.getCodCia());
        detalle.setCodProveedor(dto.getCodProveedor());
        detalle.setNroCp(dto.getNroCp());
        detalle.setSec(dto.getSec());
        detalle.setIngEgr(dto.getIngEgr());
        detalle.setCodPartida(dto.getCodPartida());
        detalle.setImpNetoMn(dto.getImpNetoMn());
        detalle.setImpIgvMn(dto.getImpIgvMn());
        detalle.setImpTotalMn(dto.getImpTotalMn());
        detalle.setSemilla(dto.getSemilla());

        return detalle;
    }
}
