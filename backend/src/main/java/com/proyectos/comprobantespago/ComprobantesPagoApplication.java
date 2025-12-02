package com.proyectos.comprobantespago;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Aplicación principal del Sistema de Gestión de Comprobantes de Pago
 * Proyecto 9 - Gestión de Comprobantes de Pago Ingresos/Egresos
 *
 * @author Sistema de Proyectos
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaRepositories
public class ComprobantesPagoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComprobantesPagoApplication.class, args);
		System.out.println("\n========================================");
		System.out.println("Sistema de Gestión de Comprobantes de Pago");
		System.out.println("Proyecto 9 - Iniciado correctamente");
		System.out.println("Puerto: 6969");
		System.out.println("Base de Datos: C##py02@localhost:1521:XE");
		System.out.println("Swagger UI: http://localhost:6969/api/v1/swagger-ui/index.html");
		System.out.println("========================================\n");
	}

}
