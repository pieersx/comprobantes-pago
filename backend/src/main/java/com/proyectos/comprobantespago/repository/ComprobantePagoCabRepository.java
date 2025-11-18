package com.proyectos.comprobantespago.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.ComprobantePagoCab;

/**
 * Repository para ComprobantePagoCab
 */
@Repository
public interface ComprobantePagoCabRepository
        extends JpaRepository<ComprobantePagoCab, ComprobantePagoCab.ComprobantePagoCabId> {

    Optional<ComprobantePagoCab> findByCodCiaAndCodProveedorAndNroCp(Long codCia, Long codProveedor, String nroCp);

    List<ComprobantePagoCab> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    List<ComprobantePagoCab> findByCodCiaAndCodProveedor(Long codCia, Long codProveedor);

    List<ComprobantePagoCab> findByCodCia(Long codCia);

    @Query("SELECT c FROM ComprobantePagoCab c WHERE c.codCia = :codCia AND c.codEstado = :estado ORDER BY c.fecCp DESC")
    List<ComprobantePagoCab> findByEstado(@Param("codCia") Long codCia, @Param("estado") String estado);

    @Query("SELECT c FROM ComprobantePagoCab c WHERE c.codCia = :codCia AND c.fecCp BETWEEN :fechaInicio AND :fechaFin ORDER BY c.fecCp DESC")
    List<ComprobantePagoCab> findByFechaRange(@Param("codCia") Long codCia, @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT c FROM ComprobantePagoCab c WHERE c.codCia = :codCia AND c.codPyto = :codPyto AND EXTRACT(YEAR FROM c.fecCp) = :anio")
    List<ComprobantePagoCab> findByProyectoAndAnio(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto,
            @Param("anio") Integer anio);

    @Query("SELECT SUM(c.impTotalMn) FROM ComprobantePagoCab c WHERE c.codCia = :codCia AND c.codPyto = :codPyto AND c.codEstado = 'PAG'")
    java.math.BigDecimal getTotalPagadoByProyecto(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);
}
