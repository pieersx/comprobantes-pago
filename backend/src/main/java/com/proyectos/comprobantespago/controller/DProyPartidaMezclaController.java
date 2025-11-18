package com.proyectos.comprobantespago.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.entity.DProyPartidaMezcla;
import com.proyectos.comprobantespago.service.DProyPartidaMezclaService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para DPROY_PARTIDA_MEZCLA (Desembolsos)
 */
@RestController
@RequestMapping("/desembolsos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DProyPartidaMezclaController {

    private final DProyPartidaMezclaService dProyPartidaMezclaService;

    @GetMapping
    public ResponseEntity<List<DProyPartidaMezcla>> getAll() {
        return ResponseEntity.ok(dProyPartidaMezclaService.findAll());
    }

    @GetMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}/{sec}")
    public ResponseEntity<DProyPartidaMezcla> getById(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr,
            @PathVariable Integer sec) {
        return dProyPartidaMezclaService.findById(codCia, codPyto, ingEgr, nroVersion, codPartida, corr, sec)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public ResponseEntity<List<DProyPartidaMezcla>> getByProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return ResponseEntity.ok(dProyPartidaMezclaService.findByProyecto(codCia, codPyto));
    }

    @GetMapping("/mezcla/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}")
    public ResponseEntity<List<DProyPartidaMezcla>> getByMezcla(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr) {
        return ResponseEntity
                .ok(dProyPartidaMezclaService.findByMezcla(codCia, codPyto, ingEgr, nroVersion, codPartida, corr));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<DProyPartidaMezcla>> getByRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(dProyPartidaMezclaService.findByFechaDesembolsoBetween(fechaInicio, fechaFin));
    }

    @PostMapping
    public ResponseEntity<DProyPartidaMezcla> create(@RequestBody DProyPartidaMezcla dProyPartidaMezcla) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dProyPartidaMezclaService.save(dProyPartidaMezcla));
    }

    @PutMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}/{sec}")
    public ResponseEntity<DProyPartidaMezcla> update(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr,
            @PathVariable Integer sec,
            @RequestBody DProyPartidaMezcla dProyPartidaMezcla) {
        return ResponseEntity.ok(dProyPartidaMezclaService.update(codCia, codPyto, ingEgr, nroVersion, codPartida, corr,
                sec, dProyPartidaMezcla));
    }

    @DeleteMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}/{sec}")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr,
            @PathVariable Integer sec) {
        dProyPartidaMezclaService.delete(codCia, codPyto, ingEgr, nroVersion, codPartida, corr, sec);
        return ResponseEntity.noContent().build();
    }
}
