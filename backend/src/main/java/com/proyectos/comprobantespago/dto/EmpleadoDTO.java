package com.proyectos.comprobantespago.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad Empleado
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpleadoDTO {

    private Long codCia;
    private Long codEmpleado;

    // Campos de Persona (relación)
    private String desPersona;
    private String desCorta;

    // Campos propios de Empleado
    private String direcc;
    private String celular;
    private String hobby;
    private String dni;
    private String email;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecNac;

    private String nroCip;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecCipVig;

    private String licCond;
    private String flgEmplIea;
    private String observac;
    private Integer codCargo;
    private String vigente;

    // Foto en Base64 para transferencia (no se incluye en listados)
    private String fotoBase64;

    // Flag para indicar si tiene foto (útil para listados sin cargar la imagen)
    private Boolean tieneFoto;
}
