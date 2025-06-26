import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoRegistroRequest } from '../interfaces/producto-registro-request.interface';
import { ProductoResponse } from '../interfaces/producto-response.interface';

import { Producto } from '../interfaces/producto.interface'; // Si la interfaz Producto está en el mismo componente
// O si creaste un archivo src/app/interfaces/producto.interface.ts:
// import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/productos'; // URL base para tus endpoints de productos

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
    return this.http.delete(`${this.baseUrl}/${idProducto}`,{ responseType: 'text' });
  }
  actualizarProducto(idProducto: number, productoData: Producto): Observable<ProductoResponse> {
    // El backend espera un PUT en /api/productos/{id}
    return this.http.put<ProductoResponse>(`${this.baseUrl}/${idProducto}`, productoData);
  }
}