export interface Servicio {
  id_servicio: number; 
  nombre: string;
  duracion_minutos: number;
  precio: number; 
  descripcion: string | null;
}

// DTO para crear un nuevo Servicio (POST)
export interface CreateServicioDto {
  nombre: string;
  duracion_minutos: number;
  precio: number;
  descripcion?: string;
}

// DTO para actualizar un Servicio (PATCH)
export interface UpdateServicioDto {
  nombre?: string;
  duracion_minutos?: number;
  precio?: number;
  descripcion?: string;
}