package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad PERSONA - Personas base
 * Clase padre para Cliente, Proveedor y Empleado
 */
@Entity
@Table(name = "PERSONA")
@IdClass(Persona.PersonaId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Persona implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPERSONA", nullable = false)
    private Long codPersona;

    @NotBlank
    @Size(max = 1)
    @Column(name = "TIPPERSONA", nullable = false, length = 1)
    private String tipPersona;

    @NotBlank
    @Size(max = 100)
    @Column(name = "DESPERSONA", nullable = false, length = 100)
    private String desPersona;

    @NotBlank
    @Size(max = 30)
    @Column(name = "DESCORTA", nullable = false, length = 30)
    private String desCorta;

    @NotBlank
    @Size(max = 100)
    @Column(name = "DESCALTERNA", nullable = false, length = 100)
    private String descAlterna;

    @NotBlank
    @Size(max = 10)
    @Column(name = "DESCORTAALT", nullable = false, length = 10)
    private String desCortaAlt;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODCIA", insertable = false, updatable = false)
    private Compania compania;

    // Clase interna para clave compuesta
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonaId implements Serializable {
        private Long codCia;
        private Long codPersona;
    }
}
