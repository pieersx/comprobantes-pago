package com.proyectos.comprobantespago.dto.cashflow;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowMovementDTO {
    private String id;
    private String fecha;
    private String concepto;
    private String tipo;
    private BigDecimal monto;
    private String proyecto;
    private BigDecimal saldo;
    private String referencia;
}
