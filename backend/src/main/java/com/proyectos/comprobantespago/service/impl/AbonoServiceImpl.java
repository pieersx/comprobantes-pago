package com.proyectos.comprobantespago.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.dto.AbonoDTO;
import com.proyectos.comprobantespago.entity.ComprobantePagoCab;
import com.proyectos.comprobantespago.entity.ComprobantePagoEmpleado;
import com.proyectos.comprobantespago.entity.VtaCompPagoCab;
import com.proyectos.comprobantespago.enums.EstadoComprobante;
import com.proyectos.comprobantespago.exception.ResourceNotFoundException;
import com.proyectos.comprobantespago.repository.ComprobantePagoCabRepository;
import com.proyectos.comprobantespago.repository.ComprobantePagoEmpleadoRepository;
import com.proyectos.comprobantespago.repository.VtaCompPagoCabRepository;
import com.proyectos.comprobantespago.service.AbonoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AbonoServiceImpl implements AbonoService {

    private final ComprobantePagoCabRepository comprobantePagoCabRepository;
    private final VtaCompPagoCabRepository vtaCompPagoCabRepository;
    private final ComprobantePagoEmpleadoRepository comprobantePagoEmpleadoRepository;

    private static final String TAB_ESTADO = "004"; // Tabla de estados

    @Override
    @Transactional
    public void registrarAbonoEgreso(Long codCia, Long codProveedor, String nroCP, AbonoDTO abonoDTO) {
        log.info("Registrando abono para egreso: codCia={}, codProveedor={}, nroCP={}",
                codCia, codProveedor, nroCP);

        ComprobantePagoCab comprobante = comprobantePagoCabRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de egreso no encontrado: " + nroCP));

        // Actualizar campos de abono
        comprobante.setFecAbono(abonoDTO.getFechaAbono());
        comprobante.setDesAbono(abonoDTO.getDescripcionMedioPago());
        // FotoAbono se maneja por endpoints BLOB separados, no se actualiza aquí

        // Cambiar estado a PAGADO
        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(EstadoComprobante.PAGADO.getCodigo());

        comprobantePagoCabRepository.save(comprobante);
        log.info("Abono registrado exitosamente para egreso: {}", nroCP);
    }

    @Override
    @Transactional
    public void registrarAbonoIngreso(Long codCia, String nroCP, AbonoDTO abonoDTO) {
        log.info("Registrando abono para ingreso: codCia={}, nroCP={}", codCia, nroCP);

        VtaCompPagoCab comprobante = vtaCompPagoCabRepository
                .findByCodCiaAndNroCp(codCia, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de ingreso no encontrado: " + nroCP));

        // Actualizar campos de abono
        comprobante.setFecAbono(abonoDTO.getFechaAbono());
        comprobante.setDesAbono(abonoDTO.getDescripcionMedioPago());
        // FotoAbono se maneja por endpoints BLOB separados, no se actualiza aquí

        // Cambiar estado a PAGADO
        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(EstadoComprobante.PAGADO.getCodigo());

        vtaCompPagoCabRepository.save(comprobante);
        log.info("Abono registrado exitosamente para ingreso: {}", nroCP);
    }

    @Override
    @Transactional
    public void cambiarEstadoEgreso(Long codCia, Long codProveedor, String nroCP, EstadoComprobante nuevoEstado) {
        log.info("Cambiando estado de egreso {} a {}", nroCP, nuevoEstado);

        ComprobantePagoCab comprobante = comprobantePagoCabRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de egreso no encontrado: " + nroCP));

        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(nuevoEstado.getCodigo());

        comprobantePagoCabRepository.save(comprobante);
    }

    @Override
    @Transactional
    public void cambiarEstadoIngreso(Long codCia, String nroCP, EstadoComprobante nuevoEstado) {
        log.info("Cambiando estado de ingreso {} a {}", nroCP, nuevoEstado);

        VtaCompPagoCab comprobante = vtaCompPagoCabRepository
                .findByCodCiaAndNroCp(codCia, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de ingreso no encontrado: " + nroCP));

        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(nuevoEstado.getCodigo());

        vtaCompPagoCabRepository.save(comprobante);
    }

    @Override
    public AbonoDTO getAbonoEgreso(Long codCia, Long codProveedor, String nroCP) {
        ComprobantePagoCab comprobante = comprobantePagoCabRepository
                .findByCodCiaAndCodProveedorAndNroCp(codCia, codProveedor, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de egreso no encontrado: " + nroCP));

        // Si no tiene fecha de abono, no hay abono registrado
        if (comprobante.getFecAbono() == null) {
            return null;
        }

        return AbonoDTO.builder()
                .fechaAbono(comprobante.getFecAbono())
                .descripcionMedioPago(comprobante.getDesAbono())
                .tieneFotoAbono(comprobante.getFotoAbono() != null && comprobante.getFotoAbono().length > 0)
                .build();
    }

    @Override
    public AbonoDTO getAbonoIngreso(Long codCia, String nroCP) {
        VtaCompPagoCab comprobante = vtaCompPagoCabRepository
                .findByCodCiaAndNroCp(codCia, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de ingreso no encontrado: " + nroCP));

        // Si no tiene fecha de abono, no hay abono registrado
        if (comprobante.getFecAbono() == null) {
            return null;
        }

        return AbonoDTO.builder()
                .fechaAbono(comprobante.getFecAbono())
                .descripcionMedioPago(comprobante.getDesAbono())
                .tieneFotoAbono(comprobante.getFotoAbono() != null && comprobante.getFotoAbono().length > 0)
                .build();
    }

    // ==================== Métodos para Empleados ====================

    @Override
    @Transactional
    public void registrarAbonoEmpleado(Long codCia, Long codEmpleado, String nroCP, AbonoDTO abonoDTO) {
        log.info("Registrando abono para empleado: codCia={}, codEmpleado={}, nroCP={}",
                codCia, codEmpleado, nroCP);

        ComprobantePagoEmpleado comprobante = comprobantePagoEmpleadoRepository
                .findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de empleado no encontrado: " + nroCP));

        // Actualizar campos de abono
        comprobante.setFecAbono(abonoDTO.getFechaAbono());
        comprobante.setDesAbono(abonoDTO.getDescripcionMedioPago());
        // FotoAbono se maneja por endpoints BLOB separados

        // Cambiar estado a PAGADO
        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(EstadoComprobante.PAGADO.getCodigo());

        comprobantePagoEmpleadoRepository.save(comprobante);
        log.info("Abono registrado exitosamente para empleado: {}", nroCP);
    }

    @Override
    @Transactional
    public void cambiarEstadoEmpleado(Long codCia, Long codEmpleado, String nroCP, EstadoComprobante nuevoEstado) {
        log.info("Cambiando estado de empleado {} a {}", nroCP, nuevoEstado);

        ComprobantePagoEmpleado comprobante = comprobantePagoEmpleadoRepository
                .findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de empleado no encontrado: " + nroCP));

        comprobante.setTabEstado(TAB_ESTADO);
        comprobante.setCodEstado(nuevoEstado.getCodigo());

        comprobantePagoEmpleadoRepository.save(comprobante);
    }

    @Override
    public AbonoDTO getAbonoEmpleado(Long codCia, Long codEmpleado, String nroCP) {
        ComprobantePagoEmpleado comprobante = comprobantePagoEmpleadoRepository
                .findByCodCiaAndCodEmpleadoAndNroCp(codCia, codEmpleado, nroCP)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comprobante de empleado no encontrado: " + nroCP));

        // Si no tiene fecha de abono, no hay abono registrado
        if (comprobante.getFecAbono() == null) {
            return null;
        }

        return AbonoDTO.builder()
                .fechaAbono(comprobante.getFecAbono())
                .descripcionMedioPago(comprobante.getDesAbono())
                .tieneFotoAbono(comprobante.getFotoAbono() != null && comprobante.getFotoAbono().length > 0)
                .build();
    }
}
