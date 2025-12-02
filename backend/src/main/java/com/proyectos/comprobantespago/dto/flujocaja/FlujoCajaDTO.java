package com.proyectos.comprobantespago.dto.flujocaja;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para FlujoCaja (cabecera)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCajaDTO {

    @NotNull(message = "El código de compañía es requerido")
    private Long codCia;

    @NotNull(message = "El código de proyecto es requerido")
    private Long codPyto;

    @NotBlank(message = "El tipo ingreso/egreso es requerido")
    @Size(max = 1, message = "El tipo ingreso/egreso debe tener máximo 1 caracter")
    private String ingEgr;

    @NotBlank(message = "El tipo es requerido")
    @Size(max = 1, message = "El tipo debe tener máximo 1 caracter")
    private String tipo;

    @NotNull(message = "El código de partida es requerido")
    private Long codPartida;

    @NotNull(message = "El nivel es requerido")
    private Integer nivel;

    @NotNull(message = "El orden es requerido")
    private Integer orden;

    @NotBlank(message = "La descripción del concepto es requerida")
    @Size(max = 30, message = "La descripción debe tener máximo 30 caracteres")
    private String desConcepto;

    @NotBlank(message = "La descripción corta es requerida")
    @Size(max = 10, message = "La descripción corta debe tener máximo 10 caracteres")
    private String desConceptoCorto;

    private Integer semilla;
    private Integer raiz;
    private String tabEstado;
    private String codEstado;

    @Builder.Default
    private String vigente = "1";

    // Información adicional para la respuesta
    private String nombreProyecto;
    private String nombrePartida;
    private String tipoDescripcion; // "Ingreso" o "Egreso"
}
