package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.FlujoCajaDet;

/**
 * Repository para FlujoCajaDet (detalle mensual del flujo de caja)
 */
@Repository
public interface FlujoCajaDetRepository extends JpaRepository<FlujoCajaDet, FlujoCajaDet.FlujoCajaDetId> {

    /**
     * Buscar por compañía y año
     */
    List<FlujoCajaDet> findByAnnoAndCodCia(Integer anno, Long codCia);

    /**
     * Buscar por compañía, proyecto y año
     */
    List<FlujoCajaDet> findByAnnoAndCodCiaAndCodPyto(Integer anno, Long codCia, Long codPyto);

    /**
     * Buscar por compañía, proyecto, año y tipo (I/E)
     */
    List<FlujoCajaDet> findByAnnoAndCodCiaAndCodPytoAndIngEgr(Integer anno, Long codCia, Long codPyto, String ingEgr);

    /**
     * Buscar todos los años disponibles para una compañía
     */
    @Query("SELECT DISTINCT f.anno FROM FlujoCajaDet f WHERE f.codCia = :codCia ORDER BY f.anno DESC")
    List<Integer> findDistinctAnnosByCodCia(@Param("codCia") Long codCia);

    /**
     * Buscar todos los años disponibles para un proyecto
     */
    @Query("SELECT DISTINCT f.anno FROM FlujoCajaDet f WHERE f.codCia = :codCia AND f.codPyto = :codPyto ORDER BY f.anno DESC")
    List<Integer> findDistinctAnnosByCodCiaAndCodPyto(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);

    /**
     * Buscar ordenado por orden
     */
    @Query("SELECT f FROM FlujoCajaDet f WHERE f.anno = :anno AND f.codCia = :codCia AND f.codPyto = :codPyto ORDER BY f.ingEgr, f.orden")
    List<FlujoCajaDet> findByAnnoAndCodCiaAndCodPytoOrdenado(
            @Param("anno") Integer anno,
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto);

    /**
     * Sumar totales presupuestados por año, compañía y tipo
     */
    @Query("SELECT SUM(f.impAcum) FROM FlujoCajaDet f WHERE f.anno = :anno AND f.codCia = :codCia AND f.ingEgr = :ingEgr")
    java.math.BigDecimal sumPresupuestadoByAnnoAndCodCiaAndIngEgr(
            @Param("anno") Integer anno,
            @Param("codCia") Long codCia,
            @Param("ingEgr") String ingEgr);

    /**
     * Sumar totales reales por año, compañía y tipo
     */
    @Query("SELECT SUM(f.impRealAcum) FROM FlujoCajaDet f WHERE f.anno = :anno AND f.codCia = :codCia AND f.ingEgr = :ingEgr")
    java.math.BigDecimal sumRealByAnnoAndCodCiaAndIngEgr(
            @Param("anno") Integer anno,
            @Param("codCia") Long codCia,
            @Param("ingEgr") String ingEgr);

    /**
     * Contar registros por año y proyecto
     */
    long countByAnnoAndCodCiaAndCodPyto(Integer anno, Long codCia, Long codPyto);

    /**
     * Buscar por partida específica
     */
    List<FlujoCajaDet> findByAnnoAndCodCiaAndCodPartida(Integer anno, Long codCia, Long codPartida);
}
