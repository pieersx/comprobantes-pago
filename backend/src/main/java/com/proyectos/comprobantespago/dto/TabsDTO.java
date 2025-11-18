package com.proyectos.comprobantespago.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad TABS (Catálogos Maestros)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TabsDTO {
    
    @NotBlank(message = "El código de tabla es obligatorio")
    @Size(max = 3, message = "El código de tabla no puede exceder 3 caracteres")
    private String codTab;
    
    @NotBlank(message = "La denominación de la tabla es obligatoria")
    @Size(max = 50, message = "La denominación no puede exceder 50 caracteres")
    private String denTab;
    
    @Size(max = 10, message = "La denominación corta no puede exceder 10 caracteres")
    private String denCorta;
    
    @NotBlank(message = "El estado vigente es obligatorio")
    @Size(max = 1, message = "El estado vigente debe ser 1 carácter")
    private String vigente;
}
