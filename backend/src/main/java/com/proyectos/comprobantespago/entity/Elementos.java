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
 * Entidad ELEMENTOS - Elementos de catálogos maestros
 */
@Entity
@Table(name = "ELEMENTOS")
@IdClass(Elementos.ElementosId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Elementos implements Serializable {

    @Id
    @NotBlank
    @Size(max = 3)
    @Column(name = "CODTAB", nullable = false, length = 3)
    private String codTab;

    @Id
    @NotBlank
    @Size(max = 3)
    @Column(name = "CODELEM", nullable = false, length = 3)
    private String codElem;

    @NotBlank
    @Size(max = 50)
    @Column(name = "DENELE", nullable = false, length = 50)
    private String denEle;

    @NotBlank
    @Size(max = 10)
    @Column(name = "DENCORTA", nullable = false, length = 10)
    private String denCorta;

    @NotBlank
    @Size(max = 1)
    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    // Relación con TABS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODTAB", insertable = false, updatable = false)
    private Tabs tabs;

    /**
     * Clase interna para la clave compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ElementosId implements Serializable {
        private String codTab;
        private String codElem;
    }
}
