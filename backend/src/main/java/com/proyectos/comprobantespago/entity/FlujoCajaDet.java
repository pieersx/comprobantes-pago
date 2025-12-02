package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad FLUJOCAJA_DET
 * Representa el detalle mensual del flujo de caja (presupuestado vs real)
 */
@Entity
@Table(name = "FLUJOCAJA_DET")
@IdClass(FlujoCajaDet.FlujoCajaDetId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlujoCajaDet implements Serializable {

    @Id
    @Column(name = "ANNO", nullable = false)
    private Integer anno;

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @Id
    @NotBlank
    @Size(max = 1)
    @Column(name = "INGEGR", nullable = false, length = 1)
    private String ingEgr;

    @Id
    @NotBlank
    @Size(max = 1)
    @Column(name = "TIPO", nullable = false, length = 1)
    private String tipo;

    @Id
    @Column(name = "CODPARTIDA", nullable = false)
    private Long codPartida;

    @NotNull
    @Column(name = "ORDEN", nullable = false)
    private Integer orden;

    // Saldo inicial
    @NotNull
    @Builder.Default
    @Column(name = "IMPINI", nullable = false, precision = 12, scale = 2)
    private BigDecimal impIni = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALINI", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealIni = BigDecimal.ZERO;

    // Enero
    @NotNull
    @Builder.Default
    @Column(name = "IMPENE", nullable = false, precision = 12, scale = 2)
    private BigDecimal impEne = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALENE", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealEne = BigDecimal.ZERO;

    // Febrero
    @NotNull
    @Builder.Default
    @Column(name = "IMPFEB", nullable = false, precision = 12, scale = 2)
    private BigDecimal impFeb = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALFEB", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealFeb = BigDecimal.ZERO;

    // Marzo
    @NotNull
    @Builder.Default
    @Column(name = "IMPMAR", nullable = false, precision = 12, scale = 2)
    private BigDecimal impMar = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALMAR", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealMar = BigDecimal.ZERO;

    // Abril
    @NotNull
    @Builder.Default
    @Column(name = "IMPABR", nullable = false, precision = 12, scale = 2)
    private BigDecimal impAbr = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALABR", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealAbr = BigDecimal.ZERO;

    // Mayo
    @NotNull
    @Builder.Default
    @Column(name = "IMPMAY", nullable = false, precision = 12, scale = 2)
    private BigDecimal impMay = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALMAY", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealMay = BigDecimal.ZERO;

    // Junio
    @NotNull
    @Builder.Default
    @Column(name = "IMPJUN", nullable = false, precision = 12, scale = 2)
    private BigDecimal impJun = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALJUN", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealJun = BigDecimal.ZERO;

    // Julio
    @NotNull
    @Builder.Default
    @Column(name = "IMPJUL", nullable = false, precision = 12, scale = 2)
    private BigDecimal impJul = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALJUL", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealJul = BigDecimal.ZERO;

    // Agosto
    @NotNull
    @Builder.Default
    @Column(name = "IMPAGO", nullable = false, precision = 12, scale = 2)
    private BigDecimal impAgo = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALAGO", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealAgo = BigDecimal.ZERO;

    // Septiembre
    @NotNull
    @Builder.Default
    @Column(name = "IMPSEP", nullable = false, precision = 12, scale = 2)
    private BigDecimal impSep = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALSEP", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealSep = BigDecimal.ZERO;

    // Octubre
    @NotNull
    @Builder.Default
    @Column(name = "IMPOCT", nullable = false, precision = 12, scale = 2)
    private BigDecimal impOct = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALOCT", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealOct = BigDecimal.ZERO;

    // Noviembre
    @NotNull
    @Builder.Default
    @Column(name = "IMPNOV", nullable = false, precision = 12, scale = 2)
    private BigDecimal impNov = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALNOV", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealNov = BigDecimal.ZERO;

    // Diciembre
    @NotNull
    @Builder.Default
    @Column(name = "IMPDIC", nullable = false, precision = 12, scale = 2)
    private BigDecimal impDic = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALDIC", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealDic = BigDecimal.ZERO;

    // Acumulados
    @NotNull
    @Builder.Default
    @Column(name = "IMPACUM", nullable = false, precision = 12, scale = 2)
    private BigDecimal impAcum = BigDecimal.ZERO;

    @NotNull
    @Builder.Default
    @Column(name = "IMPREALACUM", nullable = false, precision = 12, scale = 2)
    private BigDecimal impRealAcum = BigDecimal.ZERO;

    // Relación con FlujoCaja cabecera
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false),
            @JoinColumn(name = "INGEGR", referencedColumnName = "INGEGR", insertable = false, updatable = false),
            @JoinColumn(name = "TIPO", referencedColumnName = "TIPO", insertable = false, updatable = false),
            @JoinColumn(name = "CODPARTIDA", referencedColumnName = "CODPARTIDA", insertable = false, updatable = false)
    })
    private FlujoCaja flujoCaja;

    /**
     * Clase para la clave primaria compuesta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlujoCajaDetId implements Serializable {
        private Integer anno;
        private Long codCia;
        private Long codPyto;
        private String ingEgr;
        private String tipo;
        private Long codPartida;
    }

    /**
     * Calcula el total presupuestado del año
     */
    public BigDecimal getTotalPresupuestado() {
        return impIni.add(impEne).add(impFeb).add(impMar)
                .add(impAbr).add(impMay).add(impJun)
                .add(impJul).add(impAgo).add(impSep)
                .add(impOct).add(impNov).add(impDic);
    }

    /**
     * Calcula el total real del año
     */
    public BigDecimal getTotalReal() {
        return impRealIni.add(impRealEne).add(impRealFeb).add(impRealMar)
                .add(impRealAbr).add(impRealMay).add(impRealJun)
                .add(impRealJul).add(impRealAgo).add(impRealSep)
                .add(impRealOct).add(impRealNov).add(impRealDic);
    }

    /**
     * Calcula la variación porcentual entre presupuesto y real
     */
    public BigDecimal getVariacionPorcentual() {
        BigDecimal presupuestado = getTotalPresupuestado();
        if (presupuestado.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal real = getTotalReal();
        return real.subtract(presupuestado)
                .divide(presupuestado, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }
}
