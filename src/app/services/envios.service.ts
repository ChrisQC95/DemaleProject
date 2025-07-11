import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvioCreacionDto } from '../interfaces/envio-creacion-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class EnviosService {

  private apiUrl = 'http://localhost:8080/api/envios';

  constructor(private http: HttpClient) { }

  crearEnvio(envioData: EnvioCreacionDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, envioData);
  }
}
