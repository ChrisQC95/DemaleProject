import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConductorDropdown } from '../interfaces/conductor-dropdown.interface'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private baseUrl = 'http://localhost:8080/api/conductores'; // URL de tu backend

  constructor(private http: HttpClient) { }

  getConductoresForDropdown(): Observable<ConductorDropdown[]> {
    return this.http.get<ConductorDropdown[]>(`${this.baseUrl}/dropdown`);
  }
}