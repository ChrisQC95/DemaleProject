import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Distrito } from '../interfaces/distrito.interface'; // Asegúrate de que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private baseUrl = 'http://localhost:8080/api/clientes/distritos'; // Ajusta esta URL a tu endpoint de distritos

  constructor(private http: HttpClient) { }

  getAllDistritos(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(this.baseUrl);
  }
}