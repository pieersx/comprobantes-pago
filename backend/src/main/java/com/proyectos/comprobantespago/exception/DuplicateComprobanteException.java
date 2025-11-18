package com.proyectos.comprobantespago.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando se intenta crear un comprobante con número duplicado
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateComprobanteException extends RuntimeException {

    public DuplicateComprobanteException(String mensaje) {
        super(mensaje);
    }

    public DuplicateComprobanteException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
