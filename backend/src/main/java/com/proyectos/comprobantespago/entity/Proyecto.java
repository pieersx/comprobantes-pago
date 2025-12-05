package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.Lob;
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
 * Entidad PROYECTO
 */
@Entity
@Table(name = "PROYECTO")
@IdClass(Proyecto.ProyectoId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proyecto implements Serializable {

    @Id
    @Column(name = "CODCIA", nullable = false)
    private Long codCia;

    @Id
    @Column(name = "CODPYTO", nullable = false)
    private Long codPyto;

    @NotBlank
    @Size(max = 1000)
    @Column(name = "NOMBPYTO", nullable = false, length = 1000)
    private String nombPyto;

    @NotNull
    @Column(name = "EMPLJEFEPROY", nullable = false)
    private Long emplJefeProy;

    @NotNull
    @Column(name = "CODCIA1", nullable = false)
    private Long codCia1;

    @NotNull
    @Column(name = "CIACONTRATA", nullable = false)
    private Long ciaContrata;

    @NotNull
    @Column(name = "CODCC", nullable = false)
    private Long codCc;

    @NotNull
    @Column(name = "CODCLIENTE", nullable = false)
    private Long codCliente;

    @NotBlank
    @Size(max = 1)
    @Column(name = "FLGEMPCONSORCIO", nullable = false, length = 1)
    private String flgEmpConsorcio;

    @NotBlank
    @Size(max = 10)
    @Column(name = "CODSNIP", nullable = false, length = 10)
    private String codSnip;

    @NotNull
    @Column(name = "FECREG", nullable = false)
    private LocalDate fecReg;

    @NotNull
    @Column(name = "CODFASE", nullable = false)
    private Integer codFase;

    @NotNull
    @Column(name = "CODNIVEL", nullable = false)
    private Integer codNivel;

    @NotBlank
    @Size(max = 4)
    @Column(name = "CODFUNCION", nullable = false, length = 4)
    private String codFuncion;

    @NotNull
    @Column(name = "CODSITUACION", nullable = false)
    private Integer codSituacion;

    @NotNull
    @Column(name = "NUMINFOR", nullable = false)
    private Integer numInfor;

    @NotNull
    @Column(name = "NUMINFORENTRG", nullable = false)
    private Integer numInforEntrg;

    @NotNull
    @Column(name = "ESTPYTO", nullable = false)
    private Integer estPyto;

    @NotNull
    @Column(name = "FECESTADO", nullable = false)
    private LocalDate fecEstado;

    @NotNull
    @Column(name = "VALREFER", nullable = false, precision = 12, scale = 2)
    private BigDecimal valRefer;

    @NotNull
    @Column(name = "COSTODIRECTO", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoDirecto;

    @NotNull
    @Column(name = "COSTOGGEN", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoGgen;

    @NotNull
    @Column(name = "COSTOFINAN", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoFinan;

    @NotNull
    @Column(name = "IMPUTILIDAD", nullable = false, precision = 12, scale = 2)
    private BigDecimal impUtilidad;

    @NotNull
    @Column(name = "COSTOTOTSINIGV", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoTotSinIgv;

    @NotNull
    @Column(name = "IMPIGV", nullable = false, precision = 12, scale = 2)
    private BigDecimal impIgv;

    @NotNull
    @Column(name = "COSTOTOTAL", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoTotal;

    @NotNull
    @Column(name = "COSTOPENALID", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoPenalid;

    @NotBlank
    @Size(max = 2)
    @Column(name = "CODDPTO", nullable = false, length = 2)
    private String codDpto;

    @NotBlank
    @Size(max = 2)
    @Column(name = "CODPROV", nullable = false, length = 2)
    private String codProv;

    @NotBlank
    @Size(max = 2)
    @Column(name = "CODDIST", nullable = false, length = 2)
    private String codDist;

    @NotNull
    @Column(name = "FECVIAB", nullable = false)
    private LocalDate fecViab;

    @NotBlank
    @Size(max = 300)
    @Column(name = "RUTADOC", nullable = false, length = 300)
    private String rutaDoc;

    @NotNull
    @Column(name = "ANNOINI", nullable = false)
    private Integer annoIni;

    @NotNull
    @Column(name = "ANNOFIN", nullable = false)
    private Integer annoFin;

    @NotNull
    @Column(name = "CODOBJC", nullable = false)
    private Integer codObjC;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "LOGOPROY")
    private byte[] logoProy;

    @NotBlank
    @Size(max = 3)
    @Column(name = "TABESTADO", nullable = false, length = 3)
    private String tabEstado;

    @NotBlank
    @Size(max = 3)
    @Column(name = "CODESTADO", nullable = false, length = 3)
    private String codEstado;

    @NotBlank
    @Size(max = 500)
    @Column(name = "OBSERVAC", nullable = false, length = 500)
    private String observac;

    @Builder.Default
    @Column(name = "VIGENTE", nullable = false, length = 1)
    private String vigente = "1";

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODCIA", insertable = false, updatable = false)
    private Compania compania;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
            @JoinColumn(name = "CODCLIENTE", referencedColumnName = "CODCLIENTE", insertable = false, updatable = false)
    })
    private Cliente cliente;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProyectoId implements Serializable {
        private Long codCia;
        private Long codPyto;
    }
}
