import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Asegúrate de que esta ruta sea correcta y que Producto sea la interfaz que definiste en productos.component.ts
// O si tienes un archivo dedicado para la interfaz Producto, ajústala aquí.
import { Producto } from '../interfaces/producto.interface'; // Si la interfaz Producto está en el mismo componente
// O si creaste un archivo src/app/interfaces/producto.interface.ts:
// import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/productos'; // URL base para tus endpoints de productos

  constructor(private http: HttpClient) { }

  registrarProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }
  getProductosByCliente(idCliente: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/cliente/${idCliente}`);
  }
  deleteProduct(idProducto: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idProducto}`);
  }
}