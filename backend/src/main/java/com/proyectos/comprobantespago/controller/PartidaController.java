package com.proyectos.comprobantespago.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
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
import com.proyectos.comprobantespago.dto.PartidaTreeNode;
import com.proyectos.comprobantespago.entity.Partida;
import com.proyectos.comprobantespago.entity.PartidaMezcla;
import com.proyectos.comprobantespago.repository.PartidaMezclaRepository;
import com.proyectos.comprobantespago.repository.PartidaRepository;
import com.proyectos.comprobantespago.service.PartidaHierarchyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST para la gestión de Partidas
 * Endpoints: /api/v1/partidas
 */
@RestController
@RequestMapping("/partidas")
@CrossOrigin(origins = "*")
@Tag(name = "Partidas", description = "Gestión de partidas presupuestales")
@Tag(name = "Partidas", description = "Gestión de partidas presupuestales")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private PartidaMezclaRepository partidaMezclaRepository;

    @Autowired
    private PartidaHierarchyService partidaHierarchyService;

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

            // Crear/actualizar relación en PARTIDA_MEZCLA para mantener jerarquía y orden
            PartidaMezcla mezcla = construirMezclaDesdeDTO(partidaDTO, partidaGuardada);
            partidaMezclaRepository.save(mezcla);

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

                    // Sincronizar PARTIDA_MEZCLA (crea si no existe, actualiza si existe)
                    PartidaMezcla mezcla = construirMezclaDesdeDTO(partidaDTO, actualizada);
                    partidaMezclaRepository.save(mezcla);

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

        // Enriquecer con datos de PARTIDA_MEZCLA (padre, orden, costo)
        Optional<PartidaMezcla> mezclaOpt = partidaMezclaRepository
                .findByCodCiaAndIngEgrAndCodPartidaAndVigente(partida.getCodCia(), partida.getIngEgr(),
                        partida.getCodPartida(), "1")
                .stream()
                .findFirst();

        mezclaOpt.ifPresent(mezcla -> {
            dto.setPadCodPartida(mezcla.getPadCodPartida());
            dto.setCorr(mezcla.getCorr());
            dto.setOrden(mezcla.getOrden());
            dto.setCostoUnit(mezcla.getCostoUnit());
        });

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

    /**
     * Construye o actualiza el registro en PARTIDA_MEZCLA a partir del DTO y la
     * partida guardada.
     * Se aplican valores por defecto para evitar nulls y mantener la jerarquía.
     */
    private PartidaMezcla construirMezclaDesdeDTO(PartidaDTO dto, Partida partidaGuardada) {
        Long codCia = partidaGuardada.getCodCia();
        String ingEgr = partidaGuardada.getIngEgr();
        Long codPartida = partidaGuardada.getCodPartida();

        Long corr = dto.getCorr() != null ? dto.getCorr() : 1L;
        Long padCodPartida = dto.getPadCodPartida() != null ? dto.getPadCodPartida() : codPartida; // raíz se apunta a
                                                                                                   // sí misma
        Integer nivel = dto.getNivel() != null ? dto.getNivel() : partidaGuardada.getNivel();
        Integer orden = dto.getOrden() != null ? dto.getOrden() : 1;
        BigDecimal costoUnit = dto.getCostoUnit() != null ? dto.getCostoUnit() : BigDecimal.ZERO;
        String vigente = dto.getVigente() != null ? dto.getVigente() : "1";

        PartidaMezcla.PartidaMezclaId id = new PartidaMezcla.PartidaMezclaId(codCia, ingEgr, codPartida, corr);
        PartidaMezcla mezcla = partidaMezclaRepository.findById(id).orElseGet(PartidaMezcla::new);

        mezcla.setCodCia(codCia);
        mezcla.setIngEgr(ingEgr);
        mezcla.setCodPartida(codPartida);
        mezcla.setCorr(corr);
        mezcla.setPadCodPartida(padCodPartida);
        mezcla.setTUniMed(partidaGuardada.getTUniMed());
        mezcla.setEUniMed(partidaGuardada.getEUniMed());
        mezcla.setCostoUnit(costoUnit);
        mezcla.setNivel(nivel);
        mezcla.setOrden(orden);
        mezcla.setVigente(vigente);

        return mezcla;
    }

    /**
     * GET /partidas/nivel3
     * Obtiene solo las partidas de nivel 3 (último nivel) válidas para comprobantes
     * Según especificaciones del profesor: solo nivel 3 se usa en comprobantes
     */
    @GetMapping("/nivel3")
    @Operation(summary = "Obtener partidas de nivel 3", description = "Retorna solo las partidas de nivel 3 con información de jerarquía completa. "
            +
            "Estas son las únicas partidas válidas para usar en comprobantes.")
    public ResponseEntity<List<PartidaDTO>> obtenerPartidasNivel3(
            @RequestParam @Parameter(description = "Código de la compañía") Long codCia,
            @RequestParam(required = false) @Parameter(description = "Código del proyecto (opcional)") Long codPyto,
            @RequestParam @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr) {

        List<PartidaDTO> partidas = partidaHierarchyService.getLevel3PartidasByProyecto(codCia, codPyto, ingEgr);
        return ResponseEntity.ok(partidas);
    }

    /**
     * GET /partidas/ultimo-nivel/{codCia}/{ingEgr}
     * Obtiene solo las partidas del último nivel válidas para comprobantes
     * - Ingresos: nivel 2
     * - Egresos: nivel 3
     */
    @GetMapping("/ultimo-nivel/{codCia}/{ingEgr}")
    @Operation(summary = "Obtener partidas del último nivel", description = "Retorna solo las partidas del último nivel según el tipo. "
            +
            "Ingresos: nivel 2, Egresos: nivel 3. " +
            "Estas son las únicas partidas válidas para usar en comprobantes.")
    public ResponseEntity<List<PartidaDTO>> obtenerPartidasUltimoNivel(
            @PathVariable @Parameter(description = "Código de la compañía") Long codCia,
            @PathVariable @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr,
            @RequestParam(required = false) @Parameter(description = "Código del proyecto (opcional)") Long codProyecto) {

        List<PartidaDTO> partidas = partidaHierarchyService.getLeafPartidas(codCia, ingEgr, codProyecto);
        return ResponseEntity.ok(partidas);
    }

    /**
     * GET /partidas/arbol/{codCia}/{ingEgr}
     * Obtiene el árbol jerárquico completo de partidas
     */
    @GetMapping("/arbol/{codCia}/{ingEgr}")
    @Operation(summary = "Obtener árbol jerárquico de partidas", description = "Retorna la estructura completa de partidas en formato de árbol con niveles anidados")
    public ResponseEntity<List<PartidaTreeNode>> obtenerArbolPartidas(
            @PathVariable @Parameter(description = "Código de la compañía") Long codCia,
            @PathVariable @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr) {

        List<PartidaTreeNode> arbol = partidaHierarchyService.buildPartidaTree(codCia, ingEgr);
        return ResponseEntity.ok(arbol);
    }

    /**
     * GET /partidas/ruta/{codCia}/{ingEgr}/{codPartida}
     * Obtiene la ruta completa de una partida (breadcrumb)
     */
    @GetMapping("/ruta/{codCia}/{ingEgr}/{codPartida}")
    @Operation(summary = "Obtener ruta de una partida", description = "Retorna la ruta completa desde la raíz hasta la partida especificada. "
            +
            "Ejemplo: 'Ingresos > Ventas > Servicios Técnicos'")
    public ResponseEntity<String> obtenerRutaPartida(
            @PathVariable @Parameter(description = "Código de la compañía") Long codCia,
            @PathVariable @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr,
            @PathVariable @Parameter(description = "Código de la partida") Long codPartida) {

        String ruta = partidaHierarchyService.getFullPath(codCia, ingEgr, codPartida);
        return ResponseEntity.ok(ruta);
    }

    /**
     * GET /partidas/proyecto/{codCia}/{codPyto}/{ingEgr}/nivel3
     * Obtiene SOLO las partidas de NIVEL 3 asignadas a un proyecto específico
     * Según el profesor: Solo nivel 3 se usa en comprobantes
     * Esta información viene de PROY_PARTIDA_MEZCLA
     */
    @GetMapping("/proyecto/{codCia}/{codPyto}/{ingEgr}/nivel3")
    @Operation(summary = "Obtener partidas de nivel 3 por proyecto", description = "Retorna SOLO las partidas de NIVEL 3 (último nivel) asignadas a un proyecto específico. "
            +
            "Estas son las únicas partidas válidas para usar en comprobantes de pago. " +
            "Los datos vienen de PROY_PARTIDA_MEZCLA según la estructura presupuestal del proyecto.")
    public ResponseEntity<List<PartidaDTO>> obtenerPartidasNivel3PorProyecto(
            @PathVariable @Parameter(description = "Código de la compañía") Long codCia,
            @PathVariable @Parameter(description = "Código del proyecto") Long codPyto,
            @PathVariable @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr) {

        List<PartidaDTO> partidas = partidaHierarchyService.getLevel3PartidasByProyecto(codCia, codPyto, ingEgr);
        return ResponseEntity.ok(partidas);
    }

    /**
     * GET /partidas/proyecto/{codCia}/{codPyto}/{ingEgr}/todos-niveles
     * Obtiene TODAS las partidas (niveles 1, 2 y 3) asignadas a un proyecto
     * específico
     * Nuevo requerimiento: El usuario puede seleccionar cualquier nivel de partida
     * Esta información viene de PROY_PARTIDA_MEZCLA
     */
    @GetMapping("/proyecto/{codCia}/{codPyto}/{ingEgr}/todos-niveles")
    @Operation(summary = "Obtener todas las partidas (todos los niveles) por proyecto", description = "Retorna TODAS las partidas asignadas a un proyecto (niveles 1, 2 y 3). "
            +
            "El usuario puede seleccionar cualquier nivel de partida para usar en comprobantes. " +
            "Los datos vienen de PROY_PARTIDA_MEZCLA según la estructura presupuestal del proyecto.")
    public ResponseEntity<List<PartidaDTO>> obtenerTodasPartidasPorProyecto(
            @PathVariable @Parameter(description = "Código de la compañía") Long codCia,
            @PathVariable @Parameter(description = "Código del proyecto") Long codPyto,
            @PathVariable @Parameter(description = "Tipo: I=Ingreso, E=Egreso") String ingEgr) {

        List<PartidaDTO> partidas = partidaHierarchyService.getAllPartidasByProyecto(codCia, codPyto, ingEgr);
        return ResponseEntity.ok(partidas);
    }
}
