package com.proyectos.comprobantespago.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
 * Entidad VTACOMP_PAGOCAB - Comprobantes de Venta/Ingreso (Cabecera)
 */
@Entity
@Table(name = "VTACOMP_PAGOCAB")
@IdClass(VtaCompPagoCab.VtaCompPagoCabId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VtaCompPagoCab implements Serializable {

        @Id
        @Column(name = "CODCIA", nullable = false)
        private Long codCia;

        @Id
        @NotBlank
        @Size(max = 20)
        @Column(name = "NROCP", nullable = false, length = 20)
        private String nroCp;

        @NotNull
        @Column(name = "CODPYTO", nullable = false)
        private Long codPyto;

        @NotNull
        @Column(name = "CODCLIENTE", nullable = false)
        private Long codCliente;

        @NotNull
        @Column(name = "NROPAGO", nullable = false)
        private Integer nroPago;

        @NotBlank
        @Size(max = 3)
        @Column(name = "TCOMPPAGO", nullable = false, length = 3)
        private String tCompPago;

        @NotBlank
        @Size(max = 3)
        @Column(name = "ECOMPPAGO", nullable = false, length = 3)
        private String eCompPago;

        @NotNull
        @Column(name = "FECCP", nullable = false)
        private LocalDate fecCp;

        @NotBlank
        @Size(max = 3)
        @Column(name = "TMONEDA", nullable = false, length = 3)
        private String tMoneda;

        @NotBlank
        @Size(max = 3)
        @Column(name = "EMONEDA", nullable = false, length = 3)
        private String eMoneda;

        @NotNull
        @Column(name = "TIPCAMBIO", nullable = false, precision = 7, scale = 4)
        private BigDecimal tipCambio;

        @NotNull
        @Column(name = "IMPMO", nullable = false, precision = 9, scale = 2)
        private BigDecimal impMo;

        @NotNull
        @Column(name = "IMPNETOMN", nullable = false, precision = 9, scale = 2)
        private BigDecimal impNetoMn;

        @NotNull
        @Column(name = "IMPIGVMN", nullable = false, precision = 9, scale = 2)
        private BigDecimal impIgvMn;

        @NotNull
        @Column(name = "IMPTOTALMN", nullable = false, precision = 10, scale = 2)
        private BigDecimal impTotalMn;

        // BLOB fields - Lazy loading para evitar cargarlos en cada consulta
        @Lob
        @Basic(fetch = FetchType.LAZY)
        @Column(name = "FOTOCP")
        private byte[] fotoCp;

        @Lob
        @Basic(fetch = FetchType.LAZY)
        @Column(name = "FOTOABONO")
        private byte[] fotoAbono;

        @Column(name = "FECABONO")
        private LocalDate fecAbono;

        @Size(max = 500)
        @Column(name = "DESABONO", length = 500)
        private String desAbono;

        @NotNull
        @Column(name = "SEMILLA", nullable = false)
        private Integer semilla;

        @NotBlank
        @Size(max = 3)
        @Column(name = "TABESTADO", nullable = false, length = 3)
        private String tabEstado;

        @NotBlank
        @Size(max = 3)
        @Column(name = "CODESTADO", nullable = false, length = 3)
        private String codEstado;

        // Relaciones
        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumns({
                        @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
                        @JoinColumn(name = "CODCLIENTE", referencedColumnName = "CODCLIENTE", insertable = false, updatable = false)
        })
        private Cliente cliente;

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumns({
                        @JoinColumn(name = "CODCIA", referencedColumnName = "CODCIA", insertable = false, updatable = false),
                        @JoinColumn(name = "CODPYTO", referencedColumnName = "CODPYTO", insertable = false, updatable = false)
        })
        private Proyecto proyecto;

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumns({
                        @JoinColumn(name = "TMONEDA", referencedColumnName = "CODTAB", insertable = false, updatable = false),
                        @JoinColumn(name = "EMONEDA", referencedColumnName = "CODELEM", insertable = false, updatable = false)
        })
        private Elementos moneda;

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumns({
                        @JoinColumn(name = "TCOMPPAGO", referencedColumnName = "CODTAB", insertable = false, updatable = false),
                        @JoinColumn(name = "ECOMPPAGO", referencedColumnName = "CODELEM", insertable = false, updatable = false)
        })
        private Elementos tipoComprobante;

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumns({
                        @JoinColumn(name = "TABESTADO", referencedColumnName = "CODTAB", insertable = false, updatable = false),
                        @JoinColumn(name = "CODESTADO", referencedColumnName = "CODELEM", insertable = false, updatable = false)
        })
        private Elementos estado;

        /**
         * Clase interna para la clave compuesta
         */
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class VtaCompPagoCabId implements Serializable {
                private Long codCia;
                private String nroCp;
        }
}
