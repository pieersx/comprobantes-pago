package com.proyectos.comprobantespago.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad para registrar auditoría de acciones del sistema
 * Requisito 17: Autenticación y Autorización de Usuarios
 */
@Entity
@Table(name = "AUDIT_LOG")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "audit_log_seq")
    @SequenceGenerator(name = "audit_log_seq", sequenceName = "SEQ_AUDIT_LOG", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USUARIO", nullable = false, length = 100)
    private String usuario;

    @Column(name = "ACCION", nullable = false, length = 50)
    private String accion; // CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT

    @Column(name = "ENTIDAD", nullable = false, length = 100)
    private String entidad; // Nombre de la entidad afectada

    @Column(name = "ID_ENTIDAD", length = 255)
    private String idEntidad; // ID de la entidad afectada

    @Column(name = "DESCRIPCION", length = 500)
    private String descripcion;

    @Column(name = "DATOS_ANTERIORES", length = 4000)
    private String datosAnteriores; // JSON con datos anteriores (para UPDATE)

    @Column(name = "DATOS_NUEVOS", length = 4000)
    private String datosNuevos; // JSON con datos nuevos

    @Column(name = "RESULTADO", nullable = false, length = 20)
    private String resultado; // SUCCESS, ERROR, DENIED

    @Column(name = "MENSAJE_ERROR", length = 500)
    private String mensajeError;

    @Column(name = "DIRECCION_IP", length = 50)
    private String direccionIp;

    @Column(name = "AGENTE_USUARIO", length = 500)
    private String agenteUsuario;

    @Column(name = "FECHA_HORA", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "CODIGO_CIA", nullable = false)
    private Long codCia;
}
