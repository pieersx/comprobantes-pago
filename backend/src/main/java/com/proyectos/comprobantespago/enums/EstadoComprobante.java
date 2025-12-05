package com.proyectos.comprobantespago.enums;

/**
 * Estados de los comprobantes de pago
 * Según especificaciones del profesor y tabla ELEMENTOS (CodTab = '014')
 */
public enum EstadoComprobante {
    REGISTRADO("REG", "Registrado - Sin pago"),
    PAGADO("PAG", "Pagado"),
    ANULADO("ANU", "Anulado");

    private final String codigo;
    private final String descripcion;

    EstadoComprobante(String codigo, String descripcion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Obtener enum desde código de BD
     */
    public static EstadoComprobante fromCodigo(String codigo) {
        for (EstadoComprobante estado : values()) {
            if (estado.codigo.equals(codigo)) {
                return estado;
            }
        }
        return REGISTRADO; // Default
    }
}
