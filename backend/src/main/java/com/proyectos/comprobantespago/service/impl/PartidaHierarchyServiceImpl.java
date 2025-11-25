package com.proyectos.comprobantespago.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.PartidaDTO;
import com.proyectos.comprobantespago.dto.PartidaTreeNode;
import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.entity.PartidaMezcla;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.repository.PartidaMezclaRepository;
import com.proyectos.comprobantespago.repository.PartidaRepository;
import com.proyectos.comprobantespago.repository.ProyPartidaRepository;
import com.proyectos.comprobantespago.service.PartidaHierarchyService;

import lombok.RequiredArgsConstructor;

/**
 * Implementación del servicio de jerarquía de partidas
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PartidaHierarchyServiceImpl implements PartidaHierarchyService {

    private final PartidaRepository partidaRepository;
    private final PartidaMezclaRepository partidaMezclaRepository;
    private final ProyPartidaRepository proyPartidaRepository;

    // Constantes para límites de niveles
    private static final int MAX_NIVEL_INGRESO = 2;
    private static final int MAX_NIVEL_EGRESO = 3;
    private static final String TIPO_INGRESO = "I";
    private static final String TIPO_EGRESO = "E";

    @Override
    public List<PartidaTreeNode> buildPartidaTree(Long codCia, String ingEgr) {
        // Obtener todas las partidas
        List<Partida> partidas = partidaRepository.findByCodCiaAndIngEgrAndVigente(codCia, ingEgr, "S");

        // Obtener todas las relaciones de jerarquía desde PartidaMezcla
        List<PartidaMezcla> mezclas = partidaMezclaRepository.findByCodCiaAndIngEgrAndVigente(codCia, ingEgr, "S");

        // Crear mapa de partidas por código para acceso rápido
        Map<Long, Partida> partidaMap = partidas.stream()
                .collect(Collectors.toMap(Partida::getCodPartida, p -> p));

        // Crear mapa de nodos del árbol
        Map<Long, PartidaTreeNode> nodeMap = new HashMap<>();

        // Crear nodos para todas las partidas
        for (Partida partida : partidas) {
            PartidaTreeNode node = PartidaTreeNode.builder()
                    .codPartida(partida.getCodPartida())
                    .desPartida(partida.getDesPartida())
                    .nivel(partida.getNivel())
                    .codPartidas(partida.getCodPartidas())
                    .children(new ArrayList<>())
                    .isLeaf(true) // Asumimos que es hoja hasta que encontremos hijos
                    .build();
            nodeMap.put(partida.getCodPartida(), node);
        }

        // Construir relaciones padre-hijo usando PartidaMezcla
        Map<Long, List<Long>> parentChildMap = new HashMap<>();
        for (PartidaMezcla mezcla : mezclas) {
            Long childCode = mezcla.getCodPartida();
            Long parentCode = mezcla.getPadCodPartida();

            // Si el padre es diferente del hijo (no es raíz)
            if (!childCode.equals(parentCode)) {
                parentChildMap.computeIfAbsent(parentCode, k -> new ArrayList<>()).add(childCode);
            }
        }

        // Establecer relaciones y marcar nodos que no son hojas
        for (Map.Entry<Long, List<Long>> entry : parentChildMap.entrySet()) {
            Long parentCode = entry.getKey();
            List<Long> childCodes = entry.getValue();

            PartidaTreeNode parentNode = nodeMap.get(parentCode);
            if (parentNode != null) {
                parentNode.setLeaf(false); // Tiene hijos, no es hoja

                for (Long childCode : childCodes) {
                    PartidaTreeNode childNode = nodeMap.get(childCode);
                    if (childNode != null) {
                        childNode.setPadCodPartida(parentCode);
                        parentNode.getChildren().add(childNode);
                    }
                }

                // Ordenar hijos por orden
                parentNode.getChildren().sort((a, b) -> {
                    Integer ordenA = getOrdenFromMezcla(mezclas, a.getCodPartida());
                    Integer ordenB = getOrdenFromMezcla(mezclas, b.getCodPartida());
                    return ordenA.compareTo(ordenB);
                });
            }
        }

        // Generar rutas completas para todos los nodos
        for (PartidaTreeNode node : nodeMap.values()) {
            node.setFullPath(buildFullPath(node, nodeMap));
        }

        // Retornar solo los nodos raíz (nivel 1 o sin padre)
        return nodeMap.values().stream()
                .filter(node -> node.getNivel() == 1 || node.getPadCodPartida() == null)
                .sorted((a, b) -> {
                    Integer ordenA = getOrdenFromMezcla(mezclas, a.getCodPartida());
                    Integer ordenB = getOrdenFromMezcla(mezclas, b.getCodPartida());
                    return ordenA.compareTo(ordenB);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<PartidaDTO> getLeafPartidas(Long codCia, String ingEgr, Long codProyecto) {
        // Según las notas del profesor:
        // - Ingresos: solo partidas de nivel 2 (último nivel)
        // - Egresos: solo partidas de nivel 3 (último nivel)
        int nivelRequerido = TIPO_INGRESO.equalsIgnoreCase(ingEgr) ? MAX_NIVEL_INGRESO : MAX_NIVEL_EGRESO;

        List<PartidaTreeNode> tree = buildPartidaTree(codCia, ingEgr);
        List<PartidaDTO> leafPartidas = new ArrayList<>();

        // Filtrar solo partidas del último nivel
        collectLeafNodesAtLevel(tree, leafPartidas, nivelRequerido);

        return leafPartidas;
    }

    @Override
    public String getFullPath(Long codCia, String ingEgr, Long codPartida) {
        Partida partida = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, codPartida))
                .orElseThrow(() -> new ResourceNotFoundException("Partida no encontrada"));

        List<String> pathParts = new ArrayList<>();
        pathParts.add(partida.getDesPartida());

        // Buscar padres recursivamente
        Long currentParentCode = findParentCode(codCia, ingEgr, codPartida);
        while (currentParentCode != null && !currentParentCode.equals(codPartida)) {
            Partida parent = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, currentParentCode))
                    .orElse(null);
            if (parent != null) {
                pathParts.add(0, parent.getDesPartida());
                codPartida = currentParentCode;
                currentParentCode = findParentCode(codCia, ingEgr, currentParentCode);
            } else {
                break;
            }
        }

        return String.join(" > ", pathParts);
    }

    @Override
    public void validatePartidaLevel(Long codCia, String ingEgr, Integer nivel, Long padCodPartida) {
        int maxNivel = TIPO_INGRESO.equalsIgnoreCase(ingEgr) ? MAX_NIVEL_INGRESO : MAX_NIVEL_EGRESO;

        if (nivel > maxNivel) {
            String tipoDesc = TIPO_INGRESO.equalsIgnoreCase(ingEgr) ? "Ingreso" : "Egreso";
            throw new IllegalArgumentException(
                    String.format("Las partidas de tipo %s no pueden tener más de %d niveles", tipoDesc, maxNivel));
        }
    }

    /**
     * Valida que una partida sea del último nivel según su tipo de movimiento.
     * Según las notas del profesor:
     * - Ingresos: solo nivel 2
     * - Egresos: solo nivel 3
     *
     * @param codCia     Código de la compañía
     * @param ingEgr     Tipo de movimiento ('I' o 'E')
     * @param codPartida Código de la partida a validar
     * @return true si la partida es del último nivel, false en caso contrario
     */
    public boolean validatePartidaForComprobante(Long codCia, String ingEgr, Long codPartida) {
        Partida partida = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, codPartida))
                .orElseThrow(() -> new ResourceNotFoundException("Partida no encontrada"));

        int nivelRequerido = TIPO_INGRESO.equalsIgnoreCase(ingEgr) ? MAX_NIVEL_INGRESO : MAX_NIVEL_EGRESO;

        return partida.getNivel() == nivelRequerido;
    }

    @Override
    public Integer calculateLevel(Long codCia, String ingEgr, Long padCodPartida) {
        if (padCodPartida == null) {
            return 1; // Es raíz
        }

        Partida parent = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, padCodPartida))
                .orElseThrow(() -> new ResourceNotFoundException("Partida padre no encontrada"));

        return parent.getNivel() + 1;
    }

    @Override
    public BigDecimal calculateParentTotal(Long codCia, String ingEgr, Long codPartida) {
        // Esta funcionalidad requeriría acceso a los comprobantes
        // Por ahora retornamos BigDecimal.ZERO como placeholder
        // Se implementará completamente cuando se integre con ComprobantePagoService
        return BigDecimal.ZERO;
    }

    // Métodos auxiliares privados

    private void collectLeafNodes(List<PartidaTreeNode> nodes, List<PartidaDTO> leafPartidas) {
        for (PartidaTreeNode node : nodes) {
            if (node.isLeaf()) {
                PartidaDTO dto = PartidaDTO.builder()
                        .codPartida(node.getCodPartida())
                        .desPartida(node.getDesPartida())
                        .nivel(node.getNivel())
                        .codPartidas(node.getCodPartidas())
                        .fullPath(node.getFullPath())
                        .build();
                leafPartidas.add(dto);
            } else {
                collectLeafNodes(node.getChildren(), leafPartidas);
            }
        }
    }

    /**
     * Recolecta solo las partidas del nivel especificado (último nivel según tipo)
     */
    private void collectLeafNodesAtLevel(List<PartidaTreeNode> nodes, List<PartidaDTO> leafPartidas,
            int nivelRequerido) {
        for (PartidaTreeNode node : nodes) {
            // Solo agregar si es del nivel requerido Y es hoja
            if (node.getNivel() == nivelRequerido && node.isLeaf()) {
                PartidaDTO dto = PartidaDTO.builder()
                        .codPartida(node.getCodPartida())
                        .desPartida(node.getDesPartida())
                        .nivel(node.getNivel())
                        .codPartidas(node.getCodPartidas())
                        .fullPath(node.getFullPath())
                        .build();
                leafPartidas.add(dto);
            }

            // Continuar buscando en los hijos
            if (!node.getChildren().isEmpty()) {
                collectLeafNodesAtLevel(node.getChildren(), leafPartidas, nivelRequerido);
            }
        }
    }

    private String buildFullPath(PartidaTreeNode node, Map<Long, PartidaTreeNode> nodeMap) {
        List<String> pathParts = new ArrayList<>();
        pathParts.add(node.getDesPartida());

        Long currentParentCode = node.getPadCodPartida();
        while (currentParentCode != null) {
            PartidaTreeNode parentNode = nodeMap.get(currentParentCode);
            if (parentNode != null && !currentParentCode.equals(parentNode.getCodPartida())) {
                pathParts.add(0, parentNode.getDesPartida());
                currentParentCode = parentNode.getPadCodPartida();
            } else {
                break;
            }
        }

        return String.join(" > ", pathParts);
    }

    private Long findParentCode(Long codCia, String ingEgr, Long codPartida) {
        List<PartidaMezcla> mezclas = partidaMezclaRepository
                .findByCodCiaAndIngEgrAndCodPartidaAndVigente(codCia, ingEgr, codPartida, "S");

        if (!mezclas.isEmpty()) {
            Long parentCode = mezclas.get(0).getPadCodPartida();
            // Si el padre es igual al hijo, es raíz
            return parentCode.equals(codPartida) ? null : parentCode;
        }

        return null;
    }

    private Integer getOrdenFromMezcla(List<PartidaMezcla> mezclas, Long codPartida) {
        return mezclas.stream()
                .filter(m -> m.getCodPartida().equals(codPartida))
                .findFirst()
                .map(PartidaMezcla::getOrden)
                .orElse(999);
    }

    @Override
    public List<PartidaDTO> obtenerPartidasUltimoNivel(Integer codCia, Integer codPyto, String ingEgr) {
        // Convertir Integer a Long para compatibilidad
        return getLeafPartidas(codCia.longValue(), ingEgr, codPyto != null ? codPyto.longValue() : null);
    }

    @Override
    public boolean esPartidaUltimoNivel(Integer codCia, Integer codPyto, Integer codPartida, String ingEgr) {
        // Verificar que la partida sea del nivel correcto
        boolean esNivelCorrecto = validatePartidaForComprobante(codCia.longValue(), ingEgr, codPartida.longValue());

        if (!esNivelCorrecto) {
            return false;
        }

        // Verificar que no tenga hijos (es hoja)
        List<PartidaMezcla> hijos = partidaMezclaRepository
                .findByCodCiaAndIngEgrAndPadCodPartidaAndVigente(
                        codCia.longValue(),
                        ingEgr,
                        codPartida.longValue(),
                        "S");

        // Filtrar para excluir la referencia a sí misma
        long hijosReales = hijos.stream()
                .filter(m -> !m.getCodPartida().equals(codPartida.longValue()))
                .count();

        return hijosReales == 0;
    }

    @Override
    public List<PartidaTreeNode> obtenerArbolPartidas(Integer codCia, Integer codPyto, String ingEgr) {
        // Convertir Integer a Long para compatibilidad
        return buildPartidaTree(codCia.longValue(), ingEgr);
    }

    /**
     * Obtener partidas de nivel 3 (último nivel) para un proyecto
     * Según especificaciones del profesor: solo nivel 3 se usa en comprobantes
     */
    @Override
    public List<PartidaDTO> getLevel3PartidasByProyecto(Long codCia, Long codPyto, String ingEgr) {
        // Obtener todas las partidas de nivel 3 para la compañía y tipo
        List<Partida> partidasNivel3 = partidaRepository.findByCodCiaAndIngEgrAndNivel(codCia, ingEgr, 3);

        return partidasNivel3.stream()
                .filter(p -> "S".equals(p.getVigente()))
                .map(this::convertToDTOWithHierarchy)
                .collect(Collectors.toList());
    }

    /**
     * Obtener TODAS las partidas (niveles 1, 2 y 3) para un proyecto
     * Nuevo requerimiento: El usuario debe ver todas las partidas del catálogo
     * organizadas jerárquicamente, aunque solo pueda seleccionar nivel 3
     */
    @Override
    public List<PartidaDTO> getAllPartidasByProyecto(Long codCia, Long codPyto, String ingEgr) {
        // Obtener TODAS las partidas del catálogo vigentes (niveles 1, 2 y 3)
        // Esto mostrará toda la estructura jerárquica disponible
        List<Partida> todasPartidas = partidaRepository.findByCodCiaAndIngEgrAndVigente(codCia, ingEgr, "S");

        // Convertir a DTO con información de jerarquía
        return todasPartidas.stream()
                .map(this::convertToDTOWithHierarchy)
                .sorted((a, b) -> {
                    // Ordenar por nivel y luego por código
                    int nivelCompare = Integer.compare(a.getNivel(), b.getNivel());
                    if (nivelCompare != 0)
                        return nivelCompare;
                    return a.getCodPartidas().compareTo(b.getCodPartidas());
                })
                .collect(Collectors.toList());
    }

    /**
     * Validar que una partida sea de nivel 3
     */
    @Override
    public boolean isLevel3Partida(Long codCia, String ingEgr, Long codPartida) {
        Partida partida = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, codPartida))
                .orElse(null);
        return partida != null && partida.getNivel() == 3;
    }

    /**
     * Obtener información del padre de una partida
     */
    @Override
    public PartidaDTO getParentPartida(Long codCia, String ingEgr, Long codPartida) {
        Partida partida = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, codPartida))
                .orElse(null);

        if (partida == null || partida.getNivel() == 1) {
            return null;
        }

        // Buscar el padre usando PartidaMezcla
        Long parentCode = findParentCode(codCia, ingEgr, codPartida);
        if (parentCode == null) {
            return null;
        }

        Partida padre = partidaRepository.findById(new Partida.PartidaId(codCia, ingEgr, parentCode))
                .orElse(null);

        return padre != null ? convertToDTOWithHierarchy(padre) : null;
    }

    /**
     * Convertir entidad Partida a DTO con información de jerarquía
     */
    private PartidaDTO convertToDTOWithHierarchy(Partida partida) {
        PartidaDTO dto = PartidaDTO.builder()
                .codCia(partida.getCodCia())
                .ingEgr(partida.getIngEgr())
                .codPartida(partida.getCodPartida())
                .codPartidas(partida.getCodPartidas())
                .desPartida(partida.getDesPartida())
                .nivel(partida.getNivel())
                .tUniMed(partida.getTUniMed())
                .eUniMed(partida.getEUniMed())
                .vigente(partida.getVigente())
                .build();

        // Construir jerarquía completa si es nivel 3
        if (partida.getNivel() == 3) {
            buildHierarchyInfo(dto, partida);
        }

        return dto;
    }

    /**
     * Construir información de jerarquía para una partida de nivel 3
     */
    private void buildHierarchyInfo(PartidaDTO dto, Partida partida) {
        // Buscar padre nivel 2
        Long parentCode2 = findParentCode(partida.getCodCia(), partida.getIngEgr(), partida.getCodPartida());
        if (parentCode2 != null) {
            Partida padreNivel2 = partidaRepository.findById(
                    new Partida.PartidaId(partida.getCodCia(), partida.getIngEgr(), parentCode2)).orElse(null);

            if (padreNivel2 != null) {
                dto.setPadreNivel2(padreNivel2.getCodPartida());
                dto.setDesPartidaNivel2(padreNivel2.getDesPartida());

                // Buscar padre nivel 1
                Long parentCode1 = findParentCode(partida.getCodCia(), partida.getIngEgr(), parentCode2);
                if (parentCode1 != null) {
                    Partida padreNivel1 = partidaRepository.findById(
                            new Partida.PartidaId(partida.getCodCia(), partida.getIngEgr(), parentCode1)).orElse(null);

                    if (padreNivel1 != null) {
                        dto.setPadreNivel1(padreNivel1.getCodPartida());
                        dto.setDesPartidaNivel1(padreNivel1.getDesPartida());

                        // Construir jerarquía completa para display
                        dto.setJerarquiaCompleta(
                                padreNivel1.getDesPartida() + " > " +
                                        padreNivel2.getDesPartida() + " > " +
                                        partida.getDesPartida());
                    }
                }
            }
        }
    }
}
