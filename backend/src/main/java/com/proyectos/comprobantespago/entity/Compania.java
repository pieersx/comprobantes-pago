package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad CIA - Compañías
 * Tabla principal para multi-tenancy
 */
@Entity
@Table(name = "CIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compania implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sec_cia")
    @SequenceGenerator(name = "sec_cia", sequenceName = "SEC_CIA", allocationSize = 1)
    private Long codCia;

    @NotBlank(message = "La descripción de la compañía es obligatoria")
    @Size(max = 100)
    @Column(name = "DESCIA", nullable = false, length = 100)
    private String desCia;

    @NotBlank(message = "La descripción corta es obligatoria")
    @Size(max = 20)
    @Column(name = "DESCORTA", nullable = false, length = 20)
    private String desCorta;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    @PrePersist
    protected void onCreate() {
        if (vigente == null) {
            vigente = "1";
        }
    }
}
