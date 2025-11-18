package com.proyectos.comprobantespago.repository;

import com.proyectos.comprobantespago.entity.Tabs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad TABS (Catálogos Maestros)
 */
@Repository
public interface TabsRepository extends JpaRepository<Tabs, String> {
    
    /**
     * Buscar tabs vigentes
     */
    List<Tabs> findByVigente(String vigente);
    
    /**
     * Buscar tab por código y vigente
     */
    Optional<Tabs> findByCodTabAndVigente(String codTab, String vigente);
    
    /**
     * Buscar tabs por descripción
     */
    List<Tabs> findByDenTabContainingIgnoreCase(String denTab);
    
    /**
     * Obtener todas las tabs vigentes ordenadas
     */
    @Query("SELECT t FROM Tabs t WHERE t.vigente = 'S' ORDER BY t.denTab")
    List<Tabs> findAllVigentesSorted();
}
