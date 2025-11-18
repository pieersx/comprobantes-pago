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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.entity.Persona;
import com.proyectos.comprobantespago.service.PersonaService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller para PERSONA
 */
@RestController
@RequestMapping("/personas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PersonaController {

    private final PersonaService personaService;

    @GetMapping
    public ResponseEntity<List<Persona>> getAll() {
        return ResponseEntity.ok(personaService.findAll());
    }

    @GetMapping("/{codCia}/{codPersona}")
    public ResponseEntity<Persona> getById(
            @PathVariable Long codCia,
            @PathVariable Long codPersona) {
        return personaService.findById(codCia, codPersona)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cia/{codCia}")
    public ResponseEntity<List<Persona>> getByCia(@PathVariable Long codCia) {
        return ResponseEntity.ok(personaService.findByCodCia(codCia));
    }

    @GetMapping("/tipo/{tipPersona}")
    public ResponseEntity<List<Persona>> getByTipo(@PathVariable String tipPersona) {
        return ResponseEntity.ok(personaService.findByTipPersona(tipPersona));
    }

    @GetMapping("/cia/{codCia}/tipo/{tipPersona}")
    public ResponseEntity<List<Persona>> getByCiaAndTipo(
            @PathVariable Long codCia,
            @PathVariable String tipPersona) {
        return ResponseEntity.ok(personaService.findByCodCiaAndTipPersona(codCia, tipPersona));
    }

    @GetMapping("/vigente/{vigente}")
    public ResponseEntity<List<Persona>> getByVigente(@PathVariable String vigente) {
        return ResponseEntity.ok(personaService.findByVigente(vigente));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Persona>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(personaService.findByDesPersonaContaining(nombre));
    }

    @GetMapping("/buscar-corta")
    public ResponseEntity<List<Persona>> buscarPorNombreCorto(@RequestParam String nombre) {
        return ResponseEntity.ok(personaService.findByDesCortaContaining(nombre));
    }

    @PostMapping
    public ResponseEntity<Persona> create(@RequestBody Persona persona) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personaService.save(persona));
    }

    @PutMapping("/{codCia}/{codPersona}")
    public ResponseEntity<Persona> update(
            @PathVariable Long codCia,
            @PathVariable Long codPersona,
            @RequestBody Persona persona) {
        return ResponseEntity.ok(personaService.update(codCia, codPersona, persona));
    }

    @DeleteMapping("/{codCia}/{codPersona}")
    public ResponseEntity<Void> delete(
            @PathVariable Long codCia,
            @PathVariable Long codPersona) {
        personaService.delete(codCia, codPersona);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count/tipo/{tipPersona}")
    public ResponseEntity<Long> countByTipo(@PathVariable String tipPersona) {
        return ResponseEntity.ok(personaService.countByTipPersona(tipPersona));
    }
}
