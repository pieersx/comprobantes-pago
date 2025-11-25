package com.proyectos.comprobantespago.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar una partida en estructura de árbol jerárquico
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartidaTreeNode {

    /**
     * Código de la partida
     */
    private Long codPartida;

    /**
     * Descripción de la partida
     */
    private String desPartida;

    /**
     * Nivel en la jerarquía (1=raíz, 2=categoría, 3=detalle)
     */
    private Integer nivel;

    /**
     * Código de la partida padre (null si es raíz)
     */
    private Long padCodPartida;

    /**
     * Ruta completa desde la raíz hasta esta partida
     * Ejemplo: "Ingresos > Ventas > Servicios Técnicos"
     */
    private String fullPath;

    /**
     * Indica si es una partida hoja (sin hijos)
     * Solo las partidas hoja pueden usarse en comprobantes
     */
    private boolean isLeaf;

    /**
     * Indica si la partida es seleccionable en comprobantes
     * Solo las partidas de nivel 3 son seleccionables
     */
    private boolean selectable;

    /**
     * Lista de partidas hijas
     */
    @Builder.Default
    private List<PartidaTreeNode> children = new ArrayList<>();

    /**
     * Orden de visualización dentro del nivel
     */
    private Integer orden;

    /**
     * Código alfanumérico de la partida
     */
    private String codPartidas;
}
