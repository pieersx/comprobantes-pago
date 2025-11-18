package com.proyectos.comprobantespago.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.proyectos.comprobantespago.dto.ProyectoDTO;
import com.proyectos.comprobantespago.entity.Proyecto;

/**
 * Mapper para Proyecto
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProyectoMapper {

    @Mapping(target = "nombreJefeProyecto", ignore = true)
    @Mapping(target = "nombreCliente", ignore = true)
    @Mapping(target = "nombreCompania", ignore = true)
    ProyectoDTO toDTO(Proyecto entity);

    Proyecto toEntity(ProyectoDTO dto);

    List<ProyectoDTO> toDTOList(List<Proyecto> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(ProyectoDTO dto, @MappingTarget Proyecto entity);
}
