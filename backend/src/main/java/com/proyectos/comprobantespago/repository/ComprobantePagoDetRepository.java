package com.proyectos.comprobantespago.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.ComprobantePagoDet;

/**
 * Repository para ComprobantePagoDet
 */
@Repository
public interface ComprobantePagoDetRepository
                extends JpaRepository<ComprobantePagoDet, ComprobantePagoDet.ComprobantePagoDetId> {

        List<ComprobantePagoDet> findByCodCiaAndCodProveedorAndNroCp(Long codCia, Long codProveedor, String nroCp);

        List<ComprobantePagoDet> findByCodCiaAndIngEgrAndCodPartida(Long codCia, String ingEgr, Long codPartida);

        @Query("SELECT d FROM ComprobantePagoDet d WHERE d.codCia = :codCia AND d.codProveedor = :codProveedor AND d.nroCp = :nroCp ORDER BY d.sec")
        List<ComprobantePagoDet> findDetallesByComprobante(@Param("codCia") Long codCia,
                        @Param("codProveedor") Long codProveedor, @Param("nroCp") String nroCp);

        @Query("SELECT d FROM ComprobantePagoDet d LEFT JOIN FETCH d.partida WHERE d.codCia = :codCia AND d.codProveedor = :codProveedor AND d.nroCp = :nroCp ORDER BY d.sec")
        List<ComprobantePagoDet> findDetallesByComprobanteWithPartida(@Param("codCia") Long codCia,
                        @Param("codProveedor") Long codProveedor, @Param("nroCp") String nroCp);

        @Query("SELECT SUM(d.impTotalMn) FROM ComprobantePagoDet d WHERE d.codCia = :codCia AND d.codProveedor = :codProveedor AND d.nroCp = :nroCp")
        java.math.BigDecimal getTotalByComprobante(@Param("codCia") Long codCia,
                        @Param("codProveedor") Long codProveedor,
                        @Param("nroCp") String nroCp);

        void deleteByCodCiaAndCodProveedorAndNroCp(Long codCia, Long codProveedor, String nroCp);

        @Modifying
        @Query("DELETE FROM ComprobantePagoDet d WHERE d.codCia = :codCia AND d.codProveedor = :codProveedor AND d.nroCp = :nroCp")
        void deleteByComprobante(@Param("codCia") Long codCia, @Param("codProveedor") Long codProveedor,
                        @Param("nroCp") String nroCp);
}
