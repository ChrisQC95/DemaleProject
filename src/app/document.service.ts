import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Necesitamos HttpClient y HttpParams
import { Observable } from 'rxjs'; // Usamos Observables para manejar respuestas asíncronas
import { DocumentLookupResponse } from './interfaces/document-lookup-response.interface'; // Importa la interfaz que acabas de crear

@Injectable({
  providedIn: 'root' // Esto hace que el servicio sea un singleton y esté disponible en toda la aplicación
})
export class DocumentService {
  // Define la URL base de tu backend Spring Boot.
  // ¡Asegúrate que el puerto 8080 sea el correcto si lo cambiaste en Spring Boot!
  private baseUrl = 'http://localhost:8080/api/documentos';

  // El constructor inyecta el servicio HttpClient
  constructor(private http: HttpClient) { }

  /**
   * Método para consultar un documento (DNI, RUC, CEE) en el backend.
   * @param numero El número de documento a consultar.
   * @returns Un Observable que emitirá un DocumentLookupResponse.
   */
  consultarDocumento(numero: string): Observable<DocumentLookupResponse> {
    // Creamos un objeto HttpParams para pasar el número como un parámetro de consulta
    // Esto resultará en una URL como: http://localhost:8080/api/documentos/consultar?numero=XYZ
    let params = new HttpParams().set('numero', numero);

    // Realiza la solicitud GET a tu backend.
    // <DocumentLookupResponse> le dice a TypeScript qué tipo de datos esperar de la respuesta.
    return this.http.get<DocumentLookupResponse>(`${this.baseUrl}/consultar`, { params: params });
  }

  // Aquí podrías añadir otros métodos si tu backend tuviera más endpoints
}