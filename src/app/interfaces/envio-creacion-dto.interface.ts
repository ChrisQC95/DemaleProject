export interface EnvioCreacionDto {
  idConductor: number | null;
  idVehiculo: number | null;
  idRuta: number | null;
  idAcopio: number | null; // Nuevo campo para el punto de acopio del envío
  idDestino: number | null; // Nuevo campo para el distrito de destino del envío
  fechSalida: string | null;
  observacion: string | null;
  idProductosSeleccionados: number[]; // Array de IDs de productos
}