export interface RutaListadoDto {
  idRuta: number;
  serialRuta: string;
  nombreRuta: string;
  glosa: string | null; // Puede ser nulo
}