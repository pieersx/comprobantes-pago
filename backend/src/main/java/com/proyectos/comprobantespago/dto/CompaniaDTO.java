package com.proyectos.comprobantespago.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Compañía
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompaniaDTO {
    
    private Long codCia;
    
    @NotBlank(message = "La descripción de la compañía es obligatoria")
    @Size(max = 100, message = "La descripción no puede exceder 100 caracteres")
    private String desCia;
    
    @NotBlank(message = "La descripción corta es obligatoria")
    @Size(max = 20, message = "La descripción corta no puede exceder 20 caracteres")
    private String desCorta;
    
    private String vigente;
}
