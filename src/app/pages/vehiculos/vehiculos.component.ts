// src/app/pages/vehiculos/vehiculos.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs'; // Importación de Observable
import { VehiculoService, vehiculo } from './servicios/vehiculo.service'; 

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class vehiculosComponent implements OnInit {
  listaVehiculos: vehiculo[] = [];
  listaFiltrada: vehiculo[] = [];
  vehiculo: vehiculo = this.crearVehiculoVacio();

  mostrarFormulario = false;
  modoEdicion = false; // Controla si estamos en modo edición o registro
  vehiculoEditandoId: number | null = null; // Guarda el ID del vehículo que se está editando

  filtroTexto: string = '';
  errorMessage: string | null = null; // Para mostrar mensajes de error en la UI

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  crearVehiculoVacio(): vehiculo {
    return {
      placa: '',
      marca: '',
      modelo: '',
      capacidad: 0
    };
  }

  /**
   * Carga la lista de vehículos desde el servicio.
   * Retorna un Observable para encadenar operaciones.
   */
  cargarVehiculos(): Observable<vehiculo[]> {
    this.errorMessage = null; // Limpiar errores al cargar la lista
    const obs = this.vehiculoService.listarVehiculos();
    obs.subscribe({
      next: data => {
        this.listaVehiculos = data;
        this.filtrarVehiculos(); // Aplicar filtro después de cargar
      },
      error: err => {
        console.error('Error al cargar vehículos:', err);
        this.errorMessage = 'Error al cargar la lista de vehículos. Por favor, intente de nuevo.';
      }
    });
    return obs; // Retornar el observable para encadenar
  }

  trackById(index: number, vehiculo: vehiculo): number | undefined {
    return vehiculo.idVehiculo;
  }

  // Método para abrir el formulario en modo nuevo registro
  abrirFormularioNuevo() {
    this.limpiarFormulario();
    this.mostrarFormulario = true;
    this.modoEdicion = false; // Establecer modo registro
    this.vehiculoEditandoId = null;
    this.errorMessage = null; // Limpiar errores
  }

  // Método para cerrar el formulario
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
    this.modoEdicion = false; // Restablecer modo
    this.vehiculoEditandoId = null;
    this.errorMessage = null; // Limpiar errores
  }

  // Método para limpiar los campos del formulario
  limpiarFormulario() {
    this.vehiculo = this.crearVehiculoVacio();
  }

  /**
   * Maneja el registro o actualización de un vehículo.
   * Este método se llama al enviar el formulario.
   */
  guardarVehiculo() {
    this.errorMessage = null; // Limpiar errores previos

    // Validación básica del lado del cliente
    if (!this.vehiculo.placa.trim() || !this.vehiculo.marca.trim() || !this.vehiculo.modelo.trim() || this.vehiculo.capacidad <= 0) {
      this.errorMessage = 'Por favor, complete todos los campos y asegúrese que la capacidad sea un número mayor a 0.';
      return;
    }

    if (this.modoEdicion) {
      // Lógica de actualización
      if (this.vehiculoEditandoId === null) {
        this.errorMessage = 'Error: ID del vehículo en edición no definido.';
        return;
      }
      this.vehiculo.idVehiculo = this.vehiculoEditandoId; // Asegurar que el ID esté en el objeto para la actualización

      this.vehiculoService.actualizarVehiculo(this.vehiculo).subscribe({
        next: (response) => {
          console.log(response.message);
          // Recargar la lista y luego cerrar el formulario
          this.cargarVehiculos().subscribe({
            next: () => this.cerrarFormulario(),
            error: (errList: HttpErrorResponse) => {
              console.error('Error al refrescar la lista después de actualizar:', errList);
              this.errorMessage = 'Vehículo actualizado, pero hubo un error al actualizar la lista. Recargue la página.';
              this.cerrarFormulario(); // Cerrar de todas formas
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar vehículo:', err);
          if (err.status === 409) {
            this.errorMessage = err.error.error || 'La placa ya está registrada para otro vehículo.';
          } else if (err.status === 404) {
            this.errorMessage = err.error.error || 'El vehículo o un recurso relacionado no fue encontrado.';
          } else if (err.status === 500) {
            this.errorMessage = err.error.error || 'Ocurrió un error interno al actualizar el vehículo.';
          } else {
            this.errorMessage = 'Error desconocido al actualizar vehículo.';
          }
        }
      });
    } else {
      // Lógica de registro nuevo
      const nuevoVehiculo = { ...this.vehiculo }; // Copia para evitar mutar el original
      delete nuevoVehiculo.idVehiculo; // Asegurar que no se envíe un ID para un nuevo registro

      this.vehiculoService.agregarVehiculo(nuevoVehiculo).subscribe({
        next: (response) => {
          console.log(response.message);
          // Recargar la lista y luego cerrar el formulario
          this.cargarVehiculos().subscribe({
            next: () => this.cerrarFormulario(),
            error: (errList: HttpErrorResponse) => {
              console.error('Error al refrescar la lista después de registrar:', errList);
              this.errorMessage = 'Vehículo registrado, pero hubo un error al actualizar la lista. Recargue la página.';
              this.cerrarFormulario(); // Cerrar de todas formas
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al registrar vehículo:', err);
          if (err.status === 409) {
            this.errorMessage = err.error.error || 'Ya existe un vehículo con esa placa.';
          } else if (err.status === 500) {
            this.errorMessage = err.error.error || 'Ocurrió un error interno al registrar el vehículo.';
          } else {
            this.errorMessage = 'Error desconocido al registrar vehículo.';
          }
        }
      });
    }
  }

  /**
   * Prepara el formulario para editar un vehículo existente.
   * @param vehiculoToEdit El objeto vehiculo a editar.
   */
  editarVehiculo(vehiculoToEdit: vehiculo) {
    this.errorMessage = null; // Limpiar errores
    this.modoEdicion = true; // Establecer modo edición
    this.mostrarFormulario = true;
    this.vehiculoEditandoId = vehiculoToEdit.idVehiculo!; // Guardar el ID para la actualización
    this.vehiculo = { ...vehiculoToEdit }; // Copiar todos los datos al formulario
  }

  /**
   * Elimina un vehículo.
   * @param id El ID del vehículo a eliminar.
   */
  eliminarVehiculo(id: number) {
    this.errorMessage = null; // Limpiar errores
    if (confirm(`¿Seguro que desea eliminar el vehículo con ID ${id}?`)) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: (response) => {
          console.log(response.message);
          // Recargar la lista después de eliminar
          this.cargarVehiculos().subscribe({
            next: () => console.log('Lista de vehículos actualizada después de eliminar.'),
            error: (errList: HttpErrorResponse) => {
              console.error('Error al refrescar la lista después de eliminar:', errList);
              this.errorMessage = 'Vehículo eliminado, pero hubo un error al actualizar la lista. Recargue la página.';
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al eliminar vehículo:', err);
          if (err.status === 404) {
            this.errorMessage = err.error.error || 'El vehículo no fue encontrado para eliminar.';
          } else if (err.status === 500) {
            this.errorMessage = err.error.error || 'Ocurrió un error interno al eliminar el vehículo.';
          } else {
            this.errorMessage = 'Error desconocido al eliminar vehículo.';
          }
        }
      });
    }
  }

  filtrarVehiculos() {
    const filtro = this.filtroTexto.toLowerCase();
    this.listaFiltrada = this.listaVehiculos.filter(v =>
      v.placa.toLowerCase().includes(filtro) ||
      v.marca.toLowerCase().includes(filtro) ||
      v.modelo.toLowerCase().includes(filtro)
    );
  }
}
