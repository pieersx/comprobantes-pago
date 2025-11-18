package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.dto.TabsDTO;
import com.proyectos.comprobantespago.entity.Tabs;
import com.proyectos.comprobantespago.repository.TabsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de Catálogos Maestros (TABS)
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TabsService {
    
    private final TabsRepository tabsRepository;
    
    /**
     * Obtener todas las tablas vigentes
     */
    @Transactional(readOnly = true)
    public List<TabsDTO> obtenerTodasVigentes() {
        log.info("Obteniendo todas las tablas vigentes");
        return tabsRepository.findAllVigentesSorted().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener tabla por código
     */
    @Transactional(readOnly = true)
    public TabsDTO obtenerPorCodigo(String codTab) {
        log.info("Obteniendo tabla con código: {}", codTab);
        Tabs tabs = tabsRepository.findById(codTab)
            .orElseThrow(() -> new RuntimeException("Tabla no encontrada con código: " + codTab));
        return convertirADTO(tabs);
    }
    
    /**
     * Crear nueva tabla
     */
    public TabsDTO crear(TabsDTO tabsDTO) {
        log.info("Creando nueva tabla: {}", tabsDTO.getDenTab());
        
        if (tabsRepository.existsById(tabsDTO.getCodTab())) {
            throw new RuntimeException("Ya existe una tabla con el código: " + tabsDTO.getCodTab());
        }
        
        Tabs tabs = convertirAEntidad(tabsDTO);
        if (tabs.getVigente() == null) {
            tabs.setVigente("S");
        }
        
        tabs = tabsRepository.save(tabs);
        return convertirADTO(tabs);
    }
    
    /**
     * Actualizar tabla existente
     */
    public TabsDTO actualizar(String codTab, TabsDTO tabsDTO) {
        log.info("Actualizando tabla con código: {}", codTab);
        
        Tabs tabs = tabsRepository.findById(codTab)
            .orElseThrow(() -> new RuntimeException("Tabla no encontrada con código: " + codTab));
        
        tabs.setDenTab(tabsDTO.getDenTab());
        tabs.setDenCorta(tabsDTO.getDenCorta());
        tabs.setVigente(tabsDTO.getVigente());
        
        tabs = tabsRepository.save(tabs);
        return convertirADTO(tabs);
    }
    
    /**
     * Inactivar tabla
     */
    public void inactivar(String codTab) {
        log.info("Inactivando tabla con código: {}", codTab);
        
        Tabs tabs = tabsRepository.findById(codTab)
            .orElseThrow(() -> new RuntimeException("Tabla no encontrada con código: " + codTab));
        
        tabs.setVigente("N");
        tabsRepository.save(tabs);
    }
    
    // Métodos de conversión
    private TabsDTO convertirADTO(Tabs tabs) {
        return TabsDTO.builder()
            .codTab(tabs.getCodTab())
            .denTab(tabs.getDenTab())
            .denCorta(tabs.getDenCorta())
            .vigente(tabs.getVigente())
            .build();
    }
    
    private Tabs convertirAEntidad(TabsDTO dto) {
        return Tabs.builder()
            .codTab(dto.getCodTab())
            .denTab(dto.getDenTab())
            .denCorta(dto.getDenCorta())
            .vigente(dto.getVigente())
            .build();
    }
}
