package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;
import com.proyectos.comprobantespago.repository.ProveedorRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final ComprobantePagoCabRepository comprobanteRepository;
    private final VtaCompPagoCabRepository vtaComprobanteRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProyectoRepository proyectoRepository;

    public Map<String, Object> getStats(String codCia) {
        log.info("Obteniendo estadísticas del dashboard para codCia: {}", codCia);

        Map<String, Object> stats = new HashMap<>();

        try {
            Long codCiaLong = codCia != null ? Long.parseLong(codCia) : null;

            // Obtener egresos (COMP_PAGOCAB)
            List<ComprobantePagoCab> egresos = codCiaLong != null
                    ? comprobanteRepository.findByCodCia(codCiaLong)
                    : comprobanteRepository.findAll();

            // Obtener ingresos (VTACOMP_PAGOCAB) - filtrar por compañía
            List<VtaCompPagoCab> ingresos = codCiaLong != null
                    ? vtaComprobanteRepository.findAll().stream()
                        .filter(c -> c.getCodCia().equals(codCiaLong))
                        .collect(Collectors.toList())
                    : vtaComprobanteRepository.findAll();

            // Total de comprobantes (egresos + ingresos)
            int totalComprobantes = egresos.size() + ingresos.size();
            stats.put("totalComprobantes", totalComprobantes);

            // Comprobantes pendientes (registrados pero no pagados = estado '001')
            long egresosPendientes = egresos.stream()
                    .filter(c -> "001".equals(c.getCodEstado()))
                    .count();
            long ingresosPendientes = ingresos.stream()
                    .filter(c -> "001".equals(c.getCodEstado()))
                    .count();
            stats.put("comprobantesPendientes", egresosPendientes + ingresosPendientes);

            // Proveedores activos
            long proveedoresActivos = proveedorRepository.count();
            stats.put("proveedoresActivos", proveedoresActivos);

            // Proyectos activos
            long proyectosActivos = proyectoRepository.count();
            stats.put("proyectosActivos", proyectosActivos);

            // Calcular total de ingresos
            BigDecimal totalIngresos = ingresos.stream()
                    .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calcular total de egresos
            BigDecimal totalEgresos = egresos.stream()
                    .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            stats.put("totalIngresos", totalIngresos);
            stats.put("totalEgresos", totalEgresos);
            stats.put("clientesActivos", 0);

            // NUEVOS CAMPOS: Contar comprobantes por estado
            // IMPORTANTE: En la base de datos, los estados se almacenan como códigos en ELEMENTOS
            // TabEstado='001' y CodEstado puede ser '001' (Registrado), '002' (Pagado), '003' (Anulado), etc.
            // Según el schema.sql, todos los comprobantes tienen estado '001' por defecto

            // Estados de EGRESOS - usar exactamente los códigos de la BD
            long egresosRegistrados = egresos.stream()
                    .filter(c -> "001".equals(c.getCodEstado()))
                    .count();
            long egresosPagados = egresos.stream()
                    .filter(c -> "002".equals(c.getCodEstado()))
                    .count();
            long egresosAnulados = egresos.stream()
                    .filter(c -> "003".equals(c.getCodEstado()))
                    .count();

            // Estados de INGRESOS (filtrar por compañía)
            List<VtaCompPagoCab> ingresosFiltrados = codCiaLong != null
                    ? ingresos.stream()
                        .filter(c -> c.getCodCia().equals(codCiaLong))
                        .collect(Collectors.toList())
                    : ingresos;

            long ingresosRegistrados = ingresosFiltrados.stream()
                    .filter(c -> "001".equals(c.getCodEstado()))
                    .count();
            long ingresosPagados = ingresosFiltrados.stream()
                    .filter(c -> "002".equals(c.getCodEstado()))
                    .count();
            long ingresosAnulados = ingresosFiltrados.stream()
                    .filter(c -> "003".equals(c.getCodEstado()))
                    .count();

            // Totales combinados
            stats.put("comprobantesRegistrados", egresosRegistrados + ingresosRegistrados);
            stats.put("comprobantesPagados", egresosPagados + ingresosPagados);
            stats.put("comprobantesAnulados", egresosAnulados + ingresosAnulados);

            // NUEVOS CAMPOS: Presupuesto
            // Calcular presupuesto total de proyectos de la compañía
            List<Proyecto> proyectos = codCiaLong != null
                    ? proyectoRepository.findAll().stream()
                        .filter(p -> p.getCodCia().equals(codCiaLong))
                        .collect(Collectors.toList())
                    : proyectoRepository.findAll();
            BigDecimal presupuestoTotal = proyectos.stream()
                    .map(p -> p.getCostoTotal() != null ? p.getCostoTotal() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // El presupuesto ejecutado es la suma de TODOS los egresos (excepto anulados)
            // Estado '001' = Registrado, '002' = Pagado, '003' = Anulado
            BigDecimal presupuestoEjecutado = egresos.stream()
                    .filter(c -> !"003".equals(c.getCodEstado())) // Excluir solo anulados (código '003')
                    .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            stats.put("presupuestoTotal", presupuestoTotal);
            stats.put("presupuestoEjecutado", presupuestoEjecutado);

            // NUEVOS CAMPOS: Alertas de presupuesto (simplificado)
            // Contar proyectos con diferentes niveles de ejecución
            long alertasCriticas = 0;
            long alertasUrgentes = 0;
            long alertasAtencion = 0;

            for (Proyecto proyecto : proyectos) {
                List<ComprobantePagoCab> comprobantesProyecto = comprobanteRepository
                        .findByCodCiaAndCodPyto(proyecto.getCodCia(), proyecto.getCodPyto());

                // Calcular gastado: TODOS los egresos excepto anulados (código '003')
                BigDecimal gastadoProyecto = comprobantesProyecto.stream()
                        .filter(c -> !"003".equals(c.getCodEstado()))
                        .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal costoTotal = proyecto.getCostoTotal() != null
                        ? proyecto.getCostoTotal()
                        : BigDecimal.ZERO;

                if (costoTotal.compareTo(BigDecimal.ZERO) > 0) {
                    double porcentaje = gastadoProyecto.multiply(BigDecimal.valueOf(100))
                            .divide(costoTotal, 2, BigDecimal.ROUND_HALF_UP)
                            .doubleValue();

                    if (porcentaje >= 100) {
                        alertasCriticas++;
                    } else if (porcentaje >= 91) {
                        alertasUrgentes++;
                    } else if (porcentaje >= 76) {
                        alertasAtencion++;
                    }
                }
            }

            stats.put("alertasCriticas", alertasCriticas);
            stats.put("alertasUrgentes", alertasUrgentes);
            stats.put("alertasAtencion", alertasAtencion);

        } catch (Exception e) {
            log.error("Error al obtener estadísticas del dashboard", e);
            stats.put("totalComprobantes", 0);
            stats.put("comprobantesPendientes", 0);
            stats.put("proveedoresActivos", 0);
            stats.put("proyectosActivos", 0);
            stats.put("totalIngresos", BigDecimal.ZERO);
            stats.put("totalEgresos", BigDecimal.ZERO);
            stats.put("clientesActivos", 0);
            stats.put("comprobantesRegistrados", 0);
            stats.put("comprobantesPagados", 0);
            stats.put("comprobantesAnulados", 0);
            stats.put("presupuestoTotal", BigDecimal.ZERO);
            stats.put("presupuestoEjecutado", BigDecimal.ZERO);
            stats.put("alertasCriticas", 0);
            stats.put("alertasUrgentes", 0);
            stats.put("alertasAtencion", 0);
        }

        return stats;
    }

    public List<Map<String, Object>> getCashFlow(String codCia) {
        log.info("Obteniendo flujo de caja para codCia: {}", codCia);

        List<Map<String, Object>> cashFlow = new ArrayList<>();

        try {
            Long codCiaLong = codCia != null ? Long.parseLong(codCia) : null;

            // Obtener egresos del año actual
            List<ComprobantePagoCab> egresos = codCiaLong != null
                    ? comprobanteRepository.findByCodCia(codCiaLong)
                    : comprobanteRepository.findAll();

            // Obtener ingresos del año actual
            List<VtaCompPagoCab> ingresos = vtaComprobanteRepository.findAll();

            // Determinar el año más reciente con datos
            int añoActual = LocalDate.now().getYear();

            // Buscar el año más reciente en los datos
            int añoMasReciente = egresos.stream()
                    .filter(c -> c.getFecCp() != null)
                    .map(c -> c.getFecCp().getYear())
                    .max(Integer::compareTo)
                    .orElse(añoActual);

            // Si no hay datos del año actual, usar el año más reciente encontrado
            int añoAUsar = egresos.stream()
                    .anyMatch(c -> c.getFecCp() != null && c.getFecCp().getYear() == añoActual)
                    ? añoActual
                    : añoMasReciente;

            log.info("Mostrando flujo de caja del año: {}", añoAUsar);

            // Agrupar egresos por mes del año seleccionado
            Map<Integer, List<ComprobantePagoCab>> egresosPorMes = egresos.stream()
                    .filter(c -> c.getFecCp() != null)
                    .filter(c -> c.getFecCp().getYear() == añoAUsar)
                    .collect(Collectors.groupingBy(c -> c.getFecCp().getMonthValue()));

            // Agrupar ingresos por mes del año seleccionado
            Map<Integer, List<VtaCompPagoCab>> ingresosPorMes = ingresos.stream()
                    .filter(c -> c.getFecCp() != null)
                    .filter(c -> c.getFecCp().getYear() == añoAUsar)
                    .collect(Collectors.groupingBy(c -> c.getFecCp().getMonthValue()));

            // Crear datos para cada mes
            for (int mes = 1; mes <= 12; mes++) {
                List<VtaCompPagoCab> ingresosMes = ingresosPorMes.getOrDefault(mes, new ArrayList<>());
                List<ComprobantePagoCab> egresosMes = egresosPorMes.getOrDefault(mes, new ArrayList<>());

                BigDecimal totalIngresos = ingresosMes.stream()
                        .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalEgresos = egresosMes.stream()
                        .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> monthData = new HashMap<>();
                // Usar nombres de meses en español abreviados consistentes con el frontend
                String[] mesesAbreviados = {"ene", "feb", "mar", "abr", "may", "jun",
                                           "jul", "ago", "sept", "oct", "nov", "dic"};
                monthData.put("month", mesesAbreviados[mes - 1]);
                // Convertir BigDecimal a double para evitar problemas de serialización
                monthData.put("ingresos", totalIngresos.doubleValue());
                monthData.put("egresos", totalEgresos.doubleValue());
                cashFlow.add(monthData);
            }

        } catch (Exception e) {
            log.error("Error al obtener flujo de caja", e);
        }

        return cashFlow;
    }

    public List<Map<String, Object>> getProjects(String codCia) {
        log.info("Obteniendo resumen de proyectos para codCia: {}", codCia);

        List<Map<String, Object>> projects = new ArrayList<>();

        try {
            Long codCiaLong = codCia != null ? Long.parseLong(codCia) : null;

            // Obtener proyectos de la compañía
            List<Proyecto> proyectos = codCiaLong != null
                    ? proyectoRepository.findAll().stream()
                        .filter(p -> p.getCodCia().equals(codCiaLong))
                        .collect(Collectors.toList())
                    : proyectoRepository.findAll();

            for (Proyecto proyecto : proyectos) {
                // Obtener comprobantes del proyecto (solo egresos)
                List<ComprobantePagoCab> comprobantes = comprobanteRepository
                        .findByCodCiaAndCodPyto(proyecto.getCodCia(), proyecto.getCodPyto());

                // Calcular gastado: sumar TODOS los egresos (no solo pagados)
                // Estado '001' = Registrado, '002' = Pagado, '003' = Anulado
                BigDecimal gastado = comprobantes.stream()
                        .filter(c -> !"003".equals(c.getCodEstado())) // Excluir solo anulados (código '003')
                        .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal costoTotal = proyecto.getCostoTotal() != null
                        ? proyecto.getCostoTotal()
                        : BigDecimal.ZERO;

                int porcentaje = 0;
                if (costoTotal.compareTo(BigDecimal.ZERO) > 0) {
                    porcentaje = gastado.multiply(BigDecimal.valueOf(100))
                            .divide(costoTotal, 0, BigDecimal.ROUND_HALF_UP)
                            .intValue();
                }

                Map<String, Object> project = new HashMap<>();
                project.put("codPyto", proyecto.getCodPyto());
                project.put("nombPyto", proyecto.getNombPyto());
                project.put("costoTotal", costoTotal);
                project.put("gastado", gastado);
                project.put("porcentaje", porcentaje);
                projects.add(project);
            }

        } catch (Exception e) {
            log.error("Error al obtener resumen de proyectos", e);
        }

        return projects;
    }

    public List<Map<String, Object>> getTopProviders(String codCia) {
        log.info("Obteniendo top proveedores para codCia: {}", codCia);

        List<Map<String, Object>> providers = new ArrayList<>();

        try {
            Long codCiaLong = codCia != null ? Long.parseLong(codCia) : null;

            // Obtener todos los comprobantes (egresos)
            List<ComprobantePagoCab> comprobantes = codCiaLong != null
                    ? comprobanteRepository.findByCodCia(codCiaLong)
                    : comprobanteRepository.findAll();

            // Agrupar por proveedor
            Map<Long, List<ComprobantePagoCab>> porProveedor = comprobantes.stream()
                    .filter(c -> c.getCodProveedor() != null)
                    .collect(Collectors.groupingBy(ComprobantePagoCab::getCodProveedor));

            // Calcular totales por proveedor
            List<Map<String, Object>> proveedoresTotales = new ArrayList<>();
            for (Map.Entry<Long, List<ComprobantePagoCab>> entry : porProveedor.entrySet()) {
                BigDecimal total = entry.getValue().stream()
                        .map(c -> c.getImpTotalMn() != null ? c.getImpTotalMn() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> provider = new HashMap<>();
                provider.put("codProveedor", entry.getKey());
                provider.put("nombre", "Proveedor " + entry.getKey()); // Simplificado
                provider.put("total", total);
                provider.put("comprobantes", entry.getValue().size());
                proveedoresTotales.add(provider);
            }

            // Ordenar por total descendente y tomar top 5
            providers = proveedoresTotales.stream()
                    .sorted((a, b) -> ((BigDecimal) b.get("total")).compareTo((BigDecimal) a.get("total")))
                    .limit(5)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error al obtener top proveedores", e);
        }

        return providers;
    }
}
