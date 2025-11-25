package com.proyectos.comprobantespago.dto;

/**
 * DTO para respuesta de subida de archivos
 * Feature: comprobantes-mejoras
 */
public class FileUploadResponse {

    private String fileName;
    private String filePath;
    private String fileDownloadUri;
    private String fileType;
    private long size;

    public FileUploadResponse() {
    }

    public FileUploadResponse(String fileName, String filePath, String fileDownloadUri,
                             String fileType, long size) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileDownloadUri = fileDownloadUri;
        this.fileType = fileType;
        this.size = size;
    }

    // Getters and Setters
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileDownloadUri() {
        return fileDownloadUri;
    }

    public void setFileDownloadUri(String fileDownloadUri) {
        this.fileDownloadUri = fileDownloadUri;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
