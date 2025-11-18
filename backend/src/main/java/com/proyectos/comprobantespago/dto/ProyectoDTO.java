package com.proyectos.comprobantespago.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para Proyecto
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProyectoDTO {
    
    private Long codCia;
    private Long codPyto;
    
    @NotBlank(message = "El nombre del proyecto es obligatorio")
    @Size(max = 1000)
    private String nombPyto;
    
    @NotNull(message = "El jefe de proyecto es obligatorio")
    private Long emplJefeProy;
    
    private Long codCia1;
    
    @NotNull(message = "La compañía contratante es obligatoria")
    private Long ciaContrata;
    
    private Long codCc;
    
    @NotNull(message = "El cliente es obligatorio")
    private Long codCliente;
    
    private String flgEmpConsorcio;
    private String codSnip;
    
    @NotNull(message = "La fecha de registro es obligatoria")
    private LocalDate fecReg;
    
    private Integer codFase;
    private Integer codNivel;
    private String codFuncion;
    private Integer codSituacion;
    private Integer numInfor;
    private Integer numInforEntrg;
    private Integer estPyto;
    private LocalDate fecEstado;
    
    @DecimalMin(value = "0.0", message = "El valor de referencia debe ser mayor o igual a 0")
    private BigDecimal valRefer;
    
    private BigDecimal costoDirecto;
    private BigDecimal costoGgen;
    private BigDecimal costoFinan;
    private BigDecimal impUtilidad;
    private BigDecimal costoTotSinIgv;
    private BigDecimal impIgv;
    private BigDecimal costoTotal;
    private BigDecimal costoPenalid;
    
    private String codDpto;
    private String codProv;
    private String codDist;
    private LocalDate fecViab;
    private String rutaDoc;
    
    @NotNull(message = "El año de inicio es obligatorio")
    @Min(value = 2000, message = "El año de inicio debe ser mayor o igual a 2000")
    private Integer annoIni;
    
    @NotNull(message = "El año de fin es obligatorio")
    @Min(value = 2000, message = "El año de fin debe ser mayor o igual a 2000")
    private Integer annoFin;
    
    private Integer codObjC;
    private String tabEstado;
    private String codEstado;
    private String observac;
    private String vigente;
    
    // Información adicional para respuestas
    private String nombreJefeProyecto;
    private String nombreCliente;
    private String nombreCompania;
}
