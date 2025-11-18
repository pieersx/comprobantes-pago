package com.proyectos.comprobantespago.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.VtaCompPagoDet;

/**
 * Repositorio para la entidad VTACOMP_PAGODET (Detalle de Comprobantes de
 * Venta/Ingreso)
 */
@Repository
public interface VtaCompPagoDetRepository extends JpaRepository<VtaCompPagoDet, VtaCompPagoDet.VtaCompPagoDetId> {

    /**
     * Buscar detalles de un comprobante específico
     */
    List<VtaCompPagoDet> findByCodCiaAndNroCpOrderBySec(Long codCia, String nroCp);

    /**
     * Buscar detalles por tipo de partida (Ingreso/Egreso)
     */
    List<VtaCompPagoDet> findByCodCiaAndNroCpAndIngEgr(Long codCia, String nroCp, String ingEgr);

    /**
     * Calcular total del detalle de un comprobante
     */
    @Query("SELECT SUM(vd.impTotalMn) FROM VtaCompPagoDet vd WHERE vd.codCia = :codCia AND vd.nroCp = :nroCp")
    BigDecimal calcularTotalDetalle(@Param("codCia") Long codCia, @Param("nroCp") String nroCp);

    /**
     * Contar líneas de detalle de un comprobante
     */
    Long countByCodCiaAndNroCp(Long codCia, String nroCp);

    /**
     * Obtener próximo número de secuencia
     */
    @Query("SELECT COALESCE(MAX(vd.sec), 0) + 1 FROM VtaCompPagoDet vd WHERE vd.codCia = :codCia AND vd.nroCp = :nroCp")
    Integer obtenerProximoSec(@Param("codCia") Long codCia, @Param("nroCp") String nroCp);

    /**
     * Busca detalles por compañía, tipo de ingreso/egreso y partida
     * Usado para calcular presupuesto ejecutado de ingresos
     */
    List<VtaCompPagoDet> findByCodCiaAndIngEgrAndCodPartida(Long codCia, String ingEgr, Long codPartida);
}
