package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.repository.PartidaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PARTIDA (Catálogo maestro de partidas presupuestales)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PartidaService {

    private final PartidaRepository partidaRepository;

    /**
     * Obtener todas las partidas
     */
    public List<Partida> findAll() {
        return partidaRepository.findAll();
    }

    /**
     * Buscar partida por ID compuesto
     */
    public Optional<Partida> findById(Long codCia, String ingEgr, Long codPartida) {
        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);
        return partidaRepository.findById(id);
    }

    /**
     * Buscar partidas por compañía
     */
    public List<Partida> findByCodCia(Long codCia) {
        return partidaRepository.findByCodCia(codCia);
    }

    /**
     * Buscar partidas por tipo (Ingreso/Egreso)
     */
    public List<Partida> findByIngEgr(String ingEgr) {
        return partidaRepository.findByIngEgr(ingEgr);
    }

    /**
     * Buscar partidas por compañía y tipo
     */
    public List<Partida> findByCodCiaAndIngEgr(Long codCia, String ingEgr) {
        return partidaRepository.findByCodCiaAndIngEgr(codCia, ingEgr);
    }

    /**
     * Buscar partidas vigentes
     */
    public List<Partida> findByVigente(String vigente) {
        return partidaRepository.findByVigente(vigente);
    }

    /**
     * Buscar por descripción (LIKE)
     */
    public List<Partida> findByDesPartidaContaining(String descripcion) {
        return partidaRepository.findByDesPartidaContaining(descripcion);
    }

    /**
     * Crear nueva partida
     */
    public Partida save(Partida partida) {
        return partidaRepository.save(partida);
    }

    /**
     * Actualizar partida existente
     */
    public Partida update(Long codCia, String ingEgr, Long codPartida, Partida partidaActualizada) {
        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);
        return partidaRepository.findById(id)
                .map(partida -> {
                    partida.setDesPartida(partidaActualizada.getDesPartida());
                    partida.setCodPartidas(partidaActualizada.getCodPartidas());
                    partida.setFlgCC(partidaActualizada.getFlgCC());
                    partida.setNivel(partidaActualizada.getNivel());
                    partida.setTUniMed(partidaActualizada.getTUniMed());
                    partida.setEUniMed(partidaActualizada.getEUniMed());
                    partida.setSemilla(partidaActualizada.getSemilla());
                    partida.setVigente(partidaActualizada.getVigente());
                    return partidaRepository.save(partida);
                })
                .orElseThrow(() -> new RuntimeException("Partida no encontrada"));
    }

    /**
     * Eliminar partida
     */
    public void delete(Long codCia, String ingEgr, Long codPartida) {
        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);
        partidaRepository.deleteById(id);
    }

    /**
     * Contar partidas por tipo
     */
    public long countByIngEgr(String ingEgr) {
        return partidaRepository.countByIngEgr(ingEgr);
    }
}
