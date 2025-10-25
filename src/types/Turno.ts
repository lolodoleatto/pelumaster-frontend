import type { Barbero } from './Barbero';
import type{ Cliente } from './Cliente';
import type { Servicio } from './Servicio';

// Reflejando la estructura completa del Turno
export type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado';

export interface Turno {
  id_turno: number; // Clave primaria
  
  // Relaciones (se cargan con 'eager: true' o 'relations' en TypeORM)
  cliente: Cliente;
  barbero: Barbero;
  servicio: Servicio;
  
  fecha_hora: string; // TypeORM devuelve Date como un string ISO
  estado: EstadoTurno;
}

export const ESTADOS_TURNO = {
    PENDIENTE: 'pendiente' as EstadoTurno,
    REALIZADO: 'realizado' as EstadoTurno,
    CANCELADO: 'cancelado' as EstadoTurno,
    EN_PROCESO: 'en proceso' as EstadoTurno,
};