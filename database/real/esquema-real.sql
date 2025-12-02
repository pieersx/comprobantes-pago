-- ==================================================================
-- DROPS - LIMPIAR BASE DE DATOS
-- ==================================================================

BEGIN
    -- Tablas del sistema de comprobantes (grupo06)
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE VTACOMP_PAGODET CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE VTACOMP_PAGOCAB CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE COMP_PAGODET CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE COMP_PAGOEMPLEADO_DET CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PROY_PARTIDA_MEZCLA CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PROY_PARTIDA CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PARTIDA CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;

    -- Tablas (orden inverso por dependencias)
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE EVALUACIONES_DESEMPENO CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TAREAS_PERSONAL CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PERSONAL_PROYECTOS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE EXPERIENCIA_LABORAL CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE GRADOS_ACADEMICOS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE ESPECIALIDADES_PERSONAL CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CARGOS_AREAS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE DOCUMENTOS_PROVEEDOR CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE ACTIVIDADES_PROVEEDOR CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CONTRATOS_PROVEEDOR CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE SERVICIOS_PROVEEDOR CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE COMP_PAGOCAB CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE COMP_PAGOEMPLEADO CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PROYECTO CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE EMPLEADO CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PROVEEDOR CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CLIENTE CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PERSONA CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE ELEMENTOS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TABS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE AREAS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE USUARIOS CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CIA CASCADE CONSTRAINTS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;

    -- Secuencias
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_CIA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_PERSONA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_PROYECTO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_TABS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_USUARIOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_AREAS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_ESPECIALIDADES';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_GRADOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_EXPERIENCIA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_PERSONAL_PROYECTOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_TAREAS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_EVALUACIONES';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_CARGOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_SERVICIOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_CONTRATOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_ACTIVIDADES';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_DOCUMENTOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_PARTIDA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE SEC_NRO_PAGO_VTA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;

    -- Procedimientos
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_CIA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_EMPLEADO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_CLIENTE';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_PROVEEDOR';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_PROYECTO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_USUARIO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_AREA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_CARGO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_ESPECIALIDAD';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_GRADO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_EXPERIENCIA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_PERSONAL_PROYECTO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_TAREA';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_EVALUACION';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_SERVICIO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_CONTRATO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_ACTIVIDAD';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_DOCUMENTO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_COMPROBANTE_PROVEEDOR';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_COMPROBANTE_EMPLEADO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_TABS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE INSERTAR_ELEMENTOS';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;

    -- Funciones
  BEGIN
    EXECUTE IMMEDIATE 'DROP FUNCTION DURACION_PROYECTO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP FUNCTION GET_PERSONA_TIPO';
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
END;
/

-- ==================================================================
-- CREACIÓN DE TABLAS
-- ==================================================================

CREATE TABLE cia (
  codcia   NUMBER(6) NOT NULL,
  descia   VARCHAR2(100) NOT NULL,
  descorta VARCHAR2(20) NOT NULL,
  vigente  VARCHAR2(1) NOT NULL,
  CONSTRAINT cia_pk PRIMARY KEY ( codcia )
);

CREATE TABLE tabs (
  codtab   VARCHAR2(3) NOT NULL,
  dentab   VARCHAR2(50) NOT NULL,
  dencorta VARCHAR2(10) NOT NULL,
  vigente  VARCHAR2(1) NOT NULL,
  CONSTRAINT tabs_pk PRIMARY KEY ( codtab )
);

CREATE TABLE elementos (
  codtab   VARCHAR2(3) NOT NULL,
  codelem  VARCHAR2(3) NOT NULL,
  denele   VARCHAR2(50) NOT NULL,
  dencorta VARCHAR2(10) NOT NULL,
  vigente  VARCHAR2(1) NOT NULL,
  CONSTRAINT elementos_pk PRIMARY KEY ( codtab,
                                        codelem ),
  CONSTRAINT elementos_tabs_fk FOREIGN KEY ( codtab )
    REFERENCES tabs ( codtab )
);

CREATE TABLE persona (
  codcia      NUMBER(6) NOT NULL,
  codpersona  NUMBER(6) NOT NULL,
  tippersona  VARCHAR2(1) NOT NULL,
  despersona  VARCHAR2(100) NOT NULL,
  descorta    VARCHAR2(30) NOT NULL,
  descalterna VARCHAR2(100) NOT NULL,
  descortaalt VARCHAR2(10) NOT NULL,
  vigente     VARCHAR2(1) NOT NULL,
  CONSTRAINT cia_persona_pk PRIMARY KEY ( codcia,
                                          codpersona ),
  CONSTRAINT persona_empresa_vta_fk FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia )
);

CREATE TABLE usuarios (
  codcia        NUMBER(6) NOT NULL,
  codusuario    NUMBER(6) NOT NULL,
  username      VARCHAR2(50) UNIQUE NOT NULL,
  password_hash VARCHAR2(200) NOT NULL,
  tipo_usuario  VARCHAR2(15) NOT NULL,
  CONSTRAINT usuarios_pk PRIMARY KEY ( codcia,
                                       codusuario ),
  CONSTRAINT fk_usuario_cia FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia )
);

CREATE TABLE areas (
  codcia      NUMBER(6) NOT NULL,
  codarea     NUMBER(6) NOT NULL,
  nombre      VARCHAR2(100) NOT NULL,
  descripcion VARCHAR2(300),
  estado      CHAR(1) DEFAULT 'A',
  CONSTRAINT areas_pk PRIMARY KEY ( codcia,
                                    codarea ),
  CONSTRAINT fk_area_cia FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia )
);

CREATE TABLE empleado (
  codcia      NUMBER(6) NOT NULL,
  codempleado NUMBER(6) NOT NULL,
  direcc      VARCHAR2(100) NOT NULL,
  celular     VARCHAR2(33) NOT NULL,
  hobby       VARCHAR2(2000) NOT NULL,
  foto        BLOB,
  fecnac      DATE NOT NULL,
  dni         VARCHAR2(20) NOT NULL,
  nrocip      VARCHAR2(10) NOT NULL,
  feccipvig   DATE NOT NULL,
  liccond     VARCHAR2(1) NOT NULL,
  flgempliea  VARCHAR2(1) NOT NULL,
  observac    VARCHAR2(300) NOT NULL,
  codcargo    NUMBER(4) NOT NULL,
  email       VARCHAR2(100) NOT NULL,
  vigente     VARCHAR2(1) NOT NULL,
  CONSTRAINT empleado_pk PRIMARY KEY ( codcia,
                                       codempleado ),
  CONSTRAINT persona_empleado_fk
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES persona ( codcia,
                           codpersona )
);

CREATE TABLE cliente (
  codcia     NUMBER(6) NOT NULL,
  codcliente NUMBER(6) NOT NULL,
  nroruc     VARCHAR2(20) NOT NULL,
  vigente    VARCHAR2(1) NOT NULL,
  CONSTRAINT cliente_pk PRIMARY KEY ( codcia,
                                      codcliente ),
  CONSTRAINT persona_cliente_fk
    FOREIGN KEY ( codcia,
                  codcliente )
      REFERENCES persona ( codcia,
                           codpersona )
);

CREATE TABLE proyecto (
  codcia          NUMBER(6) NOT NULL,
  codpyto         NUMBER(6) NOT NULL,
  nombpyto        VARCHAR2(1000) NOT NULL,
  empljefeproy    NUMBER(6) NOT NULL,
  codcia1         NUMBER(6) NOT NULL,
  ciacontrata     NUMBER(6) NOT NULL,
  codcc           NUMBER(6) NOT NULL,
  codcliente      NUMBER(6) NOT NULL,
  flgempconsorcio VARCHAR2(1) NOT NULL,
  codsnip         VARCHAR2(10) NOT NULL,
  fecreg          DATE NOT NULL,
  codfase         NUMBER(1) NOT NULL,
  codnivel        NUMBER(2) NOT NULL,
  codfuncion      VARCHAR2(4) NOT NULL,
  codsituacion    NUMBER(2) NOT NULL,
  numinfor        NUMBER(1) NOT NULL,
  numinforentrg   NUMBER(1) NOT NULL,
  estpyto         NUMBER(2) NOT NULL,
  fecestado       DATE NOT NULL,
  valrefer        NUMBER(12,2) NOT NULL,
  costodirecto    NUMBER(12,2) NOT NULL,
  costoggen       NUMBER(12,2) NOT NULL,
  costofinan      NUMBER(12,2) NOT NULL,
  imputilidad     NUMBER(12,2) NOT NULL,
  costototsinigv  NUMBER(12,2) NOT NULL,
  impigv          NUMBER(12,2) NOT NULL,
  costototal      NUMBER(12,2) NOT NULL,
  costopenalid    NUMBER(12,2) NOT NULL,
  coddpto         VARCHAR2(2) NOT NULL,
  codprov         VARCHAR2(2) NOT NULL,
  coddist         VARCHAR2(2) NOT NULL,
  fecviab         DATE NOT NULL,
  rutadoc         VARCHAR2(300) NOT NULL,
  annoini         NUMBER(4) NOT NULL,
  annofin         NUMBER(4) NOT NULL,
  codobjc         NUMBER(2) NOT NULL,
  logoproy        BLOB,
  tabestado       VARCHAR2(3) NOT NULL,
  codestado       VARCHAR2(3) NOT NULL,
  observac        VARCHAR2(500) NOT NULL,
  vigente         VARCHAR2(1) NOT NULL,
  CONSTRAINT proyecto_pk PRIMARY KEY ( codcia,
                                       codpyto ),
  CONSTRAINT cia_proyecto_fk FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia ),
  CONSTRAINT empleado_proyecto_fk
    FOREIGN KEY ( codcia,
                  empljefeproy )
      REFERENCES empleado ( codcia,
                            codempleado ),
  CONSTRAINT cliente_proyecto_fk
    FOREIGN KEY ( codcia,
                  codcliente )
      REFERENCES cliente ( codcia,
                           codcliente )
);

CREATE TABLE especialidades_personal (
  codcia             NUMBER(6) NOT NULL,
  codespecialidad    NUMBER(6) NOT NULL,
  codempleado        NUMBER(6) NOT NULL,
  especialidad       VARCHAR2(100) NOT NULL,
  certificado        BLOB,
  institucion        VARCHAR2(200),
  fecha_obtencion    DATE,
  horas_capacitacion NUMBER(6,2),
  CONSTRAINT pk_esp_empleado PRIMARY KEY ( codcia,
                                           codespecialidad,
                                           codempleado ),
  CONSTRAINT fk_esp_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado )
        ON DELETE CASCADE
);

CREATE TABLE grados_academicos (
  codcia          NUMBER(6) NOT NULL,
  codgrado        NUMBER(6) NOT NULL,
  codempleado     NUMBER(6) NOT NULL,
  tipo_grado      VARCHAR2(50),
  carrera         VARCHAR2(100) NOT NULL,
  titulo          VARCHAR2(200) NOT NULL,
  institucion     VARCHAR2(200) NOT NULL,
  fecha_obtencion DATE,
  documento       BLOB,
  CONSTRAINT pk_grado_empleado PRIMARY KEY ( codcia,
                                             codgrado,
                                             codempleado ),
  CONSTRAINT fk_grado_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado )
        ON DELETE CASCADE
);

CREATE TABLE experiencia_laboral (
  codcia         NUMBER(6) NOT NULL,
  codexperiencia NUMBER(6) NOT NULL,
  codempleado    NUMBER(6) NOT NULL,
  empresa        VARCHAR2(200) NOT NULL,
  especialidad   VARCHAR2(100),
  fecha_inicio   DATE NOT NULL,
  fecha_fin      DATE,
  certificado    BLOB,
  CONSTRAINT pk_exp_empleado PRIMARY KEY ( codcia,
                                           codexperiencia,
                                           codempleado ),
  CONSTRAINT fk_exp_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado )
        ON DELETE CASCADE
);

CREATE TABLE cargos_areas (
  codcargo     NUMBER(6) NOT NULL,
  codarea      NUMBER(6) NOT NULL,
  codcia       NUMBER(6) NOT NULL,
  nombre_cargo VARCHAR2(100) NOT NULL,
  CONSTRAINT cargos_areas_pk PRIMARY KEY ( codcargo,
                                           codarea,
                                           codcia ),
  CONSTRAINT fk_cargo_area
    FOREIGN KEY ( codcia,
                  codarea )
      REFERENCES areas ( codcia,
                         codarea )
        ON DELETE CASCADE,
  CONSTRAINT fk_cargo_cia FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia )
);

CREATE TABLE personal_proyectos (
  codcia              NUMBER(6) NOT NULL,
  codpersonalproyecto NUMBER(6) NOT NULL,
  codempleado         NUMBER(6) NOT NULL,
  codpyto             NUMBER(6) NOT NULL,
  codcargo            NUMBER(6) NOT NULL,
  codarea             NUMBER(6) NOT NULL,
  fecha_asignacion    DATE DEFAULT sysdate,
  fecha_desasignacion DATE,
  horas_asignadas     NUMBER(5,2),
  monto_asignado      NUMBER(12,2),
  documento           BLOB,
  CONSTRAINT pk_pp_empleado PRIMARY KEY ( codcia,
                                          codpersonalproyecto,
                                          codempleado ),
  CONSTRAINT fk_pp_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado )
        ON DELETE CASCADE,
  CONSTRAINT fk_pp_proyecto
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto )
        ON DELETE CASCADE,
  CONSTRAINT fk_pp_cargo
    FOREIGN KEY ( codcargo,
                  codarea,
                  codcia )
      REFERENCES cargos_areas ( codcargo,
                                codarea,
                                codcia )
        ON DELETE CASCADE,
  CONSTRAINT fk_pp_area
    FOREIGN KEY ( codcia,
                  codarea )
      REFERENCES areas ( codcia,
                         codarea )
        ON DELETE CASCADE,
  CONSTRAINT uk_empleado_proyecto UNIQUE ( codcia,
                                           codempleado,
                                           codpyto,
                                           fecha_asignacion )
);

CREATE TABLE tareas_personal (
  codcia       NUMBER(6) NOT NULL,
  codtarea     NUMBER(6) NOT NULL,
  codpyto      NUMBER(6) NOT NULL,
  codempleado  NUMBER(6),
  nombre       VARCHAR2(200) NOT NULL,
  descripcion  CLOB,
  fecha_inicio DATE,
  fecha_fin    DATE,
  estado       VARCHAR2(20) DEFAULT 'PENDIENTE',
  CONSTRAINT tareas_personal_pk
    PRIMARY KEY ( codcia,
                  codtarea,
                  codpyto,
                  codempleado ),
  CONSTRAINT fk_tarea_proyecto
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto )
        ON DELETE CASCADE,
  CONSTRAINT fk_tarea_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado )
);

CREATE TABLE evaluaciones_desempeno (
  codcia                 NUMBER(6) NOT NULL,
  codevaluacion          NUMBER(6) NOT NULL,
  codempleado            NUMBER(6) NOT NULL,
  codpyto                NUMBER(6),
  evaluador_id           NUMBER NOT NULL,
  puntuacion_total       NUMBER(4,2) CHECK ( puntuacion_total >= 0
                                       AND puntuacion_total <= 100 ),
  competencias_tecnicas  NUMBER(4,2),
  competencias_blandas   NUMBER(4,2),
  cumplimiento_objetivos NUMBER(4,2),
  CONSTRAINT evaluaciones_desempeno_pk
    PRIMARY KEY ( codcia,
                  codevaluacion,
                  codempleado,
                  codpyto ),
  CONSTRAINT fk_eval_empleado
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado ),
  CONSTRAINT fk_eval_proyecto
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto ),
  CONSTRAINT fk_eval_evaluador
    FOREIGN KEY ( codcia,
                  evaluador_id )
      REFERENCES empleado ( codcia,
                            codempleado )
);

CREATE TABLE proveedor (
  codcia       NUMBER(6) NOT NULL,
  codproveedor NUMBER(6) NOT NULL,
  nroruc       VARCHAR2(20) NOT NULL,
  vigente      VARCHAR2(1) NOT NULL,
  CONSTRAINT proveedor_pk PRIMARY KEY ( codcia,
                                        codproveedor ),
  CONSTRAINT persona_proveedor_fk
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES persona ( codcia,
                           codpersona )
);

CREATE TABLE servicios_proveedor (
  codcia             NUMBER(6) NOT NULL,
  codservicio        NUMBER(6) NOT NULL,
  codproveedor       NUMBER(6) NOT NULL,
  nombre_servicio    VARCHAR2(200) NOT NULL,
  descripcion        CLOB,
  documento_servicio BLOB,
  CONSTRAINT pk_servicio_proveedor PRIMARY KEY ( codcia,
                                                 codservicio,
                                                 codproveedor ),
  CONSTRAINT fk_servicio_proveedor
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES proveedor ( codcia,
                             codproveedor )
        ON DELETE CASCADE
);

CREATE TABLE contratos_proveedor (
  codcia             NUMBER(6) NOT NULL,
  codcontrato        NUMBER(6) NOT NULL,
  codproveedor       NUMBER(6) NOT NULL,
  codpyto            NUMBER(6),
  numero_contrato    VARCHAR2(50) UNIQUE NOT NULL,
  tipo_contrato      VARCHAR2(50),
  fecha_inicio       DATE NOT NULL,
  fecha_fin          DATE,
  monto_total        NUMBER(15,2) NOT NULL,
  moneda             VARCHAR2(3) DEFAULT 'PEN',
  documento_contrato BLOB,
  CONSTRAINT contratos_proveedor_pk
    PRIMARY KEY ( codcia,
                  codcontrato,
                  codproveedor,
                  codpyto ),
  CONSTRAINT fk_contrato_proveedor
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES proveedor ( codcia,
                             codproveedor ),
  CONSTRAINT fk_contrato_proyecto
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto )
);

CREATE TABLE actividades_proveedor (
  codcia          NUMBER(6) NOT NULL,
  codactividad    NUMBER(6) NOT NULL,
  codproveedor    NUMBER(6) NOT NULL,
  codpyto         NUMBER(6),
  codcontrato     NUMBER(6),
  descripcion     VARCHAR2(500) NOT NULL,
  fecha_actividad DATE DEFAULT sysdate,
  monto           NUMBER(12,2),
  estado          VARCHAR2(20) DEFAULT 'PENDIENTE',
  documento       BLOB,
  observaciones   VARCHAR2(1000),
  CONSTRAINT actividades_proveedor_pk
    PRIMARY KEY ( codcia,
                  codactividad,
                  codproveedor,
                  codpyto,
                  codcontrato ),
  CONSTRAINT fk_actividad_proveedor
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES proveedor ( codcia,
                             codproveedor )
        ON DELETE CASCADE,
  CONSTRAINT fk_actividad_proyecto
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto ),
  CONSTRAINT fk_actividad_contrato
    FOREIGN KEY ( codcia,
                  codcontrato,
                  codproveedor,
                  codpyto )
      REFERENCES contratos_proveedor ( codcia,
                                       codcontrato,
                                       codproveedor,
                                       codpyto )
);

CREATE TABLE documentos_proveedor (
  codcia            NUMBER(6) NOT NULL,
  coddocumento      NUMBER(6) NOT NULL,
  codproveedor      NUMBER(6) NOT NULL,
  tipo_documento    VARCHAR2(50),
  numero_documento  VARCHAR2(100),
  archivo           BLOB NOT NULL,
  tipo_archivo      VARCHAR2(10),
  fecha_emision     DATE,
  fecha_vencimiento DATE,
  CONSTRAINT documentos_proveedor_pk PRIMARY KEY ( codcia,
                                                   coddocumento,
                                                   codproveedor ),
  CONSTRAINT fk_doc_proveedor
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES proveedor ( codcia,
                             codproveedor )
        ON DELETE CASCADE
);

CREATE TABLE comp_pagocab (
  codcia       NUMBER(6) NOT NULL,
  codproveedor NUMBER(6) NOT NULL,
  nrocp        VARCHAR2(20) NOT NULL,
  codpyto      NUMBER(6) NOT NULL,
  nropago      NUMBER(3) NOT NULL,
  tcomppago    VARCHAR2(3) NOT NULL,
  ecomppago    VARCHAR2(3) NOT NULL,
  feccp        DATE NOT NULL,
  tmoneda      VARCHAR2(3) NOT NULL,
  emoneda      VARCHAR2(3) NOT NULL,
  tipcambio    NUMBER(7,4) NOT NULL,
  impmo        NUMBER(9,2) NOT NULL,
  impnetomn    NUMBER(9,2) NOT NULL,
  impigvmn     NUMBER(9,2) NOT NULL,
  imptotalmn   NUMBER(10,2) NOT NULL,
  fotocp       BLOB,
  fotoabono    BLOB,
  fecabono     DATE NOT NULL,
  desabono     VARCHAR2(1000) NOT NULL,
  semilla      NUMBER(5) NOT NULL,
  tabestado    VARCHAR2(3) NOT NULL,
  codestado    VARCHAR2(3) NOT NULL,
  CONSTRAINT comp_pagocab_pk PRIMARY KEY ( codcia,
                                           codproveedor,
                                           nrocp ),
  CONSTRAINT comp_pagocab_proveedor_fk
    FOREIGN KEY ( codcia,
                  codproveedor )
      REFERENCES proveedor ( codcia,
                             codproveedor ),
  CONSTRAINT comp_pagocab_elementos_fk
    FOREIGN KEY ( tmoneda,
                  emoneda )
      REFERENCES elementos ( codtab,
                             codelem ),
  CONSTRAINT comp_pagocab_elementos_2_fk
    FOREIGN KEY ( tcomppago,
                  ecomppago )
      REFERENCES elementos ( codtab,
                             codelem ),
  CONSTRAINT comp_pagocab_proyecto_fk
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto )
);

CREATE TABLE comp_pagoempleado (
  codcia      NUMBER(6) NOT NULL,
  codempleado NUMBER(6) NOT NULL,
  nrocp       VARCHAR2(20) NOT NULL,
  codpyto     NUMBER(6) NOT NULL,
  nropago     NUMBER(3) NOT NULL,
  tcomppago   VARCHAR2(3) NOT NULL,
  ecomppago   VARCHAR2(3) NOT NULL,
  feccp       DATE NOT NULL,
  tmoneda     VARCHAR2(3) NOT NULL,
  emoneda     VARCHAR2(3) NOT NULL,
  tipcambio   NUMBER(7,4) NOT NULL,
  impmo       NUMBER(9,2) NOT NULL,
  impnetomn   NUMBER(9,2) NOT NULL,
  impigvmn    NUMBER(9,2) NOT NULL,
  imptotalmn  NUMBER(10,2) NOT NULL,
  fotocp      BLOB,
  fotoabono   BLOB,
  fecabono    DATE NOT NULL,
  desabono    VARCHAR2(1000) NOT NULL,
  semilla     NUMBER(5) NOT NULL,
  tabestado   VARCHAR2(3) NOT NULL,
  codestado   VARCHAR2(3) NOT NULL,
  CONSTRAINT comp_pagoempleado_pk PRIMARY KEY ( codcia,
                                                codempleado,
                                                nrocp ),
  CONSTRAINT comp_pagoempleado_empleado_fk
    FOREIGN KEY ( codcia,
                  codempleado )
      REFERENCES empleado ( codcia,
                            codempleado ),
  CONSTRAINT comp_pagoempleado_elementos_fk
    FOREIGN KEY ( tmoneda,
                  emoneda )
      REFERENCES elementos ( codtab,
                             codelem ),
  CONSTRAINT comp_pagoempleado_elementos_2_fk
    FOREIGN KEY ( tcomppago,
                  ecomppago )
      REFERENCES elementos ( codtab,
                             codelem ),
  CONSTRAINT comp_pagoempleado_proyecto_fk
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto )
);

-- ==================================================================
-- TABLAS ADICIONALES PARA SISTEMA DE COMPROBANTES DE PAGO (GRUPO06)
-- Gestión de Egresos e Ingresos
-- ==================================================================

-- ==================================================================
-- PARTIDA: Tabla maestra de partidas presupuestales
-- Cada partida representa un concepto de ingreso (I) o egreso (E)
-- SIN FK a ELEMENTOS para unidades de medida (compatible con datos grupo06)
-- ==================================================================
CREATE TABLE partida (
  codcia      NUMBER(6) NOT NULL,
  ingegr      VARCHAR2(1) NOT NULL,
  codpartida  NUMBER(6) NOT NULL,
  codpartidas VARCHAR2(12) NOT NULL,
  despartida  VARCHAR2(100) NOT NULL,
  flgcc       VARCHAR2(1) NOT NULL,
  nivel       NUMBER(2) NOT NULL,
  tunimed     VARCHAR2(3) NOT NULL,
  eunimed     VARCHAR2(3) NOT NULL,
  semilla     NUMBER(5) NOT NULL,
  vigente     NUMBER(1) NOT NULL,
  CONSTRAINT partida_pk PRIMARY KEY ( codcia,
                                      ingegr,
                                      codpartida ),
  CONSTRAINT partida_cia_fk FOREIGN KEY ( codcia )
    REFERENCES cia ( codcia )
);

-- ==================================================================
-- PROY_PARTIDA: Partidas asignadas a proyectos específicos
-- ==================================================================
CREATE TABLE proy_partida (
  codcia      NUMBER(6) NOT NULL,
  codpyto     NUMBER(6) NOT NULL,
  nroversion  NUMBER(1) NOT NULL,
  ingegr      VARCHAR2(1) NOT NULL,
  codpartida  NUMBER(6) NOT NULL,
  codpartidas VARCHAR2(12) NOT NULL,
  flgcc       VARCHAR2(1) NOT NULL,
  nivel       NUMBER(2) NOT NULL,
  unimed      VARCHAR2(5) NOT NULL,
  tabestado   VARCHAR2(3) NOT NULL,
  codestado   VARCHAR2(3) NOT NULL,
  vigente     NUMBER(1) NOT NULL,
  CONSTRAINT proy_partida_pk
    PRIMARY KEY ( codcia,
                  codpyto,
                  nroversion,
                  ingegr,
                  codpartida ),
  CONSTRAINT proy_partida_proyecto_fk
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto ),
  CONSTRAINT proy_partida_partida_fk
    FOREIGN KEY ( codcia,
                  ingegr,
                  codpartida )
      REFERENCES partida ( codcia,
                           ingegr,
                           codpartida )
);

-- ==================================================================
-- PROY_PARTIDA_MEZCLA: Mezcla de partidas por proyecto (presupuesto)
-- ==================================================================
CREATE TABLE proy_partida_mezcla (
  codcia        NUMBER(6) NOT NULL,
  codpyto       NUMBER(6) NOT NULL,
  ingegr        VARCHAR2(1) NOT NULL,
  nroversion    NUMBER(1) NOT NULL,
  codpartida    NUMBER(6) NOT NULL,
  corr          NUMBER(6) NOT NULL,
  padcodpartida NUMBER(6) NOT NULL,
  tunimed       VARCHAR2(3) NOT NULL,
  eunimed       VARCHAR2(3) NOT NULL,
  nivel         NUMBER(5) NOT NULL,
  orden         NUMBER(5) NOT NULL,
  costounit     NUMBER(9,2) NOT NULL,
  cant          NUMBER(12,3) NOT NULL,
  costotot      NUMBER(12,2) NOT NULL,
  CONSTRAINT proy_partida_mezcla_pk
    PRIMARY KEY ( codcia,
                  codpyto,
                  nroversion,
                  ingegr,
                  codpartida,
                  corr ),
  CONSTRAINT proy_partida_mezcla_pp_fk
    FOREIGN KEY ( codcia,
                  codpyto,
                  nroversion,
                  ingegr,
                  codpartida )
      REFERENCES proy_partida ( codcia,
                                codpyto,
                                nroversion,
                                ingegr,
                                codpartida )
);

-- ==================================================================
-- COMP_PAGODET: Detalle de comprobantes de pago a proveedores
-- ==================================================================
CREATE TABLE comp_pagodet (
  codcia       NUMBER(6) NOT NULL,
  codproveedor NUMBER(6) NOT NULL,
  nrocp        VARCHAR2(20) NOT NULL,
  sec          NUMBER(4) NOT NULL,
  ingegr       VARCHAR2(1) NOT NULL,
  codpartida   NUMBER(6) NOT NULL,
  impnetomn    NUMBER(9,2) NOT NULL,
  impigvmn     NUMBER(9,2) NOT NULL,
  imptotalmn   NUMBER(9,2) NOT NULL,
  semilla      NUMBER(5) NOT NULL,
  CONSTRAINT comp_pagodet_pk
    PRIMARY KEY ( codcia,
                  codproveedor,
                  nrocp,
                  sec ),
  CONSTRAINT comp_pagodet_cab_fk
    FOREIGN KEY ( codcia,
                  codproveedor,
                  nrocp )
      REFERENCES comp_pagocab ( codcia,
                                codproveedor,
                                nrocp ),
  CONSTRAINT comp_pagodet_partida_fk
    FOREIGN KEY ( codcia,
                  ingegr,
                  codpartida )
      REFERENCES partida ( codcia,
                           ingegr,
                           codpartida )
);

-- ==================================================================
-- COMP_PAGOEMPLEADO_DET: Detalle de comprobantes de pago a empleados
-- ==================================================================
CREATE TABLE comp_pagoempleado_det (
  codcia      NUMBER(6) NOT NULL,
  codempleado NUMBER(6) NOT NULL,
  nrocp       VARCHAR2(20) NOT NULL,
  sec         NUMBER(4) NOT NULL,
  ingegr      VARCHAR2(1) NOT NULL,
  codpartida  NUMBER(6) NOT NULL,
  impnetomn   NUMBER(9,2) NOT NULL,
  impigvmn    NUMBER(9,2) NOT NULL,
  imptotalmn  NUMBER(9,2) NOT NULL,
  semilla     NUMBER(5) NOT NULL,
  CONSTRAINT comp_pagoempdet_pk
    PRIMARY KEY ( codcia,
                  codempleado,
                  nrocp,
                  sec ),
  CONSTRAINT comp_pagoempdet_cab_fk
    FOREIGN KEY ( codcia,
                  codempleado,
                  nrocp )
      REFERENCES comp_pagoempleado ( codcia,
                                     codempleado,
                                     nrocp ),
  CONSTRAINT comp_pagoempdet_partida_fk
    FOREIGN KEY ( codcia,
                  ingegr,
                  codpartida )
      REFERENCES partida ( codcia,
                           ingegr,
                           codpartida )
);

-- ==================================================================
-- VTACOMP_PAGOCAB: Comprobantes de venta/ingresos a clientes (cabecera)
-- FotoCP y FotoAbono son VARCHAR2 para compatibilidad con datos grupo06
-- ==================================================================
CREATE TABLE vtacomp_pagocab (
  codcia     NUMBER(6) NOT NULL,
  nrocp      VARCHAR2(20) NOT NULL,
  codpyto    NUMBER(6) NOT NULL,
  codcliente NUMBER(6) NOT NULL,
  nropago    NUMBER(3) NOT NULL,
  tcomppago  VARCHAR2(3) NOT NULL,
  ecomppago  VARCHAR2(3) NOT NULL,
  feccp      DATE NOT NULL,
  tmoneda    VARCHAR2(3) NOT NULL,
  emoneda    VARCHAR2(3) NOT NULL,
  tipcambio  NUMBER(7,4) NOT NULL,
  impmo      NUMBER(9,2) NOT NULL,
  impnetomn  NUMBER(9,2) NOT NULL,
  impigvmn   NUMBER(9,2) NOT NULL,
  imptotalmn NUMBER(10,2) NOT NULL,
  fotocp     VARCHAR2(60),
  fotoabono  VARCHAR2(60),
  fecabono   DATE,
  desabono   VARCHAR2(1000),
  semilla    NUMBER(5) NOT NULL,
  tabestado  VARCHAR2(3) NOT NULL,
  codestado  VARCHAR2(3) NOT NULL,
  CONSTRAINT vtacomp_pagocab_pk PRIMARY KEY ( codcia,
                                              nrocp ),
  CONSTRAINT vtacomp_pagocab_cliente_fk
    FOREIGN KEY ( codcia,
                  codcliente )
      REFERENCES cliente ( codcia,
                           codcliente ),
  CONSTRAINT vtacomp_pagocab_proyecto_fk
    FOREIGN KEY ( codcia,
                  codpyto )
      REFERENCES proyecto ( codcia,
                            codpyto ),
  CONSTRAINT vtacomp_pagocab_moneda_fk
    FOREIGN KEY ( tmoneda,
                  emoneda )
      REFERENCES elementos ( codtab,
                             codelem ),
  CONSTRAINT vtacomp_pagocab_comp_fk
    FOREIGN KEY ( tcomppago,
                  ecomppago )
      REFERENCES elementos ( codtab,
                             codelem )
);

-- ==================================================================
-- VTACOMP_PAGODET: Detalle de comprobantes de venta/ingresos
-- ==================================================================
CREATE TABLE vtacomp_pagodet (
  codcia     NUMBER(6) NOT NULL,
  nrocp      VARCHAR2(20) NOT NULL,
  sec        NUMBER(4) NOT NULL,
  ingegr     VARCHAR2(1) NOT NULL,
  codpartida NUMBER(6) NOT NULL,
  impnetomn  NUMBER(9,2) NOT NULL,
  impigvmn   NUMBER(9,2) NOT NULL,
  imptotalmn NUMBER(9,2) NOT NULL,
  semilla    NUMBER(5) NOT NULL,
  CONSTRAINT vtacomp_pagodet_pk PRIMARY KEY ( codcia,
                                              nrocp,
                                              sec ),
  CONSTRAINT vtacomp_pagodet_cab_fk
    FOREIGN KEY ( codcia,
                  nrocp )
      REFERENCES vtacomp_pagocab ( codcia,
                                   nrocp ),
  CONSTRAINT vtacomp_pagodet_partida_fk
    FOREIGN KEY ( codcia,
                  ingegr,
                  codpartida )
      REFERENCES partida ( codcia,
                           ingegr,
                           codpartida )
);

-- ==================================================================
-- SECUENCIAS
-- ==================================================================

CREATE SEQUENCE sec_cia START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_persona START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_usuarios START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_tabs START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_areas START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_cargos START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_proyecto START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_especialidades START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_grados START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_experiencia START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_personal_proyectos START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_tareas START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_evaluaciones START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_servicios START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_contratos START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_actividades START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_documentos START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

-- ==================================================================
-- SECUENCIAS ADICIONALES PARA SISTEMA DE COMPROBANTES (GRUPO06)
-- ==================================================================

CREATE SEQUENCE sec_partida START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

CREATE SEQUENCE sec_nro_pago_vta START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999 NOCACHE;

-- ==================================================================
-- FUNCIONES UTILITARIAS
-- ==================================================================

-- Función para calcular duración de proyecto en años
CREATE OR REPLACE FUNCTION duracion_proyecto (
  cod_pyto IN proyecto.codpyto%TYPE
) RETURN NUMBER IS
  duracionenanios NUMBER;
BEGIN
  SELECT ( annofin - annoini + 1 )
  INTO duracionenanios
  FROM proyecto
  WHERE codpyto = cod_pyto;

  RETURN duracionenanios;
EXCEPTION
  WHEN no_data_found THEN
    RETURN 0;
  WHEN OTHERS THEN
    RETURN -1;
END duracion_proyecto;
/

-- Función para obtener tipo de persona
CREATE OR REPLACE FUNCTION get_persona_tipo (
  cod_cia     IN persona.codcia%TYPE,
  cod_persona IN persona.codpersona%TYPE
) RETURN VARCHAR2 IS
  tipo VARCHAR2(1);
BEGIN
  SELECT tippersona
  INTO tipo
  FROM persona
  WHERE codcia = cod_cia
        AND codpersona = cod_persona;

  RETURN tipo;
EXCEPTION
  WHEN no_data_found THEN
    RETURN NULL;
  WHEN OTHERS THEN
    RETURN NULL;
END get_persona_tipo;
/

-- ==================================================================
-- PROCEDIMIENTOS DE INSERCIÓN MEJORADOS
-- ==================================================================

-- Procedimiento para insertar CIA
CREATE OR REPLACE PROCEDURE insertar_cia (
  codc     IN cia.codcia%TYPE,
  des      IN cia.descia%TYPE,
  descorta IN cia.descorta%TYPE,
  vig      IN cia.vigente%TYPE
) IS
BEGIN
  INSERT INTO cia VALUES ( sec_cia.NEXTVAL,
                           des,
                           descorta,
                           vig );
END;
/

-- Procedimiento para insertar CLIENTE
CREATE OR REPLACE PROCEDURE insertar_cliente (
  codcia    IN persona.codcia%TYPE,
  desp      IN persona.despersona%TYPE,
  descor    IN persona.descorta%TYPE,
  descalt   IN persona.descalterna%TYPE,
  descoralt IN persona.descortaalt%TYPE,
  vig       IN persona.vigente%TYPE,
  ruc       IN cliente.nroruc%TYPE
) IS
BEGIN
  INSERT INTO persona VALUES ( codcia,
                               sec_persona.NEXTVAL,
                               '2',
                               desp,
                               descor,
                               descalt,
                               descoralt,
                               vig );
  INSERT INTO cliente VALUES ( codcia,
                               sec_persona.CURRVAL,
                               ruc,
                               vig );
END;
/

-- Procedimiento para insertar EMPLEADO
CREATE OR REPLACE PROCEDURE insertar_empleado (
  cia       IN persona.codcia%TYPE,
  tip       IN persona.tippersona%TYPE,
  desp      IN persona.despersona%TYPE,
  descor    IN persona.descorta%TYPE,
  descalt   IN persona.descalterna%TYPE,
  descoralt IN persona.descortaalt%TYPE,
  vig       IN persona.vigente%TYPE,
  dir       IN empleado.direcc%TYPE,
  cel       IN empleado.celular%TYPE,
  hob       IN empleado.hobby%TYPE,
  fot       IN empleado.foto%TYPE,
  nac       IN empleado.fecnac%TYPE,
  iden      IN empleado.dni%TYPE,
  cip       IN empleado.nrocip%TYPE,
  cipvig    IN empleado.feccipvig%TYPE,
  cond      IN empleado.liccond%TYPE,
  flg       IN empleado.flgempliea%TYPE,
  obs       IN empleado.observac%TYPE,
  codcar    IN empleado.codcargo%TYPE,
  correo    IN empleado.email%TYPE
) IS
BEGIN
  INSERT INTO persona VALUES ( cia,
                               sec_persona.NEXTVAL,
                               tip,
                               desp,
                               descor,
                               descalt,
                               descoralt,
                               vig );
  INSERT INTO empleado VALUES ( cia,
                                sec_persona.CURRVAL,
                                dir,
                                cel,
                                hob,
                                fot,
                                nac,
                                iden,
                                cip,
                                cipvig,
                                cond,
                                flg,
                                obs,
                                codcar,
                                correo,
                                vig );
END;
/

-- Procedimiento para insertar PROVEEDOR
CREATE OR REPLACE PROCEDURE insertar_proveedor (
  codc      IN persona.codcia%TYPE,
  tip       IN persona.tippersona%TYPE,
  desp      IN persona.despersona%TYPE,
  descor    IN persona.descorta%TYPE,
  descalt   IN persona.descalterna%TYPE,
  descoralt IN persona.descortaalt%TYPE,
  vig       IN persona.vigente%TYPE,
  ruc       IN proveedor.nroruc%TYPE
) IS
BEGIN
  INSERT INTO persona VALUES ( codc,
                               sec_persona.NEXTVAL,
                               tip,
                               desp,
                               descor,
                               descalt,
                               descoralt,
                               vig );
  INSERT INTO proveedor VALUES ( codc,
                                 sec_persona.CURRVAL,
                                 ruc,
                                 vig );
END;
/

-- Procedimiento para insertar PROYECTO
CREATE OR REPLACE PROCEDURE insertar_proyecto (
  cod_cia     IN proyecto.codcia%TYPE,
  nompy       IN proyecto.nombpyto%TYPE,
  jefe        IN proyecto.empljefeproy%TYPE,
  ciacont     IN proyecto.ciacontrata%TYPE,
  codcli      IN proyecto.codcliente%TYPE,
  fecre       IN proyecto.fecreg%TYPE,
  estpyt      IN proyecto.estpyto%TYPE,
  fecest      IN proyecto.fecestado%TYPE,
  valref      IN proyecto.valrefer%TYPE,
  costototsin IN proyecto.costototsinigv%TYPE,
  igv         IN proyecto.impigv%TYPE,
  costot      IN proyecto.costototal%TYPE,
  obs         IN proyecto.observac%TYPE,
  annoin      IN proyecto.annoini%TYPE,
  annofi      IN proyecto.annofin%TYPE,
  logo        IN proyecto.logoproy%TYPE,
  vigent      IN proyecto.vigente%TYPE
) IS
BEGIN
  INSERT INTO proyecto (
    codcia,
    codpyto,
    nombpyto,
    empljefeproy,
    codcia1,
    ciacontrata,
    codcc,
    codcliente,
    flgempconsorcio,
    codsnip,
    fecreg,
    codfase,
    codnivel,
    codfuncion,
    codsituacion,
    numinfor,
    numinforentrg,
    estpyto,
    fecestado,
    valrefer,
    costodirecto,
    costoggen,
    costofinan,
    imputilidad,
    costototsinigv,
    impigv,
    costototal,
    costopenalid,
    coddpto,
    codprov,
    coddist,
    fecviab,
    rutadoc,
    annoini,
    annofin,
    codobjc,
    logoproy,
    tabestado,
    codestado,
    observac,
    vigente
  ) VALUES ( cod_cia,
             sec_proyecto.NEXTVAL,
             nompy,
             jefe,
             - 999,
             ciacont,
             - 999,
             codcli,
             '-',
             '-',
             fecre,
             0,
             0,
             '-',
             0,
             0,
             0,
             estpyt,
             fecest,
             valref,
             - 999,
             - 999,
             - 999,
             - 999,
             costototsin,
             igv,
             costot,
             - 999,
             '-',
             '-',
             '-',
             '01-01-2022',
             'RUTA_DOC',
             annoin,
             annofi,
             0,
             logo,
             '-1',
             '1',
             obs,
             vigent );
END;
/

-- Procedimiento para insertar ELEMENTOS
CREATE OR REPLACE PROCEDURE insertar_elementos (
  ctab    IN elementos.codtab%TYPE,
  cele    IN elementos.codelem%TYPE,
  deele   IN elementos.denele%TYPE,
  decorta IN elementos.dencorta%TYPE,
  vig     IN elementos.vigente%TYPE
) IS
BEGIN
  INSERT INTO elementos VALUES ( ctab,
                                 cele,
                                 deele,
                                 decorta,
                                 vig );
END;
/

-- Procedimiento para insertar TABS
CREATE OR REPLACE PROCEDURE insertar_tabs (
  detab IN tabs.dentab%TYPE,
  decor IN tabs.dencorta%TYPE,
  vig   IN tabs.vigente%TYPE
) IS
BEGIN
  INSERT INTO tabs VALUES ( sec_tabs.NEXTVAL,
                            detab,
                            decor,
                            vig );
END;
/

-- Procedimiento para insertar USUARIOS
CREATE OR REPLACE PROCEDURE insertar_usuario (
  cia     IN usuarios.codcia%TYPE,
  usuario IN usuarios.username%TYPE,
  pass    IN usuarios.password_hash%TYPE,
  tipo    IN usuarios.tipo_usuario%TYPE
) IS
BEGIN
  INSERT INTO usuarios VALUES ( cia,
                                sec_usuarios.NEXTVAL,
                                usuario,
                                pass,
                                tipo );
END;
/

-- Procedimiento para insertar AREAS
CREATE OR REPLACE PROCEDURE insertar_area (
  cia       IN areas.codcia%TYPE,
  nombre    IN areas.nombre%TYPE,
  desc_area IN areas.descripcion%TYPE,
  estado    IN areas.estado%TYPE
) IS
BEGIN
  INSERT INTO areas VALUES ( cia,
                             sec_areas.NEXTVAL,
                             nombre,
                             desc_area,
                             estado );
END;
/

-- Procedimiento para insertar CARGOS_AREAS
CREATE OR REPLACE PROCEDURE insertar_cargo (
  cia          IN cargos_areas.codcia%TYPE,
  area         IN cargos_areas.codarea%TYPE,
  nombre_cargo IN cargos_areas.nombre_cargo%TYPE
) IS
BEGIN
  INSERT INTO cargos_areas VALUES ( sec_cargos.NEXTVAL,
                                    area,
                                    cia,
                                    nombre_cargo );
END;
/

-- Procedimiento para insertar ESPECIALIDADES_PERSONAL
CREATE OR REPLACE PROCEDURE insertar_especialidad (
  cia   IN especialidades_personal.codcia%TYPE,
  emp   IN especialidades_personal.codempleado%TYPE,
  esp   IN especialidades_personal.especialidad%TYPE,
  cert  IN especialidades_personal.certificado%TYPE,
  inst  IN especialidades_personal.institucion%TYPE,
  fecha IN especialidades_personal.fecha_obtencion%TYPE,
  horas IN especialidades_personal.horas_capacitacion%TYPE
) IS
BEGIN
  INSERT INTO especialidades_personal VALUES ( cia,
                                               sec_especialidades.NEXTVAL,
                                               emp,
                                               esp,
                                               cert,
                                               inst,
                                               fecha,
                                               horas );
END;
/

-- Procedimiento para insertar GRADOS_ACADEMICOS
CREATE OR REPLACE PROCEDURE insertar_grado (
  cia        IN grados_academicos.codcia%TYPE,
  emp        IN grados_academicos.codempleado%TYPE,
  tipo_grado IN grados_academicos.tipo_grado%TYPE,
  carrera    IN grados_academicos.carrera%TYPE,
  titulo     IN grados_academicos.titulo%TYPE,
  inst       IN grados_academicos.institucion%TYPE,
  fecha      IN grados_academicos.fecha_obtencion%TYPE,
  doc        IN grados_academicos.documento%TYPE
) IS
BEGIN
  INSERT INTO grados_academicos VALUES ( cia,
                                         sec_grados.NEXTVAL,
                                         emp,
                                         tipo_grado,
                                         carrera,
                                         titulo,
                                         inst,
                                         fecha,
                                         doc );
END;
/

-- Procedimiento para insertar EXPERIENCIA_LABORAL
CREATE OR REPLACE PROCEDURE insertar_experiencia (
  cia       IN experiencia_laboral.codcia%TYPE,
  emp       IN experiencia_laboral.codempleado%TYPE,
  empresa   IN experiencia_laboral.empresa%TYPE,
  esp       IN experiencia_laboral.especialidad%TYPE,
  fecha_ini IN experiencia_laboral.fecha_inicio%TYPE,
  fecha_fin IN experiencia_laboral.fecha_fin%TYPE,
  cert      IN experiencia_laboral.certificado%TYPE
) IS
BEGIN
  INSERT INTO experiencia_laboral VALUES ( cia,
                                           sec_experiencia.NEXTVAL,
                                           emp,
                                           empresa,
                                           esp,
                                           fecha_ini,
                                           fecha_fin,
                                           cert );
END;
/

-- Procedimiento para insertar PERSONAL_PROYECTOS
CREATE OR REPLACE PROCEDURE insertar_personal_proyecto (
  cia           IN personal_proyectos.codcia%TYPE,
  emp           IN personal_proyectos.codempleado%TYPE,
  pyto          IN personal_proyectos.codpyto%TYPE,
  cargo         IN personal_proyectos.codcargo%TYPE,
  area          IN personal_proyectos.codarea%TYPE,
  fecha_asig    IN personal_proyectos.fecha_asignacion%TYPE,
  fecha_desasig IN personal_proyectos.fecha_desasignacion%TYPE,
  horas         IN personal_proyectos.horas_asignadas%TYPE,
  monto         IN personal_proyectos.monto_asignado%TYPE,
  doc           IN personal_proyectos.documento%TYPE
) IS
BEGIN
  INSERT INTO personal_proyectos VALUES ( cia,
                                          sec_personal_proyectos.NEXTVAL,
                                          emp,
                                          pyto,
                                          cargo,
                                          area,
                                          fecha_asig,
                                          fecha_desasig,
                                          horas,
                                          monto,
                                          doc );
END;
/

-- Procedimiento para insertar TAREAS_PERSONAL
CREATE OR REPLACE PROCEDURE insertar_tarea (
  cia        IN tareas_personal.codcia%TYPE,
  pyto       IN tareas_personal.codpyto%TYPE,
  emp        IN tareas_personal.codempleado%TYPE,
  nombre     IN tareas_personal.nombre%TYPE,
  desc_tarea IN tareas_personal.descripcion%TYPE,
  fecha_ini  IN tareas_personal.fecha_inicio%TYPE,
  fecha_fin  IN tareas_personal.fecha_fin%TYPE,
  estado     IN tareas_personal.estado%TYPE
) IS
BEGIN
  INSERT INTO tareas_personal VALUES ( cia,
                                       sec_tareas.NEXTVAL,
                                       pyto,
                                       emp,
                                       nombre,
                                       desc_tarea,
                                       fecha_ini,
                                       fecha_fin,
                                       estado );
END;
/

-- Procedimiento para insertar EVALUACIONES_DESEMPENO
CREATE OR REPLACE PROCEDURE insertar_evaluacion (
  cia        IN evaluaciones_desempeno.codcia%TYPE,
  emp        IN evaluaciones_desempeno.codempleado%TYPE,
  pyto       IN evaluaciones_desempeno.codpyto%TYPE,
  evaluador  IN evaluaciones_desempeno.evaluador_id%TYPE,
  punt_total IN evaluaciones_desempeno.puntuacion_total%TYPE,
  comp_tec   IN evaluaciones_desempeno.competencias_tecnicas%TYPE,
  comp_bland IN evaluaciones_desempeno.competencias_blandas%TYPE,
  cump_obj   IN evaluaciones_desempeno.cumplimiento_objetivos%TYPE
) IS
BEGIN
  INSERT INTO evaluaciones_desempeno VALUES ( cia,
                                              sec_evaluaciones.NEXTVAL,
                                              emp,
                                              pyto,
                                              evaluador,
                                              punt_total,
                                              comp_tec,
                                              comp_bland,
                                              cump_obj );
END;
/

-- Procedimiento para insertar SERVICIOS_PROVEEDOR
CREATE OR REPLACE PROCEDURE insertar_servicio (
  cia       IN servicios_proveedor.codcia%TYPE,
  prov      IN servicios_proveedor.codproveedor%TYPE,
  nombre    IN servicios_proveedor.nombre_servicio%TYPE,
  desc_serv IN servicios_proveedor.descripcion%TYPE,
  doc       IN servicios_proveedor.documento_servicio%TYPE
) IS
BEGIN
  INSERT INTO servicios_proveedor VALUES ( cia,
                                           sec_servicios.NEXTVAL,
                                           prov,
                                           nombre,
                                           desc_serv,
                                           doc );
END;
/

-- Procedimiento para insertar CONTRATOS_PROVEEDOR
CREATE OR REPLACE PROCEDURE insertar_contrato (
  cia          IN contratos_proveedor.codcia%TYPE,
  prov         IN contratos_proveedor.codproveedor%TYPE,
  pyto         IN contratos_proveedor.codpyto%TYPE,
  num_contrato IN contratos_proveedor.numero_contrato%TYPE,
  tipo         IN contratos_proveedor.tipo_contrato%TYPE,
  fecha_ini    IN contratos_proveedor.fecha_inicio%TYPE,
  fecha_fin    IN contratos_proveedor.fecha_fin%TYPE,
  monto        IN contratos_proveedor.monto_total%TYPE,
  moneda       IN contratos_proveedor.moneda%TYPE,
  doc          IN contratos_proveedor.documento_contrato%TYPE
) IS
BEGIN
  INSERT INTO contratos_proveedor VALUES ( cia,
                                           sec_contratos.NEXTVAL,
                                           prov,
                                           pyto,
                                           num_contrato,
                                           tipo,
                                           fecha_ini,
                                           fecha_fin,
                                           monto,
                                           moneda,
                                           doc );
END;
/

-- Procedimiento para insertar ACTIVIDADES_PROVEEDOR
CREATE OR REPLACE PROCEDURE insertar_actividad (
  cia      IN actividades_proveedor.codcia%TYPE,
  prov     IN actividades_proveedor.codproveedor%TYPE,
  pyto     IN actividades_proveedor.codpyto%TYPE,
  contrato IN actividades_proveedor.codcontrato%TYPE,
  desc_act IN actividades_proveedor.descripcion%TYPE,
  fecha    IN actividades_proveedor.fecha_actividad%TYPE,
  monto    IN actividades_proveedor.monto%TYPE,
  estado   IN actividades_proveedor.estado%TYPE,
  doc      IN actividades_proveedor.documento%TYPE,
  obs      IN actividades_proveedor.observaciones%TYPE
) IS
BEGIN
  INSERT INTO actividades_proveedor VALUES ( cia,
                                             sec_actividades.NEXTVAL,
                                             prov,
                                             pyto,
                                             contrato,
                                             desc_act,
                                             fecha,
                                             monto,
                                             estado,
                                             doc,
                                             obs );
END;
/

-- Procedimiento para insertar DOCUMENTOS_PROVEEDOR
CREATE OR REPLACE PROCEDURE insertar_documento (
  cia        IN documentos_proveedor.codcia%TYPE,
  prov       IN documentos_proveedor.codproveedor%TYPE,
  tipo_doc   IN documentos_proveedor.tipo_documento%TYPE,
  num_doc    IN documentos_proveedor.numero_documento%TYPE,
  archivo    IN documentos_proveedor.archivo%TYPE,
  tipo_arch  IN documentos_proveedor.tipo_archivo%TYPE,
  fecha_emis IN documentos_proveedor.fecha_emision%TYPE,
  fecha_venc IN documentos_proveedor.fecha_vencimiento%TYPE
) IS
BEGIN
  INSERT INTO documentos_proveedor VALUES ( cia,
                                            sec_documentos.NEXTVAL,
                                            prov,
                                            tipo_doc,
                                            num_doc,
                                            archivo,
                                            tipo_arch,
                                            fecha_emis,
                                            fecha_venc );
END;
/

-- Procedimiento para insertar COMPROBANTE DE PAGO A PROVEEDORES
CREATE OR REPLACE PROCEDURE insertar_comprobante_proveedor (
  cia        IN comp_pagocab.codcia%TYPE,
  prov       IN comp_pagocab.codproveedor%TYPE,
  num_comp   IN comp_pagocab.nrocp%TYPE,
  pyto       IN comp_pagocab.codpyto%TYPE,
  nropago    IN comp_pagocab.nropago%TYPE,
  tcomppago  IN comp_pagocab.tcomppago%TYPE,
  ecomppago  IN comp_pagocab.ecomppago%TYPE,
  fecha      IN comp_pagocab.feccp%TYPE,
  tmoneda    IN comp_pagocab.tmoneda%TYPE,
  emoneda    IN comp_pagocab.emoneda%TYPE,
  cambio     IN comp_pagocab.tipcambio%TYPE,
  impmo      IN comp_pagocab.impmo%TYPE,
  impnetomn  IN comp_pagocab.impnetomn%TYPE,
  impigvmn   IN comp_pagocab.impigvmn%TYPE,
  imptotalmn IN comp_pagocab.imptotalmn%TYPE,
  fotocp     IN comp_pagocab.fotocp%TYPE,
  fotoabono  IN comp_pagocab.fotoabono%TYPE,
  fechabono  IN comp_pagocab.fecabono%TYPE,
  desabono   IN comp_pagocab.desabono%TYPE,
  semilla    IN comp_pagocab.semilla%TYPE,
  tabestado  IN comp_pagocab.tabestado%TYPE,
  estado     IN comp_pagocab.codestado%TYPE
) IS
BEGIN
  INSERT INTO comp_pagocab (
    codcia,
    codproveedor,
    nrocp,
    codpyto,
    nropago,
    tcomppago,
    ecomppago,
    feccp,
    tmoneda,
    emoneda,
    tipcambio,
    impmo,
    impnetomn,
    impigvmn,
    imptotalmn,
    fotocp,
    fotoabono,
    fecabono,
    desabono,
    semilla,
    tabestado,
    codestado
  ) VALUES ( cia,
             prov,
             num_comp,
             pyto,
             nropago,
             tcomppago,
             ecomppago,
             fecha,
             tmoneda,
             emoneda,
             cambio,
             impmo,
             impnetomn,
             impigvmn,
             imptotalmn,
             fotocp,
             fotoabono,
             fechabono,
             desabono,
             semilla,
             tabestado,
             estado );
END;
/

-- Procedimiento para insertar COMPROBANTE DE PAGO A EMPLEADOS
CREATE OR REPLACE PROCEDURE insertar_comprobante_empleado (
  cia        IN comp_pagoempleado.codcia%TYPE,
  emp        IN comp_pagoempleado.codempleado%TYPE,
  num_comp   IN comp_pagoempleado.nrocp%TYPE,
  pyto       IN comp_pagoempleado.codpyto%TYPE,
  nropago    IN comp_pagoempleado.nropago%TYPE,
  tcomppago  IN comp_pagoempleado.tcomppago%TYPE,
  ecomppago  IN comp_pagoempleado.ecomppago%TYPE,
  fecha      IN comp_pagoempleado.feccp%TYPE,
  tmoneda    IN comp_pagoempleado.tmoneda%TYPE,
  emoneda    IN comp_pagoempleado.emoneda%TYPE,
  cambio     IN comp_pagoempleado.tipcambio%TYPE,
  impmo      IN comp_pagoempleado.impmo%TYPE,
  impnetomn  IN comp_pagoempleado.impnetomn%TYPE,
  impigvmn   IN comp_pagoempleado.impigvmn%TYPE,
  imptotalmn IN comp_pagoempleado.imptotalmn%TYPE,
  fotocp     IN comp_pagoempleado.fotocp%TYPE,
  fotoabono  IN comp_pagoempleado.fotoabono%TYPE,
  fechabono  IN comp_pagoempleado.fecabono%TYPE,
  desabono   IN comp_pagoempleado.desabono%TYPE,
  semilla    IN comp_pagoempleado.semilla%TYPE,
  tabestado  IN comp_pagoempleado.tabestado%TYPE,
  estado     IN comp_pagoempleado.codestado%TYPE
) IS
BEGIN
  INSERT INTO comp_pagoempleado (
    codcia,
    codempleado,
    nrocp,
    codpyto,
    nropago,
    tcomppago,
    ecomppago,
    feccp,
    tmoneda,
    emoneda,
    tipcambio,
    impmo,
    impnetomn,
    impigvmn,
    imptotalmn,
    fotocp,
    fotoabono,
    fecabono,
    desabono,
    semilla,
    tabestado,
    codestado
  ) VALUES ( cia,
             emp,
             num_comp,
             pyto,
             nropago,
             tcomppago,
             ecomppago,
             fecha,
             tmoneda,
             emoneda,
             cambio,
             impmo,
             impnetomn,
             impigvmn,
             imptotalmn,
             fotocp,
             fotoabono,
             fechabono,
             desabono,
             semilla,
             tabestado,
             estado );
END;
/

-- ==================================================================
-- DATOS INICIALES
-- ==================================================================

-- Insertar datos iniciales básicos de tablas maestras
INSERT INTO tabs VALUES ( '001',
                          'Estado Civil',
                          'Est_Civ',
                          '1' );
INSERT INTO tabs VALUES ( '002',
                          'Tipo Documento',
                          'Tip_Doc',
                          '1' );
INSERT INTO tabs VALUES ( '003',
                          'Monedas',
                          'Monedas',
                          '1' );
INSERT INTO tabs VALUES ( '004',
                          'Tipo Comprobante',
                          'Tip_Comp',
                          '1' );
INSERT INTO tabs VALUES ( '005',
                          'Grado Academico',
                          'Est_Comp',
                          '1' );
INSERT INTO tabs VALUES ( '006',
                          'Tarea Personal',
                          'Est_Tar',
                          '1' );
INSERT INTO tabs VALUES ( '007',
                          'Contrato Proveedor',
                          'Tip_Cont',
                          '1' );
INSERT INTO tabs VALUES ( '008',
                          'Actividad Proveedor',
                          'Est_Act',
                          '1' );
INSERT INTO tabs VALUES ( '009',
                          'Documento Proveedor',
                          'Doc_Prov',
                          '1' );
INSERT INTO tabs VALUES ( '010',
                          'Tipo Archivo',
                          'Tip_Arch',
                          '1' );
INSERT INTO tabs VALUES ( '011',
                          'Estado Proyecto',
                          'Est_Pyt',
                          '1' );

INSERT INTO elementos VALUES ( '001',
                               '001',
                               'Soltero',
                               'SOL',
                               '1' );
INSERT INTO elementos VALUES ( '001',
                               '002',
                               'Casado',
                               'CAS',
                               '1' );
INSERT INTO elementos VALUES ( '001',
                               '003',
                               'Divorciado',
                               'DIV',
                               '1' );
INSERT INTO elementos VALUES ( '001',
                               '004',
                               'Viudo',
                               'VIU',
                               '1' );

INSERT INTO elementos VALUES ( '002',
                               '001',
                               'DNI',
                               'DNI',
                               '1' );
INSERT INTO elementos VALUES ( '002',
                               '002',
                               'Pasaporte',
                               'PAS',
                               '1' );
INSERT INTO elementos VALUES ( '002',
                               '003',
                               'RUC',
                               'RUC',
                               '1' );
-- Elemento adicional para compatibilidad con datos grupo06 (unidades de medida en partidas)
INSERT INTO elementos VALUES ( '002',
                               'UND',
                               'UNIDADES',
                               'UND',
                               '1' );

INSERT INTO elementos VALUES ( '003',
                               '001',
                               'Soles',
                               'PEN',
                               '1' );
INSERT INTO elementos VALUES ( '003',
                               '002',
                               'Dólares',
                               'USD',
                               '1' );
INSERT INTO elementos VALUES ( '003',
                               '003',
                               'Euros',
                               'EUR',
                               '1' );

INSERT INTO elementos VALUES ( '004',
                               '001',
                               'Factura',
                               'Fact',
                               '1' );
INSERT INTO elementos VALUES ( '004',
                               '002',
                               'Recibo por Honorarios',
                               'RxH',
                               '1' );
INSERT INTO elementos VALUES ( '004',
                               '003',
                               'Voucher',
                               'Vou',
                               '1' );

INSERT INTO elementos VALUES ( '005',
                               '001',
                               'Bachiller',
                               'BACH',
                               '1' );
INSERT INTO elementos VALUES ( '005',
                               '002',
                               'Licenciatura',
                               'LIC',
                               '1' );
INSERT INTO elementos VALUES ( '005',
                               '003',
                               'Maestría',
                               'MAES',
                               '1' );
INSERT INTO elementos VALUES ( '005',
                               '004',
                               'Doctorado',
                               'DOCT',
                               '1' );
INSERT INTO elementos VALUES ( '005',
                               '005',
                               'Técnico',
                               'TEC',
                               '1' );

INSERT INTO elementos VALUES ( '006',
                               '001',
                               'Pendiente',
                               'PEND',
                               '1' );
INSERT INTO elementos VALUES ( '006',
                               '002',
                               'En Progreso',
                               'ENPRO',
                               '1' );
INSERT INTO elementos VALUES ( '006',
                               '003',
                               'Completada',
                               'COMP',
                               '1' );
INSERT INTO elementos VALUES ( '006',
                               '004',
                               'Cancelada',
                               'CAN',
                               '1' );

INSERT INTO elementos VALUES ( '007',
                               '001',
                               'Servicios',
                               'SERV',
                               '1' );
INSERT INTO elementos VALUES ( '007',
                               '002',
                               'Suministros',
                               'SUMI',
                               '1' );
INSERT INTO elementos VALUES ( '007',
                               '003',
                               'Obras',
                               'OBRA',
                               '1' );
INSERT INTO elementos VALUES ( '007',
                               '004',
                               'Consultoría',
                               'CONS',
                               '1' );

INSERT INTO elementos VALUES ( '008',
                               '001',
                               'Pendiente',
                               'PEND',
                               '1' );
INSERT INTO elementos VALUES ( '008',
                               '002',
                               'En Progreso',
                               'PROG',
                               '1' );
INSERT INTO elementos VALUES ( '008',
                               '003',
                               'Completada',
                               'COMP',
                               '1' );
INSERT INTO elementos VALUES ( '008',
                               '004',
                               'Cancelada',
                               'CANC',
                               '1' );

INSERT INTO elementos VALUES ( '009',
                               '001',
                               'RUC',
                               'RUC',
                               '1' );
INSERT INTO elementos VALUES ( '009',
                               '002',
                               'Licencia',
                               'LICE',
                               '1' );
INSERT INTO elementos VALUES ( '009',
                               '003',
                               'Certificación',
                               'CERT',
                               '1' );
INSERT INTO elementos VALUES ( '009',
                               '004',
                               'Seguro',
                               'SEGU',
                               '1' );
INSERT INTO elementos VALUES ( '009',
                               '005',
                               'Otro',
                               'OTRO',
                               '1' );

INSERT INTO elementos VALUES ( '010',
                               '001',
                               'PDF',
                               'PDF',
                               '1' );
INSERT INTO elementos VALUES ( '010',
                               '002',
                               'JPG',
                               'JPG',
                               '1' );
INSERT INTO elementos VALUES ( '010',
                               '003',
                               'PNG',
                               'PNG',
                               '1' );
INSERT INTO elementos VALUES ( '010',
                               '004',
                               'JPEG',
                               'JPEG',
                               '1' );

INSERT INTO elementos VALUES ( '011',
                               '001',
                               'Planificado',
                               'PLAN',
                               '1' );
INSERT INTO elementos VALUES ( '011',
                               '002',
                               'En Ejecución',
                               'EJEC',
                               '1' );
INSERT INTO elementos VALUES ( '011',
                               '003',
                               'Finalizado',
                               'FINA',
                               '1' );
INSERT INTO elementos VALUES ( '011',
                               '004',
                               'Cancelado',
                               'CANC',
                               '1' );

-- ==================================================================
-- DATOS BASE REQUERIDOS PARA datos-grupo06.sql
-- ==================================================================

-- Compañía base
INSERT INTO cia VALUES ( 1,
                         'Empresa Constructora S.A.',
                         'ECS',
                         '1' );

-- Personas base (para empleados y clientes)
INSERT INTO persona VALUES ( 1,
                             1,
                             'E',
                             'Juan Carlos Perez Lopez',
                             'J.Perez',
                             'Ing. Juan Perez',
                             'JPEREZ',
                             '1' );
INSERT INTO persona VALUES ( 1,
                             12,
                             'C',
                             'Electrocentro S.A.',
                             'ELECTROCENTRO',
                             'Electrocentro Peru',
                             'ELEC',
                             '1' );

-- Empleado base (jefe de proyecto)
INSERT INTO empleado VALUES ( 1,
                              1,
                              'Av. Principal 123, Lima',
                              '999888777',
                              'Lectura, Deportes',
                              NULL,
                              TO_DATE('15-03-1985','DD-MM-YYYY'),
                              '12345678',
                              'CIP12345',
                              TO_DATE('31-12-2030','DD-MM-YYYY'),
                              'A',
                              'S',
                              'Jefe de proyectos con experiencia',
                              1,
                              'jperez@empresa.com',
                              '1' );

-- Cliente base
INSERT INTO cliente VALUES ( 1,
                             12,
                             '20100123456',
                             '1' );

-- Proveedores base (personas + proveedores para COMP_PAGOCAB)
-- Proveedor 16: CONSTRUCTORA NORTE SAC
INSERT INTO persona VALUES ( 1,
                             16,
                             'P',
                             'Constructora Norte S.A.C.',
                             'CONST NORTE',
                             'Constructora Norte Peru',
                             'CNORTE',
                             '1' );
INSERT INTO proveedor VALUES ( 1,
                               16,
                               '20501234561',
                               '1' );

-- Proveedor 17: SERVICIOS ELECTRICOS DEL CENTRO SAC
INSERT INTO persona VALUES ( 1,
                             17,
                             'P',
                             'Servicios Electricos del Centro S.A.C.',
                             'SERV ELEC',
                             'Servicios Electricos Centro',
                             'SELEC',
                             '1' );
INSERT INTO proveedor VALUES ( 1,
                               17,
                               '20501234562',
                               '1' );

-- Proveedor 18: INGENIERIA Y PROYECTOS ASOCIADOS SAC
INSERT INTO persona VALUES ( 1,
                             18,
                             'P',
                             'Ingenieria y Proyectos Asociados S.A.C.',
                             'ING PROY',
                             'Ingenieria Proyectos Peru',
                             'IPROY',
                             '1' );
INSERT INTO proveedor VALUES ( 1,
                               18,
                               '20501234563',
                               '1' );

-- Área y cargo base (para empleado)
INSERT INTO areas VALUES ( 1,
                           1,
                           'Ingeniería',
                           'Área de proyectos de ingeniería',
                           'A' );
INSERT INTO cargos_areas VALUES ( 1,
                                  1,
                                  1,
                                  'Jefe de Proyecto' );

-- Proyectos base
INSERT INTO proyecto VALUES ( 1,
                              1,
                              'Proyecto Hidroeléctrico Central',
                              1,
                              1,
                              1,
                              1,
                              12,
                              'N',
                              'SNIP001',
                              TO_DATE('01-01-2023','DD-MM-YYYY'),
                              1,
                              1,
                              'F001',
                              1,
                              1,
                              0,
                              1,
                              TO_DATE('01-01-2023','DD-MM-YYYY'),
                              5000000.00,
                              4000000.00,
                              200000.00,
                              100000.00,
                              200000.00,
                              4500000.00,
                              810000.00,
                              5310000.00,
                              0.00,
                              '15',
                              '01',
                              '01',
                              TO_DATE('01-01-2023','DD-MM-YYYY'),
                              '/docs/proyecto1',
                              2023,
                              2025,
                              1,
                              NULL,
                              '011',
                              '002',
                              'Proyecto en ejecución',
                              '1' );

INSERT INTO proyecto VALUES ( 1,
                              2,
                              'Planta Energética Solar',
                              1,
                              1,
                              1,
                              1,
                              12,
                              'N',
                              'SNIP002',
                              TO_DATE('01-03-2023','DD-MM-YYYY'),
                              1,
                              1,
                              'F001',
                              1,
                              1,
                              0,
                              1,
                              TO_DATE('01-03-2023','DD-MM-YYYY'),
                              3000000.00,
                              2400000.00,
                              120000.00,
                              60000.00,
                              120000.00,
                              2700000.00,
                              486000.00,
                              3186000.00,
                              0.00,
                              '15',
                              '01',
                              '01',
                              TO_DATE('01-03-2023','DD-MM-YYYY'),
                              '/docs/proyecto2',
                              2023,
                              2025,
                              1,
                              NULL,
                              '011',
                              '002',
                              'Proyecto en ejecución',
                              '1' );

INSERT INTO proyecto VALUES ( 1,
                              3,
                              'Red Eléctrica Distribución',
                              1,
                              1,
                              1,
                              1,
                              12,
                              'N',
                              'SNIP003',
                              TO_DATE('01-06-2023','DD-MM-YYYY'),
                              1,
                              1,
                              'F001',
                              1,
                              1,
                              0,
                              1,
                              TO_DATE('01-06-2023','DD-MM-YYYY'),
                              2000000.00,
                              1600000.00,
                              80000.00,
                              40000.00,
                              80000.00,
                              1800000.00,
                              324000.00,
                              2124000.00,
                              0.00,
                              '15',
                              '01',
                              '01',
                              TO_DATE('01-06-2023','DD-MM-YYYY'),
                              '/docs/proyecto3',
                              2023,
                              2026,
                              1,
                              NULL,
                              '011',
                              '002',
                              'Proyecto en ejecución',
                              '1' );

-- Comprobante de pago empleado base (para COMP_PAGOEMPLEADO_DET)
INSERT INTO comp_pagoempleado VALUES ( 1,                                    -- CODCIA
                                       1,                                    -- CODEMPLEADO
                                       'CPE-001-2023-001',                   -- NROCP
                                       1,                                    -- CODPYTO
                                       1,                                    -- NROPAGO
                                       '003',                                -- TCOMPPAGO
                                       '001',                                -- ECOMPPAGO
                                       TO_DATE('15/01/2023','DD/MM/YYYY'),   -- FECCP
                                       '003',                                -- TMONEDA
                                       '001',                                -- EMONEDA
                                       1,                                    -- TIPCAMBIO
                                       15000,                                -- IMPMO
                                       15000,                                -- IMPNETOMN
                                       2700,                                 -- IMPIGVMN
                                       17700,                                -- IMPTOTALMN
                                       NULL,                                 -- FOTOCP
                                       NULL,                                 -- FOTOABONO
                                       TO_DATE('15/01/2023','DD/MM/YYYY'),   -- FECABONO
                                       'Pago a empleado CPE-001-2023-001',   -- DESABONO
                                       1,                                    -- SEMILLA
                                       '001',                                -- TABESTADO
                                       '001'                                 -- CODESTADO
                                        );

-- ==================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ==================================================================

CREATE INDEX idx_empleado_dni ON
  empleado (
    dni
  );
CREATE INDEX idx_empleado_email ON
  empleado (
    email
  );
CREATE INDEX idx_empleado_cargo ON
  empleado (
    codcargo
  );
CREATE INDEX idx_empleado_vigente ON
  empleado (
    vigente
  );

CREATE INDEX idx_proveedor_ruc ON
  proveedor (
    nroruc
  );
CREATE INDEX idx_proveedor_vigente ON
  proveedor (
    vigente
  );

CREATE INDEX idx_proyecto_jefe ON
  proyecto (
    empljefeproy
  );
CREATE INDEX idx_proyecto_cliente ON
  proyecto (
    codcliente
  );
CREATE INDEX idx_proyecto_vigente ON
  proyecto (
    vigente
  );
CREATE INDEX idx_proyecto_estado ON
  proyecto (
    estpyto
  );

CREATE INDEX idx_comp_pago_fecha ON
  comp_pagocab (
    feccp
  );
CREATE INDEX idx_comp_pago_estado ON
  comp_pagocab (
    codestado
  );
CREATE INDEX idx_comp_pago_proveedor ON
  comp_pagocab (
    codproveedor
  );

CREATE INDEX idx_comp_pagoemp_fecha ON
  comp_pagoempleado (
    feccp
  );
CREATE INDEX idx_comp_pagoemp_estado ON
  comp_pagoempleado (
    codestado
  );
CREATE INDEX idx_comp_pagoemp_empleado ON
  comp_pagoempleado (
    codempleado
  );

CREATE INDEX idx_persona_tipo ON
  persona (
    tippersona
  );
CREATE INDEX idx_persona_vigente ON
  persona (
    vigente
  );

-- Índices para tablas del sistema de comprobantes (grupo06)
CREATE INDEX idx_partida_codigo ON
  partida (
    codpartidas
  );
CREATE INDEX idx_partida_descripcion ON
  partida (
    despartida
  );
CREATE INDEX idx_partida_vigente ON
  partida (
    vigente
  );
CREATE INDEX idx_partida_ingegr ON
  partida (
    ingegr
  );

CREATE INDEX idx_vtacomp_fecha ON
  vtacomp_pagocab (
    feccp
  );
CREATE INDEX idx_vtacomp_estado ON
  vtacomp_pagocab (
    codestado
  );
CREATE INDEX idx_vtacomp_cliente ON
  vtacomp_pagocab (
    codcliente
  );
CREATE INDEX idx_vtacomp_proyecto ON
  vtacomp_pagocab (
    codpyto
  );

CREATE INDEX idx_comp_pagodet_partida ON
  comp_pagodet (
    codpartida
  );
CREATE INDEX idx_vtacomp_pagodet_partida ON
  vtacomp_pagodet (
    codpartida
  );
CREATE INDEX idx_comp_pagoempdet_partida ON
  comp_pagoempleado_det (
    codpartida
  );

-- ==================================================================
-- COMENTARIOS EN TABLAS
-- ==================================================================

COMMENT ON TABLE cia IS
  'Información de la empresa u organización principal';
COMMENT ON TABLE persona IS
  'Entidad base para personas físicas y jurídicas';
COMMENT ON TABLE empleado IS
  'Información completa del personal de la organización';
COMMENT ON TABLE proveedor IS
  'Información de proveedores externos';
COMMENT ON TABLE cliente IS
  'Información de clientes';
COMMENT ON TABLE proyecto IS
  'Gestión de proyectos de la organización con control financiero';
COMMENT ON TABLE comp_pagocab IS
  'Comprobantes de pago - información de cabecera';
COMMENT ON TABLE comp_pagoempleado IS
  'Comprobantes de pago de los empleados - información de cabecera';
COMMENT ON TABLE tabs IS
  'Catálogos de configuración del sistema';
COMMENT ON TABLE elementos IS
  'Elementos de los catálogos de configuración';
COMMENT ON TABLE usuarios IS
  'Usuarios del sistema con autenticación';
COMMENT ON TABLE areas IS
  'Áreas organizacionales de la empresa';
COMMENT ON TABLE cargos_areas IS
  'Cargos específicos por área organizacional';
COMMENT ON TABLE especialidades_personal IS
  'Especialidades técnicas del personal';
COMMENT ON TABLE grados_academicos IS
  'Formación académica del personal';
COMMENT ON TABLE experiencia_laboral IS
  'Historial laboral del personal';
COMMENT ON TABLE personal_proyectos IS
  'Asignación de empleados a proyectos';
COMMENT ON TABLE tareas_personal IS
  'Tareas específicas asignadas al personal';
COMMENT ON TABLE evaluaciones_desempeno IS
  'Evaluaciones de rendimiento del personal';
COMMENT ON TABLE servicios_proveedor IS
  'Catálogo de servicios ofrecidos por proveedores';
COMMENT ON TABLE contratos_proveedor IS
  'Contratos establecidos con proveedores';
COMMENT ON TABLE actividades_proveedor IS
  'Actividades realizadas por proveedores';
COMMENT ON TABLE documentos_proveedor IS
  'Documentación legal y técnica de proveedores';

-- Comentarios para tablas del sistema de comprobantes (grupo06)
COMMENT ON TABLE partida IS
  'Catálogo de partidas presupuestales del sistema (ingresos y egresos)';
COMMENT ON TABLE proy_partida IS
  'Partidas asignadas por proyecto';
COMMENT ON TABLE proy_partida_mezcla IS
  'Presupuesto de partidas por proyecto';
COMMENT ON TABLE comp_pagodet IS
  'Detalle de comprobantes de pago a proveedores';
COMMENT ON TABLE comp_pagoempleado_det IS
  'Detalle de comprobantes de pago a empleados';
COMMENT ON TABLE vtacomp_pagocab IS
  'Comprobantes de venta/ingresos a clientes - cabecera';
COMMENT ON TABLE vtacomp_pagodet IS
  'Detalle de comprobantes de venta/ingresos';

COMMIT;

-- ==================================================================
-- VERIFICACIÓN FINAL
-- ==================================================================

SELECT 'ESQUEMA CREADO EXITOSAMENTE' AS mensaje,
       COUNT(*) AS total_tablas
FROM user_tables
WHERE table_name IN ( 'CIA',
                      'PERSONA',
                      'EMPLEADO',
                      'PROVEEDOR',
                      'CLIENTE',
                      'PROYECTO',
                      'COMP_PAGOCAB',
                      'COMP_PAGOEMPLEADO',
                      'TABS',
                      'ELEMENTOS',
                      'USUARIOS',
                      'AREAS',
                      'CARGOS_AREAS',
                      'ESPECIALIDADES_PERSONAL',
                      'GRADOS_ACADEMICOS',
                      'EXPERIENCIA_LABORAL',
                      'PERSONAL_PROYECTOS',
                      'TAREAS_PERSONAL',
                      'EVALUACIONES_DESEMPENO',
                      'SERVICIOS_PROVEEDOR',
                      'CONTRATOS_PROVEEDOR',
                      'ACTIVIDADES_PROVEEDOR',
                      'DOCUMENTOS_PROVEEDOR',
                      'PARTIDA',
                      'PROY_PARTIDA',
                      'PROY_PARTIDA_MEZCLA',
                      'COMP_PAGODET',
                      'COMP_PAGOEMPLEADO_DET',
                      'VTACOMP_PAGOCAB',
                      'VTACOMP_PAGODET' );

SELECT 'SECUENCIAS CREADAS: ' || COUNT(*) AS secuencias
FROM user_sequences
WHERE sequence_name LIKE 'SEC_%';

SELECT 'PROCEDIMIENTOS CREADOS: ' || COUNT(*) AS procedimientos
FROM user_procedures
WHERE object_name LIKE 'INSERTAR_%';

SELECT 'FUNCIONES CREADAS: ' || COUNT(*) AS funciones
FROM user_objects
WHERE object_type = 'FUNCTION'
      AND object_name IN ( 'DURACION_PROYECTO',
                           'GET_PERSONA_TIPO' );
