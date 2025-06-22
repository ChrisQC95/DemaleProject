export interface ClienteRegistroRequest {
    nombres?: string; 
    apellidos?: string; 
    razonSocial?: string; 

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