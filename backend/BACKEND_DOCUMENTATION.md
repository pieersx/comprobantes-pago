# 📚 Documentación del Backend - Sistema de Comprobantes de Pago

## 🎯 Arquitectura

El backend está construido con **Spring Boot 3.5.7** siguiendo una arquitectura en capas:

```
Controller → Service → Repository → Entity
     ↓          ↓          ↓
    DTO ←  Mapper  ←  Database
```

## 📦 Estructura del Proyecto

```
src/main/java/com/proyectos/comprobantespago/
├── config/                 # Configuraciones (Security, OpenAPI)
├── controller/             # REST Controllers
├── service/                # Lógica de negocio
├── repository/             # Repositorios JPA
├── entity/                 # Entidades JPA
├── dto/                    # Data Transfer Objects
├── mapper/                 # MapStruct Mappers
├── exception/              # Manejo de excepciones
└── ComprobantesPagoApplication.java
```

## 🗄️ Entidades Principales

### 1. **Compania** (CIA)
- Tabla principal para multi-tenancy
- Todas las demás entidades tienen `codCia` como discriminador
- **PK**: `codCia`

### 2. **Persona** (PERSONA)
- Clase base para Cliente, Proveedor y Empleado
- **PK**: `codCia`, `codPersona`
- **Campos**: tipPersona, desPersona, desCorta, etc.

### 3. **Cliente** (CLIENTE)
- Hereda de Persona
- **PK**: `codCia`, `codCliente`
- **FK**: Persona

### 4. **Proveedor** (PROVEEDOR)
- Hereda de Persona
- **PK**: `codCia`, `codProveedor`
- **FK**: Persona

### 5. **Empleado** (EMPLEADO)
- Hereda de Persona
- **PK**: `codCia`, `codEmpleado`
- **FK**: Persona
- **Campos adicionales**: dni, email, celular, foto, etc.

### 6. **Proyecto** (PROYECTO)
- **PK**: `codCia`, `codPyto`
- **FK**: Compania, Empleado (jefe), Cliente
- **Campos**: nombPyto, costos, fechas, ubicación, etc.

### 7. **ComprobantePagoCab** (COMP_PAGOCAB)
- Cabecera de comprobantes de pago (egresos)
- **PK**: `codCia`, `codProveedor`, `nroCp`
- **FK**: Proveedor, Proyecto
- **Campos**: fechas, montos, estado, tipo comprobante

### 8. **ComprobantePagoDet** (COMP_PAGODET)
- Detalle de comprobantes de pago
- **PK**: `codCia`, `codProveedor`, `nroCp`, `sec`
- **FK**: ComprobantePagoCab
- **Campos**: partida, montos por línea

## 🔄 DTOs

### CompaniaDTO
```java
{
  "codCia": 1,
  "desCia": "Empresa XYZ S.A.C.",
  "desCorta": "XYZ",
  "vigente": "1"
}
```

### ProyectoDTO
```java
{
  "codCia": 1,
  "codPyto": 100,
  "nombPyto": "Construcción de Puente",
  "emplJefeProy": 5,
  "codCliente": 10,
  "annoIni": 2024,
  "annoFin": 2025,
  "costoTotal": 1500000.00,
  // ... más campos
}
```

### ComprobantePagoDTO
```java
{
  "codCia": 1,
  "codProveedor": 20,
  "nroCp": "F001-00123",
  "codPyto": 100,
  "fecCp": "2024-11-06",
  "impTotalMn": 5000.00,
  "codEstado": "REG",
  "detalles": [
    {
      "sec": 1,
      "codPartida": 50,
      "impTotalMn": 3000.00
    },
    {
      "sec": 2,
      "codPartida": 51,
      "impTotalMn": 2000.00
    }
  ]
}
```

## 🛣️ Endpoints REST

### Compañías (`/api/companias`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/companias` | Listar todas |
| GET | `/companias/activas` | Listar activas |
| GET | `/companias/{id}` | Obtener por ID |
| POST | `/companias` | Crear nueva |
| PUT | `/companias/{id}` | Actualizar |
| DELETE | `/companias/{id}` | Desactivar |

### Proyectos (`/api/proyectos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/proyectos?codCia={id}` | Listar por compañía |
| GET | `/proyectos/{codCia}/{codPyto}` | Obtener por ID |
| GET | `/proyectos/jefe/{codCia}/{codEmpleado}` | Por jefe proyecto |
| GET | `/proyectos/cliente/{codCia}/{codCliente}` | Por cliente |
| GET | `/proyectos/anio/{codCia}/{anio}` | Por año |
| POST | `/proyectos` | Crear nuevo |
| PUT | `/proyectos/{codCia}/{codPyto}` | Actualizar |
| DELETE | `/proyectos/{codCia}/{codPyto}` | Desactivar |

### Comprobantes de Pago (`/api/comprobantes-pago`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/comprobantes-pago/proyecto/{codCia}/{codPyto}` | Por proyecto |
| GET | `/comprobantes-pago/proveedor/{codCia}/{codProveedor}` | Por proveedor |
| GET | `/comprobantes-pago/estado/{codCia}/{estado}` | Por estado |
| GET | `/comprobantes-pago/fecha-range/{codCia}?fechaInicio=&fechaFin=` | Por rango fechas |
| GET | `/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}` | Obtener por ID |
| POST | `/comprobantes-pago` | Crear nuevo |
| PUT | `/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}` | Actualizar |
| PATCH | `/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}/estado` | Cambiar estado |
| GET | `/comprobantes-pago/total-pagado/{codCia}/{codPyto}` | Total pagado |

## 🔐 Estados de Comprobantes

- **REG**: Registrado (inicial)
- **PAG**: Pagado
- **PEN**: Pendiente
- **VEN**: Vencido

## 🎯 Validaciones de Negocio

### ComprobantePagoService

1. **Validación de totales**: La suma de detalles debe coincidir con el total de la cabecera
2. **Estado inicial**: Los comprobantes se crean con estado "REG"
3. **Fecha de abono**: Se establece automáticamente al cambiar estado a "PAG"

### ProyectoService

1. **Validación de años**: `annoFin` debe ser >= `annoIni`
2. **Soft delete**: Los proyectos se desactivan (vigente='0') en lugar de eliminarse

### CompaniaService

1. **Unicidad**: No se permiten compañías con el mismo nombre
2. **Soft delete**: Las compañías se desactivan en lugar de eliminarse

## 🗺️ Mappers (MapStruct)

Los mappers convierten automáticamente entre Entities y DTOs:

```java
@Mapper(componentModel = "spring")
public interface CompaniaMapper {
    CompaniaDTO toDTO(Compania entity);
    Compania toEntity(CompaniaDTO dto);
    List<CompaniaDTO> toDTOList(List<Compania> entities);
    void updateEntityFromDTO(CompaniaDTO dto, @MappingTarget Compania entity);
}
```

## ⚠️ Manejo de Excepciones

### GlobalExceptionHandler

Maneja todas las excepciones de forma centralizada:

- **ResourceNotFoundException** → 404 Not Found
- **IllegalArgumentException** → 400 Bad Request
- **MethodArgumentNotValidException** → 400 Bad Request (validaciones)
- **Exception** → 500 Internal Server Error

### Formato de respuesta de error:

```json
{
  "timestamp": "2024-11-06T22:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Compañía no encontrada con ID: 999",
  "path": "/api/companias/999"
}
```

## 🔍 Queries Personalizadas

### ComprobantePagoCabRepository

```java
// Total pagado por proyecto
@Query("SELECT SUM(c.impTotalMn) FROM ComprobantePagoCab c 
        WHERE c.codCia = :codCia AND c.codPyto = :codPyto 
        AND c.codEstado = 'PAG'")
BigDecimal getTotalPagadoByProyecto(@Param("codCia") Long codCia, 
                                     @Param("codPyto") Long codPyto);
```

### ProyectoRepository

```java
// Proyectos por año
@Query("SELECT p FROM Proyecto p 
        WHERE p.codCia = :codCia 
        AND p.annoIni <= :anio 
        AND p.annoFin >= :anio 
        AND p.vigente = '1'")
List<Proyecto> findByAnio(@Param("codCia") Long codCia, 
                           @Param("anio") Integer anio);
```

## 📊 Logging

El sistema utiliza SLF4J + Logback:

```java
@Slf4j
public class CompaniaService {
    public CompaniaDTO create(CompaniaDTO dto) {
        log.debug("Creando nueva compañía: {}", dto.getDesCia());
        // ...
        log.info("Compañía creada con ID: {}", compania.getCodCia());
    }
}
```

## 🧪 Testing

### Estructura de tests (pendiente)

```
src/test/java/com/proyectos/comprobantespago/
├── controller/    # Tests de integración
├── service/       # Tests unitarios
└── repository/    # Tests de repositorio
```

## 🚀 Ejecución

### Desarrollo

```bash
./mvnw spring-boot:run
```

### Producción

```bash
./mvnw clean package
java -jar target/comprobantes-pago-1.0.0.jar
```

### Con Docker

```bash
docker-compose -f .devcontainer/docker-compose.yml up -d
```

## 📝 Swagger UI

Acceder a la documentación interactiva:

**URL**: http://localhost:8080/api/swagger-ui.html

## 🔧 Configuración

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@oracle:1521/FREEPDB1
    username: oracle
    password: oracle
  
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: true

server:
  port: 8080
  servlet:
    context-path: /api
```

## 🎓 Buenas Prácticas Implementadas

1. ✅ **Arquitectura en capas** clara y separada
2. ✅ **DTOs** para no exponer entidades directamente
3. ✅ **MapStruct** para mapeo automático
4. ✅ **Validaciones** con Bean Validation
5. ✅ **Manejo centralizado** de excepciones
6. ✅ **Logging** estructurado
7. ✅ **Documentación** con OpenAPI/Swagger
8. ✅ **Soft delete** en lugar de eliminación física
9. ✅ **Transacciones** con `@Transactional`
10. ✅ **Queries optimizadas** con JPA

## 📚 Próximos Pasos

- [ ] Implementar tests unitarios e integración
- [ ] Agregar paginación en listados
- [ ] Implementar filtros avanzados
- [ ] Agregar caché con Redis
- [ ] Implementar auditoría (createdBy, modifiedBy)
- [ ] Agregar endpoints para VTACOMP (comprobantes de venta)
- [ ] Implementar FLUJOCAJA (flujo de caja)
- [ ] Agregar reportes en PDF/Excel

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024  
**Autor**: Equipo de Desarrollo
