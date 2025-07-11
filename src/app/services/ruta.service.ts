import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RutaDropdown } from '../interfaces/ruta-dropdown.interface'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private baseUrl = 'http://localhost:8080/api/rutas'; // URL de tu backend

  constructor(private http: HttpClient) { }

  getRutasForDropdown(): Observable<RutaDropdown[]> {
    return this.http.get<RutaDropdown[]>(`${this.baseUrl}/dropdown`);
  }
}