package com.proyectos.comprobantespago.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.AuditLog;

/**
 * Repositorio para AuditLog
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Obtener registros de auditoría por usuario
     */
    List<AuditLog> findByUsuarioOrderByFechaHoraDesc(String usuario);

    /**
     * Obtener registros de auditoría por entidad
     */
    List<AuditLog> findByEntidadOrderByFechaHoraDesc(String entidad);

    /**
     * Obtener registros de auditoría por acción
     */
    List<AuditLog> findByAccionOrderByFechaHoraDesc(String accion);

    /**
     * Obtener registros de auditoría por rango de fechas
     */
    @Query("SELECT a FROM AuditLog a WHERE a.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fechaHora DESC")
    List<AuditLog> findByFechaRange(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener registros de auditoría por usuario y rango de fechas
     */
    @Query("SELECT a FROM AuditLog a WHERE a.usuario = :usuario AND a.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fechaHora DESC")
    List<AuditLog> findByUsuarioAndFechaRange(@Param("usuario") String usuario,
            @Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener registros de auditoría por entidad y rango de fechas
     */
    @Query("SELECT a FROM AuditLog a WHERE a.entidad = :entidad AND a.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fechaHora DESC")
    List<AuditLog> findByEntidadAndFechaRange(@Param("entidad") String entidad,
            @Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener registros de auditoría por resultado
     */
    List<AuditLog> findByResultadoOrderByFechaHoraDesc(String resultado);

    /**
     * Obtener registros de auditoría por compañía
     */
    List<AuditLog> findByCodCiaOrderByFechaHoraDesc(Long codCia);

    /**
     * Obtener registros de auditoría por compañía y rango de fechas
     */
    @Query("SELECT a FROM AuditLog a WHERE a.codCia = :codCia AND a.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fechaHora DESC")
    List<AuditLog> findByCodCiaAndFechaRange(@Param("codCia") Long codCia,
            @Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
}
