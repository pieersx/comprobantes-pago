package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad Proveedor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorDTO {
    private Long codCia;
    private Long codProveedor;
    private String nroRuc;
    private String vigente;

    // Campos de Persona (relación)
    private String desPersona;
    private String desCorta;
    private String descAlterna;
    private String desCortaAlt;
}
