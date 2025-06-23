export interface Producto {
  id?: number;
  producto: string;
  alto?: number;
  largo?: number;
  ancho?: number;
  peso: number;
  guiaRemisionFile?: File | null;
  idTipoProducto: number | null;
  idPuntoAcopio: number | null;
  idCliente: number | null;
  idEstadoEnvio: number | null;
  idDistrito: number | null;
  idTrabajador: number | null;
  // fechaIngreso?: string; // Si viene como string del backend
  // fechaLlegada?: string;
}