import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuntoDescansoDropdown } from '../interfaces/punto-descanso-dropdown.interface';

@Injectable({
  providedIn: 'root'
})
export class PuntoDescansoService {
  // ¡CORRECCIÓN AQUÍ! Añadimos /dropdown a la URL
  private apiUrl = 'http://localhost:8080/api/puntos-descanso/dropdown'; 

  constructor(private http: HttpClient) { }

  getPuntosDescanso(): Observable<PuntoDescansoDropdown[]> {
    return this.http.get<PuntoDescansoDropdown[]>(this.apiUrl);
  }
}
