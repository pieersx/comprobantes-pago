package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.Persona;
import com.proyectos.comprobantespago.entity.Proveedor;
import com.proyectos.comprobantespago.repository.PersonaRepository;
import com.proyectos.comprobantespago.repository.ProveedorRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PROVEEDOR
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final PersonaRepository personaRepository;

    /**
     * Obtener todos los proveedores
     */
    public List<Proveedor> findAll() {
        return proveedorRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<Proveedor> findById(Long codCia, Long codProveedor) {
        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);
        return proveedorRepository.findById(id);
    }

    /**
     * Buscar proveedores por compañía
     */
    public List<Proveedor> findByCodCia(Long codCia) {
        return proveedorRepository.findByCodCia(codCia);
    }

    /**
     * Buscar por RUC
     */
    public Optional<Proveedor> findByNroRuc(String nroRuc) {
        return proveedorRepository.findByNroRuc(nroRuc);
    }

    /**
     * Buscar proveedores vigentes
     */
    public List<Proveedor> findByVigente(String vigente) {
        return proveedorRepository.findByVigente(vigente);
    }

    /**
     * Buscar por RUC (LIKE)
     */
    public List<Proveedor> findByNroRucContaining(String nroRuc) {
        return proveedorRepository.findByNroRucContaining(nroRuc);
    }

    /**
     * Crear nuevo proveedor (con persona)
     */
    public Proveedor save(Proveedor proveedor, Persona persona) {
        // Primero guardar la persona
        persona.setTipPersona("P"); // P = Proveedor
        personaRepository.save(persona);

        // Luego guardar el proveedor
        return proveedorRepository.save(proveedor);
    }

    /**
     * Actualizar proveedor
     */
    public Proveedor update(Long codCia, Long codProveedor, Proveedor actualizada) {
        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);
        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setNroRuc(actualizada.getNroRuc());
                    proveedor.setVigente(actualizada.getVigente());
                    return proveedorRepository.save(proveedor);
                })
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    /**
     * Eliminar proveedor
     */
    public void delete(Long codCia, Long codProveedor) {
        Proveedor.ProveedorId id = new Proveedor.ProveedorId(codCia, codProveedor);
        proveedorRepository.deleteById(id);
    }

    /**
     * Contar proveedores totales
     */
    public long count() {
        return proveedorRepository.count();
    }
}
