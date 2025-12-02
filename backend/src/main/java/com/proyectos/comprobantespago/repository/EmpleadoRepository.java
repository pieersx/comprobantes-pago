package com.proyectos.comprobantespago.repository;

import com.proyectos.comprobantespago.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Empleado.EmpleadoId> {

    List<Empleado> findByCodCiaAndVigente(Long codCia, String vigente);

    List<Empleado> findByCodCia(Long codCia);

    Optional<Empleado> findByCodCiaAndCodEmpleado(Long codCia, Long codEmpleado);

    @Query("SELECT e FROM Empleado e WHERE e.codCia = :codCia AND e.dni = :dni")
    Optional<Empleado> findByDni(@Param("codCia") Long codCia, @Param("dni") String dni);

    @Query("SELECT e FROM Empleado e JOIN e.persona p WHERE e.codCia = :codCia AND UPPER(p.desPersona) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<Empleado> findByNombreContaining(@Param("codCia") Long codCia, @Param("nombre") String nombre);
}
