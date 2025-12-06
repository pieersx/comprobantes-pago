package com.proyectos.comprobantespago.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * Manejador global de excepciones
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
                        ResourceNotFoundException ex, WebRequest request) {
                log.error("Recurso no encontrado: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Not Found")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
                        IllegalArgumentException ex, WebRequest request) {
                log.error("Argumento inválido: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(PresupuestoInsuficienteException.class)
        public ResponseEntity<ErrorResponse> handlePresupuestoInsuficienteException(
                        PresupuestoInsuficienteException ex, WebRequest request) {
                log.error("Presupuesto insuficiente: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Presupuesto Insuficiente")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DuplicateComprobanteException.class)
        public ResponseEntity<ErrorResponse> handleDuplicateComprobanteException(
                        DuplicateComprobanteException ex, WebRequest request) {
                log.error("Comprobante duplicado: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.CONFLICT.value())
                                .error("Conflict")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(ValidationException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(
                        ValidationException ex, WebRequest request) {
                log.error("Error de validación: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Validation Error")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .validationErrors(ex.getErrores())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationExceptions(
                        MethodArgumentNotValidException ex, WebRequest request) {
                log.error("Error de validación: {}", ex.getMessage());

                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getAllErrors().forEach((error) -> {
                        String fieldName = ((FieldError) error).getField();
                        String errorMessage = error.getDefaultMessage();
                        errors.put(fieldName, errorMessage);
                });

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Validation Error")
                                .message("Error de validación en los campos")
                                .path(request.getDescription(false).replace("uri=", ""))
                                .validationErrors(errors)
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(FileStorageException.class)
        public ResponseEntity<ErrorResponse> handleFileStorageException(
                        FileStorageException ex, WebRequest request) {
                log.error("Error de almacenamiento de archivo: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("File Storage Error")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @ExceptionHandler(FileNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleFileNotFoundException(
                        FileNotFoundException ex, WebRequest request) {
                log.error("Archivo no encontrado: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("File Not Found")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(InvalidFileFormatException.class)
        public ResponseEntity<ErrorResponse> handleInvalidFileFormatException(
                        InvalidFileFormatException ex, WebRequest request) {
                log.error("Formato de archivo inválido: {}", ex.getMessage());

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Invalid File Format")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(FileSizeExceededException.class)
        public ResponseEntity<ErrorResponse> handleFileSizeExceededException(
                        FileSizeExceededException ex, WebRequest request) {
                log.error("Tamaño de archivo excedido: {}", ex.getMessage());

                Map<String, String> details = new HashMap<>();
                details.put("maxSize", String.valueOf(ex.getMaxSize()));
                details.put("maxSizeMB", String.valueOf(ex.getMaxSize() / (1024 * 1024)));

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.PAYLOAD_TOO_LARGE.value())
                                .error("File Size Exceeded")
                                .message(ex.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .validationErrors(details)
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.PAYLOAD_TOO_LARGE);
        }

        /**
         * Maneja el error PUT que genera FormContentFilter después de subir archivos.
         * Este error es inofensivo y ocurre DESPUÉS de que el archivo ya se subió
         * correctamente.
         */
        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<Void> handleMethodNotSupported(
                        HttpRequestMethodNotSupportedException ex,
                        HttpServletRequest request) {

                // Si es un error PUT en /files/*, ignorarlo silenciosamente
                // porque el archivo ya se subió correctamente en la solicitud POST anterior
                if ("PUT".equals(ex.getMethod()) && request.getRequestURI().contains("/files/")) {
                        log.info("Ignorando solicitud PUT post-upload (archivo ya subido)");
                        return ResponseEntity.status(HttpStatus.OK).build();
                }

                // Para otros casos, devolver el error normal
                log.warn("Método HTTP no soportado: {} en {}", ex.getMethod(), request.getRequestURI());
                return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGlobalException(
                        Exception ex, WebRequest request) {
                log.error("Error interno del servidor: ", ex);

                Map<String, String> details = new HashMap<>();
                details.put("exception", ex.getClass().getName());
                details.put("message", ex.getMessage() != null ? ex.getMessage() : "No message");

                // Dig deeper for wrapped exceptions
                Throwable cause = ex.getCause();
                int depth = 1;
                while (cause != null && depth <= 3) {
                        details.put("cause_" + depth, cause.getClass().getName() + ": " +
                                        (cause.getMessage() != null ? cause.getMessage() : "No message"));
                        cause = cause.getCause();
                        depth++;
                }

                ErrorResponse errorResponse = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("Internal Server Error")
                                .message(ex.getMessage() != null ? ex.getMessage()
                                                : "Ha ocurrido un error interno en el servidor")
                                .path(request.getDescription(false).replace("uri=", ""))
                                .validationErrors(details)
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
