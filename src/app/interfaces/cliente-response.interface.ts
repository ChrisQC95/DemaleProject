export interface ClienteResponse {
  idCliente: number;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  nombreCompleto: string;
  tipoDocumentoNombre: string;
  numeroDocumento: string;
  telefono?: string;
  correo?: string;
  distritoNombre?: string;
  tipoViaNombre?: string;
  direccionCompleta?: string;
  tipoClienteNombre: string;
  fechaRegistro: string;
  estado: boolean;
  idTipoCliente?: number;
  idDistrito?: number;
  idTipoVia?: number;
  direccion?: string;
  nMunicipal?: string;
}