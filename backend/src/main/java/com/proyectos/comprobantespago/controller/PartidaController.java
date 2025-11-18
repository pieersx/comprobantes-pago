package com.proyectos.comprobantespago.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.proyectos.comprobantespago.dto.PartidaDTO;
import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.repository.PartidaRepository;

/**
 * Controlador REST para la gestión de Partidas
 * Endpoints: /api/v1/partidas
 */
@RestController
@RequestMapping("/partidas")
@CrossOrigin(origins = "*")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    /**
     * GET /partidas
     * Lista todas las partidas
     */
    @GetMapping
    public ResponseEntity<List<PartidaDTO>> listarPartidas(
            @RequestParam(required = false) Long codCia) {

        List<Partida> partidas;

        if (codCia != null) {
            partidas = partidaRepository.findByCodCia(codCia);
        } else {
            partidas = partidaRepository.findAll();
        }

        List<PartidaDTO> partidasDTO = partidas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(partidasDTO);
    }

    /**
     * GET /partidas/{codCia}/{ingEgr}/{codPartida}
     * Obtiene una partida por su ID compuesto
     */
    @GetMapping("/{codCia}/{ingEgr}/{codPartida}")
    public ResponseEntity<PartidaDTO> obtenerPartida(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {

        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);

        return partidaRepository.findById(id)
                .map(this::convertirADTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /partidas
     * Crea una nueva partida
     */
    @PostMapping
    public ResponseEntity<PartidaDTO> crearPartida(@RequestBody PartidaDTO partidaDTO) {
        try {
            Partida partida = convertirAEntidad(partidaDTO);
            Partida partidaGuardada = partidaRepository.save(partida);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertirADTO(partidaGuardada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /partidas/{codCia}/{ingEgr}/{codPartida}
     * Actualiza una partida existente
     */
    @PutMapping("/{codCia}/{ingEgr}/{codPartida}")
    public ResponseEntity<PartidaDTO> actualizarPartida(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida,
            @RequestBody PartidaDTO partidaDTO) {

        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);

        return partidaRepository.findById(id)
                .map(partidaExistente -> {
                    if (partidaDTO.getDesPartida() != null) {
                        partidaExistente.setDesPartida(partidaDTO.getDesPartida());
                    }

                    Partida actualizada = partidaRepository.save(partidaExistente);
                    return ResponseEntity.ok(convertirADTO(actualizada));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /partidas/{codCia}/{ingEgr}/{codPartida}
     * Elimina una partida
     */
    @DeleteMapping("/{codCia}/{ingEgr}/{codPartida}")
    public ResponseEntity<Void> eliminarPartida(
            @PathVariable Long codCia,
            @PathVariable String ingEgr,
            @PathVariable Long codPartida) {

        Partida.PartidaId id = new Partida.PartidaId(codCia, ingEgr, codPartida);

        if (partidaRepository.existsById(id)) {
            partidaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Convierte entidad Partida a DTO
     */
    private PartidaDTO convertirADTO(Partida partida) {
        PartidaDTO dto = new PartidaDTO();
        dto.setCodCia(partida.getCodCia());
        dto.setIngEgr(partida.getIngEgr());
        dto.setCodPartida(partida.getCodPartida());
        dto.setCodPartidas(partida.getCodPartidas());
        dto.setDesPartida(partida.getDesPartida());
        dto.setFlgCC(partida.getFlgCC());
        dto.setNivel(partida.getNivel());
        dto.setTUniMed(partida.getTUniMed());
        dto.setEUniMed(partida.getEUniMed());
        dto.setSemilla(partida.getSemilla());
        dto.setVigente(partida.getVigente());

        return dto;
    }

    /**
     * Convierte DTO a entidad Partida
     */
    private Partida convertirAEntidad(PartidaDTO dto) {
        Partida partida = new Partida();
        partida.setCodCia(dto.getCodCia());
        partida.setIngEgr(dto.getIngEgr());
        partida.setCodPartida(dto.getCodPartida());
        partida.setCodPartidas(dto.getCodPartidas());
        partida.setDesPartida(dto.getDesPartida());
        partida.setFlgCC(dto.getFlgCC());
        partida.setNivel(dto.getNivel());
        partida.setTUniMed(dto.getTUniMed());
        partida.setEUniMed(dto.getEUniMed());
        partida.setSemilla(dto.getSemilla());
        partida.setVigente(dto.getVigente());

        return partida;
    }
}
