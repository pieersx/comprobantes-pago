package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.ComprobantePagoEmpleadoDet;

/**
 * Repository para ComprobantePagoEmpleadoDet
 */
@Repository
public interface ComprobantePagoEmpleadoDetRepository
                extends
                JpaRepository<ComprobantePagoEmpleadoDet, ComprobantePagoEmpleadoDet.ComprobantePagoEmpleadoDetId> {

        /**
         * Buscar detalles por comprobante
         */
        List<ComprobantePagoEmpleadoDet> findByCodCiaAndCodEmpleadoAndNroCp(Long codCia, Long codEmpleado,
                        String nroCp);

        /**
         * Buscar detalles por partida
         */
        List<ComprobantePagoEmpleadoDet> findByCodCiaAndIngEgrAndCodPartida(Long codCia, String ingEgr,
                        Long codPartida);

        /**
         * Buscar detalles ordenados por secuencia (con partida cargada)
         */
        @Query("SELECT d FROM ComprobantePagoEmpleadoDet d " +
                        "LEFT JOIN FETCH d.partida " +
                        "WHERE d.codCia = :codCia AND d.codEmpleado = :codEmpleado AND d.nroCp = :nroCp " +
                        "ORDER BY d.sec")
        List<ComprobantePagoEmpleadoDet> findDetallesByComprobante(
                        @Param("codCia") Long codCia,
                        @Param("codEmpleado") Long codEmpleado,
                        @Param("nroCp") String nroCp);

        /**
         * Obtener el total del comprobante sumando los detalles
         */
        @Query("SELECT SUM(d.impTotalMn) FROM ComprobantePagoEmpleadoDet d WHERE d.codCia = :codCia AND d.codEmpleado = :codEmpleado AND d.nroCp = :nroCp")
        java.math.BigDecimal getTotalByComprobante(
                        @Param("codCia") Long codCia,
                        @Param("codEmpleado") Long codEmpleado,
                        @Param("nroCp") String nroCp);

        /**
         * Obtener el siguiente número de secuencia
         */
        @Query("SELECT COALESCE(MAX(d.sec), 0) + 1 FROM ComprobantePagoEmpleadoDet d WHERE d.codCia = :codCia AND d.codEmpleado = :codEmpleado AND d.nroCp = :nroCp")
        Integer getNextSec(
                        @Param("codCia") Long codCia,
                        @Param("codEmpleado") Long codEmpleado,
                        @Param("nroCp") String nroCp);

        /**
         * Eliminar detalles por comprobante
         */
        void deleteByCodCiaAndCodEmpleadoAndNroCp(Long codCia, Long codEmpleado, String nroCp);

        /**
         * Eliminar detalles por comprobante (query)
         */
        @Modifying
        @Query("DELETE FROM ComprobantePagoEmpleadoDet d WHERE d.codCia = :codCia AND d.codEmpleado = :codEmpleado AND d.nroCp = :nroCp")
        void deleteByComprobante(
                        @Param("codCia") Long codCia,
                        @Param("codEmpleado") Long codEmpleado,
                        @Param("nroCp") String nroCp);

        /**
         * Contar detalles por comprobante
         */
        long countByCodCiaAndCodEmpleadoAndNroCp(Long codCia, Long codEmpleado, String nroCp);
}
