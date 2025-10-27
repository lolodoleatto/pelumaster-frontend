export interface Servicio {
  id_servicio: number; // Clave primaria
  nombre: string;
  duracion_minutos: number;
  precio: number; // TypeORM lo devuelve como number (string si usas PostgreSQL)
  descripcion: string | null;
}

// DTO para Crear un nuevo Servicio (POST)
export interface CreateServicioDto {
  nombre: string;
  duracion_minutos: number;
  precio: number;
  descripcion?: string;
}

// DTO para Actualizar un Servicio (PATCH)
export interface UpdateServicioDto {
  nombre?: string;
  duracion_minutos?: number;
  precio?: number;
  descripcion?: string;
}