package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.dto.ElementosDTO;
import com.proyectos.comprobantespago.entity.Elementos;
import com.proyectos.comprobantespago.repository.ElementosRepository;
import com.proyectos.comprobantespago.repository.TabsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de Elementos de Catálogos
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ElementosService {
    
    private final ElementosRepository elementosRepository;
    private final TabsRepository tabsRepository;
    
    /**
     * Obtener todos los elementos vigentes de una tabla
     */
    @Transactional(readOnly = true)
    public List<ElementosDTO> obtenerPorTabla(String codTab) {
        log.info("Obteniendo elementos de la tabla: {}", codTab);
        return elementosRepository.findAllVigentesByCodTabSorted(codTab).stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener elemento específico
     */
    @Transactional(readOnly = true)
    public ElementosDTO obtenerElemento(String codTab, String codElem) {
        log.info("Obteniendo elemento {}-{}", codTab, codElem);
        
        Elementos.ElementosId id = new Elementos.ElementosId(codTab, codElem);
        Elementos elementos = elementosRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + codTab + "-" + codElem));
        
        return convertirADTO(elementos);
    }
    
    /**
     * Obtener tipos de moneda
     */
    @Transactional(readOnly = true)
    public List<ElementosDTO> obtenerTiposMoneda() {
        log.info("Obteniendo tipos de moneda");
        return elementosRepository.findTiposMoneda().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener unidades de medida
     */
    @Transactional(readOnly = true)
    public List<ElementosDTO> obtenerUnidadesMedida() {
        log.info("Obteniendo unidades de medida");
        return elementosRepository.findUnidadesMedida().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener tipos de comprobante
     */
    @Transactional(readOnly = true)
    public List<ElementosDTO> obtenerTiposComprobante() {
        log.info("Obteniendo tipos de comprobante");
        return elementosRepository.findTiposComprobante().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Crear nuevo elemento
     */
    public ElementosDTO crear(ElementosDTO elementosDTO) {
        log.info("Creando nuevo elemento {}-{}", elementosDTO.getCodTab(), elementosDTO.getCodElem());
        
        // Verificar que existe la tabla
        if (!tabsRepository.existsById(elementosDTO.getCodTab())) {
            throw new RuntimeException("No existe la tabla: " + elementosDTO.getCodTab());
        }
        
        // Verificar que no existe el elemento
        Elementos.ElementosId id = new Elementos.ElementosId(elementosDTO.getCodTab(), elementosDTO.getCodElem());
        if (elementosRepository.existsById(id)) {
            throw new RuntimeException("Ya existe el elemento: " + elementosDTO.getCodTab() + "-" + elementosDTO.getCodElem());
        }
        
        Elementos elementos = convertirAEntidad(elementosDTO);
        if (elementos.getVigente() == null) {
            elementos.setVigente("S");
        }
        
        elementos = elementosRepository.save(elementos);
        return convertirADTO(elementos);
    }
    
    /**
     * Actualizar elemento existente
     */
    public ElementosDTO actualizar(String codTab, String codElem, ElementosDTO elementosDTO) {
        log.info("Actualizando elemento {}-{}", codTab, codElem);
        
        Elementos.ElementosId id = new Elementos.ElementosId(codTab, codElem);
        Elementos elementos = elementosRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + codTab + "-" + codElem));
        
        elementos.setDenEle(elementosDTO.getDenEle());
        elementos.setDenCorta(elementosDTO.getDenCorta());
        elementos.setVigente(elementosDTO.getVigente());
        
        elementos = elementosRepository.save(elementos);
        return convertirADTO(elementos);
    }
    
    /**
     * Inactivar elemento
     */
    public void inactivar(String codTab, String codElem) {
        log.info("Inactivando elemento {}-{}", codTab, codElem);
        
        Elementos.ElementosId id = new Elementos.ElementosId(codTab, codElem);
        Elementos elementos = elementosRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + codTab + "-" + codElem));
        
        elementos.setVigente("N");
        elementosRepository.save(elementos);
    }
    
    // Métodos de conversión
    private ElementosDTO convertirADTO(Elementos elementos) {
        String denTab = elementos.getTabs() != null ? elementos.getTabs().getDenTab() : null;
        
        return ElementosDTO.builder()
            .codTab(elementos.getCodTab())
            .codElem(elementos.getCodElem())
            .denEle(elementos.getDenEle())
            .denCorta(elementos.getDenCorta())
            .vigente(elementos.getVigente())
            .denTab(denTab)
            .build();
    }
    
    private Elementos convertirAEntidad(ElementosDTO dto) {
        return Elementos.builder()
            .codTab(dto.getCodTab())
            .codElem(dto.getCodElem())
            .denEle(dto.getDenEle())
            .denCorta(dto.getDenCorta())
            .vigente(dto.getVigente())
            .build();
    }
}
