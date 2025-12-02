package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaDTO;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaDetDTO;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaPresupuestoDTO;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaPresupuestoDTO.ProyeccionMensual;
import com.proyectos.comprobantespago.dto.flujocaja.FlujoCajaPresupuestoDTO.ResumenAnual;
import com.proyectos.comprobantespago.entity.FlujoCaja;
import com.proyectos.comprobantespago.entity.FlujoCajaDet;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.repository.FlujoCajaDetRepository;
import com.proyectos.comprobantespago.repository.FlujoCajaRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para gestión de Flujo de Caja Presupuestario
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class FlujoCajaPresupuestoService {

    private final FlujoCajaRepository flujoCajaRepository;
    private final FlujoCajaDetRepository flujoCajaDetRepository;
    private final ProyectoRepository proyectoRepository;

    private static final String[] MESES = {
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };

    // ==================== FLUJO CAJA CABECERA ====================

    /**
     * Obtener todos los flujos de caja de una compañía
     */
    public List<FlujoCajaDTO> findByCodCia(Long codCia) {
        return flujoCajaRepository.findByCodCia(codCia).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener flujos de caja por proyecto
     */
    public List<FlujoCajaDTO> findByProyecto(Long codCia, Long codPyto) {
        return flujoCajaRepository.findByCodCiaAndCodPytoOrdenado(codCia, codPyto).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener flujos de caja por proyecto y tipo (I/E)
     */
    public List<FlujoCajaDTO> findByProyectoAndTipo(Long codCia, Long codPyto, String ingEgr) {
        return flujoCajaRepository.findByCodCiaAndCodPytoAndIngEgr(codCia, codPyto, ingEgr).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crear nuevo flujo de caja
     */
    @Transactional
    public FlujoCajaDTO create(FlujoCajaDTO dto) {
        FlujoCaja entity = toEntity(dto);
        FlujoCaja saved = flujoCajaRepository.save(entity);
        log.info("FlujoCaja creado: CIA={}, Proyecto={}, Partida={}",
                saved.getCodCia(), saved.getCodPyto(), saved.getCodPartida());
        return toDTO(saved);
    }

    /**
     * Actualizar flujo de caja existente
     */
    @Transactional
    public FlujoCajaDTO update(FlujoCaja.FlujoCajaId id, FlujoCajaDTO dto) {
        FlujoCaja existing = flujoCajaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlujoCaja no encontrado"));

        existing.setNivel(dto.getNivel());
        existing.setOrden(dto.getOrden());
        existing.setDesConcepto(dto.getDesConcepto());
        existing.setDesConceptoCorto(dto.getDesConceptoCorto());
        existing.setSemilla(dto.getSemilla());
        existing.setRaiz(dto.getRaiz());
        existing.setTabEstado(dto.getTabEstado());
        existing.setCodEstado(dto.getCodEstado());
        existing.setVigente(dto.getVigente());

        FlujoCaja updated = flujoCajaRepository.save(existing);
        log.info("FlujoCaja actualizado: CIA={}, Proyecto={}", updated.getCodCia(), updated.getCodPyto());
        return toDTO(updated);
    }

    /**
     * Eliminar flujo de caja
     */
    @Transactional
    public void delete(FlujoCaja.FlujoCajaId id) {
        if (!flujoCajaRepository.existsById(id)) {
            throw new ResourceNotFoundException("FlujoCaja no encontrado");
        }
        flujoCajaRepository.deleteById(id);
        log.info("FlujoCaja eliminado");
    }

    // ==================== FLUJO CAJA DETALLE ====================

    /**
     * Obtener detalle por año y proyecto
     */
    public List<FlujoCajaDetDTO> findDetalleByAnnoAndProyecto(Integer anno, Long codCia, Long codPyto) {
        return flujoCajaDetRepository.findByAnnoAndCodCiaAndCodPytoOrdenado(anno, codCia, codPyto).stream()
                .map(this::toDetDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener años disponibles para un proyecto
     */
    public List<Integer> findAnnosDisponibles(Long codCia, Long codPyto) {
        return flujoCajaDetRepository.findDistinctAnnosByCodCiaAndCodPyto(codCia, codPyto);
    }

    /**
     * Obtener años disponibles para una compañía
     */
    public List<Integer> findAnnosDisponiblesByCia(Long codCia) {
        return flujoCajaDetRepository.findDistinctAnnosByCodCia(codCia);
    }

    /**
     * Crear detalle de flujo de caja
     */
    @Transactional
    public FlujoCajaDetDTO createDetalle(FlujoCajaDetDTO dto) {
        FlujoCajaDet entity = toDetEntity(dto);
        // Calcular acumulados
        entity.setImpAcum(entity.getTotalPresupuestado());
        entity.setImpRealAcum(entity.getTotalReal());

        FlujoCajaDet saved = flujoCajaDetRepository.save(entity);
        log.info("FlujoCajaDet creado: Año={}, CIA={}, Proyecto={}",
                saved.getAnno(), saved.getCodCia(), saved.getCodPyto());
        return toDetDTO(saved);
    }

    /**
     * Actualizar detalle de flujo de caja
     */
    @Transactional
    public FlujoCajaDetDTO updateDetalle(FlujoCajaDet.FlujoCajaDetId id, FlujoCajaDetDTO dto) {
        FlujoCajaDet existing = flujoCajaDetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlujoCajaDet no encontrado"));

        // Actualizar valores presupuestados
        existing.setImpIni(dto.getImpIni());
        existing.setImpEne(dto.getImpEne());
        existing.setImpFeb(dto.getImpFeb());
        existing.setImpMar(dto.getImpMar());
        existing.setImpAbr(dto.getImpAbr());
        existing.setImpMay(dto.getImpMay());
        existing.setImpJun(dto.getImpJun());
        existing.setImpJul(dto.getImpJul());
        existing.setImpAgo(dto.getImpAgo());
        existing.setImpSep(dto.getImpSep());
        existing.setImpOct(dto.getImpOct());
        existing.setImpNov(dto.getImpNov());
        existing.setImpDic(dto.getImpDic());

        // Actualizar valores reales
        existing.setImpRealIni(dto.getImpRealIni());
        existing.setImpRealEne(dto.getImpRealEne());
        existing.setImpRealFeb(dto.getImpRealFeb());
        existing.setImpRealMar(dto.getImpRealMar());
        existing.setImpRealAbr(dto.getImpRealAbr());
        existing.setImpRealMay(dto.getImpRealMay());
        existing.setImpRealJun(dto.getImpRealJun());
        existing.setImpRealJul(dto.getImpRealJul());
        existing.setImpRealAgo(dto.getImpRealAgo());
        existing.setImpRealSep(dto.getImpRealSep());
        existing.setImpRealOct(dto.getImpRealOct());
        existing.setImpRealNov(dto.getImpRealNov());
        existing.setImpRealDic(dto.getImpRealDic());

        // Recalcular acumulados
        existing.setImpAcum(existing.getTotalPresupuestado());
        existing.setImpRealAcum(existing.getTotalReal());

        FlujoCajaDet updated = flujoCajaDetRepository.save(existing);
        log.info("FlujoCajaDet actualizado: Año={}, CIA={}", updated.getAnno(), updated.getCodCia());
        return toDetDTO(updated);
    }

    // ==================== REPORTE CONSOLIDADO ====================

    /**
     * Obtener reporte completo del flujo de caja presupuestario
     */
    public FlujoCajaPresupuestoDTO getReportePresupuesto(Long codCia, Long codPyto, Integer anno) {
        // Si no se especifica año, usar el actual
        if (anno == null) {
            anno = LocalDate.now().getYear();
        }

        // Obtener proyecto
        Proyecto proyecto = proyectoRepository.findByCodCiaAndCodPyto(codCia, codPyto).orElse(null);
        String nombreProyecto = proyecto != null ? proyecto.getNombPyto() : "Proyecto " + codPyto;

        // Obtener detalles por tipo
        List<FlujoCajaDet> ingresosEntities = flujoCajaDetRepository
                .findByAnnoAndCodCiaAndCodPytoAndIngEgr(anno, codCia, codPyto, "I");
        List<FlujoCajaDet> egresosEntities = flujoCajaDetRepository
                .findByAnnoAndCodCiaAndCodPytoAndIngEgr(anno, codCia, codPyto, "E");

        List<FlujoCajaDetDTO> detalleIngresos = ingresosEntities.stream()
                .map(this::toDetDTO)
                .collect(Collectors.toList());
        List<FlujoCajaDetDTO> detalleEgresos = egresosEntities.stream()
                .map(this::toDetDTO)
                .collect(Collectors.toList());

        // Calcular resúmenes
        ResumenAnual resumenIngresos = calcularResumen(ingresosEntities);
        ResumenAnual resumenEgresos = calcularResumen(egresosEntities);
        ResumenAnual resumenNeto = calcularResumenNeto(resumenIngresos, resumenEgresos);

        // Calcular proyecciones mensuales
        List<ProyeccionMensual> proyecciones = calcularProyeccionesMensuales(
                ingresosEntities, egresosEntities);

        return FlujoCajaPresupuestoDTO.builder()
                .anno(anno)
                .codCia(codCia)
                .codPyto(codPyto)
                .nombreProyecto(nombreProyecto)
                .resumenIngresos(resumenIngresos)
                .resumenEgresos(resumenEgresos)
                .resumenNeto(resumenNeto)
                .detalleIngresos(detalleIngresos)
                .detalleEgresos(detalleEgresos)
                .proyeccionesMensuales(proyecciones)
                .build();
    }

    // ==================== MÉTODOS AUXILIARES ====================

    private ResumenAnual calcularResumen(List<FlujoCajaDet> detalles) {
        BigDecimal totalPresupuestado = BigDecimal.ZERO;
        BigDecimal totalReal = BigDecimal.ZERO;
        BigDecimal[] presupuestoMeses = new BigDecimal[12];
        BigDecimal[] realMeses = new BigDecimal[12];

        for (int i = 0; i < 12; i++) {
            presupuestoMeses[i] = BigDecimal.ZERO;
            realMeses[i] = BigDecimal.ZERO;
        }

        for (FlujoCajaDet det : detalles) {
            totalPresupuestado = totalPresupuestado.add(det.getTotalPresupuestado());
            totalReal = totalReal.add(det.getTotalReal());

            presupuestoMeses[0] = presupuestoMeses[0].add(det.getImpEne());
            presupuestoMeses[1] = presupuestoMeses[1].add(det.getImpFeb());
            presupuestoMeses[2] = presupuestoMeses[2].add(det.getImpMar());
            presupuestoMeses[3] = presupuestoMeses[3].add(det.getImpAbr());
            presupuestoMeses[4] = presupuestoMeses[4].add(det.getImpMay());
            presupuestoMeses[5] = presupuestoMeses[5].add(det.getImpJun());
            presupuestoMeses[6] = presupuestoMeses[6].add(det.getImpJul());
            presupuestoMeses[7] = presupuestoMeses[7].add(det.getImpAgo());
            presupuestoMeses[8] = presupuestoMeses[8].add(det.getImpSep());
            presupuestoMeses[9] = presupuestoMeses[9].add(det.getImpOct());
            presupuestoMeses[10] = presupuestoMeses[10].add(det.getImpNov());
            presupuestoMeses[11] = presupuestoMeses[11].add(det.getImpDic());

            realMeses[0] = realMeses[0].add(det.getImpRealEne());
            realMeses[1] = realMeses[1].add(det.getImpRealFeb());
            realMeses[2] = realMeses[2].add(det.getImpRealMar());
            realMeses[3] = realMeses[3].add(det.getImpRealAbr());
            realMeses[4] = realMeses[4].add(det.getImpRealMay());
            realMeses[5] = realMeses[5].add(det.getImpRealJun());
            realMeses[6] = realMeses[6].add(det.getImpRealJul());
            realMeses[7] = realMeses[7].add(det.getImpRealAgo());
            realMeses[8] = realMeses[8].add(det.getImpRealSep());
            realMeses[9] = realMeses[9].add(det.getImpRealOct());
            realMeses[10] = realMeses[10].add(det.getImpRealNov());
            realMeses[11] = realMeses[11].add(det.getImpRealDic());
        }

        BigDecimal variacion = totalReal.subtract(totalPresupuestado);
        Double variacionPorcentual = totalPresupuestado.compareTo(BigDecimal.ZERO) != 0
                ? variacion.divide(totalPresupuestado, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue()
                : 0.0;

        return ResumenAnual.builder()
                .totalPresupuestado(totalPresupuestado)
                .totalReal(totalReal)
                .variacion(variacion)
                .variacionPorcentual(variacionPorcentual)
                .presupuestoEne(presupuestoMeses[0]).realEne(realMeses[0])
                .presupuestoFeb(presupuestoMeses[1]).realFeb(realMeses[1])
                .presupuestoMar(presupuestoMeses[2]).realMar(realMeses[2])
                .presupuestoAbr(presupuestoMeses[3]).realAbr(realMeses[3])
                .presupuestoMay(presupuestoMeses[4]).realMay(realMeses[4])
                .presupuestoJun(presupuestoMeses[5]).realJun(realMeses[5])
                .presupuestoJul(presupuestoMeses[6]).realJul(realMeses[6])
                .presupuestoAgo(presupuestoMeses[7]).realAgo(realMeses[7])
                .presupuestoSep(presupuestoMeses[8]).realSep(realMeses[8])
                .presupuestoOct(presupuestoMeses[9]).realOct(realMeses[9])
                .presupuestoNov(presupuestoMeses[10]).realNov(realMeses[10])
                .presupuestoDic(presupuestoMeses[11]).realDic(realMeses[11])
                .build();
    }

    private ResumenAnual calcularResumenNeto(ResumenAnual ingresos, ResumenAnual egresos) {
        BigDecimal totalPresupuestado = ingresos.getTotalPresupuestado().subtract(egresos.getTotalPresupuestado());
        BigDecimal totalReal = ingresos.getTotalReal().subtract(egresos.getTotalReal());
        BigDecimal variacion = totalReal.subtract(totalPresupuestado);
        Double variacionPorcentual = totalPresupuestado.compareTo(BigDecimal.ZERO) != 0
                ? variacion.divide(totalPresupuestado.abs(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue()
                : 0.0;

        return ResumenAnual.builder()
                .totalPresupuestado(totalPresupuestado)
                .totalReal(totalReal)
                .variacion(variacion)
                .variacionPorcentual(variacionPorcentual)
                .presupuestoEne(safe(ingresos.getPresupuestoEne()).subtract(safe(egresos.getPresupuestoEne())))
                .realEne(safe(ingresos.getRealEne()).subtract(safe(egresos.getRealEne())))
                .presupuestoFeb(safe(ingresos.getPresupuestoFeb()).subtract(safe(egresos.getPresupuestoFeb())))
                .realFeb(safe(ingresos.getRealFeb()).subtract(safe(egresos.getRealFeb())))
                .presupuestoMar(safe(ingresos.getPresupuestoMar()).subtract(safe(egresos.getPresupuestoMar())))
                .realMar(safe(ingresos.getRealMar()).subtract(safe(egresos.getRealMar())))
                .presupuestoAbr(safe(ingresos.getPresupuestoAbr()).subtract(safe(egresos.getPresupuestoAbr())))
                .realAbr(safe(ingresos.getRealAbr()).subtract(safe(egresos.getRealAbr())))
                .presupuestoMay(safe(ingresos.getPresupuestoMay()).subtract(safe(egresos.getPresupuestoMay())))
                .realMay(safe(ingresos.getRealMay()).subtract(safe(egresos.getRealMay())))
                .presupuestoJun(safe(ingresos.getPresupuestoJun()).subtract(safe(egresos.getPresupuestoJun())))
                .realJun(safe(ingresos.getRealJun()).subtract(safe(egresos.getRealJun())))
                .presupuestoJul(safe(ingresos.getPresupuestoJul()).subtract(safe(egresos.getPresupuestoJul())))
                .realJul(safe(ingresos.getRealJul()).subtract(safe(egresos.getRealJul())))
                .presupuestoAgo(safe(ingresos.getPresupuestoAgo()).subtract(safe(egresos.getPresupuestoAgo())))
                .realAgo(safe(ingresos.getRealAgo()).subtract(safe(egresos.getRealAgo())))
                .presupuestoSep(safe(ingresos.getPresupuestoSep()).subtract(safe(egresos.getPresupuestoSep())))
                .realSep(safe(ingresos.getRealSep()).subtract(safe(egresos.getRealSep())))
                .presupuestoOct(safe(ingresos.getPresupuestoOct()).subtract(safe(egresos.getPresupuestoOct())))
                .realOct(safe(ingresos.getRealOct()).subtract(safe(egresos.getRealOct())))
                .presupuestoNov(safe(ingresos.getPresupuestoNov()).subtract(safe(egresos.getPresupuestoNov())))
                .realNov(safe(ingresos.getRealNov()).subtract(safe(egresos.getRealNov())))
                .presupuestoDic(safe(ingresos.getPresupuestoDic()).subtract(safe(egresos.getPresupuestoDic())))
                .realDic(safe(ingresos.getRealDic()).subtract(safe(egresos.getRealDic())))
                .build();
    }

    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private List<ProyeccionMensual> calcularProyeccionesMensuales(
            List<FlujoCajaDet> ingresos, List<FlujoCajaDet> egresos) {
        List<ProyeccionMensual> proyecciones = new ArrayList<>();

        BigDecimal[] ingPresup = sumarMeses(ingresos, true);
        BigDecimal[] ingReal = sumarMeses(ingresos, false);
        BigDecimal[] egrPresup = sumarMeses(egresos, true);
        BigDecimal[] egrReal = sumarMeses(egresos, false);

        for (int i = 0; i < 12; i++) {
            BigDecimal saldoPresup = ingPresup[i].subtract(egrPresup[i]);
            BigDecimal saldoReal = ingReal[i].subtract(egrReal[i]);

            Double cumplimientoIng = ingPresup[i].compareTo(BigDecimal.ZERO) != 0
                    ? ingReal[i].divide(ingPresup[i], 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100")).doubleValue()
                    : 0.0;
            Double cumplimientoEgr = egrPresup[i].compareTo(BigDecimal.ZERO) != 0
                    ? egrReal[i].divide(egrPresup[i], 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100")).doubleValue()
                    : 0.0;

            proyecciones.add(ProyeccionMensual.builder()
                    .mes(MESES[i])
                    .mesNumero(i + 1)
                    .ingresosPresupuestados(ingPresup[i])
                    .ingresosReales(ingReal[i])
                    .egresosPresupuestados(egrPresup[i])
                    .egresosReales(egrReal[i])
                    .saldoPresupuestado(saldoPresup)
                    .saldoReal(saldoReal)
                    .cumplimientoIngresos(cumplimientoIng)
                    .cumplimientoEgresos(cumplimientoEgr)
                    .build());
        }

        return proyecciones;
    }

    private BigDecimal[] sumarMeses(List<FlujoCajaDet> detalles, boolean presupuestado) {
        BigDecimal[] meses = new BigDecimal[12];
        for (int i = 0; i < 12; i++) {
            meses[i] = BigDecimal.ZERO;
        }

        for (FlujoCajaDet det : detalles) {
            if (presupuestado) {
                meses[0] = meses[0].add(det.getImpEne());
                meses[1] = meses[1].add(det.getImpFeb());
                meses[2] = meses[2].add(det.getImpMar());
                meses[3] = meses[3].add(det.getImpAbr());
                meses[4] = meses[4].add(det.getImpMay());
                meses[5] = meses[5].add(det.getImpJun());
                meses[6] = meses[6].add(det.getImpJul());
                meses[7] = meses[7].add(det.getImpAgo());
                meses[8] = meses[8].add(det.getImpSep());
                meses[9] = meses[9].add(det.getImpOct());
                meses[10] = meses[10].add(det.getImpNov());
                meses[11] = meses[11].add(det.getImpDic());
            } else {
                meses[0] = meses[0].add(det.getImpRealEne());
                meses[1] = meses[1].add(det.getImpRealFeb());
                meses[2] = meses[2].add(det.getImpRealMar());
                meses[3] = meses[3].add(det.getImpRealAbr());
                meses[4] = meses[4].add(det.getImpRealMay());
                meses[5] = meses[5].add(det.getImpRealJun());
                meses[6] = meses[6].add(det.getImpRealJul());
                meses[7] = meses[7].add(det.getImpRealAgo());
                meses[8] = meses[8].add(det.getImpRealSep());
                meses[9] = meses[9].add(det.getImpRealOct());
                meses[10] = meses[10].add(det.getImpRealNov());
                meses[11] = meses[11].add(det.getImpRealDic());
            }
        }

        return meses;
    }

    // ==================== MAPPERS ====================

    private FlujoCajaDTO toDTO(FlujoCaja entity) {
        return FlujoCajaDTO.builder()
                .codCia(entity.getCodCia())
                .codPyto(entity.getCodPyto())
                .ingEgr(entity.getIngEgr())
                .tipo(entity.getTipo())
                .codPartida(entity.getCodPartida())
                .nivel(entity.getNivel())
                .orden(entity.getOrden())
                .desConcepto(entity.getDesConcepto())
                .desConceptoCorto(entity.getDesConceptoCorto())
                .semilla(entity.getSemilla())
                .raiz(entity.getRaiz())
                .tabEstado(entity.getTabEstado())
                .codEstado(entity.getCodEstado())
                .vigente(entity.getVigente())
                .nombreProyecto(entity.getProyecto() != null ? entity.getProyecto().getNombPyto() : null)
                .nombrePartida(entity.getPartida() != null ? entity.getPartida().getDesPartida() : null)
                .tipoDescripcion("I".equals(entity.getIngEgr()) ? "Ingreso" : "Egreso")
                .build();
    }

    private FlujoCaja toEntity(FlujoCajaDTO dto) {
        return FlujoCaja.builder()
                .codCia(dto.getCodCia())
                .codPyto(dto.getCodPyto())
                .ingEgr(dto.getIngEgr())
                .tipo(dto.getTipo())
                .codPartida(dto.getCodPartida())
                .nivel(dto.getNivel())
                .orden(dto.getOrden())
                .desConcepto(dto.getDesConcepto())
                .desConceptoCorto(dto.getDesConceptoCorto())
                .semilla(dto.getSemilla())
                .raiz(dto.getRaiz())
                .tabEstado(dto.getTabEstado())
                .codEstado(dto.getCodEstado())
                .vigente(dto.getVigente() != null ? dto.getVigente() : "1")
                .build();
    }

    private FlujoCajaDetDTO toDetDTO(FlujoCajaDet entity) {
        FlujoCajaDetDTO dto = FlujoCajaDetDTO.builder()
                .anno(entity.getAnno())
                .codCia(entity.getCodCia())
                .codPyto(entity.getCodPyto())
                .ingEgr(entity.getIngEgr())
                .tipo(entity.getTipo())
                .codPartida(entity.getCodPartida())
                .orden(entity.getOrden())
                .impIni(entity.getImpIni())
                .impEne(entity.getImpEne())
                .impFeb(entity.getImpFeb())
                .impMar(entity.getImpMar())
                .impAbr(entity.getImpAbr())
                .impMay(entity.getImpMay())
                .impJun(entity.getImpJun())
                .impJul(entity.getImpJul())
                .impAgo(entity.getImpAgo())
                .impSep(entity.getImpSep())
                .impOct(entity.getImpOct())
                .impNov(entity.getImpNov())
                .impDic(entity.getImpDic())
                .impAcum(entity.getImpAcum())
                .impRealIni(entity.getImpRealIni())
                .impRealEne(entity.getImpRealEne())
                .impRealFeb(entity.getImpRealFeb())
                .impRealMar(entity.getImpRealMar())
                .impRealAbr(entity.getImpRealAbr())
                .impRealMay(entity.getImpRealMay())
                .impRealJun(entity.getImpRealJun())
                .impRealJul(entity.getImpRealJul())
                .impRealAgo(entity.getImpRealAgo())
                .impRealSep(entity.getImpRealSep())
                .impRealOct(entity.getImpRealOct())
                .impRealNov(entity.getImpRealNov())
                .impRealDic(entity.getImpRealDic())
                .impRealAcum(entity.getImpRealAcum())
                .totalPresupuestado(entity.getTotalPresupuestado())
                .totalReal(entity.getTotalReal())
                .variacion(entity.getTotalReal().subtract(entity.getTotalPresupuestado()))
                .variacionPorcentual(entity.getVariacionPorcentual())
                .tipoDescripcion("I".equals(entity.getIngEgr()) ? "Ingreso" : "Egreso")
                .build();

        if (entity.getFlujoCaja() != null) {
            dto.setDesConcepto(entity.getFlujoCaja().getDesConcepto());
        }

        return dto;
    }

    private FlujoCajaDet toDetEntity(FlujoCajaDetDTO dto) {
        return FlujoCajaDet.builder()
                .anno(dto.getAnno())
                .codCia(dto.getCodCia())
                .codPyto(dto.getCodPyto())
                .ingEgr(dto.getIngEgr())
                .tipo(dto.getTipo())
                .codPartida(dto.getCodPartida())
                .orden(dto.getOrden())
                .impIni(dto.getImpIni() != null ? dto.getImpIni() : BigDecimal.ZERO)
                .impEne(dto.getImpEne() != null ? dto.getImpEne() : BigDecimal.ZERO)
                .impFeb(dto.getImpFeb() != null ? dto.getImpFeb() : BigDecimal.ZERO)
                .impMar(dto.getImpMar() != null ? dto.getImpMar() : BigDecimal.ZERO)
                .impAbr(dto.getImpAbr() != null ? dto.getImpAbr() : BigDecimal.ZERO)
                .impMay(dto.getImpMay() != null ? dto.getImpMay() : BigDecimal.ZERO)
                .impJun(dto.getImpJun() != null ? dto.getImpJun() : BigDecimal.ZERO)
                .impJul(dto.getImpJul() != null ? dto.getImpJul() : BigDecimal.ZERO)
                .impAgo(dto.getImpAgo() != null ? dto.getImpAgo() : BigDecimal.ZERO)
                .impSep(dto.getImpSep() != null ? dto.getImpSep() : BigDecimal.ZERO)
                .impOct(dto.getImpOct() != null ? dto.getImpOct() : BigDecimal.ZERO)
                .impNov(dto.getImpNov() != null ? dto.getImpNov() : BigDecimal.ZERO)
                .impDic(dto.getImpDic() != null ? dto.getImpDic() : BigDecimal.ZERO)
                .impRealIni(dto.getImpRealIni() != null ? dto.getImpRealIni() : BigDecimal.ZERO)
                .impRealEne(dto.getImpRealEne() != null ? dto.getImpRealEne() : BigDecimal.ZERO)
                .impRealFeb(dto.getImpRealFeb() != null ? dto.getImpRealFeb() : BigDecimal.ZERO)
                .impRealMar(dto.getImpRealMar() != null ? dto.getImpRealMar() : BigDecimal.ZERO)
                .impRealAbr(dto.getImpRealAbr() != null ? dto.getImpRealAbr() : BigDecimal.ZERO)
                .impRealMay(dto.getImpRealMay() != null ? dto.getImpRealMay() : BigDecimal.ZERO)
                .impRealJun(dto.getImpRealJun() != null ? dto.getImpRealJun() : BigDecimal.ZERO)
                .impRealJul(dto.getImpRealJul() != null ? dto.getImpRealJul() : BigDecimal.ZERO)
                .impRealAgo(dto.getImpRealAgo() != null ? dto.getImpRealAgo() : BigDecimal.ZERO)
                .impRealSep(dto.getImpRealSep() != null ? dto.getImpRealSep() : BigDecimal.ZERO)
                .impRealOct(dto.getImpRealOct() != null ? dto.getImpRealOct() : BigDecimal.ZERO)
                .impRealNov(dto.getImpRealNov() != null ? dto.getImpRealNov() : BigDecimal.ZERO)
                .impRealDic(dto.getImpRealDic() != null ? dto.getImpRealDic() : BigDecimal.ZERO)
                .build();
    }
}
