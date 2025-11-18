package com.proyectos.comprobantespago.repository;

import com.proyectos.comprobantespago.entity.Elementos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad ELEMENTOS (Elementos de Catálogos)
 */
@Repository
public interface ElementosRepository extends JpaRepository<Elementos, Elementos.ElementosId> {
    
    /**
     * Buscar elementos por código de tabla
     */
    List<Elementos> findByCodTab(String codTab);
    
    /**
     * Buscar elementos vigentes por código de tabla
     */
    List<Elementos> findByCodTabAndVigente(String codTab, String vigente);
    
    /**
     * Buscar elemento específico vigente
     */
    Optional<Elementos> findByCodTabAndCodElemAndVigente(String codTab, String codElem, String vigente);
    
    /**
     * Buscar elementos por descripción
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = :codTab AND e.denEle LIKE %:desc% AND e.vigente = 'S'")
    List<Elementos> findByTabAndDescription(@Param("codTab") String codTab, @Param("desc") String desc);
    
    /**
     * Obtener todos los elementos vigentes de una tabla ordenados
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = :codTab AND e.vigente = 'S' ORDER BY e.denEle")
    List<Elementos> findAllVigentesByCodTabSorted(@Param("codTab") String codTab);
    
    /**
     * Buscar tipos de moneda
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '001' AND e.vigente = 'S' ORDER BY e.denEle")
    List<Elementos> findTiposMoneda();
    
    /**
     * Buscar unidades de medida
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '002' AND e.vigente = 'S' ORDER BY e.denEle")
    List<Elementos> findUnidadesMedida();
    
    /**
     * Buscar tipos de comprobante
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '003' AND e.vigente = 'S' ORDER BY e.denEle")
    List<Elementos> findTiposComprobante();
}
