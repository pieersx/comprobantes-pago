package com.proyectos.comprobantespago.mapper;

import com.proyectos.comprobantespago.dto.CompaniaDTO;
import com.proyectos.comprobantespago.entity.Compania;
import org.mapstruct.*;

import java.util.List;

/**
 * Mapper para Compania
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompaniaMapper {
    
    CompaniaDTO toDTO(Compania entity);
    
    Compania toEntity(CompaniaDTO dto);
    
    List<CompaniaDTO> toDTOList(List<Compania> entities);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(CompaniaDTO dto, @MappingTarget Compania entity);
}
