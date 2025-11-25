package com.proyectos.comprobantespago.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Servicio para gestión de almacenamiento de archivos PDF/imágenes
 * Feature: comprobantes-mejoras
 * Requirements: 4.1-4.8, 5.1-5.7
 */
public interface FileStorageService {

    /**
     * Guardar archivo PDF/imagen del comprobante
     *
     * @param file Archivo a guardar
     * @param codCia Código de compañía
     * @param year Año
     * @param month Mes
     * @param tipo Tipo de comprobante (ingreso/egreso)
     * @return Ruta relativa del archivo guardado
     */
    String storeComprobanteFile(MultipartFile file, Integer codCia,
                                Integer year, Integer month, String tipo);

    /**
     * Guardar archivo PDF/imagen del abono
     *
     * @param file Archivo a guardar
     * @param codCia Código de compañía
     * @param year Año
     * @param month Mes
     * @return Ruta relativa del archivo guardado
     */
    String storeAbonoFile(MultipartFile file, Integer codCia,
                         Integer year, Integer month);

    /**
     * Cargar archivo como recurso
     *
     * @param filePath Ruta del archivo
     * @return Recurso del archivo
     */
    Resource loadFileAsResource(String filePath);

    /**
     * Validar archivo (tipo y tamaño)
     *
     * @param file Archivo a validar
     * @throws IllegalArgumentException si el archivo no es válido
     */
    void validateFile(MultipartFile file);

    /**
     * Validar formato de archivo (PDF, JPG, JPEG, PNG)
     *
     * @param file Archivo a validar
     * @return true si el formato es válido, false en caso contrario
     */
    boolean isValidFileFormat(MultipartFile file);

    /**
     * Eliminar archivo
     *
     * @param filePath Ruta del archivo a eliminar
     */
    void deleteFile(String filePath);
}
