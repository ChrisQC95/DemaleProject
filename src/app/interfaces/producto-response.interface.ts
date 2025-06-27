export interface ProductoResponse {
    idProducto: number;
    producto: string;
    alto: number;
    ancho: number;
    largo: number;
    peso: number;
    fechIngreso: string; // O Date si vas a convertirlo
    fechLlegada: string | null; // Puede ser null, por eso 'string | null'

    puntoAcopioNombre: string;
    tipoProductoNombre: string;
    clienteNombreCompleto: string;
    estadoEnvioNombre: string;
    distritoDestinoNombre: string;
    trabajadorNombre: string;

    idPuntoAcopio: number;
    idTipoProducto: number;
    idCliente: number;
    idEstadoEnvio: number;
    idDistrito: number;
    idTrabajador: number;

    guiaRemisionBase64: string | null; // Puede ser null si no hay guía o está vacío
}