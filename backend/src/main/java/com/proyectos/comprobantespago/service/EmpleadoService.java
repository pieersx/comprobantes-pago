package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.EmpleadoDTO;

/**
 * Servicio para gestión de empleados
 */
public interface EmpleadoService {

    /**
     * Obtener todos los empleados de una compañía
     */
    List<EmpleadoDTO> findAll(Long codCia);

    /**
     * Obtener todos los empleados vigentes de una compañía
     */
    List<EmpleadoDTO> findAllVigentes(Long codCia);

    /**
     * Buscar empleado por ID compuesto
     */
    Optional<EmpleadoDTO> findById(Long codCia, Long codEmpleado);

    /**
     * Buscar empleados por nombre, DNI o email
     */
    List<EmpleadoDTO> search(Long codCia, String query);

    /**
     * Crear nuevo empleado
     */
    EmpleadoDTO create(EmpleadoDTO empleadoDTO);

    /**
     * Actualizar empleado existente
     */
    EmpleadoDTO update(Long codCia, Long codEmpleado, EmpleadoDTO empleadoDTO);

    /**
     * Desactivar empleado (vigente = 'N')
     */
    void delete(Long codCia, Long codEmpleado);

    /**
     * Subir foto de empleado (almacena en BLOB)
     */
    void uploadFoto(Long codCia, Long codEmpleado, MultipartFile file);

    /**
     * Obtener foto de empleado (desde BLOB)
     */
    byte[] getFoto(Long codCia, Long codEmpleado);

    /**
     * Eliminar foto de empleado
     */
    void deleteFoto(Long codCia, Long codEmpleado);
}
