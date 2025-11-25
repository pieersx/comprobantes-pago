package com.proyectos.comprobantespago.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.proyectos.comprobantespago.dto.FileUploadResponse;
import com.proyectos.comprobantespago.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Controlador REST para gestión de archivos
 * Feature: comprobantes-mejoras
 * Requirements: 4.1-4.7, 5.1-5.7
 */
@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Subir archivo del comprobante
     * POST /api/v1/files/comprobante
     */
    @RequestMapping(value = "/comprobante", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = "multipart/form-data")
    public ResponseEntity<FileUploadResponse> uploadComprobanteFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("codCia") Integer codCia,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month,
            @RequestParam("tipo") String tipo) {

        try {
            System.out.println("🎯 FileUploadController.uploadComprobanteFile called!");
            System.out.println("  File: " + file.getOriginalFilename());
            System.out.println("  CodCia: " + codCia);
            System.out.println("  Year: " + year);
            System.out.println("  Month: " + month);
            System.out.println("  Tipo: " + tipo);

            String filePath = fileStorageService.storeComprobanteFile(file, codCia, year, month, tipo);
            System.out.println("✅ Archivo almacenado en: " + filePath);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/download/")
                    .path(filePath)
                    .toUriString();

            FileUploadResponse response = new FileUploadResponse(
                    file.getOriginalFilename(),
                    filePath,
                    fileDownloadUri,
                    file.getContentType(),
                    file.getSize());

            System.out.println("✅ Respuesta generada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error en uploadComprobanteFile: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Subir archivo del abono
     * POST /api/v1/files/abono
     */
    @RequestMapping(value = "/abono", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = "multipart/form-data")
    public ResponseEntity<FileUploadResponse> uploadAbonoFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("codCia") Integer codCia,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {

        String filePath = fileStorageService.storeAbonoFile(file, codCia, year, month);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/download/")
                .path(filePath)
                .toUriString();

        FileUploadResponse response = new FileUploadResponse(
                file.getOriginalFilename(),
                filePath,
                fileDownloadUri,
                file.getContentType(),
                file.getSize());

        return ResponseEntity.ok(response);
    }

    /**
     * Descargar archivo
     * GET /api/v1/files/download?path=1/2025/11/abonos/uuid.pdf
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("path") String filePath, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(filePath);

        // Determinar el tipo de contenido
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // No se pudo determinar el tipo de contenido
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
