package com.proyectos.comprobantespago.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.DProyPartidaMezcla;

/**
 * Repositorio para la entidad DPROY_PARTIDA_MEZCLA (Desembolsos de Partidas)
 */
@Repository
public interface DProyPartidaMezclaRepository
        extends JpaRepository<DProyPartidaMezcla, DProyPartidaMezcla.DProyPartidaMezclaId> {

    /**
     * Buscar desembolsos de una partida en un proyecto
     */
    List<DProyPartidaMezcla> findByCodCiaAndCodPytoAndNroVersionAndIngEgrAndCodPartidaAndCorr(
            Long codCia, Long codPyto, Integer nroVersion, String ingEgr, Long codPartida, Long corr);

    /**
     * Buscar desembolsos de un proyecto
     */
    List<DProyPartidaMezcla> findByCodCiaAndCodPytoAndNroVersion(
            Long codCia, Long codPyto, Integer nroVersion);

    /**
     * Buscar desembolsos por rango de fechas
     */
    @Query("SELECT d FROM DProyPartidaMezcla d WHERE d.codCia = :codCia AND d.codPyto = :codPyto " +
            "AND d.fecDesembolso BETWEEN :fechaInicio AND :fechaFin ORDER BY d.fecDesembolso")
    List<DProyPartidaMezcla> findByProyectoAndFechas(
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    /**
     * Calcular total desembolsado de una partida
     */
    @Query("SELECT SUM(d.impDesembTot) FROM DProyPartidaMezcla d WHERE d.codCia = :codCia " +
            "AND d.codPyto = :codPyto AND d.nroVersion = :nroVersion AND d.ingEgr = :ingEgr " +
            "AND d.codPartida = :codPartida AND d.corr = :corr")
    BigDecimal calcularTotalDesembolsado(
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto,
            @Param("nroVersion") Integer nroVersion,
            @Param("ingEgr") String ingEgr,
            @Param("codPartida") Long codPartida,
            @Param("corr") Long corr);

    /**
     * Obtener próximo número de pago
     */
    @Query("SELECT COALESCE(MAX(d.nroPago), 0) + 1 FROM DProyPartidaMezcla d " +
            "WHERE d.codCia = :codCia AND d.codPyto = :codPyto")
    Integer obtenerProximoNroPago(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);

    List<DProyPartidaMezcla> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    List<DProyPartidaMezcla> findByCodCiaAndCodPytoAndIngEgrAndNroVersionAndCodPartidaAndCorr(
            Long codCia, Long codPyto, String ingEgr, Integer nroVersion, Long codPartida, Long corr);

    List<DProyPartidaMezcla> findByFecDesembolsoBetween(LocalDate fechaInicio, LocalDate fechaFin);
}
