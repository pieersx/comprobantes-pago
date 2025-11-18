package com.proyectos.comprobantespago.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Comprobante de Pago (Cabecera + Detalle)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComprobantePagoDTO {

    // Método de debugging para verificar valores
    public void printDebugInfo() {
        System.out.println("=== DEBUG ComprobantePagoDTO ===");
        System.out.println("tCompPago: " + this.tCompPago);
        System.out.println("eCompPago: " + this.eCompPago);
        System.out.println("tMoneda: " + this.tMoneda);
        System.out.println("eMoneda: " + this.eMoneda);
        System.out.println("================================");
    }

    // Cabecera
    @NotNull
    private Long codCia;

    @NotNull(message = "El proveedor es obligatorio")
    private Long codProveedor;

    @NotBlank(message = "El número de comprobante es obligatorio")
    @Size(max = 20)
    private String nroCp;

    @NotNull(message = "El proyecto es obligatorio")
    private Long codPyto;

    @NotNull
    private Integer nroPago;

    @NotBlank(message = "El tipo de comprobante es obligatorio")
    @JsonProperty("tCompPago")
    private String tCompPago;

    // Getters y setters explícitos para evitar problemas con Lombok
    public String getTCompPago() {
        return tCompPago;
    }

    public void setTCompPago(String tCompPago) {
        this.tCompPago = tCompPago;
    }

    @NotBlank(message = "El elemento de comprobante es obligatorio")
    @JsonProperty("eCompPago")
    private String eCompPago;

    public String getECompPago() {
        return eCompPago;
    }

    public void setECompPago(String eCompPago) {
        this.eCompPago = eCompPago;
    }

    @NotNull(message = "La fecha del comprobante es obligatoria")
    private LocalDate fecCp;

    @NotBlank(message = "El tipo de moneda es obligatorio")
    @JsonProperty("tMoneda")
    private String tMoneda;

    public String getTMoneda() {
        return tMoneda;
    }

    public void setTMoneda(String tMoneda) {
        this.tMoneda = tMoneda;
    }

    @NotBlank(message = "El elemento de moneda es obligatorio")
    @JsonProperty("eMoneda")
    private String eMoneda;

    public String getEMoneda() {
        return eMoneda;
    }

    public void setEMoneda(String eMoneda) {
        this.eMoneda = eMoneda;
    }

    @DecimalMin(value = "0.0", message = "El tipo de cambio debe ser mayor a 0")
    private BigDecimal tipCambio;

    @NotNull
    @DecimalMin(value = "0.0", message = "El importe en moneda de origen debe ser mayor o igual a 0")
    private BigDecimal impMo;

    @NotNull(message = "El importe neto es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe neto debe ser mayor o igual a 0")
    private BigDecimal impNetoMn;

    @DecimalMin(value = "0.0", message = "El IGV debe ser mayor o igual a 0")
    private BigDecimal impIgvMn;

    @NotNull(message = "El importe total es obligatorio")
    @DecimalMin(value = "0.0", message = "El importe total debe ser mayor o igual a 0")
    private BigDecimal impTotalMn;

    @NotBlank
    private String fotoCp;

    @NotBlank
    private String fotoAbono;

    @NotNull
    private LocalDate fecAbono;

    @NotBlank
    private String desAbono;

    @NotNull
    private Integer semilla;

    @NotBlank
    private String tabEstado;

    @NotBlank
    private String codEstado;

    // Información adicional
    private String nombreProveedor;
    private String nombreProyecto;
    private String descripcionEstado;
    private String descripcionTipoComprobante;
    private String descripcionMoneda;

    // Detalle
    @NotEmpty(message = "Debe incluir al menos un detalle")
    @NotEmpty(message = "Debe incluir al menos un detalle")
    private List<@Valid ComprobantePagoDetalleDTO> detalles;
}
