import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehiculoDropdown } from '../interfaces/vehiculo-dropdown.interface'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private baseUrl = 'http://localhost:8080/api/vehiculos'; // URL de tu backend

  constructor(private http: HttpClient) { }

  getVehiculosForDropdown(): Observable<VehiculoDropdown[]> {
    return this.http.get<VehiculoDropdown[]>(`${this.baseUrl}/dropdown`);
  }
}