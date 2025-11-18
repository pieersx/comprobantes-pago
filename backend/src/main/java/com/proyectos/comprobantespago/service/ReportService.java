package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.ComprobantePagoDTO;
import com.proyectos.comprobantespago.dto.VtaCompPagoCabDTO;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para generación de reportes financieros
 * Requisito 16: Reportes Financieros y Análisis
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReportService {

    private final ComprobantePagoCabRepository comprobantePagoCabRepository;
    private final VtaCompPagoCabRepository vtaCompPagoCabRepository;
    private final ProyectoRepository proyectoRepository;
    private final ComprobantePagoService comprobantePagoService;
    private final VtaCompPagoCabService vtaCompPagoCabService;

    /**
     * Reporte financiero por proyecto
     * Muestra presupuesto vs. real con análisis de varianza
     * Requisito 16.1
     */
    public Map<String, Object> reporteFinancieroProyecto(Long codCia, Long codPyto) {
        log.info("Generando reporte financiero para proyecto: {}-{}", codCia, codPyto);

        Proyecto proyecto = proyectoRepository
                .findById(new Proyecto.ProyectoId(codCia, codPyto))
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        // Obtener totales de egresos
        BigDecimal totalEgresos = comprobantePagoCabRepository.getTotalPagadoByProyecto(codCia, codPyto);
        if (totalEgresos == null) {
            totalEgresos = BigDecimal.ZERO;
        }

        // Obtener totales de ingresos
        BigDecimal totalIngresos = vtaCompPagoCabRepository.calcularTotalIngresosPorProyecto(codCia, codPyto);
        if (totalIngresos == null) {
            totalIngresos = BigDecimal.ZERO;
        }

        // Calcular ganancia
        BigDecimal ganancia = totalIngresos.subtract(totalEgresos);

        // Calcular porcentaje de ejecución
        BigDecimal porcentajeEjecucion = BigDecimal.ZERO;
        if (proyecto.getCostoTotal() != null && proyecto.getCostoTotal().compareTo(BigDecimal.ZERO) > 0) {
            porcentajeEjecucion = totalEgresos
                    .divide(proyecto.getCostoTotal(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }

        // Calcular varianza
        BigDecimal varianza = proyecto.getCostoTotal().subtract(totalEgresos);
        BigDecimal porcentajeVarianza = BigDecimal.ZERO;
        if (proyecto.getCostoTotal() != null && proyecto.getCostoTotal().compareTo(BigDecimal.ZERO) > 0) {
            porcentajeVarianza = varianza
                    .divide(proyecto.getCostoTotal(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("codPyto", codPyto);
        reporte.put("nombreProyecto", proyecto.getNombPyto());
        reporte.put("presupuestoOriginal", proyecto.getCostoTotal());
        reporte.put("totalEgresos", totalEgresos);
        reporte.put("totalIngresos", totalIngresos);
        reporte.put("ganancia", ganancia);
        reporte.put("presupuestoDisponible", varianza);
        reporte.put("porcentajeEjecucion", porcentajeEjecucion);
        reporte.put("porcentajeVarianza", porcentajeVarianza);
        reporte.put("estado", proyecto.getCodEstado());
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte financiero generado exitosamente");
        return reporte;
    }

    /**
     * Reporte de flujo de caja por proyecto
     * Muestra desembolsos planeados vs. reales
     * Requisito 16.2
     */
    public Map<String, Object> reporteFlujosCajaProyecto(Long codCia, Long codPyto, LocalDate fechaInicio,
            LocalDate fechaFin) {
        log.info("Generando reporte de flujo de caja para proyecto: {}-{}", codCia, codPyto);

        // Obtener comprobantes de egreso en el rango de fechas
        List<ComprobantePagoDTO> egresos = comprobantePagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .filter(c -> c.getCodPyto().equals(codPyto))
                .map(c -> comprobantePagoService.findById(codCia, c.getCodProveedor(), c.getNroCp()))
                .collect(Collectors.toList());

        // Obtener comprobantes de ingreso en el rango de fechas
        List<VtaCompPagoCabDTO> ingresos = vtaCompPagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .filter(c -> c.getCodPyto().equals(codPyto))
                .map(c -> vtaCompPagoCabService.obtenerPorId(codCia, c.getNroCp()))
                .collect(Collectors.toList());

        // Agrupar por mes
        Map<String, Map<String, BigDecimal>> flujosPorMes = new HashMap<>();

        for (ComprobantePagoDTO egreso : egresos) {
            String mes = egreso.getFecCp().getYear() + "-" + String.format("%02d", egreso.getFecCp().getMonthValue());
            flujosPorMes.computeIfAbsent(mes, k -> new HashMap<>())
                    .merge("egresos", egreso.getImpTotalMn(), BigDecimal::add);
        }

        for (VtaCompPagoCabDTO ingreso : ingresos) {
            String mes = ingreso.getFecCp().getYear() + "-" + String.format("%02d", ingreso.getFecCp().getMonthValue());
            flujosPorMes.computeIfAbsent(mes, k -> new HashMap<>())
                    .merge("ingresos", ingreso.getImpTotalMn(), BigDecimal::add);
        }

        // Calcular flujo neto por mes
        for (Map<String, BigDecimal> mes : flujosPorMes.values()) {
            BigDecimal ingresos_total = mes.getOrDefault("ingresos", BigDecimal.ZERO);
            BigDecimal egresos_total = mes.getOrDefault("egresos", BigDecimal.ZERO);
            mes.put("flujoNeto", ingresos_total.subtract(egresos_total));
        }

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("codPyto", codPyto);
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("flujosPorMes", flujosPorMes);
        reporte.put("totalEgresos", egresos.stream().map(ComprobantePagoDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        reporte.put("totalIngresos", ingresos.stream().map(VtaCompPagoCabDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte de flujo de caja generado exitosamente");
        return reporte;
    }

    /**
     * Reporte fiscal: IGV por período
     * Requisito 16.5
     */
    public Map<String, Object> reporteFiscalIGV(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Generando reporte fiscal de IGV para período: {} a {}", fechaInicio, fechaFin);

        // Obtener comprobantes de egreso
        List<ComprobantePagoDTO> egresos = comprobantePagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> comprobantePagoService.findById(codCia, c.getCodProveedor(), c.getNroCp()))
                .collect(Collectors.toList());

        // Obtener comprobantes de ingreso
        List<VtaCompPagoCabDTO> ingresos = vtaCompPagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> vtaCompPagoCabService.obtenerPorId(codCia, c.getNroCp()))
                .collect(Collectors.toList());

        // Calcular IGV total
        BigDecimal igvEgresos = egresos.stream()
                .map(ComprobantePagoDTO::getImpIgvMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal igvIngresos = ingresos.stream()
                .map(VtaCompPagoCabDTO::getImpIgvMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal igvNeto = igvIngresos.subtract(igvEgresos);

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("igvEgresos", igvEgresos);
        reporte.put("igvIngresos", igvIngresos);
        reporte.put("igvNeto", igvNeto);
        reporte.put("cantidadComprobantesEgresos", egresos.size());
        reporte.put("cantidadComprobantesIngresos", ingresos.size());
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte fiscal de IGV generado exitosamente");
        return reporte;
    }

    /**
     * Reporte de ingresos por cliente
     * Requisito 16.3
     */
    public Map<String, Object> reporteIngresosPorCliente(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Generando reporte de ingresos por cliente");

        List<VtaCompPagoCabDTO> ingresos = vtaCompPagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> vtaCompPagoCabService.obtenerPorId(codCia, c.getNroCp()))
                .collect(Collectors.toList());

        // Agrupar por cliente
        Map<Long, Map<String, Object>> ingresosPorCliente = new HashMap<>();

        for (VtaCompPagoCabDTO ingreso : ingresos) {
            Long codCliente = ingreso.getCodCliente();
            ingresosPorCliente.computeIfAbsent(codCliente, k -> {
                Map<String, Object> clienteData = new HashMap<>();
                clienteData.put("codCliente", codCliente);
                clienteData.put("totalIngresos", BigDecimal.ZERO);
                clienteData.put("cantidadComprobantes", 0);
                clienteData.put("totalIGV", BigDecimal.ZERO);
                return clienteData;
            });

            Map<String, Object> clienteData = ingresosPorCliente.get(codCliente);
            clienteData.put("totalIngresos",
                    ((BigDecimal) clienteData.get("totalIngresos")).add(ingreso.getImpTotalMn()));
            clienteData.put("cantidadComprobantes", ((Integer) clienteData.get("cantidadComprobantes")) + 1);
            clienteData.put("totalIGV", ((BigDecimal) clienteData.get("totalIGV")).add(ingreso.getImpIgvMn()));
        }

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("ingresosPorCliente", new ArrayList<>(ingresosPorCliente.values()));
        reporte.put("totalIngresos", ingresos.stream().map(VtaCompPagoCabDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte de ingresos por cliente generado exitosamente");
        return reporte;
    }

    /**
     * Reporte de gastos por proveedor
     * Requisito 16.3
     */
    public Map<String, Object> reporteGastosPorProveedor(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Generando reporte de gastos por proveedor");

        List<ComprobantePagoDTO> egresos = comprobantePagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> comprobantePagoService.findById(codCia, c.getCodProveedor(), c.getNroCp()))
                .collect(Collectors.toList());

        // Agrupar por proveedor
        Map<Long, Map<String, Object>> gastosPorProveedor = new HashMap<>();

        for (ComprobantePagoDTO egreso : egresos) {
            Long codProveedor = egreso.getCodProveedor();
            gastosPorProveedor.computeIfAbsent(codProveedor, k -> {
                Map<String, Object> proveedorData = new HashMap<>();
                proveedorData.put("codProveedor", codProveedor);
                proveedorData.put("totalGastos", BigDecimal.ZERO);
                proveedorData.put("cantidadComprobantes", 0);
                proveedorData.put("totalIGV", BigDecimal.ZERO);
                return proveedorData;
            });

            Map<String, Object> proveedorData = gastosPorProveedor.get(codProveedor);
            proveedorData.put("totalGastos",
                    ((BigDecimal) proveedorData.get("totalGastos")).add(egreso.getImpTotalMn()));
            proveedorData.put("cantidadComprobantes", ((Integer) proveedorData.get("cantidadComprobantes")) + 1);
            proveedorData.put("totalIGV", ((BigDecimal) proveedorData.get("totalIGV")).add(egreso.getImpIgvMn()));
        }

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("gastosPorProveedor", new ArrayList<>(gastosPorProveedor.values()));
        reporte.put("totalGastos", egresos.stream().map(ComprobantePagoDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte de gastos por proveedor generado exitosamente");
        return reporte;
    }

    /**
     * Reporte consolidado de empresa
     * Muestra ingresos, gastos, ganancia y métricas clave
     * Requisito 16.2
     */
    public Map<String, Object> reporteConsolidadoEmpresa(Long codCia, LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Generando reporte consolidado de empresa: {}", codCia);

        // Obtener todos los comprobantes en el rango
        List<ComprobantePagoDTO> egresos = comprobantePagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> comprobantePagoService.findById(codCia, c.getCodProveedor(), c.getNroCp()))
                .collect(Collectors.toList());

        List<VtaCompPagoCabDTO> ingresos = vtaCompPagoCabRepository
                .findByFechaRange(codCia, fechaInicio, fechaFin)
                .stream()
                .map(c -> vtaCompPagoCabService.obtenerPorId(codCia, c.getNroCp()))
                .collect(Collectors.toList());

        // Calcular totales
        BigDecimal totalIngresos = ingresos.stream().map(VtaCompPagoCabDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalEgresos = egresos.stream().map(ComprobantePagoDTO::getImpTotalMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ganancia = totalIngresos.subtract(totalEgresos);

        BigDecimal totalIGV = ingresos.stream().map(VtaCompPagoCabDTO::getImpIgvMn)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(egresos.stream().map(ComprobantePagoDTO::getImpIgvMn)
                        .reduce(BigDecimal.ZERO, BigDecimal::add));

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("codCia", codCia);
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("totalIngresos", totalIngresos);
        reporte.put("totalEgresos", totalEgresos);
        reporte.put("ganancia", ganancia);
        reporte.put("totalIGV", totalIGV);
        reporte.put("cantidadComprobantesIngresos", ingresos.size());
        reporte.put("cantidadComprobantesEgresos", egresos.size());
        reporte.put("margenGanancia", totalIngresos.compareTo(BigDecimal.ZERO) > 0
                ? ganancia.divide(totalIngresos, 4, java.math.RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        reporte.put("fechaGeneracion", LocalDate.now());

        log.info("Reporte consolidado de empresa generado exitosamente");
        return reporte;
    }
}
