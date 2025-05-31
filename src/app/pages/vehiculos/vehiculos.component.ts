import { Component, OnInit } from '@angular/core';
import { VehiculoService, Vehiculo } from './servicios/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  listaVehiculos: Vehiculo[] = [];
  listaFiltrada: Vehiculo[] = [];
  vehiculo: Vehiculo = this.crearVehiculoVacio();

  mostrarFormulario = false;
  editarIndex: number | null = null;

  filtroTexto: string = '';

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  crearVehiculoVacio(): Vehiculo {
    return {
      placa: '',
      marca: '',
      modelo: '',
      capacidad: 0
    };
  }

  cargarVehiculos() {
    this.vehiculoService.listarVehiculos().subscribe(data => {
      console.log('Vehículos cargados:', data);
      this.listaVehiculos = data;
      this.filtrarVehiculos();
    });
  }

  trackById(index: number, vehiculo: Vehiculo): number {
    return vehiculo.IdVehiculo!;
  }

  abrirFormulario() {
    this.limpiarFormulario();
    this.mostrarFormulario = true;
    this.editarIndex = null;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
    this.editarIndex = null;
  }

  limpiarFormulario() {
    this.vehiculo = this.crearVehiculoVacio();
  }

  registrarVehiculo() {
    console.log('Registrando/actualizando vehículo:', this.vehiculo);
    console.log('Editar índice:', this.editarIndex);

    if (
      this.vehiculo.placa.trim() &&
      this.vehiculo.marca.trim() &&
      this.vehiculo.modelo.trim() &&
      this.vehiculo.capacidad > 0
    ) {
      if (this.editarIndex !== null && this.listaVehiculos[this.editarIndex].IdVehiculo) {
        // Edición
        this.vehiculo.IdVehiculo = this.listaVehiculos[this.editarIndex].IdVehiculo!;
        this.vehiculoService.actualizarVehiculo(this.vehiculo).subscribe({
          next: (vehActualizado) => {
            this.listaVehiculos[this.editarIndex!] = vehActualizado;
            this.filtrarVehiculos();
            this.cerrarFormulario();
          },
          error: (err) => {
            alert('Error al actualizar vehículo');
            console.error(err);
          }
        });
      } else {
        // Registro nuevo
        const nuevoVehiculo = { ...this.vehiculo };
        delete nuevoVehiculo.IdVehiculo;
        this.vehiculoService.agregarVehiculo(nuevoVehiculo).subscribe({
          next: (vehRegistrado) => {
            this.listaVehiculos.push(vehRegistrado);
            this.filtrarVehiculos();
            this.cerrarFormulario();
          },
          error: (err) => {
            alert('Error al registrar vehículo');
            console.error(err);
          }
        });
      }
    } else {
      alert('Por favor complete todos los campos correctamente');
    }
  }

  editarVehiculo(index: number) {
    const vehiculoFiltrado = this.listaFiltrada[index];
    if (!vehiculoFiltrado) {
      alert('Vehículo no encontrado para editar');
      return;
    }
    this.editarIndex = this.listaVehiculos.findIndex(
      v => v.IdVehiculo === vehiculoFiltrado.IdVehiculo
    );
    this.vehiculo = { ...vehiculoFiltrado };
    this.mostrarFormulario = true;
  }

  eliminarVehiculo(index: number) {
    const vehiculoFiltrado = this.listaFiltrada[index];
    if (!vehiculoFiltrado || !vehiculoFiltrado.IdVehiculo) {
      alert('Vehículo no encontrado para eliminar');
      return;
    }
    if (confirm(`¿Seguro que desea eliminar el vehículo ${vehiculoFiltrado.placa}?`)) {
      this.vehiculoService.eliminarVehiculo(vehiculoFiltrado.IdVehiculo).subscribe({
        next: () => {
          this.listaVehiculos = this.listaVehiculos.filter(v => v.IdVehiculo !== vehiculoFiltrado.IdVehiculo);
          this.filtrarVehiculos();
        },
        error: (err) => {
          alert('Error al eliminar vehículo');
          console.error(err);
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



