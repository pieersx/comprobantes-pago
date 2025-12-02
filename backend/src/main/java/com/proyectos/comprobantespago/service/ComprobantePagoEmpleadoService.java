package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDTO;
import com.proyectos.comprobantespago.dto.ComprobantePagoEmpleadoDetDTO;

/**
 * Servicio para gestión de comprobantes de pago a empleados
 */
public interface ComprobantePagoEmpleadoService {

    /**
     * Obtener todos los comprobantes de una compañía
     */
    List<ComprobantePagoEmpleadoDTO> findAll(Long codCia);

    /**
     * Obtener comprobantes de un empleado específico
     */
    List<ComprobantePagoEmpleadoDTO> findByEmpleado(Long codCia, Long codEmpleado);

    /**
     * Obtener comprobantes de un proyecto específico
     */
    List<ComprobantePagoEmpleadoDTO> findByProyecto(Long codCia, Long codPyto);

    /**
     * Buscar comprobante por ID compuesto
     */
    Optional<ComprobantePagoEmpleadoDTO> findById(Long codCia, Long codEmpleado, String nroCp);

    /**
     * Crear nuevo comprobante
     */
    ComprobantePagoEmpleadoDTO create(ComprobantePagoEmpleadoDTO dto);

    /**
     * Actualizar comprobante existente
     */
    ComprobantePagoEmpleadoDTO update(Long codCia, Long codEmpleado, String nroCp, ComprobantePagoEmpleadoDTO dto);

    /**
     * Anular comprobante (cambiar estado a ANU)
     */
    void anular(Long codCia, Long codEmpleado, String nroCp);

    // ==================== Métodos de imágenes BLOB ====================

    /**
     * Subir imagen del comprobante (FotoCP)
     */
    void uploadFotoCp(Long codCia, Long codEmpleado, String nroCp, MultipartFile file);

    /**
     * Obtener imagen del comprobante (FotoCP)
     */
    byte[] getFotoCp(Long codCia, Long codEmpleado, String nroCp);

    /**
     * Eliminar imagen del comprobante (FotoCP)
     */
    void deleteFotoCp(Long codCia, Long codEmpleado, String nroCp);

    /**
     * Subir imagen del abono (FotoAbono)
     */
    void uploadFotoAbono(Long codCia, Long codEmpleado, String nroCp, MultipartFile file);

    /**
     * Obtener imagen del abono (FotoAbono)
     */
    byte[] getFotoAbono(Long codCia, Long codEmpleado, String nroCp);

    /**
     * Eliminar imagen del abono (FotoAbono)
     */
    void deleteFotoAbono(Long codCia, Long codEmpleado, String nroCp);

    // ==================== Métodos de detalle (COMP_PAGOEMPLEADO_DET)
    // ====================

    /**
     * Obtener detalles de un comprobante
     */
    List<ComprobantePagoEmpleadoDetDTO> findDetalles(Long codCia, Long codEmpleado, String nroCp);

    /**
     * Agregar detalle a un comprobante
     */
    ComprobantePagoEmpleadoDetDTO addDetalle(Long codCia, Long codEmpleado, String nroCp,
            ComprobantePagoEmpleadoDetDTO dto);

    /**
     * Actualizar detalle de un comprobante
     */
    ComprobantePagoEmpleadoDetDTO updateDetalle(Long codCia, Long codEmpleado, String nroCp, Integer sec,
            ComprobantePagoEmpleadoDetDTO dto);

    /**
     * Eliminar detalle de un comprobante
     */
    void deleteDetalle(Long codCia, Long codEmpleado, String nroCp, Integer sec);

    /**
     * Eliminar todos los detalles de un comprobante
     */
    void deleteAllDetalles(Long codCia, Long codEmpleado, String nroCp);
}
