import { apiClient } from '@/lib/api/client';
import { Cliente, Partida, Proveedor, Proyecto } from '@/types/voucher';

// ===================================
// SERVICIO DE CLIENTES
// ===================================
export const clientesService = {
  /**
   * GET /clientes?codCia={codCia}&vigente={vigente}
   * Lista todos los clientes de una compañía (opcionalmente filtrados por vigencia)
   */
  getAll: async (codCia: number, vigente?: string): Promise<Cliente[]> => {
    let params = `?codCia=${codCia}`;
    if (vigente) params += `&vigente=${vigente}`;
    return await apiClient.get<Cliente[]>(`/clientes${params}`);
  },

  /**
   * GET /clientes/{codCia}/{codCliente}
   * Obtiene un cliente por su ID compuesto
   */
  getById: async (codCia: number, codCliente: number): Promise<Cliente> => {
    return await apiClient.get<Cliente>(`/clientes/${codCia}/${codCliente}`);
  },

  /**
   * POST /clientes
   * Crea un nuevo cliente
   */
  create: async (cliente: any): Promise<Cliente> => {
    return await apiClient.post<Cliente>('/clientes', cliente);
  },

  /**
   * PUT /clientes/{codCia}/{codCliente}
   * Actualiza un cliente existente
   */
  update: async (codCia: number, codCliente: number, cliente: any): Promise<Cliente> => {
    return await apiClient.put<Cliente>(`/clientes/${codCia}/${codCliente}`, cliente);
  },

  /**
   * DELETE /clientes/{codCia}/{codCliente}
   * Elimina (desactiva) un cliente
   */
  delete: async (codCia: number, codCliente: number): Promise<void> => {
    await apiClient.delete(`/clientes/${codCia}/${codCliente}`);
  },

  /**
   * GET /clientes/activos
   * Lista solo clientes activos
   */
  getActivos: async (): Promise<Cliente[]> => {
    return await apiClient.get<Cliente[]>('/clientes/activos');
  },

  /**
   * PATCH /clientes/{codCia}/{codCliente}/vigencia?vigente=N
   * Cambia el estado de vigencia de un cliente
   */
  cambiarVigencia: async (codCia: number, codCliente: number, vigente: string): Promise<Cliente> => {
    return await apiClient.patch<Cliente>(`/clientes/${codCia}/${codCliente}/vigencia?vigente=${vigente}`);
  },
};

// ===================================
// SERVICIO DE PROVEEDORES
// ===================================
export const proveedoresService = {
  /**
   * GET /proveedores?codCia={codCia}
   * Lista todos los proveedores de una compañía (solo vigentes por defecto)
   */
  getAll: async (codCia: number): Promise<Proveedor[]> => {
    return await apiClient.get<Proveedor[]>(`/proveedores?codCia=${codCia}`);
  },

  /**
   * GET /proveedores/{codCia}/{codProveedor}
   * Obtiene un proveedor por su ID compuesto
   */
  getById: async (codCia: number, codProveedor: number): Promise<Proveedor> => {
    return await apiClient.get<Proveedor>(`/proveedores/${codCia}/${codProveedor}`);
  },

  /**
   * POST /proveedores
   * Crea un nuevo proveedor
   */
  create: async (proveedor: any): Promise<Proveedor> => {
    return await apiClient.post<Proveedor>('/proveedores', proveedor);
  },

  /**
   * PUT /proveedores/{codCia}/{codProveedor}
   * Actualiza un proveedor existente
   */
  update: async (codCia: number, codProveedor: number, proveedor: any): Promise<Proveedor> => {
    return await apiClient.put<Proveedor>(`/proveedores/${codCia}/${codProveedor}`, proveedor);
  },

  /**
   * DELETE /proveedores/{codCia}/{codProveedor}
   * Elimina (desactiva) un proveedor
   */
  delete: async (codCia: number, codProveedor: number): Promise<void> => {
    await apiClient.delete(`/proveedores/${codCia}/${codProveedor}`);
  },

  /**
   * GET /proveedores/activos
   * Lista solo proveedores activos
   */
  getActivos: async (): Promise<Proveedor[]> => {
    return await apiClient.get<Proveedor[]>('/proveedores/activos');
  },

  /**
   * PATCH /proveedores/{codCia}/{codProveedor}/vigencia?vigente=N
   * Cambia el estado de vigencia de un proveedor
   */
  cambiarVigencia: async (codCia: number, codProveedor: number, vigente: string): Promise<Proveedor> => {
    return await apiClient.patch<Proveedor>(`/proveedores/${codCia}/${codProveedor}/vigencia?vigente=${vigente}`);
  },
};

// ===================================
// SERVICIO DE PROYECTOS
// ===================================
export const proyectosService = {
  /**
   * GET /proyectos?codCia={codCia}
   * Lista todos los proyectos de una compañía
   */
  getAll: async (codCia: number = 1): Promise<Proyecto[]> => {
    return await apiClient.get<Proyecto[]>(`/proyectos?codCia=${codCia}`);
  },

  /**
   * GET /proyectos/{codCia}/{codPyto}
   * Obtiene un proyecto por su ID compuesto
   */
  getById: async (codCia: number, codPyto: number): Promise<Proyecto> => {
    return await apiClient.get<Proyecto>(`/proyectos/${codCia}/${codPyto}`);
  },

  /**
   * POST /proyectos
   * Crea un nuevo proyecto
   */
  create: async (proyecto: any): Promise<Proyecto> => {
    return await apiClient.post<Proyecto>('/proyectos', proyecto);
  },

  /**
   * PUT /proyectos/{codCia}/{codPyto}
   * Actualiza un proyecto existente
   */
  update: async (codCia: number, codPyto: number, proyecto: any): Promise<Proyecto> => {
    return await apiClient.put<Proyecto>(`/proyectos/${codCia}/${codPyto}`, proyecto);
  },

  /**
   * DELETE /proyectos/{codCia}/{codPyto}
   * Elimina (desactiva) un proyecto
   */
  delete: async (codCia: number, codPyto: number): Promise<void> => {
    await apiClient.delete(`/proyectos/${codCia}/${codPyto}`);
  },

  /**
   * GET /proyectos/cliente/{codCia}/{codCliente}
   * Lista proyectos de un cliente específico
   */
  getByCliente: async (codCia: number, codCliente: number): Promise<Proyecto[]> => {
    return await apiClient.get<Proyecto[]>(`/proyectos/cliente/${codCia}/${codCliente}`);
  },

  /**
   * GET /proyectos/jefe/{codCia}/{codEmpleado}
   * Lista proyectos de un jefe de proyecto
   */
  getByJefeProyecto: async (codCia: number, codEmpleado: number): Promise<Proyecto[]> => {
    return await apiClient.get<Proyecto[]>(`/proyectos/jefe/${codCia}/${codEmpleado}`);
  },

  /**
   * GET /proyectos/anio/{codCia}/{anio}
   * Lista proyectos de un año específico
   */
  getByAnio: async (codCia: number, anio: number): Promise<Proyecto[]> => {
    return await apiClient.get<Proyecto[]>(`/proyectos/anio/${codCia}/${anio}`);
  },
};

// ===================================
// SERVICIO DE PARTIDAS
// ===================================
export const partidasService = {
  /**
   * GET /partidas?codCia={codCia}
   * Lista todas las partidas de una compañía
   */
  getAll: async (codCia?: number): Promise<Partida[]> => {
    const params = codCia ? `?codCia=${codCia}` : '';
    return await apiClient.get<Partida[]>(`/partidas${params}`);
  },

  /**
   * GET /partidas/{codCia}/{ingEgr}/{codPartida}
   * Obtiene una partida por su ID compuesto
   */
  getById: async (codCia: number, ingEgr: string, codPartida: number): Promise<Partida> => {
    return await apiClient.get<Partida>(`/partidas/${codCia}/${ingEgr}/${codPartida}`);
  },

  /**
   * POST /partidas
   * Crea una nueva partida
   */
  create: async (partida: any): Promise<Partida> => {
    return await apiClient.post<Partida>('/partidas', partida);
  },

  /**
   * PUT /partidas/{codCia}/{ingEgr}/{codPartida}
   * Actualiza una partida existente
   */
  update: async (codCia: number, ingEgr: string, codPartida: number, partida: any): Promise<Partida> => {
    return await apiClient.put<Partida>(`/partidas/${codCia}/${ingEgr}/${codPartida}`, partida);
  },

  /**
   * DELETE /partidas/{codCia}/{ingEgr}/{codPartida}
   * Elimina una partida
   */
  delete: async (codCia: number, ingEgr: string, codPartida: number): Promise<void> => {
    await apiClient.delete(`/partidas/${codCia}/${ingEgr}/${codPartida}`);
  },

  /**
   * GET /partidas?codCia={codCia}
   * Filtra partidas por tipo (I=Ingreso, E=Egreso)
   */
  getByTipo: async (codCia: number, ingEgr: 'I' | 'E'): Promise<Partida[]> => {
    const partidas = await apiClient.get<Partida[]>(`/partidas?codCia=${codCia}`);
    return partidas.filter(p => p.ingEgr === ingEgr);
  },

  /**
   * GET /partidas?codCia={codCia}
   * Filtra partidas activas (vigente='S')
   */
  getActivas: async (codCia: number): Promise<Partida[]> => {
    const partidas = await apiClient.get<Partida[]>(`/partidas?codCia=${codCia}`);
    return partidas.filter(p => p.vigente === 'S');
  },
};

// ===================================
// SERVICIO DE COMPAÑÍAS
// ===================================
export const companiasService = {
  /**
   * GET /companias
   * Lista todas las compañías
   */
  getAll: async (): Promise<any[]> => {
    return await apiClient.get<any[]>('/companias');
  },

  /**
   * GET /companias/activas
   * Lista solo compañías activas
   */
  getActivas: async (): Promise<any[]> => {
    return await apiClient.get<any[]>('/companias/activas');
  },

  /**
   * GET /companias/{id}
   * Obtiene una compañía por su ID
   */
  getById: async (id: number): Promise<any> => {
    return await apiClient.get<any>(`/companias/${id}`);
  },

  /**
   * POST /companias
   * Crea una nueva compañía
   */
  create: async (compania: any): Promise<any> => {
    return await apiClient.post<any>('/companias', compania);
  },

  /**
   * PUT /companias/{id}
   * Actualiza una compañía existente
   */
  update: async (id: number, compania: any): Promise<any> => {
    return await apiClient.put<any>(`/companias/${id}`, compania);
  },

  /**
   * DELETE /companias/{id}
   * Elimina (desactiva) una compañía
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/companias/${id}`);
  },
};

// ===================================
// SERVICIO DE COMPROBANTES DE PAGO
// ===================================
export const comprobantesPagoService = {
  getAll: async (codCia: number = 1): Promise<any[]> => {
    return await apiClient.get<any[]>(`/comprobantes-pago?codCia=${codCia}`);
  },

  getById: async (codCia: number, codProveedor: number, nroCp: string): Promise<any> => {
    return await apiClient.get<any>(`/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`);
  },

  create: async (comprobante: any): Promise<any> => {
    return await apiClient.post<any>('/comprobantes-pago', comprobante);
  },

  update: async (codCia: number, codProveedor: number, nroCp: string, comprobante: any): Promise<any> => {
    return await apiClient.put<any>(`/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`, comprobante);
  },

  delete: async (codCia: number, codProveedor: number, nroCp: string): Promise<void> => {
    await apiClient.delete(`/comprobantes-pago/${codCia}/${codProveedor}/${nroCp}`);
  },

  getByEstado: async (estado: string): Promise<any[]> => {
    return await apiClient.get<any[]>(`/comprobantes-pago/estado/${estado}`);
  },

  getByProyecto: async (codPyto: number): Promise<any[]> => {
    return await apiClient.get<any[]>(`/comprobantes-pago/proyecto/${codPyto}`);
  },

  getByProveedor: async (codProveedor: number): Promise<any[]> => {
    return await apiClient.get<any[]>(`/comprobantes-pago/proveedor/${codProveedor}`);
  },
};
