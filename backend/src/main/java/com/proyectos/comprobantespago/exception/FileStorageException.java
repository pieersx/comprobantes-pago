package com.proyectos.comprobantespago.exception;

/**
 * Excepción lanzada cuando ocurre un error al almacenar un archivo
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
