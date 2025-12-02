package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Entidad COMP_PAGOEMPLEADO - Comprobantes de pago a empleados
 */
@Entity
@Table(name = "COMP_PAGOEMPLEADO")
@IdClass(ComprobantePagoEmpleado.ComprobantePagoEmpleadoId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobantePagoEmpleado implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODEMPLEADO", nullable = false)
    private Long codEmpleado;

    @Id
    @NotBlank
    @Size(max = 20)
    @Column(name = "NROCP", nullable = false, length = 20)
    private String nroCp;

    @NotNull
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @NotNull
    @Column(name = "NROPAGO", nullable = false)
    private Integer nroPago;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TCOMPPAGO", nullable = false, length = 3)
    private String tCompPago;


    @Size(max = 3)
    @NotBlank
    @Column(name = "ECOMPPAGO", nullable = false, length = 3)
    private String eCompPago;

    @NotNull
    @Column(name = "FECCP", nullable = false)
    private LocalDate fecCp;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TMONEDA", nullable = false, length = 3)
    private String tMoneda;

    @Size(max = 3)
    @NotBlank
    @Column(name = "EMONEDA", nullable = false, length = 3)
    private String eMoneda;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "TIPCAMBIO", nullable = false, precision = 7, scale = 4)
    private BigDecimal tipCambio;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPMO", nullable = false, precision = 9, scale = 2)
    private BigDecimal impMo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPNETOMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impNetoMn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPIGVMN", nullable = false, precision = 9, scale = 2)
    private BigDecimal impIgvmn;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "IMPTOTALMN", nullable = false, precision = 10, scale = 2)
    private BigDecimal impTotalMn;

    @Lob
    @Column(name = "FOTOCP")
    private byte[] fotoCp;

    @Lob
    @Column(name = "FOTOABONO")
    private byte[] fotoAbono;

    @Column(name = "FECABONO")
    private LocalDate fecAbono;

    @Size(max = 1000)
    @Column(name = "DESABONO", length = 1000)
    private String desAbono;

    @NotNull
    @Column(name = "SEMILLA", nullable = false)
    private Integer semilla;

    @Size(max = 3)
    @NotBlank
    @Column(name = "TABESTADO", nullable = false, length = 3)
    private String tabEstado;

    @Size(max = 3)
    @NotBlank
    @Column(name = "CODESTADO", nullable = false, length = 3)
    private String codEstado;

    // Relaciones
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
        @JoinColumn(name = "CODEMPLEADO", referencedColumnName = "CODEMPLEADO", insertable = false, updatable = false)
    })
    private Empleado empleado;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
        @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false)
    })
    private Proyecto proyecto;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComprobantePagoEmpleadoId implements Serializable {
        private Long codCia;
        private Long codEmpleado;
        private String nroCp;
    }
}
