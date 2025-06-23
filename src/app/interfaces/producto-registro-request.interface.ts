export interface ProductoRegistroRequest {
  producto: string;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  idPuntoAcopio: number;
  idTipoProducto: number;
  idCliente: number;
  idEstadoEnvio: number;
  idDistrito: number;
  idTrabajador: number;
}