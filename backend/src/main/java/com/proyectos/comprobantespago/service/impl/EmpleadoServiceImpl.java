package com.proyectos.comprobantespago.service.impl;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.EmpleadoDTO;
import com.proyectos.comprobantespago.entity.Empleado;
import com.proyectos.comprobantespago.entity.Persona;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.exception.ValidationException;
import com.proyectos.comprobantespago.repository.EmpleadoRepository;
import com.proyectos.comprobantespago.repository.PersonaRepository;
import com.proyectos.comprobantespago.service.EmpleadoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "application/pdf");

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> findAll(Long codCia) {
        return empleadoRepository.findByCodCia(codCia).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> findAllVigentes(Long codCia) {
        return empleadoRepository.findByCodCiaAndVigente(codCia, "1").stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmpleadoDTO> findById(Long codCia, Long codEmpleado) {
        return empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .map(this::toDTOWithFoto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> search(Long codCia, String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAllVigentes(codCia);
        }
        return empleadoRepository.findByNombreContaining(codCia, query.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmpleadoDTO create(EmpleadoDTO dto) {
        // Verificar que existe la persona base
        Persona persona = personaRepository.findByCodCiaAndCodPersona(dto.getCodCia(), dto.getCodEmpleado())
                .orElseThrow(() -> new ValidationException(
                        "Debe existir una PERSONA con código " + dto.getCodEmpleado() + " antes de crear el empleado"));

        // Verificar que no exista ya el empleado
        if (empleadoRepository.findByCodCiaAndCodEmpleado(dto.getCodCia(), dto.getCodEmpleado()).isPresent()) {
            throw new ValidationException("Ya existe un empleado con código " + dto.getCodEmpleado());
        }

        Empleado empleado = toEntity(dto);
        empleado = empleadoRepository.save(empleado);

        log.info("Empleado creado: codCia={}, codEmpleado={}", dto.getCodCia(), dto.getCodEmpleado());
        return toDTO(empleado);
    }

    @Override
    @Transactional
    public EmpleadoDTO update(Long codCia, Long codEmpleado, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        // Actualizar campos
        empleado.setDirecc(dto.getDirecc());
        empleado.setCelular(dto.getCelular());
        empleado.setHobby(dto.getHobby());
        empleado.setDni(dto.getDni());
        empleado.setEmail(dto.getEmail());
        empleado.setFecNac(dto.getFecNac());
        empleado.setNroCip(dto.getNroCip());
        empleado.setFecCipVig(dto.getFecCipVig());
        empleado.setLicCond(dto.getLicCond());
        empleado.setFlgEmplIea(dto.getFlgEmplIea());
        empleado.setObservac(dto.getObservac());
        empleado.setCodCargo(dto.getCodCargo());
        empleado.setVigente(dto.getVigente());

        empleado = empleadoRepository.save(empleado);
        log.info("Empleado actualizado: codCia={}, codEmpleado={}", codCia, codEmpleado);
        return toDTO(empleado);
    }

    @Override
    @Transactional
    public void delete(Long codCia, Long codEmpleado) {
        Empleado empleado = empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        empleado.setVigente("N");
        empleadoRepository.save(empleado);
        log.info("Empleado desactivado: codCia={}, codEmpleado={}", codCia, codEmpleado);
    }

    @Override
    @Transactional
    public void uploadFoto(Long codCia, Long codEmpleado, MultipartFile file) {
        // Validar archivo
        validateFile(file);

        Empleado empleado = empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        try {
            empleado.setFoto(file.getBytes());
            empleadoRepository.save(empleado);
            log.info("Foto subida para empleado: codCia={}, codEmpleado={}", codCia, codEmpleado);
        } catch (IOException e) {
            throw new ValidationException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getFoto(Long codCia, Long codEmpleado) {
        Empleado empleado = empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        if (empleado.getFoto() == null) {
            throw new ResourceNotFoundException("El empleado no tiene foto");
        }

        return empleado.getFoto();
    }

    @Override
    @Transactional
    public void deleteFoto(Long codCia, Long codEmpleado) {
        Empleado empleado = empleadoRepository.findByCodCiaAndCodEmpleado(codCia, codEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        empleado.setFoto(null);
        empleadoRepository.save(empleado);
        log.info("Foto eliminada para empleado: codCia={}, codEmpleado={}", codCia, codEmpleado);
    }

    // ==================== Métodos privados ====================

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("El archivo está vacío");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("El archivo excede el límite de 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ValidationException("Tipo de archivo no permitido. Use jpg, png, gif o pdf");
        }
    }

    private EmpleadoDTO toDTO(Empleado entity) {
        EmpleadoDTO dto = EmpleadoDTO.builder()
                .codCia(entity.getCodCia())
                .codEmpleado(entity.getCodEmpleado())
                .direcc(entity.getDirecc())
                .celular(entity.getCelular())
                .hobby(entity.getHobby())
                .dni(entity.getDni())
                .email(entity.getEmail())
                .fecNac(entity.getFecNac())
                .nroCip(entity.getNroCip())
                .fecCipVig(entity.getFecCipVig())
                .licCond(entity.getLicCond())
                .flgEmplIea(entity.getFlgEmplIea())
                .observac(entity.getObservac())
                .codCargo(entity.getCodCargo())
                .vigente(entity.getVigente())
                .tieneFoto(entity.getFoto() != null && entity.getFoto().length > 0)
                .build();

        // Agregar datos de Persona si está disponible
        if (entity.getPersona() != null) {
            dto.setDesPersona(entity.getPersona().getDesPersona());
            dto.setDesCorta(entity.getPersona().getDesCorta());
        }

        return dto;
    }

    private EmpleadoDTO toDTOWithFoto(Empleado entity) {
        EmpleadoDTO dto = toDTO(entity);

        // Incluir foto en Base64 si existe
        if (entity.getFoto() != null && entity.getFoto().length > 0) {
            dto.setFotoBase64(Base64.getEncoder().encodeToString(entity.getFoto()));
        }

        return dto;
    }

    private Empleado toEntity(EmpleadoDTO dto) {
        return Empleado.builder()
                .codCia(dto.getCodCia())
                .codEmpleado(dto.getCodEmpleado())
                .direcc(dto.getDirecc())
                .celular(dto.getCelular())
                .hobby(dto.getHobby())
                .dni(dto.getDni())
                .email(dto.getEmail())
                .fecNac(dto.getFecNac())
                .nroCip(dto.getNroCip())
                .fecCipVig(dto.getFecCipVig())
                .licCond(dto.getLicCond())
                .flgEmplIea(dto.getFlgEmplIea())
                .observac(dto.getObservac())
                .codCargo(dto.getCodCargo())
                .vigente(dto.getVigente() != null ? dto.getVigente() : "1")
                .build();
    }
}
