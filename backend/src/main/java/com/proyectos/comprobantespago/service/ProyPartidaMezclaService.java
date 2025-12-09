package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.ProyPartidaMezcla;
import com.proyectos.comprobantespago.repository.PartidaMezclaRepository;
import com.proyectos.comprobantespago.repository.ProyPartidaMezclaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PROY_PARTIDA_MEZCLA (Detalle de partidas por
 * proyecto)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProyPartidaMezclaService {

    private final ProyPartidaMezclaRepository proyPartidaMezclaRepository;
    private final PartidaMezclaRepository partidaMezclaRepository;

    /**
     * Obtener todas las mezclas de proyecto
     */
    public List<ProyPartidaMezcla> findAll() {
        return proyPartidaMezclaRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<ProyPartidaMezcla> findById(Long codCia, Long codPyto, String ingEgr, Integer nroVersion,
            Long codPartida, Long corr) {
        ProyPartidaMezcla.ProyPartidaMezclaId id = new ProyPartidaMezcla.ProyPartidaMezclaId(codCia, codPyto, ingEgr,
                nroVersion, codPartida, corr);
        return proyPartidaMezclaRepository.findById(id);
    }

    /**
     * Buscar todas las mezclas de un proyecto
     */
    public List<ProyPartidaMezcla> findByProyecto(Long codCia, Long codPyto) {
        return proyPartidaMezclaRepository.findByCodCiaAndCodPyto(codCia, codPyto);
    }

    /**
     * Buscar mezclas por proyecto y versión
     */
    public List<ProyPartidaMezcla> findByProyectoAndVersion(Long codCia, Long codPyto, Integer nroVersion) {
        return proyPartidaMezclaRepository.findByCodCiaAndCodPytoAndNroVersion(codCia, codPyto, nroVersion);
    }

    /**
     * Buscar mezclas de una partida específica en un proyecto
     */
    public List<ProyPartidaMezcla> findByProyectoAndPartida(Long codCia, Long codPyto, Integer nroVersion,
            String ingEgr, Long codPartida) {
        return proyPartidaMezclaRepository.findByCodCiaAndCodPytoAndNroVersionAndIngEgrAndCodPartida(
                codCia, codPyto, nroVersion, ingEgr, codPartida);
    }

    /**
     * Crear nueva mezcla de proyecto
     */
    public ProyPartidaMezcla save(ProyPartidaMezcla proyPartidaMezcla) {
        return proyPartidaMezclaRepository.save(proyPartidaMezcla);
    }

    /**
     * Actualizar mezcla de proyecto - permite editar TODOS los campos
     */
    public ProyPartidaMezcla update(Long codCia, Long codPyto, String ingEgr, Integer nroVersion, Long codPartida,
            Long corr, ProyPartidaMezcla actualizada) {
        ProyPartidaMezcla.ProyPartidaMezclaId id = new ProyPartidaMezcla.ProyPartidaMezclaId(codCia, codPyto, ingEgr,
                nroVersion, codPartida, corr);
        return proyPartidaMezclaRepository.findById(id)
                .map(mezcla -> {
                    // Actualizar todos los campos editables
                    if (actualizada.getPadCodPartida() != null) {
                        mezcla.setPadCodPartida(actualizada.getPadCodPartida());
                    }
                    if (actualizada.getTUniMed() != null) {
                        mezcla.setTUniMed(actualizada.getTUniMed());
                    }
                    if (actualizada.getEUniMed() != null) {
                        mezcla.setEUniMed(actualizada.getEUniMed());
                    }
                    if (actualizada.getNivel() != null) {
                        mezcla.setNivel(actualizada.getNivel());
                    }
                    if (actualizada.getOrden() != null) {
                        mezcla.setOrden(actualizada.getOrden());
                    }
                    if (actualizada.getCostoUnit() != null) {
                        mezcla.setCostoUnit(actualizada.getCostoUnit());
                    }
                    if (actualizada.getCant() != null) {
                        mezcla.setCant(actualizada.getCant());
                    }
                    if (actualizada.getCostoTot() != null) {
                        mezcla.setCostoTot(actualizada.getCostoTot());
                    }
                    return proyPartidaMezclaRepository.save(mezcla);
                })
                .orElseThrow(() -> new RuntimeException("Mezcla de Proyecto no encontrada"));
    }

    /**
     * Eliminar mezcla de proyecto
     */
    public void delete(Long codCia, Long codPyto, String ingEgr, Integer nroVersion, Long codPartida, Long corr) {
        ProyPartidaMezcla.ProyPartidaMezclaId id = new ProyPartidaMezcla.ProyPartidaMezclaId(codCia, codPyto, ingEgr,
                nroVersion, codPartida, corr);
        proyPartidaMezclaRepository.deleteById(id);
    }
}
