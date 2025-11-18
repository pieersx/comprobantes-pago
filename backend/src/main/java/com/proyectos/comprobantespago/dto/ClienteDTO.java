package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad Cliente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long codCia;
    private Long codCliente;
    private String nroRuc;
    private String vigente;

    // Campos de Persona (relación)
    private String desPersona;
    private String desCorta;
    private String descAlterna;
    private String desCortaAlt;
}
