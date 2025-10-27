export interface Cliente {
  id_cliente: number; // Clave primaria
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
}


// DTO para Crear un nuevo Cliente (POST)
export interface CreateClienteDto {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

// DTO para Actualizar un Cliente (PATCH)
export interface UpdateClienteDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}