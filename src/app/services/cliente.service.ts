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
  // Define la URL base de tu API de clientes en Spring Boot
  // Asegúrate de que coincida con la URL de tu controlador REST
  private apiUrl = 'http://localhost:8080/api/clientes'; 

  constructor(private http: HttpClient) { }

  /**
   * Envía una solicitud POST al backend para registrar un nuevo cliente.
   * @param clienteData Los datos del cliente a registrar (con la estructura de ClienteRegistroRequest).
   * @returns Un Observable que emitirá la respuesta del backend (ClienteResponse) o un error.
   */
  registrarCliente(clienteData: ClienteRegistroRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.apiUrl}/registrar`, clienteData);
  }

  /**
   * Obtiene la lista de tipos de documento desde el backend.
   * IMPORTANTE: Necesitarás crear el endpoint correspondiente en tu controlador de Spring Boot
   * para que esta función pueda obtener los datos (e.g., GET /api/clientes/tipos-documento).
   */
  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/tipos-documento`);
  }

  /**
   * Obtiene la lista de tipos de cliente desde el backend.
   * IMPORTANTE: Necesitarás crear el endpoint correspondiente en tu controlador de Spring Boot
   * (e.g., GET /api/clientes/tipos-cliente).
   */
  getTiposCliente(): Observable<TipoCliente[]> {
    return this.http.get<TipoCliente[]>(`${this.apiUrl}/tipos-cliente`);
  }

  /**
   * Obtiene la lista de distritos desde el backend.
   * IMPORTANTE: Necesitarás crear el endpoint correspondiente en tu controlador de Spring Boot
   * (e.g., GET /api/clientes/distritos).
   */
  getDistritos(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}/distritos`);
  }

  /**
   * Obtiene la lista de tipos de vía desde el backend.
   * IMPORTANTE: Necesitarás crear el endpoint correspondiente en tu controlador de Spring Boot
   * (e.g., GET /api/clientes/tipos-via).
   */
  getTiposVia(): Observable<TipoVia[]> {
    return this.http.get<TipoVia[]>(`${this.apiUrl}/tipos-via`);
  }

  // Puedes añadir otros métodos aquí según las necesidades de tu aplicación
  // Por ejemplo, para buscar clientes:
  // buscarClientes(query: string): Observable<ClienteResponse[]> {
  //   return this.http.get<ClienteResponse[]>(`${this.apiUrl}/buscar?q=${query}`);
  // }
}