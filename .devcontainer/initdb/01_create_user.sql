-- ===================================================================
-- Script de inicializacion para crear usuario C##py02 en Oracle XE
-- Se ejecuta automaticamente al iniciar el contenedor por primera vez
-- ===================================================================

-- Crear usuario comun C##py02 en la CDB (Container Database)
CREATE USER c##py02 IDENTIFIED BY "123"
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users
  CONTAINER = ALL;

-- Otorgar permisos
GRANT connect,resource,dba TO c##py02 CONTAINER = ALL;
GRANT CREATE SESSION TO c##py02 CONTAINER = ALL;
GRANT UNLIMITED TABLESPACE TO c##py02 CONTAINER = ALL;

-- Confirmar
COMMIT;

-- Mostrar que se creo
SELECT username,
       common,
       con_id
FROM cdb_users
WHERE username = 'C##PY02';

EXIT;
