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

import com.proyectos.comprobantespago.entity.ProyPartida;
import com.proyectos.comprobantespago.service.ProyPartidaService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para PROY_PARTIDA
 */
@RestController
@RequestMapping("/proy-partida")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProyPartidaController {

    private final ProyPartidaService proyPartidaService;

    @GetMapping
    public ResponseEntity<List<ProyPartida>> getAll() {
        return ResponseEntity.ok(proyPartidaService.findAll());
    }

    @GetMapping("/{codCia}/{codPyto}/{nroVersion}/{ingEgr}/{codPartida}")
    public ResponseEntity<ProyPartida> getById(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {
        return proyPartidaService.findById(codCia, codPyto, nroVersion, ingEgr, codPartida)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}")
    public ResponseEntity<List<ProyPartida>> getByProyecto(
            @PathVariable Long codCia,
            @PathVariable Long codPyto) {
        return ResponseEntity.ok(proyPartidaService.findByProyecto(codCia, codPyto));
    }

    @GetMapping("/proyecto/{codCia}/{codPyto}/version/{nroVersion}")
    public ResponseEntity<List<ProyPartida>> getByProyectoAndVersion(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion) {
        return ResponseEntity.ok(proyPartidaService.findByProyectoAndVersion(codCia, codPyto, nroVersion));
    }

    @GetMapping("/tipo/{ingEgr}")
    public ResponseEntity<List<ProyPartida>> getByTipo(@PathVariable String ingEgr) {
        return ResponseEntity.ok(proyPartidaService.findByIngEgr(ingEgr));
    }

    @GetMapping("/vigente/{vigente}")
    public ResponseEntity<List<ProyPartida>> getByVigente(@PathVariable String vigente) {
        return ResponseEntity.ok(proyPartidaService.findByVigente(vigente));
    }

    @PostMapping
    public ResponseEntity<ProyPartida> create(@RequestBody ProyPartida proyPartida) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proyPartidaService.save(proyPartida));
    }

    @PutMapping("/{codCia}/{codPyto}/{nroVersion}/{ingEgr}/{codPartida}")
    public ResponseEntity<ProyPartida> update(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida,
            @RequestBody ProyPartida proyPartida) {
        return ResponseEntity
                .ok(proyPartidaService.update(codCia, codPyto, nroVersion, ingEgr, codPartida, proyPartida));
    }

    @DeleteMapping("/{codCia}/{codPyto}/{nroVersion}/{ingEgr}/{codPartida}")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPyto,
            @PathVariable Integer nroVersion,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {
        proyPartidaService.delete(codCia, codPyto, nroVersion, ingEgr, codPartida);
        return ResponseEntity.noContent().build();
    }
}
