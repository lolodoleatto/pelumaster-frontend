import type { Barbero } from './Barbero';
import type{ Cliente } from './Cliente';
import type { Servicio } from './Servicio';

export type EstadoTurno = 'pendiente' | 'realizado' | 'cancelado' | 'en proceso';

export interface Turno {
  id_turno: number; 
  cliente: Cliente;
  barbero: Barbero;
  servicio: Servicio;
  fecha_hora: string;
  estado: EstadoTurno;
}

// DTO para crear un turno
export interface CreateTurnoDto {
  fecha_hora: string;
  clienteId: number;
  barberoId: number;
  servicioId: number;
}

// Define la interface para los parámetros de filtro
export interface TurnoFilters {
  barberoId?: number | string;
  clienteId?: number | string;
  servicioId?: number | string;
  estado?: string;
  fecha?: string; 
}

export const ESTADOS_TURNO = {
    PENDIENTE: 'pendiente' as EstadoTurno,
    REALIZADO: 'realizado' as EstadoTurno,
    CANCELADO: 'cancelado' as EstadoTurno,
    EN_PROCESO: 'en proceso' as EstadoTurno,
};

