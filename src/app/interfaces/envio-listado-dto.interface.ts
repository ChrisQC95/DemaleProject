export interface EnvioListadoDto {
  idEnvio: number;
  conductorNombreCompleto: string;
  vehiculoDescripcion: string;
  rutaDescripcion: string;
  estadoEnvioNombre: string;
  puntoAcopioNombre: string;
  distritoDestinoNombre: string;
  fechSalida: string; // Usamos string para la fecha, ya que viene de Java.sql.Date
  fechLlegada: string | null; // Puede ser null
  observacion: string | null; // Puede ser null
}
