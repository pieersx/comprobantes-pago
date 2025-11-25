package com.proyectos.comprobantespago.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción para formato de archivo inválido
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFileFormatException extends ValidationException {

    public InvalidFileFormatException(String message) {
        super(message);
    }
}
