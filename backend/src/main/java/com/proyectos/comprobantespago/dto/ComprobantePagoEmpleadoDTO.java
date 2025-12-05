package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad ComprobantePagoEmpleado
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobantePagoEmpleadoDTO {

    // Claves primarias
    private Long codCia;
    private Long codEmpleado;
    private String nroCp;

    // Datos del comprobante
    private Long codPyto;
    private Integer nroPago;

    @JsonProperty("tCompPago")
    private String tCompPago;

    @JsonProperty("eCompPago")
    private String eCompPago;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecCp;

    @JsonProperty("tMoneda")
    private String tMoneda;

    @JsonProperty("eMoneda")
    private String eMoneda;

    private BigDecimal tipCambio;
    private BigDecimal impMo;
    private BigDecimal impNetoMn;

    @JsonProperty("impIgvMn")
    @JsonAlias({ "impIgvmn", "impigvmn" })
    private BigDecimal impIgvmn;

    private BigDecimal impTotalMn;

    // Datos de abono
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecAbono;
    private String desAbono;

    // Estado
    private Integer semilla;
    private String tabEstado;
    private String codEstado;

    // Datos relacionados (para mostrar en listados)
    private String nombreEmpleado;
    private String nombreProyecto;
    private String tipoComprobanteDesc;
    private String monedaDesc;
    private String estadoDesc;

    // Flags para indicar si tiene imágenes (sin cargar los bytes)
    private Boolean tieneFotoCp;
    private Boolean tieneFotoAbono;

    // Detalles del comprobante (partidas con importes)
    private List<ComprobantePagoEmpleadoDetDTO> detalles;
}
