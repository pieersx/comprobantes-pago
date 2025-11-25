package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.PartidaMezcla;

/**
 * Repositorio para la entidad PARTIDA_MEZCLA (Composición de Partidas)
 */
@Repository
public interface PartidaMezclaRepository extends JpaRepository<PartidaMezcla, PartidaMezcla.PartidaMezclaId> {

    /**
     * Buscar mezclas de una partida específica
     */
    List<PartidaMezcla> findByCodCiaAndIngEgrAndCodPartidaAndVigente(
            Long codCia, String ingEgr, Long codPartida, String vigente);

    /**
     * Buscar mezclas por compañía y tipo
     */
    List<PartidaMezcla> findByCodCiaAndIngEgrAndVigente(Long codCia, String ingEgr, String vigente);

    /**
     * Obtener estructura jerárquica de una partida
     */
    @Query("SELECT pm FROM PartidaMezcla pm WHERE pm.codCia = :codCia AND pm.ingEgr = :ingEgr " +
            "AND pm.codPartida = :codPartida AND pm.vigente = 'S' ORDER BY pm.nivel, pm.orden")
    List<PartidaMezcla> findEstructuraPartida(
            @Param("codCia") Long codCia,
            @Param("ingEgr") String ingEgr,
            @Param("codPartida") Long codPartida);

    /**
     * Buscar todas las mezclas de una partida (sin filtro de vigente)
     */
    List<PartidaMezcla> findByCodCiaAndIngEgrAndCodPartida(Long codCia, String ingEgr, Long codPartida);

    /**
     * Buscar todas las mezclas de una compañía
     */
    List<PartidaMezcla> findByCodCia(Long codCia);

    /**
     * Buscar mezclas por estado de vigencia
     */
    List<PartidaMezcla> findByVigente(String vigente);

    /**
     * Obtener subpartidas de una partida padre
     */
    @Query("SELECT pm FROM PartidaMezcla pm WHERE pm.codCia = :codCia AND pm.ingEgr = :ingEgr " +
            "AND pm.padCodPartida = :padCodPartida AND pm.vigente = 'S' ORDER BY pm.orden")
    List<PartidaMezcla> findSubpartidas(
            @Param("codCia") Long codCia,
            @Param("ingEgr") String ingEgr,
            @Param("padCodPartida") Long padCodPartida);

    /**
     * Buscar mezclas por padre específico
     * Feature: comprobantes-mejoras
     * Requirements: 5.1, 5.2
     */
    List<PartidaMezcla> findByCodCiaAndIngEgrAndPadCodPartidaAndVigente(
            Long codCia, String ingEgr, Long padCodPartida, String vigente);
}
