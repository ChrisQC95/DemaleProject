// src/app/pages/conductores/conductores.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// Importar Conductor, ConductorResponse y las interfaces de dropdown necesarias desde el servicio
import { Conductor, ConductorResponse, ConductorService, TipoDocumentoDropdown } from './servicios/conductor.service';


@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class conductoresComponent implements OnInit {
  listaConductores: ConductorResponse[] = [];
  listaFiltrada: ConductorResponse[] = [];
  conductor: Conductor = this.crearConductorVacio();

  mostrarFormulario = false;
  modoEdicion = false;
  conductorEditandoId: number | null = null;

  filtroTexto: string = '';
  errorMessage: string | null = null;

  // PROPIEDADES PARA LOS ARRAYS DE LOS DESPLEGABLES (Solo TipoDocumento)
  tiposDocumentoDropdown: TipoDocumentoDropdown[] = [];


  constructor(private conductorService: ConductorService) {}

  ngOnInit(): void {
    this.cargarConductores();
    this.cargarDropdowns(); // LLAMADA PARA CARGAR LOS DATOS DE LOS DESPLEGABLES (Solo los visibles)
  }

  /**
   * Carga los datos para los dropdowns visibles del formulario.
   */
  cargarDropdowns(): void {
    this.conductorService.getTiposDocumentoForDropdown().subscribe({
      next: data => this.tiposDocumentoDropdown = data,
      error: err => console.error('Error cargando tipos de documento:', err)
    });

    // Las llamadas para TipoVia y Distrito se omiten aquí, ya que no se muestran en el HTML
  }

  /**
   * Carga la lista de conductores desde el servicio.
   * Retorna un Observable para encadenar operaciones.
   */
  cargarConductores(): Observable<ConductorResponse[]> {
    this.errorMessage = null;
    const obs = this.conductorService.listarConductores();
    obs.subscribe({
      next: data => {
        this.listaConductores = data;
        this.filtrarConductores(); // Aplicar filtro después de cargar
      },
      error: err => {
        console.error('Error al cargar conductores:', err);
        this.errorMessage = 'Error al cargar la lista de conductores. Por favor, intente de nuevo.';
      }
    });
    return obs;
  }

  crearConductorVacio(): Conductor {
    return {
      nombres: '',
      apellidos: '',
      razonSocial: '',
      numeroDocumento: '',
      telefono: '',
      correo: '',
      direccion: '',
      nMunicipal: '',
      idDistrito: null, // Se mantiene para compatibilidad con backend, inicializado a null
      idTipoVia: null, // Se mantiene para compatibilidad con backend, inicializado a null
      idTipoDoc: null, // Valor inicial nulo para select
      licencia: '',
      idRol: 3 // SIEMPRE 3 (Conductor)
    };
  }

  trackById(index: number, conductor: ConductorResponse): number | undefined {
    return conductor.idPersona;
  }

  nuevo(): void {
    this.conductor = this.crearConductorVacio();
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.conductorEditandoId = null;
    this.errorMessage = null;
  }

  cerrar(): void {
    this.mostrarFormulario = false;
    this.conductor = this.crearConductorVacio();
    this.modoEdicion = false;
    this.conductorEditandoId = null;
    this.errorMessage = null;
  }

  guardar(): void {
    this.errorMessage = null;

    if (!this.conductor.nombres || !this.conductor.apellidos || !this.conductor.numeroDocumento ||
        !this.conductor.telefono || !this.conductor.correo || !this.conductor.licencia ||
        this.conductor.idTipoDoc === null) {
      this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      return;
    }

    // Asegurarse de que idRol siempre sea 3 antes de enviar al backend
    this.conductor.idRol = 3;

    let saveUpdateObservable: Observable<any>;

    if (this.modoEdicion && this.conductorEditandoId) {
      saveUpdateObservable = this.conductorService.actualizarConductor(this.conductorEditandoId, this.conductor);
    } else {
      saveUpdateObservable = this.conductorService.registrarConductor(this.conductor);
    }

    saveUpdateObservable.subscribe({
      next: (response) => {
        console.log(response.message);
        // PRIMERO: Recargar la lista
        this.cargarConductores().subscribe({
          next: () => {
            console.log('Lista de conductores actualizada después de la operación.');
            this.cerrar(); // SEGUNDO: Cerrar el formulario SOLO DESPUÉS de que la lista se haya actualizado
          },
          error: (errList: HttpErrorResponse) => {
            console.error('Error al refrescar la lista después de la operación:', errList);
            this.errorMessage = 'Operación exitosa, pero hubo un error al actualizar la lista. Recargue la página.';
            this.cerrar(); // Cerrar de todas formas si hay error en la recarga
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error en la operación de guardar/actualizar conductor:', err);
        if (err.status === 409) {
          this.errorMessage = err.error.error || 'Ya existe un conductor con ese DNI o licencia.';
        } else if (err.status === 404) {
           this.errorMessage = err.error.error || 'Alguno de los recursos relacionados (Tipo de Documento) no fue encontrado.';
        } else if (err.status === 500) {
          this.errorMessage = err.error.error || 'Ocurrió un error interno al procesar el conductor. Por favor, intente de nuevo más tarde.';
        } else {
          this.errorMessage = 'Error desconocido al procesar conductor.';
        }
      }
    });
  }

  /**
   * Prepara el formulario para editar un conductor existente.
   * @param conductorToEdit El objeto ConductorResponse a editar.
   */
  editar(conductorToEdit: ConductorResponse): void {
    this.errorMessage = null;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.conductorEditandoId = conductorToEdit.idPersona;
    this.conductor = {
      idPersona: conductorToEdit.idPersona,
      nombres: conductorToEdit.nombres,
      apellidos: conductorToEdit.apellidos,
      razonSocial: conductorToEdit.razonSocial,
      numeroDocumento: conductorToEdit.numeroDocumento,
      telefono: conductorToEdit.celular,
      correo: conductorToEdit.correo,
      direccion: conductorToEdit.direccion,
      nMunicipal: conductorToEdit.nMunicipal,
      idDistrito: conductorToEdit.idDistrito || null,
      idTipoVia: conductorToEdit.idTipoVia || null,
      idTipoDoc: conductorToEdit.idTipoDoc,
      licencia: conductorToEdit.licencia,
      idRol: conductorToEdit.idRol // Se mapea el rol existente, pero al guardar se forzará a 3
    };
  }

  /**
   * Elimina un conductor.
   * @param id El ID del conductor a eliminar.
   */
  eliminar(id: number): void {
    this.errorMessage = null;
    if (confirm("¿Seguro que deseas eliminar este conductor?")) {
      this.conductorService.eliminarConductor(id).subscribe({
        next: (response) => {
          console.log(response.message);
          this.cargarConductores().subscribe({
            next: () => console.log('Lista de conductores actualizada después de eliminar.'),
            error: (errList: HttpErrorResponse) => {
              console.error('Error al refrescar la lista después de eliminar:', errList);
              this.errorMessage = 'Conductor eliminado, pero hubo un error al actualizar la lista. Recargue la página.';
            }
          });
        },
        error: err => {
          console.error('Error eliminando conductor:', err);
          this.errorMessage = 'Error al eliminar conductor. Por favor, intente de nuevo.';
        }
      });
    }
  }

  /**
   * Filtra la lista de conductores basándose en el texto de búsqueda.
   */
  filtrarConductores() {
    const filtro = this.filtroTexto.toLowerCase();
    this.listaFiltrada = this.listaConductores.filter(c =>
      (c.nombres && c.nombres.toLowerCase().includes(filtro)) ||
      (c.apellidos && c.apellidos.toLowerCase().includes(filtro)) ||
      (c.numeroDocumento && c.numeroDocumento.toLowerCase().includes(filtro)) ||
      (c.licencia && c.licencia.toLowerCase().includes(filtro)) ||
      (c.razonSocial && c.razonSocial.toLowerCase().includes(filtro))
    );
  }
}
