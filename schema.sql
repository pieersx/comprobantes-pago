-- ============================================================================
-- SCRIPT DE BASE DE DATOS - SISTEMA DE COMPROBANTES DE PAGO
-- ============================================================================
-- Descripción: Script completo para la creación del esquema de base de datos
--              del sistema de gestión de comprobantes de pago para proyectos
-- ============================================================================

-- ============================================================================
-- SECCIÓN 1: ELIMINACIÓN DE TABLAS EXISTENTES
-- ============================================================================
-- Se eliminan las tablas en orden inverso a las dependencias (hijos primero)
-- ============================================================================

-- Tablas de detalle (nivel más bajo)
DROP TABLE VTACOMP_PAGODET CASCADE CONSTRAINTS;
DROP TABLE COMP_PAGODET CASCADE CONSTRAINTS;
DROP TABLE COMP_PAGOEMPLEADO_DET CASCADE CONSTRAINTS;

-- Tablas de cabecera de comprobantes
DROP TABLE VTACOMP_PAGOCAB CASCADE CONSTRAINTS;
DROP TABLE COMP_PAGOCAB CASCADE CONSTRAINTS;
DROP TABLE COMP_PAGOEMPLEADO CASCADE CONSTRAINTS;

-- Tablas de partidas de proyecto
DROP TABLE PROY_PARTIDA_MEZCLA CASCADE CONSTRAINTS;
DROP TABLE PROY_PARTIDA CASCADE CONSTRAINTS;
DROP TABLE PARTIDA_MEZCLA CASCADE CONSTRAINTS;
DROP TABLE PARTIDA CASCADE CONSTRAINTS;

-- Tablas de proyecto
DROP TABLE PROYECTO CASCADE CONSTRAINTS;

-- Tablas de entidades
DROP TABLE EMPLEADO CASCADE CONSTRAINTS;
DROP TABLE CLIENTE CASCADE CONSTRAINTS;
DROP TABLE PROVEEDOR CASCADE CONSTRAINTS;
DROP TABLE PERSONA CASCADE CONSTRAINTS;

-- Tablas de catálogos
DROP TABLE ELEMENTOS CASCADE CONSTRAINTS;
DROP TABLE TABS CASCADE CONSTRAINTS;

-- Tabla base
DROP TABLE CIA CASCADE CONSTRAINTS;

-- ============================================================================
-- SECCIÓN 2: CREACIÓN DE TABLAS
-- ============================================================================

-- ============================================================================
-- 2.1 TABLAS BASE (Sin dependencias de otras tablas)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CIA: Empresas/Compañías del sistema
-- Descripción: Tabla maestra que almacena las empresas registradas en el sistema.
--              Cada compañía tiene un código único y puede tener múltiples proyectos.
-- ----------------------------------------------------------------------------
CREATE TABLE CIA (
    CodCIA      NUMBER(6)       NOT NULL,
    DesCia      VARCHAR2(100)   NOT NULL,
    DesCorta    VARCHAR2(20)    NOT NULL,
    Vigente     VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT CIA_PK PRIMARY KEY (CodCIA)
);

-- ----------------------------------------------------------------------------
-- TABS: Catálogos maestros del sistema
-- Descripción: Define los tipos de catálogos disponibles (monedas, estados, etc.)
--              Cada catálogo agrupa elementos relacionados.
-- ----------------------------------------------------------------------------
CREATE TABLE TABS (
    CodTab      VARCHAR2(3)     NOT NULL,
    DenTab      VARCHAR2(50)    NOT NULL,
    DenCorta    VARCHAR2(10)    NOT NULL,
    Vigente     VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT TABS_PK PRIMARY KEY (CodTab)
);

-- ----------------------------------------------------------------------------
-- ELEMENTOS: Valores de los catálogos
-- Descripción: Almacena los elementos de cada catálogo (ej: PEN, USD para monedas).
--              Referencia a TABS para mantener la integridad.
-- ----------------------------------------------------------------------------
CREATE TABLE ELEMENTOS (
    CodTab      VARCHAR2(3)     NOT NULL,
    CodElem     VARCHAR2(3)     NOT NULL,
    DenEle      VARCHAR2(50)    NOT NULL,
    DenCorta    VARCHAR2(10)    NOT NULL,
    Vigente     VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT ELEMENTOS_PK PRIMARY KEY (CodTab, CodElem),
    -- Llave Foránea
    CONSTRAINT ELEMENTOS_TABS_FK FOREIGN KEY (CodTab)
        REFERENCES TABS (CodTab)
);

-- ----------------------------------------------------------------------------
-- PERSONA: Base única para clientes, proveedores, empleados y empresas
-- Descripción: Tabla base que almacena información común de todas las personas.
--              Los tipos son: E=Empleado, C=Cliente, P=Proveedor.
-- ----------------------------------------------------------------------------
CREATE TABLE PERSONA (
    CodCIA          NUMBER(6)       NOT NULL,
    CodPersona      NUMBER(6)       NOT NULL,
    TipPersona      VARCHAR2(1)     NOT NULL,
    DesPersona      VARCHAR2(100)   NOT NULL,
    DesCorta        VARCHAR2(30)    NOT NULL,
    DescAlterna     VARCHAR2(100)   NOT NULL,
    DesCortaAlt     VARCHAR2(10)    NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PERSONA_PK PRIMARY KEY (CodCIA, CodPersona),
    -- Llave Foránea
    CONSTRAINT PERSONA_CIA_FK FOREIGN KEY (CodCIA)
        REFERENCES CIA (CodCIA)
);

-- ============================================================================
-- 2.2 TABLAS DE ENTIDADES (Dependen de CIA y PERSONA)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROVEEDOR: Proveedores de la empresa (para facturas de egreso)
-- Descripción: Extiende PERSONA con datos específicos de proveedores.
-- ----------------------------------------------------------------------------
CREATE TABLE PROVEEDOR (
    CodCia          NUMBER(6)       NOT NULL,
    CodProveedor    NUMBER(6)       NOT NULL,
    NroRuc          VARCHAR2(20)    NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PROVEEDOR_PK PRIMARY KEY (CodCia, CodProveedor),
    -- Llave Foránea
    CONSTRAINT PROVEEDOR_PERSONA_FK FOREIGN KEY (CodCia, CodProveedor)
        REFERENCES PERSONA (CodCIA, CodPersona)
);

-- ----------------------------------------------------------------------------
-- CLIENTE: Clientes de la empresa (para facturas de ingreso)
-- Descripción: Extiende PERSONA con datos específicos de clientes.
-- ----------------------------------------------------------------------------
CREATE TABLE CLIENTE (
    CodCia          NUMBER(6)       NOT NULL,
    CodCliente      NUMBER(6)       NOT NULL,
    NroRuc          VARCHAR2(20)    NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT CLIENTE_PK PRIMARY KEY (CodCia, CodCliente),
    -- Llave Foránea
    CONSTRAINT CLIENTE_PERSONA_FK FOREIGN KEY (CodCia, CodCliente)
        REFERENCES PERSONA (CodCIA, CodPersona)
);

-- ----------------------------------------------------------------------------
-- EMPLEADO: Datos extendidos de empleados (extiende PERSONA)
-- Descripción: Almacena información detallada del personal de la empresa.
-- ----------------------------------------------------------------------------
CREATE TABLE EMPLEADO (
    CodCIA          NUMBER(6)       NOT NULL,
    CodEmpleado     NUMBER(6)       NOT NULL,
    Direcc          VARCHAR2(100)   NOT NULL,
    Celular         VARCHAR2(33)    NOT NULL,
    Hobby           VARCHAR2(2000)  NOT NULL,
    Foto            BLOB,
    FecNac          DATE            NOT NULL,
    DNI             VARCHAR2(20)    NOT NULL,
    NroCIP          VARCHAR2(10)    NOT NULL,
    FecCIPVig       DATE            NOT NULL,
    LicCond         VARCHAR2(1)     NOT NULL,
    FlgEmplIEA      VARCHAR2(1)     NOT NULL,
    Observac        VARCHAR2(300)   NOT NULL,
    CodCargo        NUMBER(4)       NOT NULL,
    Email           VARCHAR2(100)   NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT EMPLEADO_PK PRIMARY KEY (CodCIA, CodEmpleado),
    -- Llave Foránea
    CONSTRAINT EMPLEADO_PERSONA_FK FOREIGN KEY (CodCIA, CodEmpleado)
        REFERENCES PERSONA (CodCIA, CodPersona)
);

-- ----------------------------------------------------------------------------
-- PROYECTO: Proyectos con toda su información técnica y financiera
-- Descripción: Almacena los proyectos de construcción/ingeniería con sus
--              costos, fechas, ubicación y estado actual.
-- ----------------------------------------------------------------------------
CREATE TABLE PROYECTO (
    CodCIA          NUMBER(6)       NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    NombPyto        VARCHAR2(1000)  NOT NULL,
    EmplJefeProy    NUMBER(6)       NOT NULL,
    CodCia1         NUMBER(6)       NOT NULL,
    CiaContrata     NUMBER(6)       NOT NULL,
    CodCC           NUMBER(6)       NOT NULL,
    CodCliente      NUMBER(6)       NOT NULL,
    FlgEmpConsorcio VARCHAR2(1)     NOT NULL,
    CodSNIP         VARCHAR2(10)    NOT NULL,
    FecReg          DATE            NOT NULL,
    CodFase         NUMBER(1)       NOT NULL,
    CodNivel        NUMBER(2)       NOT NULL,
    CodFuncion      VARCHAR2(4)     NOT NULL,
    CodSituacion    NUMBER(2)       NOT NULL,
    NumInfor        NUMBER(1)       NOT NULL,
    NumInforEntrg   NUMBER(1)       NOT NULL,
    EstPyto         NUMBER(2)       NOT NULL,
    FecEstado       DATE            NOT NULL,
    ValRefer        NUMBER(12,2)    NOT NULL,
    CostoDirecto    NUMBER(12,2)    NOT NULL,
    CostoGGen       NUMBER(12,2)    NOT NULL,
    CostoFinan      NUMBER(12,2)    NOT NULL,
    ImpUtilidad     NUMBER(12,2)    NOT NULL,
    CostoTotSinIGV  NUMBER(12,2)    NOT NULL,
    ImpIGV          NUMBER(12,2)    NOT NULL,
    CostoTotal      NUMBER(12,2)    NOT NULL,
    CostoPenalid    NUMBER(12,2)    NOT NULL,
    CodDpto         VARCHAR2(2)     NOT NULL,
    CodProv         VARCHAR2(2)     NOT NULL,
    CodDist         VARCHAR2(2)     NOT NULL,
    FecViab         DATE            NOT NULL,
    RutaDoc         VARCHAR2(300)   NOT NULL,
    AnnoIni         NUMBER(4)       NOT NULL,
    AnnoFin         NUMBER(4)       NOT NULL,
    CodObjC         NUMBER(2)       NOT NULL,
    LogoProy        BLOB,
    TabEstado       VARCHAR2(3)     NOT NULL,
    CodEstado       VARCHAR2(3)     NOT NULL,
    Observac        VARCHAR2(500)   NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PROYECTO_PK PRIMARY KEY (CodCIA, CodPyto),
    -- Llaves Foráneas
    CONSTRAINT PROYECTO_CIA_FK FOREIGN KEY (CodCIA)
        REFERENCES CIA (CodCIA),
    CONSTRAINT PROYECTO_CLIENTE_FK FOREIGN KEY (CodCIA, CodCliente)
        REFERENCES CLIENTE (CodCIA, CodCliente),
    CONSTRAINT EMPLEADO_PROYECTO_FK FOREIGN KEY (CodCIA, EmplJefeProy)
        REFERENCES EMPLEADO (CodCIA, CodEmpleado)
);

-- ============================================================================
-- 2.3 TABLAS DE PARTIDAS (Para el manejo de presupuestos)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PARTIDA: Tabla maestra de partidas presupuestales o contables
-- Descripción: Cada partida representa un concepto de ingreso (I) o egreso (E),
--              como materiales, mano de obra, servicios, etc.
--              Estructura jerárquica: Nivel 1 (padre) -> Nivel 2 -> Nivel 3 (detalle)
-- ----------------------------------------------------------------------------
CREATE TABLE PARTIDA (
    CodCia          NUMBER(6)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    CodPartidas     VARCHAR2(12)    NOT NULL,
    DesPartida      VARCHAR2(30)    NOT NULL,
    FlgCC           VARCHAR2(1)     NOT NULL,
    Nivel           NUMBER(2)       NOT NULL,
    TUniMed         VARCHAR2(3)     NOT NULL,
    EUniMed         VARCHAR2(3)     NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PARTIDA_PK PRIMARY KEY (CodCia, IngEgr, CodPartida),
    -- Llave Foránea
    CONSTRAINT PARTIDA_CIA_FK FOREIGN KEY (CodCia)
        REFERENCES CIA (CodCia)
);

-- ----------------------------------------------------------------------------
-- PARTIDA_MEZCLA: Estructura o composición de una partida
-- Descripción: Define qué subpartidas o elementos conforman una partida.
--              Por ejemplo, "Construcción" = "Cemento" + "Arena" + "Mano de obra".
-- ----------------------------------------------------------------------------
CREATE TABLE PARTIDA_MEZCLA (
    CodCia          NUMBER(6)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    Corr            NUMBER(6)       NOT NULL,
    PadCodPartida   NUMBER(6)       NOT NULL,
    TUniMed         VARCHAR2(3)     NOT NULL,
    EUniMed         VARCHAR2(3)     NOT NULL,
    CostoUnit       NUMBER(9,2)     NOT NULL,
    Nivel           NUMBER(5)       NOT NULL,
    Orden           NUMBER(5)       NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PARTIDA_MEZCLA_PK PRIMARY KEY (CodCia, IngEgr, CodPartida, Corr),
    -- Llaves Foráneas
    CONSTRAINT PARTIDA_MEZCLA_PARTIDA_FK FOREIGN KEY (CodCia, IngEgr, CodPartida)
        REFERENCES PARTIDA (CodCia, IngEgr, CodPartida),
    CONSTRAINT PARTIDA_MEZCLA_ELEMENTOS_FK FOREIGN KEY (TUniMed, EUniMed)
        REFERENCES ELEMENTOS (CodTab, CodElem)
);

-- ----------------------------------------------------------------------------
-- PROY_PARTIDA: Asignación de partidas a proyectos
-- Descripción: Define qué partidas se usarán para el presupuesto de un proyecto,
--              su estado y versión.
-- ----------------------------------------------------------------------------
CREATE TABLE PROY_PARTIDA (
    CodCia          NUMBER(6)       NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    NroVersion      NUMBER(1)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    CodPartidas     VARCHAR2(12)    NOT NULL,
    FlgCC           VARCHAR2(1)     NOT NULL,
    Nivel           NUMBER(2)       NOT NULL,
    UniMed          VARCHAR2(5)     NOT NULL,
    TabEstado       VARCHAR2(3)     NOT NULL,
    CodEstado       VARCHAR2(3)     NOT NULL,
    Vigente         VARCHAR2(1)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT PROY_PARTIDA_PK PRIMARY KEY (CodCia, CodPyto, NroVersion, IngEgr, CodPartida),
    -- Llaves Foráneas
    CONSTRAINT PROY_PARTIDA_PROYECTO_FK FOREIGN KEY (CodCia, CodPyto)
        REFERENCES PROYECTO (CodCia, CodPyto),
    CONSTRAINT PROY_PARTIDA_PARTIDA_FK FOREIGN KEY (CodCia, IngEgr, CodPartida)
        REFERENCES PARTIDA (CodCia, IngEgr, CodPartida)
);

-- ----------------------------------------------------------------------------
-- PROY_PARTIDA_MEZCLA: Mezcla de partidas dentro de un proyecto
-- Descripción: Aplicación práctica de la mezcla (PARTIDA_MEZCLA) a un proyecto
--              con cantidades y costos específicos.
-- ----------------------------------------------------------------------------
CREATE TABLE PROY_PARTIDA_MEZCLA (
    CodCia          NUMBER(6)       NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    NroVersion      NUMBER(1)       NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    Corr            NUMBER(6)       NOT NULL,
    PadCodPartida   NUMBER(6)       NOT NULL,
    TUniMed         VARCHAR2(3)     NOT NULL,
    EUniMed         VARCHAR2(3)     NOT NULL,
    Nivel           NUMBER(5)       NOT NULL,
    Orden           NUMBER(5)       NOT NULL,
    CostoUnit       NUMBER(9,2)     NOT NULL,
    Cant            NUMBER(7,3)     NOT NULL,
    CostoTot        NUMBER(10,2)    NOT NULL,
    -- Llave Primaria
    CONSTRAINT PROY_PARTIDA_MEZCLA_PK PRIMARY KEY (CodCia, CodPyto, NroVersion, IngEgr, CodPartida, Corr),
    -- Llaves Foráneas
    CONSTRAINT PROY_PARTIDA_MEZCLA_PROY_PARTIDA_FK FOREIGN KEY (CodCia, CodPyto, NroVersion, IngEgr, CodPartida)
        REFERENCES PROY_PARTIDA (CodCia, CodPyto, NroVersion, IngEgr, CodPartida),
    CONSTRAINT PROY_PARTIDA_MEZCLA_ELEMENTOS_FK FOREIGN KEY (TUniMed, EUniMed)
        REFERENCES ELEMENTOS (CodTab, CodElem)
);

-- ============================================================================
-- 2.4 TABLAS DE COMPROBANTES DE PAGO
-- ============================================================================

-- ----------------------------------------------------------------------------
-- COMP_PAGOCAB: Cabecera de comprobantes de pago a proveedores (Egresos)
-- Descripción: Registra la información principal de los comprobantes de pago
--              emitidos por la empresa hacia los proveedores.
-- ----------------------------------------------------------------------------
CREATE TABLE COMP_PAGOCAB (
    CodCIA          NUMBER(6)       NOT NULL,
    CodProveedor    NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    NroPago         NUMBER(3)       NOT NULL,
    TCompPago       VARCHAR2(3)     NOT NULL,
    ECompPago       VARCHAR2(3)     NOT NULL,
    FecCP           DATE            NOT NULL,
    TMoneda         VARCHAR2(3)     NOT NULL,
    EMoneda         VARCHAR2(3)     NOT NULL,
    TipCambio       NUMBER(7,4)     NOT NULL,
    ImpMO           NUMBER(9,2)     NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMn      NUMBER(10,2)    NOT NULL,
    FotoCP          BLOB,
    FotoAbono       BLOB,
    FecAbono        DATE            NOT NULL,
    DesAbono        VARCHAR2(1000)  NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    TabEstado       VARCHAR2(3)     NOT NULL,
    CodEstado       VARCHAR2(3)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT COMP_PAGOCAB_PK PRIMARY KEY (CodCIA, CodProveedor, NroCP),
    -- Llaves Foráneas
    CONSTRAINT COMP_PAGOCAB_PROVEEDOR_FK FOREIGN KEY (CodCIA, CodProveedor)
        REFERENCES PROVEEDOR (CodCIA, CodProveedor),
    CONSTRAINT COMP_PAGOCAB_PROYECTO_FK FOREIGN KEY (CodCIA, CodPyto)
        REFERENCES PROYECTO (CodCIA, CodPyto),
    CONSTRAINT COMP_PAGOCAB_MONEDA_FK FOREIGN KEY (TMoneda, EMoneda)
        REFERENCES ELEMENTOS (CodTab, CodElem),
    CONSTRAINT COMP_PAGOCAB_TIPCOMP_FK FOREIGN KEY (TCompPago, ECompPago)
        REFERENCES ELEMENTOS (CodTab, CodElem)
);

-- ----------------------------------------------------------------------------
-- COMP_PAGODET: Detalle de comprobantes de pago a proveedores
-- Descripción: Registra el detalle de las partidas asociadas a cada comprobante.
-- ----------------------------------------------------------------------------
CREATE TABLE COMP_PAGODET (
    CodCIA          NUMBER(6)       NOT NULL,
    CodProveedor    NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    Sec             NUMBER(4)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMn      NUMBER(9,2)     NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    -- Llave Primaria
    CONSTRAINT COMP_PAGODET_PK PRIMARY KEY (CodCIA, CodProveedor, NroCP, Sec),
    -- Llaves Foráneas
    CONSTRAINT COMP_PAGODET_CAB_FK FOREIGN KEY (CodCIA, CodProveedor, NroCP)
        REFERENCES COMP_PAGOCAB (CodCIA, CodProveedor, NroCP),
    CONSTRAINT COMP_PAGODET_PARTIDA_FK FOREIGN KEY (CodCIA, IngEgr, CodPartida)
        REFERENCES PARTIDA (CodCIA, IngEgr, CodPartida)
);

-- ----------------------------------------------------------------------------
-- COMP_PAGOEMPLEADO: Comprobantes de pago a empleados (recibos por honorarios)
-- Descripción: Registra los pagos realizados a empleados por servicios prestados.
-- ----------------------------------------------------------------------------
CREATE TABLE COMP_PAGOEMPLEADO (
    CodCIA          NUMBER(6)       NOT NULL,
    CodEmpleado     NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    NroPago         NUMBER(3)       NOT NULL,
    TCompPago       VARCHAR2(3)     NOT NULL,
    ECompPago       VARCHAR2(3)     NOT NULL,
    FecCP           DATE            NOT NULL,
    TMoneda         VARCHAR2(3)     NOT NULL,
    EMoneda         VARCHAR2(3)     NOT NULL,
    TipCambio       NUMBER(7,4)     NOT NULL,
    ImpMO           NUMBER(9,2)     NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMn      NUMBER(10,2)    NOT NULL,
    FotoCP          BLOB,
    FotoAbono       BLOB,
    FecAbono        DATE            NOT NULL,
    DesAbono        VARCHAR2(1000)  NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    TabEstado       VARCHAR2(3)     NOT NULL,
    CodEstado       VARCHAR2(3)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT COMP_PAGOEMPLEADO_PK PRIMARY KEY (CodCIA, CodEmpleado, NroCP),
    -- Llaves Foráneas
    CONSTRAINT COMP_PAGOEMPLEADO_EMPLEADO_FK FOREIGN KEY (CodCIA, CodEmpleado)
        REFERENCES EMPLEADO (CodCIA, CodEmpleado),
    CONSTRAINT COMP_PAGOEMPLEADO_PROYECTO_FK FOREIGN KEY (CodCIA, CodPyto)
        REFERENCES PROYECTO (CodCIA, CodPyto),
    CONSTRAINT COMP_PAGOEMPLEADO_MONEDA_FK FOREIGN KEY (TMoneda, EMoneda)
        REFERENCES ELEMENTOS (CodTab, CodElem),
    CONSTRAINT COMP_PAGOEMPLEADO_TIPCOMP_FK FOREIGN KEY (TCompPago, ECompPago)
        REFERENCES ELEMENTOS (CodTab, CodElem)
);

-- ----------------------------------------------------------------------------
-- COMP_PAGOEMPLEADO_DET: Detalle de comprobantes de pago a empleados
-- Descripción: Registra el detalle de las partidas asociadas a cada pago.
-- ----------------------------------------------------------------------------
CREATE TABLE COMP_PAGOEMPLEADO_DET (
    CodCIA          NUMBER(6)       NOT NULL,
    CodEmpleado     NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    Sec             NUMBER(4)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMN      NUMBER(9,2)     NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    -- Llave Primaria
    CONSTRAINT COMP_PAGOEMPLEADO_DET_PK PRIMARY KEY (CodCIA, CodEmpleado, NroCP, Sec),
    -- Llaves Foráneas
    CONSTRAINT COMP_PAGOEMPLEADO_DET_CAB_FK FOREIGN KEY (CodCIA, CodEmpleado, NroCP)
        REFERENCES COMP_PAGOEMPLEADO (CodCIA, CodEmpleado, NroCP),
    CONSTRAINT COMP_PAGOEMPLEADO_DET_PARTIDA_FK FOREIGN KEY (CodCIA, IngEgr, CodPartida)
        REFERENCES PARTIDA (CodCIA, IngEgr, CodPartida)
);

-- ----------------------------------------------------------------------------
-- VTACOMP_PAGOCAB: Cabecera de comprobantes de venta a clientes (Ingresos)
-- Descripción: Registra las ventas realizadas a clientes.
-- ----------------------------------------------------------------------------
CREATE TABLE VTACOMP_PAGOCAB (
    CodCIA          NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    CodPyto         NUMBER(6)       NOT NULL,
    CodCliente      NUMBER(6)       NOT NULL,
    NroPago         NUMBER(3)       NOT NULL,
    TCompPago       VARCHAR2(3)     NOT NULL,
    ECompPago       VARCHAR2(3)     NOT NULL,
    FecCP           DATE            NOT NULL,
    TMoneda         VARCHAR2(3)     NOT NULL,
    EMoneda         VARCHAR2(3)     NOT NULL,
    TipCambio       NUMBER(7,4)     NOT NULL,
    ImpMO           NUMBER(9,2)     NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMN      NUMBER(10,2)    NOT NULL,
    FotoCP          BLOB,
    FotoAbono       BLOB,
    FecAbono        DATE,
    DesAbono        VARCHAR2(1000),
    Semilla         NUMBER(5)       NOT NULL,
    TabEstado       VARCHAR2(3)     NOT NULL,
    CodEstado       VARCHAR2(3)     NOT NULL,
    -- Llave Primaria
    CONSTRAINT VTACOMP_PAGOCAB_PK PRIMARY KEY (CodCIA, NroCP),
    -- Llaves Foráneas
    CONSTRAINT VTACOMP_PAGOCAB_CLIENTE_FK FOREIGN KEY (CodCIA, CodCliente)
        REFERENCES CLIENTE (CodCIA, CodCliente),
    CONSTRAINT VTACOMP_PAGOCAB_PROYECTO_FK FOREIGN KEY (CodCIA, CodPyto)
        REFERENCES PROYECTO (CodCIA, CodPyto),
    CONSTRAINT VTACOMP_PAGOCAB_MONEDA_FK FOREIGN KEY (TMoneda, EMoneda)
        REFERENCES ELEMENTOS (CodTab, CodElem),
    CONSTRAINT VTACOMP_PAGOCAB_TIPCOMP_FK FOREIGN KEY (TCompPago, ECompPago)
        REFERENCES ELEMENTOS (CodTab, CodElem)
);

-- ----------------------------------------------------------------------------
-- VTACOMP_PAGODET: Detalle de comprobantes de venta a clientes
-- Descripción: Registra el detalle de las partidas asociadas a cada venta.
-- ----------------------------------------------------------------------------
CREATE TABLE VTACOMP_PAGODET (
    CodCIA          NUMBER(6)       NOT NULL,
    NroCP           VARCHAR2(20)    NOT NULL,
    Sec             NUMBER(4)       NOT NULL,
    IngEgr          VARCHAR2(1)     NOT NULL,
    CodPartida      NUMBER(6)       NOT NULL,
    ImpNetoMN       NUMBER(9,2)     NOT NULL,
    ImpIGVMN        NUMBER(9,2)     NOT NULL,
    ImpTotalMn      NUMBER(9,2)     NOT NULL,
    Semilla         NUMBER(5)       NOT NULL,
    -- Llave Primaria
    CONSTRAINT VTACOMP_PAGODET_PK PRIMARY KEY (CodCIA, NroCP, Sec),
    -- Llaves Foráneas
    CONSTRAINT VTACOMP_PAGODET_CAB_FK FOREIGN KEY (CodCIA, NroCP)
        REFERENCES VTACOMP_PAGOCAB (CodCIA, NroCP),
    CONSTRAINT VTACOMP_PAGODET_PARTIDA_FK FOREIGN KEY (CodCIA, IngEgr, CodPartida)
        REFERENCES PARTIDA (CodCIA, IngEgr, CodPartida)
);

-- ============================================================================
-- SECCIÓN 3: SECUENCIAS
-- ============================================================================
-- Las secuencias generan valores únicos automáticos para claves primarias (PKs)
-- Nomenclatura: SEC_<TABLA> o SEC_<TABLA>_<SUFIJO>
-- Sufijos: _E=Egreso, _I=Ingreso
-- ============================================================================

-- Primero eliminamos las secuencias existentes (si existen)
DROP SEQUENCE SEC_CIA;
DROP SEQUENCE SEC_PERSONA;
DROP SEQUENCE SEC_PROYECTO;
DROP SEQUENCE SEC_TABS;
DROP SEQUENCE SEC_EMPLEADO;
DROP SEQUENCE SEC_PARTIDA_E;
DROP SEQUENCE SEC_PARTIDA_I;
DROP SEQUENCE SEC_CODPARTIDAS;
DROP SEQUENCE SEC_PARTIDA_MEZCLA_E;
DROP SEQUENCE SEC_PARTIDA_MEZCLA_I;
DROP SEQUENCE SEC_PROY_PARTIDA_MEZCLA_E;
DROP SEQUENCE SEC_PROY_PARTIDA_MEZCLA_I;
DROP SEQUENCE SEC_NRO_PAGO_VTA;

-- ----------------------------------------------------------------------------
-- SECUENCIAS PRINCIPALES (Tablas base)
-- ----------------------------------------------------------------------------
-- Secuencia para CIA: Códigos de compañías
CREATE SEQUENCE SEC_CIA
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PERSONA: Códigos de personas (clientes, proveedores, empleados)
CREATE SEQUENCE SEC_PERSONA
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PROYECTO: Códigos de proyectos
CREATE SEQUENCE SEC_PROYECTO
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para TABS: Códigos de tablas maestras
CREATE SEQUENCE SEC_TABS
    START WITH 5 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para EMPLEADO: Códigos de empleados
CREATE SEQUENCE SEC_EMPLEADO
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- ----------------------------------------------------------------------------
-- SECUENCIAS DE PARTIDAS
-- ----------------------------------------------------------------------------
-- Secuencia para PARTIDA de Egresos
CREATE SEQUENCE SEC_PARTIDA_E
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PARTIDA de Ingresos
CREATE SEQUENCE SEC_PARTIDA_I
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para códigos jerárquicos de partidas
CREATE SEQUENCE SEC_CODPARTIDAS
    START WITH 10000000 INCREMENT BY 1 MAXVALUE 99999999 MINVALUE 10000000;

-- ----------------------------------------------------------------------------
-- SECUENCIAS DE MEZCLA DE PARTIDAS
-- ----------------------------------------------------------------------------
-- Secuencia para PARTIDA_MEZCLA de Egresos
CREATE SEQUENCE SEC_PARTIDA_MEZCLA_E
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PARTIDA_MEZCLA de Ingresos
CREATE SEQUENCE SEC_PARTIDA_MEZCLA_I
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PROY_PARTIDA_MEZCLA de Egresos
CREATE SEQUENCE SEC_PROY_PARTIDA_MEZCLA_E
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- Secuencia para PROY_PARTIDA_MEZCLA de Ingresos
CREATE SEQUENCE SEC_PROY_PARTIDA_MEZCLA_I
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- ----------------------------------------------------------------------------
-- SECUENCIAS DE VENTAS
-- ----------------------------------------------------------------------------
-- Secuencia para número de comprobantes de venta
CREATE SEQUENCE SEC_NRO_PAGO_VTA
    START WITH 1 INCREMENT BY 1 MAXVALUE 99999 MINVALUE 1;

-- ============================================================================
-- SECCIÓN 4: DATOS INICIALES (INSERT)
-- ============================================================================
-- Datos maestros para inicializar el sistema
-- ORDEN CORRECTO: Tablas padre antes que tablas hijo (respetar FKs)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 DATOS DE CIA (Empresas base) - SIN DEPENDENCIAS
-- ----------------------------------------------------------------------------
INSERT INTO CIA VALUES ( 1, 'CONSTRUCTORA ANDINA S.A.', 'CONSANDINA', '1' );
INSERT INTO CIA VALUES ( 2, 'INGENIERIA CIVIL MODERNA', 'INGCIVMOD', '1' );
INSERT INTO CIA VALUES ( 3, 'PROYECTOS INTEGRALES SAC', 'PROYINTEG', '1' );
INSERT INTO CIA VALUES ( 4, 'EDIFICACIONES URBANAS', 'EDIFURB', '1' );
INSERT INTO CIA VALUES ( 5, 'CONSTRUCCIONES RAPIDAS', 'CONSRAP', '1' );

-- ----------------------------------------------------------------------------
-- 4.2 DATOS DE TABS (Catálogos maestros) - DEPENDE DE: Ninguna
-- (Exactamente igual al profesor + tablas adicionales del sistema)
-- ----------------------------------------------------------------------------
INSERT INTO TABS VALUES ('001', 'Estado Civil', 'Est_Civ', '1');
INSERT INTO TABS VALUES ('002', 'Tipo Documento', 'Tip_Doc', '1');
INSERT INTO TABS VALUES ('003', 'Monedas', 'Monedas', '1');
INSERT INTO TABS VALUES ('004', 'Tipo Comprobante', 'Tip_Comp', '1');
INSERT INTO TABS VALUES ('005', 'Grado Academico', 'Gra_Acad', '1');
INSERT INTO TABS VALUES ('006', 'Tarea Personal', 'Est_Tar', '1');
INSERT INTO TABS VALUES ('007', 'Contrato Proveedor', 'Tip_Cont', '1');
INSERT INTO TABS VALUES ('008', 'Actividad Proveedor', 'Est_Act', '1');
INSERT INTO TABS VALUES ('009', 'Documento Proveedor', 'Doc_Prov', '1');
INSERT INTO TABS VALUES ('010', 'Tipo Archivo', 'Tip_Arch', '1');
INSERT INTO TABS VALUES ('011', 'Estado Proyecto', 'Est_Pyt', '1');

-- Tablas adicionales del sistema de comprobantes
INSERT INTO TABS VALUES ('012', 'Unidad Medida', 'Uni_Med', '1');
INSERT INTO TABS VALUES ('013', 'Desembolsos', 'Desemb', '1');
INSERT INTO TABS VALUES ('014', 'Estados Comprobante', 'Est_Comp', '1');

-- ----------------------------------------------------------------------------
-- 4.3 DATOS DE ELEMENTOS (Valores de catálogos) - DEPENDE DE: TABS
-- (Exactamente igual al profesor con códigos numéricos)
-- ----------------------------------------------------------------------------
-- Estado Civil (001)
INSERT INTO ELEMENTOS VALUES ('001', '001', 'Soltero', 'SOL', '1');
INSERT INTO ELEMENTOS VALUES ('001', '002', 'Casado', 'CAS', '1');
INSERT INTO ELEMENTOS VALUES ('001', '003', 'Divorciado', 'DIV', '1');
INSERT INTO ELEMENTOS VALUES ('001', '004', 'Viudo', 'VIU', '1');

-- Tipo Documento (002)
INSERT INTO ELEMENTOS VALUES ('002', '001', 'DNI', 'DNI', '1');
INSERT INTO ELEMENTOS VALUES ('002', '002', 'Pasaporte', 'PAS', '1');
INSERT INTO ELEMENTOS VALUES ('002', '003', 'RUC', 'RUC', '1');

-- Monedas (003) - IMPORTANTE: Usado en COMP_PAGOCAB, VTACOMP_PAGOCAB
INSERT INTO ELEMENTOS VALUES ('003', '001', 'Soles', 'PEN', '1');
INSERT INTO ELEMENTOS VALUES ('003', '002', 'Dólares', 'USD', '1');
INSERT INTO ELEMENTOS VALUES ('003', '003', 'Euros', 'EUR', '1');

-- Tipo Comprobante (004) - IMPORTANTE: Usado en COMP_PAGOCAB, VTACOMP_PAGOCAB
INSERT INTO ELEMENTOS VALUES ('004', '001', 'Factura', 'FAC', '1');
INSERT INTO ELEMENTOS VALUES ('004', '002', 'Recibo por Honorarios', 'RxH', '1');
INSERT INTO ELEMENTOS VALUES ('004', '003', 'Boleta', 'BOL', '1');

-- Grado Academico (005)
INSERT INTO ELEMENTOS VALUES ('005', '001', 'Bachiller', 'BACH', '1');
INSERT INTO ELEMENTOS VALUES ('005', '002', 'Licenciatura', 'LIC', '1');
INSERT INTO ELEMENTOS VALUES ('005', '003', 'Maestría', 'MAES', '1');
INSERT INTO ELEMENTOS VALUES ('005', '004', 'Doctorado', 'DOCT', '1');
INSERT INTO ELEMENTOS VALUES ('005', '005', 'Técnico', 'TEC', '1');

-- Tarea Personal (006)
INSERT INTO ELEMENTOS VALUES ('006', '001', 'Pendiente', 'PEND', '1');
INSERT INTO ELEMENTOS VALUES ('006', '002', 'En Progreso', 'ENPRO', '1');
INSERT INTO ELEMENTOS VALUES ('006', '003', 'Completada', 'COMP', '1');
INSERT INTO ELEMENTOS VALUES ('006', '004', 'Cancelada', 'CAN', '1');

-- Contrato Proveedor (007)
INSERT INTO ELEMENTOS VALUES ('007', '001', 'Servicios', 'SERV', '1');
INSERT INTO ELEMENTOS VALUES ('007', '002', 'Suministros', 'SUMI', '1');
INSERT INTO ELEMENTOS VALUES ('007', '003', 'Obras', 'OBRA', '1');
INSERT INTO ELEMENTOS VALUES ('007', '004', 'Consultoría', 'CONS', '1');

-- Actividad Proveedor (008)
INSERT INTO ELEMENTOS VALUES ('008', '001', 'Pendiente', 'PEND', '1');
INSERT INTO ELEMENTOS VALUES ('008', '002', 'En Progreso', 'PROG', '1');
INSERT INTO ELEMENTOS VALUES ('008', '003', 'Completada', 'COMP', '1');
INSERT INTO ELEMENTOS VALUES ('008', '004', 'Cancelada', 'CANC', '1');

-- Documento Proveedor (009)
INSERT INTO ELEMENTOS VALUES ('009', '001', 'RUC', 'RUC', '1');
INSERT INTO ELEMENTOS VALUES ('009', '002', 'Licencia', 'LICE', '1');
INSERT INTO ELEMENTOS VALUES ('009', '003', 'Certificación', 'CERT', '1');
INSERT INTO ELEMENTOS VALUES ('009', '004', 'Seguro', 'SEGU', '1');
INSERT INTO ELEMENTOS VALUES ('009', '005', 'Otro', 'OTRO', '1');

-- Tipo Archivo (010)
INSERT INTO ELEMENTOS VALUES ('010', '001', 'PDF', 'PDF', '1');
INSERT INTO ELEMENTOS VALUES ('010', '002', 'JPG', 'JPG', '1');
INSERT INTO ELEMENTOS VALUES ('010', '003', 'PNG', 'PNG', '1');
INSERT INTO ELEMENTOS VALUES ('010', '004', 'JPEG', 'JPEG', '1');

-- Estado Proyecto (011)
INSERT INTO ELEMENTOS VALUES ('011', '001', 'Planificado', 'PLAN', '1');
INSERT INTO ELEMENTOS VALUES ('011', '002', 'En Ejecución', 'EJEC', '1');
INSERT INTO ELEMENTOS VALUES ('011', '003', 'Finalizado', 'FINA', '1');
INSERT INTO ELEMENTOS VALUES ('011', '004', 'Cancelado', 'CANC', '1');

-- Unidad de Medida (012) - IMPORTANTE: Usado en PARTIDA, PROY_PARTIDA_MEZCLA
INSERT INTO ELEMENTOS VALUES ('012', '001', 'Unidades', 'UND', '1');
INSERT INTO ELEMENTOS VALUES ('012', '002', 'Metros', 'MTS', '1');
INSERT INTO ELEMENTOS VALUES ('012', '003', 'Kilogramos', 'KGS', '1');
INSERT INTO ELEMENTOS VALUES ('012', '004', 'Litros', 'LTS', '1');

-- Desembolsos (013) - Usado en DPROY_PARTIDA_MEZCLA
INSERT INTO ELEMENTOS VALUES ('013', '001', 'Normal', 'NOR', '1');
INSERT INTO ELEMENTOS VALUES ('013', '002', 'Especial', 'ESP', '1');
INSERT INTO ELEMENTOS VALUES ('013', '003', 'Urgente', 'URG', '1');

-- Estados Comprobante (014) - IMPORTANTE: Usado en COMP_PAGOCAB, VTACOMP_PAGOCAB
INSERT INTO ELEMENTOS VALUES ('014', '001', 'Registrado', 'REG', '1');
INSERT INTO ELEMENTOS VALUES ('014', '002', 'Pagado', 'PAG', '1');
INSERT INTO ELEMENTOS VALUES ('014', '003', 'Anulado', 'ANU', '1');
INSERT INTO ELEMENTOS VALUES ('014', '004', 'Pendiente', 'PEN', '1');

-- ----------------------------------------------------------------------------
-- 4.4 DATOS DE PERSONA (Base de personas) - DEPENDE DE: CIA
-- ----------------------------------------------------------------------------
-- Empleados (E)
INSERT INTO PERSONA VALUES ( 1, 1001, 'E', 'JUAN CARLOS PEREZ GARCIA', 'JCPEREZ', 'JUAN PEREZ', 'JP', '1' );
INSERT INTO PERSONA VALUES ( 1, 1002, 'E', 'MARIA ELENA RODRIGUEZ', 'MERODRIG', 'MARIA RODRIGUEZ', 'MR', '1' );
-- Clientes (C)
INSERT INTO PERSONA VALUES ( 1, 5001, 'C', 'EMPRESA ELECTRICA SUR', 'EESUR', 'ELECTRICA SUR', 'ES', '1' );
INSERT INTO PERSONA VALUES ( 1, 5002, 'C', 'MINISTERIO ENERGIA', 'MINENERG', 'MIN ENERGIA', 'ME', '1' );
INSERT INTO PERSONA VALUES ( 1, 5003, 'C', 'EMPRESA CONSTRUCCIONES NORTE', 'ECNORTE', 'CONSTRUCCION NORTE', 'CN', '1' );
INSERT INTO PERSONA VALUES ( 1, 5004, 'C', 'DISTRIBUIDORA ELECTRICA', 'DISELEC', 'DISTRIB ELECT', 'DE', '1' );
INSERT INTO PERSONA VALUES ( 1, 5005, 'C', 'INGENIERIA Y PROYECTOS SAC', 'INGPROY', 'ING PROYECTOS', 'IP', '1' );
-- Proveedores (P)
INSERT INTO PERSONA VALUES ( 1, 7001, 'P', 'CEMENTOS ANDINOS SA', 'CEMAND', 'CEMENTOS AND', 'CA', '1' );
INSERT INTO PERSONA VALUES ( 1, 7002, 'P', 'ACEROS NACIONALES SA', 'ACERNAC', 'ACEROS NAC', 'AN', '1' );
INSERT INTO PERSONA VALUES ( 1, 7003, 'P', 'EQUIPOS INDUSTRIALES', 'EQINDUS', 'EQUIPOS IND', 'EI', '1' );
INSERT INTO PERSONA VALUES ( 1, 7004, 'P', 'MATERIALES CONSTRUCCION', 'MATCONS', 'MAT CONSTRUC', 'MC', '1' );
INSERT INTO PERSONA VALUES ( 1, 7005, 'P', 'SERVICIOS TECNICOS INTEGRALES', 'SERTECIN', 'SERV TECNIC', 'ST', '1' );

-- ----------------------------------------------------------------------------
-- 4.5 DATOS DE EMPLEADO - DEPENDE DE: PERSONA (ANTES de PROYECTO!)
-- ----------------------------------------------------------------------------
INSERT INTO EMPLEADO VALUES ( 1, 1001, 'Av. Principal 2500, Lima', '992184753', 'Lectura, Proyectos de Ingeniería', NULL, DATE '1972-05-15', '41829305', 'CIP418293', DATE '2025-12-31', '1', '1', 'Gerente General', 1, 'juan.perez@consandina.pe', '1' );
INSERT INTO EMPLEADO VALUES ( 1, 1002, 'Calle Los Andes 450, San Isidro', '954821039', 'Diseño asistido por computadora, Fútbol', NULL, DATE '1982-08-22', '75031298', 'CIP750312', DATE '2025-06-30', '1', '1', 'Especialista en proyectos de infraestructura', 2, 'maria.rodriguez@consandina.pe', '1' );

-- ----------------------------------------------------------------------------
-- 4.6 DATOS DE CLIENTE - DEPENDE DE: PERSONA
-- ----------------------------------------------------------------------------
INSERT INTO CLIENTE VALUES ( 1, 5001, '20100012345', '1' );
INSERT INTO CLIENTE VALUES ( 1, 5002, '20100054321', '1' );
INSERT INTO CLIENTE VALUES ( 1, 5003, '20100067890', '1' );
INSERT INTO CLIENTE VALUES ( 1, 5004, '20100009876', '1' );
INSERT INTO CLIENTE VALUES ( 1, 5005, '20100011223', '1' );

-- ----------------------------------------------------------------------------
-- 4.7 DATOS DE PROVEEDOR - DEPENDE DE: PERSONA
-- ----------------------------------------------------------------------------
INSERT INTO PROVEEDOR VALUES ( 1, 7001, '20131312955', '1' );
INSERT INTO PROVEEDOR VALUES ( 1, 7002, '20456789012', '1' );
INSERT INTO PROVEEDOR VALUES ( 1, 7003, '20567890123', '1' );
INSERT INTO PROVEEDOR VALUES ( 1, 7004, '20678901234', '1' );
INSERT INTO PROVEEDOR VALUES ( 1, 7005, '20789012345', '1' );

-- ============================================================================
-- 4.8 DATOS DE PARTIDA (Estructura jerárquica con 3 niveles)
-- DEPENDE DE: CIA, ELEMENTOS (TabUnimed, EleUnimed)
-- ============================================================================
-- Según especificaciones del profesor:
-- - INGRESOS: Nivel 1 (padre) -> Nivel 2 (categorías) -> Nivel 3 (detalles)
-- - EGRESOS: Nivel 1 (padre) -> Nivel 2 (categorías) -> Nivel 3 (detalles)
-- - USAR SIEMPRE EL ÚLTIMO NIVEL (Nivel 3) en los comprobantes de pago
-- ============================================================================

-- ============================================================================

-- NIVEL 1: INGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1000, 'ING-000', 'INGRESOS REALES', 'N', 1, '012', '001', 1000, 1);

-- NIVEL 2: INGRESOS POR VENTA (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1100, 'ING-100', 'INGRESOS POR VENTA', 'N', 2, '012', '001', 1100, 1);

-- NIVEL 3: Detalles de INGRESOS POR VENTA (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1101, 'ING-101', 'VENTA DE ENERGIA', 'N', 3, '012', '001', 1101, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1102, 'ING-102', 'SERVICIOS TECNICOS', 'N', 3, '012', '001', 1102, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1103, 'ING-103', 'CONSULTORIA', 'N', 3, '012', '001', 1103, 1);

-- NIVEL 2: INGRESOS POR PRESTAMOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1200, 'ING-200', 'INGRESOS POR PRESTAMOS', 'N', 2, '012', '001', 1200, 1);

-- NIVEL 3: Detalles de INGRESOS POR PRESTAMOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1201, 'ING-201', 'PRESTAMOS BANCARIOS', 'N', 3, '012', '001', 1201, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1202, 'ING-202', 'PRESTAMOS PRIVADOS', 'N', 3, '012', '001', 1202, 1);

-- NIVEL 2: OTROS INGRESOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1300, 'ING-300', 'OTROS INGRESOS', 'N', 2, '012', '001', 1300, 1);

-- NIVEL 3: Detalles de OTROS INGRESOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1301, 'ING-301', 'INTERESES GANADOS', 'N', 3, '012', '001', 1301, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1302, 'ING-302', 'ALQUILERES', 'N', 3, '012', '001', 1302, 1);

-- ============================================================================
-- PARTIDAS DE EGRESO (E) - ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- NIVEL 1: EGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2000, 'EGR-000', 'EGRESOS REALES', 'N', 1, '012', '001', 2000, 1);

-- NIVEL 2: COSTOS DIRECTOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2100, 'EGR-100', 'COSTOS DIRECTOS', 'N', 2, '012', '001', 2100, 1);

-- NIVEL 3: Detalles de COSTOS DIRECTOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2101, 'EGR-101', 'MATERIALES DE CONSTRUCCION', 'N', 3, '012', '001', 2101, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2102, 'EGR-102', 'MANO DE OBRA', 'N', 3, '012', '001', 2102, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2103, 'EGR-103', 'EQUIPOS Y MAQUINARIA', 'N', 3, '012', '001', 2103, 1);
--PARA EMPLEADO
INSERT INTO PARTIDA VALUES (
    1,              -- CodCIA
    'E',            -- IngEgr
    2104,           -- CodPartida
    'EGR-104',      -- CodPartidas
    'HONORARIOS',
    'N',            -- UsableCompr (igual que tus otros nivel 3)
    3,              -- Nivel
    '012',          -- CodUnidad (TUNIMED - Tipo Unidad Medida = 012)
    '001',          -- Unidad (EUNIMED - Código Elemento = 001 = UND)
    2104,           -- Semilla (igual que CodPartida)
    1               -- Vigente
);

-- NIVEL 2: GASTOS ADMINISTRATIVOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2200, 'EGR-200', 'GASTOS ADMINISTRATIVOS', 'N', 2, '012', '001', 2200, 1);

-- NIVEL 3: Detalles de GASTOS ADMINISTRATIVOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2201, 'EGR-201', 'SUELDOS ADMINISTRATIVOS', 'N', 3, '012', '001', 2201, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2202, 'EGR-202', 'SERVICIOS PROFESIONALES', 'N', 3, '012', '001', 2202, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2203, 'EGR-203', 'ALQUILER DE OFICINA', 'N', 3, '012', '001', 2203, 1);

-- NIVEL 2: SERVICIOS TECNICOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2300, 'EGR-300', 'SERVICIOS TECNICOS', 'N', 2, '012', '001', 2300, 1);

-- NIVEL 3: Detalles de SERVICIOS TECNICOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2301, 'EGR-301', 'INGENIERIA ELECTRICA', 'N', 3, '012', '001', 2301, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2302, 'EGR-302', 'INGENIERIA CIVIL', 'N', 3, '012', '001', 2302, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2303, 'EGR-303', 'SUPERVISION DE OBRA', 'N', 3, '012', '001', 2303, 1);

-- ----------------------------------------------------------------------------
-- 4.9 DATOS DE PROYECTO - DEPENDE DE: EMPLEADO, CLIENTE
-- ----------------------------------------------------------------------------
INSERT INTO PROYECTO VALUES ( 1, 1, 'PROYECTO HIDROELÉCTRICO ANDINO', 1001, 1, 1, 1, 5001, 'N', 'SNIP001', DATE '2023-01-15', 1, 1, 'F001', 1, 1, 1, 1, DATE '2023-01-20', 1000000, 500000, 100000, 50000, 350000, 1000000, 180000, 1180000, 0, '15', '01', '01', DATE '2023-02-01', 'SIN_DOCUMENTO', 2023, 2025, 1, NULL, '001', '001', 'PROYECTO EN EJECUCION', '1' );

INSERT INTO PROYECTO VALUES ( 1, 2, 'CONSTRUCCION PLANTA ENERGETICA', 1002, 1, 1, 2, 5002, 'N', 'SNIP002', DATE '2023-03-10', 1, 1, 'F002', 1, 1, 1, 1, DATE '2023-03-15', 800000, 400000, 80000, 40000, 280000, 800000, 144000, 944000, 0, '15', '01', '02', DATE '2023-04-01', 'SIN_DOCUMENTO', 2023, 2024, 2, NULL, '001', '001', 'PROYECTO NUEVO', '1' );

INSERT INTO PROYECTO VALUES ( 1, 3, 'MEJORAMIENTO RED ELECTRICA', 1001, 1, 1, 3, 5001, 'N', 'SNIP003', DATE '2023-05-20', 1, 1, 'F003', 1, 1, 1, 1, DATE '2023-05-25', 600000, 300000, 60000, 30000, 210000, 600000, 108000, 708000, 0, '15', '01', '03', DATE '2023-06-01', 'SIN_DOCUMENTO', 2023, 2024, 3, NULL, '001', '001', 'PROYECTO REGIONAL', '1' );

INSERT INTO PROYECTO VALUES ( 1, 4, 'SISTEMA DE IRRIGACION', 1002, 1, 1, 4, 5002, 'N', 'SNIP004', DATE '2023-07-05', 1, 1, 'F004', 1, 1, 1, 1, DATE '2023-07-10', 400000, 200000, 40000, 20000, 140000, 400000, 72000, 472000, 0, '15', '01', '04', DATE '2023-08-01', 'SIN_DOCUMENTO', 2023, 2024, 4, NULL, '001', '001', 'PROYECTO AGRICOLA', '1' );

INSERT INTO PROYECTO VALUES ( 1, 5, 'CONSTRUCCION PUENTE VEHICULAR', 1001, 1, 1, 5, 5001, 'N', 'SNIP005', DATE '2023-09-15', 1, 1, 'F005', 1, 1, 1, 1, DATE '2023-09-20', 1200000, 600000, 120000, 60000, 420000, 1200000, 216000, 1416000, 0, '15', '01', '05', DATE '2023-10-01', 'SIN_DOCUMENTO', 2023, 2025, 5, NULL, '001', '001', 'PROYECTO VIAL', '1' );

-- ============================================================================
-- 4.10 DATOS DE PROY_PARTIDA - DEPENDE DE: PROYECTO, PARTIDA
-- ============================================================================
-- Solo se asignan partidas de NIVEL 3 (último nivel) a los proyectos
-- ============================================================================

-- ============================================================
-- PROYECTO: CodCia=1, CodPyto=3, NroVersion=1
-- PARTIDAS SEGÚN LA IMAGEN
-- ============================================================

-- ========================
-- INGRESOS
-- ========================

-- INSERT INTO PROY_PARTIDA VALUES
-- (1, 3, 1, 'E', 2000, 'EGR-000', 'N', 1, 'UND', '014', 'REG', 1);
-- (1, 3, 1, 'E', 2000, 'EGR-000', 'N', 1, '001', '014', 'REG', 1);

-- Nivel 1
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'I', 1000, 'ING-000', 'N', 1, 'UND', '014', 'REG', 1);

-- Nivel 2
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'I', 1100, 'ING-100', 'N', 2, 'UND', '014', 'REG', 1);

-- Nivel 3
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'I', 1101, 'ING-101', 'N', 3, 'UND', '014', 'REG', 1);



-- ========================
-- EGRESOS
-- ========================

-- Nivel 1
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2000, 'EGR-000', 'N', 1, 'UND', '014', 'REG', 1);

-- Nivel 2
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2100, 'EGR-100', 'N', 2, 'UND', '014', 'REG', 1);

-- Nivel 3
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2101, 'EGR-101', 'N', 3, 'UND', '014', 'REG', 1);

INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2102, 'EGR-102', 'N', 3, 'UND', '014', 'REG', 1);

-- Segundo Nivel 2 de EGRESOS
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2200, 'EGR-200', 'N', 2, 'UND', '014', 'REG', 1);

-- Nivel 3 bajo EGR-200
INSERT INTO PROY_PARTIDA VALUES
(1, 3, 1, 'E', 2201, 'EGR-201', 'N', 3, 'UND', '014', 'REG', 1);

-- ============================================================
-- TABLA: PARTIDA_MEZCLA
-- CAMPOS:
-- (CODCIA, INGEGR, CODPARTIDA, CORR, PADCODPARTIDA,
--  TUNIMED, EUNIMED, COSTOUNIT, NIVEL, ORDEN, VIGENTE)
-- ============================================================

-- =======================
-- INGRESOS (I)
-- =======================

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1000, 1, 1000, '012', '001', 0, 1, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1100, 1, 1000, '012', '001', 0, 2, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1101, 1, 1100, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1102, 1, 1100, '012', '001', 0, 3, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1103, 1, 1100, '012', '001', 0, 3, 3, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1200, 1, 1000, '012', '001', 0, 2, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1201, 1, 1200, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1202, 1, 1200, '012', '001', 0, 3, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1300, 1, 1000, '012', '001', 0, 2, 3, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1301, 1, 1300, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'I', 1302, 1, 1300, '012', '001', 0, 3, 2, 1);


-- =======================
-- EGRESOS (E)
-- =======================

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2000, 1, 2000, '012', '001', 0, 1, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2100, 1, 2000, '012', '001', 0, 2, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2101, 1, 2100, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2102, 1, 2100, '012', '001', 0, 3, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2103, 1, 2100, '012', '001', 0, 3, 3, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2104, 1, 2100, '012', '001', 0, 3, 4, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2200, 1, 2000, '012', '001', 0, 2, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2201, 1, 2200, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2202, 1, 2200, '012', '001', 0, 3, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2203, 1, 2200, '012', '001', 0, 3, 3, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2300, 1, 2000, '012', '001', 0, 2, 3, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2301, 1, 2300, '012', '001', 0, 3, 1, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2302, 1, 2300, '012', '001', 0, 3, 2, 1);

INSERT INTO PARTIDA_MEZCLA VALUES
(1, 'E', 2303, 1, 2300, '012', '001', 0, 3, 3, 1);

-- ============================================================
-- TABLA: PROY_PARTIDA_MEZCLA
-- Proyecto: CodCia = 1, CodPyto = 3, NroVersion = 1
-- ============================================================

-- =======================
-- INGRESOS (I)
-- =======================

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'I', 1, 1000, 1, 1000, '012', '001', 1, 1, 1200, 400, 480000);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'I', 1, 1100, 1, 1000, '012', '001', 2, 1, 1200, 400, 480000);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'I', 1, 1101, 1, 1100, '012', '001', 3, 1, 1200, 400, 480000);


-- =======================
-- EGRESOS (E)
-- =======================

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2000, 1, 2000, '012', '001', 1, 1, 1250, 850, 452500);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2100, 1, 2000, '012', '001', 2, 1, 850, 850, 372500);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2101, 1, 2100, '012', '001', 3, 1, 500, 500, 250000);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2102, 2, 2100, '012', '001', 3, 2, 350, 350, 122500);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2200, 1, 2000, '012', '001', 2, 2, 400, 200, 80000);

INSERT INTO PROY_PARTIDA_MEZCLA VALUES
(1, 3, 'E', 1, 2201, 1, 2200, '012', '001', 3, 1, 400, 200, 80000);

-- ============================================================================
-- 4.13 DATOS DE COMP_PAGOCAB (Comprobantes de pago - Egresos)
-- DEPENDE DE: PROVEEDOR, PROYECTO, ELEMENTOS
-- IMPORTANTE: FecAbono y DesAbono son NOT NULL
-- ============================================================================
INSERT INTO COMP_PAGOCAB VALUES ( 1, 7002, 'CP-002', 1, 2, '004', '001', DATE '2023-03-20', '003', '001', 3.82, 0, 40000, 7200, 47200, NULL, NULL, DATE '2023-03-25', 'Pago por materiales de construcción', 2, '014', 'REG' );

INSERT INTO COMP_PAGOCAB VALUES ( 1, 7003, 'CP-004', 1, 3, '004', '001', DATE '2023-05-05', '003', '001', 3.75, 0, 25000, 4500, 29500, NULL, NULL, DATE '2023-05-10', 'Pago por equipos industriales', 4, '014', 'REG' );

INSERT INTO COMP_PAGOCAB VALUES ( 1, 7002, 'CP-005', 3, 1, '004', '001', DATE '2023-06-12', '003', '001', 3.76, 0, 35000, 6300, 41300, NULL, NULL, DATE '2023-06-17', 'Pago por acero estructural', 5, '014', 'REG' );

INSERT INTO COMP_PAGOCAB VALUES ( 1, 7004, 'CP-006', 2, 2, '004', '001', DATE '2023-07-18', '003', '001', 3.74, 0, 28000, 5040, 33040, NULL, NULL, DATE '2023-07-23', 'Pago por materiales adicionales', 6, '014', 'REG' );

INSERT INTO COMP_PAGOCAB VALUES ( 1, 7005, 'CP-007', 3, 2, '004', '001', DATE '2023-08-22', '003', '001', 3.73, 0, 32000, 5760, 37760, NULL, NULL, DATE '2023-08-27', 'Pago por servicios técnicos', 7, '014', 'REG' );

-- ============================================================================
-- 4.14 DATOS DE COMP_PAGODET (Detalle de pagos) - DEPENDE DE: COMP_PAGOCAB, PARTIDA
-- ============================================================================
INSERT INTO COMP_PAGODET VALUES ( 1, 7002, 'CP-002', 1, 'E', 2102, 40000, 7200, 47200, 2 );
INSERT INTO COMP_PAGODET VALUES ( 1, 7003, 'CP-004', 1, 'E', 2101, 25000, 4500, 29500, 4 );
INSERT INTO COMP_PAGODET VALUES ( 1, 7002, 'CP-005', 1, 'E', 2101, 35000, 6300, 41300, 5 );
INSERT INTO COMP_PAGODET VALUES ( 1, 7004, 'CP-006', 1, 'E', 2103, 28000, 5040, 33040, 6 );
INSERT INTO COMP_PAGODET VALUES ( 1, 7005, 'CP-007', 1, 'E', 2301, 32000, 5760, 37760, 7 );

-- ============================================================================
-- 4.15 DATOS DE VTACOMP_PAGOCAB (Comprobantes de venta - Ingresos)
-- DEPENDE DE: CLIENTE, PROYECTO, ELEMENTOS
-- IMPORTANTE: FecAbono y DesAbono son NOT NULL
-- ============================================================================
INSERT INTO VTACOMP_PAGOCAB VALUES ( 1, 'VTA-001', 1, 5001, 1, '004', '001', DATE '2023-02-28', '003', '001', 3.80, 0, 80000, 14400, 94400, NULL, NULL, DATE '2023-03-05', 'Cobro por venta de energía', 1, '014', 'REG' );

INSERT INTO VTACOMP_PAGOCAB VALUES ( 1, 'VTA-002', 1, 5001, 2, '004', '001', DATE '2023-05-31', '003', '001', 3.78, 0, 75000, 13500, 88500, NULL, NULL, DATE '2023-06-05', 'Cobro por servicios técnicos', 2, '014', 'REG' );

INSERT INTO VTACOMP_PAGOCAB VALUES ( 1, 'VTA-003', 2, 5002, 1, '004', '001', DATE '2023-04-15', '003', '001', 3.82, 0, 60000, 10800, 70800, NULL, NULL, DATE '2023-04-20', 'Cobro por consultoría', 3, '014', 'REG' );

INSERT INTO VTACOMP_PAGOCAB VALUES ( 1, 'VTA-004', 1, 5001, 3, '004', '001', DATE '2023-08-31', '003', '001', 3.75, 0, 85000, 15300, 100300, NULL, NULL, DATE '2023-09-05', 'Cobro por venta de energía', 4, '014', 'REG' );

INSERT INTO VTACOMP_PAGOCAB VALUES ( 1, 'VTA-005', 3, 5001, 1, '004', '001', DATE '2023-07-20', '003', '001', 3.76, 0, 50000, 9000, 59000, NULL, NULL, DATE '2023-07-25', 'Cobro por servicios', 5, '014', 'REG' );

-- ============================================================================
-- 4.16 DATOS DE VTACOMP_PAGODET (Detalle de ventas) - DEPENDE DE: VTACOMP_PAGOCAB, PARTIDA
-- ============================================================================
INSERT INTO VTACOMP_PAGODET VALUES ( 1, 'VTA-001', 1, 'I', 1101, 80000, 14400, 94400, 1 );
INSERT INTO VTACOMP_PAGODET VALUES ( 1, 'VTA-002', 1, 'I', 1101, 75000, 13500, 88500, 2 );
INSERT INTO VTACOMP_PAGODET VALUES ( 1, 'VTA-003', 1, 'I', 1102, 60000, 10800, 70800, 3 );
INSERT INTO VTACOMP_PAGODET VALUES ( 1, 'VTA-004', 1, 'I', 1101, 85000, 15300, 100300, 4 );
INSERT INTO VTACOMP_PAGODET VALUES ( 1, 'VTA-005', 1, 'I', 1101, 50000, 9000, 59000, 5 );

-- ============================================================================
-- 4.18 DATOS DE COMP_PAGOEMPLEADO (Comprobantes de pago a empleados)
-- DEPENDE DE: EMPLEADO, PROYECTO, ELEMENTOS
-- IMPORTANTE: FecAbono y DesAbono son NOT NULL
-- ============================================================================
INSERT INTO COMP_PAGOEMPLEADO VALUES ( 1, 1001, 'CPE-001', 1, 1, '004', '002', DATE '2023-02-28', '003', '001', 1.0000, 15000.00, 15000.00, 2700.00, 17700.00, NULL, NULL, DATE '2023-03-05', 'Pago de honorarios - Supervisión de proyecto - Febrero 2023', 1, '014', 'PAG' );

INSERT INTO COMP_PAGOEMPLEADO VALUES ( 1, 1001, 'CPE-002', 1, 2, '004', '002', DATE '2023-03-28', '003', '001', 1.0000, 15000.00, 15000.00, 2700.00, 17700.00, NULL, NULL, DATE '2023-04-05', 'Pago de honorarios - Supervisión de proyecto - Marzo 2023', 2, '014', 'PAG' );

INSERT INTO COMP_PAGOEMPLEADO VALUES ( 1, 1002, 'CPE-003', 1, 1, '004', '002', DATE '2023-02-28', '003', '001', 1.0000, 12000.00, 12000.00, 2160.00, 14160.00, NULL, NULL, DATE '2023-03-05', 'Pago de honorarios - Ingeniería de diseño - Febrero 2023', 3, '014', 'PAG' );

INSERT INTO COMP_PAGOEMPLEADO VALUES ( 1, 1002, 'CPE-004', 2, 1, '004', '002', DATE '2023-04-28', '003', '001', 1.0000, 11000.00, 11000.00, 1980.00, 12980.00, NULL, NULL, DATE '2023-05-05', 'Pago de honorarios - Control de calidad - Abril 2023', 4, '014', 'REG' );

-- ============================================================================
-- 4.19 DATOS DE COMP_PAGOEMPLEADO_DET (Detalle de pagos a empleados)
-- DEPENDE DE: COMP_PAGOEMPLEADO, PARTIDA
-- ============================================================================
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES ( 1, 1001, 'CPE-001', 1, 'E', 2104, 12000, 2160, 14160, 1 );
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES ( 1, 1001, 'CPE-001', 2, 'E', 2104, 3000, 540, 3540, 1 );
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES ( 1, 1002, 'CPE-004', 1, 'E', 2104, 11000, 1980, 12980, 1 );

-- ============================================================================
-- SECCIÓN 5: CONSULTAS DE VERIFICACIÓN (SELECT)
-- ============================================================================
-- Consultas para verificar que los datos se insertaron correctamente
-- ============================================================================

-- 1. Ver tabla CIA
SELECT * FROM CIA;

-- 2. Ver tabla PERSONA
SELECT * FROM PERSONA;

-- 3. Ver tabla CLIENTE
SELECT * FROM CLIENTE;

-- 4. Ver tabla PROVEEDOR
SELECT * FROM PROVEEDOR;

-- 5. Ver tabla TABS
SELECT * FROM TABS;

-- 6. Ver tabla ELEMENTOS
SELECT * FROM ELEMENTOS;

-- 7. Ver tabla PARTIDA
SELECT * FROM PARTIDA;

-- 8. Ver tabla PROYECTO
SELECT * FROM PROYECTO;

-- 9. Ver tabla PROY_PARTIDA
SELECT * FROM PROY_PARTIDA;

-- 10. Ver tabla PROY_PARTIDA_MEZCLA
SELECT * FROM PROY_PARTIDA_MEZCLA;

-- 11. Ver tabla PARTIDA_MEZCLA
SELECT * FROM PARTIDA_MEZCLA;

-- 12. Ver tabla COMP_PAGOCAB
SELECT * FROM COMP_PAGOCAB;

-- 13. Ver tabla COMP_PAGODET
SELECT * FROM COMP_PAGODET;

-- 14. Ver tabla VTACOMP_PAGOCAB
SELECT * FROM VTACOMP_PAGOCAB;

-- 15. Ver tabla VTACOMP_PAGODET
SELECT * FROM VTACOMP_PAGODET;

-- 16. Ver tabla EMPLEADO
SELECT * FROM EMPLEADO;

-- 17. Ver tabla COMP_PAGOEMPLEADO
SELECT * FROM COMP_PAGOEMPLEADO;

-- 18. Ver tabla COMP_PAGOEMPLEADO_DET
SELECT * FROM COMP_PAGOEMPLEADO_DET;

COMMIT;

