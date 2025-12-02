/* ============================================================
   SCRIPT DE LIMPIEZA (DROP TABLES)
   Orden: De Hijas (Detalles) -> a -> Padres (Maestras)
   ============================================================ */

-- 1. NIVEL 4: Tablas de último nivel (Detalles de Flujos y Transacciones)
-- Estas dependen de FlujoCaja, Pagos Cabecera, etc.
DROP TABLE FLUJOCAJA_DET          CASCADE CONSTRAINTS PURGE;
DROP TABLE DPROY_PARTIDA_MEZCLA   CASCADE CONSTRAINTS PURGE;
DROP TABLE VTACOMP_PAGODET        CASCADE CONSTRAINTS PURGE;
DROP TABLE COMP_PAGODET           CASCADE CONSTRAINTS PURGE;
DROP TABLE COMP_PAGOEMPLEADO_DET CASCADE CONSTRAINTS PURGE;

-- 2. NIVEL 3: Tablas de Configuración de Partidas y Cabeceras
-- Estas dependen de Proy_Partida y Proyecto
DROP TABLE PROY_PARTIDA_MEZCLA    CASCADE CONSTRAINTS PURGE;
DROP TABLE PARTIDA_MEZCLA         CASCADE CONSTRAINTS PURGE;
DROP TABLE VTACOMP_PAGOCAB        CASCADE CONSTRAINTS PURGE;
DROP TABLE FLUJOCAJA              CASCADE CONSTRAINTS PURGE;

-- 3. NIVEL 2: Tablas de Asociación Proyecto-Partida
-- Esta une Proyecto y Partida
DROP TABLE PROY_PARTIDA           CASCADE CONSTRAINTS PURGE;

-- 4. NIVEL 1: Tablas Maestras Principales
-- Estas son las bases de todo el sistema
DROP TABLE PARTIDA                CASCADE CONSTRAINTS PURGE;

COMMIT;


-----CREACION DE TABLAS

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

                FotoCP VARCHAR2(60) NOT NULL,

                FotoAbono VARCHAR2(60) NOT NULL,

                FecAbono DATE NOT NULL,

                DesAbono VARCHAR2(1000) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                CONSTRAINT VTACOMP_PAGOCAB_PK PRIMARY KEY (CodCIA,NroCP)

);



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

CREATE TABLE FLUJOCAJA(

                CodCia NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                Tipo VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                Nivel NUMBER(1) NOT NULL,

                Orden NUMBER(5) NOT NULL,

                DesConcepto VARCHAR2(30) NOT NULL,

                DesConceptoCorto VARCHAR2(10) NOT NULL,

                Semilla NUMBER(5) NOT NULL,

                Raiz NUMBER(5) NOT NULL,

                TabEstado VARCHAR2(3) NOT NULL,

                CodEstado VARCHAR2(3) NOT NULL,

                Vigente VARCHAR2(1) NOT NULL,

                CONSTRAINT FLUJOCAJA_PK PRIMARY KEY (CodCia,CodPyto,IngEgr,Tipo,CodPartida)

);



CREATE TABLE FLUJOCAJA_DET(

                Anno NUMBER(4) NOT NULL,

                CodCia NUMBER(6) NOT NULL,

                CodPyto NUMBER(6) NOT NULL,

                IngEgr VARCHAR2(1) NOT NULL,

                Tipo VARCHAR2(1) NOT NULL,

                CodPartida NUMBER(6) NOT NULL,

                Orden NUMBER(5)NOT NULL,

                ImpIni NUMBER(12,2) NOT NULL,

                ImpRealIni NUMBER(12,2) NOT NULL,

                ImpEne NUMBER(12,2) NOT NULL,

                ImpRealEne NUMBER(12,2) NOT NULL,

                ImpFeb NUMBER(12,2) NOT NULL,

                ImpRealFeb NUMBER(12,2) NOT NULL,

                ImpMar NUMBER(12,2) NOT NULL,

                ImpRealMar NUMBER(12,2) NOT NULL,

                ImpAbr NUMBER(12,2) NOT NULL,

                ImpRealAbr NUMBER(12,2) NOT NULL,

                ImpMay NUMBER(12,2) NOT NULL,

                ImpRealMay NUMBER(12,2) NOT NULL,

                ImpJun NUMBER(12,2) NOT NULL,

                ImpRealJun NUMBER(12,2) NOT NULL,

                ImpJul NUMBER(12,2) NOT NULL,

                ImpRealJul NUMBER(12,2) NOT NULL,

                ImpAgo NUMBER(12,2) NOT NULL,

                ImpRealAgo NUMBER(12,2) NOT NULL,

                ImpSep NUMBER(12,2) NOT NULL,

                ImpRealSep NUMBER(12,2) NOT NULL,

                ImpOct NUMBER(12,2) NOT NULL,

                ImpRealOct NUMBER(12,2) NOT NULL,

                ImpNov NUMBER(12,2) NOT NULL,

                ImpRealNov NUMBER(12,2) NOT NULL,

                ImpDic NUMBER(12,2) NOT NULL,

                ImpRealDic NUMBER(12,2) NOT NULL,

                ImpAcum NUMBER(12,2) NOT NULL,

                ImpRealAcum NUMBER(12,2) NOT NULL,

                CONSTRAINT FLUJOCAJA_DET_PK PRIMARY KEY (Anno,CodCia,CodPyto,IngEgr,Tipo,CodPartida)

);

--NUEVO PARA EMPLEADO
CREATE TABLE COMP_PAGOEMPLEADO_DET (

    CodCIA      NUMBER(6)   NOT NULL,
    CodEmpleado NUMBER(6)   NOT NULL,
    NroCP       VARCHAR2(20) NOT NULL,
    Sec         NUMBER(4)    NOT NULL,
    IngEgr      VARCHAR2(1)  NOT NULL,
    CodPartida  NUMBER(6)    NOT NULL,
    ImpNetoMN   NUMBER(9,2)  NOT NULL,
    ImpIGVMN    NUMBER(9,2)  NOT NULL,
    ImpTotalMN  NUMBER(9,2)  NOT NULL,
    Semilla     NUMBER(5)    NOT NULL,
    CONSTRAINT COMP_PAGOEMPDET_PK PRIMARY KEY (CodCIA, CodEmpleado, NroCP, Sec)
);

ALTER TABLE PARTIDA ADD CONSTRAINT CIA_PARTIDAFK
FOREIGN KEY (CodCia)
REFERENCES CIA (CodCia);

ALTER TABLE PROY_PARTIDA
ADD CONSTRAINT PROYECTO_PROY_PARTIDA_FK
FOREIGN KEY (CodCia,CodPyto)
REFERENCES PROYECTO(CodCia,CODPYTO);

ALTER TABLE PROY_PARTIDA
ADD CONSTRAINT PARTIDA_PROY_PARTIDA_FK
FOREIGN KEY (CodCia,IngEgr,CodPartida)
REFERENCES PARTIDA (CodCia,IngEgr,CodPartida);

ALTER TABLE PARTIDA_MEZCLA
ADD CONSTRAINT PARTIDA_PARTIDA_MEZCLA_FK
FOREIGN KEY (CodCia,IngEgr,CodPartida)
REFERENCES PARTIDA (CodCia,IngEgr,CodPartida);

ALTER TABLE PROY_PARTIDA_MEZCLA
ADD CONSTRAINT PROY_PARTIDA_PROY_PARTIDA_MEZCLA_FK
FOREIGN KEY (CodCia,CodPyto,NroVersion,IngEgr,CodPartida)
REFERENCES PROY_PARTIDA (CodCia,CodPyto,NroVersion,IngEgr,CodPartida);

ALTER TABLE COMP_PAGODET
ADD CONSTRAINT COMP_PAGODET_COMP_PAGOCAB_FK
FOREIGN KEY (CodCIA,CodProveedor,NroCP)
REFERENCES COMP_PAGOCAB (CodCIA,CodProveedor,NroCP);

ALTER TABLE COMP_PAGODET
ADD CONSTRAINT COMP_PAGODET_PARTIDA_FK
FOREIGN KEY (CodCIA,IngEgr,CodPartida)
REFERENCES PARTIDA (CodCIA,IngEgr,CodPartida);

ALTER TABLE COMP_PAGOEMPLEADO_DET
ADD CONSTRAINT COMP_PAGOEMPDET_CAB_FK
FOREIGN KEY (CodCIA, CodEmpleado, NroCP)
REFERENCES COMP_PAGOEMPLEADO (CodCIA, CodEmpleado, NroCP);

ALTER TABLE COMP_PAGOEMPLEADO_DET
ADD CONSTRAINT COMP_PAGOEMPDET_PARTIDA_FK
FOREIGN KEY (CodCIA, IngEgr, CodPartida)
REFERENCES PARTIDA (CodCIA, IngEgr, CodPartida);

ALTER TABLE VTACOMP_PAGOCAB
ADD CONSTRAINT VTACOMP_PAGOCAB_PROYECTO_FK
FOREIGN KEY (CodCIA,CodPyto)
REFERENCES PROYECTO (CodCIA,CodPyto);

ALTER TABLE VTACOMP_PAGODET
ADD CONSTRAINT VTACOMP_PAGODET_PARTIDA_FK
FOREIGN KEY (CodCIA, IngEgr, CodPartida)
REFERENCES PARTIDA (CodCIA, IngEgr, CodPartida);

ALTER TABLE VTACOMP_PAGODET
ADD CONSTRAINT VTACOMP_PAGODET_VTACOMP_PAGOCAB_FK
FOREIGN KEY (CodCIA, NROCP)
REFERENCES VTACOMP_PAGOCAB(CodCIA, NROCP);

ALTER TABLE DPROY_PARTIDA_MEZCLA ADD CONSTRAINT PROY_PARTIDA_MEZCLA_DPROY_PARTIDA_MEZCLA_FK
FOREIGN KEY (CodCia, CodPyto, IngEgr, NroVersion, CodPartida, Corr)
REFERENCES PROY_PARTIDA_MEZCLA (CodCia, CodPyto, IngEgr, NroVersion, CodPartida, Corr);

ALTER TABLE FLUJOCAJA ADD CONSTRAINT PARTIDA_FLUJOCAJA_FK
FOREIGN KEY (CodCia,IngEgr,CodPartida)
REFERENCES PARTIDA (CodCia,IngEgr,CodPartida);

ALTER TABLE FLUJOCAJA ADD CONSTRAINT PROYECTO_FLUJOCAJA_FK
FOREIGN KEY (CodCia,CodPyto)
REFERENCES PROYECTO (CodCia,CodPyto);

ALTER TABLE FLUJOCAJA_DET ADD CONSTRAINT FLUJOCAJA_FLUJOCAJA_DET_FK
FOREIGN KEY (CodCia,CodPyto,IngEgr,Tipo,CodPartida)
REFERENCES FLUJOCAJA(CodCia,CodPyto,IngEgr,Tipo,CodPartida);
COMMIT;
