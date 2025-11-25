package com.proyectos.comprobantespago.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Propiedades de configuración para el almacenamiento de archivos.
 * Lee las propiedades desde application.properties con prefijo "file"
 */
@Configuration
@ConfigurationProperties(prefix = "file")
public class FileStorageProperties {

    /**
     * Directorio base para almacenar archivos subidos
     */
    private String uploadDir = "uploads";

    /**
     * Tamaño máximo de archivo en bytes (10MB por defecto)
     */
    private Long maxSize = 10485760L; // 10MB

    /**
     * Tipos de archivo permitidos (MIME types separados por coma)
     */
    private String allowedTypes = "application/pdf,image/jpeg,image/jpg,image/png";

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public Long getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Long maxSize) {
        this.maxSize = maxSize;
    }

    public String getAllowedTypes() {
        return allowedTypes;
    }

    public void setAllowedTypes(String allowedTypes) {
        this.allowedTypes = allowedTypes;
    }

    /**
     * Obtiene los tipos permitidos como array
     */
    public String[] getAllowedTypesArray() {
        return allowedTypes.split(",");
    }
}
