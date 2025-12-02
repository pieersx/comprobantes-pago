package com.proyectos.comprobantespago.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
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
 * Entidad PROVEEDOR
 */
@Entity
@Table(name = "PROVEEDOR")
@IdClass(Proveedor.ProveedorId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proveedor implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPROVEEDOR", nullable = false)
    private Long codProveedor;

    @NotBlank
    @Size(max = 20)
    @Column(name = "NRORUC", nullable = false, length = 20)
    private String nroRuc;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPROVEEDOR", referencedColumnName = "CODPERSONA", insertable = false, updatable = false)
    })
    private Persona persona;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProveedorId implements Serializable {
        private Long codCia;
        private Long codProveedor;
    }
}
