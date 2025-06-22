import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuntoAcopio } from '../interfaces/punto-acopio.interface'; // Importa desde 'interfaces'

@Injectable({
  providedIn: 'root'
})
export class PuntoAcopioService {
  private apiUrl = 'http://localhost:8080/api/puntos-acopio'; // URL de tu endpoint

  constructor(private http: HttpClient) { }

  getPuntosAcopio(): Observable<PuntoAcopio[]> {
    return this.http.get<PuntoAcopio[]>(this.apiUrl);
  }
}