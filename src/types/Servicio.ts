export interface Servicio {
  id_servicio: number; // Clave primaria
  nombre: string;
  duracion_minutos: number;
  precio: number; // TypeORM lo devuelve como number (string si usas PostgreSQL)
  descripcion: string | null;
}
