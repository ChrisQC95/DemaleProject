import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehiculo {
  IdVehiculo?: number;
  placa: string;
  marca: string;
  modelo: string;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private url = 'http://localhost:8080/api/vehiculos';

  constructor(private http: HttpClient) {}

  listarVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.url);
  }

  agregarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.url, vehiculo);
  }

  actualizarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    if (!vehiculo.IdVehiculo) {
      throw new Error('El IdVehiculo es requerido para actualizar');
    }
    return this.http.put<Vehiculo>(`${this.url}/${vehiculo.IdVehiculo}`, vehiculo);
  }

  eliminarVehiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}


