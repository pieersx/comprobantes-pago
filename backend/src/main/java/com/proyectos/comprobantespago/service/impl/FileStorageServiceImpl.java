package com.proyectos.comprobantespago.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.proyectos.comprobantespago.config.FileStorageProperties;
import com.proyectos.comprobantespago.exception.FileNotFoundException;
import com.proyectos.comprobantespago.exception.FileSizeExceededException;
import com.proyectos.comprobantespago.exception.FileStorageException;
import com.proyectos.comprobantespago.exception.InvalidFileFormatException;
import com.proyectos.comprobantespago.service.FileStorageService;

/**
 * Implementación del servicio de almacenamiento de archivos
 * Feature: comprobantes-mejoras
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final FileStorageProperties fileStorageProperties;

    @Autowired
    public FileStorageServiceImpl(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("No se pudo crear el directorio de almacenamiento", ex);
        }
    }

    @Override
    public String storeComprobanteFile(MultipartFile file, Integer codCia,
            Integer year, Integer month, String tipo) {
        // Validar archivo
        validateFile(file);

        // Crear estructura de directorios:
        // uploads/{codCia}/{year}/{month}/comprobantes/
        Path targetLocation = fileStorageLocation
                .resolve(String.valueOf(codCia))
                .resolve(String.valueOf(year))
                .resolve(String.valueOf(month))
                .resolve("comprobantes");

        return storeFile(file, targetLocation);
    }

    @Override
    public String storeAbonoFile(MultipartFile file, Integer codCia,
            Integer year, Integer month) {
        // Validar archivo
        validateFile(file);

        // Crear estructura de directorios: uploads/{codCia}/{year}/{month}/abonos/
        Path targetLocation = fileStorageLocation
                .resolve(String.valueOf(codCia))
                .resolve(String.valueOf(year))
                .resolve(String.valueOf(month))
                .resolve("abonos");

        return storeFile(file, targetLocation);
    }

    @Override
    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = fileStorageLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("Archivo no encontrado: " + filePath);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("Archivo no encontrado: " + filePath, ex);
        }
    }

    @Override
    public void validateFile(MultipartFile file) {
        // Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new InvalidFileFormatException("El archivo está vacío");
        }

        // Validar tamaño del archivo (10MB máximo)
        if (file.getSize() > fileStorageProperties.getMaxSize()) {
            throw new FileSizeExceededException(
                    "El archivo excede el tamaño máximo de 10MB",
                    fileStorageProperties.getMaxSize());
        }

        // Validar tipo de archivo
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new InvalidFileFormatException(
                    "Solo se permiten archivos PDF, JPG, JPEG o PNG. Tipo recibido: " + contentType);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path file = fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            throw new FileStorageException("No se pudo eliminar el archivo: " + filePath, ex);
        }
    }

    /**
     * Método privado para almacenar el archivo en la ubicación especificada
     */
    private String storeFile(MultipartFile file, Path targetLocation) {
        try {
            // Crear directorios si no existen
            Files.createDirectories(targetLocation);

            // Generar nombre único para el archivo (UUID corto de 8 caracteres para caber
            // en VARCHAR2(60))
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFilename);
            String shortUuid = UUID.randomUUID().toString().substring(0, 8);
            String uniqueFilename = shortUuid + fileExtension;

            // Copiar archivo
            Path destinationFile = targetLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Retornar ruta relativa desde el directorio base
            return fileStorageLocation.relativize(destinationFile).toString();

        } catch (IOException ex) {
            throw new FileStorageException("No se pudo almacenar el archivo", ex);
        }
    }

    @Override
    public boolean isValidFileFormat(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }

        return isAllowedContentType(contentType);
    }

    /**
     * Verificar si el tipo de contenido está permitido
     */
    private boolean isAllowedContentType(String contentType) {
        String[] allowedTypes = fileStorageProperties.getAllowedTypesArray();
        return Arrays.asList(allowedTypes).contains(contentType);
    }

    /**
     * Obtener extensión del archivo
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
}
