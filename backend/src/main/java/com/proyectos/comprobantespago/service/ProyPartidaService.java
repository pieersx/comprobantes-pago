package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.ProyPartida;
import com.proyectos.comprobantespago.repository.ProyPartidaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PROY_PARTIDA (Partidas por proyecto)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProyPartidaService {

    private final ProyPartidaRepository proyPartidaRepository;

    /**
     * Obtener todas las partidas de proyecto
     */
    public List<ProyPartida> findAll() {
        return proyPartidaRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<ProyPartida> findById(Long codCia, Long codPyto, Integer nroVersion, String ingEgr,
            Long codPartida) {
        ProyPartida.ProyPartidaId id = new ProyPartida.ProyPartidaId(codCia, codPyto, nroVersion, ingEgr, codPartida);
        return proyPartidaRepository.findById(id);
    }

    /**
     * Buscar todas las partidas de un proyecto específico
     */
    public List<ProyPartida> findByProyecto(Long codCia, Long codPyto) {
        return proyPartidaRepository.findByCodCiaAndCodPyto(codCia, codPyto);
    }

    /**
     * Buscar partidas por proyecto y versión
     */
    public List<ProyPartida> findByProyectoAndVersion(Long codCia, Long codPyto, Integer nroVersion) {
        return proyPartidaRepository.findByCodCiaAndCodPytoAndNroVersion(codCia, codPyto, nroVersion);
    }

    /**
     * Buscar por tipo (Ingreso/Egreso)
     */
    public List<ProyPartida> findByIngEgr(String ingEgr) {
        return proyPartidaRepository.findByIngEgr(ingEgr);
    }

    /**
     * Buscar partidas vigentes
     */
    public List<ProyPartida> findByVigente(String vigente) {
        return proyPartidaRepository.findByVigente(vigente);
    }

    /**
     * Crear nueva partida de proyecto
     */
    public ProyPartida save(ProyPartida proyPartida) {
        return proyPartidaRepository.save(proyPartida);
    }

    /**
     * Actualizar partida de proyecto
     */
    public ProyPartida update(Long codCia, Long codPyto, Integer nroVersion, String ingEgr, Long codPartida,
            ProyPartida actualizada) {
        ProyPartida.ProyPartidaId id = new ProyPartida.ProyPartidaId(codCia, codPyto, nroVersion, ingEgr, codPartida);
        return proyPartidaRepository.findById(id)
                .map(proyPartida -> {
                    proyPartida.setCodPartidas(actualizada.getCodPartidas());
                    proyPartida.setFlgCC(actualizada.getFlgCC());
                    proyPartida.setNivel(actualizada.getNivel());
                    proyPartida.setUniMed(actualizada.getUniMed());
                    proyPartida.setTabEstado(actualizada.getTabEstado());
                    proyPartida.setCodEstado(actualizada.getCodEstado());
                    proyPartida.setVigente(actualizada.getVigente());
                    return proyPartidaRepository.save(proyPartida);
                })
                .orElseThrow(() -> new RuntimeException("Partida de Proyecto no encontrada"));
    }

    /**
     * Eliminar partida de proyecto
     */
    public void delete(Long codCia, Long codPyto, Integer nroVersion, String ingEgr, Long codPartida) {
        ProyPartida.ProyPartidaId id = new ProyPartida.ProyPartidaId(codCia, codPyto, nroVersion, ingEgr, codPartida);
        proyPartidaRepository.deleteById(id);
    }
}
