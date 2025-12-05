package com.proyectos.comprobantespago.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.CompaniaDTO;
import com.proyectos.comprobantespago.entity.Compania;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.mapper.CompaniaMapper;
import com.proyectos.comprobantespago.repository.CompaniaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service para Compania
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompaniaService {

    private final CompaniaRepository companiaRepository;
    private final CompaniaMapper companiaMapper;

    public List<CompaniaDTO> findAll() {
        log.debug("Buscando todas las compañías");
        List<Compania> companias = companiaRepository.findAll();
        return companiaMapper.toDTOList(companias);
    }

    public List<CompaniaDTO> findAllActive() {
        log.debug("Buscando compañías activas");
        List<Compania> companias = companiaRepository.findAllActive();
        return companiaMapper.toDTOList(companias);
    }

    public CompaniaDTO findById(Long id) {
        log.debug("Buscando compañía con ID: {}", id);
        Compania compania = companiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compañía no encontrada con ID: " + id));
        return companiaMapper.toDTO(compania);
    }

    public CompaniaDTO create(CompaniaDTO dto) {
        log.debug("Creando nueva compañía: {}", dto.getDesCia());

        if (companiaRepository.existsByDesCia(dto.getDesCia())) {
            throw new IllegalArgumentException("Ya existe una compañía con ese nombre");
        }

        Compania compania = companiaMapper.toEntity(dto);
        compania.setVigente("1");
        compania = companiaRepository.save(compania);

        log.info("Compañía creada con ID: {}", compania.getCodCia());
        return companiaMapper.toDTO(compania);
    }

    public CompaniaDTO update(Long id, CompaniaDTO dto) {
        log.debug("Actualizando compañía con ID: {}", id);

        Compania compania = companiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compañía no encontrada con ID: " + id));

        companiaMapper.updateEntityFromDTO(dto, compania);
        compania = companiaRepository.save(compania);

        log.info("Compañía actualizada con ID: {}", id);
        return companiaMapper.toDTO(compania);
    }

    public void delete(Long id) {
        log.debug("Eliminando (desactivando) compañía con ID: {}", id);

        Compania compania = companiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compañía no encontrada con ID: " + id));

        compania.setVigente("0");
        companiaRepository.save(compania);

        log.info("Compañía desactivada con ID: {}", id);
    }
}
