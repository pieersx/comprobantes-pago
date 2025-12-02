package com.proyectos.comprobantespago.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDetDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoEmpleado;
import com.proyectos.comprobantespago.entity.ComprobantePagoEmpleadoDet;
import com.proyectos.comprobantespago.entity.Empleado;
import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.exception.ValidationException;
import com.proyectos.comprobantespago.repository.ComprobantePagoEmpleadoDetRepository;
import com.proyectos.comprobantespago.repository.ComprobantePagoEmpleadoRepository;
import com.proyectos.comprobantespago.repository.EmpleadoRepository;
import com.proyectos.comprobantespago.repository.PartidaRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;
import com.proyectos.comprobantespago.service.ComprobantePagoEmpleadoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComprobantePagoEmpleadoServiceImpl implements ComprobantePagoEmpleadoService {

    private final ComprobantePagoEmpleadoRepository repository;
    private final ComprobantePagoEmpleadoDetRepository detalleRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ProyectoRepository proyectoRepository;
    private final PartidaRepository partidaRepository;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "application/pdf");

    @Override
    @Transactional(readOnly = true)
    public List<ComprobantePagoEmpleadoDTO> findAll(Long codCia) {
        return repository.findByCodCiaWithRelations(codCia).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComprobantePagoEmpleadoDTO> findByEmpleado(Long codCia, Long codEmpleado) {
        return repository.findByCodCiaAndCodEmpleadoWithRelations(codCia, codEmpleado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComprobantePagoEmpleadoDTO> findByProyecto(Long codCia, Long codPyto) {
        return repository.findByCodCiaAndCodPytoWithRelations(codCia, codPyto).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ComprobantePagoEmpleadoDTO> findById(Long codCia, Long codEmpleado, String nroCp) {
        // Usar query con fetch join para evitar LazyInitializationException
        return repository.findByIdWithRelations(codCia, codEmpleado, nroCp)
                .map(entity -> {
                    ComprobantePagoEmpleadoDTO dto = toDTO(entity);
                    // Incluir los detalles del comprobante
                    List<ComprobantePagoEmpleadoDetDTO> detalles = detalleRepository
                            .findDetallesByComprobante(codCia, codEmpleado, nroCp).stream()
                            .map(this::toDetalleDTO)
                            .collect(Collectors.toList());
                    dto.setDetalles(detalles);
                    return dto;
                });
    }

    @Override
    @Transactional
    public ComprobantePagoEmpleadoDTO create(ComprobantePagoEmpleadoDTO dto) {
        // Validar que existe el empleado
        empleadoRepository.findByCodCiaAndCodEmpleado(dto.getCodCia(), dto.getCodEmpleado())
                .orElseThrow(() -> new ValidationException("Empleado no encontrado"));

        // Validar que existe el proyecto
        proyectoRepository.findByCodCiaAndCodPyto(dto.getCodCia(), dto.getCodPyto())
                .orElseThrow(() -> new ValidationException("Proyecto no encontrado"));

        // Verificar que no exista el comprobante
        if (repository.findByCodCiaAndCodEmpleadoAndNroCp(dto.getCodCia(), dto.getCodEmpleado(), dto.getNroCp())
                .isPresent()) {
            throw new ValidationException("Ya existe un comprobante con número " + dto.getNroCp());
        }

        // Establecer valores por defecto si no vienen en el DTO
        // Los valores deben existir en la tabla ELEMENTOS
        // Según el esquema del profesor:
        // - Tipos de comprobante: codTab='004', codElem: 001=Factura, 002=RxH,
        // 003=Voucher
        // - Monedas: codTab='003', codElem: 001=Soles, 002=Dólares, 003=Euros
        if (dto.getTCompPago() == null || dto.getTCompPago().isBlank()) {
            dto.setTCompPago("004"); // Tabla de tipos de comprobante (codTab='004')
        }
        if (dto.getECompPago() == null || dto.getECompPago().isBlank()) {
            dto.setECompPago("002"); // 002 = Recibo por Honorarios (codElem)
        }
        if (dto.getTMoneda() == null || dto.getTMoneda().isBlank()) {
            dto.setTMoneda("003"); // Tabla de monedas (codTab='003')
        }
        if (dto.getEMoneda() == null || dto.getEMoneda().isBlank()) {
            dto.setEMoneda("001"); // 001 = Soles (codElem)
        }

        ComprobantePagoEmpleado entity = toEntity(dto);
        entity.setSemilla(1);
        entity.setTabEstado("004");
        entity.setCodEstado("REG"); // Estado inicial: Registrado

        entity = repository.save(entity);
        log.info("Comprobante empleado creado: codCia={}, codEmpleado={}, nroCp={}",
                dto.getCodCia(), dto.getCodEmpleado(), dto.getNroCp());

        return toDTO(entity);
    }

    @Override
    @Transactional
    public ComprobantePagoEmpleadoDTO update(Long codCia, Long codEmpleado, String nroCp,
            ComprobantePagoEmpleadoDTO dto) {
        ComprobantePagoEmpleado entity = repository.findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        // No permitir editar si está anulado
        if ("ANU".equals(entity.getCodEstado())) {
            throw new ValidationException("No se puede editar un comprobante anulado");
        }

        // Actualizar campos
        entity.setCodPyto(dto.getCodPyto());
        entity.setNroPago(dto.getNroPago());
        entity.setTCompPago(dto.getTCompPago());
        entity.setECompPago(dto.getECompPago());
        entity.setFecCp(dto.getFecCp());
        entity.setTMoneda(dto.getTMoneda());
        entity.setEMoneda(dto.getEMoneda());
        entity.setTipCambio(dto.getTipCambio());
        entity.setImpMo(dto.getImpMo());
        entity.setImpNetoMn(dto.getImpNetoMn());
        entity.setImpIgvmn(dto.getImpIgvmn());
        entity.setImpTotalMn(dto.getImpTotalMn());
        entity.setFecAbono(dto.getFecAbono());
        entity.setDesAbono(dto.getDesAbono());

        if (dto.getCodEstado() != null) {
            entity.setCodEstado(dto.getCodEstado());
        }

        entity = repository.save(entity);
        log.info("Comprobante empleado actualizado: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);

        return toDTO(entity);
    }

    @Override
    @Transactional
    public void anular(Long codCia, Long codEmpleado, String nroCp) {
        ComprobantePagoEmpleado entity = repository.findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        entity.setCodEstado("ANU");
        repository.save(entity);
        log.info("Comprobante empleado anulado: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
    }

    // ==================== Métodos de imágenes BLOB ====================

    @Override
    @Transactional
    public void uploadFotoCp(Long codCia, Long codEmpleado, String nroCp, MultipartFile file) {
        validateFile(file);
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);

        try {
            entity.setFotoCp(file.getBytes());
            repository.save(entity);
            log.info("FotoCp subida: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
        } catch (IOException e) {
            throw new ValidationException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    @Override
    public byte[] getFotoCp(Long codCia, Long codEmpleado, String nroCp) {
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);
        if (entity.getFotoCp() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de comprobante");
        }
        return entity.getFotoCp();
    }

    @Override
    @Transactional
    public void deleteFotoCp(Long codCia, Long codEmpleado, String nroCp) {
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);
        entity.setFotoCp(null);
        repository.save(entity);
        log.info("FotoCp eliminada: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
    }

    @Override
    @Transactional
    public void uploadFotoAbono(Long codCia, Long codEmpleado, String nroCp, MultipartFile file) {
        validateFile(file);
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);

        try {
            entity.setFotoAbono(file.getBytes());
            repository.save(entity);
            log.info("FotoAbono subida: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
        } catch (IOException e) {
            throw new ValidationException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    @Override
    public byte[] getFotoAbono(Long codCia, Long codEmpleado, String nroCp) {
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);
        if (entity.getFotoAbono() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de abono");
        }
        return entity.getFotoAbono();
    }

    @Override
    @Transactional
    public void deleteFotoAbono(Long codCia, Long codEmpleado, String nroCp) {
        ComprobantePagoEmpleado entity = getEntity(codCia, codEmpleado, nroCp);
        entity.setFotoAbono(null);
        repository.save(entity);
        log.info("FotoAbono eliminada: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
    }

    // ==================== Métodos privados ====================

    private ComprobantePagoEmpleado getEntity(Long codCia, Long codEmpleado, String nroCp) {
        return repository.findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));
    }

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

    private ComprobantePagoEmpleadoDTO toDTO(ComprobantePagoEmpleado entity) {
        ComprobantePagoEmpleadoDTO dto = ComprobantePagoEmpleadoDTO.builder()
                .codCia(entity.getCodCia())
                .codEmpleado(entity.getCodEmpleado())
                .nroCp(entity.getNroCp())
                .codPyto(entity.getCodPyto())
                .nroPago(entity.getNroPago())
                .tCompPago(entity.getTCompPago())
                .eCompPago(entity.getECompPago())
                .fecCp(entity.getFecCp())
                .tMoneda(entity.getTMoneda())
                .eMoneda(entity.getEMoneda())
                .tipCambio(entity.getTipCambio())
                .impMo(entity.getImpMo())
                .impNetoMn(entity.getImpNetoMn())
                .impIgvmn(entity.getImpIgvmn())
                .impTotalMn(entity.getImpTotalMn())
                .fecAbono(entity.getFecAbono())
                .desAbono(entity.getDesAbono())
                .semilla(entity.getSemilla())
                .tabEstado(entity.getTabEstado())
                .codEstado(entity.getCodEstado())
                .tieneFotoCp(entity.getFotoCp() != null && entity.getFotoCp().length > 0)
                .tieneFotoAbono(entity.getFotoAbono() != null && entity.getFotoAbono().length > 0)
                .build();

        // Agregar datos relacionados
        Empleado empleado = entity.getEmpleado();
        if (empleado != null && empleado.getPersona() != null) {
            dto.setNombreEmpleado(empleado.getPersona().getDesPersona());
        }

        Proyecto proyecto = entity.getProyecto();
        if (proyecto != null) {
            dto.setNombreProyecto(proyecto.getNombPyto());
        }

        return dto;
    }

    private ComprobantePagoEmpleado toEntity(ComprobantePagoEmpleadoDTO dto) {
        return ComprobantePagoEmpleado.builder()
                .codCia(dto.getCodCia())
                .codEmpleado(dto.getCodEmpleado())
                .nroCp(dto.getNroCp())
                .codPyto(dto.getCodPyto())
                .nroPago(dto.getNroPago())
                .tCompPago(dto.getTCompPago())
                .eCompPago(dto.getECompPago())
                .fecCp(dto.getFecCp())
                .tMoneda(dto.getTMoneda())
                .eMoneda(dto.getEMoneda())
                .tipCambio(dto.getTipCambio())
                .impMo(dto.getImpMo())
                .impNetoMn(dto.getImpNetoMn())
                .impIgvmn(dto.getImpIgvmn())
                .impTotalMn(dto.getImpTotalMn())
                .fecAbono(dto.getFecAbono())
                .desAbono(dto.getDesAbono())
                .build();
    }

    // ==================== Métodos de detalle (COMP_PAGOEMPLEADO_DET)
    // ====================

    @Override
    @Transactional(readOnly = true)
    public List<ComprobantePagoEmpleadoDetDTO> findDetalles(Long codCia, Long codEmpleado, String nroCp) {
        // Verificar que existe el comprobante
        getEntity(codCia, codEmpleado, nroCp);

        return detalleRepository.findDetallesByComprobante(codCia, codEmpleado, nroCp).stream()
                .map(this::toDetalleDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ComprobantePagoEmpleadoDetDTO addDetalle(Long codCia, Long codEmpleado, String nroCp,
            ComprobantePagoEmpleadoDetDTO dto) {
        // Verificar que existe el comprobante
        ComprobantePagoEmpleado comprobante = getEntity(codCia, codEmpleado, nroCp);

        // No permitir agregar detalle si está anulado
        if ("ANU".equals(comprobante.getCodEstado())) {
            throw new ValidationException("No se puede agregar detalle a un comprobante anulado");
        }

        // Validar que existe la partida
        Partida partida = partidaRepository.findByCodCiaAndIngEgrAndCodPartida(codCia, dto.getIngEgr(),
                dto.getCodPartida());
        if (partida == null) {
            throw new ValidationException("Partida no encontrada");
        }

        // Obtener el siguiente número de secuencia
        Integer nextSec = detalleRepository.getNextSec(codCia, codEmpleado, nroCp);

        ComprobantePagoEmpleadoDet entity = toDetalleEntity(dto);
        entity.setCodCia(codCia);
        entity.setCodEmpleado(codEmpleado);
        entity.setNroCp(nroCp);
        entity.setSec(nextSec);
        // Semilla debe ser máximo 5 dígitos (NUMBER(5) en Oracle)
        entity.setSemilla((int) (System.currentTimeMillis() % 99999) + 1);

        entity = detalleRepository.save(entity);
        log.info("Detalle agregado: codCia={}, codEmpleado={}, nroCp={}, sec={}", codCia, codEmpleado, nroCp, nextSec);

        return toDetalleDTO(entity);
    }

    @Override
    @Transactional
    public ComprobantePagoEmpleadoDetDTO updateDetalle(Long codCia, Long codEmpleado, String nroCp, Integer sec,
            ComprobantePagoEmpleadoDetDTO dto) {
        // Verificar que existe el comprobante
        ComprobantePagoEmpleado comprobante = getEntity(codCia, codEmpleado, nroCp);

        // No permitir editar si está anulado
        if ("ANU".equals(comprobante.getCodEstado())) {
            throw new ValidationException("No se puede editar un detalle de comprobante anulado");
        }

        // Buscar el detalle existente
        ComprobantePagoEmpleadoDet.ComprobantePagoEmpleadoDetId id = new ComprobantePagoEmpleadoDet.ComprobantePagoEmpleadoDetId();
        id.setCodCia(codCia);
        id.setCodEmpleado(codEmpleado);
        id.setNroCp(nroCp);
        id.setSec(sec);

        ComprobantePagoEmpleadoDet entity = detalleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle no encontrado"));

        // Validar que existe la partida si se cambia
        if (dto.getCodPartida() != null && !dto.getCodPartida().equals(entity.getCodPartida())) {
            Partida partida = partidaRepository.findByCodCiaAndIngEgrAndCodPartida(codCia, dto.getIngEgr(),
                    dto.getCodPartida());
            if (partida == null) {
                throw new ValidationException("Partida no encontrada");
            }
        }

        // Actualizar campos
        if (dto.getIngEgr() != null)
            entity.setIngEgr(dto.getIngEgr());
        if (dto.getCodPartida() != null)
            entity.setCodPartida(dto.getCodPartida());
        if (dto.getImpNetoMn() != null)
            entity.setImpNetoMn(dto.getImpNetoMn());
        if (dto.getImpIgvMn() != null)
            entity.setImpIgvMn(dto.getImpIgvMn());
        if (dto.getImpTotalMn() != null)
            entity.setImpTotalMn(dto.getImpTotalMn());

        entity = detalleRepository.save(entity);
        log.info("Detalle actualizado: codCia={}, codEmpleado={}, nroCp={}, sec={}", codCia, codEmpleado, nroCp, sec);

        return toDetalleDTO(entity);
    }

    @Override
    @Transactional
    public void deleteDetalle(Long codCia, Long codEmpleado, String nroCp, Integer sec) {
        // Verificar que existe el comprobante
        ComprobantePagoEmpleado comprobante = getEntity(codCia, codEmpleado, nroCp);

        // No permitir eliminar si está anulado
        if ("ANU".equals(comprobante.getCodEstado())) {
            throw new ValidationException("No se puede eliminar un detalle de comprobante anulado");
        }

        ComprobantePagoEmpleadoDet.ComprobantePagoEmpleadoDetId id = new ComprobantePagoEmpleadoDet.ComprobantePagoEmpleadoDetId();
        id.setCodCia(codCia);
        id.setCodEmpleado(codEmpleado);
        id.setNroCp(nroCp);
        id.setSec(sec);

        if (!detalleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Detalle no encontrado");
        }

        detalleRepository.deleteById(id);
        log.info("Detalle eliminado: codCia={}, codEmpleado={}, nroCp={}, sec={}", codCia, codEmpleado, nroCp, sec);
    }

    @Override
    @Transactional
    public void deleteAllDetalles(Long codCia, Long codEmpleado, String nroCp) {
        // Verificar que existe el comprobante
        ComprobantePagoEmpleado comprobante = getEntity(codCia, codEmpleado, nroCp);

        // No permitir eliminar si está anulado
        if ("ANU".equals(comprobante.getCodEstado())) {
            throw new ValidationException("No se pueden eliminar detalles de un comprobante anulado");
        }

        detalleRepository.deleteByComprobante(codCia, codEmpleado, nroCp);
        log.info("Todos los detalles eliminados: codCia={}, codEmpleado={}, nroCp={}", codCia, codEmpleado, nroCp);
    }

    // ==================== Métodos privados para detalle ====================

    private ComprobantePagoEmpleadoDetDTO toDetalleDTO(ComprobantePagoEmpleadoDet entity) {
        ComprobantePagoEmpleadoDetDTO dto = ComprobantePagoEmpleadoDetDTO.builder()
                .codCia(entity.getCodCia())
                .codEmpleado(entity.getCodEmpleado())
                .nroCp(entity.getNroCp())
                .sec(entity.getSec())
                .ingEgr(entity.getIngEgr())
                .codPartida(entity.getCodPartida())
                .impNetoMn(entity.getImpNetoMn())
                .impIgvMn(entity.getImpIgvMn())
                .impTotalMn(entity.getImpTotalMn())
                .semilla(entity.getSemilla())
                .build();

        // Agregar nombre de la partida
        Partida partida = entity.getPartida();
        if (partida != null) {
            dto.setNombrePartida(partida.getDesPartida());
        }

        return dto;
    }

    private ComprobantePagoEmpleadoDet toDetalleEntity(ComprobantePagoEmpleadoDetDTO dto) {
        return ComprobantePagoEmpleadoDet.builder()
                .codCia(dto.getCodCia())
                .codEmpleado(dto.getCodEmpleado())
                .nroCp(dto.getNroCp())
                .sec(dto.getSec())
                .ingEgr(dto.getIngEgr())
                .codPartida(dto.getCodPartida())
                .impNetoMn(dto.getImpNetoMn())
                .impIgvMn(dto.getImpIgvMn())
                .impTotalMn(dto.getImpTotalMn())
                .semilla(dto.getSemilla())
                .build();
    }
}
