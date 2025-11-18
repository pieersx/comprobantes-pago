package com.proyectos.comprobantespago.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la entidad Partida
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartidaDTO {
    private Long codCia;
    private String ingEgr;
    private Long codPartida;
    private String codPartidas;
    private String desPartida;
    private String flgCC;
    private Integer nivel;
    private String tUniMed;
    private String eUniMed;
    private Integer semilla;
    private String vigente;
}
