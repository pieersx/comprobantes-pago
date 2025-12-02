package com.proyectos.comprobantespago.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectos.comprobantespago.dto.ClienteDTO;
import com.proyectos.comprobantespago.entity.Cliente;
import com.proyectos.comprobantespago.repository.ClienteRepository;

/**
 * Controlador REST para la gestión de Clientes
 * Endpoints: /api/v1/clientes
 */
@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * GET /clientes
     * Lista todos los clientes
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ClienteDTO>> listarClientes(
            @RequestParam(required = false) String vigente) {

        List<Cliente> clientes;

        if (vigente != null) {
            clientes = clienteRepository.findByVigente(vigente);
        } else {
            clientes = clienteRepository.findAll();
        }

        List<ClienteDTO> clientesDTO = clientes.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(clientesDTO);
    }

    /**
     * GET /clientes/{codCia}/{codCliente}
     * Obtiene un cliente por su ID compuesto
     */
    @GetMapping("/{codCia}/{codCliente}")
    @Transactional(readOnly = true)
    public ResponseEntity<ClienteDTO> obtenerCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente) {

        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);

        return clienteRepository.findById(id)
                .map(this::convertirADTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /clientes
     * Crea un nuevo cliente
     */
    @PostMapping
    public ResponseEntity<ClienteDTO> crearCliente(@RequestBody ClienteDTO clienteDTO) {
        try {
            Cliente cliente = convertirAEntidad(clienteDTO);
            Cliente clienteGuardado = clienteRepository.save(cliente);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertirADTO(clienteGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /clientes/{codCia}/{codCliente}
     * Actualiza un cliente existente
     */
    @PutMapping("/{codCia}/{codCliente}")
    public ResponseEntity<ClienteDTO> actualizarCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente,
            @RequestBody ClienteDTO clienteDTO) {

        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);

        return clienteRepository.findById(id)
                .map(clienteExistente -> {
                    // Actualizar campos
                    if (clienteExistente.getPersona() != null) {
                        clienteExistente.getPersona().setDesPersona(clienteDTO.getDesPersona());
                        clienteExistente.getPersona().setDesCorta(clienteDTO.getDesCorta());
                    }
                    clienteExistente.setNroRuc(clienteDTO.getNroRuc());
                    clienteExistente.setVigente(clienteDTO.getVigente());

                    Cliente actualizado = clienteRepository.save(clienteExistente);
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /clientes/{codCia}/{codCliente}/vigencia
     * Cambia el estado de vigencia de un cliente
     */
    @PatchMapping("/{codCia}/{codCliente}/vigencia")
    public ResponseEntity<ClienteDTO> cambiarVigencia(
            @PathVariable Long codCia,
            @PathVariable Long codCliente,
            @RequestParam String vigente) {

        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);

        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setVigente(vigente);
                    Cliente actualizado = clienteRepository.save(cliente);
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /clientes/{codCia}/{codCliente}
     * Elimina (desactiva) un cliente
     */
    @DeleteMapping("/{codCia}/{codCliente}")
    public ResponseEntity<Void> eliminarCliente(
            @PathVariable Long codCia,
            @PathVariable Long codCliente) {

        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);

        return clienteRepository.findById(id)
                .map(cliente -> {
                    // Eliminación lógica
                    cliente.setVigente("N");
                    clienteRepository.save(cliente);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /clientes/activos
     * Lista solo clientes activos
     */
    @GetMapping("/activos")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ClienteDTO>> listarClientesActivos() {
        List<Cliente> clientes = clienteRepository.findByVigente("1");
        List<ClienteDTO> clientesDTO = clientes.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientesDTO);
    }

    /**
     * Convierte entidad Cliente a DTO
     */
    private ClienteDTO convertirADTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setCodCia(cliente.getCodCia());
        dto.setCodCliente(cliente.getCodCliente());
        dto.setNroRuc(cliente.getNroRuc());
        dto.setVigente(cliente.getVigente());

        if (cliente.getPersona() != null) {
            dto.setDesPersona(cliente.getPersona().getDesPersona());
            dto.setDesCorta(cliente.getPersona().getDesCorta());
        }

        return dto;
    }

    /**
     * Convierte DTO a entidad Cliente
     */
    private Cliente convertirAEntidad(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setCodCia(dto.getCodCia());
        cliente.setCodCliente(dto.getCodCliente());
        cliente.setNroRuc(dto.getNroRuc());
        cliente.setVigente(dto.getVigente() != null ? dto.getVigente() : "1");

        // TODO: Asociar con Persona existente o crear nueva
        // Por ahora dejamos pendiente la relación con Persona

        return cliente;
    }
}
