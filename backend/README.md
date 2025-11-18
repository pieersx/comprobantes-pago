# Backend - Sistema Multi-Empresa de Gestión de Comprobantes de Pago

## 📋 Descripción
Backend completo de producción para el Sistema Multi-Empresa de Gestión de Comprobantes de Pago (Ingresos/Egresos) desarrollado con **Spring Boot 3.5.7**, **JPA/Hibernate**, **Lombok**, **MapStruct** y **Oracle Database**.

## 🏗️ Arquitectura

### Estructura del Proyecto
```
backend/
├── src/main/java/com/proyectos/comprobantespago/
│   ├── entity/              # Entidades JPA (15 tablas)
│   ├── repository/          # Repositorios/DAOs con Spring Data JPA
│   ├── dto/                 # Data Transfer Objects
│   ├── service/             # Capa de servicios (lógica de negocio)
│   ├── controller/          # Controladores REST
│   ├── config/              # Configuraciones (Swagger, etc.)
│   └── ComprobantesPagoApplication.java
└── src/main/resources/
    └── application.properties
```

### Capas Implementadas
1. **Entity Layer**: 15 entidades JPA mapeadas a tablas Oracle
2. **Repository Layer**: Repositorios Spring Data JPA con queries personalizadas
3. **DTO Layer**: DTOs de request/response con validaciones
4. **Service Layer**: Lógica de negocio con transacciones
5. **Controller Layer**: API REST con documentación Swagger

## 🗄️ Entidades Implementadas (Todas las Tablas del Schema)

### Entidades Maestras
- ✅ `Cia` - Compañías/Empresas del sistema
- ✅ `Tabs` - Catálogos maestros (tipos de moneda, unidades, comprobantes, estados)
- ✅ `Elementos` - Elementos de catálogos

### Entidades de Personas y Relaciones
- ✅ `Persona` - Tabla base para clientes, proveedores y empleados
- ✅ `Cliente` - Clientes (hereda de Persona)
- ✅ `Proveedor` - Proveedores (hereda de Persona)
- ✅ `Proyecto` - Proyectos con información técnica y financiera

### Entidades de Partidas Presupuestales
- ✅ `Partida` - Partidas presupuestales maestras (Ingresos/Egresos)
- ✅ `PartidaMezcla` - Composición/estructura de partidas
- ✅ `ProyPartida` - Partidas asignadas a proyectos
- ✅ `ProyPartidaMezcla` - Detalle de partidas en proyectos
- ✅ `DProyPartidaMezcla` - Desembolsos/pagos de partidas

### Entidades de Comprobantes de Pago (EGRESOS)
- ✅ `ComprobantePagoCab` - Cabecera de comprobantes de egreso a proveedores
- ✅ `ComprobantePagoDet` - Detalle de comprobantes de egreso

### Entidades de Comprobantes de Venta (INGRESOS)
- ✅ `VtaCompPagoCab` - Cabecera de comprobantes de ingreso/venta a clientes
- ✅ `VtaCompPagoDet` - Detalle de comprobantes de ingreso

## 🚀 Tecnologías Utilizadas

- **Spring Boot 3.5.7** (Última versión estable)
- **Java 21** (LTS)
- **Spring Data JPA** (ORM)
- **Hibernate** con OracleDialect
- **Lombok 1.18.34** (reducción de boilerplate)
- **MapStruct 1.6.3** (mapeo DTO-Entity)
- **SpringDoc OpenAPI 2.7.0** (Swagger UI/OpenAPI 3.0)
- **Spring Security 6.x** con JWT
- **Oracle JDBC Driver** (ojdbc11)
- **Spring Validation** (validación de datos)
- **Spring Boot Actuator** (monitoreo y métricas)
- **Micrometer Prometheus** (métricas para producción)

## 📦 Instalación y Configuración

### Prerrequisitos
- Java 21+
- Maven 3.9+
- Oracle Database 23c (o compatible)

### 1. Configurar Base de Datos
Edita `src/main/resources/application.properties`:

```properties
# Conexión a Oracle
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### 2. Compilar el Proyecto
```bash
cd backend
./mvnw clean package
```

### 3. Ejecutar la Aplicación
```bash
./mvnw spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080/api`

## 📚 Documentación API (Swagger)

Una vez iniciada la aplicación, accede a:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## 🔌 Endpoints Principales de la API REST

### Compañías
```
GET    /api/v1/companias                      # Listar compañías vigentes
GET    /api/v1/companias/{codCia}             # Obtener compañía por código
POST   /api/v1/companias                      # Crear nueva compañía
PUT    /api/v1/companias/{codCia}             # Actualizar compañía
DELETE /api/v1/companias/{codCia}             # Inactivar compañía
```

### Catálogos y Elementos
```
GET    /api/v1/tabs                           # Listar tablas de catálogos
GET    /api/v1/tabs/{codTab}                  # Obtener tabla por código
GET    /api/v1/elementos/tabla/{codTab}       # Elementos de una tabla
GET    /api/v1/elementos/monedas              # Tipos de moneda
GET    /api/v1/elementos/unidades-medida      # Unidades de medida
GET    /api/v1/elementos/tipos-comprobante    # Tipos de comprobante
```

### Comprobantes de Venta/Ingreso
```
POST   /api/v1/comprobantes-venta                     # Crear comprobante de ingreso
GET    /api/v1/comprobantes-venta/{codCia}/{nroCp}    # Obtener por ID
GET    /api/v1/comprobantes-venta/compania/{codCia}   # Listar por compañía
GET    /api/v1/comprobantes-venta/proyecto/{codCia}/{codPyto}  # Por proyecto
GET    /api/v1/comprobantes-venta/cliente/{codCia}/{codCliente} # Por cliente
GET    /api/v1/comprobantes-venta/rango-fechas/{codCia}?fechaInicio=2024-01-01&fechaFin=2024-12-31
PUT    /api/v1/comprobantes-venta/{codCia}/{nroCp}    # Actualizar comprobante
DELETE /api/v1/comprobantes-venta/{codCia}/{nroCp}    # Eliminar comprobante
```

### Comprobantes de Pago/Egreso
```
POST   /api/v1/comprobantes-pago                      # Crear comprobante de egreso
GET    /api/v1/comprobantes-pago/{codCia}/{codProveedor}/{nroCp}  # Obtener por ID
GET    /api/v1/comprobantes-pago/compania/{codCia}    # Listar por compañía
GET    /api/v1/comprobantes-pago/proyecto/{codCia}/{codPyto}      # Por proyecto
```

## 📝 Ejemplo de Uso

### Crear Comprobante de Pago (EGRESO)
```json
POST /api/comprobantes-pago

{
  "codCia": 1,
  "fecEmision": "2024-01-15",
  "codProveedor": 1001,
  "codProyecto": 5,
  "impTotal": 5000.00,
  "moneda": "S",
  "estComppago": "REG",
  "tipoPago": "EFE",
  "glosa": "Pago a proveedor por servicios",
  "detalles": [
    {
      "item": 1,
      "glosa": "Servicio de consultoría",
      "importe": 3000.00
    },
    {
      "item": 2,
      "glosa": "Gastos administrativos",
      "importe": 2000.00
    }
  ]
}
```

### Crear Factura de Venta (INGRESO)
```json
POST /api/facturas-venta

{
  "codCia": 1,
  "fecEmision": "2024-01-20",
  "codCliente": 2001,
  "codProyecto": 5,
  "valDscto": 100.00,
  "valIgv": 900.00,
  "impTotal": 5900.00,
  "moneda": "S",
  "estFactVenta": "REG",
  "tipoPago": "CRE",
  "detalles": [
    {
      "item": 1,
      "glosa": "Desarrollo de módulo principal",
      "importe": 5000.00
    }
  ]
}
```

## 🔐 Estados del Sistema

### Estados de Comprobantes (EST_COMPPAGO)
- **REG**: Registrado
- **PAG**: Pagado
- **PEN**: Pendiente
- **VEN**: Vencido

### Estados de Facturas (EST_FACTVENTA)
- **REG**: Registrado
- **COB**: Cobrado
- **PEN**: Pendiente
- **ANU**: Anulado

### Tipos de Pago (TIPO_PAGO)
- **EFE**: Efectivo
- **CHE**: Cheque
- **TRA**: Transferencia
- **CRE**: Crédito

## 🛠️ Características Técnicas

### Validaciones
- ✅ Validación de datos con **Bean Validation** (@NotNull, @Size, @DecimalMin)
- ✅ Manejo de errores con excepciones personalizadas
- ✅ Validación de llaves compuestas

### Transacciones
- ✅ Gestión transaccional con `@Transactional`
- ✅ Rollback automático en caso de error
- ✅ Propagación de transacciones controlada

### Rendimiento
- ✅ **FetchType.LAZY** en relaciones para evitar N+1 queries
- ✅ Queries optimizadas con JPQL
- ✅ Índices en base de datos para búsquedas rápidas

### Seguridad
- 🔄 CORS configurado (pendiente según frontend)
- 🔄 Autenticación/Autorización (implementar según requerimientos)

## 📊 Funcionalidades Clave

1. **Gestión de Comprobantes de Pago (EGRESOS)**
   - Registro de pagos a proveedores
   - Control por proyecto
   - Estados: REG, PAG, PEN, VEN
   - Detalle de conceptos pagados

2. **Gestión de Facturas de Venta (INGRESOS)**
   - Registro de ingresos por proyecto
   - Facturación a clientes
   - Cálculo de IGV y descuentos
   - Seguimiento de cobros

3. **Control de Pagos a Especialistas**
   - Validación de montos contratados vs pagados
   - Acumulado de pagos por especialista
   - Alertas de excesos

4. **Flujo de Caja**
   - Registro maestro por proyecto/año
   - Detalle mensual de ingresos/egresos
   - Cálculo de saldos

## 🧪 Testing

### Pruebas con API REST Client (api.http)
El proyecto incluye `api.http` para probar endpoints. Usa extensiones como:
- **REST Client** (VS Code)
- **HTTP Client** (IntelliJ IDEA)

## 🐛 Solución de Problemas

### Error: "No suitable driver found for jdbc:oracle"
- Verifica que `ojdbc11` esté en `pom.xml`
- Ejecuta: `./mvnw clean install`

### Error: "Table or view does not exist"
- Ejecuta el script `db_proyecto9_mejorado.sql` en Oracle
- Verifica el usuario y permisos

### Error: "Lombok not working"
- Instala el plugin de Lombok en tu IDE
- Habilita annotation processing

## 📈 Próximas Mejoras

- [ ] Implementar autenticación JWT
- [ ] Agregar caché con Redis
- [ ] Implementar paginación en listados
- [ ] Agregar reportes en PDF/Excel
- [ ] Implementar auditoría de cambios
- [ ] WebSockets para notificaciones en tiempo real

## 👥 Contribución

Este proyecto es parte del **Proyecto 9** del curso universitario. Para contribuir:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es de uso académico para el curso universitario.

---

**Desarrollado con ❤️ usando Spring Boot y Oracle Database**
