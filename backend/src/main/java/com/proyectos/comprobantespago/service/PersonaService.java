package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.Persona;
import com.proyectos.comprobantespago.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PERSONA (Base única para clientes, proveedores,
 * empleados)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PersonaService {

    private final PersonaRepository personaRepository;

    /**
     * Obtener todas las personas
     */
    public List<Persona> findAll() {
        return personaRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<Persona> findById(Long codCia, Long codPersona) {
        Persona.PersonaId id = new Persona.PersonaId(codCia, codPersona);
        return personaRepository.findById(id);
    }

    /**
     * Buscar por compañía
     */
    public List<Persona> findByCodCia(Long codCia) {
        return personaRepository.findByCodCia(codCia);
    }

    /**
     * Buscar por tipo (E=Empleado, C=Cliente, P=Proveedor)
     */
    public List<Persona> findByTipPersona(String tipPersona) {
        return personaRepository.findByTipPersona(tipPersona);
    }

    /**
     * Buscar por compañía y tipo
     */
    public List<Persona> findByCodCiaAndTipPersona(Long codCia, String tipPersona) {
        return personaRepository.findByCodCiaAndTipPersona(codCia, tipPersona);
    }

    /**
     * Buscar personas vigentes
     */
    public List<Persona> findByVigente(String vigente) {
        return personaRepository.findByVigente(vigente);
    }

    /**
     * Buscar por descripción (LIKE)
     */
    public List<Persona> findByDesPersonaContaining(String descripcion) {
        return personaRepository.findByDesPersonaContaining(descripcion);
    }

    /**
     * Buscar por descripción corta (LIKE)
     */
    public List<Persona> findByDesCortaContaining(String descripcion) {
        return personaRepository.findByDesCortaContaining(descripcion);
    }

    /**
     * Crear nueva persona
     */
    public Persona save(Persona persona) {
        return personaRepository.save(persona);
    }

    /**
     * Actualizar persona
     */
    public Persona update(Long codCia, Long codPersona, Persona actualizada) {
        Persona.PersonaId id = new Persona.PersonaId(codCia, codPersona);
        return personaRepository.findById(id)
                .map(persona -> {
                    persona.setTipPersona(actualizada.getTipPersona());
                    persona.setDesPersona(actualizada.getDesPersona());
                    persona.setDesCorta(actualizada.getDesCorta());
                    persona.setDescAlterna(actualizada.getDescAlterna());
                    persona.setDesCortaAlt(actualizada.getDesCortaAlt());
                    persona.setVigente(actualizada.getVigente());
                    return personaRepository.save(persona);
                })
                .orElseThrow(() -> new RuntimeException("Persona no encontrada"));
    }

    /**
     * Eliminar persona
     */
    public void delete(Long codCia, Long codPersona) {
        Persona.PersonaId id = new Persona.PersonaId(codCia, codPersona);
        personaRepository.deleteById(id);
    }

    /**
     * Contar personas por tipo
     */
    public long countByTipPersona(String tipPersona) {
        return personaRepository.countByTipPersona(tipPersona);
    }
}
