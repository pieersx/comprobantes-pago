package com.proyectos.comprobantespago.repository;

import com.proyectos.comprobantespago.entity.ComprobantePagoEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComprobantePagoEmpleadoRepository extends JpaRepository<ComprobantePagoEmpleado, ComprobantePagoEmpleado.ComprobantePagoEmpleadoId> {

    // Query con fetch join para evitar LazyInitializationException
    @Query("SELECT c FROM ComprobantePagoEmpleado c " +
           "LEFT JOIN FETCH c.empleado e " +
           "LEFT JOIN FETCH e.persona " +
           "LEFT JOIN FETCH c.proyecto " +
           "WHERE c.codCia = :codCia")
    List<ComprobantePagoEmpleado> findByCodCiaWithRelations(@Param("codCia") Long codCia);

    @Query("SELECT c FROM ComprobantePagoEmpleado c " +
           "LEFT JOIN FETCH c.empleado e " +
           "LEFT JOIN FETCH e.persona " +
           "LEFT JOIN FETCH c.proyecto " +
           "WHERE c.codCia = :codCia AND c.codEmpleado = :codEmpleado")
    List<ComprobantePagoEmpleado> findByCodCiaAndCodEmpleadoWithRelations(
            @Param("codCia") Long codCia,
            @Param("codEmpleado") Long codEmpleado);

    @Query("SELECT c FROM ComprobantePagoEmpleado c " +
           "LEFT JOIN FETCH c.empleado e " +
           "LEFT JOIN FETCH e.persona " +
           "LEFT JOIN FETCH c.proyecto " +
           "WHERE c.codCia = :codCia AND c.codPyto = :codPyto")
    List<ComprobantePagoEmpleado> findByCodCiaAndCodPytoWithRelations(
            @Param("codCia") Long codCia,
            @Param("codPyto") Long codPyto);

    List<ComprobantePagoEmpleado> findByCodCia(Long codCia);

    List<ComprobantePagoEmpleado> findByCodCiaAndCodEmpleado(Long codCia, Long codEmpleado);

    List<ComprobantePagoEmpleado> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    Optional<ComprobantePagoEmpleado> findByCodCiaAndCodEmpleadoAndNroCp(Long codCia, Long codEmpleado, String nroCp);

    // Query con fetch join para findById - evita LazyInitializationException
    @Query("SELECT c FROM ComprobantePagoEmpleado c " +
           "LEFT JOIN FETCH c.empleado e " +
           "LEFT JOIN FETCH e.persona " +
           "LEFT JOIN FETCH c.proyecto " +
           "WHERE c.codCia = :codCia AND c.codEmpleado = :codEmpleado AND c.nroCp = :nroCp")
    Optional<ComprobantePagoEmpleado> findByIdWithRelations(
            @Param("codCia") Long codCia,
            @Param("codEmpleado") Long codEmpleado,
            @Param("nroCp") String nroCp);

    @Query("SELECT c FROM ComprobantePagoEmpleado c WHERE c.codCia = :codCia AND c.fecCp BETWEEN :fechaInicio AND :fechaFin")
    List<ComprobantePagoEmpleado> findByFechaRange(
            @Param("codCia") Long codCia,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT c FROM ComprobantePagoEmpleado c WHERE c.codCia = :codCia AND c.codEstado = :estado")
    List<ComprobantePagoEmpleado> findByEstado(@Param("codCia") Long codCia, @Param("estado") String estado);

    @Query("SELECT COALESCE(SUM(c.impTotalMn), 0) FROM ComprobantePagoEmpleado c WHERE c.codCia = :codCia AND c.codPyto = :codPyto")
    java.math.BigDecimal sumTotalByProyecto(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);
}
