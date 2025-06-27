export interface ProductoUpdateRequest {
  idProducto: number;
  producto: string;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  fechIngreso: string;
  puntoAcopio: { idPuntoAcopio: number };
  tipoProducto: { idTipoProducto: number };
  cliente: { idCliente: number };
  estadoEnvio: { idEstadoEnvio: number };
  distrito: { idDistrito: number };
  trabajador: { idTrabajador: number };
  guiaRemision: any;
}