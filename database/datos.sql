-- ==================================================================
-- 0. LIMPIEZA DE TABLAS (Orden inverso a dependencias)
-- ==================================================================
BEGIN
    EXECUTE IMMEDIATE 'DELETE FROM COMP_PAGOEMPLEADO_DET';
    EXECUTE IMMEDIATE 'DELETE FROM COMP_PAGOEMPLEADO';
    EXECUTE IMMEDIATE 'DELETE FROM COMP_PAGODET';
    EXECUTE IMMEDIATE 'DELETE FROM COMP_PAGOCAB';
    EXECUTE IMMEDIATE 'DELETE FROM DPROY_PARTIDA_MEZCLA';
    EXECUTE IMMEDIATE 'DELETE FROM PROY_PARTIDA_MEZCLA';
    EXECUTE IMMEDIATE 'DELETE FROM PARTIDA_MEZCLA';
    EXECUTE IMMEDIATE 'DELETE FROM PROY_PARTIDA';
    EXECUTE IMMEDIATE 'DELETE FROM PARTIDA';
    EXECUTE IMMEDIATE 'DELETE FROM PERSONAL_PROYECTOS';
    EXECUTE IMMEDIATE 'DELETE FROM CONTRATOS_PROVEEDOR';
    EXECUTE IMMEDIATE 'DELETE FROM PROYECTO';
    EXECUTE IMMEDIATE 'DELETE FROM CLIENTE';
    EXECUTE IMMEDIATE 'DELETE FROM PROVEEDOR';
    EXECUTE IMMEDIATE 'DELETE FROM USUARIOS';
    EXECUTE IMMEDIATE 'DELETE FROM EMPLEADO';
    EXECUTE IMMEDIATE 'DELETE FROM CARGOS_AREAS';
    EXECUTE IMMEDIATE 'DELETE FROM AREAS';
    EXECUTE IMMEDIATE 'DELETE FROM CIA';
    EXECUTE IMMEDIATE 'DELETE FROM ELEMENTOS';
    EXECUTE IMMEDIATE 'DELETE FROM TABS';
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error en limpieza: ' || SQLERRM);
    -- No hacemos rollback aquí para permitir que continúe si alguna tabla no existe o está vacía
END;
/

-- ==================================================================
-- 0.1 INSERTAR TABS Y ELEMENTOS (Deben ir antes de cualquier otra inserción)
-- ==================================================================

-- Insertar TAB para estados (CodTab = 001)
INSERT INTO TABS VALUES ('001', 'Estados', 'EST', '1');
INSERT INTO ELEMENTOS VALUES ('001', '1', 'Pendiente', 'PEN', '1');
INSERT INTO ELEMENTOS VALUES ('001', '2', 'Pagado', 'PAG', '1');
INSERT INTO ELEMENTOS VALUES ('001', '3', 'Anulado', 'ANU', '1');

-- Insertar TAB para Unidades de Medida (CodTab = 002)
INSERT INTO TABS VALUES ('002', 'Unidades de Medida', 'UNI', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'UND', 'Unidad', 'UND', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'GLB', 'Global', 'GLB', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'KG', 'Kilogramo', 'KG', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'M2', 'Metro Cuadrado', 'M2', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'M3', 'Metro Cúbico', 'M3', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'ML', 'Metro Lineal', 'ML', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'HH', 'Hora Hombre', 'HH', '1');
INSERT INTO ELEMENTOS VALUES ('002', 'HM', 'Hora Máquina', 'HM', '1');
INSERT INTO ELEMENTOS VALUES ('002', '001', 'Unidad', 'UND', '1');

-- Insertar TAB para moneda (CodTab = 003)
INSERT INTO TABS VALUES ('003', 'Moneda', 'MON', '1');
INSERT INTO ELEMENTOS VALUES ('003', '001', 'Soles', 'PEN', '1');
INSERT INTO ELEMENTOS VALUES ('003', '002', 'Dólares', 'USD', '1');

-- Insertar TAB para tipos de comprobante de pago (CodTab = 004)
INSERT INTO TABS VALUES ('004', 'Tipo Comprobante Pago', 'TCP', '1');
INSERT INTO ELEMENTOS VALUES ('004', '001', 'Factura', 'FAC', '1');
INSERT INTO ELEMENTOS VALUES ('004', '002', 'Recibo Honorarios', 'RHO', '1');
INSERT INTO ELEMENTOS VALUES ('004', '003', 'Boleta', 'BOL', '1');

-- Insertar TAB para Unidades de Medida alternativo (CodTab = 011)
INSERT INTO TABS VALUES ('011', 'Unidades de Medida Alt', 'UMA', '1');
INSERT INTO ELEMENTOS VALUES ('011', '002', 'Metro', 'MET', '1');
INSERT INTO ELEMENTOS VALUES ('011', '001', 'Unidad', 'UND', '1');

-- Insertar TAB para tipos adicionales (CodTab = 012)
INSERT INTO TABS VALUES ('012', 'Unidades Construcción', 'UCO', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'GLB', 'Global', 'GLB', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'UND', 'Unidad', 'UND', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'KG', 'Kilogramo', 'KG', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'M3', 'Metro Cúbico', 'M3', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'MTS', 'Metros', 'MTS', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'HH', 'Hora Hombre', 'HH', '1');
INSERT INTO ELEMENTOS VALUES ('012', 'HM', 'Hora Máquina', 'HM', '1');

-- Insertar TAB para tipos de desembolso (CodTab = 013)
INSERT INTO TABS VALUES ('013', 'Tipos de Desembolso', 'TDE', '1');
INSERT INTO ELEMENTOS VALUES ('013', 'NOR', 'Normal', 'NOR', '1');
INSERT INTO ELEMENTOS VALUES ('013', 'ADI', 'Adicional', 'ADI', '1');
INSERT INTO ELEMENTOS VALUES ('013', 'ADL', 'Adelanto', 'ADL', '1');

COMMIT;

-- ==================================================================
-- 1. INSERTAR EMPRESA (CIA) - Usando procedimiento INSERTAR_CIA
-- ==================================================================

BEGIN
    INSERTAR_CIA(
        CODC => 1,
        DES => 'CONSTRUCTORA MAGNA PERÚ SAC',
        DESCORTA => 'CMAG',
        VIG => '1'
    );
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar CIA: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 2. INSERTAR USUARIOS DEL SISTEMA - Usando INSERTAR_USUARIO
-- ==================================================================

BEGIN
    INSERTAR_USUARIO(CIA => 1, USUARIO => 'admin_magna', PASS => 'hashed_password_123', TIPO => 'ADMINISTRADOR');
    INSERTAR_USUARIO(CIA => 1, USUARIO => 'secretaria_construccion', PASS => 'hashed_password_456', TIPO => 'SECRETARIA');
    INSERTAR_USUARIO(CIA => 1, USUARIO => 'usuario_proyectos', PASS => 'hashed_password_789', TIPO => 'SECRETARIA');
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar USUARIOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 3. INSERTAR ÁREAS ORGANIZACIONALES - Usando INSERTAR_AREA
-- ==================================================================

BEGIN
    INSERTAR_AREA(CIA => 1, NOMBRE => 'Ingeniería y Proyectos', DESC_AREA => 'Área responsable del diseño y supervisión de proyectos', ESTADO => 'A');
    INSERTAR_AREA(CIA => 1, NOMBRE => 'Construcción y Obra', DESC_AREA => 'Área de ejecución y control de obra', ESTADO => 'A');
    INSERTAR_AREA(CIA => 1, NOMBRE => 'Recursos Humanos', DESC_AREA => 'Gestión de personal y nómina', ESTADO => 'A');
    INSERTAR_AREA(CIA => 1, NOMBRE => 'Administración y Finanzas', DESC_AREA => 'Control financiero y administrativo', ESTADO => 'A');
    INSERTAR_AREA(CIA => 1, NOMBRE => 'Seguridad y Calidad', DESC_AREA => 'Control de seguridad y calidad de obra', ESTADO => 'A');
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar AREAS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 4. INSERTAR CARGOS POR ÁREA - Usando INSERTAR_CARGO
-- ==================================================================

BEGIN
    -- Cargos Área 1: Ingeniería y Proyectos
    INSERTAR_CARGO(CIA => 1, AREA => 1, NOMBRE_CARGO => 'Gerente de Proyectos');
    INSERTAR_CARGO(CIA => 1, AREA => 1, NOMBRE_CARGO => 'Ingeniero Civil Senior');
    INSERTAR_CARGO(CIA => 1, AREA => 1, NOMBRE_CARGO => 'Ingeniero Civil Junior');
    INSERTAR_CARGO(CIA => 1, AREA => 1, NOMBRE_CARGO => 'Técnico en Diseño');

    -- Cargos Área 2: Construcción y Obra
    INSERTAR_CARGO(CIA => 1, AREA => 2, NOMBRE_CARGO => 'Residente de Obra');
    INSERTAR_CARGO(CIA => 1, AREA => 2, NOMBRE_CARGO => 'Maestro de Obra');
    INSERTAR_CARGO(CIA => 1, AREA => 2, NOMBRE_CARGO => 'Operario');
    INSERTAR_CARGO(CIA => 1, AREA => 2, NOMBRE_CARGO => 'Operador de Maquinaria');

    -- Cargos Área 3: Recursos Humanos
    INSERTAR_CARGO(CIA => 1, AREA => 3, NOMBRE_CARGO => 'Especialista RR.HH.');
    INSERTAR_CARGO(CIA => 1, AREA => 3, NOMBRE_CARGO => 'Coordinador Administrativo');

    -- Cargos Área 4: Administración y Finanzas
    INSERTAR_CARGO(CIA => 1, AREA => 4, NOMBRE_CARGO => 'Contador');
    INSERTAR_CARGO(CIA => 1, AREA => 4, NOMBRE_CARGO => 'Analista Financiero');

    -- Cargos Área 5: Seguridad y Calidad
    INSERTAR_CARGO(CIA => 1, AREA => 5, NOMBRE_CARGO => 'Supervisor de Seguridad');
    INSERTAR_CARGO(CIA => 1, AREA => 5, NOMBRE_CARGO => 'Especialista en Calidad');

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar CARGOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 5. INSERTAR PERSONAS (EMPLEADOS, CLIENTES, PROVEEDORES)
--    Usando procedimientos almacenados con secuencias automáticas
-- ==================================================================

-- EMPLEADOS CIA 1 - Usando INSERTAR_EMPLEADO
BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Juan Pablo Martínez López',
        DESCOR => 'J. Martínez',
        DESCALT => 'Juan Pablo Martínez López',
        DESCORALT => 'J.P.M.L',
        VIG => '1',
        DIR => 'Av. Principal 2500, Lima',
        CEL => '992184753',
        HOB => 'Lectura, Proyectos de Ingeniería',
        FOT => NULL,
        NAC => TO_DATE('1972-05-15', 'YYYY-MM-DD'),
        IDEN => '41829305',
        CIP => 'CIP418293',
        CIPVIG => TO_DATE('2025-12-31', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Gerente General',
        CODCAR => 1,
        CORREO => 'juan.martinez@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Luis Enrique Torres Vega',
        DESCOR => 'L. Torres',
        DESCALT => 'Luis Enrique Torres Vega',
        DESCORALT => 'L.E.T.V',
        VIG => '1',
        DIR => 'Calle Los Andes 450, San Isidro',
        CEL => '954821039',
        HOB => 'Diseño asistido por computadora, Fútbol',
        FOT => NULL,
        NAC => TO_DATE('1982-08-22', 'YYYY-MM-DD'),
        IDEN => '75031298',
        CIP => 'CIP750312',
        CIPVIG => TO_DATE('2025-06-30', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Especialista en proyectos de infraestructura',
        CODCAR => 2,
        CORREO => 'luis.torres@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'María Fernanda Gómez Ruiz',
        DESCOR => 'M. Gómez',
        DESCALT => 'María Fernanda Gómez Ruiz',
        DESCORALT => 'M.F.G.R',
        VIG => '1',
        DIR => 'Av. Javier Prado 1200, Magdalena',
        CEL => '976204815',
        HOB => 'Viajes, Fotografía de obras',
        FOT => NULL,
        NAC => TO_DATE('1985-03-10', 'YYYY-MM-DD'),
        IDEN => '52938471',
        CIP => 'CIP529384',
        CIPVIG => TO_DATE('2025-09-15', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Ingeniera especializada en control de calidad',
        CODCAR => 2,
        CORREO => 'maria.gomez@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Carlos Daniel Rojas Peña',
        DESCOR => 'C. Rojas',
        DESCALT => 'Carlos Daniel Rojas Peña',
        DESCORALT => 'C.D.R.P',
        VIG => '1',
        DIR => 'Calle Las Flores 890, Miraflores',
        CEL => '945182736',
        HOB => 'Cine, Tecnología',
        FOT => NULL,
        NAC => TO_DATE('1980-11-30', 'YYYY-MM-DD'),
        IDEN => '09482716',
        CIP => 'CIP094827',
        CIPVIG => TO_DATE('2025-08-20', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Ingeniero civil con experiencia en puentes',
        CODCAR => 3,
        CORREO => 'carlos.rojas@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Miguel Ángel Cabrera Soto',
        DESCOR => 'M. Cabrera',
        DESCALT => 'Miguel Ángel Cabrera Soto',
        DESCORALT => 'M.A.C.S',
        VIG => '1',
        DIR => 'Jr. Bolognesi 567, Breña',
        CEL => '963852741',
        HOB => 'Videojuegos, Construcción de modelos',
        FOT => NULL,
        NAC => TO_DATE('1990-07-05', 'YYYY-MM-DD'),
        IDEN => '23904561',
        CIP => 'CIP239045',
        CIPVIG => TO_DATE('2024-12-31', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Técnico en topografía y diseño',
        CODCAR => 3,
        CORREO => 'miguel.cabrera@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'José Manuel Vargas Gil',
        DESCOR => 'J. Vargas',
        DESCALT => 'José Manuel Vargas Gil',
        DESCORALT => 'J.M.V.G',
        VIG => '1',
        DIR => 'Av. Huamachuco 234, Rímac',
        CEL => '981726354',
        HOB => 'Música, Construcción',
        FOT => NULL,
        NAC => TO_DATE('1975-02-14', 'YYYY-MM-DD'),
        IDEN => '88102934',
        CIP => 'CIP881029',
        CIPVIG => TO_DATE('2025-10-15', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Maestro de obra con 25 años de experiencia',
        CODCAR => 5,
        CORREO => 'jose.vargas@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Ana Paula Herrera Díaz',
        DESCOR => 'A. Herrera',
        DESCALT => 'Ana Paula Herrera Díaz',
        DESCORALT => 'A.P.H.D',
        VIG => '1',
        DIR => 'Calle Germán Scheel 100, Surco',
        CEL => '952637481',
        HOB => 'Arte, Supervisión de procesos',
        FOT => NULL,
        NAC => TO_DATE('1987-09-22', 'YYYY-MM-DD'),
        IDEN => '30192845',
        CIP => 'CIP301928',
        CIPVIG => TO_DATE('2025-11-10', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Ingeniera residente de obra',
        CODCAR => 5,
        CORREO => 'ana.herrera@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'David Alejandro Silva Cruz',
        DESCOR => 'D. Silva',
        DESCALT => 'David Alejandro Silva Cruz',
        DESCORALT => 'D.A.S.C',
        VIG => '1',
        DIR => 'Jr. Carabaya 789, Cercado de Lima',
        CEL => '998475623',
        HOB => 'Lectura de economía, Golf',
        FOT => NULL,
        NAC => TO_DATE('1978-06-08', 'YYYY-MM-DD'),
        IDEN => '67203915',
        CIP => 'CIP672039',
        CIPVIG => TO_DATE('2025-07-20', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Contador principal',
        CODCAR => 11,
        CORREO => 'david.silva@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Lucía Valentina Morales Campos',
        DESCOR => 'L. Morales',
        DESCALT => 'Lucía Valentina Morales Campos',
        DESCORALT => 'L.V.M.C',
        VIG => '1',
        DIR => 'Av. La Marina 456, San Miguel',
        CEL => '971829304',
        HOB => 'Deportes, Seguridad industrial',
        FOT => NULL,
        NAC => TO_DATE('1988-12-10', 'YYYY-MM-DD'),
        IDEN => '76491023',
        CIP => 'CIP764910',
        CIPVIG => TO_DATE('2025-05-15', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Especialista en seguridad y prevención',
        CODCAR => 13,
        CORREO => 'lucia.morales@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Carmen Sofía Méndez Ortiz',
        DESCOR => 'C. Méndez',
        DESCALT => 'Carmen Sofía Méndez Ortiz',
        DESCORALT => 'C.S.M.O',
        VIG => '1',
        DIR => 'Calle Tupac Amaru 234, Chorrillos',
        CEL => '965412873',
        HOB => 'Mejora continua, ISO 9001',
        FOT => NULL,
        NAC => TO_DATE('1986-04-18', 'YYYY-MM-DD'),
        IDEN => '18293047',
        CIP => 'CIP182930',
        CIPVIG => TO_DATE('2025-09-30', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Especialista en control de calidad',
        CODCAR => 14,
        CORREO => 'carmen.mendez@cmag.pe'
    );
END;
/

BEGIN
    INSERTAR_EMPLEADO(
        CIA => 1,
        TIP => '1',
        DESP => 'Jorge Luis Castillo Vega',
        DESCOR => 'J. Castillo',
        DESCALT => 'Jorge Luis Castillo Vega',
        DESCORALT => 'J.L.C.V',
        VIG => '1',
        DIR => 'Av. Cultura 123, Lima',
        CEL => '982374651',
        HOB => 'Proyectos de infraestructura avanzada',
        FOT => NULL,
        NAC => TO_DATE('1979-01-25', 'YYYY-MM-DD'),
        IDEN => '19283746',
        CIP => 'CIP192837',
        CIPVIG => TO_DATE('2025-12-31', 'YYYY-MM-DD'),
        COND => '1',
        FLG => 'S',
        OBS => 'Director de proyectos especiales',
        CODCAR => 1,
        CORREO => 'jorge.castillo@cmag.pe'
    );
END;
/

COMMIT;

-- CLIENTES CIA 1 - Usando INSERTAR_CLIENTE
BEGIN
    INSERTAR_CLIENTE(
        CODCIA => 1,
        DESP => 'MUNICIPALIDAD DE LIMA METROPOLITANA',
        DESCOR => 'MUN LIMA',
        DESCALT => 'Municipalidad de Lima',
        DESCORALT => 'MUNLIMA',
        VIG => '1',
        RUC => '15000000001'
    );
END;
/

BEGIN
    INSERTAR_CLIENTE(
        CODCIA => 1,
        DESP => 'MINISTERIO DE TRANSPORTES Y COMUNICACIONES',
        DESCOR => 'MTC',
        DESCALT => 'Ministerio Transportes',
        DESCORALT => 'MTC',
        VIG => '1',
        RUC => '15000000002'
    );
END;
/

BEGIN
    INSERTAR_CLIENTE(
        CODCIA => 1,
        DESP => 'GOBIERNO REGIONAL CUSCO',
        DESCOR => 'GR CUSCO',
        DESCALT => 'Gobierno Regional Cusco',
        DESCORALT => 'GRC',
        VIG => '1',
        RUC => '15000000003'
    );
END;
/

BEGIN
    INSERTAR_CLIENTE(
        CODCIA => 1,
        DESP => 'JUNTA DIRECTIVA SECTOR VIVIENDA',
        DESCOR => 'JDSV',
        DESCALT => 'Junta Directiva Sector',
        DESCORALT => 'JDSV',
        VIG => '1',
        RUC => '15000000004'
    );
END;
/

COMMIT;

-- PROVEEDORES CIA 1 - Usando INSERTAR_PROVEEDOR
BEGIN
    INSERTAR_PROVEEDOR(
        CODC => 1,
        TIP => '3',
        DESP => 'CEMENTO LIMA SAC',
        DESCOR => 'CEMENT LIMA',
        DESCALT => 'Cemento Lima',
        DESCORALT => 'CL',
        VIG => '1',
        RUC => '20123456789'
    );
END;
/

BEGIN
    INSERTAR_PROVEEDOR(
        CODC => 1,
        TIP => '3',
        DESP => 'ACEROS Y ESTRUCTURAS PERU EIRL',
        DESCOR => 'ACERO PERU',
        DESCALT => 'Aceros Perú',
        DESCORALT => 'AP',
        VIG => '1',
        RUC => '20234567890'
    );
END;
/

BEGIN
    INSERTAR_PROVEEDOR(
        CODC => 1,
        TIP => '3',
        DESP => 'SUMINISTROS HIDRODINÁMICOS SAC',
        DESCOR => 'SUMHIDRO',
        DESCALT => 'Suministros Hidro',
        DESCORALT => 'SH',
        VIG => '1',
        RUC => '20345678901'
    );
END;
/

BEGIN
    INSERTAR_PROVEEDOR(
        CODC => 1,
        TIP => '3',
        DESP => 'EQUIPOS PESADOS Y MAQUINARIA LTDA',
        DESCOR => 'EQUIP PESADO',
        DESCALT => 'Equipos Pesados',
        DESCORALT => 'EP',
        VIG => '1',
        RUC => '20456789012'
    );
END;
/

BEGIN
    INSERTAR_PROVEEDOR(
        CODC => 1,
        TIP => '3',
        DESP => 'SERVICIOS ESPECIALIZADOS EN CONSTRUCCIÓN SAC',
        DESCOR => 'SERVEC',
        DESCALT => 'Servicios Especializados',
        DESCORALT => 'SE',
        VIG => '1',
        RUC => '20567890123'
    );
END;
/

COMMIT;

-- ==================================================================
-- 6. INSERTAR PROYECTOS - Usando INSERTAR_PROYECTO
-- ==================================================================

BEGIN
    -- Proyecto 1
    INSERTAR_PROYECTO(
        COD_CIA => 1,
        NOMPY => 'CONSTRUCCIÓN DEL PUENTE INTEGRAL LIMA-CALLAO - TRAMO SUR',
        JEFE => 1,
        CIACONT => 1,
        CODCLI => 12,
        FECRE => TO_DATE('2023-01-15', 'YYYY-MM-DD'),
        ESTPYT => 1,
        FECEST => TO_DATE('2024-06-30', 'YYYY-MM-DD'),
        VALREF => 25000000.00,
        COSTOTOTSIN => 25000000.00,
        IGV => 4500000.00,
        COSTOT => 29500000.00,
        OBS => 'Proyecto de infraestructura de alto impacto económico',
        ANNOIN => 2023,
        ANNOFI => 2024,
        LOGO => NULL,
        VIGENT => '1'
    );

    -- Proyecto 2
    INSERTAR_PROYECTO(
        COD_CIA => 1,
        NOMPY => 'REHABILITACIÓN DE CARRETERA PANAMERICANA NORTE - TRAMO HUARAL',
        JEFE => 2,
        CIACONT => 1,
        CODCLI => 13,
        FECRE => TO_DATE('2023-03-20', 'YYYY-MM-DD'),
        ESTPYT => 2,
        FECEST => TO_DATE('2024-05-15', 'YYYY-MM-DD'),
        VALREF => 18000000.00,
        COSTOTOTSIN => 18000000.00,
        IGV => 3240000.00,
        COSTOT => 21240000.00,
        OBS => 'Proyecto vial crítico para conectividad nacional',
        ANNOIN => 2023,
        ANNOFI => 2024,
        LOGO => NULL,
        VIGENT => '1'
    );

    -- Proyecto 3
    INSERTAR_PROYECTO(
        COD_CIA => 1,
        NOMPY => 'CONSTRUCCIÓN DE SISTEMA DE RIEGO INTEGRAL CUSCO',
        JEFE => 3,
        CIACONT => 1,
        CODCLI => 14,
        FECRE => TO_DATE('2023-02-10', 'YYYY-MM-DD'),
        ESTPYT => 2,
        FECEST => TO_DATE('2024-04-30', 'YYYY-MM-DD'),
        VALREF => 12000000.00,
        COSTOTOTSIN => 12000000.00,
        IGV => 2160000.00,
        COSTOT => 14160000.00,
        OBS => 'Proyecto de irrigación para agricultura sostenible',
        ANNOIN => 2023,
        ANNOFI => 2025,
        LOGO => NULL,
        VIGENT => '1'
    );

    -- Proyecto 4
    INSERTAR_PROYECTO(
        COD_CIA => 1,
        NOMPY => 'MODERNIZACIÓN DE INFRAESTRUCTURA HOSPITALARIA LIMA - FASE II',
        JEFE => 4,
        CIACONT => 1,
        CODCLI => 15,
        FECRE => TO_DATE('2024-01-05', 'YYYY-MM-DD'),
        ESTPYT => 1,
        FECEST => TO_DATE('2024-12-15', 'YYYY-MM-DD'),
        VALREF => 8500000.00,
        COSTOTOTSIN => 8500000.00,
        IGV => 1530000.00,
        COSTOT => 10030000.00,
        OBS => 'Mejora en servicios de salud y modernización de facilities',
        ANNOIN => 2024,
        ANNOFI => 2025,
        LOGO => NULL,
        VIGENT => '1'
    );

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar PROYECTOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 7. INSERTAR ESPECIALIDADES DEL PERSONAL - Usando INSERTAR_ESPECIALIDAD
-- ==================================================================

BEGIN
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 2, ESP => 'Diseño Estructural en Acero', CERT => NULL, INST => 'Universidad Nacional de Ingeniería', FECHA => TO_DATE('2010-06-15', 'YYYY-MM-DD'), HORAS => 120.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 2, ESP => 'BIM - Building Information Modeling', CERT => NULL, INST => 'Autodesk Academy', FECHA => TO_DATE('2018-03-20', 'YYYY-MM-DD'), HORAS => 40.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 3, ESP => 'Control de Calidad en Materiales', CERT => NULL, INST => 'ICACIT', FECHA => TO_DATE('2015-09-10', 'YYYY-MM-DD'), HORAS => 80.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 4, ESP => 'Puentes y Estructuras Especiales', CERT => NULL, INST => 'Colegio de Ingenieros del Perú', FECHA => TO_DATE('2012-11-05', 'YYYY-MM-DD'), HORAS => 160.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 5, ESP => 'Topografía y Geodesia Aplicada', CERT => NULL, INST => 'Instituto de Topografía', FECHA => TO_DATE('2016-07-22', 'YYYY-MM-DD'), HORAS => 100.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 6, ESP => 'Gestión de Proyectos de Construcción', CERT => NULL, INST => 'Project Management Institute', FECHA => TO_DATE('2014-05-30', 'YYYY-MM-DD'), HORAS => 180.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 7, ESP => 'Supervisión de Obra Civil', CERT => NULL, INST => 'Colegio de Ingenieros del Perú', FECHA => TO_DATE('2013-08-15', 'YYYY-MM-DD'), HORAS => 140.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 8, ESP => 'Costos y Presupuestos en Construcción', CERT => NULL, INST => 'CAPECO', FECHA => TO_DATE('2017-02-10', 'YYYY-MM-DD'), HORAS => 60.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 9, ESP => 'Seguridad y Salud Ocupacional - OHSAS 18001', CERT => NULL, INST => 'Instituto de Seguridad', FECHA => TO_DATE('2015-11-20', 'YYYY-MM-DD'), HORAS => 90.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 10, ESP => 'ISO 9001 - Sistemas de Gestión de Calidad', CERT => NULL, INST => 'Bureau Veritas', FECHA => TO_DATE('2019-04-05', 'YYYY-MM-DD'), HORAS => 50.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 10, ESP => 'Diseño Estructural en Concreto Armado', CERT => NULL, INST => 'UNSA - Arequipa', FECHA => TO_DATE('2011-09-18', 'YYYY-MM-DD'), HORAS => 150.00);
    INSERTAR_ESPECIALIDAD(CIA => 1, EMP => 10, ESP => 'Análisis Sísmico de Estructuras', CERT => NULL, INST => 'Pontificia Universidad Católica', FECHA => TO_DATE('2014-06-22', 'YYYY-MM-DD'), HORAS => 100.00);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar ESPECIALIDADES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 8. INSERTAR GRADOS ACADÉMICOS - Usando INSERTAR_GRADO
-- ==================================================================

BEGIN
    INSERTAR_GRADO(CIA => 1, EMP => 2, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Civil', TITULO => 'Ingeniero Civil', INST => 'Universidad Nacional de Ingeniería', FECHA => TO_DATE('2002-12-15', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 2, TIPO_GRADO => 'MAESTRIA', CARRERA => 'Ingeniería Estructural', TITULO => 'Magister en Ingeniería Estructural', INST => 'Pontificia Universidad Católica', FECHA => TO_DATE('2008-11-20', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 3, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Civil', TITULO => 'Ingeniera Civil', INST => 'Universidad Nacional Mayor de San Marcos', FECHA => TO_DATE('2005-10-10', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 3, TIPO_GRADO => 'MAESTRIA', CARRERA => 'Gestión de Proyectos', TITULO => 'Magister en Gestión de Proyectos', INST => 'Universidad ESAN', FECHA => TO_DATE('2010-07-15', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 4, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Civil', TITULO => 'Ingeniero Civil', INST => 'Universidad Nacional de Ingeniería', FECHA => TO_DATE('2003-06-20', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 5, TIPO_GRADO => 'TECNICO', CARRERA => 'Topografía', TITULO => 'Técnico en Topografía', INST => 'Instituto Superior Tecnológico', FECHA => TO_DATE('2009-05-10', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 6, TIPO_GRADO => 'TECNICO', CARRERA => 'Construcción Civil', TITULO => 'Técnico en Construcción', INST => 'SENATI', FECHA => TO_DATE('2000-08-30', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 7, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Civil', TITULO => 'Ingeniera Civil', INST => 'Universidad del Centro', FECHA => TO_DATE('2006-04-12', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 8, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Contabilidad', TITULO => 'Contador Público', INST => 'Universidad de Lima', FECHA => TO_DATE('2001-11-25', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 9, TIPO_GRADO => 'TECNICO', CARRERA => 'Seguridad Industrial', TITULO => 'Técnico en Seguridad Industrial', INST => 'SENATI', FECHA => TO_DATE('2008-07-18', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 10, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Industrial', TITULO => 'Ingeniera Industrial', INST => 'Universidad Nacional de Ingeniería', FECHA => TO_DATE('2007-03-22', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 10, TIPO_GRADO => 'LICENCIATURA', CARRERA => 'Ingeniería Civil', TITULO => 'Ingeniero Civil', INST => 'UNSA - Universidad Nacional de San Agustín', FECHA => TO_DATE('2002-05-10', 'YYYY-MM-DD'), DOC => NULL);
    INSERTAR_GRADO(CIA => 1, EMP => 10, TIPO_GRADO => 'MAESTRIA', CARRERA => 'Ingeniería Civil', TITULO => 'Magister en Ingeniería Civil', INST => 'Pontificia Universidad Católica', FECHA => TO_DATE('2010-08-20', 'YYYY-MM-DD'), DOC => NULL);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar GRADOS ACADEMICOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 9. INSERTAR EXPERIENCIA LABORAL - Usando INSERTAR_EXPERIENCIA
-- ==================================================================

BEGIN
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 2, EMPRESA => 'CONSTRUCTORA BLAS EMPRESA CONTRATISTA SAC', ESP => 'Dirección de Proyectos de Infraestructura', FECHA_INI => TO_DATE('2002-01-15', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2015-12-31', 'YYYY-MM-DD'), CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 2, EMPRESA => 'EMPRESA CONTRATISTA CIVIL SAC', ESP => 'Jefe de Diseño Estructural', FECHA_INI => TO_DATE('2003-06-01', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2018-05-31', 'YYYY-MM-DD'), CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 3, EMPRESA => 'SUPERVISORA DE OBRAS PÚBLICAS LTDA', ESP => 'Residente de Obra - Proyectos Viales', FECHA_INI => TO_DATE('2005-03-01', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2019-02-28', 'YYYY-MM-DD'), CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 4, EMPRESA => 'INGENIERÍA Y CONSTRUCCIÓN MAYORMENTE SAC', ESP => 'Ingeniero Civil Especialista', FECHA_INI => TO_DATE('2003-09-15', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2020-08-31', 'YYYY-MM-DD'), CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 5, EMPRESA => 'TOPOGRAFÍA Y GEODESIA APLICADA SAC', ESP => 'Técnico Topógrafo', FECHA_INI => TO_DATE('2009-07-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 6, EMPRESA => 'PROYECTOS Y OBRAS ESTRUCTURALES SAC', ESP => 'Maestro General de Obras', FECHA_INI => TO_DATE('2000-02-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 7, EMPRESA => 'SUPERVISIÓN DE PROYECTOS CIVILES LTDA', ESP => 'Residente de Obra', FECHA_INI => TO_DATE('2009-01-15', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 8, EMPRESA => 'EMPRESAS CONSTRUCTORAS DIVERSAS', ESP => 'Asistente Administrativo - Costos', FECHA_INI => TO_DATE('2005-11-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 9, EMPRESA => 'SEGURIDAD EN OBRA SAC', ESP => 'Supervisor de Seguridad', FECHA_INI => TO_DATE('2010-05-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 10, EMPRESA => 'CONTROL DE CALIDAD CONSTRUCCIONES SAC', ESP => 'Técnico de Calidad', FECHA_INI => TO_DATE('2011-08-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 10, EMPRESA => 'CONSTRUCTORA SANTA CLARA SAC', ESP => 'Diseñador Estructural', FECHA_INI => TO_DATE('2002-03-01', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2012-12-31', 'YYYY-MM-DD'), CERT => NULL);
    INSERTAR_EXPERIENCIA(CIA => 1, EMP => 10, EMPRESA => 'PROYECTOS DE INGENIERÍA ANDINA SAC', ESP => 'Director de Ingeniería', FECHA_INI => TO_DATE('2013-01-15', 'YYYY-MM-DD'), FECHA_FIN => NULL, CERT => NULL);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar EXPERIENCIA LABORAL: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 10. INSERTAR PERSONAL ASIGNADO A PROYECTOS - Usando INSERTAR_PERSONAL_PROYECTO
-- ==================================================================

BEGIN
    -- Proyecto 1: Puente Lima-Callao
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 2, PYTO => 1, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-01-20', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 3, PYTO => 1, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-01-20', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 4, PYTO => 1, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-02-01', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 5, PYTO => 1, CARGO => 5, AREA => 2, FECHA_ASIG => TO_DATE('2023-02-15', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 120.00, MONTO => 6500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 6, PYTO => 1, CARGO => 6, AREA => 2, FECHA_ASIG => TO_DATE('2023-03-01', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 168.00, MONTO => 7200.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 7, PYTO => 1, CARGO => 7, AREA => 2, FECHA_ASIG => TO_DATE('2023-03-01', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 168.00, MONTO => 5800.00, DOC => NULL);

    -- Proyecto 2: Carretera Panamericana
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 3, PYTO => 2, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-03-25', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 4, PYTO => 2, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-04-01', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 5, PYTO => 2, CARGO => 5, AREA => 2, FECHA_ASIG => TO_DATE('2023-04-15', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 120.00, MONTO => 6500.00, DOC => NULL);

    -- Proyecto 3: Sistema de Riego Cusco
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 4, PYTO => 3, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2023-02-15', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 5, PYTO => 3, CARGO => 5, AREA => 2, FECHA_ASIG => TO_DATE('2023-03-01', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 120.00, MONTO => 6500.00, DOC => NULL);

    -- Proyecto 4: Hospital Lima
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 10, PYTO => 4, CARGO => 1, AREA => 1, FECHA_ASIG => TO_DATE('2024-01-10', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 10000.00, DOC => NULL);
    INSERTAR_PERSONAL_PROYECTO(CIA => 1, EMP => 2, PYTO => 4, CARGO => 2, AREA => 1, FECHA_ASIG => TO_DATE('2024-01-10', 'YYYY-MM-DD'), FECHA_DESASIG => NULL, HORAS => 160.00, MONTO => 8500.00, DOC => NULL);

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar PERSONAL EN PROYECTOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 11. INSERTAR TAREAS DEL PERSONAL - Usando INSERTAR_TAREA
-- ==================================================================

BEGIN
    -- Tareas Proyecto 1 - Puente Lima-Callao
    INSERTAR_TAREA(CIA => 1, PYTO => 1, EMP => 2, NOMBRE => 'Revisión de planos estructurales y especificaciones técnicas', DESC_TAREA => 'Validar conformidad de diseño con normativa vigente', FECHA_INI => TO_DATE('2023-01-20', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2023-02-10', 'YYYY-MM-DD'), ESTADO => 'COMPLETADA');
    INSERTAR_TAREA(CIA => 1, PYTO => 1, EMP => 3, NOMBRE => 'Supervisión de excavación de cimientos', DESC_TAREA => 'Verificar profundidad, compactación y calidad de material', FECHA_INI => TO_DATE('2023-02-01', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2023-03-15', 'YYYY-MM-DD'), ESTADO => 'COMPLETADA');
    INSERTAR_TAREA(CIA => 1, PYTO => 1, EMP => 4, NOMBRE => 'Colocación de acero de refuerzo', DESC_TAREA => 'Inspeccionar distribución y amarre de varillas según planos', FECHA_INI => TO_DATE('2023-03-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'EN_PROGRESO');
    INSERTAR_TAREA(CIA => 1, PYTO => 1, EMP => 5, NOMBRE => 'Vaciado de concreto armado en zapatas', DESC_TAREA => 'Supervisar calidad del concreto y curado inicial', FECHA_INI => TO_DATE('2023-03-15', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'EN_PROGRESO');
    INSERTAR_TAREA(CIA => 1, PYTO => 1, EMP => 6, NOMBRE => 'Coordinación de trabajos en altura y seguridad', DESC_TAREA => 'Garantizar cumplimiento de protocolos de seguridad en obra', FECHA_INI => TO_DATE('2023-02-15', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'EN_PROGRESO');

    -- Tareas Proyecto 2 - Carretera Panamericana
    INSERTAR_TAREA(CIA => 1, PYTO => 2, EMP => 3, NOMBRE => 'Levantamiento topográfico de eje vial', DESC_TAREA => 'Determinar cotas y alineamiento de carretera', FECHA_INI => TO_DATE('2023-03-25', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2023-04-20', 'YYYY-MM-DD'), ESTADO => 'COMPLETADA');
    INSERTAR_TAREA(CIA => 1, PYTO => 2, EMP => 4, NOMBRE => 'Preparación de base granular', DESC_TAREA => 'Colocación, compactación y pruebas de densidad', FECHA_INI => TO_DATE('2023-04-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'EN_PROGRESO');
    INSERTAR_TAREA(CIA => 1, PYTO => 2, EMP => 5, NOMBRE => 'Asfaltado de calzada principal', DESC_TAREA => 'Supervisión de temperatura, compactación y textura', FECHA_INI => TO_DATE('2023-05-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'PENDIENTE');

    -- Tareas Proyecto 3 - Sistema de Riego
    INSERTAR_TAREA(CIA => 1, PYTO => 3, EMP => 4, NOMBRE => 'Diseño de red de canalización', DESC_TAREA => 'Cálculo de diámetros, caudales y presiones', FECHA_INI => TO_DATE('2023-02-15', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2023-03-30', 'YYYY-MM-DD'), ESTADO => 'COMPLETADA');
    INSERTAR_TAREA(CIA => 1, PYTO => 3, EMP => 5, NOMBRE => 'Instalación de tubería principal', DESC_TAREA => 'Tendido y soldadura de tuberías de PVC', FECHA_INI => TO_DATE('2023-04-01', 'YYYY-MM-DD'), FECHA_FIN => NULL, ESTADO => 'EN_PROGRESO');

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar TAREAS DEL PERSONAL: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 12. INSERTAR EVALUACIONES DE DESEMPEÑO - Usando INSERTAR_EVALUACION
-- ==================================================================

BEGIN
    INSERTAR_EVALUACION(CIA => 1, EMP => 2, PYTO => 1, EVALUADOR => 2, PUNT_TOTAL => 92.50, COMP_TEC => 95.00, COMP_BLAND => 90.00, CUMP_OBJ => 92.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 3, PYTO => 1, EVALUADOR => 2, PUNT_TOTAL => 88.75, COMP_TEC => 90.00, COMP_BLAND => 87.00, CUMP_OBJ => 88.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 4, PYTO => 1, EVALUADOR => 3, PUNT_TOTAL => 91.00, COMP_TEC => 93.00, COMP_BLAND => 88.50, CUMP_OBJ => 90.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 5, PYTO => 1, EVALUADOR => 3, PUNT_TOTAL => 85.50, COMP_TEC => 87.00, COMP_BLAND => 83.00, CUMP_OBJ => 85.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 6, PYTO => 1, EVALUADOR => 2, PUNT_TOTAL => 89.25, COMP_TEC => 91.00, COMP_BLAND => 86.00, CUMP_OBJ => 90.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 7, PYTO => 2, EVALUADOR => 2, PUNT_TOTAL => 87.75, COMP_TEC => 85.00, COMP_BLAND => 89.00, CUMP_OBJ => 89.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 3, PYTO => 2, EVALUADOR => 2, PUNT_TOTAL => 90.50, COMP_TEC => 92.00, COMP_BLAND => 88.00, CUMP_OBJ => 91.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 4, PYTO => 1, EVALUADOR => 3, PUNT_TOTAL => 93.00, COMP_TEC => 95.00, COMP_BLAND => 91.00, CUMP_OBJ => 93.00);
    INSERTAR_EVALUACION(CIA => 1, EMP => 10, PYTO => 4, EVALUADOR => 1, PUNT_TOTAL => 94.50, COMP_TEC => 96.00, COMP_BLAND => 92.00, CUMP_OBJ => 94.00);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar EVALUACIONES DE DESEMPEÑO: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 13. INSERTAR SERVICIOS DE PROVEEDORES - Usando INSERTAR_SERVICIO
-- ==================================================================
BEGIN
    INSERTAR_SERVICIO(CIA => 1, PROV => 16, NOMBRE => 'Suministro de Cemento Portland Tipo I', DESC_SERV => 'Cemento de alta calidad para obras de ingeniería civil', DOC => NULL);
    INSERTAR_SERVICIO(CIA => 1, PROV => 16, NOMBRE => 'Cemento Portland Tipo V - Resistencia a Sulfatos', DESC_SERV => 'Ideal para ambientes agresivos y obras hidráulicas', DOC => NULL);

    INSERTAR_SERVICIO(CIA => 1, PROV => 17, NOMBRE => 'Acero de Refuerzo - Barras Corrugadas', DESC_SERV => 'Acero grado 60 y 75 para estructuras de concreto armado', DOC => NULL);
    INSERTAR_SERVICIO(CIA => 1, PROV => 17, NOMBRE => 'Estructuras de Acero - Perfiles y Platinas', DESC_SERV => 'Fabricación de vigas, columnas y perfiles especiales', DOC => NULL);

    INSERTAR_SERVICIO(CIA => 1, PROV => 18, NOMBRE => 'Tuberías de PVC - Diversos diámetros', DESC_SERV => 'Sistema de riego y drenaje en proyectos agrícolas', DOC => NULL);
    INSERTAR_SERVICIO(CIA => 1, PROV => 18, NOMBRE => 'Sistemas de Bombeo Hidráulico', DESC_SERV => 'Equipos de bombeo para sistemas de riego', DOC => NULL);

    INSERTAR_SERVICIO(CIA => 1, PROV => 19, NOMBRE => 'Alquiler de Retroexcavadora CAT 320', DESC_SERV => 'Equipos pesados para excavación y movimiento de tierra', DOC => NULL);
    INSERTAR_SERVICIO(CIA => 1, PROV => 19, NOMBRE => 'Alquiler de Grúa Torre - Capacidad 20 Ton', DESC_SERV => 'Izaje de cargas en construcción vertical', DOC => NULL);

    INSERTAR_SERVICIO(CIA => 1, PROV => 20, NOMBRE => 'Servicios de Demolición Controlada', DESC_SERV => 'Demolición con técnicas modernas y reciclaje de materiales', DOC => NULL);
    INSERTAR_SERVICIO(CIA => 1, PROV => 20, NOMBRE => 'Control de Polvo y Compactación de Suelos', DESC_SERV => 'Técnicas especializadas en obra civil', DOC => NULL);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar SERVICIOS DE PROVEEDORES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 14. INSERTAR CONTRATOS CON PROVEEDORES - Usando INSERTAR_CONTRATO
-- ==================================================================

BEGIN
    INSERTAR_CONTRATO(CIA => 1, PROV => 16, PYTO => 1, NUM_CONTRATO => 'PROV-001-2023', TIPO => 'SUMINISTROS', FECHA_INI => TO_DATE('2023-01-15', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2024-01-15', 'YYYY-MM-DD'), MONTO => 800000.00, MONEDA => 'PEN', DOC => NULL);
    INSERTAR_CONTRATO(CIA => 1, PROV => 16, PYTO => 1, NUM_CONTRATO => 'PROV-002-2023', TIPO => 'SUMINISTROS', FECHA_INI => TO_DATE('2023-01-20', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2024-01-20', 'YYYY-MM-DD'), MONTO => 1200000.00, MONEDA => 'PEN', DOC => NULL);
    INSERTAR_CONTRATO(CIA => 1, PROV => 17, PYTO => 3, NUM_CONTRATO => 'PROV-003-2023', TIPO => 'SERVICIOS', FECHA_INI => TO_DATE('2023-02-10', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2025-02-10', 'YYYY-MM-DD'), MONTO => 450000.00, MONEDA => 'PEN', DOC => NULL);
    INSERTAR_CONTRATO(CIA => 1, PROV => 18, PYTO => 1, NUM_CONTRATO => 'PROV-004-2023', TIPO => 'SERVICIOS', FECHA_INI => TO_DATE('2023-01-25', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2024-06-30', 'YYYY-MM-DD'), MONTO => 600000.00, MONEDA => 'PEN', DOC => NULL);
    INSERTAR_CONTRATO(CIA => 1, PROV => 19, PYTO => 2, NUM_CONTRATO => 'PROV-005-2023', TIPO => 'SERVICIOS', FECHA_INI => TO_DATE('2023-03-01', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2024-02-29', 'YYYY-MM-DD'), MONTO => 350000.00, MONEDA => 'PEN', DOC => NULL);

    -- Contratos adicionales para proyectos 3 y 4
    INSERTAR_CONTRATO(CIA => 1, PROV => 16, PYTO => 3, NUM_CONTRATO => 'PROV-001-2023-B', TIPO => 'SUMINISTROS', FECHA_INI => TO_DATE('2023-02-10', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2025-02-10', 'YYYY-MM-DD'), MONTO => 500000.00, MONEDA => 'PEN', DOC => NULL);
    INSERTAR_CONTRATO(CIA => 1, PROV => 20, PYTO => 4, NUM_CONTRATO => 'PROV-002-2024', TIPO => 'SUMINISTROS', FECHA_INI => TO_DATE('2024-01-05', 'YYYY-MM-DD'), FECHA_FIN => TO_DATE('2025-01-05', 'YYYY-MM-DD'), MONTO => 900000.00, MONEDA => 'PEN', DOC => NULL);
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar CONTRATOS CON PROVEEDORES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 15. INSERTAR ACTIVIDADES DE PROVEEDORES - Usando INSERTAR_ACTIVIDAD
-- ==================================================================

BEGIN
    -- Actividades Contrato 1 (Cemento Lima - Proyecto 1: Puente Lima-Callao)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 1, DESC_ACT => 'Entrega de 500 bolsas de Cemento Portland Tipo I', FECHA => TO_DATE('2023-01-20', 'YYYY-MM-DD'), MONTO => 50000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Entrega conforme a especificaciones');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 1, DESC_ACT => 'Entrega de 800 bolsas de Cemento Portland Tipo I', FECHA => TO_DATE('2023-02-15', 'YYYY-MM-DD'), MONTO => 80000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Lotes controlados de calidad');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 1, DESC_ACT => 'Entrega de 600 bolsas de Cemento Portland Tipo I', FECHA => TO_DATE('2023-03-20', 'YYYY-MM-DD'), MONTO => 60000.00, ESTADO => 'EN_PROGRESO', DOC => NULL, OBS => 'En tránsito');

    -- Actividades Contrato 2 (Aceros y Estructuras - Proyecto 1: Puente Lima-Callao)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 2, DESC_ACT => 'Entrega de 50 TN de Acero Corrugado Fy=4200 Kg/cm2', FECHA => TO_DATE('2023-01-25', 'YYYY-MM-DD'), MONTO => 300000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Certificados de prueba incluidos');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 2, DESC_ACT => 'Fabricación de vigas de acero para marcos estructurales', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), MONTO => 450000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Ajuste a especificaciones técnicas');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 1, CONTRATO => 2, DESC_ACT => 'Montaje de estructura de acero en puente', FECHA => TO_DATE('2023-04-15', 'YYYY-MM-DD'), MONTO => 450000.00, ESTADO => 'EN_PROGRESO', DOC => NULL, OBS => 'En ejecución - Fase 2');

    -- Actividades Contrato 3 (Suministros Hidrodinámicos - Proyecto 3: Sistema Riego Cusco)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 17, PYTO => 3, CONTRATO => 3, DESC_ACT => 'Entrega de 5 KM de Tubería PVC D=200mm', FECHA => TO_DATE('2023-02-20', 'YYYY-MM-DD'), MONTO => 100000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Almacenado en obra');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 17, PYTO => 3, CONTRATO => 3, DESC_ACT => 'Suministro e instalación de Bomba Centrífuga 10 HP', FECHA => TO_DATE('2023-03-15', 'YYYY-MM-DD'), MONTO => 75000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Pruebas de funcionamiento exitosas');

    -- Actividades Contrato 4 (Equipos Pesados - Proyecto 1: Puente Lima-Callao)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 18, PYTO => 1, CONTRATO => 4, DESC_ACT => 'Alquiler de Retroexcavadora CAT 320 - 60 días', FECHA => TO_DATE('2023-02-01', 'YYYY-MM-DD'), MONTO => 240000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Devuelto en buen estado');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 18, PYTO => 1, CONTRATO => 4, DESC_ACT => 'Alquiler de Grúa Torre 20 Ton - 120 días', FECHA => TO_DATE('2023-03-01', 'YYYY-MM-DD'), MONTO => 360000.00, ESTADO => 'EN_PROGRESO', DOC => NULL, OBS => 'En uso - Continúa montaje estructural');

    -- Actividades Contrato 5 (Servicios Especializados - Proyecto 2: Carretera Panamericana)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 19, PYTO => 2, CONTRATO => 5, DESC_ACT => 'Demolición de estructura antigua - 2000 m2', FECHA => TO_DATE('2023-03-10', 'YYYY-MM-DD'), MONTO => 150000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Material reciclado y clasificado');
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 19, PYTO => 2, CONTRATO => 5, DESC_ACT => 'Control de polvo y compactación de terreno - 5000 m2', FECHA => TO_DATE('2023-04-01', 'YYYY-MM-DD'), MONTO => 100000.00, ESTADO => 'EN_PROGRESO', DOC => NULL, OBS => 'En ejecución');

    -- Actividades Contrato 6 (Cemento Lima - Proyecto 3: Sistema Riego Cusco)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 16, PYTO => 3, CONTRATO => 6, DESC_ACT => 'Entrega de 400 bolsas de Cemento Portland Tipo I', FECHA => TO_DATE('2023-03-01', 'YYYY-MM-DD'), MONTO => 40000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Almacenado en sitio');

    -- Actividades Contrato 7 (Aceros y Estructuras - Proyecto 4: Hospital Lima)
    INSERTAR_ACTIVIDAD(CIA => 1, PROV => 20, PYTO => 4, CONTRATO => 7, DESC_ACT => 'Entrega de 30 TN de Acero Corrugado', FECHA => TO_DATE('2024-01-15', 'YYYY-MM-DD'), MONTO => 200000.00, ESTADO => 'COMPLETADA', DOC => NULL, OBS => 'Certificados de calidad adjuntos');
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar ACTIVIDADES DE PROVEEDORES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 16. INSERTAR DOCUMENTOS DE PROVEEDORES - Usando INSERTAR_DOCUMENTO
-- ==================================================================

BEGIN
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 16, TIPO_DOC => 'RUC', NUM_DOC => '20123456789', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2020-01-15', 'YYYY-MM-DD'), FECHA_VENC => NULL);
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 16, TIPO_DOC => 'CERTIFICACION', NUM_DOC => 'ISO 9001:2015', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2022-05-20', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2025-05-20', 'YYYY-MM-DD'));
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 16, TIPO_DOC => 'LICENCIA', NUM_DOC => 'Licencia de Funcionamiento - Municipalidad de Lima', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2023-01-10', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2024-01-09', 'YYYY-MM-DD'));

    INSERTAR_DOCUMENTO(CIA => 1, PROV => 17, TIPO_DOC => 'RUC', NUM_DOC => '20234567890', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2019-06-01', 'YYYY-MM-DD'), FECHA_VENC => NULL);
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 17, TIPO_DOC => 'CERTIFICACION', NUM_DOC => 'Certificado de Acreditación ASTM', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2022-08-15', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2025-08-15', 'YYYY-MM-DD'));
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 17, TIPO_DOC => 'SEGURO', NUM_DOC => 'Póliza de Responsabilidad Civil Extracontractual', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2023-01-01', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2024-12-31', 'YYYY-MM-DD'));

    INSERTAR_DOCUMENTO(CIA => 1, PROV => 18, TIPO_DOC => 'RUC', NUM_DOC => '20345678901', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2018-03-10', 'YYYY-MM-DD'), FECHA_VENC => NULL);
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 18, TIPO_DOC => 'CERTIFICACION', NUM_DOC => 'Certificado de Calidad PVC Tipo 2', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2023-02-01', 'YYYY-MM-DD'), FECHA_VENC => NULL);

    INSERTAR_DOCUMENTO(CIA => 1, PROV => 19, TIPO_DOC => 'RUC', NUM_DOC => '20456789012', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2015-07-20', 'YYYY-MM-DD'), FECHA_VENC => NULL);
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 19, TIPO_DOC => 'SEGURO', NUM_DOC => 'Póliza de Seguro de Equipos', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2023-01-05', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2024-01-04', 'YYYY-MM-DD'));

    INSERTAR_DOCUMENTO(CIA => 1, PROV => 20, TIPO_DOC => 'RUC', NUM_DOC => '20567890123', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2017-11-30', 'YYYY-MM-DD'), FECHA_VENC => NULL);
    INSERTAR_DOCUMENTO(CIA => 1, PROV => 20, TIPO_DOC => 'CERTIFICACION', NUM_DOC => 'OHSAS 18001 - Seguridad Ocupacional', ARCHIVO => HEXTORAW('25504446'), TIPO_ARCH => 'PDF', FECHA_EMIS => TO_DATE('2022-09-10', 'YYYY-MM-DD'), FECHA_VENC => TO_DATE('2025-09-10', 'YYYY-MM-DD'));
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar DOCUMENTOS DE PROVEEDORES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 17. INSERTAR COMPROBANTES DE PAGO A PROVEEDORES - Usando INSERTAR_COMPROBANTE_PROVEEDOR
-- ==================================================================

BEGIN
    -- Comprobantes de pago para Proyecto 1 - Cemento Lima
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 16, NUM_COMP => 'CP-001-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-02-20', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 50000.00, IMPNETOMN => 50000.00, IMPIGVMN => 9000.00, IMPTOTALMN => 59000.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-02-25', 'YYYY-MM-DD'), DESABONO => 'Pago por entrega de cemento Portland Tipo I - Lote 1', SEMILLA => 12345, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 16, NUM_COMP => 'CP-002-2023-002', PYTO => 1, NROPAGO => 2, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-03-10', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 80000.00, IMPNETOMN => 80000.00, IMPIGVMN => 14400.00, IMPTOTALMN => 94400.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-15', 'YYYY-MM-DD'), DESABONO => 'Pago por entrega de cemento Portland Tipo I - Lote 2', SEMILLA => 12346, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para Proyecto 1 - Aceros y Estructuras
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 16, NUM_COMP => 'CP-003-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-02-15', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 300000.00, IMPNETOMN => 300000.00, IMPIGVMN => 54000.00, IMPTOTALMN => 354000.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-02-20', 'YYYY-MM-DD'), DESABONO => 'Pago por suministro de acero corrugado Fy=4200 - 50 TN', SEMILLA => 12347, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 16, NUM_COMP => 'CP-004-2023-002', PYTO => 1, NROPAGO => 2, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-03-20', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 450000.00, IMPNETOMN => 450000.00, IMPIGVMN => 81000.00, IMPTOTALMN => 531000.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-25', 'YYYY-MM-DD'), DESABONO => 'Pago por fabricación e instalación de vigas de acero', SEMILLA => 12348, TABESTADO => '001', ESTADO => '1');
    -- Comprobantes de pago para Proyecto 2 - Suministros Hidrodinámicos
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 17, NUM_COMP => 'CP-005-2023-001', PYTO => 2, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-03-05', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 100000.00, IMPNETOMN => 100000.00, IMPIGVMN => 18000.00, IMPTOTALMN => 118000.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-10', 'YYYY-MM-DD'), DESABONO => 'Pago por suministro de tubería PVC - 5 KM', SEMILLA => 12349, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 17, NUM_COMP => 'CP-006-2023-002', PYTO => 2, NROPAGO => 2, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-04-01', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 75000.00, IMPNETOMN => 75000.00, IMPIGVMN => 13500.00, IMPTOTALMN => 88500.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-05', 'YYYY-MM-DD'), DESABONO => 'Pago por suministro e instalación de bomba centrífuga 10 HP', SEMILLA => 12350, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para Proyecto 1 - Equipos Pesados
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 18, NUM_COMP => 'CP-007-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 240000.00, IMPNETOMN => 240000.00, IMPIGVMN => 43200.00, IMPTOTALMN => 283200.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-05', 'YYYY-MM-DD'), DESABONO => 'Pago por alquiler de retroexcavadora CAT 320 - 60 días', SEMILLA => 12351, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para Proyecto 2 - Servicios Especializados
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 19, NUM_COMP => 'CP-008-2023-001', PYTO => 2, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-04-05', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 150000.00, IMPNETOMN => 150000.00, IMPIGVMN => 27000.00, IMPTOTALMN => 177000.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-10', 'YYYY-MM-DD'), DESABONO => 'Pago por servicios de demolición controlada - 2000 m2', SEMILLA => 12352, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para Proyecto 1 (nuevamente) - Cemento Lima
    INSERTAR_COMPROBANTE_PROVEEDOR(CIA => 1, PROV => 20, NUM_COMP => 'CP-009-2023-003', PYTO => 1, NROPAGO => 3, TCOMPPAGO => '004', ECOMPPAGO => '001', FECHA => TO_DATE('2023-03-15', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 40000.00, IMPNETOMN => 40000.00, IMPIGVMN => 7200.00, IMPTOTALMN => 47200.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-20', 'YYYY-MM-DD'), DESABONO => 'Pago por entrega de cemento Portland Tipo I adicional', SEMILLA => 12353, TABESTADO => '001', ESTADO => '1');

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar COMPROBANTES DE PAGO A PROVEEDORES: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 18. INSERTAR COMPROBANTES DE PAGO A EMPLEADOS - Usando INSERTAR_COMPROBANTE_EMPLEADO
-- ==================================================================

BEGIN
    -- Comprobantes de pago para empleado 1 (Carlos Rodriguez) - Proyecto 1
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 1, NUM_COMP => 'CPE-001-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 15000.00, IMPNETOMN => 15000.00, IMPIGVMN => 2700.00, IMPTOTALMN => 17700.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Supervisión de proyecto - Febrero 2023', SEMILLA => 12355, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 1, NUM_COMP => 'CPE-002-2023-002', PYTO => 1, NROPAGO => 2, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-03-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 15000.00, IMPNETOMN => 15000.00, IMPIGVMN => 2700.00, IMPTOTALMN => 17700.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Supervisión de proyecto - Marzo 2023', SEMILLA => 12356, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para empleado 2 (Juan Torres) - Proyecto 1
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 2, NUM_COMP => 'CPE-003-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 12000.00, IMPNETOMN => 12000.00, IMPIGVMN => 2160.00, IMPTOTALMN => 14160.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Ingeniería de diseño - Febrero 2023', SEMILLA => 12357, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para empleado 3 (María García) - Proyecto 1
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 3, NUM_COMP => 'CPE-005-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 11000.00, IMPNETOMN => 11000.00, IMPIGVMN => 1980.00, IMPTOTALMN => 12980.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Control de calidad - Febrero 2023', SEMILLA => 12359, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 3, NUM_COMP => 'CPE-006-2023-002', PYTO => 1, NROPAGO => 2, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-03-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 11000.00, IMPNETOMN => 11000.00, IMPIGVMN => 1980.00, IMPTOTALMN => 12980.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Control de calidad - Marzo 2023', SEMILLA => 12360, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para empleado 4 (Roberto Fernández) - Proyecto 1 y 2
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 4, NUM_COMP => 'CPE-007-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-02-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 13000.00, IMPNETOMN => 13000.00, IMPIGVMN => 2340.00, IMPTOTALMN => 15340.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-03-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Ingeniería de puentes - Febrero 2023', SEMILLA => 12361, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 4, NUM_COMP => 'CPE-008-2023-002', PYTO => 2, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-03-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 10000.00, IMPNETOMN => 10000.00, IMPIGVMN => 1800.00, IMPTOTALMN => 11800.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Supervisión carretera - Marzo 2023', SEMILLA => 12362, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para empleado 5 (Martín Quispe) - Proyecto 1
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 5, NUM_COMP => 'CPE-009-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-03-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 9000.00, IMPNETOMN => 9000.00, IMPIGVMN => 1620.00, IMPTOTALMN => 10620.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-04-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Topografía y diseño - Marzo 2023', SEMILLA => 12363, TABESTADO => '001', ESTADO => '1');
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 5, NUM_COMP => 'CPE-010-2023-002', PYTO => 2, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-04-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 9000.00, IMPNETOMN => 9000.00, IMPIGVMN => 1620.00, IMPTOTALMN => 10620.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-05-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Topografía proyecto 2 - Abril 2023', SEMILLA => 12364, TABESTADO => '001', ESTADO => '1');

    -- Comprobantes de pago para empleado 20 (Fernando Mendoza)
    INSERTAR_COMPROBANTE_EMPLEADO(CIA => 1, EMP => 6, NUM_COMP => 'CPE-011-2023-001', PYTO => 1, NROPAGO => 1, TCOMPPAGO => '004', ECOMPPAGO => '002', FECHA => TO_DATE('2023-04-28', 'YYYY-MM-DD'), TMONEDA => '003', EMONEDA => '001', CAMBIO => 1.0000, IMPMO => 18000.00, IMPNETOMN => 18000.00, IMPIGVMN => 3240.00, IMPTOTALMN => 21240.00, FOTOCP => NULL, FOTOABONO => NULL, FECHABONO => TO_DATE('2023-05-05', 'YYYY-MM-DD'), DESABONO => 'Pago de honorarios - Director de proyecto - Abril 2023', SEMILLA => 12365, TABESTADO => '001', ESTADO => '1');

    COMMIT;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error al insertar COMPROBANTES DE PAGO A EMPLEADOS: ' || SQLERRM);
    ROLLBACK;
END;
/

-- ==================================================================
-- 19. RESUMEN Y VALIDACIÓN DE DATOS INSERTADOS
-- ==================================================================

SELECT 'DATOS CARGADOS EXITOSAMENTE CON PROCEDIMIENTOS ALMACENADOS' AS ESTADO FROM DUAL;

SELECT COUNT(*) AS TOTAL_CIAS FROM CIA;
SELECT COUNT(*) AS TOTAL_USUARIOS FROM usuarios;
SELECT COUNT(*) AS TOTAL_AREAS FROM areas;
SELECT COUNT(*) AS TOTAL_CARGOS FROM cargos_areas;
SELECT COUNT(*) AS TOTAL_PERSONAS FROM PERSONA;
SELECT COUNT(*) AS TOTAL_EMPLEADOS FROM EMPLEADO;
SELECT COUNT(*) AS TOTAL_CLIENTES FROM CLIENTE;
SELECT COUNT(*) AS TOTAL_PROVEEDORES FROM PROVEEDOR;
SELECT COUNT(*) AS TOTAL_PROYECTOS FROM PROYECTO;
SELECT COUNT(*) AS TOTAL_ESPECIALIDADES FROM especialidades_personal;
SELECT COUNT(*) AS TOTAL_GRADOS FROM grados_academicos;
SELECT COUNT(*) AS TOTAL_EXPERIENCIAS FROM experiencia_laboral;
SELECT COUNT(*) AS TOTAL_ASIGNACIONES_PROYECTO FROM personal_proyectos;
SELECT COUNT(*) AS TOTAL_TAREAS FROM tareas_personal;
SELECT COUNT(*) AS TOTAL_EVALUACIONES FROM evaluaciones_desempeno;
SELECT COUNT(*) AS TOTAL_SERVICIOS FROM servicios_proveedor;
SELECT COUNT(*) AS TOTAL_CONTRATOS FROM contratos_proveedor;
SELECT COUNT(*) AS TOTAL_ACTIVIDADES FROM actividades_proveedor;
SELECT COUNT(*) AS TOTAL_DOCUMENTOS FROM documentos_proveedor;
SELECT COUNT(*) AS TOTAL_COMPROBANTES_PROVEEDOR FROM COMP_PAGOCAB;
SELECT COUNT(*) AS TOTAL_COMPROBANTES_EMPLEADO FROM COMP_PAGOEMPLEADO;

COMMIT;


-- ==================================================================
-- DATOS ADICIONALES PARA LAS TABLAS DEL PROFESOR
-- Sistema de Partidas Presupuestales y Comprobantes de Venta
-- ==================================================================

-- ==================================================================
-- TRUNCATE DE TABLAS PARA REINSERCIÓN
-- ==================================================================

TRUNCATE TABLE DPROY_PARTIDA_MEZCLA;
TRUNCATE TABLE PROY_PARTIDA_MEZCLA;
TRUNCATE TABLE PROY_PARTIDA;
TRUNCATE TABLE PARTIDA_MEZCLA;
TRUNCATE TABLE VTACOMP_PAGODET;
TRUNCATE TABLE VTACOMP_PAGOCAB;
TRUNCATE TABLE COMP_PAGODET;
TRUNCATE TABLE COMP_PAGOCAB;
TRUNCATE TABLE COMP_PAGOEMPLEADO_DET;
TRUNCATE TABLE PARTIDA;


-- ============================================================================
-- PARTIDAS DE INGRESO (I) - ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- NIVEL 1: INGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1000, 'ING-000', 'INGRESOS REALES', 'N', 1, '002', 'UND', 1000, 1);

-- NIVEL 2: INGRESOS POR VENTA (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1100, 'ING-100', 'INGRESOS POR VENTA', 'N', 2, '002', 'UND', 1100, 1);

-- NIVEL 3: Detalles de INGRESOS POR VENTA (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1101, 'ING-101', 'VENTA DE ENERGIA', 'N', 3, '002', 'UND', 1101, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1102, 'ING-102', 'SERVICIOS TECNICOS', 'N', 3, '002', 'UND', 1102, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1103, 'ING-103', 'CONSULTORIA', 'N', 3, '002', 'UND', 1103, 1);

-- NIVEL 2: INGRESOS POR PRESTAMOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1200, 'ING-200', 'INGRESOS POR PRESTAMOS', 'N', 2, '002', 'UND', 1200, 1);

-- NIVEL 3: Detalles de INGRESOS POR PRESTAMOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1201, 'ING-201', 'PRESTAMOS BANCARIOS', 'N', 3, '002', 'UND', 1201, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1202, 'ING-202', 'PRESTAMOS PRIVADOS', 'N', 3, '002', 'UND', 1202, 1);

-- NIVEL 2: OTROS INGRESOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'I', 1300, 'ING-300', 'OTROS INGRESOS', 'N', 2, '002', 'UND', 1300, 1);

-- NIVEL 3: Detalles de OTROS INGRESOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'I', 1301, 'ING-301', 'INTERESES GANADOS', 'N', 3, '002', 'UND', 1301, 1);
INSERT INTO PARTIDA VALUES (1, 'I', 1302, 'ING-302', 'ALQUILERES', 'N', 3, '002', 'UND', 1302, 1);

-- ============================================================================
-- PARTIDAS DE EGRESO (E) - ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- NIVEL 1: EGRESOS (Categoría principal - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2000, 'EGR-000', 'EGRESOS REALES', 'N', 1, '002', 'UND', 2000, 1);

-- NIVEL 2: COSTOS DIRECTOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2100, 'EGR-100', 'COSTOS DIRECTOS', 'N', 2, '002', 'UND', 2100, 1);

-- NIVEL 3: Detalles de COSTOS DIRECTOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2101, 'EGR-101', 'MATERIALES DE CONSTRUCCION', 'N', 3, '002', 'UND', 2101, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2102, 'EGR-102', 'MANO DE OBRA', 'N', 3, '002', 'UND', 2102, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2103, 'EGR-103', 'EQUIPOS Y MAQUINARIA', 'N', 3, '002', 'UND', 2103, 1);
-- PARA EMPLEADO
INSERT INTO PARTIDA VALUES (1, 'E', 2104, 'EGR-104', 'HONORARIOS', 'N', 3, '002', 'UND', 2104, 1);

-- NIVEL 2: GASTOS ADMINISTRATIVOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2200, 'EGR-200', 'GASTOS ADMINISTRATIVOS', 'N', 2, '002', 'UND', 2200, 1);

-- NIVEL 3: Detalles de GASTOS ADMINISTRATIVOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2201, 'EGR-201', 'SUELDOS ADMINISTRATIVOS', 'N', 3, '002', 'UND', 2201, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2202, 'EGR-202', 'SERVICIOS PROFESIONALES', 'N', 3, '002', 'UND', 2202, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2203, 'EGR-203', 'ALQUILER DE OFICINA', 'N', 3, '002', 'UND', 2203, 1);

-- NIVEL 2: SERVICIOS TECNICOS (Subcategoría - NO usar en comprobantes)
INSERT INTO PARTIDA VALUES (1, 'E', 2300, 'EGR-300', 'SERVICIOS TECNICOS', 'N', 2, '002', 'UND', 2300, 1);

-- NIVEL 3: Detalles de SERVICIOS TECNICOS (USAR EN COMPROBANTES)
INSERT INTO PARTIDA VALUES (1, 'E', 2301, 'EGR-301', 'INGENIERIA ELECTRICA', 'N', 3, '002', 'UND', 2301, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2302, 'EGR-302', 'INGENIERIA CIVIL', 'N', 3, '002', 'UND', 2302, 1);
INSERT INTO PARTIDA VALUES (1, 'E', 2303, 'EGR-303', 'SUPERVISION DE OBRA', 'N', 3, '002', 'UND', 2303, 1);

-- ============================================================================
-- TABLA PROY_PARTIDA - ASIGNAR PARTIDAS A PROYECTOS
-- Solo se asignan partidas de NIVEL 3 (último nivel) a los proyectos
-- ============================================================================

-- Proyecto1 (Hidroeléctrico) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'I', 1101, 'ING-101', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'I', 1102, 'ING-102', 'N', 3, '002', '001', '001', 1);

-- Proyecto1 (Hidroeléctrico) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 2102, 'EGR-102', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 2104, 'EGR-104', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 2301, 'EGR-301', 'N', 3, '002', '001', '001', 1);

-- Proyecto 102 (Planta Energética) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'I', 1102, 'ING-102', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'I', 1103, 'ING-103', 'N', 3, '002', '001', '001', 1);

-- Proyecto 102 (Planta Energética) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 2302, 'EGR-302', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 2303, 'EGR-303', 'N', 3, '002', '001', '001', 1);

-- Proyecto 103 (Red Eléctrica) - INGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'I', 1101, 'ING-101', 'N', 3, '002', '001', '001', 1);

-- Proyecto 103 (Red Eléctrica) - EGRESOS Nivel 3
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 2101, 'EGR-101', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 2102, 'EGR-102', 'N', 3, '002', '001', '001', 1);
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 2201, 'EGR-201', 'N', 3, '002', '001', '001', 1);


-- ============================================================================
-- TABLA PROY_PARTIDA_MEZCLA - ASIGNAR PARTIDAS NIVEL 3 A PROYECTOS
-- Solo se asignan las partidas de NIVEL 3 (último nivel) a los proyectos
-- PadCodPartida indica el padre de nivel 2
-- ============================================================================

-- Proyecto1 (Hidroeléctrico) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1101, 1, 1100, '002', 'UND', 3, 1, 1000.00, 500, 500000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1102, 2, 1100, '002', 'UND', 3, 2, 1500.00, 300, 450000.00);

-- Proyecto1 (Hidroeléctrico) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 500.00, 600, 300000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 2102, 2, 2100, '002', 'UND', 3, 2, 300.00, 400, 120000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 2104, 3, 2100, '002', 'UND', 3, 3, 1050.00, 2, 2100.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 2301, 4, 2300, '002', 'UND', 3, 4, 800.00, 250, 200000.00);

-- Proyecto 102 (Planta Energética) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'I', 1, 1102, 1, 1100, '002', 'UND', 3, 1, 800.00, 300, 240000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'I', 1, 1103, 2, 1100, '002', 'UND', 3, 2, 1200.00, 200, 240000.00);

-- Proyecto 102 (Planta Energética) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 450.00, 500, 225000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 2302, 2, 2300, '002', 'UND', 3, 2, 900.00, 180, 162000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 2303, 3, 2300, '002', 'UND', 3, 3, 700.00, 150, 105000.00);

-- Proyecto 103 (Red Eléctrica) - INGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'I', 1, 1101, 1, 1100, '002', 'UND', 3, 1, 1200.00, 400, 480000.00);

-- Proyecto 103 (Red Eléctrica) - EGRESOS (Nivel 3)
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 2101, 1, 2100, '002', 'UND', 3, 1, 550.00, 500, 275000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 2102, 2, 2100, '002', 'UND', 3, 2, 350.00, 350, 122500.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 2201, 3, 2200, '002', 'UND', 3, 3, 400.00, 200, 80000.00);

COMMIT;

-- PARTIDAS PADRE (Nivel 1) - Categorías principales de construcción
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 1, '01000000', 'MATERIALES', 'S', 1, '012', 'GLB', 1, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 2, '02000000', 'MANO DE OBRA', 'S', 1, '012', 'GLB', 2, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 3, '03000000', 'EQUIPOS', 'S', 1, '012', 'GLB', 3, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 4, '04000000', 'SERVICIOS', 'S', 1, '012', 'GLB', 4, '1');

-- PARTIDAS HIJO (Nivel 2) - Subcategorías de Materiales
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 101, '01010000', 'CEMENTO', 'N', 2, '012', 'UND', 101, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 102, '01020000', 'ACERO', 'N', 2, '012', 'KG', 102, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 103, '01030000', 'AGREGADOS', 'N', 2, '012', 'M3', 103, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 104, '01040000', 'LADRILLOS', 'N', 2, '012', 'UND', 104, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 105, '01050000', 'TUBERIAS', 'N', 2, '012', 'MTS', 105, '1');

-- PARTIDAS DE EGRESO - Nivel 2 (Subcategorías de Mano de Obra)
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 201, '02010000', 'OPERARIOS', 'N', 2, '012', 'HH', 201, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 202, '02020000', 'OFICIALES', 'N', 2, '012', 'HH', 202, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 203, '02030000', 'PEONES', 'N', 2, '012', 'HH', 203, '1');

-- PARTIDAS DE EGRESO - Nivel 2 (Subcategorías de Equipos)
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 301, '03010000', 'EXCAVADORA', 'N', 2, '012', 'HM', 301, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 302, '03020000', 'MEZCLADORA', 'N', 2, '012', 'HM', 302, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 303, '03030000', 'GRUA', 'N', 2, '012', 'HM', 303, '1');

-- PARTIDAS DE EGRESO - Nivel 2 (Subcategorías de Servicios)
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 401, '04010000', 'TRANSPORTE', 'N', 2, '012', 'GLB', 401, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'E', 402, '04020000', 'CONSULTORIA', 'N', 2, '012', 'GLB', 402, '1');

-- PARTIDAS DE INGRESO (IngEgr = 'I') - Para comprobantes de venta
INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'I', 1001, '10010000', 'VALORIZ. OBRA CIVIL', 'S', 1, '012', 'GLB', 1001, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'I', 1002, '10020000', 'VALORIZ. ESTRUCTURAS', 'S', 1, '012', 'GLB', 1002, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'I', 2001, '20010000', 'VALORIZ. CARRETERAS', 'S', 1, '012', 'GLB', 2001, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'I', 3001, '30010000', 'VALORIZ. IRRIGACION', 'S', 1, '012', 'GLB', 3001, '1');

INSERT INTO PARTIDA (CodCia, IngEgr, CodPartida, CodPartidas, DesPartida, FlgCC, Nivel, TUniMed, EUniMed, Semilla, Vigente)
VALUES (1, 'I', 4001, '40010000', 'VALORIZ. EDIFICACION', 'S', 1, '012', 'GLB', 4001, '1');

COMMIT;

-- ==================================================================
-- 21. INSERTAR PROY_PARTIDA (Partidas asignadas a proyectos)
-- ==================================================================

-- Proyecto 1: Puente Lima-Callao - Partidas de Egreso
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 1, '01000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 101, '01010000', 'N', 2, 'UND', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 102, '01020000', 'N', 2, 'KG', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 2, '02000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'E', 201, '02010000', 'N', 2, 'HH', '011', '002', '1');

-- Proyecto 1: Puente Lima-Callao - Partidas de Ingreso
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'I', 1001, '10010000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 1, 1, 'I', 1002, '10020000', 'S', 1, 'GLB', '011', '002', '1');

-- Proyecto 2: Carretera Panamericana - Partidas de Egreso
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 1, '01000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 103, '01030000', 'N', 2, 'M3', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 3, '03000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'E', 301, '03010000', 'N', 2, 'HM', '011', '002', '1');

-- Proyecto 2: Carretera Panamericana - Partidas de Ingreso
INSERT INTO PROY_PARTIDA VALUES (1, 2, 1, 'I', 2001, '20010000', 'S', 1, 'GLB', '011', '002', '1');

-- Proyecto 3: Sistema Riego Cusco - Partidas de Egreso
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 1, '01000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 105, '01050000', 'N', 2, 'MTS', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'E', 4, '04000000', 'S', 1, 'GLB', '011', '002', '1');

-- Proyecto 3: Sistema Riego Cusco - Partidas de Ingreso
INSERT INTO PROY_PARTIDA VALUES (1, 3, 1, 'I', 3001, '30010000', 'S', 1, 'GLB', '011', '002', '1');

-- Proyecto 4: Hospital Lima - Partidas de Egreso
INSERT INTO PROY_PARTIDA VALUES (1, 4, 1, 'E', 1, '01000000', 'S', 1, 'GLB', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 4, 1, 'E', 104, '01040000', 'N', 2, 'UND', '011', '002', '1');
INSERT INTO PROY_PARTIDA VALUES (1, 4, 1, 'E', 2, '02000000', 'S', 1, 'GLB', '011', '002', '1');

-- Proyecto 4: Hospital Lima - Partidas de Ingreso
INSERT INTO PROY_PARTIDA VALUES (1, 4, 1, 'I', 4001, '40010000', 'S', 1, 'GLB', '011', '002', '1');

COMMIT;

-- ==================================================================
-- 22. INSERTAR COMPROBANTES DE VENTA (VTACOMP_PAGOCAB)
-- ==================================================================

-- Comprobantes de Venta para Proyecto 1 (Puente Lima-Callao) - Cliente: Municipalidad de Lima
INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-001', 1, 12, 1, '004', '001', TO_DATE('2023-02-15', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 2500000.00, 2500000.00, 450000.00, 2950000.00,
    NULL, NULL, TO_DATE('2023-02-20', 'YYYY-MM-DD'), 'Primer adelanto - Proyecto Puente Lima-Callao',
    20001, '011', '002'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-002', 1, 12, 2, '004', '001', TO_DATE('2023-04-30', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 5000000.00, 5000000.00, 900000.00, 5900000.00,
    NULL, NULL, TO_DATE('2023-05-05', 'YYYY-MM-DD'), 'Segundo pago - Avance de obra 30%',
    20002, '011', '002'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-003', 1, 12, 3, '004', '001', TO_DATE('2023-07-15', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 7500000.00, 7500000.00, 1350000.00, 8850000.00,
    NULL, NULL, NULL, NULL,
    20003, '011', '001'
);

-- Comprobantes de Venta para Proyecto 2 (Carretera Panamericana) - Cliente: MTC
INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-004', 2, 13, 1, '004', '001', TO_DATE('2023-04-01', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 1800000.00, 1800000.00, 324000.00, 2124000.00,
    NULL, NULL, TO_DATE('2023-04-10', 'YYYY-MM-DD'), 'Adelanto inicial - Rehabilitación Panamericana Norte',
    20004, '011', '002'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-005', 2, 13, 2, '004', '001', TO_DATE('2023-06-15', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 3600000.00, 3600000.00, 648000.00, 4248000.00,
    NULL, NULL, TO_DATE('2023-06-25', 'YYYY-MM-DD'), 'Segundo pago - Avance de obra 40%',
    20005, '011', '002'
);

-- Comprobantes de Venta para Proyecto 3 (Sistema Riego Cusco) - Cliente: Gobierno Regional Cusco
INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-006', 3, 14, 1, '004', '001', TO_DATE('2023-03-01', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 1200000.00, 1200000.00, 216000.00, 1416000.00,
    NULL, NULL, TO_DATE('2023-03-10', 'YYYY-MM-DD'), 'Adelanto - Sistema de Riego Integral Cusco',
    20006, '011', '002'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2023-007', 3, 14, 2, '004', '001', TO_DATE('2023-05-20', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 2400000.00, 2400000.00, 432000.00, 2832000.00,
    NULL, NULL, NULL, NULL,
    20007, '011', '001'
);

-- Comprobantes de Venta para Proyecto 4 (Hospital Lima) - Cliente: Junta Directiva Sector Vivienda
INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2024-001', 4, 15, 1, '004', '001', TO_DATE('2024-01-20', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 850000.00, 850000.00, 153000.00, 1003000.00,
    NULL, NULL, TO_DATE('2024-01-30', 'YYYY-MM-DD'), 'Adelanto inicial - Modernización Hospital Lima',
    20008, '011', '002'
);

INSERT INTO VTACOMP_PAGOCAB VALUES (
    1, 'VTA-2024-002', 4, 15, 2, '004', '001', TO_DATE('2024-03-15', 'YYYY-MM-DD'),
    '003', '001', 1.0000, 1700000.00, 1700000.00, 306000.00, 2006000.00,
    NULL, NULL, NULL, NULL,
    20009, '011', '001'
);

COMMIT;

-- ==================================================================
-- 23. INSERTAR DETALLE DE COMPROBANTES DE VENTA (VTACOMP_PAGODET)
-- ==================================================================

-- Detalle VTA-2023-001 (Proyecto 1 - Puente Lima-Callao)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-001', 1, 'I', 1001, 1500000.00, 270000.00, 1770000.00, 30001);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-001', 2, 'I', 1002, 1000000.00, 180000.00, 1180000.00, 30002);

-- Detalle VTA-2023-002 (Proyecto 1 - Puente Lima-Callao)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-002', 1, 'I', 1001, 3000000.00, 540000.00, 3540000.00, 30003);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-002', 2, 'I', 1002, 2000000.00, 360000.00, 2360000.00, 30004);

-- Detalle VTA-2023-003 (Proyecto 1 - Puente Lima-Callao)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-003', 1, 'I', 1001, 4500000.00, 810000.00, 5310000.00, 30005);
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-003', 2, 'I', 1002, 3000000.00, 540000.00, 3540000.00, 30006);

-- Detalle VTA-2023-004 (Proyecto 2 - Carretera Panamericana)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-004', 1, 'I', 2001, 1800000.00, 324000.00, 2124000.00, 30007);

-- Detalle VTA-2023-005 (Proyecto 2 - Carretera Panamericana)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-005', 1, 'I', 2001, 3600000.00, 648000.00, 4248000.00, 30008);

-- Detalle VTA-2023-006 (Proyecto 3 - Sistema Riego Cusco)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-006', 1, 'I', 3001, 1200000.00, 216000.00, 1416000.00, 30009);

-- Detalle VTA-2023-007 (Proyecto 3 - Sistema Riego Cusco)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2023-007', 1, 'I', 3001, 2400000.00, 432000.00, 2832000.00, 30010);

-- Detalle VTA-2024-001 (Proyecto 4 - Hospital Lima)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2024-001', 1, 'I', 4001, 850000.00, 153000.00, 1003000.00, 30011);

-- Detalle VTA-2024-002 (Proyecto 4 - Hospital Lima)
INSERT INTO VTACOMP_PAGODET VALUES (1, 'VTA-2024-002', 1, 'I', 4001, 1700000.00, 306000.00, 2006000.00, 30012);

COMMIT;

-- ==================================================================
-- 24. INSERTAR DETALLE DE COMPROBANTES DE PAGO (COMP_PAGODET)
-- ==================================================================
-- NOTA: Estos INSERTs están comentados porque dependen de COMP_PAGOCAB
-- que se llena mediante el procedimiento INSERTAR_COMPROBANTE_PROVEEDOR.
-- Si el procedimiento falla, estos detalles no tienen cabecera padre.
-- ==================================================================

-- Detalle para comprobantes de pago a proveedores
-- Vinculados con los comprobantes de COMP_PAGOCAB existentes

-- CP-001-2023-001 (Cemento Lima - Proyecto 1) - Proveedor 16
-- INSERT INTO COMP_PAGODET VALUES (1, 16, 'CP-001-2023-001', 1, 'E', 101, 50000.00, 9000.00, 59000.00, 40001);

-- CP-002-2023-002 (Cemento Lima - Proyecto 1) - Proveedor 16
-- INSERT INTO COMP_PAGODET VALUES (1, 16, 'CP-002-2023-002', 1, 'E', 101, 80000.00, 14400.00, 94400.00, 40002);

-- CP-003-2023-001 (Acero - Proyecto 1) - Proveedor 16
-- INSERT INTO COMP_PAGODET VALUES (1, 16, 'CP-003-2023-001', 1, 'E', 102, 300000.00, 54000.00, 354000.00, 40003);

-- CP-004-2023-002 (Vigas de acero - Proyecto 1) - Proveedor 16
-- INSERT INTO COMP_PAGODET VALUES (1, 16, 'CP-004-2023-002', 1, 'E', 102, 450000.00, 81000.00, 531000.00, 40004);

-- CP-005-2023-001 (Tubería PVC - Proyecto 2) - Proveedor 17
-- INSERT INTO COMP_PAGODET VALUES (1, 17, 'CP-005-2023-001', 1, 'E', 105, 100000.00, 18000.00, 118000.00, 40005);

-- CP-006-2023-002 (Bomba centrífuga - Proyecto 2) - Proveedor 17
-- INSERT INTO COMP_PAGODET VALUES (1, 17, 'CP-006-2023-002', 1, 'E', 301, 75000.00, 13500.00, 88500.00, 40006);

-- CP-007-2023-001 (Retroexcavadora - Proyecto 1) - Proveedor 18
-- INSERT INTO COMP_PAGODET VALUES (1, 18, 'CP-007-2023-001', 1, 'E', 301, 240000.00, 43200.00, 283200.00, 40007);

-- CP-008-2023-001 (Demolición - Proyecto 2) - Proveedor 19
-- INSERT INTO COMP_PAGODET VALUES (1, 19, 'CP-008-2023-001', 1, 'E', 401, 150000.00, 27000.00, 177000.00, 40008);

-- CP-009-2023-003 (Cemento adicional - Proyecto 1) - Proveedor 20
-- INSERT INTO COMP_PAGODET VALUES (1, 20, 'CP-009-2023-003', 1, 'E', 101, 40000.00, 7200.00, 47200.00, 40009);

COMMIT;

-- ==================================================================
-- 25. INSERTAR PARTIDA_MEZCLA (Composición de partidas)
-- ==================================================================

-- Mezcla para partida de MATERIALES (CodPartida=1)
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 1, 1, 0, '012', 'GLB', 0.00, 1, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 101, 1, 1, '012', 'UND', 25.00, 2, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 102, 1, 1, '012', 'KG', 4.50, 2, 2, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 103, 1, 1, '012', 'M3', 120.00, 2, 3, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 104, 1, 1, '012', 'UND', 0.80, 2, 4, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 105, 1, 1, '012', 'MTS', 15.00, 2, 5, '1');

-- Mezcla para partida de MANO DE OBRA (CodPartida=2)
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 2, 1, 0, '012', 'GLB', 0.00, 1, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 201, 1, 2, '012', 'HH', 25.00, 2, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 202, 1, 2, '012', 'HH', 18.00, 2, 2, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 203, 1, 2, '012', 'HH', 12.00, 2, 3, '1');

-- Mezcla para partida de EQUIPOS (CodPartida=3)
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 3, 1, 0, '012', 'GLB', 0.00, 1, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 301, 1, 3, '012', 'HM', 350.00, 2, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 302, 1, 3, '012', 'HM', 80.00, 2, 2, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 303, 1, 3, '012', 'HM', 500.00, 2, 3, '1');

-- Mezcla para partida de SERVICIOS (CodPartida=4)
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 4, 1, 0, '012', 'GLB', 0.00, 1, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 401, 1, 4, '012', 'GLB', 1500.00, 2, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'E', 402, 1, 4, '012', 'GLB', 5000.00, 2, 2, '1');

-- Mezcla para partidas de INGRESO
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 1001, 1, 0, '012', 'GLB', 0.00, 1, 1, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 1002, 1, 0, '012', 'GLB', 0.00, 1, 2, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 2001, 1, 0, '012', 'GLB', 0.00, 1, 3, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 3001, 1, 0, '012', 'GLB', 0.00, 1, 4, '1');
INSERT INTO PARTIDA_MEZCLA VALUES (1, 'I', 4001, 1, 0, '012', 'GLB', 0.00, 1, 5, '1');

COMMIT;

-- ==================================================================
-- 26. INSERTAR PROY_PARTIDA_MEZCLA (Mezcla de partidas por proyecto)
-- ==================================================================

-- Proyecto 1: Puente Lima-Callao - Partidas de Egreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 1, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 101, 1, 1, '012', 'UND', 2, 1, 25.00, 5000.000, 125000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 102, 1, 1, '012', 'KG', 2, 2, 4.50, 80000.000, 360000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 2, 1, 0, '012', 'GLB', 1, 2, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 201, 1, 2, '012', 'HH', 2, 1, 25.00, 8000.000, 200000.00);

-- Proyecto 1: Puente Lima-Callao - Partidas de Ingreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1001, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 15000000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1002, 1, 0, '012', 'GLB', 1, 2, 0.00, 1.000, 10000000.00);

-- Proyecto 2: Carretera Panamericana - Partidas de Egreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 1, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 103, 1, 1, '012', 'M3', 2, 1, 120.00, 3000.000, 360000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 3, 1, 0, '012', 'GLB', 1, 2, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 301, 1, 3, '012', 'HM', 2, 1, 350.00, 500.000, 175000.00);

-- Proyecto 2: Carretera Panamericana - Partidas de Ingreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 2, 'I', 1, 2001, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 9000000.00);

-- Proyecto 3: Sistema Riego Cusco - Partidas de Egreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 1, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 105, 1, 1, '012', 'MTS', 2, 1, 15.00, 10000.000, 150000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 4, 1, 0, '012', 'GLB', 1, 2, 0.00, 1.000, 0.00);

-- Proyecto 3: Sistema Riego Cusco - Partidas de Ingreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 3, 'I', 1, 3001, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 6000000.00);

-- Proyecto 4: Hospital Lima - Partidas de Egreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 4, 'E', 1, 1, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 0.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 4, 'E', 1, 104, 1, 1, '012', 'UND', 2, 1, 0.80, 500000.000, 400000.00);
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 4, 'E', 1, 2, 1, 0, '012', 'GLB', 1, 2, 0.00, 1.000, 0.00);

-- Proyecto 4: Hospital Lima - Partidas de Ingreso
INSERT INTO PROY_PARTIDA_MEZCLA VALUES (1, 4, 'I', 1, 4001, 1, 0, '012', 'GLB', 1, 1, 0.00, 1.000, 4250000.00);

COMMIT;

-- ==================================================================
-- 27. INSERTAR DPROY_PARTIDA_MEZCLA (Detalle de desembolsos)
-- ==================================================================

-- Proyecto 1: Puente Lima-Callao - Desembolsos de Egreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 101, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2023-02-20', 'YYYY-MM-DD'), 50000.00, 9000.00, 59000.00, 50001);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 101, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2023-03-10', 'YYYY-MM-DD'), 80000.00, 14400.00, 94400.00, 50002);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 102, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2023-02-15', 'YYYY-MM-DD'), 300000.00, 54000.00, 354000.00, 50003);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 102, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2023-03-20', 'YYYY-MM-DD'), 450000.00, 81000.00, 531000.00, 50004);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'E', 1, 201, 1, 1, '013', 'NOR', 1, '004', '002', TO_DATE('2023-02-28', 'YYYY-MM-DD'), 15000.00, 2700.00, 17700.00, 50005);

-- Proyecto 1: Puente Lima-Callao - Desembolsos de Ingreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1001, 1, 1, '013', 'ADL', 1, '004', '001', TO_DATE('2023-02-15', 'YYYY-MM-DD'), 2500000.00, 450000.00, 2950000.00, 50006);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 1, 'I', 1, 1001, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2023-04-30', 'YYYY-MM-DD'), 5000000.00, 900000.00, 5900000.00, 50007);

-- Proyecto 2: Carretera Panamericana - Desembolsos de Egreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 103, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2023-03-05', 'YYYY-MM-DD'), 100000.00, 18000.00, 118000.00, 50008);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 2, 'E', 1, 301, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2023-04-01', 'YYYY-MM-DD'), 75000.00, 13500.00, 88500.00, 50009);

-- Proyecto 2: Carretera Panamericana - Desembolsos de Ingreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 2, 'I', 1, 2001, 1, 1, '013', 'ADL', 1, '004', '001', TO_DATE('2023-04-01', 'YYYY-MM-DD'), 1800000.00, 324000.00, 2124000.00, 50010);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 2, 'I', 1, 2001, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2023-06-15', 'YYYY-MM-DD'), 3600000.00, 648000.00, 4248000.00, 50011);

-- Proyecto 3: Sistema Riego Cusco - Desembolsos de Egreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 3, 'E', 1, 105, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2023-02-20', 'YYYY-MM-DD'), 100000.00, 18000.00, 118000.00, 50012);

-- Proyecto 3: Sistema Riego Cusco - Desembolsos de Ingreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 3, 'I', 1, 3001, 1, 1, '013', 'ADL', 1, '004', '001', TO_DATE('2023-03-01', 'YYYY-MM-DD'), 1200000.00, 216000.00, 1416000.00, 50013);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 3, 'I', 1, 3001, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2023-05-20', 'YYYY-MM-DD'), 2400000.00, 432000.00, 2832000.00, 50014);

-- Proyecto 4: Hospital Lima - Desembolsos de Egreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 4, 'E', 1, 104, 1, 1, '013', 'NOR', 1, '004', '001', TO_DATE('2024-01-15', 'YYYY-MM-DD'), 200000.00, 36000.00, 236000.00, 50015);

-- Proyecto 4: Hospital Lima - Desembolsos de Ingreso
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 4, 'I', 1, 4001, 1, 1, '013', 'ADL', 1, '004', '001', TO_DATE('2024-01-20', 'YYYY-MM-DD'), 850000.00, 153000.00, 1003000.00, 50016);
INSERT INTO DPROY_PARTIDA_MEZCLA VALUES (1, 4, 'I', 1, 4001, 1, 2, '013', 'NOR', 2, '004', '001', TO_DATE('2024-03-15', 'YYYY-MM-DD'), 1700000.00, 306000.00, 2006000.00, 50017);

COMMIT;

-- ==================================================================
-- 28. INSERTAR DETALLE DE COMPROBANTES DE PAGO A EMPLEADOS (COMP_PAGOEMPLEADO_DET)
-- ==================================================================


-- CPE-001-2023-001 (Carlos Rodriguez - Empleado 1) - Supervisión de proyecto - Febrero 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 1, 'CPE-001-2023-001', 1, 'E', 2104, 15000.00, 2700.00, 17700.00, 50001);

-- CPE-002-2023-002 (Carlos Rodriguez - Empleado 1) - Supervisión de proyecto - Marzo 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 1, 'CPE-002-2023-002', 1, 'E', 2104, 15000.00, 2700.00, 17700.00, 50002);

-- CPE-003-2023-001 (Juan Torres - Empleado 2) - Ingeniería de diseño - Febrero 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 2, 'CPE-003-2023-001', 1, 'E', 2104, 12000.00, 2160.00, 14160.00, 50003);

-- CPE-005-2023-001 (María García - Empleado 3) - Control de calidad - Febrero 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 3, 'CPE-005-2023-001', 1, 'E', 2104, 11000.00, 1980.00, 12980.00, 50004);

-- CPE-006-2023-002 (María García - Empleado 3) - Control de calidad - Marzo 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 3, 'CPE-006-2023-002', 1, 'E', 2104, 11000.00, 1980.00, 12980.00, 50005);

-- CPE-007-2023-001 (Roberto Fernández - Empleado 4) - Ingeniería de puentes - Febrero 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 4, 'CPE-007-2023-001', 1, 'E', 2104, 13000.00, 2340.00, 15340.00, 50006);

-- CPE-008-2023-002 (Roberto Fernández - Empleado 4) - Supervisión carretera - Marzo 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 4, 'CPE-008-2023-002', 1, 'E', 2104, 10000.00, 1800.00, 11800.00, 50007);

-- CPE-009-2023-001 (Martín Quispe - Empleado 5) - Topografía y diseño - Marzo 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 5, 'CPE-009-2023-001', 1, 'E', 2104, 9000.00, 1620.00, 10620.00, 50008);

-- CPE-010-2023-002 (Martín Quispe - Empleado 5) - Topografía proyecto 2 - Abril 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 5, 'CPE-010-2023-002', 1, 'E', 2104, 9000.00, 1620.00, 10620.00, 50009);

-- CPE-011-2023-001 (Fernando Mendoza - Empleado 6) - Director de proyecto - Abril 2023
INSERT INTO COMP_PAGOEMPLEADO_DET VALUES (1, 6, 'CPE-011-2023-001', 1, 'E', 2104, 18000.00, 3240.00, 21240.00, 50010);

COMMIT;

-- ==================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ==================================================================

SELECT 'PARTIDAS INSERTADAS: ' || COUNT(*) as PARTIDAS FROM PARTIDA;
SELECT 'PROY_PARTIDA INSERTADAS: ' || COUNT(*) as PROY_PARTIDAS FROM PROY_PARTIDA;
SELECT 'PARTIDA_MEZCLA INSERTADAS: ' || COUNT(*) as PARTIDA_MEZCLAS FROM PARTIDA_MEZCLA;
SELECT 'PROY_PARTIDA_MEZCLA INSERTADAS: ' || COUNT(*) as PROY_PARTIDA_MEZCLAS FROM PROY_PARTIDA_MEZCLA;
SELECT 'DPROY_PARTIDA_MEZCLA INSERTADOS: ' || COUNT(*) as DETALLE_MEZCLAS FROM DPROY_PARTIDA_MEZCLA;
SELECT 'COMP_PAGODET INSERTADOS: ' || COUNT(*) as DETALLES_PAGO FROM COMP_PAGODET;
SELECT 'VTACOMP_PAGOCAB INSERTADOS: ' || COUNT(*) as COMPROBANTES_VENTA FROM VTACOMP_PAGOCAB;
SELECT 'VTACOMP_PAGODET INSERTADOS: ' || COUNT(*) as DETALLES_VENTA FROM VTACOMP_PAGODET;
SELECT 'COMP_PAGOEMPLEADO_DET INSERTADOS: ' || COUNT(*) as DETALLES_EMPLEADO FROM COMP_PAGOEMPLEADO_DET;
