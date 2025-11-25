package com.proyectos.comprobantespago.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.ProyPartidaMezcla;

/**
 * Repositorio para la entidad PROY_PARTIDA_MEZCLA (Detalle de Partidas en
 * Proyectos)
 */
@Repository
public interface ProyPartidaMezclaRepository
                extends JpaRepository<ProyPartidaMezcla, ProyPartidaMezcla.ProyPartidaMezclaId> {

        /**
         * Buscar mezcla de partidas de un proyecto
         */
        List<ProyPartidaMezcla> findByCodCiaAndCodPytoAndNroVersionAndIngEgr(
                        Long codCia, Long codPyto, Integer nroVersion, String ingEgr);

        /**
         * Buscar detalle de una partida específica en un proyecto
         */
        List<ProyPartidaMezcla> findByCodCiaAndCodPytoAndNroVersionAndIngEgrAndCodPartida(
                        Long codCia, Long codPyto, Integer nroVersion, String ingEgr, Long codPartida);

        /**
         * Obtener estructura jerárquica de partidas de un proyecto
         */
        @Query("SELECT ppm FROM ProyPartidaMezcla ppm WHERE ppm.codCia = :codCia AND ppm.codPyto = :codPyto " +
                        "AND ppm.nroVersion = :nroVersion AND ppm.ingEgr = :ingEgr AND ppm.codPartida = :codPartida " +
                        "ORDER BY ppm.nivel, ppm.orden")
        List<ProyPartidaMezcla> findEstructuraProyPartida(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("nroVersion") Integer nroVersion,
                        @Param("ingEgr") String ingEgr,
                        @Param("codPartida") Long codPartida);

        /**
         * Calcular costo total de una partida en un proyecto
         */
        @Query("SELECT SUM(ppm.costoTot) FROM ProyPartidaMezcla ppm WHERE ppm.codCia = :codCia " +
                        "AND ppm.codPyto = :codPyto AND ppm.nroVersion = :nroVersion AND ppm.ingEgr = :ingEgr " +
                        "AND ppm.codPartida = :codPartida")
        BigDecimal calcularCostoTotalPartida(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("nroVersion") Integer nroVersion,
                        @Param("ingEgr") String ingEgr,
                        @Param("codPartida") Long codPartida);

        List<ProyPartidaMezcla> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

        List<ProyPartidaMezcla> findByCodCiaAndCodPytoAndNroVersion(Long codCia, Long codPyto, Integer nroVersion);

        /**
         * Buscar mezclas de una partida específica en un proyecto (cualquier versión)
         */
        List<ProyPartidaMezcla> findByCodCiaAndCodPytoAndIngEgrAndCodPartida(
                        Long codCia, Long codPyto, String ingEgr, Long codPartida);

        /**
         * Obtener solo partidas de NIVEL 3 de un proyecto
         * Según especificaciones: Solo nivel 3 se usa en comprobantes
         */
        @Query("SELECT ppm FROM ProyPartidaMezcla ppm WHERE ppm.codCia = :codCia " +
                        "AND ppm.codPyto = :codPyto AND ppm.nroVersion = :nroVersion " +
                        "AND ppm.ingEgr = :ingEgr AND ppm.nivel = 3 " +
                        "ORDER BY ppm.orden")
        List<ProyPartidaMezcla> findPartidasNivel3(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("nroVersion") Integer nroVersion,
                        @Param("ingEgr") String ingEgr);

        /**
         * Calcular presupuesto total de nivel 3 para un proyecto
         */
        @Query("SELECT SUM(ppm.costoTot) FROM ProyPartidaMezcla ppm WHERE ppm.codCia = :codCia " +
                        "AND ppm.codPyto = :codPyto AND ppm.nroVersion = :nroVersion " +
                        "AND ppm.ingEgr = :ingEgr AND ppm.nivel = 3")
        BigDecimal calcularPresupuestoTotalNivel3(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("nroVersion") Integer nroVersion,
                        @Param("ingEgr") String ingEgr);
}
