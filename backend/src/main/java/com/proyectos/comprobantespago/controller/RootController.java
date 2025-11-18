package com.proyectos.comprobantespago.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Hidden;

@RestController
@RequestMapping("/")
@Hidden
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sistema de Gestión de Comprobantes de Pago - API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("timestamp", LocalDateTime.now());
        response.put("swagger", "/swagger-ui/index.html");
        response.put("api-docs", "/v3/api-docs");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("clientes", "/clientes");
        endpoints.put("proveedores", "/proveedores");
        endpoints.put("empleados", "/empleados");
        endpoints.put("proyectos", "/proyectos");
        endpoints.put("partidas", "/partidas");
        endpoints.put("comprobantes", "/comprobantes-pago");

        response.put("endpoints", endpoints);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
