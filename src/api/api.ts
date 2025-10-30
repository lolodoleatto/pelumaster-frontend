import axios from 'axios';
import type { Barbero, CreateBarberoDto, UpdateBarberoDto } from '../types/Barbero';
import type { Turno } from '../types/Turno';
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/Cliente';
import type { CreateServicioDto, Servicio, UpdateServicioDto } from '../types/Servicio';

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

// Define la interface para los parámetros de filtro
export interface TurnoFilters {
  barberoId?: number | string;
  clienteId?: number | string;
  servicioId?: number | string;
  estado?: string;
  fecha?: string; // Formato YYYY-MM-DD
}

// --- Funciones de la API ---

export const getBarberos = async (): Promise<Barbero[]> => {
  const response = await api.get<Barbero[]>('/barberos');
  return response.data;
};

/**
 * Crea un nuevo barbero (POST /barberos)
 */
export const createBarbero = async (newBarbero: CreateBarberoDto): Promise<Barbero> => {
  const response = await api.post<Barbero>('/barberos', newBarbero);
  return response.data;
};

/**
 * Actualiza un barbero existente (PATCH /barberos/:id)
 */
export const updateBarbero = async (id: number, updatedFields: UpdateBarberoDto): Promise<Barbero> => {
  const response = await api.patch<Barbero>(`/barberos/${id}`, updatedFields);
  return response.data;
};

/**
 * Elimina un barbero (DELETE /barberos/:id)
 */
export const deleteBarbero = async (id: number): Promise<void> => {
  await api.delete(`/barberos/${id}`);
};

/**
 * Obtiene la lista de turnos, aceptando filtros.
 */
export const getTurnos = async (filters: TurnoFilters = {}): Promise<Turno[]> => {
  // 1. Construir los query parameters
  const params = new URLSearchParams();

  // Iterar sobre los filtros y agregarlos si tienen valor (no null, no 0, no vacío)
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 0 && value !== '0' && value !== '') {
      params.append(key, String(value));
    }
  });

  // 2. Realizar la petición con los parámetros
  const response = await api.get<Turno[]>('/turnos', { params });
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


// =========================================================
// 🟢 FUNCIONES NUEVAS PARA MANEJO DE ESTADO
// =========================================================

/**
 * Cancela un turno.
 * Endpoint: PATCH /turnos/:id/cancelar
 */
export const cancelarTurno = async (id: number): Promise<Turno> => {
  // El backend maneja el cambio de estado a 'cancelado'.
  const response = await api.patch<Turno>(`/turnos/${id}/cancelar`, {});
  return response.data;
};

/**
 * Reprograma un turno a una nueva fecha y hora.
 * Endpoint: PATCH /turnos/:id/reprogramar
 */
export const reprogramarTurno = async (id: number, nuevaFechaHora: string): Promise<Turno> => {
  // Enviamos la nueva fecha_hora en el cuerpo (Body) del request.
  const response = await api.patch<Turno>(`/turnos/${id}/reprogramar`, { fecha_hora: nuevaFechaHora });
  return response.data;
};


/**
 * Obtiene la lista completa de clientes (GET /clientes)
 */
export const getClientes = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>('/clientes');
  return response.data;
};

/**
 * Crea un nuevo cliente (POST /clientes)
 */
export const createCliente = async (newCliente: CreateClienteDto): Promise<Cliente> => {
  const response = await api.post<Cliente>('/clientes', newCliente);
  return response.data;
};

/**
 * Actualiza un cliente existente (PATCH /clientes/:id)
 */
export const updateCliente = async (id: number, updatedFields: UpdateClienteDto): Promise<Cliente> => {
  const response = await api.patch<Cliente>(`/clientes/${id}`, updatedFields);
  return response.data;
};

/**
 * Elimina un cliente (DELETE /clientes/:id)
 */
export const deleteCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};

// --- Funciones de Servicios (CRUD) ---

/**
 * Obtiene la lista completa de servicios (GET /servicios)
 */
export const getServicios = async (): Promise<Servicio[]> => {
  const response = await api.get<Servicio[]>('/servicios');
  return response.data;
};

/**
 * Crea un nuevo servicio (POST /servicios)
 */
export const createServicio = async (newServicio: CreateServicioDto): Promise<Servicio> => {
  const response = await api.post<Servicio>('/servicios', newServicio);
  return response.data;
};

/**
 * Actualiza un servicio existente (PATCH /servicios/:id)
 */
export const updateServicio = async (id: number, updatedFields: UpdateServicioDto): Promise<Servicio> => {
  const response = await api.patch<Servicio>(`/servicios/${id}`, updatedFields);
  return response.data;
};

/**
 * Elimina un servicio (DELETE /servicios/:id)
 */
export const deleteServicio = async (id: number): Promise<void> => {
  await api.delete(`/servicios/${id}`);
};


// Al final de la sección de funciones CRUD de Turno (o al final del archivo)

/**
 * Obtiene el reporte de turnos y ganancias de un barbero con filtros opcionales de fecha.
 * Endpoint: GET /reportes/barbero/:id?desde=...&hasta=...
 */
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

export interface ReporteBarbero {
    id_barbero: number;
    totalTurnos: number;
    totalGanancias: number; // Tu backend devuelve un número aquí
    desde?: string;
    hasta?: string;
    turnos: Turno[]; // Lista detallada de turnos
}

