package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.cashflow.CashflowMovementDTO;
import com.proyectos.comprobantespago.dto.cashflow.CashflowProjectionDTO;
import com.proyectos.comprobantespago.dto.cashflow.CashflowResponseDTO;
import com.proyectos.comprobantespago.dto.cashflow.CashflowSummaryDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CashflowService {

    private static final Locale LOCALE_ES_PE = new Locale("es", "PE");
    private static final DateTimeFormatter PERIOD_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy", LOCALE_ES_PE);

    private final VtaCompPagoCabRepository vtaCompPagoCabRepository;
    private final ComprobantePagoCabRepository comprobantePagoCabRepository;

    public CashflowResponseDTO obtenerFlujoCaja(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        List<VtaCompPagoCab> ingresos = obtenerIngresos(codCia, fechaInicio, fechaFin);
        List<ComprobantePagoCab> egresos = obtenerEgresos(codCia, fechaInicio, fechaFin);

        List<Movimiento> movimientos = construirMovimientos(ingresos, egresos);
        TreeMap<YearMonth, MonthlyStats> monthlyStats = agruparPorMes(movimientos);

        CashflowSummaryDTO summary = construirResumen(monthlyStats);
        List<CashflowProjectionDTO> projections = construirProyecciones(monthlyStats);
        List<CashflowMovementDTO> movementDTOs = construirMovimientosDTO(movimientos);

        return CashflowResponseDTO.builder()
                .summary(summary)
                .projections(projections)
                .movements(movementDTOs)
                .build();
    }

    private List<VtaCompPagoCab> obtenerIngresos(Long codCia, LocalDate inicio, LocalDate fin) {
        if (inicio != null && fin != null) {
            log.debug("Obteniendo ingresos por rango: {} - {}", inicio, fin);
            return vtaCompPagoCabRepository.findByFechaRange(codCia, inicio, fin);
        }
        log.debug("Obteniendo todos los ingresos de la compañía {}", codCia);
        return vtaCompPagoCabRepository.findByCodCia(codCia);
    }

    private List<ComprobantePagoCab> obtenerEgresos(Long codCia, LocalDate inicio, LocalDate fin) {
        if (inicio != null && fin != null) {
            log.debug("Obteniendo egresos por rango: {} - {}", inicio, fin);
            return comprobantePagoCabRepository.findByFechaRange(codCia, inicio, fin);
        }
        log.debug("Obteniendo todos los egresos de la compañía {}", codCia);
        return comprobantePagoCabRepository.findByCodCia(codCia);
    }

    private List<Movimiento> construirMovimientos(List<VtaCompPagoCab> ingresos, List<ComprobantePagoCab> egresos) {
        List<Movimiento> movimientos = new ArrayList<>();

        for (VtaCompPagoCab ingreso : ingresos) {
            String proyecto = nombreProyecto(ingreso.getProyecto(), ingreso.getCodPyto());
            movimientos.add(new Movimiento(
                    "ING-" + ingreso.getNroCp(),
                    safeDate(ingreso.getFecCp()),
                    "Ingreso",
                    safeAmount(ingreso.getImpTotalMn()),
                    descripcionMovimiento(ingreso.getDesAbono(), proyecto, ingreso.getNroCp()),
                    proyecto,
                    ingreso.getNroCp()));
        }

        for (ComprobantePagoCab egreso : egresos) {
            String proyecto = nombreProyecto(egreso.getProyecto(), egreso.getCodPyto());
            movimientos.add(new Movimiento(
                    "EGR-" + egreso.getNroCp(),
                    safeDate(egreso.getFecCp()),
                    "Egreso",
                    safeAmount(egreso.getImpTotalMn()),
                    descripcionMovimiento(egreso.getDesAbono(), proyecto, egreso.getNroCp()),
                    proyecto,
                    egreso.getNroCp()));
        }

        return movimientos;
    }

    private TreeMap<YearMonth, MonthlyStats> agruparPorMes(List<Movimiento> movimientos) {
        TreeMap<YearMonth, MonthlyStats> stats = new TreeMap<>();
        for (Movimiento movimiento : movimientos) {
            YearMonth key = YearMonth.from(movimiento.fecha());
            MonthlyStats monthly = stats.computeIfAbsent(key, k -> new MonthlyStats());
            if ("Ingreso".equals(movimiento.tipo())) {
                monthly.ingresos = monthly.ingresos.add(movimiento.monto());
            } else {
                monthly.egresos = monthly.egresos.add(movimiento.monto());
            }
        }
        return stats;
    }

    private CashflowSummaryDTO construirResumen(TreeMap<YearMonth, MonthlyStats> monthlyStats) {
        YearMonth referencia = monthlyStats.isEmpty() ? YearMonth.now() : monthlyStats.lastKey();
        MonthlyStats actual = monthlyStats.getOrDefault(referencia, new MonthlyStats());
        YearMonth anteriorKey = monthlyStats.lowerKey(referencia);
        MonthlyStats anterior = anteriorKey != null ? monthlyStats.get(anteriorKey) : new MonthlyStats();

        BigDecimal saldoActual = actual.saldo();
        BigDecimal saldoPrevio = anterior.saldo();
        double variacion = calcularVariacion(saldoActual, saldoPrevio);

        return CashflowSummaryDTO.builder()
                .periodLabel(referencia.atDay(1).format(PERIOD_FORMATTER))
                .ingresos(actual.ingresos)
                .egresos(actual.egresos)
                .saldo(saldoActual)
                .variacion(variacion)
                .build();
    }

    private List<CashflowProjectionDTO> construirProyecciones(TreeMap<YearMonth, MonthlyStats> monthlyStats) {
        if (monthlyStats.isEmpty()) {
            return Collections.emptyList();
        }

        List<CashflowProjectionDTO> projections = new ArrayList<>();
        monthlyStats.descendingMap().entrySet().stream()
                .limit(6)
                .forEach(entry -> {
                    YearMonth month = entry.getKey();
                    MonthlyStats stats = entry.getValue();
                    projections.add(CashflowProjectionDTO.builder()
                            .mes(month.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, LOCALE_ES_PE))
                            .ingresos(stats.ingresos)
                            .egresos(stats.egresos)
                            .saldo(stats.saldo())
                            .build());
                });

        Collections.reverse(projections);
        return projections;
    }

    private List<CashflowMovementDTO> construirMovimientosDTO(List<Movimiento> movimientos) {
        if (movimientos.isEmpty()) {
            return Collections.emptyList();
        }

        List<Movimiento> ordenados = new ArrayList<>(movimientos);
        ordenados.sort((a, b) -> {
            int compare = a.fecha().compareTo(b.fecha());
            if (compare == 0) {
                return a.id().compareTo(b.id());
            }
            return compare;
        });

        BigDecimal saldo = BigDecimal.ZERO;
        List<CashflowMovementDTO> result = new ArrayList<>();
        for (Movimiento movimiento : ordenados) {
            if ("Ingreso".equals(movimiento.tipo())) {
                saldo = saldo.add(movimiento.monto());
            } else {
                saldo = saldo.subtract(movimiento.monto());
            }

            result.add(CashflowMovementDTO.builder()
                    .id(movimiento.id())
                    .fecha(movimiento.fecha().toString())
                    .concepto(movimiento.concepto())
                    .tipo(movimiento.tipo())
                    .monto(movimiento.monto())
                    .proyecto(movimiento.proyecto())
                    .saldo(saldo)
                    .referencia(movimiento.referencia())
                    .build());
        }

        Collections.reverse(result);
        return result;
    }

    private String nombreProyecto(Proyecto proyecto, Long codPyto) {
        if (proyecto != null && proyecto.getNombPyto() != null) {
            return proyecto.getNombPyto();
        }
        return "Proyecto " + (codPyto != null ? codPyto : "-");
    }

    private String descripcionMovimiento(String descripcion, String fallback, String referencia) {
        if (descripcion != null && !descripcion.isBlank()) {
            return descripcion;
        }
        if (fallback != null && !fallback.isBlank()) {
            return fallback;
        }
        return "Movimiento " + referencia;
    }

    private LocalDate safeDate(LocalDate date) {
        return date != null ? date : LocalDate.now();
    }

    private BigDecimal safeAmount(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private double calcularVariacion(BigDecimal actual, BigDecimal previo) {
        if (previo == null || previo.compareTo(BigDecimal.ZERO) == 0) {
            return 0d;
        }
        BigDecimal diferencia = actual.subtract(previo);
        BigDecimal ratio = diferencia.divide(previo.abs(), 6, RoundingMode.HALF_UP);
        return ratio.multiply(BigDecimal.valueOf(100)).doubleValue();
    }

    private static class MonthlyStats {
        private BigDecimal ingresos = BigDecimal.ZERO;
        private BigDecimal egresos = BigDecimal.ZERO;

        BigDecimal saldo() {
            return ingresos.subtract(egresos);
        }
    }

    private record Movimiento(String id, LocalDate fecha, String tipo, BigDecimal monto, String concepto,
            String proyecto, String referencia) {
    }
}
