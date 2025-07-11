import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvioCreacionDto } from '../interfaces/envio-creacion-dto.interface';
import { EnvioListadoDto } from '../interfaces/envio-listado-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class EnviosService {

  private apiUrl = 'http://localhost:8080/api/envios';

  constructor(private http: HttpClient) { }

  crearEnvio(envioData: EnvioCreacionDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, envioData);
  }
  obtenerTodosLosEnvios(): Observable<EnvioListadoDto[]> {
    return this.http.get<EnvioListadoDto[]>(this.apiUrl);
  }

  // Si planeas usar la edición, también necesitarás un método para obtener un envío por ID
  obtenerEnvioPorId(idEnvio: number): Observable<EnvioListadoDto> {
    return this.http.get<EnvioListadoDto>(`${this.apiUrl}/${idEnvio}`);
  }

  // Y un método para actualizar
  actualizarEnvio(idEnvio: number, envioData: any): Observable<EnvioListadoDto> {
    return this.http.put<EnvioListadoDto>(`${this.apiUrl}/${idEnvio}`, envioData);
  }

  // Y un método para eliminar
  eliminarEnvio(idEnvio: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idEnvio}`);
  }
}
