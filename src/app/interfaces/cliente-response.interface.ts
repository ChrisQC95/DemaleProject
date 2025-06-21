export interface ClienteResponse {
  idCliente: number;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
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
  // Estos campos NO deben estar aquí a menos que el backend ClienteResponse.java los envíe explícitamente:
  idTipoCliente?: number;
  idDistrito?: number;
  idTipoVia?: number;
  direccion?: string;
  nMunicipal?: string;
}