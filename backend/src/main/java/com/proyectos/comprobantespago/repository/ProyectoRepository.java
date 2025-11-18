package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Proyecto;

/**
 * Repository para Proyecto
 */
@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Proyecto.ProyectoId> {

    List<Proyecto> findByCodCiaAndVigente(Long codCia, String vigente);

    Optional<Proyecto> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    @Query("SELECT p FROM Proyecto p WHERE p.codCia = :codCia AND p.vigente = 'S' ORDER BY p.nombPyto")
    List<Proyecto> findAllActiveByCodCia(@Param("codCia") Long codCia);

    @Query("SELECT p FROM Proyecto p WHERE p.codCia = :codCia AND p.emplJefeProy = :codEmpleado AND p.vigente = 'S'")
    List<Proyecto> findByJefeProyecto(@Param("codCia") Long codCia, @Param("codEmpleado") Long codEmpleado);

    @Query("SELECT p FROM Proyecto p WHERE p.codCia = :codCia AND p.codCliente = :codCliente AND p.vigente = 'S'")
    List<Proyecto> findByCliente(@Param("codCia") Long codCia, @Param("codCliente") Long codCliente);

    @Query("SELECT p FROM Proyecto p WHERE p.codCia = :codCia AND p.annoIni <= :anio AND p.annoFin >= :anio AND p.vigente = 'S'")
    List<Proyecto> findByAnio(@Param("codCia") Long codCia, @Param("anio") Integer anio);
}
