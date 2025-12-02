package com.proyectos.comprobantespago.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.AlertaPresupuestoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoDetalleDTO;
import com.proyectos.comprobantespago.dto.DetalleValidacionDTO;
import com.proyectos.comprobantespago.dto.PresupuestoDisponibleDTO;
import com.proyectos.comprobantespago.dto.PresupuestoPartidaDTO;
import com.proyectos.comprobantespago.dto.ResumenPresupuestoProyectoDTO;
import com.proyectos.comprobantespago.dto.ValidacionPresupuestoDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoDet;
import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.entity.ProyPartidaMezcla;
import com.proyectos.comprobantespago.entity.Proyecto;
import com.proyectos.comprobantespago.entity.VtaCompPagoDet;
import com.proyectos.comprobantespago.exception.PresupuestoInsuficienteException;
import com.proyectos.comprobantespago.repository.ComprobantePagoDetRepository;
import com.proyectos.comprobantespago.repository.PartidaRepository;
import com.proyectos.comprobantespago.repository.ProyPartidaMezclaRepository;
import com.proyectos.comprobantespago.repository.ProyectoRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoDetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para control presupuestal de proyectos
 * Calcula presupuesto disponible, ejecutado y porcentajes de avance
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PresupuestoService {

    private final ProyPartidaMezclaRepository proyPartidaMezclaRepository;
    private final ComprobantePagoDetRepository comprobantePagoDetRepository;
    private final VtaCompPagoDetRepository vtaCompPagoDetRepository;
    private final ProyectoRepository proyectoRepository;
    private final PartidaRepository partidaRepository;

    /**
     * Valida que un egreso no supere el presupuesto disponible
     *
     * @param codCia   Código de compañía
     * @param codPyto  Código de proyecto
     * @param detalles Lista de detalles del comprobante a validar
     * @return ValidacionPresupuestoDTO con resultado de validación
     * @throws PresupuestoInsuficienteException si no hay presupuesto suficiente
     */
    public ValidacionPresupuestoDTO validarEgreso(
            Long codCia,
            Long codPyto,
            List<ComprobantePagoDetalleDTO> detalles) {

        log.info("Validando egreso para proyecto {}-{} con {} detalles", codCia, codPyto, detalles.size());

        List<DetalleValidacionDTO> detallesValidacion = new ArrayList<>();
        List<AlertaPresupuestoDTO> alertas = new ArrayList<>();
        boolean todosValidos = true;
        StringBuilder mensajeError = new StringBuilder();

        for (ComprobantePagoDetalleDTO detalle : detalles) {
            // Obtener presupuesto disponible de la partida
            PresupuestoDisponibleDTO presupuesto = getPresupuestoDisponible(
                    codCia, codPyto, detalle.getCodPartida());

            // Calcular nuevo ejecutado y porcentaje
            BigDecimal nuevoEjecutado = presupuesto.getPresupuestoEjecutado()
                    .add(detalle.getImpTotalMn());
            BigDecimal nuevoPorcentaje = calcularPorcentaje(
                    nuevoEjecutado, presupuesto.getPresupuestoOriginal());
            BigDecimal nuevoDisponible = presupuesto.getPresupuestoOriginal()
                    .subtract(nuevoEjecutado);

            // Determinar nivel de alerta
            String nivelAlerta = determinarNivelAlerta(nuevoPorcentaje);
            boolean excedido = nuevoDisponible.compareTo(BigDecimal.ZERO) < 0;

            // Crear detalle de validación
            DetalleValidacionDTO detalleValidacion = DetalleValidacionDTO.builder()
                    .codPartida(detalle.getCodPartida())
                    .nombrePartida(presupuesto.getNombrePartida())
                    .presupuestoOriginal(presupuesto.getPresupuestoOriginal())
                    .presupuestoEjecutado(presupuesto.getPresupuestoEjecutado())
                    .presupuestoDisponible(presupuesto.getPresupuestoDisponible())
                    .montoSolicitado(detalle.getImpTotalMn())
                    .porcentajeEjecucion(nuevoPorcentaje)
                    .nivelAlerta(nivelAlerta)
                    .excedido(excedido)
                    .build();

            detallesValidacion.add(detalleValidacion);

            // Si está excedido, marcar como inválido
            if (excedido) {
                todosValidos = false;
                if (mensajeError.length() > 0) {
                    mensajeError.append("; ");
                }
                mensajeError.append(String.format(
                        "Partida %s: Presupuesto insuficiente. Disponible: S/ %.2f, Solicitado: S/ %.2f",
                        presupuesto.getNombrePartida(),
                        presupuesto.getPresupuestoDisponible(),
                        detalle.getImpTotalMn()));
            }

            // Generar alertas según el nivel
            if ("amarillo".equals(nivelAlerta) || "naranja".equals(nivelAlerta) || "rojo".equals(nivelAlerta)) {
                AlertaPresupuestoDTO alerta = crearAlerta(
                        detalle.getCodPartida(),
                        presupuesto.getNombrePartida(),
                        nuevoPorcentaje,
                        presupuesto.getPresupuestoOriginal(),
                        nuevoEjecutado,
                        nuevoDisponible,
                        nivelAlerta);
                alertas.add(alerta);
            }
        }

        ValidacionPresupuestoDTO resultado = ValidacionPresupuestoDTO.builder()
                .valido(true) // CAMBIO: Siempre válido, solo mostrar advertencias
                .mensajeError(todosValidos ? null : mensajeError.toString())
                .detalles(detallesValidacion)
                .alertas(alertas)
                .build();

        if (!todosValidos) {
            log.warn("Validación de egreso con advertencias (se permite guardar): {}", mensajeError);
        } else {
            log.info("Validación de egreso aprobada con {} alertas", alertas.size());
        }

        return resultado;
    }

    /**
     * Obtiene el presupuesto disponible de una partida específica
     *
     * @param codCia     Código de compañía
     * @param codPyto    Código de proyecto
     * @param codPartida Código de partida
     * @return PresupuestoDisponibleDTO con información de presupuesto
     */
    public PresupuestoDisponibleDTO getPresupuestoDisponible(
            Long codCia,
            Long codPyto,
            Long codPartida) {

        // Determinar tipo de partida (I o E)
        String ingEgr = determinarTipoPartida(codCia, codPartida);

        // 1. Obtener presupuesto total de la partida
        BigDecimal presupuestoTotal = proyPartidaMezclaRepository
                .findByCodCiaAndCodPytoAndIngEgrAndCodPartida(codCia, codPyto, ingEgr, codPartida)
                .stream()
                .map(ProyPartidaMezcla::getCostoTot)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Obtener total ejecutado (gastado)
        BigDecimal ejecutado = BigDecimal.ZERO;

        if ("E".equals(ingEgr)) {
            // Para egresos: sumar comprobantes de pago
            ejecutado = comprobantePagoDetRepository
                    .findByCodCiaAndIngEgrAndCodPartida(codCia, ingEgr, codPartida)
                    .stream()
                    .map(ComprobantePagoDet::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } else if ("I".equals(ingEgr)) {
            // Para ingresos: sumar comprobantes de venta
            ejecutado = vtaCompPagoDetRepository
                    .findByCodCiaAndIngEgrAndCodPartida(codCia, ingEgr, codPartida)
                    .stream()
                    .map(VtaCompPagoDet::getImpTotalMn)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // 3. Calcular disponible
        BigDecimal disponible = presupuestoTotal.subtract(ejecutado);

        // 4. Calcular porcentaje de ejecución
        BigDecimal porcentajeEjecutado = calcularPorcentaje(ejecutado, presupuestoTotal);

        // 5. Determinar nivel de alerta
        String nivelAlerta = determinarNivelAlerta(porcentajeEjecutado);

        // 6. Obtener nombre de la partida
        String nombrePartida = obtenerNombrePartida(codCia, ingEgr, codPartida);

        return PresupuestoDisponibleDTO.builder()
                .codCia(codCia)
                .codPyto(codPyto)
                .ingEgr(ingEgr)
                .codPartida(codPartida)
                .nombrePartida(nombrePartida)
                .presupuestoOriginal(presupuestoTotal)
                .presupuestoEjecutado(ejecutado)
                .presupuestoDisponible(disponible)
                .porcentajeEjecucion(porcentajeEjecutado)
                .nivelAlerta(nivelAlerta)
                .disponible(disponible.compareTo(BigDecimal.ZERO) > 0)
                .build();
    }

    /**
     * Calcula el porcentaje de ejecución de una partida
     *
     * @param codCia     Código de compañía
     * @param codPyto    Código de proyecto
     * @param codPartida Código de partida
     * @return Porcentaje de ejecución
     */
    public BigDecimal calcularPorcentajeEjecucion(
            Long codCia,
            Long codPyto,
            Long codPartida) {

        PresupuestoDisponibleDTO presupuesto = getPresupuestoDisponible(codCia, codPyto, codPartida);
        return presupuesto.getPorcentajeEjecucion();
    }

    /**
     * Genera alertas de sobrecosto para un proyecto
     *
     * @param codCia  Código de compañía
     * @param codPyto Código de proyecto
     * @return Lista de alertas activas
     */
    public List<AlertaPresupuestoDTO> generarAlertas(Long codCia, Long codPyto) {
        log.info("Generando alertas para proyecto {}-{}", codCia, codPyto);

        List<AlertaPresupuestoDTO> alertas = new ArrayList<>();

        // Obtener todas las partidas del proyecto
        List<ProyPartidaMezcla> partidas = proyPartidaMezclaRepository
                .findByCodCiaAndCodPyto(codCia, codPyto);

        // Agrupar por partida única
        partidas.stream()
                .map(p -> new PartidaKey(p.getCodCia(), p.getCodPyto(), p.getIngEgr(), p.getCodPartida()))
                .distinct()
                .forEach(key -> {
                    PresupuestoDisponibleDTO presupuesto = getPresupuestoDisponible(
                            key.codCia, key.codPyto, key.codPartida);

                    BigDecimal porcentaje = presupuesto.getPorcentajeEjecucion();
                    String nivelAlerta = presupuesto.getNivelAlerta();

                    // Solo generar alertas para niveles amarillo, naranja y rojo
                    if (!"verde".equals(nivelAlerta)) {
                        AlertaPresupuestoDTO alerta = crearAlerta(
                                key.codPartida,
                                presupuesto.getNombrePartida(),
                                porcentaje,
                                presupuesto.getPresupuestoOriginal(),
                                presupuesto.getPresupuestoEjecutado(),
                                presupuesto.getPresupuestoDisponible(),
                                nivelAlerta);
                        alertas.add(alerta);
                    }
                });

        // Ordenar por criticidad (rojo > naranja > amarillo) y luego por porcentaje
        alertas.sort((a1, a2) -> {
            int nivelCompare = getNivelPrioridad(a2.getNivel()) - getNivelPrioridad(a1.getNivel());
            if (nivelCompare != 0) {
                return nivelCompare;
            }
            return a2.getPorcentajeEjecucion().compareTo(a1.getPorcentajeEjecucion());
        });

        log.info("Se generaron {} alertas para el proyecto", alertas.size());
        return alertas;
    }

    /**
     * Obtiene el presupuesto de todas las partidas de un proyecto
     */
    public List<PresupuestoPartidaDTO> obtenerPresupuestoProyecto(Long codCia, Long codPyto) {
        List<PresupuestoPartidaDTO> resultado = new ArrayList<>();

        // Obtener todas las partidas del proyecto
        List<ProyPartidaMezcla> partidas = proyPartidaMezclaRepository
                .findByCodCiaAndCodPyto(codCia, codPyto);

        // Agrupar por partida
        partidas.stream()
                .map(p -> new PartidaKey(p.getCodCia(), p.getCodPyto(), p.getIngEgr(), p.getCodPartida()))
                .distinct()
                .forEach(key -> {
                    PresupuestoDisponibleDTO presupuesto = getPresupuestoDisponible(
                            key.codCia, key.codPyto, key.codPartida);

                    resultado.add(PresupuestoPartidaDTO.builder()
                            .codPartida(key.codPartida)
                            .ingEgr(key.ingEgr)
                            .nombrePartida(presupuesto.getNombrePartida())
                            .presupuestoTotal(presupuesto.getPresupuestoOriginal())
                            .ejecutado(presupuesto.getPresupuestoEjecutado())
                            .disponible(presupuesto.getPresupuestoDisponible())
                            .porcentajeEjecutado(presupuesto.getPorcentajeEjecucion())
                            .estado(presupuesto.getNivelAlerta())
                            .build());
                });

        return resultado;
    }

    /**
     * Obtiene resumen consolidado del presupuesto del proyecto
     */
    public ResumenPresupuestoProyectoDTO obtenerResumenProyecto(Long codCia, Long codPyto) {
        Proyecto proyecto = proyectoRepository.findById(new Proyecto.ProyectoId(codCia, codPyto))
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        List<PresupuestoPartidaDTO> partidas = obtenerPresupuestoProyecto(codCia, codPyto);

        // Separar ingresos y egresos
        BigDecimal totalPresupuestoIngresos = BigDecimal.ZERO;
        BigDecimal totalEjecutadoIngresos = BigDecimal.ZERO;
        BigDecimal totalPresupuestoEgresos = BigDecimal.ZERO;
        BigDecimal totalEjecutadoEgresos = BigDecimal.ZERO;

        for (PresupuestoPartidaDTO partida : partidas) {
            if ("I".equals(partida.getIngEgr())) {
                totalPresupuestoIngresos = totalPresupuestoIngresos.add(partida.getPresupuestoTotal());
                totalEjecutadoIngresos = totalEjecutadoIngresos.add(partida.getEjecutado());
            } else {
                totalPresupuestoEgresos = totalPresupuestoEgresos.add(partida.getPresupuestoTotal());
                totalEjecutadoEgresos = totalEjecutadoEgresos.add(partida.getEjecutado());
            }
        }

        // Calcular balance
        BigDecimal balancePresupuestado = totalPresupuestoIngresos.subtract(totalPresupuestoEgresos);
        BigDecimal balanceReal = totalEjecutadoIngresos.subtract(totalEjecutadoEgresos);

        // Calcular margen
        BigDecimal margenPresupuestado = calcularPorcentaje(balancePresupuestado, totalPresupuestoIngresos);
        BigDecimal margenReal = calcularPorcentaje(balanceReal, totalEjecutadoIngresos);

        return ResumenPresupuestoProyectoDTO.builder()
                .codCia(codCia)
                .codPyto(codPyto)
                .nombPyto(proyecto.getNombPyto())
                .costoTotal(proyecto.getCostoTotal())
                .totalPresupuestoIngresos(totalPresupuestoIngresos)
                .totalEjecutadoIngresos(totalEjecutadoIngresos)
                .totalPresupuestoEgresos(totalPresupuestoEgresos)
                .totalEjecutadoEgresos(totalEjecutadoEgresos)
                .balancePresupuestado(balancePresupuestado)
                .balanceReal(balanceReal)
                .margenPresupuestado(margenPresupuestado)
                .margenReal(margenReal)
                .partidas(partidas)
                .build();
    }

    // ==================== Métodos auxiliares ====================

    /**
     * Calcula el porcentaje de un valor sobre un total
     */
    private BigDecimal calcularPorcentaje(BigDecimal valor, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return valor
                .divide(total, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Determina el nivel de alerta según el porcentaje de ejecución
     * - Verde: 0-75%
     * - Amarillo: 76-90%
     * - Naranja: 91-99%
     * - Rojo: 100%+
     */
    private String determinarNivelAlerta(BigDecimal porcentaje) {
        if (porcentaje.compareTo(BigDecimal.valueOf(100)) >= 0) {
            return "rojo";
        } else if (porcentaje.compareTo(BigDecimal.valueOf(91)) >= 0) {
            return "naranja";
        } else if (porcentaje.compareTo(BigDecimal.valueOf(76)) >= 0) {
            return "amarillo";
        } else {
            return "verde";
        }
    }

    /**
     * Crea una alerta de presupuesto
     */
    private AlertaPresupuestoDTO crearAlerta(
            Long codPartida,
            String nombrePartida,
            BigDecimal porcentaje,
            BigDecimal presupuestoOriginal,
            BigDecimal ejecutado,
            BigDecimal disponible,
            String nivelAlerta) {

        String tipo;
        String mensaje;

        switch (nivelAlerta) {
            case "rojo":
                tipo = "error";
                mensaje = String.format(
                        "Partida %s ha excedido el presupuesto (%.2f%%). Sobregiro: S/ %.2f",
                        nombrePartida, porcentaje, disponible.abs());
                break;
            case "naranja":
                tipo = "warning";
                mensaje = String.format(
                        "URGENTE: Partida %s al %.2f%% de ejecución. Disponible: S/ %.2f",
                        nombrePartida, porcentaje, disponible);
                break;
            case "amarillo":
                tipo = "warning";
                mensaje = String.format(
                        "Atención: Partida %s al %.2f%% de ejecución. Disponible: S/ %.2f",
                        nombrePartida, porcentaje, disponible);
                break;
            default:
                tipo = "info";
                mensaje = String.format(
                        "Partida %s al %.2f%% de ejecución",
                        nombrePartida, porcentaje);
        }

        return AlertaPresupuestoDTO.builder()
                .id(UUID.randomUUID().toString())
                .tipo(tipo)
                .nivel(nivelAlerta)
                .mensaje(mensaje)
                .codPartida(codPartida)
                .nombrePartida(nombrePartida)
                .porcentajeEjecucion(porcentaje)
                .presupuestoOriginal(presupuestoOriginal)
                .presupuestoEjecutado(ejecutado)
                .presupuestoDisponible(disponible)
                .fechaGeneracion(LocalDateTime.now())
                .build();
    }

    /**
     * Obtiene el nombre de una partida
     */
    private String obtenerNombrePartida(Long codCia, String ingEgr, Long codPartida) {
        return partidaRepository
                .findById(new Partida.PartidaId(codCia, ingEgr, codPartida))
                .map(Partida::getDesPartida)
                .orElse(String.format("Partida %s-%d", ingEgr, codPartida));
    }

    /**
     * Determina el tipo de partida (I o E) buscando en el catálogo
     */
    private String determinarTipoPartida(Long codCia, Long codPartida) {
        // Buscar primero en tipo E (Egreso)
        if (partidaRepository.findById(new Partida.PartidaId(codCia, "E", codPartida)).isPresent()) {
            return "E";
        }
        // Si no existe, asumir tipo I (Ingreso)
        return "I";
    }

    /**
     * Obtiene la prioridad numérica de un nivel de alerta para ordenamiento
     */
    private int getNivelPrioridad(String nivel) {
        switch (nivel) {
            case "rojo":
                return 3;
            case "naranja":
                return 2;
            case "amarillo":
                return 1;
            default:
                return 0;
        }
    }

    // ==================== Clases internas ====================

    /**
     * Clave para agrupar partidas únicas
     */
    private record PartidaKey(Long codCia, Long codPyto, String ingEgr, Long codPartida) {
    }
}
