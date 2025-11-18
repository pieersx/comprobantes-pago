package com.proyectos.comprobantespago.exception;

import com.proyectos.comprobantespago.dto.DetalleValidacionDTO;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

/**
 * Excepción lanzada cuando un egreso supera el presupuesto disponible
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class PresupuestoInsuficienteException extends RuntimeException {
    private final List<DetalleValidacionDTO> detalles;

    public PresupuestoInsuficienteException(String mensaje) {
        super(mensaje);
        this.detalles = null;
    }

    public PresupuestoInsuficienteException(String mensaje, List<DetalleValidacionDTO> detalles) {
        super(mensaje);
        this.detalles = detalles;
    }
}
