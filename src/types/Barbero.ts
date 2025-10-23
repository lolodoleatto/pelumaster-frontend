export interface Barbero {
  id_barbero: number; // Clave primaria
  nombre: string;
  apellido: string;
  telefono: string | null;
  fecha_ingreso: string | null; // El backend devuelve la fecha como string
  activo: boolean;
  // 'turnos' no se incluye aquí ya que no es necesario para el consumo básico
}