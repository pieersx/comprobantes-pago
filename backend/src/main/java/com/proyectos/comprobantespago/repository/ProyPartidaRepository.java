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

        List<ProyPartida> findByCodCiaAndCodPytoAndNroVersion(Long codCia, Long codPyto, Integer nroVersion);

        List<ProyPartida> findByIngEgr(String ingEgr);

        List<ProyPartida> findByVigente(String vigente);

        /**
         * Obtener partidas de NIVEL 3 (último nivel) de un proyecto
         * Según el profesor: Solo partidas de nivel 3 se usan en comprobantes
         */
        @Query("SELECT pp FROM ProyPartida pp WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto " +
                        "AND pp.ingEgr = :ingEgr AND pp.nivel = 3 AND pp.vigente = 'S' " +
                        "ORDER BY pp.codPartidas")
        List<ProyPartida> findPartidasNivel3ByProyecto(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("ingEgr") String ingEgr);

        /**
         * Obtener TODAS las partidas (niveles 1, 2 y 3) de un proyecto
         * Nuevo requerimiento: El usuario puede seleccionar cualquier nivel
         */
        @Query("SELECT pp FROM ProyPartida pp WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto " +
                        "AND pp.ingEgr = :ingEgr AND pp.vigente = 'S' " +
                        "ORDER BY pp.nivel, pp.codPartidas")
        List<ProyPartida> findTodasPartidasByProyecto(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("ingEgr") String ingEgr);

        /**
         * Buscar partidas por compañía, proyecto, tipo y vigencia
         */
        List<ProyPartida> findByCodCiaAndCodPytoAndIngEgrAndVigente(
                        Long codCia, Long codPyto, String ingEgr, String vigente);

        /**
         * Verificar si existe una partida de nivel 3 en un proyecto
         */
        @Query("SELECT CASE WHEN COUNT(pp) > 0 THEN true ELSE false END FROM ProyPartida pp " +
                        "WHERE pp.codCia = :codCia AND pp.codPyto = :codPyto AND pp.ingEgr = :ingEgr " +
                        "AND pp.codPartida = :codPartida AND pp.nivel = 3 AND pp.vigente = 'S'")
        boolean existsPartidaNivel3InProyecto(
                        @Param("codCia") Long codCia,
                        @Param("codPyto") Long codPyto,
                        @Param("ingEgr") String ingEgr,
                        @Param("codPartida") Long codPartida);

        List<ProyPartida> findByCodCiaAndCodPyto(Long codCia, Long codPyto);
}
