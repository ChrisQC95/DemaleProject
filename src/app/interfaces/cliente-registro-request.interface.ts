export interface ClienteRegistroRequest {
    nombres?: string; // Ahora opcional
    apellidos?: string; // Ahora opcional
    razonSocial?: string; // Nuevo campo

    idTipoDoc: number;
    numeroDocumento: string;
    telefono?: string;
    correo?: string;

    idDistrito?: number;
    idTipoVia?: number;
    direccion?: string;
    nMunicipal?: string;

    idTipoCliente: number;
}