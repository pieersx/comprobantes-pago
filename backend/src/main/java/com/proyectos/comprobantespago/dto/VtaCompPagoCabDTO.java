package com.proyectos.comprobantespago.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para la entidad VTACOMP_PAGOCAB (Comprobantes de Venta/Ingreso - Cabecera)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VtaCompPagoCabDTO {

    @NotNull(message = "El código de compañía es obligatorio")
    private Long codCia;

    @NotBlank(message = "El número de comprobante es obligatorio")
    @Size(max = 20, message = "El número de comprobante no puede exceder 20 caracteres")
    private String nroCp;

    @NotNull(message = "El código de proyecto es obligatorio")
    private Long codPyto;

    @NotNull(message = "El código de cliente es obligatorio")
    private Long codCliente;

    @NotNull(message = "El número de pago es obligatorio")
    private Integer nroPago;

    @NotBlank(message = "El tipo de comprobante de pago es obligatorio")
    @Size(max = 3)
    @JsonProperty("tCompPago")
    private String tCompPago;

    @NotBlank(message = "El elemento de comprobante de pago es obligatorio")
    @Size(max = 3)
    @JsonProperty("eCompPago")
    private String eCompPago;

    @NotNull(message = "La fecha del comprobante es obligatoria")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecCp;

    @NotBlank(message = "El tipo de moneda es obligatorio")
    @Size(max = 3)
    @JsonProperty("tMoneda")
    private String tMoneda;

    @NotBlank(message = "El elemento de moneda es obligatorio")
    @Size(max = 3)
    @JsonProperty("eMoneda")
    private String eMoneda;

    @NotNull(message = "El tipo de cambio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El tipo de cambio debe ser mayor que 0")
    private BigDecimal tipCambio;

    @NotNull(message = "El importe en moneda origen es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe debe ser mayor o igual a 0")
    private BigDecimal impMo;

    @NotNull(message = "El importe neto en moneda nacional es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe neto debe ser mayor o igual a 0")
    private BigDecimal impNetoMn;

    @NotNull(message = "El importe IGV en moneda nacional es obligatorio")
    @DecimalMin(value = "0.0", message = "El IGV debe ser mayor o igual a 0")
    private BigDecimal impIgvMn;

    @NotNull(message = "El importe total en moneda nacional es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe total debe ser mayor o igual a 0")
    private BigDecimal impTotalMn;

    // Campos de imagen - ahora opcionales (se manejan por endpoints separados de BLOB)
    private String fotoCp;

    private String fotoAbono;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecAbono;

    @Size(max = 1000)
    private String desAbono;

    // Flags para indicar si tiene imágenes BLOB (sin cargar los bytes)
    private Boolean tieneFotoCp;
    private Boolean tieneFotoAbono;

    private Integer semilla;

    @Size(max = 3)
    private String tabEstado;

    @Size(max = 3)
    private String codEstado;

    // Campos adicionales para información relacionada
    private String nomProyecto;
    private String nomCliente;
    private String descTipoComprobante;
    private String descMoneda;
    private String descEstado;

    // Lista de detalles
    private List<VtaCompPagoDetDTO> detalles;
}
