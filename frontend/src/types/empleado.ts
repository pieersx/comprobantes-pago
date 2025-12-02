/**
 * Tipos para la entidad Empleado
 * Feature: empleados-comprobantes-blob
 */

export interface Empleado {
  codCia: number;
  codEmpleado: number;

  // Datos de Persona (relación)
  desPersona?: string;
  desCorta?: string;

  // Datos propios de Empleado
  direcc: string;
  celular: string;
  hobby?: string;
  dni: string;
  email: string;
  fecNac: string; // formato yyyy-MM-dd
  nroCip?: string;
  fecCipVig?: string;
  licCond?: string;
  flgEmplIea?: string;
  observac?: string;
  codCargo?: number;
  vigente: string;

  // Foto en Base64 (solo cuando se solicita específicamente)
  fotoBase64?: string;

  // Flag para indicar si tiene foto
  tieneFoto?: boolean;
}

export interface EmpleadoCreate {
  codCia: number;
  codEmpleado: number;
  direcc: string;
  celular: string;
  hobby?: string;
  dni: string;
  email: string;
  fecNac: string;
  nroCip?: string;
  fecCipVig?: string;
  licCond?: string;
  flgEmplIea?: string;
  observac?: string;
  codCargo?: number;
  vigente?: string;
}

export interface EmpleadoUpdate extends Partial<EmpleadoCreate> {}

export interface EmpleadoFilters {
  codCia: number;
  soloVigentes?: boolean;
  query?: string;
}
