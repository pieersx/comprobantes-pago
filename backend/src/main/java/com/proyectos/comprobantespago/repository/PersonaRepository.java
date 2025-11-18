package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Persona;

/**
 * Repository para Persona
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Persona.PersonaId> {

    List<Persona> findByCodCiaAndVigente(Long codCia, String vigente);

    List<Persona> findByCodCiaAndTipPersonaAndVigente(Long codCia, String tipPersona, String vigente);

    @Query("SELECT p FROM Persona p WHERE p.codCia = :codCia AND p.vigente = 'S' ORDER BY p.desPersona")
    List<Persona> findByCodCiaAndVigenteOrderByDesPersona(Long codCia);

    Optional<Persona> findByCodCiaAndCodPersona(Long codCia, Long codPersona);

    List<Persona> findByCodCia(Long codCia);

    List<Persona> findByTipPersona(String tipPersona);

    List<Persona> findByCodCiaAndTipPersona(Long codCia, String tipPersona);

    List<Persona> findByVigente(String vigente);

    List<Persona> findByDesPersonaContaining(String descripcion);

    List<Persona> findByDesCortaContaining(String descripcion);

    long countByTipPersona(String tipPersona);
}
