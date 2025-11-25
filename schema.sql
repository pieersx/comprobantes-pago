
DROP TABLE IF EXISTS CIA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PROYECTO CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PERSONA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PROVEEDOR CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS CLIENTE CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PARTIDA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PARTIDA_MEZCLA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PROY_PARTIDA_MEZCLA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS PROY_PARTIDA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS ELEMENTOS CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS TABS CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS DPROY_PARTIDA_MEZCLA CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS COMP_PAGOCAB CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS COMP_PAGODET CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS VTACOMP_PAGOCAB CASCADE CONSTRAINTS;
DROP TABLE IF EXISTS VTACOMP_PAGODET CASCADE CONSTRAINTS;

--CIA: Empresas/Compañías del sistema
CREATE TABLE CIA(

                CodCIA NUMBER(6) NOT NULL,

                DesCia VARCHAR2(100) NOT NULL,

                DesCorta VARCHAR2(20) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT CIA_PK PRIMARY KEY (CodCIA)

);

--PROYECTO: Proyectos con toda su información técnica y financiera
CREATE TABLE PROYECTO (

                CodCIA NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                NombPyto VARCHAR2(1000) NOT NULL,

                EmplJefeProy NUMBER(6) NOT NULL,

                CodCia1 NUMBER(6) NOT NULL,

                CiaContrata NUMBER(6) NOT NULL,

                CodCC NUMBER(6) NOT NULL,

                CodCliente NUMBER(6) NOT NULL,

                FlgEmpConsorcio VARCHAR2(1) NOT NULL,

                CodSNIP VARCHAR2(10) NOT NULL,

                FecReg DATE NOT NULL,

                CodFase NUMBER(1) NOT NULL,

                CodNivel NUMBER(2) NOT NULL,

                CodFuncion VARCHAR2(4) NOT NULL,

                CodSituacion NUMBER(2) NOT NULL,

                NumInfor NUMBER(1) NOT NULL,

                NumInforEntrg NUMBER(1) NOT NULL,

                EstPyto NUMBER(2) NOT NULL,

                FecEstado DATE NOT NULL,

                ValRefer NUMBER(12,2) NOT NULL,

                CostoDirecto NUMBER(12,2) NOT NULL,

                CostoGGen NUMBER(12,2) NOT NULL,

                CostoFinan NUMBER(12,2) NOT NULL,

                ImpUtilidad NUMBER(12,2) NOT NULL,

                CostoTotSinIGV NUMBER(12,2) NOT NULL,

                ImpIGV NUMBER(12,2) NOT NULL,

                CostoTotal NUMBER(12,2) NOT NULL,

                CostoPenalid NUMBER(12,2) NOT NULL,

                CodDpto VARCHAR2(2) NOT NULL,

                CodProv VARCHAR2(2) NOT NULL,

                CodDist VARCHAR2(2) NOT NULL,

                FecViab DATE NOT NULL,

                RutaDoc VARCHAR2(300) NOT NULL,

                AnnoIni NUMBER(4) NOT NULL,

                AnnoFin NUMBER(4) NOT NULL,

                CodObjC NUMBER(2) NOT NULL,

                LogoProy BLOB ,										 TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                Observac VARCHAR2(500) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT PROYECTO_PK PRIMARY KEY (CodCIA, CodPyto)

);

---PERSONA: Base única para clientes, proveedores, empleados y empresas
CREATE TABLE PERSONA (

                CodCIA NUMBER(6) NOT NULL,

                CodPersona NUMBER(6) NOT NULL,

                TipPersona VARCHAR2(1) NOT NULL,

                DesPersona VARCHAR2(100) NOT NULL,

                DesCorta VARCHAR2(30) NOT NULL,

                DescAlterna VARCHAR2(100) NOT NULL,

                DesCortaAlt VARCHAR2(10) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT CIA_PERSONA_PK PRIMARY KEY (CodCIA, CodPersona)

);

--FACTURA EGRESO
CREATE TABLE PROVEEDOR (

                CodCia NUMBER(6) NOT NULL,

                CodProveedor NUMBER(6) NOT NULL,

                NroRuc VARCHAR2(20) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT PROVEEDOR_PK PRIMARY KEY (CodCia, CodProveedor)

);

--FACTURA INGRESO
CREATE TABLE CLIENTE (

                CodCia NUMBER(6) NOT NULL,

                CodCliente NUMBER(6) NOT NULL,

                NroRuc VARCHAR2(20) NOT NULL,

Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT CLIENTE_PK PRIMARY KEY (CodCia, CodCliente)

);


--PARTIDA: Es la tabla maestra de todas las partidas presupuestales o contables.
--Cada partida representa un concepto de ingreso (I) o egreso (E), como materiales, mano de obra, servicios, etc.
CREATE TABLE PARTIDA(

                CodCia NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                CodPartidas VARCHAR2(12) NOT NULL,

                DesPartida VARCHAR2(30) NOT NULL,

                FlgCC VARCHAR2(1) NOT NULL,

                Nivel NUMBER(2) NOT NULL,

                TUniMed VARCHAR2(3) NOT NULL,

                EUniMed VARCHAR2(3) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT PARTIDA_PK PRIMARY KEY (CodCia,IngEgr,CodPartida)

);

--PARTIDA_MEZCLA
--Define la estructura o composición de una partida: es decir, qué subpartidas o elementos la conforman.
--Por ejemplo, una partida “Construcción” puede estar compuesta por “Cemento”, “Arena” y “Mano de obra”.
CREATE TABLE PARTIDA_MEZCLA(

                CodCia NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                Corr NUMBER(6) NOT NULL,

                PadCodPartida NUMBER(6) NOT NULL,

                TUniMed VARCHAR2(3) NOT NULL,

                EUniMed VARCHAR2(3) NOT NULL,

                CostoUnit NUMBER(9,2) NOT NULL,

                Nivel NUMBER(5) NOT NULL,

                Orden NUMBER(5) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT PARTIDA_MEZCLA_PK PRIMARY KEY (CodCia,IngEgr,CodPartida,Corr)

);



--PROY_PARTIDA_MEZCLA
--Relaciona una partida del catálogo con un proyecto específico.
--Aquí se definen las partidas que se usarán para el presupuesto de un proyecto, su estado y versión.
CREATE TABLE PROY_PARTIDA_MEZCLA(

                CodCia NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                NroVersion NUMBER(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                Corr NUMBER(6) NOT NULL,

                PadCodPartida NUMBER(6) NOT NULL, --Cambio de VARCHAR A NUMBER(6)

                TUniMed VARCHAR2(3) NOT NULL,

                EUniMed VARCHAR2(3) NOT NULL,

                Nivel NUMBER(5) NOT NULL,

                Orden NUMBER(5) NOT NULL,

                CostoUnit NUMBER(9,2) NOT NULL,

                Cant NUMBER(7,3) NOT NULL,

                CostoTot NUMBER(10,2) NOT NULL,

                CONSTRAINT PROY_PARTIDA_MEZCLA_PK PRIMARY KEY (CodCia,CodPyto,NroVersion,

                IngEgr,CodPartida,Corr)

);


--Define la mezcla de partidas dentro de un proyecto específico,
--es decir, la aplicación práctica de la mezcla (PARTIDA_MEZCLA) a un proyecto determinado.
CREATE TABLE PROY_PARTIDA(

                CodCia NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                NroVersion NUMBER(1) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                CodPartidas VARCHAR2(12) NOT NULL,

                FlgCC VARCHAR2(1) NOT NULL,

                Nivel NUMBER(2) NOT NULL,

                UniMed VARCHAR2(5) NOT NULL,

                TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT PROY_PARTIDA_PK PRIMARY KEY (CodCia,CodPyto,NroVersion,IngEgr,CodPartida)

);

CREATE TABLE ELEMENTOS (

                CodTab VARCHAR2(3) NOT NULL,

                CodElem VARCHAR2(3) NOT NULL,

                DenEle VARCHAR2(50) NOT NULL,

                DenCorta VARCHAR2(10) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT ELEMENTOS_PK PRIMARY KEY (CodTab, CodElem)

);



CREATE TABLE TABS (

                CodTab VARCHAR2(3) NOT NULL,

                DenTab VARCHAR2(50) NOT NULL,

                DenCorta VARCHAR2(10) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT TABS_PK PRIMARY KEY (CodTab)

);

--DETALES DE PARTIDA MEZCLA
CREATE TABLE DPROY_PARTIDA_MEZCLA (

                CodCia NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                NroVersion NUMBER(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                Corr NUMBER(6) NOT NULL,

                Sec NUMBER(4) NOT NULL,

                TDesembolso VARCHAR2(3) NOT NULL,

                EDesembolso VARCHAR2(3) NOT NULL,

                NroPago NUMBER(2) NOT NULL,

                TCompPago VARCHAR2(3) NOT NULL,

                ECompPago VARCHAR2(3) NOT NULL,

                FecDesembolso DATE NOT NULL,

                ImpDesembNeto NUMBER(9,2) NOT NULL,

                ImpDesembIGV NUMBER(8,2) NOT NULL,

                ImpDesembTot NUMBER(9,2) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                CONSTRAINT DPROY_PARTIDA_MEZCLA_PK PRIMARY KEY (CodCia,CodPyto,IngEgr,NroVersion,CodPartida,Corr,Sec)

);


--La tabla COMP_PAGOCAB registra la información principal (cabecera) de los
--comprobantes de pago emitidos por la empresa hacia los proveedores.
CREATE TABLE COMP_PAGOCAB (

                CodCIA NUMBER(6) NOT NULL,

                CodProveedor NUMBER(6) NOT NULL,

                NroCP VARCHAR2(20) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                NroPago NUMBER(3) NOT NULL,

                TCompPago VARCHAR2(3) NOT NULL,

                ECompPago VARCHAR2(3) NOT NULL,

                FecCP DATE NOT NULL,

                TMoneda VARCHAR2(3) NOT NULL,

                EMoneda VARCHAR2(3) NOT NULL,

                TipCambio NUMBER(7,4) NOT NULL,

                ImpMO NUMBER(9,2) NOT NULL,

                ImpNetoMN NUMBER(9,2) NOT NULL,

                ImpIGVMN NUMBER(9,2) NOT NULL,

                ImpTotalMn NUMBER(10,2) NOT NULL,

                FotoCP VARCHAR2(200) NOT NULL,

                FotoAbono VARCHAR2(200) NOT NULL,

                FecAbono DATE NOT NULL,

                DesAbono VARCHAR2(1000) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                CONSTRAINT COMP_PAGOCAB_PK PRIMARY KEY (CodCIA,CodProveedor,NroCP)

);


--Detalle de comprobantes de pago.
CREATE TABLE COMP_PAGODET (

                CodCIA NUMBER(6) NOT NULL,

                CodProveedor NUMBER(6) NOT NULL,

                NroCP VARCHAR2(20) NOT NULL,

                Sec NUMBER(4) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                ImpNetoMN NUMBER(9,2) NOT NULL,

                ImpIGVMN NUMBER(9,2) NOT NULL,

                ImpTotalMn NUMBER(9,2) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                CONSTRAINT COMP_PAGODET_PK PRIMARY KEY (CodCIA,CodProveedor,NroCP,Sec)

);


--Función: Cabecera de comprobantes de venta a clientes.
CREATE TABLE VTACOMP_PAGOCAB (

                CodCIA NUMBER(6) NOT NULL,

                NroCP VARCHAR2(20) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                CodCliente NUMBER(6) NOT NULL,

                NroPago NUMBER(3) NOT NULL,

                TCompPago VARCHAR2(3) NOT NULL,

                ECompPago VARCHAR2(3) NOT NULL,

                FecCP DATE NOT NULL,

                TMoneda VARCHAR2(3) NOT NULL,

                EMoneda VARCHAR2(3) NOT NULL,

                TipCambio NUMBER(7,4) NOT NULL,

                ImpMO NUMBER(9,2) NOT NULL,

                ImpNetoMN NUMBER(9,2) NOT NULL,

                ImpIGVMN NUMBER(9,2) NOT NULL,

                ImpTotalMN NUMBER(10,2) NOT NULL,

                FotoCP VARCHAR2(200) NOT NULL,

                FotoAbono VARCHAR2(200) NOT NULL,

                FecAbono DATE NOT NULL,

                DesAbono VARCHAR2(1000) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                CONSTRAINT VTACOMP_PAGOCAB_PK PRIMARY KEY (CodCIA,NroCP)

);


--Función: Detalle de las ventas.
CREATE TABLE VTACOMP_PAGODET (

                CodCIA NUMBER(6) NOT NULL,

                NroCP VARCHAR2(20) NOT NULL,

                Sec NUMBER(4) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                ImpNetoMN NUMBER(9,2) NOT NULL,

                ImpIGVMN NUMBER(9,2) NOT NULL,

                ImpTotalMn NUMBER(9,2) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                CONSTRAINT VTACOMP_PAGODET_PK PRIMARY KEY (CodCIA,NroCP,Sec)

);


ALTER TABLE PERSONA ADD CONSTRAINT PERSONA_EMPRESA_VTA_FK

FOREIGN KEY (CodCIA)

REFERENCES CIA (CodCIA);



/*==============================================================*/

/* PROVEEDOR                                                    */

/*==============================================================*/



ALTER TABLE PROVEEDOR ADD CONSTRAINT PERSONA_PROVEEDOR_FK

FOREIGN KEY (CodCia,CodProveedor)

REFERENCES PERSONA (CodCia,CodPersona);



/*==============================================================*/

/* CLIENTE                                                      */

/*==============================================================*/



ALTER TABLE CLIENTE ADD CONSTRAINT PERSONA_CLIENTE_FK

FOREIGN KEY (CodCia,CodCliente)

REFERENCES PERSONA (CodCia,CodPersona);


/*==============================================================*/

/* PROYECTO                                                     */

/*==============================================================*/



ALTER TABLE PROYECTO ADD CONSTRAINT CIA_PROYECTO_FK

FOREIGN KEY (CodCIA)

REFERENCES CIA (CodCIA);


ALTER TABLE PROYECTO ADD CONSTRAINT CLIENTE_PROYECTO_FK

FOREIGN KEY (CodCIA, CodCliente)

REFERENCES CLIENTE (CodCIA, CodCliente);


/*==============================================================*/

/* PARTIDA                                                      */

/*==============================================================*/

ALTER TABLE PARTIDA ADD CONSTRAINT CIA_PARTIDAFK

FOREIGN KEY (CodCia)

REFERENCES CIA (CodCia);

/*==============================================================*/

/* PROY_PARTIDA                                                 */

/*==============================================================*/

ALTER TABLE PROY_PARTIDA ADD CONSTRAINT PROYECTO_PROY_PARTIDA_FK

FOREIGN KEY (CodCia,CodPyto)

REFERENCES PROYECTO(CodCia,CODPYTO);



ALTER TABLE PROY_PARTIDA ADD CONSTRAINT PARTIDA_PROY_PARTIDA_FK

FOREIGN KEY (CodCia,IngEgr,CodPartida)

REFERENCES PARTIDA (CodCia,IngEgr,CodPartida);



/*ALTER TABLE PROY_PARTIDA ADD CONSTRAINT ESTADO_PROY_PARTIDA_FK

FOREIGN KEY (TabEstado,CodEstado)

REFERENCES ESTADO (TabEstado,CodEstado);*/



/*==============================================================*/

/* PARTIDA_MEZCLA                                               */

/*==============================================================*/

ALTER TABLE PARTIDA_MEZCLA ADD CONSTRAINT PARTIDA_PARTIDA_MEZCLA_FK

FOREIGN KEY (CodCia,IngEgr,CodPartida)

REFERENCES PARTIDA (CodCia,IngEgr,CodPartida);



ALTER TABLE PARTIDA_MEZCLA ADD CONSTRAINT ELEMENTOS_PARTIDA_MEZCLA_FK

FOREIGN KEY (TUniMed,EUniMed)

REFERENCES ELEMENTOS (CodTab,CodElem);



/*==============================================================*/

/* PROY_PARTIDA_MEZCLA                                          */

/*==============================================================*/



ALTER TABLE PROY_PARTIDA_MEZCLA ADD CONSTRAINT PROY_PARTIDA_PROY_PARTIDA_MEZCLA_FK

FOREIGN KEY (CodCia,CodPyto,NroVersion,IngEgr,CodPartida)

REFERENCES PROY_PARTIDA (CodCia,CodPyto,NroVersion,IngEgr,CodPartida);



ALTER TABLE PROY_PARTIDA_MEZCLA ADD CONSTRAINT ELEMENTOS_PROY_PARTIDA_MEZCLA_FK

FOREIGN KEY (TUniMed,EUniMed)

REFERENCES ELEMENTOS (CodTab,CodElem);



/*==============================================================*/

/* DPROY_PARTIDA_MEZCLA                                          */

/*==============================================================*/

ALTER TABLE DPROY_PARTIDA_MEZCLA ADD CONSTRAINT PROY_PARTIDA_MEZCLA_DPROY_PARTIDA_MEZCLA_FK

FOREIGN KEY (CodCia, CodPyto, IngEgr, NroVersion, CodPartida, Corr)

REFERENCES PROY_PARTIDA_MEZCLA (CodCia, CodPyto, IngEgr, NroVersion, CodPartida, Corr);



ALTER TABLE DPROY_PARTIDA_MEZCLA ADD CONSTRAINT ELEMENTOS_DPROY_PARTIDA_MEZCLA_Desembolso_FK

FOREIGN KEY (TDesembolso, EDesembolso)

REFERENCES ELEMENTOS (CodTab,CodElem);



ALTER TABLE DPROY_PARTIDA_MEZCLA ADD CONSTRAINT ELEMENTOS_DPROY_PARTIDA_MEZCLA_Comprobante_FK

FOREIGN KEY (TCompPago, ECompPago)

REFERENCES ELEMENTOS (CodTab,CodElem);

/*==============================================================*/

/* ELEMENTOS                                                    */

/*==============================================================*/



ALTER TABLE ELEMENTOS ADD CONSTRAINT ELEMENTOS_TABS_FK

FOREIGN KEY (CodTab)

REFERENCES TABS (CodTab);



/*==============================================================*/

/* COMP_PAGOCAB                                                 */

/*==============================================================*/



ALTER TABLE COMP_PAGOCAB ADD CONSTRAINT COMP_PAGOCAB_PROVEEDOR_FK

FOREIGN KEY (CodCIA,CodProveedor)

REFERENCES PROVEEDOR (CodCIA,CodProveedor);



ALTER TABLE COMP_PAGOCAB ADD CONSTRAINT COMP_PAGOCAB_ELEMENTOS_FK

FOREIGN KEY (TMoneda,EMoneda)

REFERENCES ELEMENTOS (CodTab,CodElem);



ALTER TABLE COMP_PAGOCAB ADD CONSTRAINT COMP_PAGOCAB_ELEMENTOS_2_FK

FOREIGN KEY (TCompPago,ECompPago)

REFERENCES ELEMENTOS (CodTab,CodElem);



ALTER TABLE COMP_PAGOCAB ADD CONSTRAINT COMP_PAGOCAB_PROYECTO_FK

FOREIGN KEY (CodCIA,CodPyto)

REFERENCES PROYECTO (CodCIA,CodPyto);



/*==============================================================*/

/* COMP_PAGODET                                                 */

/*==============================================================*/



ALTER TABLE COMP_PAGODET ADD CONSTRAINT COMP_PAGODET_COMP_PAGOCAB_FK

FOREIGN KEY (CodCIA,CodProveedor,NroCP)

REFERENCES COMP_PAGOCAB (CodCIA,CodProveedor,NroCP);



ALTER TABLE COMP_PAGODET ADD CONSTRAINT COMP_PAGODET_PARTIDA_FK

FOREIGN KEY (CodCIA,IngEgr,CodPartida)

REFERENCES PARTIDA (CodCIA,IngEgr,CodPartida);



/*==============================================================*/

/* VTACOMP_PAGOCAB                                              */

/*==============================================================*/



ALTER TABLE VTACOMP_PAGOCAB ADD CONSTRAINT VTACOMP_PAGOCAB_CLIENTE_FK

FOREIGN KEY (CodCIA,CodCliente)

REFERENCES CLIENTE (CodCIA,CodCliente);



ALTER TABLE VTACOMP_PAGOCAB ADD CONSTRAINT VTACOMP_PAGOCAB_ELEMENTOS_FK

FOREIGN KEY (TMoneda,EMoneda)

REFERENCES ELEMENTOS (CodTab,CodElem);



ALTER TABLE VTACOMP_PAGOCAB ADD CONSTRAINT VTACOMP_PAGOCAB_ELEMENTOS_2_FK

FOREIGN KEY (TCompPago,ECompPago)

REFERENCES ELEMENTOS (CodTab,CodElem);



ALTER TABLE VTACOMP_PAGOCAB ADD CONSTRAINT VTACOMP_PAGOCAB_PROYECTO_FK

FOREIGN KEY (CodCIA,CodPyto)

REFERENCES PROYECTO (CodCIA,CodPyto);



/*==============================================================*/

/* VTACOMP_PAGODET                                              */

/*==============================================================*/



ALTER TABLE VTACOMP_PAGODET ADD CONSTRAINT VTACOMP_PAGODET_VTACOMP_PAGOCAB_FK

FOREIGN KEY (CodCIA,NroCP)

REFERENCES VTACOMP_PAGOCAB (CodCIA,NroCP);



ALTER TABLE VTACOMP_PAGODET ADD CONSTRAINT VTACOMP_PAGODET_PARTIDA_FK

FOREIGN KEY (CodCIA,IngEgr,CodPartida)

REFERENCES PARTIDA (CodCIA,IngEgr,CodPartida);



/*==============================================================*/

/* SECUENCIAS                                                   */

/*==============================================================*/

-- Eliminar sequences si existen
DROP SEQUENCE SEC_CIA;
DROP SEQUENCE SEC_PERSONA;
DROP SEQUENCE SEC_PROYECTO;
DROP SEQUENCE SEC_TABS;
DROP SEQUENCE SEC_PARTIDA_E;
DROP SEQUENCE SEC_PARTIDA_I;
DROP SEQUENCE SEC_CODPARTIDAS;
DROP SEQUENCE SEC_PARTIDA_MEZCLA_E;
DROP SEQUENCE SEC_PARTIDA_MEZCLA_I;
DROP SEQUENCE SEC_PROY_PARTIDA_MEZCLA_E;
DROP SEQUENCE SEC_PROY_PARTIDA_MEZCLA_I;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_E;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_I;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_PAGO;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_ADELANTO;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_SEMILLA_I;
DROP SEQUENCE SEC_DPROY_PARTIDA_MEZCLA_SEMILLA_E;
DROP SEQUENCE SEC_NRO_PAGO_VTA;

create sequence SEC_CIA

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PERSONA

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PROYECTO

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_TABS

  start with 5

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PARTIDA_E

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PARTIDA_I

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_CODPARTIDAS

  start with 10000000

  increment by 1

  maxvalue 99999999

  minvalue 10000000;



create sequence SEC_PARTIDA_MEZCLA_E

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PARTIDA_MEZCLA_I

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PROY_PARTIDA_MEZCLA_E

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_PROY_PARTIDA_MEZCLA_I

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_E

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_I

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_PAGO

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_ADELANTO

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_SEMILLA_I

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;



create sequence SEC_DPROY_PARTIDA_MEZCLA_SEMILLA_E

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;




create sequence SEC_NRO_PAGO_VTA

  start with 1

  increment by 1

  maxvalue 99999

  minvalue 1;

-- 1. TABLA CIA (Empresas base)
INSERT INTO CIA (CodCIA, DesCia, DesCorta, Vigente) VALUES (1, 'CONSTRUCTORA ANDINA S.A.', 'CONSANDINA', 'S');
INSERT INTO CIA (CodCIA, DesCia, DesCorta, Vigente) VALUES (2, 'INGENIERIA CIVIL MODERNA', 'INGCIVMOD', 'S');
INSERT INTO CIA (CodCIA, DesCia, DesCorta, Vigente) VALUES (3, 'PROYECTOS INTEGRALES SAC', 'PROYINTEG', 'S');
INSERT INTO CIA (CodCIA, DesCia, DesCorta, Vigente) VALUES (4, 'EDIFICACIONES URBANAS', 'EDIFURB', 'S');
INSERT INTO CIA (CodCIA, DesCia, DesCorta, Vigente) VALUES (5, 'CONSTRUCCIONES RAPIDAS', 'CONSRAP', 'S');

-- 2. TABLA PERSONA (Base de personas)
INSERT INTO PERSONA VALUES (1, 1001, 'E', 'JUAN CARLOS PEREZ GARCIA', 'JCPEREZ', 'JUAN PEREZ', 'JP', 'S');
INSERT INTO PERSONA VALUES (1, 1002, 'E', 'MARIA ELENA RODRIGUEZ', 'MERODRIG', 'MARIA RODRIGUEZ', 'MR', 'S');
INSERT INTO PERSONA VALUES (1, 5001, 'C', 'EMPRESA ELECTRICA SUR', 'EESUR', 'ELECTRICA SUR', 'ES', 'S');
INSERT INTO PERSONA VALUES (1, 5002, 'C', 'MINISTERIO ENERGIA', 'MINENERG', 'MIN ENERGIA', 'ME', 'S');
INSERT INTO PERSONA VALUES (1, 7001, 'P', 'CEMENTOS ANDINOS SA', 'CEMAND', 'CEMENTOS AND', 'CA', 'S');
INSERT INTO PERSONA VALUES (1, 5003, 'C', 'EMPRESA CONSTRUCCIONES NORTE', 'ECNORTE', 'CONSTRUCCION NORTE', 'CN', 'S');
INSERT INTO PERSONA VALUES (1, 5004, 'C', 'DISTRIBUIDORA ELECTRICA', 'DISELEC', 'DISTRIB ELECT', 'DE', 'S');
INSERT INTO PERSONA VALUES (1, 5005, 'C', 'INGENIERIA Y PROYECTOS SAC', 'INGPROY', 'ING PROYECTOS', 'IP', 'S');
INSERT INTO PERSONA VALUES (1, 7002, 'P', 'ACEROS NACIONALES SA', 'ACERNAC', 'ACEROS NAC', 'AN', 'S');
INSERT INTO PERSONA VALUES (1, 7003, 'P', 'EQUIPOS INDUSTRIALES', 'EQINDUS', 'EQUIPOS IND', 'EI', 'S');
INSERT INTO PERSONA VALUES (1, 7004, 'P', 'MATERIALES CONSTRUCCION', 'MATCONS', 'MAT CONSTRUC', 'MC', 'S');
INSERT INTO PERSONA VALUES (1, 7005, 'P', 'SERVICIOS TECNICOS INTEGRALES', 'SERTECIN', 'SERV TECNIC', 'ST', 'S');

-- 3. TABLA CLIENTE
INSERT INTO CLIENTE VALUES (1, 5001, '20100012345', 'S');
INSERT INTO CLIENTE VALUES (1, 5002, '20100054321', 'S');
INSERT INTO CLIENTE VALUES (1, 5003, '20100067890', 'S');
INSERT INTO CLIENTE VALUES (1, 5004, '20100009876', 'S');
INSERT INTO CLIENTE VALUES (1, 5005, '20100011223', 'S');

-- 4. TABLA PROVEEDOR
INSERT INTO PROVEEDOR VALUES (1, 7001, '20131312955', 'S');
INSERT INTO PROVEEDOR VALUES (1, 7002, '20456789012', 'S');
INSERT INTO PROVEEDOR VALUES (1, 7003, '20567890123', 'S');
INSERT INTO PROVEEDOR VALUES (1, 7004, '20678901234', 'S');
INSERT INTO PROVEEDOR VALUES (1, 7005, '20789012345', 'S');

-- 5. TABLA TABS (Catálogos maestros)
INSERT INTO TABS VALUES ('001', 'TIPOS DE MONEDA', 'MONEDA', 'S');
INSERT INTO TABS VALUES ('002', 'UNIDADES DE MEDIDA', 'UNIMED', 'S');
INSERT INTO TABS VALUES ('003', 'TIPOS DE COMPROBANTE', 'COMPROB', 'S');
INSERT INTO TABS VALUES ('004', 'ESTADOS', 'ESTADO', 'S');
INSERT INTO TABS VALUES ('005', 'DESEMBOLSOS', 'DESEMB', 'S');

-- 6. TABLA ELEMENTOS (Valores de catálogos)
INSERT INTO ELEMENTOS VALUES ('001', 'PEN', 'SOLES PERUANOS', 'SOL', 'S');
INSERT INTO ELEMENTOS VALUES ('001', 'USD', 'DOLARES AMERICANOS', 'DOL', 'S');
INSERT INTO ELEMENTOS VALUES ('002', 'UND', 'UNIDADES', 'UND', 'S');
INSERT INTO ELEMENTOS VALUES ('002', 'MTS', 'METROS', 'MTS', 'S');
INSERT INTO ELEMENTOS VALUES ('003', 'FAC', 'FACTURA', 'FACT', 'S');
INSERT INTO ELEMENTOS VALUES ('003', 'BOL', 'BOLETA', 'BOL', 'S');
INSERT INTO ELEMENTOS VALUES ('003', 'REC', 'RECIBO POR HONORARIOS', 'REC', 'S');
INSERT INTO ELEMENTOS VALUES ('004', 'ACT', 'ACTIVO', 'ACT', 'S');
INSERT INTO ELEMENTOS VALUES ('004', 'INA', 'INACTIVO', 'INA', 'S');
INSERT INTO ELEMENTOS VALUES ('004', 'REG', 'REGISTRADO', 'REG', 'S');
INSERT INTO ELEMENTOS VALUES ('004', 'PAG', 'PAGADO', 'PAG', 'S');
INSERT INTO ELEMENTOS VALUES ('004', 'ANU', 'ANULADO', 'ANU', 'S');
INSERT INTO ELEMENTOS VALUES ('005', 'NOR', 'NORMAL', 'NOR', 'S');
INSERT INTO ELEMENTOS VALUES ('005', 'ESP', 'ESPECIAL', 'ESP', 'S');

-- ============================================================================
-- 7. TABLA PARTIDA - ESTRUCTURA JERÁRQUICA CON 3 NIVELES
-- ============================================================================
-- Según especificaciones del profesor:
-- - INGRESOS: Nivel 1 (padre) -> Nivel 2 (categorías) -> Nivel 3 (detalles)
-- - EGRESOS: Nivel 1 (padre) -> Nivel 2 (categorías) -> Nivel 3 (detalles)
-- - USAR SIEMPRE EL ÚLTIMO NIVEL (Nivel 3) en los comprobantes de pago
-- ============================================================================

-- ============================================================================
-- PARTIDAS DE INGRESO (I) - ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- NIVEL 1: INGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1000, 'ING-000', 'INGRESOS', 'N', 1, '002', 'UND', 1000, 'S');

-- NIVEL 2: INGRESOS POR VENTA (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1100, 'ING-100', 'INGRESOS POR VENTA', 'N', 2, '002', 'UND', 1100, 'S');

-- NIVEL 3: Detalles de INGRESOS POR VENTA (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1101, 'ING-101', 'VENTA DE ENERGIA', 'N', 3, '002', 'UND', 1101, 'S');
INSERT INTO PARTIDA VALUES (1, 'I', 1102, 'ING-102', 'SERVICIOS TECNICOS', 'N', 3, '002', 'UND', 1102, 'S');
INSERT INTO PARTIDA VALUES (1, 'I', 1103, 'ING-103', 'CONSULTORIA', 'N', 3, '002', 'UND', 1103, 'S');

-- NIVEL 2: INGRESOS POR PRESTAMOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1200, 'ING-200', 'INGRESOS POR PRESTAMOS', 'N', 2, '002', 'UND', 1200, 'S');

-- NIVEL 3: Detalles de INGRESOS POR PRESTAMOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1201, 'ING-201', 'PRESTAMOS BANCARIOS', 'N', 3, '002', 'UND', 1201, 'S');
INSERT INTO PARTIDA VALUES (1, 'I', 1202, 'ING-202', 'PRESTAMOS PRIVADOS', 'N', 3, '002', 'UND', 1202, 'S');

-- NIVEL 2: OTROS INGRESOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1300, 'ING-300', 'OTROS INGRESOS', 'N', 2, '002', 'UND', 1300, 'S');

-- NIVEL 3: Detalles de OTROS INGRESOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1301, 'ING-301', 'INTERESES GANADOS', 'N', 3, '002', 'UND', 1301, 'S');
INSERT INTO PARTIDA VALUES (1, 'I', 1302, 'ING-302', 'ALQUILERES', 'N', 3, '002', 'UND', 1302, 'S');

-- ============================================================================
-- PARTIDAS DE EGRESO (E) - ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- NIVEL 1: EGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2000, 'EGR-000', 'EGRESOS', 'N', 1, '002', 'UND', 2000, 'S');

-- NIVEL 2: COSTOS DIRECTOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2100, 'EGR-100', 'COSTOS DIRECTOS', 'N', 2, '002', 'UND', 2100, 'S');

-- NIVEL 3: Detalles de COSTOS DIRECTOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2101, 'EGR-101', 'MATERIALES DE CONSTRUCCION', 'N', 3, '002', 'UND', 2101, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2102, 'EGR-102', 'MANO DE OBRA', 'N', 3, '002', 'UND', 2102, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2103, 'EGR-103', 'EQUIPOS Y MAQUINARIA', 'N', 3, '002', 'UND', 2103, 'S');

-- NIVEL 2: GASTOS ADMINISTRATIVOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2200, 'EGR-200', 'GASTOS ADMINISTRATIVOS', 'N', 2, '002', 'UND', 2200, 'S');

-- NIVEL 3: Detalles de GASTOS ADMINISTRATIVOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2201, 'EGR-201', 'SUELDOS ADMINISTRATIVOS', 'N', 3, '002', 'UND', 2201, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2202, 'EGR-202', 'SERVICIOS PROFESIONALES', 'N', 3, '002', 'UND', 2202, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2203, 'EGR-203', 'ALQUILER DE OFICINA', 'N', 3, '002', 'UND', 2203, 'S');

-- NIVEL 2: SERVICIOS TECNICOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2300, 'EGR-300', 'SERVICIOS TECNICOS', 'N', 2, '002', 'UND', 2300, 'S');

-- NIVEL 3: Detalles de SERVICIOS TECNICOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2301, 'EGR-301', 'INGENIERIA ELECTRICA', 'N', 3, '002', 'UND', 2301, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2302, 'EGR-302', 'INGENIERIA CIVIL', 'N', 3, '002', 'UND', 2302, 'S');
INSERT INTO PARTIDA VALUES (1, 'E', 2303, 'EGR-303', 'SUPERVISION DE OBRA', 'N', 3, '002', 'UND', 2303, 'S');

-- 8. TABLA PROYECTO (Proyectos principales)
INSERT INTO PROYECTO VALUES (
  1, 101, 'PROYECTO HIDROELÉCTRICO ANDINO', 1001, 1, 1, 1, 5001, 'N', 'SNIP001',
  DATE '2023-01-15', 1, 1, 'F001', 1, 1, 1, 1, DATE '2023-01-20',
  1000000, 500000, 100000, 50000, 350000, 1000000, 180000, 1180000, 0,
  '15', '01', '01', DATE '2023-02-01', 'SIN_DOCUMENTO', 2023, 2025, 1, NULL, '001', '001', 'PROYECTO EN EJECUCION', 'S'
);

INSERT INTO PROYECTO VALUES (
  1, 102, 'CONSTRUCCION PLANTA ENERGETICA', 1002, 1, 1, 2, 5002, 'N', 'SNIP002',
  DATE '2023-03-10', 1, 1, 'F002', 1, 1, 1, 1, DATE '2023-03-15',
  800000, 400000, 80000, 40000, 280000, 800000, 144000, 944000, 0,
  '15', '01', '02', DATE '2023-04-01', 'SIN_DOCUMENTO', 2023, 2024, 2, NULL, '001', '001', 'PROYECTO NUEVO', 'S'
);

INSERT INTO PROYECTO VALUES (
  1, 103, 'MEJORAMIENTO RED ELECTRICA', 1001, 1, 1, 3, 5001, 'N', 'SNIP003',
  DATE '2023-05-20', 1, 1, 'F003', 1, 1, 1, 1, DATE '2023-05-25',
  600000, 300000, 60000, 30000, 210000, 600000, 108000, 708000, 0,
  '15', '01', '03', DATE '2023-06-01', 'SIN_DOCUMENTO', 2023, 2024, 3, NULL, '001', '001', 'PROYECTO REGIONAL', 'S'
);

INSERT INTO PROYECTO VALUES (
  1, 104, 'SISTEMA DE IRRIGACION', 1002, 1, 1, 4, 5002, 'N', 'SNIP004',
  DATE '2023-07-05', 1, 1, 'F004', 1, 1, 1, 1, DATE '2023-07-10',
  400000, 200000, 40000, 20000, 140000, 400000, 72000, 472000, 0,
  '15', '01', '04', DATE '2023-08-01', 'SIN_DOCUMENTO', 2023, 2024, 4, NULL, '001', '001', 'PROYECTO AGRICOLA', 'S'
);

INSERT INTO PROYECTO VALUES (
  1, 105, 'CONSTRUCCION PUENTE VEHICULAR', 1001, 1, 1, 5, 5001, 'N', 'SNIP005',
  DATE '2023-09-15', 1, 1, 'F005', 1, 1, 1, 1, DATE '2023-09-20',
  1200000, 600000, 120000, 60000, 420000, 1200000, 216000, 1416000, 0,
  '15', '01', '05', DATE '2023-10-01', 'SIN_DOCUMENTO', 2023, 2025, 5, NULL, '001', '001', 'PROYECTO VIAL', 'S'
);

-- ============================================================================
-- 9. TABLA PROY_PARTIDA - ASIGNAR PARTIDAS A PROYECTOS
-- ============================================================================
-- Solo se asignan partidas de NIVEL 3 (último nivel) a los proyectos
-- ============================================================================

-- Proyecto 101 (Hidroeléctrico) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 101, 1, 'I', 1101, 'ING-101', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 101, 1, 'I', 1102, 'ING-102', 'N', 3, '002', '001', '001', 'S');

-- Proyecto 101 (Hidroeléctrico) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 101, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 101, 1, 'E', 2102, 'EGR-102', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 101, 1, 'E', 2301, 'EGR-301', 'N', 3, '002', '001', '001', 'S');

-- Proyecto 102 (Planta Energética) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 102, 1, 'I', 1102, 'ING-102', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 102, 1, 'I', 1103, 'ING-103', 'N', 3, '002', '001', '001', 'S');

-- Proyecto 102 (Planta Energética) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 102, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 102, 1, 'E', 2302, 'EGR-302', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 102, 1, 'E', 2303, 'EGR-303', 'N', 3, '002', '001', '001', 'S');

-- Proyecto 103 (Red Eléctrica) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 103, 1, 'I', 1101, 'ING-101', 'N', 3, '002', '001', '001', 'S');

-- Proyecto 103 (Red Eléctrica) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 103, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 103, 1, 'E', 2102, 'EGR-102', 'N', 3, '002', '001', '001', 'S');
INSERT INTO PROY_PARTIDA VALUES (1, 103, 1, 'E', 2201, 'EGR-201', 'N', 3, '002', '001', '001', 'S');


-- ============================================================================
-- 10. TABLA PROY_PARTIDA_MEZCLA - ASIGNAR PARTIDAS NIVEL 3 A PROYECTOS
-- ============================================================================
-- Solo se asignan las partidas de NIVEL 3 (último nivel) a los proyectos
-- PadCodPartida indica el padre de nivel 2
-- ============================================================================

-- Proyecto 101 (Hidroeléctrico) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 101, 'I', 1, 1101, 1, 1100, '002', 'UND', 3, 1, 1000.00, 500, 500000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 101, 'I', 1, 1102, 2, 1100, '002', 'UND', 3, 2, 1500.00, 300, 450000.00);

-- Proyecto 101 (Hidroeléctrico) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 101, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 500.00, 600, 300000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 101, 'E', 1, 2102, 2, 2100, '002', 'UND', 3, 2, 300.00, 400, 120000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 101, 'E', 1, 2301, 3, 2300, '002', 'UND', 3, 3, 800.00, 250, 200000.00);

-- Proyecto 102 (Planta Energética) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 102, 'I', 1, 1102, 1, 1100, '002', 'UND', 3, 1, 800.00, 300, 240000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 102, 'I', 1, 1103, 2, 1100, '002', 'UND', 3, 2, 1200.00, 200, 240000.00);

-- Proyecto 102 (Planta Energética) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 102, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 450.00, 500, 225000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 102, 'E', 1, 2302, 2, 2300, '002', 'UND', 3, 2, 900.00, 180, 162000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 102, 'E', 1, 2303, 3, 2300, '002', 'UND', 3, 3, 700.00, 150, 105000.00);

-- Proyecto 103 (Red Eléctrica) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 103, 'I', 1, 1101, 1, 1100, '002', 'UND', 3, 1, 1200.00, 400, 480000.00);

-- Proyecto 103 (Red Eléctrica) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 103, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 550.00, 500, 275000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 103, 'E', 1, 2102, 2, 2100, '002', 'UND', 3, 2, 350.00, 350, 122500.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 103, 'E', 1, 2201, 3, 2200, '002', 'UND', 3, 3, 400.00, 200, 80000.00);


-- 11. TABLA COMP_PAGOCAB (Comprobantes de pago - Egresos)
INSERT INTO COMP_PAGOCAB VALUES (
  1, 7002, 'CP-002', 101, 2, '003', 'FAC', DATE '2023-03-20',
  '001', 'PEN', 3.82, 0, 40000, 7200, 47200,
  '', '', NULL, '',
  2, '004', 'REG'
);


INSERT INTO COMP_PAGOCAB VALUES (
  1, 7003, 'CP-004', 101, 3, '003', 'FAC', DATE '2023-05-05',
  '001', 'PEN', 3.75, 0, 25000, 4500, 29500,
  '', '', NULL, '',
  4, '004', 'REG'
);

INSERT INTO COMP_PAGOCAB VALUES (
  1, 7002, 'CP-005', 103, 1, '003', 'FAC', DATE '2023-06-12',
  '001', 'PEN', 3.76, 0, 35000, 6300, 41300,
  '', '', NULL, '',
  5, '004', 'REG'
);

INSERT INTO COMP_PAGOCAB VALUES (
  1, 7004, 'CP-006', 102, 2, '003', 'FAC', DATE '2023-07-18',
  '001', 'PEN', 3.74, 0, 28000, 5040, 33040,
  '', '', NULL, '',
  6, '004', 'REG'
);

INSERT INTO COMP_PAGOCAB VALUES (
  1, 7005, 'CP-007', 103, 2, '003', 'FAC', DATE '2023-08-22',
  '001', 'PEN', 3.73, 0, 32000, 5760, 37760,
  '', '', NULL, '',
  7, '004', 'REG'
);


-- 12. TABLA COMP_PAGODET (Detalle de pagos - usar partidas de nivel 3)
INSERT INTO COMP_PAGODET VALUES (1, 7002, 'CP-002', 1, 'E', 2102, 40000, 7200, 47200, 2);
INSERT INTO COMP_PAGODET VALUES (1, 7003, 'CP-004', 1, 'E', 2101, 25000, 4500, 29500, 4);
INSERT INTO COMP_PAGODET VALUES (1, 7002, 'CP-005', 1, 'E', 2101, 35000, 6300, 41300, 5);
INSERT INTO COMP_PAGODET VALUES (1, 7004, 'CP-006', 1, 'E', 2103, 28000, 5040, 33040, 6);
INSERT INTO COMP_PAGODET VALUES (1, 7005, 'CP-007', 1, 'E', 2301, 32000, 5760, 37760, 7);

-- 13. TABLA VTACOMP_PAGOCAB (Comprobantes de venta - Ingresos)
INSERT INTO VTACOMP_PAGOCAB VALUES (
  1, 'VTA-001', 101, 5001, 1, '003', 'FAC', DATE '2023-02-28',
  '001', 'PEN', 3.80, 0, 80000, 14400, 94400,
  '', '', NULL, '',
  1, '004', 'REG'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
  1, 'VTA-002', 101, 5001, 2, '003', 'FAC', DATE '2023-05-31',
  '001', 'PEN', 3.78, 0, 75000, 13500, 88500,
  '', '', NULL, '',
  2, '004', 'REG'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
  1, 'VTA-003', 102, 5002, 1, '003', 'FAC', DATE '2023-04-15',
  '001', 'PEN', 3.82, 0, 60000, 10800, 70800,
  '', '', NULL, '',
  3, '004', 'REG'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
  1, 'VTA-004', 101, 5001, 3, '003', 'FAC', DATE '2023-08-31',
  '001', 'PEN', 3.75, 0, 85000, 15300, 100300,
  '', '', NULL, '',
  4, '004', 'REG'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
  1, 'VTA-005', 103, 5001, 1, '003', 'FAC', DATE '2023-07-20',
  '001', 'PEN', 3.76, 0, 50000, 9000, 59000,
  '', '', NULL, '',
  5, '004', 'REG'
);


-- 14. TABLA VTACOMP_PAGODET (Detalle de ventas - usar partidas de nivel 3)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-001', 1, 'I', 1101, 80000, 14400, 94400, 1);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-002', 1, 'I', 1101, 75000, 13500, 88500, 2);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-003', 1, 'I', 1102, 60000, 10800, 70800, 3);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-004', 1, 'I', 1101, 85000, 15300, 100300, 4);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-005', 1, 'I', 1101, 50000, 9000, 59000, 5);


-- 15. TABLA PARTIDA_MEZCLA (usar partidas de nivel 3)
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 1101, 1, 0, '002', 'UND', 1000.00, 1, 1, 'S');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 1102, 1, 0, '002', 'UND', 800.00, 1, 1, 'S');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 2101, 1, 0, '002', 'UND', 500.00, 1, 1, 'S');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 2102, 1, 0, '002', 'UND', 300.00, 1, 1, 'S');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 2103, 1, 0, '002', 'UND', 200.00, 1, 1, 'S');

-- 16. TABLA DPROY_PARTIDA_MEZCLA (usar partidas de nivel 3)
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 101, 'I', 1, 1101, 1, 1, '005', 'NOR', 1, '003', 'FAC', DATE '2023-03-31', 50000, 9000, 59000, 1);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 101, 'I', 1, 1102, 2, 2, '005', 'NOR', 2, '003', 'FAC', DATE '2023-06-30', 30000, 5400, 35400, 2);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 101, 'E', 1, 2101, 1, 1, '005', 'NOR', 1, '003', 'FAC', DATE '2023-02-28', 25000, 4500, 29500, 3);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 102, 'I', 1, 1102, 1, 1, '005', 'NOR', 1, '003', 'FAC', DATE '2023-04-30', 40000, 7200, 47200, 4);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 102, 'E', 1, 2303, 3, 3, '005', 'NOR', 1, '003', 'FAC', DATE '2023-05-31', 15000, 2700, 17700, 5);




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

-- 12. Ver tabla DPROY_PARTIDA_MEZCLA
SELECT * FROM DPROY_PARTIDA_MEZCLA;

-- 13. Ver tabla COMP_PAGOCAB
SELECT * FROM COMP_PAGOCAB;

-- 14. Ver tabla COMP_PAGODET
SELECT * FROM COMP_PAGODET;

-- 15. Ver tabla VTACOMP_PAGOCAB
SELECT * FROM VTACOMP_PAGOCAB;

-- 16. Ver tabla VTACOMP_PAGODET
SELECT * FROM VTACOMP_PAGODET;
