package com.proyectos.comprobantespago.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

/**
 * Excepción para errores de validación general
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class ValidationException extends RuntimeException {
    private final Map<String, String> errores;

    public ValidationException(String mensaje) {
        super(mensaje);
        this.errores = null;
    }

    public ValidationException(Map<String, String> errores) {
        super("Errores de validación");
        this.errores = errores;
    }

    public ValidationException(String mensaje, Map<String, String> errores) {
        super(mensaje);
        this.errores = errores;
    }
}
