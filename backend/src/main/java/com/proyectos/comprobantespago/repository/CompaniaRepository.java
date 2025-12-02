package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Compania;

/**
 * Repository para Compania
 */
@Repository
public interface CompaniaRepository extends JpaRepository<Compania, Long> {

    List<Compania> findByVigente(String vigente);

    Optional<Compania> findByCodCiaAndVigente(Long codCia, String vigente);

    @Query("SELECT c FROM Compania c WHERE c.vigente = '1' ORDER BY c.desCia")
    List<Compania> findAllActive();

    boolean existsByDesCia(String desCia);
}
