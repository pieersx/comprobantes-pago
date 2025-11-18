package com.proyectos.comprobantespago.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ApiResponse;
import com.proyectos.comprobantespago.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller REST para Autenticación
 * Requisito 17: Autenticación y Autorización de Usuarios
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Autenticación", description = "Gestión de autenticación y autorización")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login de usuario", description = "Autentica un usuario y retorna un token JWT")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Intento de login para usuario: {}", request.getUsername());

        Map<String, Object> response = authService.login(request.getUsername(), request.getPassword(),
                request.getCodCia());

        return ResponseEntity.ok(ApiResponse.success("Login exitoso", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout de usuario", description = "Cierra la sesión del usuario")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody LogoutRequest request) {
        log.info("Logout para usuario: {}", request.getUsername());

        authService.logout(request.getUsername(), request.getCodCia());

        return ResponseEntity.ok(ApiResponse.success("Logout exitoso", null));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refrescar token JWT", description = "Genera un nuevo token JWT usando el refresh token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(@RequestBody RefreshTokenRequest request) {
        log.info("Solicitud de refresh token");

        Map<String, Object> response = authService.refreshToken(request.getRefreshToken());

        return ResponseEntity.ok(ApiResponse.success("Token refrescado exitosamente", response));
    }

    @PostMapping("/validate-token")
    @Operation(summary = "Validar token JWT", description = "Valida si un token JWT es válido")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(@RequestBody ValidateTokenRequest request) {
        log.info("Validación de token");

        boolean isValid = authService.validateToken(request.getToken());

        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);

        if (isValid) {
            return ResponseEntity.ok(ApiResponse.success("Token válido", response));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Token inválido o expirado", response));
        }
    }

    // DTOs para requests
    public static class LoginRequest {
        private String username;
        private String password;
        private Long codCia;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Long getCodCia() {
            return codCia;
        }

        public void setCodCia(Long codCia) {
            this.codCia = codCia;
        }
    }

    public static class LogoutRequest {
        private String username;
        private Long codCia;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public Long getCodCia() {
            return codCia;
        }

        public void setCodCia(Long codCia) {
            this.codCia = codCia;
        }
    }

    public static class RefreshTokenRequest {
        private String refreshToken;

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

    public static class ValidateTokenRequest {
        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
