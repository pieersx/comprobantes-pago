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

import com.proyectos.comprobantespago.entity.ProyPartidaMezcla;
import com.proyectos.comprobantespago.service.ProyPartidaMezclaService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para PROY_PARTIDA_MEZCLA
 */
@RestController
@RequestMapping("/proy-partida-mezcla")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProyPartidaMezclaController {

    private final ProyPartidaMezclaService proyPartidaMezclaService;

    @GetMapping
    public ResponseEntity<List<ProyPartidaMezcla>> getAll() {
        return ResponseEntity.ok(proyPartidaMezclaService.findAll());
    }

    @GetMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}")
    public ResponseEntity<ProyPartidaMezcla> getById(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr) {
        return proyPartidaMezclaService.findById(codCia, codPyto, ingEgr, nroVersion, codPartida, corr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public ResponseEntity<List<ProyPartidaMezcla>> getByProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return ResponseEntity.ok(proyPartidaMezclaService.findByProyecto(codCia, codPyto));
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}/version/{nroVersion}")
    public ResponseEntity<List<ProyPartidaMezcla>> getByProyectoAndVersion(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion) {
        return ResponseEntity.ok(proyPartidaMezclaService.findByProyectoAndVersion(codCia, codPyto, nroVersion));
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}/version/{nroVersion}/partida/{ingEgr}/{codPartida}")
    public ResponseEntity<List<ProyPartidaMezcla>> getByProyectoAndPartida(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {
        return ResponseEntity
                .ok(proyPartidaMezclaService.findByProyectoAndPartida(codCia, codPyto, nroVersion, ingEgr, codPartida));
    }

    @PostMapping
    public ResponseEntity<ProyPartidaMezcla> create(@RequestBody ProyPartidaMezcla proyPartidaMezcla) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proyPartidaMezclaService.save(proyPartidaMezcla));
    }

    @PutMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}")
    public ResponseEntity<ProyPartidaMezcla> update(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr,
            @RequestBody ProyPartidaMezcla proyPartidaMezcla) {
        return ResponseEntity.ok(proyPartidaMezclaService.update(codCia, codPyto, ingEgr, nroVersion, codPartida, corr,
                proyPartidaMezcla));
    }

    @DeleteMapping("/{codCia}/{codPyto}/{ingEgr}/{nroVersion}/{codPartida}/{corr}")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable String ingEgr,
            @PathVariable Integer nroVersion,
            @PathVariable Long codPartida,
            @PathVariable Long corr) {
        proyPartidaMezclaService.delete(codCia, codPyto, ingEgr, nroVersion, codPartida, corr);
        return ResponseEntity.noContent().build();
    }
}
