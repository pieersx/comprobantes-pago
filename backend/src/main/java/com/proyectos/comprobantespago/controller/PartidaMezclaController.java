package com.proyectos.comprobantespago.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.entity.PartidaMezcla;
import com.proyectos.comprobantespago.service.PartidaMezclaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller para PARTIDA_MEZCLA
 */
@Slf4j
@RestController
@RequestMapping("/partida-mezcla")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartidaMezclaController {

    private final PartidaMezclaService partidaMezclaService;

    @GetMapping
    public ResponseEntity<List<PartidaMezcla>> getAll() {
        return ResponseEntity.ok(partidaMezclaService.findAll());
    }

    @GetMapping("/{codCia}/{ingEgr}/{codPartida}/{corr}")
    public ResponseEntity<PartidaMezcla> getById(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida,
            @PathVariable Long corr) {
        return partidaMezclaService.findById(codCia, ingEgr, codPartida, corr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/partida/{codCia}/{ingEgr}/{codPartida}")
    public ResponseEntity<List<PartidaMezcla>> getByPartida(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {
        return ResponseEntity.ok(partidaMezclaService.findByPartida(codCia, ingEgr, codPartida));
    }

    @GetMapping("/cia/{codCia}")
    public ResponseEntity<List<PartidaMezcla>> getByCia(@PathVariable Long codCia) {
        return ResponseEntity.ok(partidaMezclaService.findByCodCia(codCia));
    }

    @GetMapping("/vigente/{vigente}")
    public ResponseEntity<List<PartidaMezcla>> getByVigente(@PathVariable String vigente) {
        return ResponseEntity.ok(partidaMezclaService.findByVigente(vigente));
    }

    @PostMapping
    public ResponseEntity<PartidaMezcla> create(@RequestBody PartidaMezcla partidaMezcla) {
        try {
            log.info("Creando PartidaMezcla: codCia={}, ingEgr={}, codPartida={}, corr={}",
                    partidaMezcla.getCodCia(), partidaMezcla.getIngEgr(),
                    partidaMezcla.getCodPartida(), partidaMezcla.getCorr());

            if (partidaMezcla.getCodCia() == null || partidaMezcla.getIngEgr() == null ||
                    partidaMezcla.getCodPartida() == null || partidaMezcla.getCorr() == null) {
                log.error("Campos obligatorios faltantes en PartidaMezcla");
                return ResponseEntity.badRequest().build();
            }

            PartidaMezcla guardada = partidaMezclaService.save(partidaMezcla);
            log.info("PartidaMezcla guardada exitosamente");
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (Exception e) {
            log.error("Error creando PartidaMezcla", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{codCia}/{ingEgr}/{codPartida}/{corr}")
    public ResponseEntity<PartidaMezcla> update(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida,
            @PathVariable Long corr,
            @RequestBody PartidaMezcla partidaMezcla) {
        try {
            log.info("Actualizando PartidaMezcla: codCia={}, ingEgr={}, codPartida={}, corr={}",
                    codCia, ingEgr, codPartida, corr);
            PartidaMezcla actualizada = partidaMezclaService.update(codCia, ingEgr, codPartida, corr, partidaMezcla);
            log.info("PartidaMezcla actualizada exitosamente");
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            log.error("Error actualizando PartidaMezcla", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{codCia}/{ingEgr}/{codPartida}/{corr}")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida,
            @PathVariable Long corr) {
        partidaMezclaService.delete(codCia, ingEgr, codPartida, corr);
        return ResponseEntity.noContent().build();
    }
}
