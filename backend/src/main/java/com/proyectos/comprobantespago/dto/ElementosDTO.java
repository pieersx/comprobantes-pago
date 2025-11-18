package com.proyectos.comprobantespago.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad ELEMENTOS (Elementos de Catálogos)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElementosDTO {
    
    @NotBlank(message = "El código de tabla es obligatorio")
    @Size(max = 3, message = "El código de tabla no puede exceder 3 caracteres")
    private String codTab;
    
    @NotBlank(message = "El código de elemento es obligatorio")
    @Size(max = 3, message = "El código de elemento no puede exceder 3 caracteres")
    private String codElem;
    
    @NotBlank(message = "La denominación del elemento es obligatoria")
    @Size(max = 50, message = "La denominación no puede exceder 50 caracteres")
    private String denEle;
    
    @Size(max = 10, message = "La denominación corta no puede exceder 10 caracteres")
    private String denCorta;
    
    @NotBlank(message = "El estado vigente es obligatorio")
    @Size(max = 1, message = "El estado vigente debe ser 1 carácter")
    private String vigente;
    
    private String denTab; // Para mostrar la descripción de la tabla
}
