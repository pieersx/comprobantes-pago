package com.proyectos.comprobantespago.exception;

/**
 * Excepción lanzada cuando no se encuentra un archivo solicitado
 */
public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String message) {
        super(message);
    }

    public FileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
