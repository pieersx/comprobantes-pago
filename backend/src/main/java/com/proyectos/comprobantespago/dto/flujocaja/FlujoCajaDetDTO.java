package com.proyectos.comprobantespago.dto.flujocaja;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para FlujoCajaDet (detalle mensual)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCajaDetDTO {

    @NotNull(message = "El año es requerido")
    private Integer anno;

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

    @NotNull(message = "El orden es requerido")
    private Integer orden;

    // Valores presupuestados por mes
    @Builder.Default
    private BigDecimal impIni = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impEne = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impFeb = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impMar = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impAbr = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impMay = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impJun = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impJul = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impAgo = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impSep = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impOct = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impNov = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impDic = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impAcum = BigDecimal.ZERO;

    // Valores reales por mes
    @Builder.Default
    private BigDecimal impRealIni = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealEne = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealFeb = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealMar = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealAbr = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealMay = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealJun = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealJul = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealAgo = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealSep = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealOct = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealNov = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealDic = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal impRealAcum = BigDecimal.ZERO;

    // Campos calculados (solo para respuesta)
    private BigDecimal totalPresupuestado;
    private BigDecimal totalReal;
    private BigDecimal variacion;
    private BigDecimal variacionPorcentual;

    // Información adicional
    private String desConcepto;
    private String tipoDescripcion;
}
