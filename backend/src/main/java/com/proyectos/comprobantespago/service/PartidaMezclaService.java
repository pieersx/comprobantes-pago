package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.PartidaMezcla;
import com.proyectos.comprobantespago.repository.PartidaMezclaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de PARTIDA_MEZCLA (Composición de partidas)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PartidaMezclaService {

    private final PartidaMezclaRepository partidaMezclaRepository;

    /**
     * Obtener todas las mezclas
     */
    public List<PartidaMezcla> findAll() {
        return partidaMezclaRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<PartidaMezcla> findById(Long codCia, String ingEgr, Long codPartida, Long corr) {
        PartidaMezcla.PartidaMezclaId id = new PartidaMezcla.PartidaMezclaId(codCia, ingEgr, codPartida, corr);
        return partidaMezclaRepository.findById(id);
    }

    /**
     * Buscar todas las mezclas de una partida específica
     */
    public List<PartidaMezcla> findByPartida(Long codCia, String ingEgr, Long codPartida) {
        return partidaMezclaRepository.findByCodCiaAndIngEgrAndCodPartida(codCia, ingEgr, codPartida);
    }

    /**
     * Buscar por compañía
     */
    public List<PartidaMezcla> findByCodCia(Long codCia) {
        return partidaMezclaRepository.findByCodCia(codCia);
    }

    /**
     * Buscar mezclas vigentes
     */
    public List<PartidaMezcla> findByVigente(String vigente) {
        return partidaMezclaRepository.findByVigente(vigente);
    }

    /**
     * Crear nueva mezcla
     */
    public PartidaMezcla save(PartidaMezcla partidaMezcla) {
        return partidaMezclaRepository.save(partidaMezcla);
    }

    /**
     * Actualizar mezcla existente
     */
    public PartidaMezcla update(Long codCia, String ingEgr, Long codPartida, Long corr,
            PartidaMezcla mezclaActualizada) {
        PartidaMezcla.PartidaMezclaId id = new PartidaMezcla.PartidaMezclaId(codCia, ingEgr, codPartida, corr);
        return partidaMezclaRepository.findById(id)
                .map(mezcla -> {
                    mezcla.setPadCodPartida(mezclaActualizada.getPadCodPartida());
                    mezcla.setTUniMed(mezclaActualizada.getTUniMed());
                    mezcla.setEUniMed(mezclaActualizada.getEUniMed());
                    mezcla.setCostoUnit(mezclaActualizada.getCostoUnit());
                    mezcla.setNivel(mezclaActualizada.getNivel());
                    mezcla.setOrden(mezclaActualizada.getOrden());
                    mezcla.setVigente(mezclaActualizada.getVigente());
                    return partidaMezclaRepository.save(mezcla);
                })
                .orElseThrow(() -> new RuntimeException("Partida Mezcla no encontrada"));
    }

    /**
     * Eliminar mezcla
     */
    public void delete(Long codCia, String ingEgr, Long codPartida, Long corr) {
        PartidaMezcla.PartidaMezclaId id = new PartidaMezcla.PartidaMezclaId(codCia, ingEgr, codPartida, corr);
        partidaMezclaRepository.deleteById(id);
    }
}
