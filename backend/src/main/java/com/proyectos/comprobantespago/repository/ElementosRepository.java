package com.proyectos.comprobantespago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectos.comprobantespago.entity.Elementos;

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
    @Query("SELECT e FROM Elementos e WHERE e.codTab = :codTab AND e.denEle LIKE %:desc% AND e.vigente = '1'")
    List<Elementos> findByTabAndDescription(@Param("codTab") String codTab, @Param("desc") String desc);

    /**
     * Obtener todos los elementos vigentes de una tabla ordenados
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = :codTab AND e.vigente = '1' ORDER BY e.denEle")
    List<Elementos> findAllVigentesByCodTabSorted(@Param("codTab") String codTab);

    /**
     * Buscar tipos de moneda
     * Según TABS del profesor: codTab='003' = Monedas
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '003' AND e.vigente = '1' ORDER BY e.denEle")
    List<Elementos> findTiposMoneda();

    /**
     * Buscar unidades de medida
     * Según TABS del profesor: codTab='012' = Unidades de Medida
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '012' AND e.vigente = '1' ORDER BY e.denEle")
    List<Elementos> findUnidadesMedida();

    /**
     * Buscar tipos de comprobante
     * Según TABS del profesor: codTab='004' = Tipo Comprobante
     */
    @Query("SELECT e FROM Elementos e WHERE e.codTab = '004' AND e.vigente = '1' ORDER BY e.denEle")
    List<Elementos> findTiposComprobante();
}
