package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Compania;

/**
 * Repositorio para la entidad CIA (Compañías/Empresas)
 */
@Repository
public interface CiaRepository extends JpaRepository<Compania, Long> {

    /**
     * Buscar todas las compañías vigentes
     */
    List<Compania> findByVigente(String vigente);

    /**
     * Buscar compañía por código y vigente
     */
    Optional<Compania> findByCodCiaAndVigente(Long codCia, String vigente);

    /**
     * Buscar compañías por descripción
     */
    List<Compania> findByDesCiaContainingIgnoreCase(String desCia);

    /**
     * Buscar por descripción corta
     */
    Optional<Compania> findByDesCorta(String desCorta);

    /**
     * Verificar si existe una compañía vigente
     */
    boolean existsByCodCiaAndVigente(Long codCia, String vigente);

    /**
     * Obtener todas las compañías vigentes ordenadas
     */
    @Query("SELECT c FROM Compania c WHERE c.vigente = '1' ORDER BY c.desCia")
    List<Compania> findAllActive();
}
