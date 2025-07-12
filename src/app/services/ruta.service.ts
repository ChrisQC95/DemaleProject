import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RutaDropdown } from '../interfaces/ruta-dropdown.interface'; // Ajusta la ruta
import { RutaListadoDto } from '../interfaces/ruta-listado-dto.interface';
import { RutaCreacionDto } from '../interfaces/ruta-creacion-dto.interface';
import { RutaUpdateDto } from '../interfaces/ruta-update-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private baseUrl = 'http://localhost:8080/api/rutas'; // URL de tu backend

  constructor(private http: HttpClient) { }

  getRutasForDropdown(): Observable<RutaDropdown[]> {
    return this.http.get<RutaDropdown[]>(`${this.baseUrl}/dropdown`);
  }
  getAllRutas(): Observable<RutaListadoDto[]> {
    return this.http.get<RutaListadoDto[]>(this.baseUrl);
  }
  getRutaById(id: number): Observable<RutaUpdateDto> {
    return this.http.get<RutaUpdateDto>(`${this.baseUrl}/${id}`);
  }
  createRuta(rutaData: RutaCreacionDto): Observable<RutaListadoDto> {
    return this.http.post<RutaListadoDto>(this.baseUrl, rutaData);
  }
  updateRuta(id: number, rutaData: RutaUpdateDto): Observable<RutaListadoDto> {
    return this.http.put<RutaListadoDto>(`${this.baseUrl}/${id}`, rutaData);
  }
  deleteRuta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}