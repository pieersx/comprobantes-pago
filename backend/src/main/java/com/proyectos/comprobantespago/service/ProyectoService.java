package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.dto.ProyectoDTO;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.mapper.ProyectoMapper;
import com.proyectos.comprobantespago.repository.ProyectoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service para Proyecto
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProyectoService {
    
    private final ProyectoRepository proyectoRepository;
    private final ProyectoMapper proyectoMapper;
    
    public List<ProyectoDTO> findAllByCodCia(Long codCia) {
        log.debug("Buscando proyectos para compañía: {}", codCia);
        List<Proyecto> proyectos = proyectoRepository.findAllActiveByCodCia(codCia);
        return proyectoMapper.toDTOList(proyectos);
    }
    
    public ProyectoDTO findById(Long codCia, Long codPyto) {
        log.debug("Buscando proyecto con ID: {} de compañía: {}", codPyto, codCia);
        Proyecto proyecto = proyectoRepository.findByCodCiaAndCodPyto(codCia, codPyto)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));
        return proyectoMapper.toDTO(proyecto);
    }
    
    public List<ProyectoDTO> findByJefeProyecto(Long codCia, Long codEmpleado) {
        log.debug("Buscando proyectos del jefe: {}", codEmpleado);
        List<Proyecto> proyectos = proyectoRepository.findByJefeProyecto(codCia, codEmpleado);
        return proyectoMapper.toDTOList(proyectos);
    }
    
    public List<ProyectoDTO> findByCliente(Long codCia, Long codCliente) {
        log.debug("Buscando proyectos del cliente: {}", codCliente);
        List<Proyecto> proyectos = proyectoRepository.findByCliente(codCia, codCliente);
        return proyectoMapper.toDTOList(proyectos);
    }
    
    public List<ProyectoDTO> findByAnio(Long codCia, Integer anio) {
        log.debug("Buscando proyectos del año: {}", anio);
        List<Proyecto> proyectos = proyectoRepository.findByAnio(codCia, anio);
        return proyectoMapper.toDTOList(proyectos);
    }
    
    public ProyectoDTO create(ProyectoDTO dto) {
        log.debug("Creando nuevo proyecto: {}", dto.getNombPyto());
        
        // Validaciones de negocio
        if (dto.getAnnoFin() < dto.getAnnoIni()) {
            throw new IllegalArgumentException("El año de fin debe ser mayor o igual al año de inicio");
        }
        
        Proyecto proyecto = proyectoMapper.toEntity(dto);
        proyecto.setVigente("1");
        proyecto = proyectoRepository.save(proyecto);
        
        log.info("Proyecto creado con ID: {}", proyecto.getCodPyto());
        return proyectoMapper.toDTO(proyecto);
    }
    
    public ProyectoDTO update(Long codCia, Long codPyto, ProyectoDTO dto) {
        log.debug("Actualizando proyecto con ID: {}", codPyto);
        
        Proyecto proyecto = proyectoRepository.findByCodCiaAndCodPyto(codCia, codPyto)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));
        
        proyectoMapper.updateEntityFromDTO(dto, proyecto);
        proyecto = proyectoRepository.save(proyecto);
        
        log.info("Proyecto actualizado con ID: {}", codPyto);
        return proyectoMapper.toDTO(proyecto);
    }
    
    public void delete(Long codCia, Long codPyto) {
        log.debug("Eliminando (desactivando) proyecto con ID: {}", codPyto);
        
        Proyecto proyecto = proyectoRepository.findByCodCiaAndCodPyto(codCia, codPyto)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));
        
        proyecto.setVigente("0");
        proyectoRepository.save(proyecto);
        
        log.info("Proyecto desactivado con ID: {}", codPyto);
    }
}
