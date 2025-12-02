package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.FlujoCaja;

/**
 * Repository para FlujoCaja
 */
@Repository
public interface FlujoCajaRepository extends JpaRepository<FlujoCaja, FlujoCaja.FlujoCajaId> {

    /**
     * Buscar por compañía
     */
    List<FlujoCaja> findByCodCia(Long codCia);

    /**
     * Buscar por compañía y proyecto
     */
    List<FlujoCaja> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    /**
     * Buscar por compañía, proyecto y tipo (I=Ingreso, E=Egreso)
     */
    List<FlujoCaja> findByCodCiaAndCodPytoAndIngEgr(Long codCia, Long codPyto, String ingEgr);

    /**
     * Buscar por compañía y tipo de ingreso/egreso
     */
    List<FlujoCaja> findByCodCiaAndIngEgr(Long codCia, String ingEgr);

    /**
     * Buscar solo los vigentes
     */
    List<FlujoCaja> findByCodCiaAndVigente(Long codCia, String vigente);

    /**
     * Buscar por compañía, proyecto y vigente
     */
    List<FlujoCaja> findByCodCiaAndCodPytoAndVigente(Long codCia, Long codPyto, String vigente);

    /**
     * Buscar por nivel (para agrupar jerárquicamente)
     */
    List<FlujoCaja> findByCodCiaAndCodPytoAndNivel(Long codCia, Long codPyto, Integer nivel);

    /**
     * Buscar ordenado por orden
     */
    @Query("SELECT f FROM FlujoCaja f WHERE f.codCia = :codCia AND f.codPyto = :codPyto ORDER BY f.ingEgr, f.orden")
    List<FlujoCaja> findByCodCiaAndCodPytoOrdenado(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);

    /**
     * Contar por proyecto
     */
    long countByCodCiaAndCodPyto(Long codCia, Long codPyto);

    /**
     * Buscar flujos de caja por partida
     */
    List<FlujoCaja> findByCodCiaAndCodPartida(Long codCia, Long codPartida);
}
