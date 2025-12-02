package com.proyectos.comprobantespago.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Gestión de Comprobantes de Pago API")
                        .version("1.0.0")
                        .description("API REST para la gestión de comprobantes de pago con arquitectura multi-empresa")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo")
                                .email("dev@comprobantespago.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:6969/api/v1")
                                .description("Servidor de Desarrollo"),
                        new Server()
                                .url("https://api.comprobantespago.com/api")
                                .description("Servidor de Producción")));
    }
}
