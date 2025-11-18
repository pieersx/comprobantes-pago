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
public class CashflowSummaryDTO {
    private String periodLabel;
    private BigDecimal ingresos;
    private BigDecimal egresos;
    private BigDecimal saldo;
    private double variacion;
}
