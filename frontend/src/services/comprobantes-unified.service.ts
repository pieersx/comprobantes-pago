import { comprobantesEgresoService, comprobantesIngresoService } from './comprobantes.service';

export interface ComprobanteUnificado {
  nroCP: string;
  codProveedor: number;
  proveedor: string;
  codPyto: number;
  proyecto: string;
  fecCP: string;
  impTotalMn: number;
  estado: string;
  tipo: 'INGRESO' | 'EGRESO';
  tCompPago?: string; // Tipo de comprobante: FAC, BOL, REC, OTR
  fotoCp?: string; // Ruta del archivo del comprobante
  fotoAbono?: string; // Ruta del archivo del abono
}

class ComprobantesUnifiedService {
  async getAll(codCia: number = 1): Promise<ComprobanteUnificado[]> {
    try {
      const [ingresos, egresos] = await Promise.all([
        comprobantesIngresoService.getAll(codCia),
        comprobantesEgresoService.getAll(codCia),
      ]);

      const ingresosUnificados: ComprobanteUnificado[] = ingresos.map((ing) => ({
        nroCP: ing.nroCp || '',
        codProveedor: ing.codCliente || 0,
        proveedor: `Cliente ${ing.codCliente}`,
        codPyto: ing.codPyto || 0,
        proyecto: `Proyecto ${ing.codPyto}`,
        fecCP: ing.fecCp || '',
        impTotalMn: ing.impTotalMn || 0,
        estado: ing.codEstado || '',
        tipo: 'INGRESO' as const,
        tCompPago: ing.tCompPago,
        fotoCp: ing.fotoCp,
        fotoAbono: ing.fotoAbono,
      }));

      const egresosUnificados: ComprobanteUnificado[] = egresos.map((egr) => ({
        nroCP: egr.nroCp || '',
        codProveedor: egr.codProveedor || 0,
        proveedor: `Proveedor ${egr.codProveedor}`,
        codPyto: egr.codPyto || 0,
        proyecto: `Proyecto ${egr.codPyto}`,
        fecCP: egr.fecCp || '',
        impTotalMn: egr.impTotalMn || 0,
        estado: egr.codEstado || '',
        tipo: 'EGRESO' as const,
        tCompPago: egr.tCompPago,
        fotoCp: egr.fotoCp,
        fotoAbono: egr.fotoAbono,
      }));

      return [...ingresosUnificados, ...egresosUnificados].sort(
        (a, b) => new Date(b.fecCP).getTime() - new Date(a.fecCP).getTime()
      );
    } catch (error) {
      // Mock data for development
      // Estados según la base de datos: '001' = Registrado, '002' = Pagado, '003' = Anulado
      return [
        {
          nroCP: 'CP-001',
          codProveedor: 7001,
          proveedor: 'Cementos Andinos SA',
          codPyto: 101,
          proyecto: 'Proyecto Hidroeléctrico Andino',
          fecCP: '2024-01-15',
          impTotalMn: 85000,
          estado: '002', // Pagado
          tipo: 'EGRESO',
        },
        {
          nroCP: 'CP-002',
          codProveedor: 7002,
          proveedor: 'Aceros Nacionales SA',
          codPyto: 101,
          proyecto: 'Proyecto Hidroeléctrico Andino',
          fecCP: '2024-01-20',
          impTotalMn: 47200,
          estado: '002', // Pagado
          tipo: 'EGRESO',
        },
        {
          nroCP: 'VCP-001',
          codProveedor: 5001,
          proveedor: 'Empresa Eléctrica Sur',
          codPyto: 101,
          proyecto: 'Proyecto Hidroeléctrico Andino',
          fecCP: '2024-02-01',
          impTotalMn: 120000,
          estado: '002', // Pagado
          tipo: 'INGRESO',
        },
        {
          nroCP: 'CP-003',
          codProveedor: 7003,
          proveedor: 'Equipos Industriales',
          codPyto: 102,
          proyecto: 'Construcción Planta Energética',
          fecCP: '2024-02-10',
          impTotalMn: 29500,
          estado: '001', // Registrado (Pendiente)
          tipo: 'EGRESO',
        },
      ];
    }
  }

  async getRecent(limit: number = 5, codCia: number = 1): Promise<ComprobanteUnificado[]> {
    const all = await this.getAll(codCia);
    return all.slice(0, limit);
  }
}

export const comprobantesUnifiedService = new ComprobantesUnifiedService();
