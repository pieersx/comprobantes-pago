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
import com.proyectos.comprobantespago.repository.PartidaRepository;

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
    private final PartidaHierarchyService partidaHierarchyService;
    private final TaxCalculationService taxCalculationService;
    private final PartidaRepository partidaRepository;

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

        // 2. Validar partidas únicas en detalles (Requirements: 3.3)
        validarPartidasUnicas(dto);

        // 2.1 Validar niveles de partidas según tipo de movimiento (Requirements: 4.5,
        // 5.5)
        validarNivelesPartidas(dto);

        // 3. Validar totales y datos básicos (Subtask 2.3)
        validarTotales(dto);
        validarMontos(dto);
        validarFechas(dto);

        // 4. Validar presupuesto disponible (Subtask 2.1)
        ValidacionPresupuestoDTO validacion = presupuestoService.validarEgreso(
                dto.getCodCia(),
                dto.getCodPyto(),
                dto.getDetalles());

        log.info("Validación de presupuesto aprobada con {} alertas", validacion.getAlertas().size());

        // 5. Guardar cabecera
        ComprobantePagoCab cabecera = mapper.toEntity(dto);

        // Mapeo manual de campos problemáticos
        cabecera.setTCompPago(dto.getTCompPago());
        cabecera.setECompPago(dto.getECompPago());
        cabecera.setTMoneda(dto.getTMoneda());
        cabecera.setEMoneda(dto.getEMoneda());

        cabecera.setTabEstado("001"); // Tabla de estados
        cabecera.setCodEstado("001"); // Estado inicial: Registrado (código '001')
        cabecera = cabRepository.save(cabecera);

        // 6. Guardar detalles
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

        // 7. Generar alertas automáticas después de guardar (Subtask 2.1)
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

        // 3. Validar partidas únicas en detalles (Requirements: 3.3)
        validarPartidasUnicas(dto);

        // 3.1 Validar niveles de partidas según tipo de movimiento (Requirements: 4.5,
        // 5.5)
        validarNivelesPartidas(dto);

        // 4. Validar totales y datos básicos
        validarTotales(dto);
        validarMontos(dto);
        validarFechas(dto);

        // 5. Validar presupuesto con montos actualizados (Subtask 2.4)
        ValidacionPresupuestoDTO validacion = presupuestoService.validarEgreso(
                dto.getCodCia(),
                dto.getCodPyto(),
                dto.getDetalles());

        log.info("Validación de presupuesto aprobada para actualización con {} alertas",
                validacion.getAlertas().size());

        // 6. Actualizar cabecera
        mapper.updateEntityFromDTO(dto, cabecera);
        cabRepository.save(cabecera);

        // 7. Eliminar detalles antiguos y guardar nuevos
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

        // 8. Generar alertas automáticas después de actualizar
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
     * @param codCia          Código de compañía
     * @param codProveedor    Código de proveedor
     * @param nroCp           Número de comprobante
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

    /**
     * Registra un abono en un comprobante de pago
     * Actualiza el estado según corresponda:
     * - REGISTRADO -> PARCIALMENTE_PAGADO (si hay abono pero no es pago completo)
     * - REGISTRADO -> TOTALMENTE_PAGADO (si el abono es pago completo)
     * - PARCIALMENTE_PAGADO -> TOTALMENTE_PAGADO (si se completa el pago)
     */
    public ComprobantePagoDTO registrarAbono(Long codCia, Long codProveedor, String nroCp,
            com.proyectos.comprobantespago.dto.AbonoDTO abonoDTO) {
        log.info("Registrando abono para comprobante: {}", nroCp);

        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        // Validar que el estado permita abonos
        com.proyectos.comprobantespago.enums.EstadoComprobanteEnum estadoActual = com.proyectos.comprobantespago.enums.EstadoComprobanteEnum
                .fromCodigo(cabecera.getCodEstado());

        if (!estadoActual.permiteAbonos()) {
            throw new ValidationException(
                    String.format("El comprobante en estado '%s' no permite registrar abonos",
                            estadoActual.getDescripcion()));
        }

        // Actualizar datos del abono
        // FotoAbono se maneja por endpoints BLOB separados, no se actualiza aquí
        cabecera.setFecAbono(abonoDTO.getFechaAbono());
        cabecera.setDesAbono(abonoDTO.getDescripcionMedioPago());

        // Actualizar estado según monto del abono
        // Si el monto del abono es igual al total, está totalmente pagado
        boolean pagoCompleto = abonoDTO.getMontoAbono().compareTo(cabecera.getImpTotalMn()) >= 0;
        if (pagoCompleto) {
            cabecera.setCodEstado(
                    com.proyectos.comprobantespago.enums.EstadoComprobanteEnum.TOTALMENTE_PAGADO.getCodigo());
            log.info("Comprobante marcado como TOTALMENTE_PAGADO");
        } else {
            cabecera.setCodEstado(
                    com.proyectos.comprobantespago.enums.EstadoComprobanteEnum.PARCIALMENTE_PAGADO.getCodigo());
            log.info("Comprobante marcado como PARCIALMENTE_PAGADO");
        }

        cabRepository.save(cabecera);
        log.info("Abono registrado exitosamente para comprobante: {}", nroCp);

        return mapper.toDTO(cabecera);
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
     * Valida que no haya partidas duplicadas en los detalles
     * Requirements: 3.3
     */
    private void validarPartidasUnicas(ComprobantePagoDTO dto) {
        List<Long> partidas = dto.getDetalles().stream()
                .map(ComprobantePagoDetalleDTO::getCodPartida)
                .toList();

        long partidasUnicas = partidas.stream().distinct().count();

        if (partidasUnicas < partidas.size()) {
            // Encontrar la partida duplicada
            Long partidaDuplicada = partidas.stream()
                    .filter(p -> partidas.stream().filter(p2 -> p2.equals(p)).count() > 1)
                    .findFirst()
                    .orElse(null);

            throw new ValidationException(
                    String.format("La partida %d está duplicada en los detalles del comprobante. " +
                            "Cada partida solo puede aparecer una vez.", partidaDuplicada));
        }
    }

    /**
     * Valida que todas las partidas sean del último nivel según tipo de movimiento
     * Requirements: 4.5, 5.5
     * IMPORTANTE: Según el profesor (notas.txt), SOLO se usan partidas de NIVEL 3
     * "tú agarras el último nivel, el más bajo" - Tanto ingresos como egresos deben
     * ser nivel 3
     */
    private void validarNivelesPartidas(ComprobantePagoDTO dto) {
        // NUEVO REQUERIMIENTO: El usuario puede seleccionar cualquier nivel (1, 2 o 3)
        // Ya no se valida estrictamente que sea nivel 3
        // La validación ahora solo verifica que la partida exista y esté vigente

        for (ComprobantePagoDetalleDTO detalle : dto.getDetalles()) {
            String ingEgr = detalle.getIngEgr();
            Long codPartida = detalle.getCodPartida();

            // Solo validar que la partida existe y está vigente
            // No validar el nivel específico - el usuario puede elegir cualquier nivel
            boolean existePartida = partidaRepository.existsById(
                    new com.proyectos.comprobantespago.entity.Partida.PartidaId(
                            dto.getCodCia(), ingEgr, codPartida));

            if (!existePartida) {
                throw new ValidationException(
                        String.format("La partida %d no existe o no está vigente.", codPartida));
            }

            // Log informativo del nivel usado (no bloquea)
            log.info("Partida {} (Ing/Egr: {}) usada en comprobante - Nivel permitido",
                    codPartida, ingEgr);
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
                    String.format(
                            "La suma de los detalles (S/ %.2f) no coincide con el total del comprobante (S/ %.2f)",
                            totalDetalles, dto.getImpTotalMn()));
        }
    }

    /**
     * Valida que los montos sean positivos y mayores a cero
     * Subtask 2.3
     * Requirements: 2.5 - Para recibos por honorarios, validar que total >= 0
     */
    private void validarMontos(ComprobantePagoDTO dto) {
        // Validar total de cabecera
        // Para recibos por honorarios (REC), permitir total >= 0
        // Para otros tipos, total debe ser > 0
        boolean esReciboHonorarios = "REC".equals(dto.getECompPago());

        if (dto.getImpTotalMn() == null) {
            throw new ValidationException("El importe total no puede ser nulo");
        }

        if (esReciboHonorarios) {
            // Para recibos por honorarios, validar que total >= 0
            if (dto.getImpTotalMn().compareTo(BigDecimal.ZERO) < 0) {
                throw new ValidationException("El total del recibo por honorarios no puede ser negativo");
            }
        } else {
            // Para facturas y boletas, total debe ser > 0
            if (dto.getImpTotalMn().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException("El importe total debe ser mayor a cero");
            }
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

    /**
     * Calcula el impuesto según el tipo de comprobante
     */
    public com.proyectos.comprobantespago.dto.CalculoImpuestoResponse calcularImpuestoPorTipo(
            BigDecimal montoBase, String tipoComprobante) {

        log.debug("Calculando impuesto para tipo: {} con monto base: {}", tipoComprobante, montoBase);

        com.proyectos.comprobantespago.enums.TipoComprobanteEnum tipo = com.proyectos.comprobantespago.enums.TipoComprobanteEnum
                .fromCodigo(tipoComprobante);

        BigDecimal impuesto = taxCalculationService.calcularImpuestoPorTipo(montoBase, tipoComprobante);
        BigDecimal total = taxCalculationService.calcularTotalPorTipo(montoBase, impuesto, tipoComprobante);

        // Obtener porcentaje según tipo
        BigDecimal porcentaje = taxCalculationService.obtenerPorcentajeImpuesto(tipoComprobante);

        return com.proyectos.comprobantespago.dto.CalculoImpuestoResponse.builder()
                .tipoComprobante(tipo.getCodigo())
                .porcentaje(porcentaje)
                .igv(impuesto)
                .total(total)
                .esEditable(true) // Todos los impuestos son editables por redondeo SUNAT
                .build();
    }

    // ==================== Métodos públicos de validación ====================
    // Feature: comprobantes-mejoras
    // Requirements: 4.2, 7.1, 7.2, 7.4, 7.5

    /**
     * Valida que no haya partidas duplicadas en el detalle
     * Feature: comprobantes-mejoras
     * Requirements: 4.2
     */
    public boolean validarPartidasNoDuplicadas(List<ComprobantePagoDetalleDTO> detalles) {
        List<Long> partidas = detalles.stream()
                .map(ComprobantePagoDetalleDTO::getCodPartida)
                .toList();

        long partidasUnicas = partidas.stream().distinct().count();
        return partidasUnicas == partidas.size();
    }

    /**
     * Valida consistencia de totales
     * Feature: comprobantes-mejoras
     * Requirements: 7.2
     */
    public boolean validarConsistenciaTotales(ComprobantePagoDTO dto) {
        BigDecimal totalDetalles = dto.getDetalles().stream()
                .map(ComprobantePagoDetalleDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalDetalles.compareTo(dto.getImpTotalMn()) == 0;
    }

    /**
     * Valida que todos los campos obligatorios estén completos
     * Feature: comprobantes-mejoras
     * Requirements: 7.1
     */
    public boolean validarCamposObligatorios(ComprobantePagoDTO dto) {
        return dto.getCodCia() != null &&
                dto.getCodProveedor() != null &&
                dto.getNroCp() != null && !dto.getNroCp().trim().isEmpty() &&
                dto.getCodPyto() != null &&
                dto.getFecCp() != null &&
                dto.getTCompPago() != null && !dto.getTCompPago().trim().isEmpty() &&
                dto.getECompPago() != null && !dto.getECompPago().trim().isEmpty() &&
                dto.getDetalles() != null && !dto.getDetalles().isEmpty();
    }

    /**
     * Valida que las partidas seleccionadas pertenezcan al proyecto
     * Feature: comprobantes-mejoras
     * Requirements: 7.4
     */
    public boolean validarPartidasDelProyecto(ComprobantePagoDTO dto) {
        // Por ahora retornamos true ya que la validación completa requiere
        // acceso a PROY_PARTIDA_MEZCLA que se implementará en una tarea posterior
        // TODO: Implementar validación completa contra PROY_PARTIDA_MEZCLA
        return true;
    }

    /**
     * Valida que el número de comprobante no esté duplicado
     * Feature: comprobantes-mejoras
     * Requirements: 7.5
     */
    public boolean validarNumeroComprobanteUnico(Long codCia, Long codProveedor, String nroCp) {
        return !cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .isPresent();
    }

    // ==================== Métodos de cálculo y estado ====================
    // Feature: comprobantes-mejoras
    // Requirements: 2.1, 2.3, 2.4, 4.4, 4.5, 6.4

    /**
     * Calcula el IGV automático según el tipo de comprobante
     * Feature: comprobantes-mejoras
     * Requirements: 2.1
     */
    public BigDecimal calcularIGVAutomatico(String tipoComprobante, BigDecimal montoNeto) {
        if (montoNeto == null) {
            throw new ValidationException("El monto neto no puede ser nulo");
        }

        // Para FAC y BOL: IGV del 18%
        if ("FAC".equals(tipoComprobante) || "BOL".equals(tipoComprobante)) {
            return taxCalculationService.calcularIGV(montoNeto);
        }

        // Para REC y otros: 0 (debe ser ingresado manualmente)
        return BigDecimal.ZERO;
    }

    /**
     * Recalcula el total cuando se modifica el IGV manualmente
     * Feature: comprobantes-mejoras
     * Requirements: 2.3
     */
    public BigDecimal recalcularTotalConIGVManual(BigDecimal montoNeto, BigDecimal igvManual) {
        if (montoNeto == null || igvManual == null) {
            throw new ValidationException("El monto neto y el IGV no pueden ser nulos");
        }

        return taxCalculationService.calcularTotalConIGV(montoNeto, igvManual);
    }

    /**
     * Recalcula IGV y total cuando se modifica el monto neto
     * Feature: comprobantes-mejoras
     * Requirements: 2.4
     */
    public com.proyectos.comprobantespago.dto.CalculoImpuestoResponse recalcularImpuestos(
            String tipoComprobante, BigDecimal montoNeto) {

        return taxCalculationService.calcularImpuesto(tipoComprobante, montoNeto);
    }

    /**
     * Calcula la suma de todos los detalles
     * Feature: comprobantes-mejoras
     * Requirements: 4.4, 4.5
     */
    public BigDecimal calcularSumaDetalles(List<ComprobantePagoDetalleDTO> detalles) {
        if (detalles == null || detalles.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return detalles.stream()
                .map(ComprobantePagoDetalleDTO::getImpTotalMn)
                .filter(total -> total != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Actualiza el estado del comprobante según el monto abonado
     * Feature: comprobantes-mejoras
     * Requirements: 6.4
     */
    public String actualizarEstadoPorAbono(BigDecimal totalComprobante, BigDecimal montoAbonado) {
        if (totalComprobante == null || montoAbonado == null) {
            throw new ValidationException("El total y el monto abonado no pueden ser nulos");
        }

        // Si el monto abonado es mayor o igual al total, está totalmente pagado
        if (montoAbonado.compareTo(totalComprobante) >= 0) {
            return com.proyectos.comprobantespago.enums.EstadoComprobanteEnum.TOTALMENTE_PAGADO.getCodigo();
        }

        // Si el monto abonado es menor al total, está parcialmente pagado
        if (montoAbonado.compareTo(BigDecimal.ZERO) > 0) {
            return com.proyectos.comprobantespago.enums.EstadoComprobanteEnum.PARCIALMENTE_PAGADO.getCodigo();
        }

        // Si no hay abono, mantiene el estado registrado
        return com.proyectos.comprobantespago.enums.EstadoComprobanteEnum.REGISTRADO.getCodigo();
    }

    /**
     * Calcula el IGV con porcentaje personalizado (para recibos por honorarios)
     * Feature: comprobantes-mejoras
     * Requirements: 1.4
     */
    public com.proyectos.comprobantespago.dto.CalculoImpuestoResponse calcularIGVPersonalizado(
            BigDecimal montoNeto, BigDecimal porcentaje) {

        return taxCalculationService.calcularImpuestoPersonalizado(montoNeto, porcentaje);
    }

    /**
     * Actualiza los archivos adjuntos de un comprobante (deprecated - usar endpoints BLOB)
     * Feature: comprobantes-jerarquicos
     * Requirements: 4.1, 4.2
     *
     * NOTA: Este método ya no actualiza las imágenes directamente.
     * Use los endpoints uploadFotoCp/uploadFotoAbono para subir imágenes BLOB.
     *
     * @param codCia       Código de compañía
     * @param codProveedor Código de proveedor
     * @param nroCp        Número de comprobante
     * @param fotoCp       Ignorado - usar endpoint BLOB
     * @param fotoAbono    Ignorado - usar endpoint BLOB
     * @return DTO del comprobante actualizado
     */
    public ComprobantePagoDTO updateFiles(Long codCia, Long codProveedor, String nroCp,
            String fotoCp, String fotoAbono) {
        log.info("Actualizando archivos del comprobante: {} (usar endpoints BLOB para imágenes)", nroCp);

        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        // Las imágenes ahora se manejan como BLOB a través de endpoints separados
        // Este método solo retorna el DTO actual sin modificar las imágenes
        log.warn("updateFiles: Las imágenes deben actualizarse usando los endpoints BLOB (uploadFotoCp/uploadFotoAbono)");

        return mapper.toDTO(cabecera);
    }

    // ==================== Métodos de imágenes BLOB ====================
    // Feature: empleados-comprobantes-blob
    // Requirements: 3.1, 3.2, 6.1, 6.2

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final java.util.List<String> ALLOWED_CONTENT_TYPES = java.util.List.of(
        "image/jpeg", "image/png", "image/gif", "application/pdf"
    );

    /**
     * Sube la imagen del comprobante (FotoCP) como BLOB
     */
    public void uploadFotoCp(Long codCia, Long codProveedor, String nroCp, org.springframework.web.multipart.MultipartFile file) {
        validateFile(file);
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        try {
            cabecera.setFotoCp(file.getBytes());
            cabRepository.save(cabecera);
            log.info("FotoCp BLOB subida: codCia={}, codProveedor={}, nroCp={}", codCia, codProveedor, nroCp);
        } catch (java.io.IOException e) {
            throw new ValidationException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    /**
     * Obtiene la imagen del comprobante (FotoCP) desde BLOB
     */
    public byte[] getFotoCp(Long codCia, Long codProveedor, String nroCp) {
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        if (cabecera.getFotoCp() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de comprobante");
        }
        return cabecera.getFotoCp();
    }

    /**
     * Elimina la imagen del comprobante (FotoCP)
     */
    public void deleteFotoCp(Long codCia, Long codProveedor, String nroCp) {
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        cabecera.setFotoCp(null);
        cabRepository.save(cabecera);
        log.info("FotoCp BLOB eliminada: codCia={}, codProveedor={}, nroCp={}", codCia, codProveedor, nroCp);
    }

    /**
     * Sube la imagen del abono (FotoAbono) como BLOB
     */
    public void uploadFotoAbono(Long codCia, Long codProveedor, String nroCp, org.springframework.web.multipart.MultipartFile file) {
        validateFile(file);
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        try {
            cabecera.setFotoAbono(file.getBytes());
            cabRepository.save(cabecera);
            log.info("FotoAbono BLOB subida: codCia={}, codProveedor={}, nroCp={}", codCia, codProveedor, nroCp);
        } catch (java.io.IOException e) {
            throw new ValidationException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    /**
     * Obtiene la imagen del abono (FotoAbono) desde BLOB
     */
    public byte[] getFotoAbono(Long codCia, Long codProveedor, String nroCp) {
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        if (cabecera.getFotoAbono() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de abono");
        }
        return cabecera.getFotoAbono();
    }

    /**
     * Elimina la imagen del abono (FotoAbono)
     */
    public void deleteFotoAbono(Long codCia, Long codProveedor, String nroCp) {
        ComprobantePagoCab cabecera = cabRepository.findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));

        cabecera.setFotoAbono(null);
        cabRepository.save(cabecera);
        log.info("FotoAbono BLOB eliminada: codCia={}, codProveedor={}, nroCp={}", codCia, codProveedor, nroCp);
    }

    private void validateFile(org.springframework.web.multipart.MultipartFile file) {
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
}
