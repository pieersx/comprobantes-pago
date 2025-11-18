package com.proyectos.comprobantespago.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.proyectos.comprobantespago.entity.AuditLog;
import com.proyectos.comprobantespago.repository.AuditLogRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para gestión de auditoría
 * Requisito 17: Autenticación y Autorización de Usuarios
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Registrar una acción en la auditoría
     */
    public void registrarAccion(String usuario, String accion, String entidad, String idEntidad,
            String descripcion, String datosAnteriores, String datosNuevos, String resultado,
            String mensajeError, Long codCia) {

        try {
            AuditLog auditLog = AuditLog.builder()
                    .usuario(usuario)
                    .accion(accion)
                    .entidad(entidad)
                    .idEntidad(idEntidad)
                    .descripcion(descripcion)
                    .datosAnteriores(datosAnteriores)
                    .datosNuevos(datosNuevos)
                    .resultado(resultado)
                    .mensajeError(mensajeError)
                    .direccionIp(obtenerDireccionIP())
                    .agenteUsuario(obtenerAgenteUsuario())
                    .fechaHora(LocalDateTime.now())
                    .codCia(codCia)
                    .build();

            auditLogRepository.save(auditLog);

            log.debug("Acción registrada en auditoría: {} - {} - {}", usuario, accion, entidad);
        } catch (Exception e) {
            log.error("Error al registrar acción en auditoría", e);
        }
    }

    /**
     * Registrar una acción exitosa
     */
    public void registrarExito(String usuario, String accion, String entidad, String idEntidad,
            String descripcion, String datosNuevos, Long codCia) {
        registrarAccion(usuario, accion, entidad, idEntidad, descripcion, null, datosNuevos, "SUCCESS", null,
                codCia);
    }

    /**
     * Registrar una acción con error
     */
    public void registrarError(String usuario, String accion, String entidad, String idEntidad,
            String descripcion, String mensajeError, Long codCia) {
        registrarAccion(usuario, accion, entidad, idEntidad, descripcion, null, null, "ERROR", mensajeError,
                codCia);
    }

    /**
     * Registrar un acceso denegado
     */
    public void registrarAccesoDenegado(String usuario, String accion, String entidad, String idEntidad,
            String descripcion, Long codCia) {
        registrarAccion(usuario, accion, entidad, idEntidad, descripcion, null, null, "DENIED",
                "Acceso denegado", codCia);
    }

    /**
     * Registrar login
     */
    public void registrarLogin(String usuario, Long codCia) {
        registrarAccion(usuario, "LOGIN", "USUARIO", usuario, "Inicio de sesión", null, null, "SUCCESS", null,
                codCia);
    }

    /**
     * Registrar logout
     */
    public void registrarLogout(String usuario, Long codCia) {
        registrarAccion(usuario, "LOGOUT", "USUARIO", usuario, "Cierre de sesión", null, null, "SUCCESS", null,
                codCia);
    }

    /**
     * Obtener registros de auditoría por usuario
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorUsuario(String usuario) {
        return auditLogRepository.findByUsuarioOrderByFechaHoraDesc(usuario);
    }

    /**
     * Obtener registros de auditoría por entidad
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorEntidad(String entidad) {
        return auditLogRepository.findByEntidadOrderByFechaHoraDesc(entidad);
    }

    /**
     * Obtener registros de auditoría por acción
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorAccion(String accion) {
        return auditLogRepository.findByAccionOrderByFechaHoraDesc(accion);
    }

    /**
     * Obtener registros de auditoría por rango de fechas
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return auditLogRepository.findByFechaRange(fechaInicio, fechaFin);
    }

    /**
     * Obtener registros de auditoría por usuario y rango de fechas
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorUsuarioYRangoFechas(String usuario, LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return auditLogRepository.findByUsuarioAndFechaRange(usuario, fechaInicio, fechaFin);
    }

    /**
     * Obtener registros de auditoría por entidad y rango de fechas
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorEntidadYRangoFechas(String entidad, LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return auditLogRepository.findByEntidadAndFechaRange(entidad, fechaInicio, fechaFin);
    }

    /**
     * Obtener registros de auditoría por resultado
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorResultado(String resultado) {
        return auditLogRepository.findByResultadoOrderByFechaHoraDesc(resultado);
    }

    /**
     * Obtener registros de auditoría por compañía
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorCompania(Long codCia) {
        return auditLogRepository.findByCodCiaOrderByFechaHoraDesc(codCia);
    }

    /**
     * Obtener registros de auditoría por compañía y rango de fechas
     */
    @Transactional(readOnly = true)
    public List<AuditLog> obtenerPorCompaniaYRangoFechas(Long codCia, LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return auditLogRepository.findByCodCiaAndFechaRange(codCia, fechaInicio, fechaFin);
    }

    /**
     * Obtener dirección IP del cliente
     */
    private String obtenerDireccionIP() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0];
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("No se pudo obtener la dirección IP", e);
        }
        return "DESCONOCIDA";
    }

    /**
     * Obtener agente de usuario
     */
    private String obtenerAgenteUsuario() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return request.getHeader("User-Agent");
            }
        } catch (Exception e) {
            log.debug("No se pudo obtener el agente de usuario", e);
        }
        return "DESCONOCIDO";
    }
}
