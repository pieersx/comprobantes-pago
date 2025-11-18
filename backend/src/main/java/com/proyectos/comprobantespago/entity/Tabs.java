package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad TABS - Catálogos maestros
 */
@Entity
@Table(name = "TABS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tabs implements Serializable {

    @Id
    @Size(max = 3)
    @Column(name = "CODTAB", nullable = false, length = 3)
    private String codTab;

    @NotBlank
    @Size(max = 50)
    @Column(name = "DENTAB", nullable = false, length = 50)
    private String denTab;

    @NotBlank
    @Size(max = 10)
    @Column(name = "DENCORTA", nullable = false, length = 10)
    private String denCorta;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "S";
}
