package com.proyectos.comprobantespago.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestLoggingInterceptor extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Log para comprobantes-pago
        if (request.getRequestURI().contains("/comprobantes-pago") && "POST".equals(request.getMethod())) {
            System.out.println("🔍 Request recibido:");
            System.out.println("  URI: " + request.getRequestURI());
            System.out.println("  Method: " + request.getMethod());
            System.out.println("  Content-Type: " + request.getContentType());

            // Log de headers
            System.out.println("  Headers:");
            request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
                System.out.println("    " + headerName + ": " + request.getHeader(headerName));
            });
        }

        // Log para files (debugging upload)
        if (request.getRequestURI().contains("/files")) {
            System.out.println("📁 File Upload Request:");
            System.out.println("  URI completo: " + request.getRequestURI());
            System.out.println("  Context Path: " + request.getContextPath());
            System.out.println("  Servlet Path: " + request.getServletPath());
            System.out.println("  Method: " + request.getMethod());
            System.out.println("  Content-Type: " + request.getContentType());
        }

        filterChain.doFilter(request, response);
    }
}
