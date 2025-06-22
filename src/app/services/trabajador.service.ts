import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrabajadorDropdown } from '../interfaces/trabajador-dropdown.interface'; // Importa desde 'interfaces'

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://localhost:8080/api/trabajadores/atencion-cliente'; // URL de tu endpoint

  constructor(private http: HttpClient) { }

  getTrabajadoresAtencionCliente(): Observable<TrabajadorDropdown[]> {
    return this.http.get<TrabajadorDropdown[]>(this.apiUrl);
  }
}