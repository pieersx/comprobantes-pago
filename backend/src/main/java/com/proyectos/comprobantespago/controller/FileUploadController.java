package com.proyectos.comprobantespago.controller;

import com.proyectos.comprobantespago.dto.FileUploadResponse;
import com.proyectos.comprobantespago.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Controlador REST para gestión de archivos
 * Feature: comprobantes-mejoras
 * Requirements: 4.1-4.7, 5.1-5.7
 */
@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Subir archivo del comprobante
     * POST /api/v1/files/comprobante
     */
    @PostMapping("/comprobante")
    public ResponseEntity<FileUploadResponse> uploadComprobanteFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("codCia") Integer codCia,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month,
            @RequestParam("tipo") String tipo) {

        String filePath = fileStorageService.storeComprobanteFile(file, codCia, year, month, tipo);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/download/")
                .path(filePath)
                .toUriString();

        FileUploadResponse response = new FileUploadResponse(
                file.getOriginalFilename(),
                filePath,
                fileDownloadUri,
                file.getContentType(),
                file.getSize()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Subir archivo del abono
     * POST /api/v1/files/abono
     */
    @PostMapping("/abono")
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
                file.getSize()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Descargar archivo
     * GET /api/v1/files/download/{filePath}
     */
    @GetMapping("/download/**")
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request) {
        // Extraer la ruta del archivo desde la URL
        String requestUrl = request.getRequestURI();
        String filePath = requestUrl.substring(requestUrl.indexOf("/download/") + 10);

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
