// src/app/pages/conductores/servicios/conductor.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importar 'of' para los datos de ejemplo (¡REEMPLAZAR!)

// Interface for data sent to the backend (request DTO)
export interface Conductor {
  idPersona?: number; // Optional for new registrations
  nombres: string;
  apellidos: string;
  razonSocial?: string; // Optional
  numeroDocumento: string;
  telefono: string;
  correo: string;
  direccion?: string; // Optional
  nMunicipal?: string; // Optional
  idDistrito?: number | null; // Optional, cambiado a number | null para manejar la opción "Seleccione"
  idTipoVia?: number | null; // Optional, cambiado a number | null para manejar la opción "Seleccione"
  idTipoDoc: number | null;
  licencia: string;
  idRol: number; // Se mantiene, ya que se envía al backend
}

// Interface for data received from the backend (response DTO)
export interface ConductorResponse {
  idPersona: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  celular: string; // Corresponds to telefono in backend Persona model
  correo: string;
  licencia: string;
  rol: string;
  razonSocial?: string; // Added to match backend DTO
  direccion?: string; // Added to match backend DTO
  nMunicipal?: string; // Added to match backend DTO
  idRol: number; // Added to match backend DTO for edit functionality
  idTipoDoc: number; // Added to match backend DTO for edit functionality
  idDistrito?: number; // Added to match backend DTO for edit functionality
  idTipoVia?: number; // Added to match backend DTO for edit functionality
  tipoVia?: string; // Added to match backend DTO for display
}

// Interfaces para los datos de los desplegables (TipoDocumento)
export interface TipoDocumentoDropdown {
  idTipoDoc: number;
  nombreDoc: string;
}

// ELIMINADO: export interface RolDropdown { ... }

// Aunque no se muestren en el HTML, mantenemos las interfaces para compatibilidad con el backend
export interface TipoViaDropdown {
  idTipoVia: number;
  nombreTipoVia: string;
}

export interface DistritoDropdown {
  idDistrito: number;
  nombreDistrito: string;
}


@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private url = 'http://localhost:8080/api/conductores'; // URL base para conductores

  // URLs para los desplegables (ajusta estas URLs a tus endpoints reales si son diferentes)
  private tipoDocumentoUrl = 'http://localhost:8080/api/tiposdocumento/dropdown';
  // ELIMINADO: private rolUrl = 'http://localhost:8080/api/roles/dropdown';
  private tipoViaUrl = 'http://localhost:8080/api/conductores/tiposvia/dropdown'; // Endpoint en ConductorController
  private distritoUrl = 'http://localhost:8080/api/conductores/distritos/dropdown'; // Endpoint en ConductorController

  constructor(private http: HttpClient) {}

  /**
   * Fetches a list of all conductors from the backend.
   * @returns An Observable of an array of ConductorResponse.
   */
  listarConductores(): Observable<ConductorResponse[]> {
    return this.http.get<ConductorResponse[]>(this.url);
  }

  /**
   * Registers a new conductor by sending data to the backend.
   * @param dto The Conductor object containing the new conductor's details.
   * @returns An Observable of the backend's response.
   */
  registrarConductor(dto: Conductor): Observable<any> {
    return this.http.post(this.url, dto);
  }

  /**
   * Updates an existing conductor by ID.
   * @param id The ID of the conductor to update.
   * @param dto The Conductor object containing the updated details.
   * @returns An Observable of the backend's response.
   */
  actualizarConductor(id: number, dto: Conductor): Observable<any> {
    return this.http.put(`${this.url}/${id}`, dto);
  }

  /**
   * Deletes a conductor by ID.
   * @param id The ID of the conductor to delete.
   * @returns An Observable of the backend's response.
   */
  eliminarConductor(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // MÉTODOS PARA CARGAR DATOS DE DESPLEGABLES (¡REEMPLAZAR 'of([])' CON LLAMADAS HTTP REALES!)
  getTiposDocumentoForDropdown(): Observable<TipoDocumentoDropdown[]> {
    // Reemplaza esta línea con: return this.http.get<TipoDocumentoDropdown[]>(this.tipoDocumentoUrl);
    return of([
      { idTipoDoc: 1, nombreDoc: 'DNI' },
      { idTipoDoc: 2, nombreDoc: 'RUC' }
    ]);
  }

  // ELIMINADO: getRolesForDropdown(): Observable<RolDropdown[]> { ... }

  // Estos métodos se mantienen aunque no se usen en el HTML, para compatibilidad y posible futura activación
  getTiposViaForDropdown(): Observable<TipoViaDropdown[]> {
    // Reemplaza esta línea con: return this.http.get<TipoViaDropdown[]>(this.tipoViaUrl);
    return of([
      { idTipoVia: 1, nombreTipoVia: 'Avenida' },
      { idTipoVia: 2, nombreTipoVia: 'Calle' },
      { idTipoVia: 3, nombreTipoVia: 'Jirón' }
    ]);
  }

  getDistritosForDropdown(): Observable<DistritoDropdown[]> {
    // Reemplaza esta línea con: return this.http.get<DistritoDropdown[]>(this.distritoUrl);
    return of([
      { idDistrito: 1, nombreDistrito: 'Miraflores' },
      { idDistrito: 2, nombreDistrito: 'San Isidro' },
      { idDistrito: 3, nombreDistrito: 'Santiago de Surco' }
    ]);
  }
}
