package com.proyectos.comprobantespago.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ProveedorDTO;
import com.proyectos.comprobantespago.entity.Proveedor;
import com.proyectos.comprobantespago.repository.ProveedorRepository;

/**
 * Controlador REST para la gestión de Proveedores
 * Endpoints: /api/v1/proveedores
 */
@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    /**
     * GET /proveedores
     * Lista todos los proveedores
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProveedorDTO>> listarProveedores(
            @RequestParam(required = false) String vigente) {

        List<Proveedor> proveedores;

        if (vigente != null) {
            proveedores = proveedorRepository.findByVigente(vigente);
        } else {
            proveedores = proveedorRepository.findAll();
        }

        List<ProveedorDTO> proveedoresDTO = proveedores.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(proveedoresDTO);
    }

    /**
     * GET /proveedores/{codCia}/{codProveedor}
     * Obtiene un proveedor por su ID compuesto
     */
    @GetMapping("/{codCia}/{codProveedor}")
    @Transactional(readOnly = true)
    public ResponseEntity<ProveedorDTO> obtenerProveedor(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor) {

        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);

        return proveedorRepository.findById(id)
                .map(this::convertirADTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /proveedores
     * Crea un nuevo proveedor
     */
    @PostMapping
    @Transactional
    public ResponseEntity<ProveedorDTO> crearProveedor(@RequestBody ProveedorDTO proveedorDTO) {
        try {
            Proveedor proveedor = convertirAEntidad(proveedorDTO);
            Proveedor proveedorGuardado = proveedorRepository.save(proveedor);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertirADTO(proveedorGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /proveedores/{codCia}/{codProveedor}
     * Actualiza un proveedor existente
     */
    @PutMapping("/{codCia}/{codProveedor}")
    @Transactional
    public ResponseEntity<ProveedorDTO> actualizarProveedor(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @RequestBody ProveedorDTO proveedorDTO) {

        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);

        return proveedorRepository.findById(id)
                .map(proveedorExistente -> {
                    // Actualizar campos
                    if (proveedorExistente.getPersona() != null) {
                        proveedorExistente.getPersona().setDesPersona(proveedorDTO.getDesPersona());
                        proveedorExistente.getPersona().setDesCorta(proveedorDTO.getDesCorta());
                    }
                    proveedorExistente.setNroRuc(proveedorDTO.getNroRuc());
                    proveedorExistente.setVigente(proveedorDTO.getVigente());

                    Proveedor actualizado = proveedorRepository.save(proveedorExistente);
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /proveedores/{codCia}/{codProveedor}/vigencia
     * Cambia el estado de vigencia de un proveedor
     */
    @PatchMapping("/{codCia}/{codProveedor}/vigencia")
    @Transactional
    public ResponseEntity<ProveedorDTO> cambiarVigencia(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor,
            @RequestParam String vigente) {

        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);

        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setVigente(vigente);
                    Proveedor actualizado = proveedorRepository.save(proveedor);
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /proveedores/{codCia}/{codProveedor}
     * Elimina (desactiva) un proveedor
     */
    @DeleteMapping("/{codCia}/{codProveedor}")
    @Transactional
    public ResponseEntity<Void> eliminarProveedor(
            @PathVariable Long codCia,
            @PathVariable Long codProveedor) {

        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);

        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    // Eliminación lógica
                    proveedor.setVigente("N");
                    proveedorRepository.save(proveedor);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /proveedores/activos
     * Lista solo proveedores activos
     */
    @GetMapping("/activos")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProveedorDTO>> listarProveedoresActivos() {
        List<Proveedor> proveedores = proveedorRepository.findByVigente("S");
        List<ProveedorDTO> proveedoresDTO = proveedores.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(proveedoresDTO);
    }

    /**
     * Convierte entidad Proveedor a DTO
     */
    private ProveedorDTO convertirADTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setCodCia(proveedor.getCodCia());
        dto.setCodProveedor(proveedor.getCodProveedor());
        dto.setNroRuc(proveedor.getNroRuc());
        dto.setVigente(proveedor.getVigente());

        if (proveedor.getPersona() != null) {
            dto.setDesPersona(proveedor.getPersona().getDesPersona());
            dto.setDesCorta(proveedor.getPersona().getDesCorta());
        }

        return dto;
    }

    /**
     * Convierte DTO a entidad Proveedor
     */
    private Proveedor convertirAEntidad(ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setCodCia(dto.getCodCia());
        proveedor.setCodProveedor(dto.getCodProveedor());
        proveedor.setNroRuc(dto.getNroRuc());
        proveedor.setVigente(dto.getVigente() != null ? dto.getVigente() : "S");

        return proveedor;
    }
}
