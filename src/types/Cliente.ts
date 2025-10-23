export interface Cliente {
  id_cliente: number; // Clave primaria
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
}