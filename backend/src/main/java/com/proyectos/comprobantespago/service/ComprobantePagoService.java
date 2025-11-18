package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.ComprobantePagoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoDetalleDTO;
import com.proyectos.comprobantespago.dto.ValidacionPresupuestoDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.entity.ComprobantePagoDet;
import com.proyectos.comprobantespago.exception.DuplicateComprobanteException;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.exception.ValidationException;
import com.proyectos.comprobantespago.mapper.ComprobantePagoMapper;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;
import com.proyectos.comprobantespago.repository.ComprobantePagoDetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service para ComprobantePago
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ComprobantePagoService {

    private final ComprobantePagoCabRepository cabRepository;
    private final ComprobantePagoDetRepository detRepository;
    private final ComprobantePagoMapper mapper;
    private final PresupuestoService presupuestoService;

    public List<ComprobantePagoDTO> findAllByCompania(Long codCia) {
        log.debug("Buscando comprobantes de la compañía: {}", codCia);
        List<ComprobantePagoCab> comprobantes = cabRepository.findByCodCia(codCia);
        return mapper.toDTOList(comprobantes);
    }

    public List<ComprobantePagoDTO> findAllByProyecto(Long codCia, Long codPyto) {
        log.debug("Buscando comprobantes del proyecto: {}", codPyto);
        List<ComprobantePagoCab> comprobantes = cabRepository.findByCodCiaAndCodPyto(codCia, codPyto);
        return mapper.toDTOList(comprobantes);
    }

    public List<ComprobantePagoDTO> findByProveedor(Long codCia, Long codProveedor) {
        log.debug("Buscando comprobantes del proveedor: {}", codProveedor);
        List<ComprobantePagoCab> comprobantes = cabRepository.findByCodCiaAndCodProveedor(codCia, codProveedor);
        return mapper.toDTOList(comprobantes);
    }

    public List<ComprobantePagoDTO> findByEstado(Long codCia, String estado) {
        log.debug("Buscando comprobantes con estado: {}", estado);
        List<ComprobantePagoCab> comprobantes = cabRepository.findByEstado(codCia, estado);
        return mapper.toDTOList(comprobantes);
    }

    public List<ComprobantePagoDTO> findByFechaRange(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.debug("Buscando comprobantes entre {} y {}", fechaInicio, fechaFin);
        List<ComprobantePagoCab> comprobantes = cabRepository.findByFechaRange(codCia, fechaInicio, fechaFin);
        return mapper.toDTOList(comprobantes);
    }

    public ComprobantePagoDTO findById(Long codCia, Long codProveedor, String nroCp) {
        log.debug("Buscando comprobante: {}", nroCp);

        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        List<ComprobantePagoDet> detalles = detRepository.findDetallesByComprobante(codCia, codProveedor, nroCp);

        ComprobantePagoDTO dto = mapper.toDTO(cabecera);
        dto.setDetalles(mapper.toDetalleDTOList(detalles));

        return dto;
    }

    @SuppressWarnings("null")
    public ComprobantePagoDTO create(ComprobantePagoDTO dto) {
        log.info("Creando nuevo comprobante: {} para proyecto: {}", dto.getNroCp(), dto.getCodPyto());

        // 1. Validar duplicados (Subtask 2.2)
        validarDuplicado(dto.getCodCia(), dto.getCodProveedor(), dto.getNroCp());

        // 2. Validar totales y datos básicos (Subtask 2.3)
        validarTotales(dto);
        validarMontos(dto);
        validarFechas(dto);

        // 3. Validar presupuesto disponible (Subtask 2.1)
        ValidacionPresupuestoDTO validacion = presupuestoService.validarEgreso(
                dto.getCodCia(),
                dto.getCodPyto(),
                dto.getDetalles()
        );

        log.info("Validación de presupuesto aprobada con {} alertas", validacion.getAlertas().size());

        // 4. Guardar cabecera
        ComprobantePagoCab cabecera = mapper.toEntity(dto);

        // Mapeo manual de campos problemáticos
        cabecera.setTCompPago(dto.getTCompPago());
        cabecera.setECompPago(dto.getECompPago());
        cabecera.setTMoneda(dto.getTMoneda());
        cabecera.setEMoneda(dto.getEMoneda());

        cabecera.setTabEstado("001"); // Tabla de estados
        cabecera.setCodEstado("001"); // Estado inicial: Registrado (código '001')
        cabecera = cabRepository.save(cabecera);

        // 5. Guardar detalles
        for (int i = 0; i < dto.getDetalles().size(); i++) {
            ComprobantePagoDetalleDTO detalleDTO = dto.getDetalles().get(i);
            ComprobantePagoDet detalle = mapper.toDetalleEntity(detalleDTO);
            detalle.setCodCia(cabecera.getCodCia());
            detalle.setCodProveedor(cabecera.getCodProveedor());
            detalle.setNroCp(cabecera.getNroCp());
            detalle.setIngEgr(detalleDTO.getIngEgr());

            int sec = detalleDTO.getSec() != null ? detalleDTO.getSec() : (i + 1);
            detalle.setSec(sec);

            int semilla = detalleDTO.getSemilla() != null ? detalleDTO.getSemilla() : (i + 1);
            detalle.setSemilla(semilla);

            detRepository.save(detalle);
        }

        // 6. Generar alertas automáticas después de guardar (Subtask 2.1)
        presupuestoService.generarAlertas(dto.getCodCia(), dto.getCodPyto());

        log.info("Comprobante creado exitosamente: {}", cabecera.getNroCp());
        return findById(cabecera.getCodCia(), cabecera.getCodProveedor(), cabecera.getNroCp());
    }

    @SuppressWarnings("null")
    public ComprobantePagoDTO update(Long codCia, Long codProveedor, String nroCp, ComprobantePagoDTO dto) {
        log.info("Actualizando comprobante: {}", nroCp);

        // 1. Buscar comprobante existente
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        // 2. Validar que no esté en estado PAG (código '002') (Subtask 2.4)
        if ("002".equals(cabecera.getCodEstado())) {
            throw new ValidationException("No se puede editar un comprobante en estado PAGADO");
        }

        // 3. Validar totales y datos básicos
        validarTotales(dto);
        validarMontos(dto);
        validarFechas(dto);

        // 4. Validar presupuesto con montos actualizados (Subtask 2.4)
        ValidacionPresupuestoDTO validacion = presupuestoService.validarEgreso(
                dto.getCodCia(),
                dto.getCodPyto(),
                dto.getDetalles()
        );

        log.info("Validación de presupuesto aprobada para actualización con {} alertas",
                validacion.getAlertas().size());

        // 5. Actualizar cabecera
        mapper.updateEntityFromDTO(dto, cabecera);
        cabRepository.save(cabecera);

        // 6. Eliminar detalles antiguos y guardar nuevos
        detRepository.deleteByComprobante(codCia, codProveedor, nroCp);

        for (int i = 0; i < dto.getDetalles().size(); i++) {
            ComprobantePagoDetalleDTO detalleDTO = dto.getDetalles().get(i);
            ComprobantePagoDet detalle = mapper.toDetalleEntity(detalleDTO);
            detalle.setCodCia(cabecera.getCodCia());
            detalle.setCodProveedor(cabecera.getCodProveedor());
            detalle.setNroCp(cabecera.getNroCp());
            detalle.setIngEgr(detalleDTO.getIngEgr());

            int sec = detalleDTO.getSec() != null ? detalleDTO.getSec() : (i + 1);
            detalle.setSec(sec);

            int semilla = detalleDTO.getSemilla() != null ? detalleDTO.getSemilla() : (i + 1);
            detalle.setSemilla(semilla);

            detRepository.save(detalle);
        }

        // 7. Generar alertas automáticas después de actualizar
        presupuestoService.generarAlertas(dto.getCodCia(), dto.getCodPyto());

        log.info("Comprobante actualizado exitosamente: {}", nroCp);
        return findById(codCia, codProveedor, nroCp);
    }

    public void cambiarEstado(Long codCia, Long codProveedor, String nroCp, String nuevoEstado) {
        log.debug("Cambiando estado del comprobante {} a {}", nroCp, nuevoEstado);

        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        cabecera.setCodEstado(nuevoEstado);

        // Si se marca como pagado (código '002'), actualizar fecha de abono
        if ("002".equals(nuevoEstado) && cabecera.getFecAbono() == null) {
            cabecera.setFecAbono(LocalDate.now());
        }

        cabRepository.save(cabecera);
        log.info("Estado del comprobante {} cambiado a {}", nroCp, nuevoEstado);
    }

    public BigDecimal getTotalPagadoByProyecto(Long codCia, Long codPyto) {
        BigDecimal total = cabRepository.getTotalPagadoByProyecto(codCia, codPyto);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Anula un comprobante (eliminación lógica)
     * Subtask 2.5
     *
     * @param codCia       Código de compañía
     * @param codProveedor Código de proveedor
     * @param nroCp        Número de comprobante
     * @param confirmarPagado Si es true, permite anular comprobantes en estado PAG
     */
    public void anular(Long codCia, Long codProveedor, String nroCp, boolean confirmarPagado) {
        log.info("Anulando comprobante: {}", nroCp);

        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        // Validar si está en estado PAG (código '002') y no se confirmó
        if ("002".equals(cabecera.getCodEstado()) && !confirmarPagado) {
            throw new ValidationException(
                    "Este comprobante ya fue pagado. Debe confirmar la anulación explícitamente.");
        }

        // Cambiar estado a ANU (Anulado - código '003')
        cabecera.setCodEstado("003");
        cabRepository.save(cabecera);

        // Generar alertas para actualizar el presupuesto disponible
        presupuestoService.generarAlertas(codCia, cabecera.getCodPyto());

        log.info("Comprobante anulado exitosamente: {}. Presupuesto restaurado.", nroCp);
    }

    // ==================== Métodos de validación privados ====================

    /**
     * Valida que no exista un comprobante duplicado
     * Subtask 2.2
     */
    private void validarDuplicado(Long codCia, Long codProveedor, String nroCp) {
        boolean existe = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .isPresent();

        if (existe) {
            throw new DuplicateComprobanteException(
                    String.format("Ya existe un comprobante con el número %s para el proveedor %d",
                            nroCp, codProveedor));
        }
    }

    /**
     * Valida que la suma de detalles coincida con el total de cabecera
     * Subtask 2.3
     */
    private void validarTotales(ComprobantePagoDTO dto) {
        BigDecimal totalDetalles = dto.getDetalles().stream()
                .map(ComprobantePagoDetalleDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalDetalles.compareTo(dto.getImpTotalMn()) != 0) {
            throw new ValidationException(
                    String.format("La suma de los detalles (S/ %.2f) no coincide con el total del comprobante (S/ %.2f)",
                            totalDetalles, dto.getImpTotalMn()));
        }
    }

    /**
     * Valida que los montos sean positivos y mayores a cero
     * Subtask 2.3
     */
    private void validarMontos(ComprobantePagoDTO dto) {
        // Validar total de cabecera
        if (dto.getImpTotalMn() == null || dto.getImpTotalMn().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("El importe total debe ser mayor a cero");
        }

        // Validar montos de detalles
        for (ComprobantePagoDetalleDTO detalle : dto.getDetalles()) {
            if (detalle.getImpTotalMn() == null || detalle.getImpTotalMn().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException(
                        String.format("El importe de la partida %d debe ser mayor a cero",
                                detalle.getCodPartida()));
            }

            if (detalle.getImpNetoMn() == null || detalle.getImpNetoMn().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException(
                        String.format("El importe neto de la partida %d debe ser mayor a cero",
                                detalle.getCodPartida()));
            }
        }
    }

    /**
     * Valida que las fechas sean válidas
     * Subtask 2.3
     */
    private void validarFechas(ComprobantePagoDTO dto) {
        if (dto.getFecCp() == null) {
            throw new ValidationException("La fecha de emisión es obligatoria");
        }

        // Validar que la fecha no sea futura
        if (dto.getFecCp().isAfter(LocalDate.now())) {
            throw new ValidationException("La fecha de emisión no puede ser posterior a la fecha actual");
        }
    }
}
