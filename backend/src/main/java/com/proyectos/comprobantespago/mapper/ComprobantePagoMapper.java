package com.proyectos.comprobantespago.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.proyectos.comprobantespago.dto.ComprobantePagoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoDetalleDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.entity.ComprobantePagoDet;

/**
 * Mapper para ComprobantePago
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ComprobantePagoMapper {

    @Mapping(target = "nombreProveedor", source = "proveedor.persona.desPersona")
    @Mapping(target = "nombreProyecto", source = "proyecto.nombPyto")
    @Mapping(target = "impIgvMn", source = "impIgvmn")
    @Mapping(target = "fotoCp", ignore = true)
    @Mapping(target = "fotoAbono", ignore = true)
    @Mapping(target = "tieneFotoCp", expression = "java(entity.getFotoCp() != null && entity.getFotoCp().length > 0)")
    @Mapping(target = "tieneFotoAbono", expression = "java(entity.getFotoAbono() != null && entity.getFotoAbono().length > 0)")
    ComprobantePagoDTO toDTO(ComprobantePagoCab entity);

    @Mapping(target = "impIgvmn", source = "impIgvMn")
    @Mapping(target = "tCompPago", ignore = true)
    @Mapping(target = "eCompPago", ignore = true)
    @Mapping(target = "tMoneda", ignore = true)
    @Mapping(target = "eMoneda", ignore = true)
    @Mapping(target = "fotoCp", ignore = true)
    @Mapping(target = "fotoAbono", ignore = true)
    ComprobantePagoCab toEntity(ComprobantePagoDTO dto);

    List<ComprobantePagoDTO> toDTOList(List<ComprobantePagoCab> entities);

    @Mapping(target = "nombrePartida", source = "partida.desPartida")
    ComprobantePagoDetalleDTO toDetalleDTO(ComprobantePagoDet entity);

    ComprobantePagoDet toDetalleEntity(ComprobantePagoDetalleDTO dto);

    List<ComprobantePagoDetalleDTO> toDetalleDTOList(List<ComprobantePagoDet> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "fotoCp", ignore = true)
    @Mapping(target = "fotoAbono", ignore = true)
    void updateEntityFromDTO(ComprobantePagoDTO dto, @MappingTarget ComprobantePagoCab entity);
}
