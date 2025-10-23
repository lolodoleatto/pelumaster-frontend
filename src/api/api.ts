import axios from 'axios';
import type { Barbero } from '../types/Barbero';
import type { Turno } from '../types/Turno';
import type { Cliente } from '../types/Cliente';
import type { Servicio } from '../types/Servicio';

const API_URL = 'http://localhost:3000'; 
const api = axios.create({
  baseURL: API_URL, 
  headers: { 'Content-Type': 'application/json' },
});

// DTO para CREAR un turno
export interface CreateTurnoDto {
  fecha_hora: string; 
  clienteId: number; 
  barberoId: number; 
  servicioId: number; 
}

// --- Funciones de la API ---

export const getBarberos = async (): Promise<Barbero[]> => {
  const response = await api.get<Barbero[]>('/barberos');
  return response.data;
};

export const getTurnos = async (): Promise<Turno[]> => {
  const response = await api.get<Turno[]>('/turnos');
  return response.data;
};

export const createTurno = async (newTurno: CreateTurnoDto): Promise<Turno> => {
  const response = await api.post<Turno>('/turnos', newTurno);
  return response.data;
};

/**
 * Elimina un turno por su ID.
 * Endpoint: DELETE /turnos/:id
 */
export const deleteTurno = async (id: number): Promise<void> => {
  await api.delete(`/turnos/${id}`);
};

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>('/clientes');
  return response.data;
};

/**
 * Obtiene la lista completa de servicios.
 */
export const getServicios = async (): Promise<Servicio[]> => {
  const response = await api.get<Servicio[]>('/servicios');
  return response.data;
};

// ... Otras funciones para Cliente/Servicio si son necesarias.