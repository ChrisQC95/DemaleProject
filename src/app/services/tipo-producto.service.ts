import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoProducto } from '../interfaces/tipo-producto.interface'; // Importa desde 'interfaces'

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {
  private apiUrl = 'http://localhost:8080/api/tipos-producto'; // URL de tu endpoint

  constructor(private http: HttpClient) { }

  getTiposProducto(): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(this.apiUrl);
  }
}