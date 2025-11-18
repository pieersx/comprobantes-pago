package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.ProyPartida;

/**
 * Repositorio para la entidad PROY_PARTIDA (Partidas de Proyecto)
 */
@Repository
public interface ProyPartidaRepository extends JpaRepository<ProyPartida, ProyPartida.ProyPartidaId> {

    /**
     * Buscar partidas de un proyecto específico
     */
    List<ProyPartida> findByCodCiaAndCodPytoAndNroVersionAndVigente(
            Long codCia, Long codPyto, Integer nroVersion, String vigente);

    /**
     * Buscar partidas por tipo (Ingreso o Egreso)
     */
    List<ProyPartida> findByCodCiaAndCodPytoAndNroVersionAndIngEgrAndVigente(
            Long codCia, Long codPyto, Integer nroVersion, String ingEgr, String vigente);

    /**
     * Obtener partidas de ingreso de un proyecto
     */
    @Query("SELECT pp FROM ProyPartida pp WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto " +
            "AND pp.nroVersion = :nroVersion AND pp.ingEgr = 'I' AND pp.vigente = 'S' ORDER BY pp.nivel")
    List<ProyPartida> findPartidasIngreso(
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto,
            @Param("nroVersion") Integer nroVersion);

    /**
     * Obtener partidas de egreso de un proyecto
     */
    @Query("SELECT pp FROM ProyPartida pp WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto " +
            "AND pp.nroVersion = :nroVersion AND pp.ingEgr = 'E' AND pp.vigente = 'S' ORDER BY pp.nivel")
    List<ProyPartida> findPartidasEgreso(
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto,
            @Param("nroVersion") Integer nroVersion);

    /**
     * Obtener última versión de partidas de un proyecto
     */
    @Query("SELECT MAX(pp.nroVersion) FROM ProyPartida pp WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto")
    Integer findUltimaVersion(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);

    List<ProyPartida> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    List<ProyPartida> findByCodCiaAndCodPytoAndNroVersion(Long codCia, Long codPyto, Integer nroVersion);

    List<ProyPartida> findByIngEgr(String ingEgr);

    List<ProyPartida> findByVigente(String vigente);
}
