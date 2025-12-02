package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Partida;

/**
 * Repository para Partida
 */
@Repository
public interface PartidaRepository extends JpaRepository<Partida, Partida.PartidaId> {

    List<Partida> findByCodCia(Long codCia);

    List<Partida> findByIngEgr(String ingEgr);

    List<Partida> findByCodCiaAndIngEgr(Long codCia, String ingEgr);

    List<Partida> findByCodCiaAndIngEgrAndVigente(Long codCia, String ingEgr, String vigente);

    List<Partida> findByVigente(String vigente);

    List<Partida> findByDesPartidaContaining(String descripcion);

    long countByIngEgr(String ingEgr);

    // Métodos para jerarquía de partidas
    List<Partida> findByCodCiaAndIngEgrAndNivel(Long codCia, String ingEgr, Integer nivel);

    // Buscar partida específica por código
    Partida findByCodCiaAndIngEgrAndCodPartida(Long codCia, String ingEgr, Long codPartida);
}
