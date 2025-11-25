package com.proyectos.comprobantespago.enums;

/**
 * Enum para estados de comprobantes de pago
 * Basado en la tabla ELEMENTOS con CODTAB='004'
 */
public enum EstadoComprobanteEnum {

    REGISTRADO("001", "Registrado", "Comprobante registrado, sin abono"),
    PARCIALMENTE_PAGADO("002", "Parcialmente Pagado", "Abono parcial registrado"),
    TOTALMENTE_PAGADO("003", "Totalmente Pagado", "Pago completo realizado"),
    ANULADO("004", "Anulado", "Comprobante anulado");

    private final String codigo;
    private final String descripcion;
    private final String detalle;

    EstadoComprobanteEnum(String codigo, String descripcion, String detalle) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.detalle = detalle;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getDetalle() {
        return detalle;
    }

    /**
     * Obtiene el enum por código
     */
    public static EstadoComprobanteEnum fromCodigo(String codigo) {
        for (EstadoComprobanteEnum estado : values()) {
            if (estado.codigo.equals(codigo)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Código de estado no válido: " + codigo);
    }

    /**
     * Valida si es posible cambiar de un estado a otro
     */
    public boolean puedeTransicionarA(EstadoComprobanteEnum nuevoEstado) {
        // Desde REGISTRADO puede ir a cualquier otro estado
        if (this == REGISTRADO) {
            return nuevoEstado != REGISTRADO;
        }

        // Desde PARCIALMENTE_PAGADO puede ir a TOTALMENTE_PAGADO o ANULADO
        if (this == PARCIALMENTE_PAGADO) {
            return nuevoEstado == TOTALMENTE_PAGADO || nuevoEstado == ANULADO;
        }

        // Desde TOTALMENTE_PAGADO solo puede anularse (con confirmación)
        if (this == TOTALMENTE_PAGADO) {
            return nuevoEstado == ANULADO;
        }

        // ANULADO es estado final, no puede cambiar
        return false;
    }

    /**
     * Verifica si el estado permite edición del comprobante
     */
    public boolean permiteEdicion() {
        return this == REGISTRADO || this == PARCIALMENTE_PAGADO;
    }

    /**
     * Verifica si el estado permite agregar abonos
     */
    public boolean permiteAbonos() {
        return this == REGISTRADO || this == PARCIALMENTE_PAGADO;
    }

    /**
     * Verifica si el estado es final (no permite más cambios)
     */
    public boolean esFinal() {
        return this == ANULADO;
    }
}
