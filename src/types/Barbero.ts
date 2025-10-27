export interface Barbero {
  id_barbero: number;
  nombre: string;
  apellido: string;
  telefono: string | null;
  fecha_ingreso: string | null; 
  activo: boolean;
}

// DTO para Crear un nuevo Barbero (POST)
export interface CreateBarberoDto {
  nombre: string;
  apellido: string;
  telefono: string;
}

// DTO para Actualizar un Barbero (PATCH)
export interface UpdateBarberoDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  activo?: boolean;
}
