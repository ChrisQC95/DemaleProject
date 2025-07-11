import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrabajadorDropdown } from '../interfaces/trabajador-dropdown.interface'; // Asegúrate que la ruta sea correcta

// --- INICIO: Interfaz para el Trabajador COMPLETO (la respuesta de /api/trabajadores) ---
// Define esta interfaz aquí mismo o impórtala si ya la tienes en otro archivo (ej. trabajador.interface.ts)
export interface Trabajador {
    idTrabajador?: number; // Hacemos opcional para la creación (POST)
    nombres: string;
    apellidos: string;
    razonSocial: string | null; // Tipo: string O null
    numeroDocumento: string; // Ya habías puesto string, lo mantengo así según el Postman
    telefono: string | null; // Tipo: string O null
    correo: string | null;   // Tipo: string O null
    direccion: string | null; // Tipo: string O null
    idDistrito: number;       // Tipo: number
    nombreDistrito?: string | null; // Solo para recibir, no enviar en POST
    idTipoVia: number;        // Tipo: number
    nombreTipoVia?: string | null; // Solo para recibir, no enviar en POST
    idTipoDocumento: number;
    nombreTipoDocumento?: string | null; // Solo para recibir, no enviar en POST
    fechNacimiento: string; // Tipo: string (formato 'YYYY-MM-DD')
    foto: string | null;     // Tipo: string O null
    idRol: number;
    nombreRol?: string | null; // Solo para recibir, no enviar en POST
    nmunicipal: string | null; // Tipo: string O null
    // Si tu API GET devuelve más campos (como fechas de creación/actualización, etc.),
    // agrégalos aquí con '?' para hacerlos opcionales para la interfaz general.
    fechaCreacion?: string;
    fechaActualizacion?: string;
    estadoRegistro?: boolean;
}

    export interface Distrito {
      idDistrito: number;
      nombreDistrito: string; // <-- CORREGIDO: coincide con el backend
      // Puedes añadir más propiedades si las usas, por ejemplo:
      provincia?: {
        idProvincia: number;
        nombreProvincia: string;
        departamento?: {
          idDepartamento: number;
          nombreDepartamento: string;
        }
      };
    }
    export interface TipoVia {
      idTipoVia: number;
      nombreTipoVia: string;
    }

    export interface TipoDocumento {
      idTipoDoc: number; // <-- CORREGIDO: coincide con el backend (idTipoDoc en lugar de idTipoDocumento)
      nombreDoc: string;
    }

    export interface Rol {
      idRol: number;
    nombreRol: string;
    }
// --- FIN: Interfaz Trabajador ---

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  // URL para el endpoint general de trabajadores
  private generalApiUrl = 'http://localhost:8080/api/trabajadores';
  // URL para el endpoint específico de atención al cliente
  private atencionClienteApiUrl = 'http://localhost:8080/api/trabajadores/atencion-cliente';

  // URLs para selects
  private distritosApiUrl = 'http://localhost:8080/api/distritos';
  private tiposViaApiUrl = 'http://localhost:8080/api/tipos-via';
  private tiposDocumentoApiUrl = 'http://localhost:8080/api/tipos-documento';
  private rolesApiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  // --- Métodos CRUD Generales para Trabajadores (que necesitas para empleados.component) ---

  /**
   * Obtiene la lista COMPLETA de todos los trabajadores.
   */
  getAllTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.generalApiUrl);
  }

  /**
   * Obtiene un trabajador específico por su ID.
   */
  getTrabajadorById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.generalApiUrl}/${id}`);
  }

  /**
   * Agrega un nuevo trabajador.
   */
  addTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.generalApiUrl, trabajador);
  }

  /**
   * Actualiza un trabajador existente.
   */
  updateTrabajador(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.generalApiUrl}/${id}`, trabajador);
  }

  /**
   * Elimina un trabajador.
   */
  deleteTrabajador(id: number): Observable<any> {
    return this.http.delete(`${this.generalApiUrl}/${id}`);
  }

  // --- Método específico para Trabajadores de Atención al Cliente (el que ya tenías) ---

  /**
   * Obtiene la lista de trabajadores de atención al cliente para un dropdown.
   */
  getTrabajadoresAtencionCliente(): Observable<TrabajadorDropdown[]> {
    return this.http.get<TrabajadorDropdown[]>(this.atencionClienteApiUrl);
  }

  getDistritos(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(this.distritosApiUrl);
  }

  getTiposVia(): Observable<TipoVia[]> {
    return this.http.get<TipoVia[]>(this.tiposViaApiUrl);
  }

  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.tiposDocumentoApiUrl);
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.rolesApiUrl);
  }
}