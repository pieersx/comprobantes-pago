package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Cliente;

/**
 * Repository para Cliente
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Cliente.ClienteId> {

    List<Cliente> findByVigente(String vigente);

    List<Cliente> findByCodCiaAndVigente(Long codCia, String vigente);

    Optional<Cliente> findByCodCiaAndCodCliente(Long codCia, Long codCliente);

    @Query("SELECT c FROM Cliente c WHERE c.codCia = :codCia AND c.vigente = 'S' ORDER BY c.codCliente")
    List<Cliente> findAllActiveByCodCia(@Param("codCia") Long codCia);

    boolean existsByNroRuc(String nroRuc);

    List<Cliente> findByCodCia(Long codCia);

    Optional<Cliente> findByNroRuc(String nroRuc);

    List<Cliente> findByNroRucContaining(String nroRuc);
}
