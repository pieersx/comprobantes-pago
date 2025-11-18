# Backend - Sistema de Comprobantes de Pago

## Stack Tecnológico

- **Spring Boot**: 3.5.7
- **Java**: 21 (LTS)
- **Base de Datos**: Oracle Database
- **ORM**: Spring Data JPA + Hibernate
- **Seguridad**: Spring Security + JWT
- **Documentación**: SpringDoc OpenAPI 3 (Swagger)
- **Mapeo**: MapStruct 1.6.3
- **Utilidades**: Lombok
- **Métricas**: Micrometer + Prometheus

## Estructura del Proyecto

```
src/main/java/com/proyectos/comprobantespago/
├── config/              # Configuraciones (Security, OpenAPI, etc.)
├── controller/          # REST Controllers
├── service/             # Lógica de negocio
├── repository/          # Repositorios JPA
├── entity/              # Entidades JPA
├── dto/                 # Data Transfer Objects
├── mapper/              # MapStruct Mappers
├── security/            # JWT, Auth, etc.
├── exception/           # Excepciones personalizadas
└── util/                # Utilidades
```

## Configuración

### Base de Datos Oracle

Configurar en `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:ORCL
    username: your_username
    password: your_password
```

### Variables de Entorno

- `DB_USERNAME`: Usuario de base de datos
- `DB_PASSWORD`: Contraseña de base de datos
- `JWT_SECRET`: Secret para JWT tokens

## Ejecutar el Proyecto

```bash
# Compilar
./mvnw clean install

# Ejecutar
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```

## Endpoints Principales

- **API Docs**: http://localhost:8080/api/api-docs
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Actuator**: http://localhost:8080/api/actuator
- **Health**: http://localhost:8080/api/actuator/health

## Arquitectura Multi-Tenant

El sistema soporta múltiples empresas usando el campo `CodCIA` como discriminador.
Todas las entidades extienden de `BaseEntity` que incluye este campo.

## Seguridad

- Autenticación basada en JWT
- CORS configurado para desarrollo (localhost:3000)
- Sesiones stateless
- BCrypt para passwords
