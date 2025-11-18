package com.proyectos.comprobantespago.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.Cliente;
import com.proyectos.comprobantespago.entity.Persona;
import com.proyectos.comprobantespago.repository.ClienteRepository;
import com.proyectos.comprobantespago.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service para gestión de CLIENTE
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;

    /**
     * Obtener todos los clientes
     */
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    /**
     * Buscar por ID compuesto
     */
    public Optional<Cliente> findById(Long codCia, Long codCliente) {
        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);
        return clienteRepository.findById(id);
    }

    /**
     * Buscar clientes por compañía
     */
    public List<Cliente> findByCodCia(Long codCia) {
        return clienteRepository.findByCodCia(codCia);
    }

    /**
     * Buscar por RUC
     */
    public Optional<Cliente> findByNroRuc(String nroRuc) {
        return clienteRepository.findByNroRuc(nroRuc);
    }

    /**
     * Buscar clientes vigentes
     */
    public List<Cliente> findByVigente(String vigente) {
        return clienteRepository.findByVigente(vigente);
    }

    /**
     * Buscar por RUC (LIKE)
     */
    public List<Cliente> findByNroRucContaining(String nroRuc) {
        return clienteRepository.findByNroRucContaining(nroRuc);
    }

    /**
     * Crear nuevo cliente (con persona)
     */
    public Cliente save(Cliente cliente, Persona persona) {
        // Primero guardar la persona
        persona.setTipPersona("C"); // C = Cliente
        personaRepository.save(persona);

        // Luego guardar el cliente
        return clienteRepository.save(cliente);
    }

    /**
     * Actualizar cliente
     */
    public Cliente update(Long codCia, Long codCliente, Cliente actualizada) {
        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setNroRuc(actualizada.getNroRuc());
                    cliente.setVigente(actualizada.getVigente());
                    return clienteRepository.save(cliente);
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    /**
     * Eliminar cliente
     */
    public void delete(Long codCia, Long codCliente) {
        Cliente.ClienteId id = new Cliente.ClienteId(codCia, codCliente);
        clienteRepository.deleteById(id);
    }

    /**
     * Contar clientes totales
     */
    public long count() {
        return clienteRepository.count();
    }
}
