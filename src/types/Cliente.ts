export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
}

// DTO para crear un nuevo Cliente (POST)
export interface CreateClienteDto {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

// DTO para actualizar un Cliente (PATCH)
export interface UpdateClienteDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}

export interface ClienteFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cliente: Cliente | null;
}
