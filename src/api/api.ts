import axios from 'axios';
import type { Barbero, CreateBarberoDto, UpdateBarberoDto } from '../types/Barbero';
import type { CreateTurnoDto, Turno, TurnoFilters } from '../types/Turno';
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/Cliente';
import type { CreateServicioDto, Servicio, UpdateServicioDto } from '../types/Servicio';

const API_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// =========================================================
// FUNCIONES DE LA API - BARBEROS (CRUD)
// =========================================================

export const getBarberos = async (): Promise<Barbero[]> => {
  const response = await api.get<Barbero[]>('/barberos');
  return response.data;
};

export const createBarbero = async (newBarbero: CreateBarberoDto): Promise<Barbero> => {
  const response = await api.post<Barbero>('/barberos', newBarbero);
  return response.data;
};


export const updateBarbero = async (id: number, updatedFields: UpdateBarberoDto): Promise<Barbero> => {
  const response = await api.patch<Barbero>(`/barberos/${id}`, updatedFields);
  return response.data;
};

export const deleteBarbero = async (id: number): Promise<void> => {
  await api.delete(`/barberos/${id}`);
};

// =========================================================
// FUNCIONES DE LA API - TURNOS (CRUD)
// =========================================================

// Obtener lista de turnos con filtros opcionales
export const getTurnos = async (filters: TurnoFilters = {}): Promise<Turno[]> => {

  const params = new URLSearchParams();

  // Iterar sobre los filtros y agregarlos si tienen valor (no null, no 0, no vacío)
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 0 && value !== '0' && value !== '') {
      params.append(key, String(value));
    }
  });

  // Realizar la petición con los parámetros
  const response = await api.get<Turno[]>('/turnos', { params });
  return response.data;
};

export const createTurno = async (newTurno: CreateTurnoDto): Promise<Turno> => {
  const response = await api.post<Turno>('/turnos', newTurno);
  return response.data;
};

export const deleteTurno = async (id: number): Promise<void> => {
  await api.delete(`/turnos/${id}`);
};

export const cancelarTurno = async (id: number): Promise<Turno> => {
  // El backend maneja el cambio de estado a 'cancelado'.
  const response = await api.patch<Turno>(`/turnos/${id}/cancelar`, {});
  return response.data;
};

export const reprogramarTurno = async (id: number, nuevaFechaHora: string): Promise<Turno> => {
  // Enviamos la nueva fecha_hora en el cuerpo (Body) del request.
  const response = await api.patch<Turno>(`/turnos/${id}/reprogramar`, { fecha_hora: nuevaFechaHora });
  return response.data;
};

// =========================================================
// FUNCIONES DE LA API - CLIENTES (CRUD)
// =========================================================

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>('/clientes');
  return response.data;
};

export const createCliente = async (newCliente: CreateClienteDto): Promise<Cliente> => {
  const response = await api.post<Cliente>('/clientes', newCliente);
  return response.data;
};

export const updateCliente = async (id: number, updatedFields: UpdateClienteDto): Promise<Cliente> => {
  const response = await api.patch<Cliente>(`/clientes/${id}`, updatedFields);
  return response.data;
};

export const deleteCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};

// =========================================================
// FUNCIONES DE LA API - SERVICIOS (CRUD)
// =========================================================

export const getServicios = async (): Promise<Servicio[]> => {
  const response = await api.get<Servicio[]>('/servicios');
  return response.data;
};

export const createServicio = async (newServicio: CreateServicioDto): Promise<Servicio> => {
  const response = await api.post<Servicio>('/servicios', newServicio);
  return response.data;
};

export const updateServicio = async (id: number, updatedFields: UpdateServicioDto): Promise<Servicio> => {
  const response = await api.patch<Servicio>(`/servicios/${id}`, updatedFields);
  return response.data;
};

export const deleteServicio = async (id: number): Promise<void> => {
  await api.delete(`/servicios/${id}`);
};


// =========================================================
// FUNCIONES DE LA API - GENERAR REPORTES
// =========================================================

export interface ReporteBarbero {
  id_barbero: number;
  totalTurnos: number;
  totalGanancias: number;
  desde?: string;
  hasta?: string;
  turnos: Turno[];
}

export const getReporteBarbero = async (
  barberoId: number,
  desde?: string,
  hasta?: string
): Promise<ReporteBarbero> => {
  let url = `/reportes/barbero/${barberoId}`;
  const params = new URLSearchParams();

  // 1. Construir parámetros de filtro
  if (desde) params.append('desde', desde);
  if (hasta) params.append('hasta', hasta);

  // 2. Adjuntar parámetros a la URL
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  // 3. Realizar la petición
  const response = await api.get<ReporteBarbero>(url);
  return response.data;
};


