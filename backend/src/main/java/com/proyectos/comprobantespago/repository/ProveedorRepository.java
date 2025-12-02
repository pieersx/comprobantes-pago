package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Proveedor;

/**
 * Repository para Proveedor
 */
@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Proveedor.ProveedorId> {

    List<Proveedor> findByCodCiaAndVigente(Long codCia, String vigente);

    Optional<Proveedor> findByCodCiaAndCodProveedor(Long codCia, Long codProveedor);

    @Query("SELECT p FROM Proveedor p WHERE p.codCia = :codCia AND p.vigente = '1' ORDER BY p.persona.desPersona")
    List<Proveedor> findByCodCiaAndVigenteOrderByPersonaDesPersona(Long codCia);

    boolean existsByNroRuc(String nroRuc);

    List<Proveedor> findByVigente(String vigente);

    List<Proveedor> findByCodCia(Long codCia);

    Optional<Proveedor> findByNroRuc(String nroRuc);

    List<Proveedor> findByNroRucContaining(String nroRuc);
}
