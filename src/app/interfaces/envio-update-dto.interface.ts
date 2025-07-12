import { HistorialPuntoDescansoDto } from './historial-punto-descanso-dto.interface';
export interface EnvioUpdateDto {
  idEnvio: number | null;
  idConductor: number | null;
  idVehiculo: number | null;
  idRuta: number | null;
  idEstadoEnvio: number | null;
  idPuntoAcopio: number | null;
  idDistrito: number | null;
  fechSalida: string | null;
  fechLlegada: string | null;
  observacion: string | null;
  historialPuntosDescanso?: HistorialPuntoDescansoDto[];
}