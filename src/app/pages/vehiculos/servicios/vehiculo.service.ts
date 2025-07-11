// src/app/pages/vehiculos/servicios/vehiculo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// REVERTIDO: Se mantiene 'vehiculo' (v minúscula) según tu preferencia
export interface vehiculo {
  idVehiculo?: number;
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

  listarVehiculos(): Observable<vehiculo[]> {
    return this.http.get<vehiculo[]>(this.url);
  }

  // Esperamos un objeto con 'message' y el 'vehiculo' creado
  agregarVehiculo(vehiculo: vehiculo): Observable<{ message: string, vehiculo: vehiculo }> {
    return this.http.post<{ message: string, vehiculo: vehiculo }>(this.url, vehiculo);
  }

  // Esperamos un objeto con 'message' y el 'vehiculo' actualizado
  actualizarVehiculo(vehiculo: vehiculo): Observable<{ message: string, vehiculo: vehiculo }> {
    if (!vehiculo.idVehiculo) {
      throw new Error('El IdVehiculo es requerido para actualizar');
    }
    return this.http.put<{ message: string, vehiculo: vehiculo }>(`${this.url}/${vehiculo.idVehiculo}`, vehiculo);
  }

  // Esperamos un objeto con 'message'
  eliminarVehiculo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}