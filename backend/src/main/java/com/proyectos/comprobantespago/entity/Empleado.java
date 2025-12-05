package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad EMPLEADO - Datos extendidos de empleados (extiende PERSONA)
 */
@Entity
@Table(name = "EMPLEADO")
@IdClass(Empleado.EmpleadoId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empleado implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODEMPLEADO", nullable = false)
    private Long codEmpleado;

    @NotBlank
    @Size(max = 100)
    @Column(name = "DIRECC", nullable = false, length = 100)
    private String direcc;

    @NotBlank
    @Size(max = 33)
    @Column(name = "CELULAR", nullable = false, length = 33)
    private String celular;

    @Size(max = 2000)
    @Column(name = "HOBBY", length = 2000)
    private String hobby;

    @Lob
    @Column(name = "FOTO")
    private byte[] foto;

    @NotNull
    @Column(name = "FECNAC", nullable = false)
    private LocalDate fecNac;

    @NotBlank
    @Size(max = 20)
    @Column(name = "DNI", nullable = false, length = 20)
    private String dni;

    @Size(max = 10)
    @Column(name = "NROCIP", length = 10)
    private String nroCip;

    @Column(name = "FECCIPVIG")
    private LocalDate fecCipVig;

    @Size(max = 1)
    @Column(name = "LICCOND", length = 1)
    private String licCond;

    @Size(max = 1)
    @Column(name = "FLGEMPLIEA", length = 1)
    private String flgEmplIea;

    @Size(max = 300)
    @Column(name = "OBSERVAC", length = 300)
    private String observac;

    @Column(name = "CODCARGO")
    private Integer codCargo;

    @Size(max = 100)
    @Column(name = "EMAIL", length = 100)
    private String email;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    // Relación con Persona
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODEMPLEADO", referencedColumnName = "CODPERSONA", insertable = false, updatable = false)
    })
    private Persona persona;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmpleadoId implements Serializable {
        private Long codCia;
        private Long codEmpleado;
    }
}
