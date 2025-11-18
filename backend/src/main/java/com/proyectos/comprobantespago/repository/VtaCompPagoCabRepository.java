package com.proyectos.comprobantespago.repository;

import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad VTACOMP_PAGOCAB (Comprobantes de Venta/Ingreso - Cabecera)
 */
@Repository
public interface VtaCompPagoCabRepository extends JpaRepository<VtaCompPagoCab, VtaCompPagoCab.VtaCompPagoCabId> {

    /**
     * Buscar comprobantes de venta por compañía
     */
    List<VtaCompPagoCab> findByCodCia(Long codCia);

    /**
     * Buscar comprobantes de venta por proyecto
     */
    List<VtaCompPagoCab> findByCodCiaAndCodPyto(Long codCia, Long codPyto);

    /**
     * Buscar comprobantes de venta por cliente
     */
    List<VtaCompPagoCab> findByCodCiaAndCodCliente(Long codCia, Long codCliente);

    /**
     * Buscar comprobantes por rango de fechas
     */
    @Query("SELECT v FROM VtaCompPagoCab v WHERE v.codCia = :codCia " +
           "AND v.fecCp BETWEEN :fechaInicio AND :fechaFin ORDER BY v.fecCp DESC")
    List<VtaCompPagoCab> findByFechaRange(
        @Param("codCia") Long codCia,
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin);

    /**
     * Buscar comprobantes por proyecto y rango de fechas
     */
    @Query("SELECT v FROM VtaCompPagoCab v WHERE v.codCia = :codCia AND v.codPyto = :codPyto " +
           "AND v.fecCp BETWEEN :fechaInicio AND :fechaFin ORDER BY v.fecCp DESC")
    List<VtaCompPagoCab> findByProyectoAndFechas(
        @Param("codCia") Long codCia,
        @Param("codPyto") Long codPyto,
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin);

    /**
     * Calcular total de ingresos por proyecto (excluye comprobantes anulados)
     */
    @Query("SELECT SUM(v.impTotalMn) FROM VtaCompPagoCab v WHERE v.codCia = :codCia AND v.codPyto = :codPyto AND v.codEstado != 'ANU'")
    BigDecimal calcularTotalIngresosPorProyecto(@Param("codCia") Long codCia, @Param("codPyto") Long codPyto);

    /**
     * Buscar comprobantes por estado
     */
    List<VtaCompPagoCab> findByCodCiaAndTabEstadoAndCodEstado(Long codCia, String tabEstado, String codEstado);

    /**
     * Buscar comprobante por número
     */
    Optional<VtaCompPagoCab> findByCodCiaAndNroCp(Long codCia, String nroCp);

    /**
     * Obtener últimos comprobantes de venta
     */
    @Query("SELECT v FROM VtaCompPagoCab v WHERE v.codCia = :codCia ORDER BY v.fecCp DESC")
    List<VtaCompPagoCab> findUltimosComprobantes(@Param("codCia") Long codCia);
}
