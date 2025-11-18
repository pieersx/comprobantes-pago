package com.proyectos.comprobantespago.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.DProyPartidaMezcla;
import com.proyectos.comprobantespago.repository.DProyPartidaMezclaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de DPROY_PARTIDA_MEZCLA (Desembolsos programados)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DProyPartidaMezclaService {

    private final DProyPartidaMezclaRepository dProyPartidaMezclaRepository;

    /**
     * Obtener todos los desembolsos
     */
    public List<DProyPartidaMezcla> findAll() {
        return dProyPartidaMezclaRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<DProyPartidaMezcla> findById(Long codCia, Long codPyto, String ingEgr, Integer nroVersion,
            Long codPartida, Long corr, Integer sec) {
        DProyPartidaMezcla.DProyPartidaMezclaId id = new DProyPartidaMezcla.DProyPartidaMezclaId(codCia, codPyto,
                ingEgr, nroVersion, codPartida, corr, sec);
        return dProyPartidaMezclaRepository.findById(id);
    }

    /**
     * Buscar todos los desembolsos de un proyecto
     */
    public List<DProyPartidaMezcla> findByProyecto(Long codCia, Long codPyto) {
        return dProyPartidaMezclaRepository.findByCodCiaAndCodPyto(codCia, codPyto);
    }

    /**
     * Buscar desembolsos por mezcla específica
     */
    public List<DProyPartidaMezcla> findByMezcla(Long codCia, Long codPyto, String ingEgr, Integer nroVersion,
            Long codPartida, Long corr) {
        return dProyPartidaMezclaRepository.findByCodCiaAndCodPytoAndIngEgrAndNroVersionAndCodPartidaAndCorr(
                codCia, codPyto, ingEgr, nroVersion, codPartida, corr);
    }

    /**
     * Buscar desembolsos por rango de fechas
     */
    public List<DProyPartidaMezcla> findByFechaDesembolsoBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return dProyPartidaMezclaRepository.findByFecDesembolsoBetween(fechaInicio, fechaFin);
    }

    /**
     * Crear nuevo desembolso
     */
    public DProyPartidaMezcla save(DProyPartidaMezcla dProyPartidaMezcla) {
        return dProyPartidaMezclaRepository.save(dProyPartidaMezcla);
    }

    /**
     * Actualizar desembolso
     */
    public DProyPartidaMezcla update(Long codCia, Long codPyto, String ingEgr, Integer nroVersion, Long codPartida,
            Long corr, Integer sec, DProyPartidaMezcla actualizada) {
        DProyPartidaMezcla.DProyPartidaMezclaId id = new DProyPartidaMezcla.DProyPartidaMezclaId(codCia, codPyto,
                ingEgr, nroVersion, codPartida, corr, sec);
        return dProyPartidaMezclaRepository.findById(id)
                .map(desembolso -> {
                    desembolso.setTDesembolso(actualizada.getTDesembolso());
                    desembolso.setEDesembolso(actualizada.getEDesembolso());
                    desembolso.setNroPago(actualizada.getNroPago());
                    desembolso.setTCompPago(actualizada.getTCompPago());
                    desembolso.setECompPago(actualizada.getECompPago());
                    desembolso.setFecDesembolso(actualizada.getFecDesembolso());
                    desembolso.setImpDesembNeto(actualizada.getImpDesembNeto());
                    desembolso.setImpDesembIGV(actualizada.getImpDesembIGV());
                    desembolso.setImpDesembTot(actualizada.getImpDesembTot());
                    desembolso.setSemilla(actualizada.getSemilla());
                    return dProyPartidaMezclaRepository.save(desembolso);
                })
                .orElseThrow(() -> new RuntimeException("Desembolso no encontrado"));
    }

    /**
     * Eliminar desembolso
     */
    public void delete(Long codCia, Long codPyto, String ingEgr, Integer nroVersion, Long codPartida, Long corr,
            Integer sec) {
        DProyPartidaMezcla.DProyPartidaMezclaId id = new DProyPartidaMezcla.DProyPartidaMezclaId(codCia, codPyto,
                ingEgr, nroVersion, codPartida, corr, sec);
        dProyPartidaMezclaRepository.deleteById(id);
    }
}
