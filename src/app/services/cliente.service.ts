import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Importa las interfaces que creaste en el Paso 1
import { ClienteRegistroRequest } from '../interfaces/cliente-registro-request.interface'; 
import { ClienteResponse } from '../interfaces/cliente-response.interface'; 
import { TipoDocumento } from '../interfaces/tipo-documento.interface';
import { TipoCliente } from '../interfaces/tipo-cliente.interface';
import { Distrito } from '../interfaces/distrito.interface'; 
import { TipoVia } from '../interfaces/tipo-via.interface'; 


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes'; 

  constructor(private http: HttpClient) { }
  registrarCliente(clienteData: ClienteRegistroRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.apiUrl}/registrar`, clienteData);
  }

  buscarClientes(query: string): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(`${this.apiUrl}/buscar`, { params: { query: query } });
  }
  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/tipos-documento`);
  }
  getTiposCliente(): Observable<TipoCliente[]> {
    return this.http.get<TipoCliente[]>(`${this.apiUrl}/tipos-cliente`);
  }
  getDistritos(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}/distritos`);
  }
  getTiposVia(): Observable<TipoVia[]> {
    return this.http.get<TipoVia[]>(`${this.apiUrl}/tipos-via`);
  }
}