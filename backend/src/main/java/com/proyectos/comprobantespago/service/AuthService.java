package com.proyectos.comprobantespago.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.exception.ValidationException;
import com.proyectos.comprobantespago.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para autenticación y autorización
 * Requisito 17: Autenticación y Autorización de Usuarios
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    /**
     * Autenticar usuario y generar token JWT
     */
    public Map<String, Object> login(String username, String password, Long codCia) {
        log.info("Autenticando usuario: {}", username);

        // Validar credenciales (en desarrollo, aceptar cualquier usuario)
        // En producción, validar contra base de datos
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            auditLogService.registrarAccesoDenegado(username, "LOGIN", "USUARIO", username,
                    "Credenciales inválidas", codCia);
            throw new ValidationException("Usuario y contraseña son requeridos");
        }

        // Generar tokens
        String accessToken = jwtTokenProvider.generateToken(username, codCia);
        String refreshToken = jwtTokenProvider.generateRefreshToken(username, codCia);

        // Registrar login en auditoría
        auditLogService.registrarLogin(username, codCia);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("username", username);
        response.put("codCia", codCia);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 3600); // 1 hora en segundos

        log.info("Usuario autenticado exitosamente: {}", username);
        return response;
    }

    /**
     * Cerrar sesión del usuario
     */
    public void logout(String username, Long codCia) {
        log.info("Cerrando sesión para usuario: {}", username);

        // Registrar logout en auditoría
        auditLogService.registrarLogout(username, codCia);

        log.info("Sesión cerrada exitosamente para usuario: {}", username);
    }

    /**
     * Refrescar token JWT
     */
    public Map<String, Object> refreshToken(String refreshToken) {
        log.info("Refrescando token JWT");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new ValidationException("Refresh token inválido o expirado");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        Long codCia = jwtTokenProvider.getCodCiaFromToken(refreshToken);

        String newAccessToken = jwtTokenProvider.generateToken(username, codCia);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 3600);

        log.info("Token refrescado exitosamente para usuario: {}", username);
        return response;
    }

    /**
     * Validar token JWT
     */
    public boolean validateToken(String token) {
        log.debug("Validando token JWT");

        try {
            return jwtTokenProvider.validateToken(token);
        } catch (Exception e) {
            log.debug("Token inválido: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obtener username del token
     */
    public String getUsernameFromToken(String token) {
        return jwtTokenProvider.getUsernameFromToken(token);
    }

    /**
     * Obtener codCia del token
     */
    public Long getCodCiaFromToken(String token) {
        return jwtTokenProvider.getCodCiaFromToken(token);
    }
}
