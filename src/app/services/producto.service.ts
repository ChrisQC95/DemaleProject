import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoRegistroRequest } from '../interfaces/producto-registro-request.interface';
import { ProductoResponse } from '../interfaces/producto-response.interface';
// >>>>>>> HEAD y el resto de líneas con muchos caracteres son marcadores de conflicto de Git.
// Debes elegir una de las líneas, o combinarlas. La siguiente línea es la correcta si ProductoUpdateRequest es una importación.
import { ProductoUpdateRequest } from '../interfaces/producto-update-request.interface'; // Asegúrate de que esta ruta sea correcta
// <<<<<<< HEAD y el resto de líneas son marcadores de conflicto de Git.
// >>>>>>> 2822da79c3a55a237f9b3fe5822d07ac207e6143 // Esta línea es un marcador de conflicto.
import { Producto } from '../interfaces/producto.interface'; // Si la interfaz Producto está en el mismo componente

// O si creaste un archivo src/app/interfaces/producto.interface.ts:
// import { Producto } from '../interfaces/producto.interface';
export interface HistorialProducto {
  idProducto: number;
  producto: string;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  fechIngreso: string;
  fechLlegada: string | null;
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
  guiaRemisionBase64: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/productos'; // URL base para tus endpoints de productos
  private acopioUrl = 'http://localhost:8080/api/puntos-acopio'; // URL base para tus puntos de acopio
  private estadosUrl = 'http://localhost:8080/api/estados-envio'; // URL base para tus estados de envío

  constructor(private http: HttpClient) { }

  registrarProductoSinGuia(productoData: ProductoRegistroRequest): Observable<ProductoResponse> {
    // Asumiendo que el endpoint para registrar sin guía es POST /productos/registrar
    return this.http.post<ProductoResponse>(`${this.baseUrl}/registrar`, productoData);
  }

  registrarProductoConGuia(formData: FormData): Observable<ProductoResponse> {
    // HttpClient se encarga de establecer 'Content-Type': 'multipart/form-data' automáticamente para FormData.
    return this.http.post<ProductoResponse>(`${this.baseUrl}/registrar-con-guia`, formData);
  }

  // Tu método existente para obtener productos por cliente
  getProductosByCliente(idCliente: number): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}/cliente/${idCliente}`);
  }

  // Tu método existente para obtener productos por cliente y en almacén
  listarProductosPorClienteYEnAlmacen(idCliente: number): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}/cliente/${idCliente}/en-almacen`);
  }

  // Tu método existente para eliminar producto
  deleteProduct(idProducto: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idProducto}`, { responseType: 'text' });
  }

  listarProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}`);
  }

  obtenerHistorial(): Observable<HistorialProducto[]> {
    // Asumiendo que el endpoint para obtener el historial es GET /productos/historial
    return this.http.get<HistorialProducto[]>(`${this.baseUrl}/historial`);
  }

  obtenerHistorialPorEstado(idEstado: number): Observable<HistorialProducto[]> {
    return this.http.get<HistorialProducto[]>(`${this.baseUrl}/historial/estado-envio/${idEstado}`);
  }

  obtenerHistorialPorPuntoAcopio(idPunto: number): Observable<HistorialProducto[]> {
    return this.http.get<HistorialProducto[]>(`${this.baseUrl}/historial/punto-acopio/${idPunto}`);
  }

  obtenerHistorialFiltrado(idPunto: number, idEstado: number): Observable<HistorialProducto[]> {
    return this.http.get<HistorialProducto[]>(
      `${this.baseUrl}/historial/filtro?idPuntoAcopio=${idPunto}&idEstadoEnvio=${idEstado}`
    );
  }

  getPuntosAcopio(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/puntos-acopio');
  }

  getEstadosEnvio(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/estados-envio');
  }

  // >>>>> ESTE ES EL MÉTODO QUE ESTABA MAL COLOCADO <<<<<
  // Lo he movido al mismo nivel que los otros métodos de la clase ProductoService.
  actualizarProducto(idProducto: number, productoData: ProductoUpdateRequest): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${this.baseUrl}/${idProducto}`, productoData);
  }
  getProductosEnAlmacen(): Observable<ProductoResponse[]> {
    // Apunta al endpoint de tu backend /api/productos/en-almacen
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}/en-almacen`);
  }
}