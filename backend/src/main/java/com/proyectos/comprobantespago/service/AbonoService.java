package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.dto.AbonoDTO;
import com.proyectos.comprobantespago.enums.EstadoComprobante;

/**
 * Servicio para gestión de abonos y estados de comprobantes
 * Los abonos se guardan directamente en COMP_PAGOCAB y VTACOMP_PAGOCAB
 * (campos: FecAbono, DesAbono, FotoAbono, CodEstado)
 */
public interface AbonoService {

    /**
     * Registrar un abono para un comprobante de egreso
     * Actualiza los campos FecAbono, DesAbono, FotoAbono
     * y cambia el estado a 'PAG' (PAGADO)
     *
     * @param codCia       Código de compañía
     * @param codProveedor Código del proveedor
     * @param nroCP        Número de comprobante
     * @param abonoDTO     Datos del abono
     */
    void registrarAbonoEgreso(Long codCia, Long codProveedor, String nroCP, AbonoDTO abonoDTO);

    /**
     * Registrar un abono para un comprobante de ingreso
     * Actualiza los campos FecAbono, DesAbono, FotoAbono
     * y cambia el estado a 'PAG' (PAGADO)
     *
     * @param codCia   Código de compañía
     * @param nroCP    Número de comprobante
     * @param abonoDTO Datos del abono
     */
    void registrarAbonoIngreso(Long codCia, String nroCP, AbonoDTO abonoDTO);

    /**
     * Cambiar el estado de un comprobante de egreso
     *
     * @param codCia       Código de compañía
     * @param codProveedor Código del proveedor
     * @param nroCP        Número de comprobante
     * @param nuevoEstado  Nuevo estado
     */
    void cambiarEstadoEgreso(Long codCia, Long codProveedor, String nroCP, EstadoComprobante nuevoEstado);

    /**
     * Cambiar el estado de un comprobante de ingreso
     *
     * @param codCia      Código de compañía
     * @param nroCP       Número de comprobante
     * @param nuevoEstado Nuevo estado
     */
    void cambiarEstadoIngreso(Long codCia, String nroCP, EstadoComprobante nuevoEstado);

    /**
     * Obtener datos del abono de un comprobante de egreso
     *
     * @param codCia       Código de compañía
     * @param codProveedor Código del proveedor
     * @param nroCP        Número de comprobante
     * @return Datos del abono o null si no tiene
     */
    AbonoDTO getAbonoEgreso(Long codCia, Long codProveedor, String nroCP);

    /**
     * Obtener datos del abono de un comprobante de ingreso
     *
     * @param codCia Código de compañía
     * @param nroCP  Número de comprobante
     * @return Datos del abono o null si no tiene
     */
    AbonoDTO getAbonoIngreso(Long codCia, String nroCP);
}
