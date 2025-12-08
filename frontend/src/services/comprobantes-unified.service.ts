import { comprobantesEmpleadoService } from './comprobantes-empleado.service';
import {
    clientesService,
    comprobantesEgresoService,
    comprobantesIngresoService,
    proveedoresService,
    proyectosService,
} from './comprobantes.service';

export interface ComprobanteUnificado {
  nroCP: string;
  codProveedor: number;
  codEmpleado?: number; // Feature: empleados-comprobantes-blob
  proveedor: string;
  codPyto: number;
  proyecto: string;
  fecCP: string;
  impTotalMn: number;
  estado: string;
  tipo: 'INGRESO' | 'EGRESO' | 'EGRESO_EMPLEADO'; // Feature: empleados-comprobantes-blob
  tCompPago?: string; // Tipo de comprobante: FAC, BOL, REC, OTR
  fotoCp?: string; // Ruta del archivo del comprobante
  fotoAbono?: string; // Ruta del archivo del abono
  fecAbono?: string; // Fecha de pago del abono
}

/**
 * Normaliza el código de estado a un formato consistente
 * Estados de la BD: '001' = Registrado, '002' = Pagado, '003' = Anulado
 * Estados legacy: PAG, PEN, REG, ANU
 */
const normalizarEstado = (codEstado: string | undefined): string => {
  if (!codEstado) return '001'; // Default: Registrado

  const estado = codEstado.toUpperCase();

  // Mapear estados legacy a nuevos códigos
  const mapeoLegacy: Record<string, string> = {
    'PAG': '002',
    'PAGADO': '002',
    'PEN': '001',
    'PENDIENTE': '001',
    'REG': '001',
    'REGISTRADO': '001',
    'ANU': '003',
    'ANULADO': '003',
  };

  // Si es un estado legacy, convertirlo
  if (mapeoLegacy[estado]) {
    return mapeoLegacy[estado];
  }

  // Si ya es un código válido (001, 002, 003), devolverlo
  if (['001', '002', '003', '1', '2', '3'].includes(estado)) {
    // Normalizar '1', '2', '3' a '001', '002', '003'
    if (estado.length === 1) {
      return estado.padStart(3, '0');
    }
    return estado;
  }

  // Default
  return '001';
};

class ComprobantesUnifiedService {
  async getAll(codCia: number = 1): Promise<ComprobanteUnificado[]> {
    try {
      // Cargar comprobantes y catálogos en paralelo para obtener nombres reales
      const [ingresos, egresos, egresosEmpleado, clientes, proyectos, proveedores] = await Promise.all([
        comprobantesIngresoService.getAll(codCia),
        comprobantesEgresoService.getAll(codCia).catch(() => []), // Graceful fallback
        comprobantesEmpleadoService.getAll(codCia).catch(() => []), // Graceful fallback
        clientesService.getAll(codCia).catch(() => []),
        proyectosService.getAll(codCia).catch(() => []),
        proveedoresService.getAll(codCia).catch(() => []),
      ]);

      // Crear mapas para búsqueda rápida de nombres
      const clientesMap = new Map(clientes.map(c => [c.codCliente, c.desPersona || c.desCorta || `Cliente ${c.codCliente}`]));
      const proyectosMap = new Map(proyectos.map(p => [p.codPyto, p.nombPyto || `Proyecto ${p.codPyto}`]));
      const proveedoresMap = new Map(proveedores.map(p => [p.codProveedor, p.desPersona || p.desCorta || `Proveedor ${p.codProveedor}`]));

      // Helper: Solo mostrar fecAbono si el estado es Pagado (002 o PAG)
      const getFecAbonoSiPagado = (fecAbono: string | undefined, codEstado: string | undefined): string | undefined => {
        const estadoNorm = normalizarEstado(codEstado);
        // Solo mostrar fecha de abono si está pagado (002)
        if (estadoNorm === '002' && fecAbono) {
          return fecAbono;
        }
        return undefined;
      };

      const ingresosUnificados: ComprobanteUnificado[] = ingresos.map((ing) => ({
        nroCP: ing.nroCp || '',
        codProveedor: ing.codCliente || 0,
        proveedor: clientesMap.get(ing.codCliente) || `Cliente ${ing.codCliente}`,
        codPyto: ing.codPyto || 0,
        proyecto: proyectosMap.get(ing.codPyto) || `Proyecto ${ing.codPyto}`,
        fecCP: ing.fecCp || '',
        impTotalMn: ing.impTotalMn || 0,
        estado: normalizarEstado(ing.codEstado),
        tipo: 'INGRESO' as const,
        tCompPago: ing.tCompPago,
        fotoCp: ing.fotoCp,
        fotoAbono: ing.fotoAbono,
        fecAbono: getFecAbonoSiPagado(ing.fecAbono, ing.codEstado),
      }));

      const egresosUnificados: ComprobanteUnificado[] = egresos.map((egr) => ({
        nroCP: egr.nroCp || '',
        codProveedor: egr.codProveedor || 0,
        proveedor: proveedoresMap.get(egr.codProveedor) || `Proveedor ${egr.codProveedor}`,
        codPyto: egr.codPyto || 0,
        proyecto: proyectosMap.get(egr.codPyto) || `Proyecto ${egr.codPyto}`,
        fecCP: egr.fecCp || '',
        impTotalMn: egr.impTotalMn || 0,
        estado: normalizarEstado(egr.codEstado),
        tipo: 'EGRESO' as const,
        tCompPago: egr.tCompPago,
        fotoCp: egr.fotoCp,
        fotoAbono: egr.fotoAbono,
        fecAbono: getFecAbonoSiPagado(egr.fecAbono, egr.codEstado),
      }));

      // Feature: empleados-comprobantes-blob - Mapear comprobantes de empleados
      const egresosEmpleadoUnificados: ComprobanteUnificado[] = egresosEmpleado.map((emp) => ({
        nroCP: emp.nroCp || '',
        codProveedor: 0,
        codEmpleado: emp.codEmpleado || 0,
        proveedor: emp.nombreEmpleado || `Empleado ${emp.codEmpleado}`,
        codPyto: emp.codPyto || 0,
        proyecto: emp.nombreProyecto || proyectosMap.get(emp.codPyto) || `Proyecto ${emp.codPyto}`,
        fecCP: emp.fecCp || '',
        impTotalMn: emp.impTotalMn || 0,
        estado: normalizarEstado(emp.codEstado),
        tipo: 'EGRESO_EMPLEADO' as const,
        tCompPago: emp.eCompPago,
        fecAbono: getFecAbonoSiPagado(emp.fecAbono, emp.codEstado),
      }));

      return [...ingresosUnificados, ...egresosUnificados, ...egresosEmpleadoUnificados].sort(
        (a, b) => new Date(b.fecCP).getTime() - new Date(a.fecCP).getTime()
      );
    } catch (error) {
      console.error('Error al cargar comprobantes unificados:', error);
      return [];
    }
  }

  async getRecent(limit: number = 5, codCia: number = 1): Promise<ComprobanteUnificado[]> {
    const all = await this.getAll(codCia);
    return all.slice(0, limit);
  }
}

export const comprobantesUnifiedService = new ComprobantesUnifiedService();
