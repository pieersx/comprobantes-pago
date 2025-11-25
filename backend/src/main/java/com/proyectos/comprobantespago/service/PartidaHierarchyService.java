package com.proyectos.comprobantespago.service;

import java.util.List;

import com.proyectos.comprobantespago.dto.PartidaDTO;
import com.proyectos.comprobantespago.dto.PartidaTreeNode;

/**
 * Servicio para manejar la jerarquía de partidas
 */
public interface PartidaHierarchyService {

    /**
     * Construir árbol jerárquico de partidas
     */
    List<PartidaTreeNode> buildPartidaTree(Long codCia, String ingEgr);

    /**
     * Obtener partidas del último nivel (hojas del árbol)
     * - Ingresos: nivel 2
     * - Egresos: nivel 3
     */
    List<PartidaDTO> getLeafPartidas(Long codCia, String ingEgr, Long codProyecto);

    /**
     * Obtener ruta completa de una partida
     */
    String getFullPath(Long codCia, String ingEgr, Long codPartida);

    /**
     * Obtener partidas de nivel 3 (último nivel) para un proyecto
     * Solo estas partidas se pueden usar en comprobantes
     */
    List<PartidaDTO> getLevel3PartidasByProyecto(Long codCia, Long codPyto, String ingEgr);

    /**
     * Obtener TODAS las partidas (niveles 1, 2 y 3) para un proyecto
     * Nuevo requerimiento: El usuario puede seleccionar cualquier nivel
     */
    List<PartidaDTO> getAllPartidasByProyecto(Long codCia, Long codPyto, String ingEgr);

    /**
     * Validar que una partida sea de nivel 3
     */
    boolean isLevel3Partida(Long codCia, String ingEgr, Long codPartida);

    /**
     * Obtener información del padre de una partida
     */
    PartidaDTO getParentPartida(Long codCia, String ingEgr, Long codPartida);

    /**
     * Validar nivel de partida según tipo
     */
    void validatePartidaLevel(Long codCia, String ingEgr, Integer nivel, Long padCodPartida);

    /**
     * Validar que una partida sea del último nivel para comprobantes
     */
    boolean validatePartidaForComprobante(Long codCia, String ingEgr, Long codPartida);

    /**
     * Calcular nivel de una partida
     */
    Integer calculateLevel(Long codCia, String ingEgr, Long padCodPartida);

    /**
     * Obtener partidas del último nivel (compatibilidad con Integer)
     */
    List<PartidaDTO> obtenerPartidasUltimoNivel(Integer codCia, Integer codPyto, String ingEgr);

    /**
     * Verificar si es partida del último nivel (compatibilidad con Integer)
     */
    boolean esPartidaUltimoNivel(Integer codCia, Integer codPyto, Integer codPartida, String ingEgr);

    /**
     * Obtener árbol de partidas (compatibilidad con Integer)
     */
    List<PartidaTreeNode> obtenerArbolPartidas(Integer codCia, Integer codPyto, String ingEgr);

    /**
     * Calcular total del padre
     */
    java.math.BigDecimal calculateParentTotal(Long codCia, String ingEgr, Long codPartida);
}
