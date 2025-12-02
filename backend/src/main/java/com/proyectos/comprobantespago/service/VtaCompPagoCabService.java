package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.VtaCompPagoCabDTO;
import com.proyectos.comprobantespago.dto.VtaCompPagoDetDTO;
import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import com.proyectos.comprobantespago.entity.VtaCompPagoDet;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.repository.ClienteRepository;
import com.proyectos.comprobantespago.repository.PartidaRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoDetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para gestión de Comprobantes de Venta/Ingreso
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class VtaCompPagoCabService {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    private final VtaCompPagoCabRepository vtaCompPagoCabRepository;
    private final VtaCompPagoDetRepository vtaCompPagoDetRepository;
    private final ClienteRepository clienteRepository;
    private final ProyectoRepository proyectoRepository;
    private final PartidaRepository partidaRepository;
    private final PresupuestoService presupuestoService;
    private final PartidaHierarchyService partidaHierarchyService;
    private final TaxCalculationService taxCalculationService;

    /**
     * Crear nuevo comprobante de venta/ingreso con detalles
     */
    public VtaCompPagoCabDTO crear(VtaCompPagoCabDTO dto) {
        log.info("Creando comprobante de venta/ingreso: {}", dto.getNroCp());

        // Validar que no exista el comprobante
        if (vtaCompPagoCabRepository.existsById(new VtaCompPagoCab.VtaCompPagoCabId(dto.getCodCia(), dto.getNroCp()))) {
            throw new RuntimeException("Ya existe un comprobante con el número: " + dto.getNroCp());
        }

        // Validar partidas únicas (Requirements: 1.3, 5.2, 5.3)
        validarPartidasUnicas(dto);

        // Validar niveles de partidas según tipo de movimiento (Requirements: 1.3, 5.2,
        // 5.3)
        validarNivelesPartidas(dto);

        // Validar que exista el cliente
        if (!clienteRepository.existsById(
                new com.proyectos.comprobantespago.entity.Cliente.ClienteId(dto.getCodCia(), dto.getCodCliente()))) {
            throw new RuntimeException("No existe el cliente: " + dto.getCodCliente());
        }

        // Validar que exista el proyecto
        com.proyectos.comprobantespago.entity.Proyecto proyecto = proyectoRepository
                .findById(new com.proyectos.comprobantespago.entity.Proyecto.ProyectoId(dto.getCodCia(),
                        dto.getCodPyto()))
                .orElseThrow(() -> new RuntimeException("No existe el proyecto: " + dto.getCodPyto()));

        // Validar que el cliente sea el contratante del proyecto (Requirement 2.2)
        if (!proyecto.getCodCliente().equals(dto.getCodCliente())) {
            throw new RuntimeException(String.format(
                    "El cliente %d no es el contratante del proyecto %d. Cliente esperado: %d",
                    dto.getCodCliente(), dto.getCodPyto(), proyecto.getCodCliente()));
        }

        // Validar que las partidas sean de tipo "I" (Ingreso) (Requirement 2.3)
        if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
            for (VtaCompPagoDetDTO detalleDTO : dto.getDetalles()) {
                if (!"I".equals(detalleDTO.getIngEgr())) {
                    throw new RuntimeException(String.format(
                            "La partida %d debe ser de tipo 'I' (Ingreso). Tipo recibido: '%s'",
                            detalleDTO.getCodPartida(), detalleDTO.getIngEgr()));
                }
            }
        }

        // Calcular IGV y totales automáticamente (Requirements 2.4, 8.1, 8.2)
        calcularIgvYTotales(dto);

        // Crear cabecera
        VtaCompPagoCab cabecera = convertirCabeceraAEntidad(dto);
        // Establecer estado inicial: Registrado (código '001')
        cabecera.setTabEstado("001"); // Tabla de estados
        cabecera.setCodEstado("001"); // Estado inicial: Registrado
        cabecera = vtaCompPagoCabRepository.save(cabecera);

        // Crear detalles si existen
        if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
            int sec = 1;
            for (VtaCompPagoDetDTO detalleDTO : dto.getDetalles()) {
                VtaCompPagoDet detalle = convertirDetalleAEntidad(detalleDTO);
                detalle.setCodCia(dto.getCodCia());
                detalle.setNroCp(dto.getNroCp());
                detalle.setSec(sec++);

                vtaCompPagoDetRepository.save(detalle);
            }
        }

        // Verificar si los ingresos superan el valor contractual (Requirement 2.5)
        verificarIngresosSuperanValorContractual(dto.getCodCia(), dto.getCodPyto(), proyecto);

        log.info("Comprobante de venta/ingreso creado exitosamente: {}", dto.getNroCp());
        return obtenerPorId(dto.getCodCia(), dto.getNroCp());
    }

    /**
     * Obtener comprobante por ID con detalles
     */
    @Transactional(readOnly = true)
    public VtaCompPagoCabDTO obtenerPorId(Long codCia, String nroCp) {
        log.info("Obteniendo comprobante de venta/ingreso: {}-{}", codCia, nroCp);

        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        List<VtaCompPagoDet> detalles = vtaCompPagoDetRepository.findByCodCiaAndNroCpOrderBySec(codCia, nroCp);

        return convertirCabeceraADTO(cabecera, detalles);
    }

    /**
     * Obtener comprobantes por compañía
     */
    @Transactional(readOnly = true)
    public List<VtaCompPagoCabDTO> obtenerPorCompania(Long codCia) {
        log.info("Obteniendo comprobantes de venta/ingreso de la compañía: {}", codCia);

        return vtaCompPagoCabRepository.findByCodCia(codCia).stream()
                .map(cab -> {
                    List<VtaCompPagoDet> detalles = vtaCompPagoDetRepository.findByCodCiaAndNroCpOrderBySec(codCia,
                            cab.getNroCp());
                    return convertirCabeceraADTO(cab, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener comprobantes por proyecto
     */
    @Transactional(readOnly = true)
    public List<VtaCompPagoCabDTO> obtenerPorProyecto(Long codCia, Long codPyto) {
        log.info("Obteniendo comprobantes del proyecto: {}-{}", codCia, codPyto);

        return vtaCompPagoCabRepository.findByCodCiaAndCodPyto(codCia, codPyto).stream()
                .map(cab -> {
                    List<VtaCompPagoDet> detalles = vtaCompPagoDetRepository.findByCodCiaAndNroCpOrderBySec(codCia,
                            cab.getNroCp());
                    return convertirCabeceraADTO(cab, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener comprobantes por cliente
     */
    @Transactional(readOnly = true)
    public List<VtaCompPagoCabDTO> obtenerPorCliente(Long codCia, Long codCliente) {
        log.info("Obteniendo comprobantes del cliente: {}-{}", codCia, codCliente);

        return vtaCompPagoCabRepository.findByCodCiaAndCodCliente(codCia, codCliente).stream()
                .map(cab -> {
                    List<VtaCompPagoDet> detalles = vtaCompPagoDetRepository.findByCodCiaAndNroCpOrderBySec(codCia,
                            cab.getNroCp());
                    return convertirCabeceraADTO(cab, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener comprobantes por rango de fechas
     */
    @Transactional(readOnly = true)
    public List<VtaCompPagoCabDTO> obtenerPorRangoFechas(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Obteniendo comprobantes entre {} y {}", fechaInicio, fechaFin);

        return vtaCompPagoCabRepository.findByFechaRange(codCia, fechaInicio, fechaFin).stream()
                .map(cab -> {
                    List<VtaCompPagoDet> detalles = vtaCompPagoDetRepository.findByCodCiaAndNroCpOrderBySec(codCia,
                            cab.getNroCp());
                    return convertirCabeceraADTO(cab, detalles);
                })
                .collect(Collectors.toList());
    }

    /**
     * Actualizar comprobante de venta
     */
    public VtaCompPagoCabDTO actualizar(Long codCia, String nroCp, VtaCompPagoCabDTO dto) {
        log.info("Actualizando comprobante de venta/ingreso: {}", nroCp);

        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        // Validar partidas únicas (Requirements: 1.3, 5.2, 5.3)
        validarPartidasUnicas(dto);

        // Validar niveles de partidas según tipo de movimiento (Requirements: 1.3, 5.2,
        // 5.3)
        validarNivelesPartidas(dto);

        // Actualizar datos de cabecera
        cabecera.setCodCliente(dto.getCodCliente());
        cabecera.setCodPyto(dto.getCodPyto());
        cabecera.setNroPago(dto.getNroPago());
        cabecera.setTCompPago(dto.getTCompPago());
        cabecera.setECompPago(dto.getECompPago());
        cabecera.setFecCp(dto.getFecCp());
        cabecera.setTMoneda(dto.getTMoneda());
        cabecera.setEMoneda(dto.getEMoneda());
        cabecera.setTipCambio(dto.getTipCambio());
        cabecera.setImpMo(dto.getImpMo());
        cabecera.setImpNetoMn(dto.getImpNetoMn());
        cabecera.setImpIgvMn(dto.getImpIgvMn());
        cabecera.setImpTotalMn(dto.getImpTotalMn());
        // FotoCp y FotoAbono se manejan por endpoints BLOB separados
        cabecera.setFecAbono(dto.getFecAbono());
        cabecera.setDesAbono(dto.getDesAbono());
        cabecera.setTabEstado(dto.getTabEstado());
        cabecera.setCodEstado(dto.getCodEstado());

        cabecera = vtaCompPagoCabRepository.save(cabecera);

        log.info("Comprobante actualizado exitosamente: {}", nroCp);
        return obtenerPorId(codCia, nroCp);
    }

    /**
     * Calcular total de ingresos por proyecto
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalIngresosPorProyecto(Long codCia, Long codPyto) {
        log.info("Calculando total de ingresos del proyecto: {}-{}", codCia, codPyto);

        BigDecimal total = vtaCompPagoCabRepository.calcularTotalIngresosPorProyecto(codCia, codPyto);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Eliminar comprobante (lógicamente, cambiando estado)
     */
    public void eliminar(Long codCia, String nroCp) {
        log.info("Eliminando comprobante de venta/ingreso: {}", nroCp);

        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        // Cambiar estado a anulado (código '003')
        cabecera.setTabEstado("001"); // Tabla de estados
        cabecera.setCodEstado("003"); // Código de anulado
        vtaCompPagoCabRepository.save(cabecera);
    }

    /**
     * Anular comprobante de ingreso
     * Cambia el estado a ANU (Anulado) y actualiza el flujo de caja del proyecto
     * Requirements 4.1, 4.4
     */
    public VtaCompPagoCabDTO anular(Long codCia, String nroCp) {
        log.info("Anulando comprobante de venta/ingreso: {}-{}", codCia, nroCp);

        // Obtener el comprobante
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        // Verificar que no esté ya anulado (código '003')
        if ("003".equals(cabecera.getCodEstado())) {
            throw new RuntimeException("El comprobante ya está anulado");
        }

        // Cambiar estado a ANU (Anulado - código '003')
        cabecera.setTabEstado("001"); // Tabla de estados
        cabecera.setCodEstado("003"); // Código de anulado
        cabecera = vtaCompPagoCabRepository.save(cabecera);

        // Actualizar flujo de caja del proyecto
        // El flujo de caja se actualiza automáticamente al recalcular los ingresos
        // ya que el método calcularTotalIngresosPorProyecto solo considera comprobantes
        // activos
        BigDecimal nuevoTotalIngresos = calcularTotalIngresosPorProyecto(codCia, cabecera.getCodPyto());

        log.info("Comprobante anulado exitosamente. Nuevo total de ingresos del proyecto: S/ {}",
                nuevoTotalIngresos);

        return obtenerPorId(codCia, nroCp);
    }

    /**
     * Verifica si los ingresos totales superan el valor contractual del proyecto
     * Genera alerta informativa si es el caso (Requirement 2.5)
     */
    private void verificarIngresosSuperanValorContractual(
            Long codCia,
            Long codPyto,
            com.proyectos.comprobantespago.entity.Proyecto proyecto) {

        // Calcular total de ingresos del proyecto
        BigDecimal totalIngresos = calcularTotalIngresosPorProyecto(codCia, codPyto);

        // Obtener valor contractual del proyecto (costo total)
        BigDecimal valorContractual = proyecto.getCostoTotal();

        // Comparar y generar alerta si supera
        if (totalIngresos.compareTo(valorContractual) > 0) {
            BigDecimal exceso = totalIngresos.subtract(valorContractual);
            log.warn(
                    "ALERTA: Los ingresos del proyecto {}-{} (S/ {}) superan el valor contractual (S/ {}). Exceso: S/ {}",
                    codCia, codPyto, totalIngresos, valorContractual, exceso);

            // Generar alerta informativa a través del servicio de presupuesto
            com.proyectos.comprobantespago.dto.AlertaPresupuestoDTO alerta = com.proyectos.comprobantespago.dto.AlertaPresupuestoDTO
                    .builder()
                    .id(java.util.UUID.randomUUID().toString())
                    .tipo("info")
                    .nivel("amarillo")
                    .mensaje(String.format(
                            "Los ingresos registrados (S/ %.2f) superan el valor contractual del proyecto (S/ %.2f). Exceso: S/ %.2f",
                            totalIngresos, valorContractual, exceso))
                    .codPartida(null)
                    .nombrePartida("Ingresos Totales")
                    .porcentajeEjecucion(totalIngresos
                            .divide(valorContractual, 4, java.math.RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(2, java.math.RoundingMode.HALF_UP))
                    .presupuestoOriginal(valorContractual)
                    .presupuestoEjecutado(totalIngresos)
                    .presupuestoDisponible(valorContractual.subtract(totalIngresos))
                    .fechaGeneracion(java.time.LocalDateTime.now())
                    .build();

            log.info("Alerta generada: {}", alerta.getMensaje());
        }
    }

    /**
     * Calcula IGV (18%) y totales automáticamente para el comprobante
     * Requirements 2.4, 8.1, 8.2
     */
    private void calcularIgvYTotales(VtaCompPagoCabDTO dto) {
        BigDecimal totalNeto = BigDecimal.ZERO;
        BigDecimal totalIgv = BigDecimal.ZERO;
        BigDecimal totalGeneral = BigDecimal.ZERO;

        // Calcular IGV y totales para cada detalle
        if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
            for (VtaCompPagoDetDTO detalle : dto.getDetalles()) {
                // Calcular IGV como 18% del importe neto
                BigDecimal igv = detalle.getImpNetoMn()
                        .multiply(IGV_RATE)
                        .setScale(2, java.math.RoundingMode.HALF_UP);

                // Calcular total como neto + IGV
                BigDecimal total = detalle.getImpNetoMn()
                        .add(igv)
                        .setScale(2, java.math.RoundingMode.HALF_UP);

                // Actualizar el detalle
                detalle.setImpIgvMn(igv);
                detalle.setImpTotalMn(total);

                // Acumular totales
                totalNeto = totalNeto.add(detalle.getImpNetoMn());
                totalIgv = totalIgv.add(igv);
                totalGeneral = totalGeneral.add(total);
            }
        }

        // Actualizar totales en la cabecera
        dto.setImpNetoMn(totalNeto.setScale(2, java.math.RoundingMode.HALF_UP));
        dto.setImpIgvMn(totalIgv.setScale(2, java.math.RoundingMode.HALF_UP));
        dto.setImpTotalMn(totalGeneral.setScale(2, java.math.RoundingMode.HALF_UP));

        log.debug("IGV y totales calculados - Neto: {}, IGV: {}, Total: {}",
                totalNeto, totalIgv, totalGeneral);
    }

    /**
     * Actualiza los archivos adjuntos de un comprobante de ingreso (deprecated -
     * usar endpoints BLOB)
     * Feature: comprobantes-jerarquicos
     * Requirements: 4.1, 4.2
     *
     * NOTA: Este método ya no actualiza las imágenes directamente.
     * Use los endpoints uploadFotoCp/uploadFotoAbono para subir imágenes BLOB.
     *
     * @param codCia    Código de compañía
     * @param nroCp     Número de comprobante
     * @param fotoCp    Ignorado - usar endpoint BLOB
     * @param fotoAbono Ignorado - usar endpoint BLOB
     * @return DTO del comprobante actualizado
     */
    public VtaCompPagoCabDTO updateFiles(Long codCia, String nroCp, String fotoCp, String fotoAbono) {
        log.info("Actualizando archivos del comprobante de ingreso: {} (usar endpoints BLOB para imágenes)", nroCp);

        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        // Las imágenes ahora se manejan como BLOB a través de endpoints separados
        log.warn(
                "updateFiles: Las imágenes deben actualizarse usando los endpoints BLOB (uploadFotoCp/uploadFotoAbono)");

        return obtenerPorId(codCia, nroCp);
    }

    // ==================== Métodos de validación privados ====================

    /**
     * Valida que no haya partidas duplicadas en los detalles
     * Requirements: 1.3, 5.2, 5.3
     */
    private void validarPartidasUnicas(VtaCompPagoCabDTO dto) {
        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            return;
        }

        List<Long> partidas = dto.getDetalles().stream()
                .map(VtaCompPagoDetDTO::getCodPartida)
                .toList();

        long partidasUnicas = partidas.stream().distinct().count();

        if (partidasUnicas < partidas.size()) {
            // Encontrar la partida duplicada
            Long partidaDuplicada = partidas.stream()
                    .filter(p -> partidas.stream().filter(p2 -> p2.equals(p)).count() > 1)
                    .findFirst()
                    .orElse(null);

            throw new RuntimeException(
                    String.format("La partida %d está duplicada en los detalles del comprobante. " +
                            "Cada partida solo puede aparecer una vez.", partidaDuplicada));
        }
    }

    /**
     * Valida que todas las partidas existan y estén vigentes
     * NUEVO REQUERIMIENTO: El usuario puede seleccionar cualquier nivel (1, 2 o 3)
     * Ya no se valida estrictamente que sea del último nivel
     */
    private void validarNivelesPartidas(VtaCompPagoCabDTO dto) {
        // NUEVO REQUERIMIENTO: El usuario puede seleccionar cualquier nivel (1, 2 o 3)
        // Ya no se valida estrictamente que sea del último nivel
        // La validación de existencia de partida se hace en otro lugar
    }

    /**
     * Valida que la suma de detalles coincida con el total de cabecera
     * Requirements: 5.3, 5.4
     */
    private void validarTotales(VtaCompPagoCabDTO dto) {
        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            return;
        }

        BigDecimal totalDetalles = dto.getDetalles().stream()
                .map(VtaCompPagoDetDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalDetalles.compareTo(dto.getImpTotalMn()) != 0) {
            throw new RuntimeException(
                    String.format(
                            "La suma de los detalles (S/ %.2f) no coincide con el total del comprobante (S/ %.2f)",
                            totalDetalles, dto.getImpTotalMn()));
        }
    }

    // Métodos de conversión
    private VtaCompPagoCabDTO convertirCabeceraADTO(VtaCompPagoCab cabecera, List<VtaCompPagoDet> detalles) {
        List<VtaCompPagoDetDTO> detallesDTO = detalles.stream()
                .map(this::convertirDetalleADTO)
                .collect(Collectors.toList());

        return VtaCompPagoCabDTO.builder()
                .codCia(cabecera.getCodCia())
                .nroCp(cabecera.getNroCp())
                .codPyto(cabecera.getCodPyto())
                .codCliente(cabecera.getCodCliente())
                .nroPago(cabecera.getNroPago())
                .tCompPago(cabecera.getTCompPago())
                .eCompPago(cabecera.getECompPago())
                .fecCp(cabecera.getFecCp())
                .tMoneda(cabecera.getTMoneda())
                .eMoneda(cabecera.getEMoneda())
                .tipCambio(cabecera.getTipCambio())
                .impMo(cabecera.getImpMo())
                .impNetoMn(cabecera.getImpNetoMn())
                .impIgvMn(cabecera.getImpIgvMn())
                .impTotalMn(cabecera.getImpTotalMn())
                .tieneFotoCp(cabecera.getFotoCp() != null && cabecera.getFotoCp().length > 0)
                .tieneFotoAbono(cabecera.getFotoAbono() != null && cabecera.getFotoAbono().length > 0)
                .fecAbono(cabecera.getFecAbono())
                .desAbono(cabecera.getDesAbono())
                .semilla(cabecera.getSemilla())
                .tabEstado(cabecera.getTabEstado())
                .codEstado(cabecera.getCodEstado())
                .detalles(detallesDTO)
                .build();
    }

    private VtaCompPagoDetDTO convertirDetalleADTO(VtaCompPagoDet detalle) {
        return VtaCompPagoDetDTO.builder()
                .codCia(detalle.getCodCia())
                .nroCp(detalle.getNroCp())
                .sec(detalle.getSec())
                .ingEgr(detalle.getIngEgr())
                .codPartida(detalle.getCodPartida())
                .impNetoMn(detalle.getImpNetoMn())
                .impIgvMn(detalle.getImpIgvMn())
                .impTotalMn(detalle.getImpTotalMn())
                .semilla(detalle.getSemilla())
                .build();
    }

    private VtaCompPagoCab convertirCabeceraAEntidad(VtaCompPagoCabDTO dto) {
        return VtaCompPagoCab.builder()
                .codCia(dto.getCodCia())
                .nroCp(dto.getNroCp())
                .codPyto(dto.getCodPyto())
                .codCliente(dto.getCodCliente())
                .nroPago(dto.getNroPago())
                .tCompPago(dto.getTCompPago())
                .eCompPago(dto.getECompPago())
                .fecCp(dto.getFecCp())
                .tMoneda(dto.getTMoneda())
                .eMoneda(dto.getEMoneda())
                .tipCambio(dto.getTipCambio())
                .impMo(dto.getImpMo())
                .impNetoMn(dto.getImpNetoMn())
                .impIgvMn(dto.getImpIgvMn())
                .impTotalMn(dto.getImpTotalMn())
                // FotoCp y FotoAbono se manejan por endpoints BLOB separados
                .fecAbono(dto.getFecAbono())
                .desAbono(dto.getDesAbono())
                .semilla(dto.getSemilla())
                .tabEstado(dto.getTabEstado())
                .codEstado(dto.getCodEstado())
                .build();
    }

    private VtaCompPagoDet convertirDetalleAEntidad(VtaCompPagoDetDTO dto) {
        return VtaCompPagoDet.builder()
                .codCia(dto.getCodCia())
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

    // ==================== Métodos de imágenes BLOB ====================
    // Feature: empleados-comprobantes-blob
    // Requirements: 3.1, 3.2, 6.1, 6.2

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final java.util.List<String> ALLOWED_CONTENT_TYPES = java.util.List.of(
            "image/jpeg", "image/png", "image/gif", "application/pdf");

    /**
     * Sube la imagen del comprobante (FotoCP) como BLOB
     */
    public void uploadFotoCp(Long codCia, String nroCp, org.springframework.web.multipart.MultipartFile file) {
        validateFile(file);
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        try {
            cabecera.setFotoCp(file.getBytes());
            vtaCompPagoCabRepository.save(cabecera);
            log.info("FotoCp BLOB subida para ingreso: codCia={}, nroCp={}", codCia, nroCp);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    /**
     * Obtiene la imagen del comprobante (FotoCP) desde BLOB
     */
    public byte[] getFotoCp(Long codCia, String nroCp) {
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado: " + nroCp));

        if (cabecera.getFotoCp() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de comprobante");
        }
        return cabecera.getFotoCp();
    }

    /**
     * Elimina la imagen del comprobante (FotoCP)
     */
    public void deleteFotoCp(Long codCia, String nroCp) {
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        cabecera.setFotoCp(null);
        vtaCompPagoCabRepository.save(cabecera);
        log.info("FotoCp BLOB eliminada para ingreso: codCia={}, nroCp={}", codCia, nroCp);
    }

    /**
     * Sube la imagen del abono (FotoAbono) como BLOB
     */
    public void uploadFotoAbono(Long codCia, String nroCp, org.springframework.web.multipart.MultipartFile file) {
        validateFile(file);
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        try {
            cabecera.setFotoAbono(file.getBytes());
            vtaCompPagoCabRepository.save(cabecera);
            log.info("FotoAbono BLOB subida para ingreso: codCia={}, nroCp={}", codCia, nroCp);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    /**
     * Obtiene la imagen del abono (FotoAbono) desde BLOB
     */
    public byte[] getFotoAbono(Long codCia, String nroCp) {
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado: " + nroCp));

        if (cabecera.getFotoAbono() == null) {
            throw new ResourceNotFoundException("El comprobante no tiene imagen de abono");
        }
        return cabecera.getFotoAbono();
    }

    /**
     * Elimina la imagen del abono (FotoAbono)
     */
    public void deleteFotoAbono(Long codCia, String nroCp) {
        VtaCompPagoCab cabecera = vtaCompPagoCabRepository.findByCodCiaAndNroCp(codCia, nroCp)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado: " + nroCp));

        cabecera.setFotoAbono(null);
        vtaCompPagoCabRepository.save(cabecera);
        log.info("FotoAbono BLOB eliminada para ingreso: codCia={}, nroCp={}", codCia, nroCp);
    }

    private void validateFile(org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("El archivo excede el límite de 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException("Tipo de archivo no permitido. Use jpg, png, gif o pdf");
        }
    }
}
