package com.proyectos.comprobantespago.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectos.comprobantespago.entity.Compania;
import com.proyectos.comprobantespago.repository.CiaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para gestión de Compañías/Empresas
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CiaService {

    private final CiaRepository ciaRepository;

    /**
     * Obtener todas las compañías vigentes
     */
    @Transactional(readOnly = true)
    public List<Compania> obtenerTodasVigentes() {
        log.info("Obteniendo todas las compañías vigentes");
        return ciaRepository.findAllActive();
    }

    /**
     * Obtener compañía por código
     */
    @Transactional(readOnly = true)
    public Compania obtenerPorCodigo(Long codCia) {
        log.info("Obteniendo compañía con código: {}", codCia);
        return ciaRepository.findById(codCia)
                .orElseThrow(() -> new RuntimeException("Compañía no encontrada con código: " + codCia));
    }

    /**
     * Crear nueva compañía
     */
    public Compania crear(Compania compania) {
        log.info("Creando nueva compañía: {}", compania.getDesCia());

        // Validar que no exista una compañía con el mismo código
        if (ciaRepository.existsById(compania.getCodCia())) {
            throw new RuntimeException("Ya existe una compañía con el código: " + compania.getCodCia());
        }

        // Establecer vigente por defecto
        if (compania.getVigente() == null) {
            compania.setVigente("1");
        }

        return ciaRepository.save(compania);
    }

    /**
     * Actualizar compañía existente
     */
    public Compania actualizar(Long codCia, Compania companiaActualizada) {
        log.info("Actualizando compañía con código: {}", codCia);

        Compania companiaExistente = obtenerPorCodigo(codCia);

        companiaExistente.setDesCia(companiaActualizada.getDesCia());
        companiaExistente.setDesCorta(companiaActualizada.getDesCorta());
        companiaExistente.setVigente(companiaActualizada.getVigente());

        return ciaRepository.save(companiaExistente);
    }

    /**
     * Inactivar compañía (no se elimina físicamente)
     */
    public void inactivar(Long codCia) {
        log.info("Inactivando compañía con código: {}", codCia);

        Compania compania = obtenerPorCodigo(codCia);
        compania.setVigente("0");
        ciaRepository.save(compania);
    }

    /**
     * Verificar si existe una compañía vigente
     */
    @Transactional(readOnly = true)
    public boolean existeVigente(Long codCia) {
        return ciaRepository.existsByCodCiaAndVigente(codCia, "1");
    }
}
