package com.proyectos.comprobantespago.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción para tamaño de archivo excedido
 */
@ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
@Getter
public class FileSizeExceededException extends ValidationException {

    private final long maxSize;

    public FileSizeExceededException(String message, long maxSize) {
        super(message);
        this.maxSize = maxSize;
    }
}
