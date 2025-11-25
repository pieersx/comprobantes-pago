package com.proyectos.comprobantespago.service;

import com.proyectos.comprobantespago.config.FileStorageProperties;
import com.proyectos.comprobantespago.exception.FileSizeExceededException;
import com.proyectos.comprobantespago.exception.InvalidFileFormatException;
import com.proyectos.comprobantespago.service.impl.FileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for FileStorageService
 */
class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;
    private FileStorageProperties properties;

    @BeforeEach
    void setUp() {
        properties = new FileStorageProperties();
        properties.setUploadDir(tempDir.toString());
        properties.setMaxSize(10485760L); // 10MB
        properties.setAllowedTypes("application/pdf,image/jpeg,image/jpg,image/png");
        fileStorageService = new FileStorageServiceImpl(properties);
    }

    @Test
    void testStoreComprobanteFile_Success() {
        // Arrange
        byte[] content = "Test PDF content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );

        // Act
        String filePath = fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");

        // Assert
        assertNotNull(filePath);
        assertTrue(filePath.contains("1"));
        assertTrue(filePath.contains("2024"));
        assertTrue(filePath.contains("11"));
        assertTrue(filePath.contains("comprobantes"));
        assertTrue(filePath.endsWith(".pdf"));
    }

    @Test
    void testStoreComprobanteFile_InvalidFormat() {
        // Arrange
        byte[] content = "Test content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                content
        );

        // Act & Assert
        assertThrows(InvalidFileFormatException.class, () -> {
            fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");
        });
    }

    @Test
    void testStoreComprobanteFile_FileSizeExceeded() {
        // Arrange
        byte[] content = new byte[11 * 1024 * 1024]; // 11MB
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );

        // Act & Assert
        assertThrows(FileSizeExceededException.class, () -> {
            fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");
        });
    }

    @Test
    void testStoreComprobanteFile_EmptyFile() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                new byte[0]
        );

        // Act & Assert
        assertThrows(InvalidFileFormatException.class, () -> {
            fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");
        });
    }

    @Test
    void testStoreAbonoFile_Success() {
        // Arrange
        byte[] content = "Test PDF content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );

        // Act
        String filePath = fileStorageService.storeAbonoFile(file, 1, 2024, 11);

        // Assert
        assertNotNull(filePath);
        assertTrue(filePath.contains("1"));
        assertTrue(filePath.contains("2024"));
        assertTrue(filePath.contains("11"));
        assertTrue(filePath.contains("abonos"));
        assertTrue(filePath.endsWith(".pdf"));
    }

    @Test
    void testValidateFile_ValidPDF() {
        // Arrange
        byte[] content = "Test PDF content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );

        // Act & Assert - should not throw exception
        assertDoesNotThrow(() -> fileStorageService.validateFile(file));
    }

    @Test
    void testValidateFile_ValidImage() {
        // Arrange
        byte[] content = "Test image content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                content
        );

        // Act & Assert - should not throw exception
        assertDoesNotThrow(() -> fileStorageService.validateFile(file));
    }

    @Test
    void testLoadFileAsResource_Success() throws IOException {
        // Arrange
        byte[] content = "Test PDF content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );
        String filePath = fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");

        // Act
        Resource resource = fileStorageService.loadFileAsResource(filePath);

        // Assert
        assertNotNull(resource);
        assertTrue(resource.exists());
        assertTrue(resource.isReadable());
    }

    @Test
    void testDeleteFile_Success() throws IOException {
        // Arrange
        byte[] content = "Test PDF content".getBytes();
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                content
        );
        String filePath = fileStorageService.storeComprobanteFile(file, 1, 2024, 11, "ingreso");

        // Verify file exists
        Resource resource = fileStorageService.loadFileAsResource(filePath);
        assertTrue(resource.exists());

        // Act
        fileStorageService.deleteFile(filePath);

        // Assert - file should not exist anymore
        assertThrows(com.proyectos.comprobantespago.exception.FileNotFoundException.class, () -> {
            fileStorageService.loadFileAsResource(filePath);
        });
    }
}
